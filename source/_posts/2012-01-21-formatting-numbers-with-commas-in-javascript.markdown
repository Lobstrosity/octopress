---
layout: post
title: "Formatting Numbers With Commas in JavaScript"
date: 2012-01-21 14:31
comments: true
categories: [javascript, formatting]
---
It seems every JavaScript blogger out there has his or her own post with a solution for formatting numbers to insert commas. So here are my obligatory two cents.

<p class="gist"><a href="http://gist.github.com/1654123#file_commafy.1.js" data-file="commafy.1.js">Gist 1654123: commafy.1.js</a></p>

I'll try to set my post apart slightly by providing a detailed explanation.

<!--more-->

### The Regular Expression

Since JavaScript is notoriously terrible when it comes to arithmetic and precision, the original value is treated as a string throughout. No division by 1000 or anything like that to determine the parts to join.

The regular expression consists of two (top-level) captured patterns, which represent the two pieces of the orignal value that will be joined with a comma.

1. The first pattern, `(-?\d+)`, captures any number of digits, optionally preceded by a negative sign.
2. The second pattern, `(\d{3}(\.\d+)?)`, captures exactly three digits, optionally followed by a decimal point then one or more digits.

The overall pattern is bracketed by `^` and `$` (start-of-value and end-of-value matchers), which means that all characters in the original value are captured. This helps ensure that the pattern only matches valid inputs (positive and negative integers and floats).

### The Replace

The regular expression is used in `String`'s `replace` function. The other parameter to replace is a callback that accepts the captured patterns from matching the value with the regular expression.

Note that if the pattern matches the value, `String.replace` will return the callback's return value. Otherwise, it will return the original string. So, calling `'abcd'.commafy()` will just return `'abcd'` (as opposed to throwing an error or returning garbage like `'a,bcd'`).

### The Callback

The first value in a match (and the first parameter to the callback) is the original string being matched, which we don't need. That's the `_` parameter. You can forget it exists. The first captured pattern (optional negative sign then one or more digits) is `a`. The second captured pattern (three digits then the optional decimal part) is `b`.

The callback is only adding a single comma, though. Large numbers that need multiple commas are handled by recursively commafying the first captured pattern.

### Step Through

<p class="gist"><a href="http://gist.github.com/1654123#file_commafy.stepThrough.1.js" data-file="commafy.stepThrough.1.js">Gist 1654123: commafy.stepThrough.1.js</a></p>

leads to

<p class="gist"><a href="http://gist.github.com/1654123#file_commafy.stepThrough.2.js" data-file="commafy.stepThrough.2.js">Gist 1654123: commafy.stepThrough.2.js</a></p>

which leads to

<p class="gist"><a href="http://gist.github.com/1654123#file_commafy.stepThrough.3.js" data-file="commafy.stepThrough.3.js">Gist 1654123: commafy.stepThrough.3.js</a></p>

which leads to

<p class="gist"><a href="http://gist.github.com/1654123#file_commafy.stepThrough.4.js" data-file="commafy.stepThrough.4.js">Gist 1654123: commafy.stepThrough.4.js</a></p>

which finally returns

<p class="gist"><a href="http://gist.github.com/1654123#file_commafy.stepThrough.5.js" data-file="commafy.stepThrough.5.js">Gist 1654123: commafy.stepThrough.5.js</a></p>

### Prototype

`commafy` is declared on `String`'s prototype, so once declared, it's available on all `String` instances.

And once it's part of `String`'s prototype, you can declare it like so on `Number`'s prototype for convenience:

<p class="gist"><a href="http://gist.github.com/1654123#file_commafy.2.js" data-file="commafy.2.js">Gist 1654123: commafy.2.js</a></p>

### Inconsistencies

There are a few inconsistencies that could be addressed with more code. But I like less code.

For example, `'1e3'.commafy()` would return `'1e3'` (since the input string doesn't match the regular expression). Whereas, `(1e3).commafy()` would return `'1,000'` since `1e3` is valid numeric syntax in JavaScript, and `(1e3).toString()` would return `'1000'`, which would cause `String`'s `commafy` to return `'1,000'`.

But exponential syntax is rare enough that I didn't bother addressing it. The implementation above handles positive and negative integer and decimal numbers and that's enough coverage for me.