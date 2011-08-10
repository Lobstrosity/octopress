---
layout: post
title: "CSS Media Queries"
date: 2010-12-09 17:54
categories: [html, css, media-queries]
---

Open up [www.colly.com](http://www.colly.com "Simon Collison (www.colly.com)") or [lanyrd.com](http://lanyrd.com "Lanyrd (lanyrd.com)") and (assuming you're using a modern browser) watch what happens as you resize your browser window. As the window size changes, the page's layout morphs to accomodate the window size. CSS includes a nice feature to target styles to particular media metrics, width being one of them. In real-time, the browser will apply different styles based on the various queries defined in the stylesheet. It's an incredibly useful feature for targeting your style not only to smaller desktop browsers but to mobile devices as well.

<!--more-->

### Syntax

The query syntax can be specified either as an attribute of the stylesheet-referencing link elements (so that entire stylesheets are applied) or within stylesheets (so that groups of rules can be applied):

<p class="gist"><a href="http://gist.github.com/1135710#file_1.css_media_queries.html" data-file="1.cssMediaQueries.html">http://gist.github.com/1135710#file_1.css_media_queries.html</a></p>

You can specify multiple criteria with the `and` keyword. So there's no limit to the number of levels you could setup:

<p class="gist"><a href="http://gist.github.com/1135710#file_2.css_media_queries.html" data-file="2.cssMediaQueries.html">http://gist.github.com/1135710#file_2.css_media_queries.html</a></p>

`min-width: X px` is equivalent to saying `width >= X` and `max-width: X px` is equivalent to saying `width <= X`. So be mindful that if one query is for `max-width: 320px` and another is for `min-width: 320px`, they both pass if the browser is exactly 320 pixels wide.

### Width vs. Device-Width

Mobile browsers, however, typically don't report their actual width for `width`. For example, the iPhone, whose screen is either 320 pixels wide (for iPhone 3GS and below) or 640 pixels wide (for iPhone 4) reports a width value closer to 1000. Which means a query for `max-width: 320px` on the iPhone would fail miserably.

Luckily there's another property, `device-width`, that gets us a bit closer. `device-width` isn't necessarily equal to the actual pixel width of the device screen. It's an optimized value. For example, all models of the iPhone report a `device-width` of 320.

You don't want to use `min-device-width` or `max-device-width` in your queries, though, because the browser will still render the page as wide as the value of `device-width`. So if you used `device-width` queries on an iPhone and made your content 320 pixels wide, the content would be 320 pixels wide in a viewport that is still ~1000 pixels wide, giving you a huge gutter.

But there's a way around these issues:

<p class="gist"><a href="http://gist.github.com/1135710#file_3.css_media_queries.html" data-file="3.cssMediaQueries.html">http://gist.github.com/1135710#file_3.css_media_queries.html</a></p>

This directive tells the browser to set its viewport's width to the value of `device-width`. You would then query against `min-width` and `max-width` (as opposed to `min-device-width` or `max-device-width`).

### Getting Fancy with Transitions

If you resize lanyrd.com (and are using a supporting browser), you'll notice that certain elements (most noticeably the white box logo and the "Lanyrd buzz" speech bubbles) don't snap to a new style but animate smoothly to the new settings.

This is done by setting [CSS transitions](http://www.w3.org/TR/css3-transitions/ "CSS Transitions Module Level 3 (www.w3.org)") on the settings that change for those elements from one style to the next. So if you had a wrapper div and you wanted its width to have an animated transition when it changed instead of snapping, you'd use something like:

<p class="gist"><a href="http://gist.github.com/1135710#file_4.css_media_queries.html" data-file="4.cssMediaQueries.html">http://gist.github.com/1135710#file_4.css_media_queries.html</a></p>

### Putting It All Together

For brevity's sake, I won't post all the code here but you can view the source of the [demo page](/demos/2010-12-09-css-media-queries.html).

### Minimizing HTTP Requests

All stylesheets are downloaded by the browser regardless of the outcome of media queries, which means using queries to target specific media won't prevent HTTP requests when the query fails.

If, however, you use media queries to assign a background image, for example, and you have a large version and a small version, browsers will not download an image referenced in a stylesheet until there is an element that the rule's selector applies to. So you do prevent HTTP requests in that case. (This isn't a feature of media queries. It's default browser behavior. It does come in handy when combined with media queries, though.)

### Progressive Enhancement

Progressive enhancement evangelists [will tell you](http://www.slideshare.net/bryanrieger/rethinking-the-mobile-web-by-yiibu "Rethinking the Mobile Web by Yiibu (www.slideshare.net)") that your website's default styles should be its absolute baseline styles and that the page should build on those according to feature availability. (This usually gets translated as "design for mobile and dynamically enhance the page for a desktop experience instead of the other way around.")

CSS media queries sound like a great way to handle that&hellip; And they would be&hellip; If all browsers supported them&hellip;

IE9 will be the first version of IE to support media queries. So if your default styles were for mobile and you used media queries to add desktop styles, [roughly 50%](http://gs.statcounter.com/#browser-ww-monthly-201006-201011-bar "StatCounter Global Stats (gs.statcounter.com)") of desktop browsers wouldn't be able to handle it. And I'm sure that there are plenty of mobile browsers out there that don't support media queries yet, either.

Which leads to an unforunate conclusion if you want to rely solely on media queries: Whether you baseline for desktop and use media queries to dynamically assign styles for mobile, or you baseline for mobile and use media queries to dynamically assign styles for desktop, you're going to leave a non-trivial number of browsers out in the cold.