---
layout: post
title: "Using Arrays in Templates"
date: 2010-12-14 19:56
categories: [jquery, templates, tmpl, arrays]
---
According to the official documentation, [`.tmpl()`](http://api.jquery.com/tmpl/ ".tmpl() - jQuery API (api.jquery.com)")'s data parameter&hellip;

> &hellip;can be any JavaScript type, including Array or Object.

<!--more-->

The typical case would be to pass an object. This allows you to refer to the properties of that object by name in the template. [Demo](/demos/2010-12-14-using-arrays-in-templates.1.html):

<p class="gist"><a href="http://gist.github.com/1135981#file_using_arrays_as_templates.1.html" data-file="usingArraysAsTemplates.1.html">http://gist.github.com/1135981#file_using_arrays_as_templates.1.html</a></p>

Another typical case would be to pass an object that contains an array of values (not objects). [Demo](/demos/2010-12-14-using-arrays-in-templates.2.html):

<p class="gist"><a href="http://gist.github.com/1135981#file_using_arrays_as_templates.2.html" data-file="usingArraysAsTemplates.2.html">http://gist.github.com/1135981#file_using_arrays_as_templates.2.html</a></p>

{% assign eachTag = '{{each}}' %}

The syntax for `{{ eachTag }}` gives the current value an accessible name: `$value`. That convention does not exist, however, outside of `{{ eachTag }}` and the documentation does not describe the syntax for accessing the current value of an array when the array is the root data item. After looking through the source for the plugin and playing with `$item`, I found that you can do it as follows. [Demo](/demos/2010-12-14-using-arrays-in-templates.3.html):

<p class="gist"><a href="http://gist.github.com/1135981#file_using_arrays_as_templates.3.html" data-file="usingArraysAsTemplates.3.html">http://gist.github.com/1135981#file_using_arrays_as_templates.3.html</a></p>

`$item.data` contains the data that the current template is acting on. It refers to the same value throughout a template. It doesn't, for example, refer to the current item in an `{{ eachTag }}` iteration. Keep in mind, though, that if `.tmpl()` is called with an array, the template is rendered once for each item in the array, which is why, in the above example, `$item.data` refers to each individual value, not to the array that was passed in.

Another example requiring the `$item.data` syntax is when `.tmpl()` is called with an object, but the object contains an array of values that will be passed to a nested template. [Demo](/demos/2010-12-14-using-arrays-in-templates.4.html):

<p class="gist"><a href="http://gist.github.com/1135981#file_using_arrays_as_templates.4.html" data-file="usingArraysAsTemplates.4.html">http://gist.github.com/1135981#file_using_arrays_as_templates.4.html</a></p>