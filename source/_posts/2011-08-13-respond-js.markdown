---
layout: post
title: "Respond.js"
date: 2011-08-13 20:24
comments: true
categories: [javascript, css, polyfill]
---

In [a previous post](/2010/12/09/css-media-queries/ "CSS Media Queries"), due to a lack of browser support for CSS media queries (in both mobile and desktop browsers), I came to the unfortunate conclusion that&hellip;

> Whether you baseline for desktop and use media queries to dynamically assign styles for mobile, or you baseline for mobile and use media queries to dynamically assign styles for desktop, you're going to leave a non-trivial number of browsers out in the cold.

### Respond

And then came [Respond.js](https://github.com/scottjehl/Respond "scottjehl/Respond at master (github.com)").

<!--more-->

Respond is a JavaScript library that adds support for `min-` and `max-width` CSS media queries in browsers that do not natively support media queries, such as IE 6, 7, and 8. (You know&hellip;that [sadly] gigantic slice of the browser usage pie chart.) In browsers that *do* support media queries, Respond quickly exits, without adding any cycle-sucking event hooks and lets the browser do its own thing.

Respond isn't one-of-a-kind, though it does appear to be the most light-weight in its category at 3kb minified. I first heard about Respond when it was included in version 2 of the [HTML5 Boilerplate](http://html5boilerplate.com/#v2 "HTML5 Boilerplate is 2.0! (html5boilerplate.com)"). Respond alternatives include [css3-mediaqueries-js](http://code.google.com/p/css3-mediaqueries-js/ "css3-mediaqueries-js (code.google.com)"), which&mdash;while more feature-rich than Respond&mdash;weighs in at around 14kb minified.

To use Respond, include the script in your `head` after the last `link[rel=stylesheet]` element. The usual best practice is to include scripts at the bottom of the page, but this one needs to be included in the `head` because you want it to run before any of the page renders. If stylesheets are referenced at the end of the body, the body gets rendered and then re-rendered when the stylesheet gets applied (an effect known as Flash of Unstyled Content, or FOUC). A similar effect would happen if you referenced Respond at the bottom of your page, because your base styles would load and then Respond would execute and possibly cause the page to re-render if media queries came into play.

### Demo

Click [here](/demos/2011-08-13-respond-js.1.html) to see the demo page from the previous post *without* Respond. If you open it in a browser that does not support media queries, you'll only get the full-width experience. Sad face.

Click [here](/demos/2011-08-13-respond-js.2.html) to see the demo page from the previous post *with* Respond. In all browsers, you should see the page respond (get it?) as you resize.

### Downsides

Yes, there are a few downsides :(

1. Respond has to parse referenced stylesheets to determine whether or not they contain media queries.
   1. The DOM doesn't provide any way for developers to access the contents of `style`-element stylesheets or `link`-element referenced stylesheets. Respond can't touch `style` elements, then, but can get to `link` stylesheets by looking for `link` elements and re-requesting the files they reference. That is, Respond only supports `link`, no `style`.
   2. Respond has to re-request each stylesheet via AJAX. Which means that local, `file://` protocol testing won't work in browsers that don't support local AJAX, like Chrome.
   3. And because each stylesheet is re-requested, you better have a stingy caching policy in place. Otherwise, every stylesheet will mean two HTTP round trips and possibly two full file downloads. If you don't have a decent caching policy in place, I daresay Respond isn't worth the performance hit. But, if you don't have a good caching policy in place, be a good internet citizen and come up with one.
2. For some reason, you have to specify a media type in your queries. That is, the following works:
   <p class="gist"><a href="http://gist.github.com/1145327#file_respond_js.1.css" data-file="respondJs.1.css">http://gist.github.com/1145327#file_respond_js.1.css</a></p>
   &hellip;while the following does not:
   <p class="gist"><a href="http://gist.github.com/1145327#file_respond_js.2.css" data-file="respondJs.2.css">http://gist.github.com/1145327#file_respond_js.2.css</a></p>
3. It only supports `px`-based units in the `min-` and `max-width` values of your media queries. No `em` support.
4. The basic mechanism behind Respond is an event handler that fires when the browser resizes, then conditionally adding stylesheets to or removing stylesheets from the page. So you may see performance issues on slower machines and/or in older browsers.

And while not specifically a downside of Respond, something else to keep in mind is that beyond Respond's basic support for `min-` and `max-width` media queries, you are still bound to each specific browser's CSS implementation. You don't get the benefit of certain features that are usually implemented along with media queries&mdash;namely CSS transitions&mdash;that aren't natively supported.

### Conclusion

Despite the downsides, Respond looks very promising. I can't wait to implement it on a wider scale, both personally and professionally.