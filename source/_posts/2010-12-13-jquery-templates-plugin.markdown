---
layout: post
title: "jQuery Templates Plugin"
date: 2010-12-13 19:25
categories: [jquery, templates, tmpl]
---
### Requirements

jQuery Templates is a plugin to jQuery (requiring at least version 1.4.2), so your page will need to reference both jQuery and the templates plugin (in that order).

<!--more-->

### `script type="text/x-jquery-tmpl"`

Templates should be created as the contents of a `script` tag with any `type` other than `text/javascript`. You don't have to use `script` tags, but browsers completely ignore `script` tags if the `type` is not `text/javascript` and it's likely that your template will contain text that would be parsed as invalid HTML (breaking your page), so it's best if you let the browser ignore it. Note that `text/javascript` is the default type of a `script` tag if you don't specify one, so a `type` must be specified. It doesn't matter what `type` you specify, though I would encourage consistency. You'll also want to give the `script` tag an `id` for easy referencing.

### `.tmpl([ data ], [ options ])`

Both parameters to [`tmpl()`](http://api.jquery.com/tmpl/ ".tmpl() - jQuery API (api.jquery.com)") are optional, though I can't think of a practical example for not passing a `data` parameter.

`data` can be any JavaScript type. If `data` is an array, the template will be rendered once for each item in the array. Otherwise (including if `data` is missing), the template will be rendered once.

`options` is an object that contains properties and methods. There is a value named `$item` that can be accessed in templates. It contains certain properties and methods defined by the plugin, but if `options` is specified, `$item` will be extended with `options`' properties and methods. That's all I'll say about `options`&hellip;

Note that since `data` can be any type, if you want to specify `options` but not `data`, you'll still have to pass something (`null`, `undefined`, etc.) in `data`'s place.

`tmpl()` returns a jQuery collection of elements so it can be easily passed to any of the jQuery DOM insertion methods (`html()`, `appendTo()`, etc.).

### Template Tags

{% assign ifTag = '{{if}}' %}
{% assign ifTagWithExpression = '{{if expression}}' %}
{% assign elseTag = '{{else}}' %}
{% assign ifEndTag = '{{/if}}' %}
{% assign eachTag = '{{each}}' %}
{% assign eachEndTag = '{{/each}}' %}
{% assign eachTagWithItems = '{{each items}}' %}

jQuery Templates includes a few tags for rendering data. Among others, it includes `${}`, `{{ ifTag }}` and `{{ elseTag}}`, and `{{ eachTag }}`.

### `${}`

The `${}` tag is used for rendering content from the data passed to the template. `${}` has no closing tag. If the template is currently rendering an object (let's call it `user`), then `${name}` would render the value of `user.name`, `${emailAddress}` would render the value of `user.emailAddress`, and so on. If the template is currently rendering a value, `${$value}` would render the value.

### `{{ ifTag}}` and `{{ elseTag }}`

The `{{ ifTag}}` tag requires a closing `{{ ifEndTag }}` tag. `{{ ifTag}}` takes a parameter that is the expression to evaluate in the form of `{{ ifTagWithExpression }}`. `{{ elseTag }}` does not have a closing tag. The closing `{{ ifEndTag }}` or a new `{{ elseTag }}` closes the previous `{{ elseTag }}`. `{{ elseTag }}` can be given an optional `expression` parameter which will make it behave like `else if`.

### `{{ eachTag }}`

The `{{ eachTag }}` tag is used for iterating over an array. It has a closing `{{ eachEndTag }}` tag. Everything between the two is rendered once for each item in the array. `{{ eachTag }}` takes the array to be iterated as a parameter. If the array is called `items`, it would be passed as `{{ eachTagWithItems }}`.

Within the `{{ eachTag }}` tag, `$value` and `$index` refer to the current value and the index of the current value, respectively. There is optional syntax that allows you to rename `$index` and `$value`:

<p class="gist"><a href="http://gist.github.com/1135937#file_1.jquery_templates.html" data-file="1.jqueryTemplates.html">http://gist.github.com/1135937#file_1.jquery_templates.html</a></p>

### Altogether Now

The code below can be viewed as a demo [here](/demos/2010-12-13-jquery-templates-plugin.html).

<p class="gist"><a href="http://gist.github.com/1135937#file_2.jquery_templates.html" data-file="2.jqueryTemplates.html">http://gist.github.com/1135937#file_2.jquery_templates.html</a></p>
