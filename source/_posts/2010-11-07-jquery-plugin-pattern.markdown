---
layout: post
title: "jQuery Plugin Pattern"
date: 2010-11-07 17:31
categories: [javascript, jquery, plugin, patterns]
---
This post is a followup to a previous post, [JavaScript Module Pattern](/2010/10/30/javascript-module-pattern/ "JavaScript Module Pattern"). [jQuery's documentation](http://docs.jquery.com/Plugins/Authoring "Plugins/Authoring (docs.jquery.com)") encourages developers to use JavaScript's module pattern to create jQuery plugins. See the previous post if you're unfamiliar with the module pattern. jQuery itself is passed to the function as its module parameter, typically as `$`. Plugins are defined within the module function by declaring functions on the `$` or `$.fn` objects. Functions declared on `$` are selector-independent and can return whatever the developer chooses. Functions declared on `$.fn` are selector-dependent and should return a jQuery object to maintain jQuery's chainability.

As an example, here's a plugin that provides enable and disable functionality for form controls:

<p class="gist"><a href="https://gist.github.com/1135651#file_1.jquery_plugin_pattern.js" data-file="1.jqueryPluginPattern.js">https://gist.github.com/1135651#file_1.jquery_plugin_pattern.js</a></p>

By creating closure around `$`, the plugin can refer to jQuery using `$`, even if scripts previously loaded in the page overwrote `$` for some reason. It also won't overwrite that other developer's `$` object. You're protected from their `$` and vice versa.

Within the functions, `this` will refer to the jQuery object on which the function was invoked.

The two plugin functions take advantage of jQuery's `each` function to iterate the set of selected elements, operate on each one in turn, then return the elements to maintain jQuery's chainability.

Notice in `disable` that within the each call, only elements that match the ':input' criteria are disabled. I could have saved a couple lines of code and done the filtering by chaining it to the `each` call:

<p class="gist"><a href="https://gist.github.com/1135651#file_2.jquery_plugin_pattern.js" data-file="2.jqueryPluginPattern.js">https://gist.github.com/1135651#file_2.jquery_plugin_pattern.js</a></p>

But then only the matching elements would have been returned by `disable`. Sometimes you want your plugin to filter elements and only return certain ones. This is not one of those cases. Be mindful that the set of elements you want your plugin to operate on and the set of elements it should return aren't necessarily the same.