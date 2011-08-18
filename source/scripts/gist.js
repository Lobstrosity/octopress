var gistPrefix = 'http://gist.github.com/',

	fileAnchorPrefix = '#file_',
	
	// Cache document.write so that it can be restored once all Gists have been
	// embedded.
	cachedWrite = document.write,

	body = $('body'),

	// Map each p.gist to an object that contains the paragraph to be replaced,
	// the Gist's identifier, and the file name (if specified).
	gists = $('p.gist').map(function(n, p) {
		p = $(p);

		var a = $('a', p),
			href = a.attr('href'),
			parts;

		// Only return the mapping if a valid a exists in the p.
		if (a.length && href.indexOf(gistPrefix) == 0) {
			parts = href.substring(gistPrefix.length).split(fileAnchorPrefix);

			return {
				p: p,
				id: parts[0],
				file: a.data('file')
			};
		}
		else {
			return undefined;
		}
	}).get(),
	
	embedNextGist = function() {
		// If there are no more Gists to embed, restore document.write.
		if (gists.length == 0) {
			document.write = cachedWrite;
		}
		else {
			var gist = gists.shift();

			// The Gist javascript file consists of a call to document.write to
			// write the stylesheet link element and a second call to
			// document.write to write the div containing the marked up Gist.

			// So, override document.write to catch the first call. And inside
			// that override, override document.write again to catch the second
			// call.

			document.write = function(styleLink) {
				// I have a slightly modified version of GitHub's Gist
				// stylesheet already included in my page template, so I ignore
				// stylesheet written here. If you don't want to do that, you
				// could do something here like $('head').append(styleLink);

				document.write = function(gistDiv) {
					// Replace the original paragraph with the formatted div
					// written by the Gist javascript file.
					gist.p.replaceWith(gistDiv);

					embedNextGist();
				};
			};

			body.append(
				'<scr' + 'ipt src="' + gistPrefix + gist.id + '.js' +
					(gist.file ? '?file=' + gist.file : '') + '"></scr' + 'ipt>'
			);
		}
	};

// One call to embedNextGist to get the ball rolling.
embedNextGist();
