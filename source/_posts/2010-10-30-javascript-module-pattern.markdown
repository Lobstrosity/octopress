---
layout: post
title: "JavaScript Module Pattern"
date: 2010-10-30 17:13
categories: [javascript, patterns, module]
---
My co-developers at my previous job were not terribly JavaScript-inclined and I found myself describing a lot of the information below to them any time they looked at JavaScript code with me. I figured I would write it all down as reference.

Not that this is original. [YUI](http://yuiblog.com/blog/2007/06/12/module-pattern/ "A JavaScript Module Pattern (yuiblog.com)") talked about it back in 2007. [Ben Cherry](http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth "JavaScript Module Pattern: In-Depth (adequatelygood.com)") goes into much greater detail. [Jonathan Snook](http://snook.ca/archives/javascript/no-love-for-module-pattern "Why I Don't Love JavaScript's Module Pattern (snook.ca)") is not a big fan. [On and on](http://www.google.com/search?q=javascript+module+pattern "Search Results for &quot;javascript module pattern&quot; (google.com)"). I'm adding my two cents because I think it is important to first mention the aspects of JavaScript that make the pattern possible.

The module pattern is extremely useful for namespacing your site's functionality to help prevent your code from overwriting others' code (and vice versa). Instead of putting your functionality on the global object where it can easily clobber or be clobbered by other globals, you tuck it away in an extensible module. And if necessary, you can have modules within modules within modules.

But first, a few key JavaScript concepts that enable and naturally lead to the module pattern.

<!--more-->

### Scope

Unlike other C-like languages (C-like in the sense of their block syntax), JavaScript does not use block scope&mdash;it uses function scope. That is, variables declared within a function are not available outside that function. They are only available within the function in which they are declared.

As a side note, variables are available everywhere within the function that declares them, even in code above the declaration. But you have to be very careful with this concept.

<p class="gist"><a href="http://gist.github.com/1135611#file_1.scope.js" data-file="1.scope.js">http://gist.github.com/1135611#file_1.scope.js</a></p>

In the above example, "Hi!" will be alerted as you probably expect.

<p class="gist"><a href="http://gist.github.com/1135611#file_2.scope.js" data-file="2.scope.js">http://gist.github.com/1135611#file_2.scope.js</a></p>

In the above example, however, you might expect "Hello!" to be alerted since the function has not declared its own message yet. Instead, `undefined` is alerted. Basically, the above code gets interpreted something like this:

<p class="gist"><a href="http://gist.github.com/1135611#file_3.scope.js" data-file="3.scope.js">http://gist.github.com/1135611#file_3.scope.js</a></p>

So that they are available throughout the entire function, the declarations (but not the initializations) of variables get "hoisted" to the top of the function in which they are declared. This is why JavaScript gurus (see Douglas Crockford's [JavaScript Code Conventions](http://javascript.crockford.com/code.html "Code Conventions for the JavaScript Programming Language (javascript.crockford.com)") recommend always declaring variables at the top of the function in which they are used (as opposed to sprinkling declarations throughout the function) since that is how the browser is going to interpret it anyway.

Hoisting does not really have anything to do with the module pattern directly. Do keep function scope in mind, though, as we continue.

### Closure

Closure is an important concept that comes as an added benefit of function scope. Function scope says that variables are accessible anywhere in the function that declares them. Closure takes it one step further. Functions declared within a function have access to the outer function's declared variables&mdash;even if the inner function has a longer lifetime than that of the outer function.

<p class="gist"><a href="http://gist.github.com/1135611#file_4.closure.js" data-file="4.closure.js">http://gist.github.com/1135611#file_4.closure.js</a></p>

The outer function (`createPerson`) declares a variable (`_name`). Due to function scope, the inner function (`getName`) has access to the outer function's variables (`_name`).

Then `joe` is declared and initialized using the outer function. The outer function executes to completion. However, `joe` still has access to `_name` through the inner function, `getName`. Effectively, `_name` is a private variable accessible only through `joe`'s `getName` function.

### The Module Pattern

<p class="gist"><a href="http://gist.github.com/1135611#file_5.modulePattern.js" data-file="5.modulePattern.js">http://gist.github.com/1135611#file_5.modulePattern.js</a></p>

The pattern is one big self-executing function. Start with the last line. `window.module` is passed in. But first `window.module` is set to the value of `window.module` or, if that is undefined, an empty object.

Another side note. The `||` operator basically acts as a "falsy" coalescer. It will return the first "truthy" value in the (left-to-right) list (or the last value if none of the values are "truthy"). E.g., `(false || null || undefined || 'abc' || 123)` will return "abc". So, if `window.module` has already been declared and has a value, it gets returned. Otherwise a new, empty object is returned. And it happens in an assignment, so whatever gets returned is stored in `window.module`. (If you're familiar with C#, it's a lot like `??`, the null coalescer.)

So, using this pattern, you can break the module up into separate files if necessary and each subsequently loaded module file will just extend the existing module.

Moving back up to the first line, the function accepts two parameters, the module itself and `undefined`. However (as noted in the previous paragraph), the function is only called with the module parameter. This is just in case any previously run script decided to assign a new value to `undefined`. `undefined` is tricky like that. It is not a reserved word. It is just a variable with a special value set by the browser. There is no safeguard in place to prevent a developer from assigning a new value to it.

Now, move into the function definition. JavaScript has no access modifiers. Variables can not be explicitly declared as public, private, etc. Function scope is used for privacy, though. Within the module function, any variables that are declared are available only in the module function (and, thanks to closure, any functions declared in the module function).

Variables declared on the module parameter, however, will be available outside the module function since the module is declared on the `window` (global) object.

An added benefit of passing the module as a parameter to the function is that no matter what the module is declared as and referenced by the client code as, the module function can refer to it however it pleases.

<p class="gist"><a href="http://gist.github.com/1135611#file_6.modulePattern.js" data-file="6.modulePattern.js">http://gist.github.com/1135611#file_6.modulePattern.js</a></p>

That can be useful if you are minifying your scripts. You don't have to minify the name of your module just for the sake of minifying the code that extends it.