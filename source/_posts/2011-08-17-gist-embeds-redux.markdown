---
layout: post
title: "Gist Embeds Redux"
date: 2011-08-17 20:54
comments: true
categories: [gist, github, javascript, jquery]
---
When this blog was still on Tumblr, I blogged about [embedding GitHub Gists in Tumblr posts](/2010/10/20/embedding-github-gists-in-tumblr-posts/ "Embedding GitHub Gists in Tumblr Posts"). Doing so has a few advantages:

1. You don't have to sprinkle `script` tags throughout your `body`. You just include links (`a`-style) to your Gists and then a single script&mdash;referenced at the bottom of the document&mdash;does all the magic.
2. You don't have to include the default Gist stylesheet at all if you don't want to. This is useful if your Gist styles are different and you don't want to worry about using `!important` or making sure your selectors are more specific than theirs.
3. If the user has JavaScript disabled, they still see a link to the Gist.

Back in those days, if I wanted a Gist in a post, I would make a new Gist for every piece of code I wanted to include. That got ugly, though, so I decided I would start making a single multi-file Gist per post, where each "file" was a separate piece of code to be used in the post. This required a few changes to the script.

<!--more-->

### The Basics

I won't include the previous script in this post, but you can [get the Gist](https://gist.github.com/637764 "gist: 637764 (gist.github.com)"). Basically what it does is look for paragraphs with a "gist" class that have Gist links in them. Something like:

<p class="gist"><a href="http://gist.github.com/1153272#file_usage_before.html" data-file="usageBefore.html">Gist 1153272: usageBefore.html</a></p>

Once it finds them, it turns the Gist webpage URL into a script URL for the corresponding Gist inclusion script and then replaces the paragraph with what the script would have written there. (And since it's just a plain old link [instead of a `script`], users with JavaScript disabled will still see a link to the Gist.) You can read my [previous post](/2010/10/20/embedding-github-gists-in-tumblr-posts/ "Embedding GitHub Gists in Tumblr Posts") if you want more details on how the script actually works.

### The Changes

Both the webpage URLs and script URLs are capable of specifying a specific file within a Gist. For the webpage URLs, it's just an anchor so that the browser scrolls to that file within the Gist. For the script URLs, it reduces the output of the script's `document.write`s to that specific file.

So I basically needed to update my script's logic to respect the file specification.

One small problem is that the two different URL formats have different formats for the filenames and they're not interchangable. So, for example, say I have a Gist whose ID is `123` and it contains a file called `firstFile.js`. The webpage URL for that Gist and that specific file would be `http://gist.github.com/123#file_first_file.js`. The corresponding script URL would be `http://gist.github.com/123.js?file=firstFile.js`. Notice the difference in the filenames. The webpage URL replaces capital letters with an underscore and then the lowercase letter (`first_file.js`). While the script URL uses the original name (`firstFile.js`). And like I said before, they're not interchangable: you can't use the script URL format in webpage URLs or vice versa.

I got around this by adding a `data-file` attribute to the link to specify the filename to use when creating the script URL. So to include the example Gist above, your markup would look like:

<p class="gist"><a href="http://gist.github.com/1153272#file_usage_after.html" data-file="usageAfter.html">Gist 1153272: usageAfter.html</a></p>

### The Result

So JavaScript-less users still see a valid link to the specific file. Otherwise, the script knows which file to request based on the `data-file` attribute. The script doesn't have to worry about converting one filename format to the other. No thanks.

The script:

<p class="gist"><a href="http://gist.github.com/1153272#file_gist.js" data-file="gist.js">Gist 1153272: gist.js</a></p>