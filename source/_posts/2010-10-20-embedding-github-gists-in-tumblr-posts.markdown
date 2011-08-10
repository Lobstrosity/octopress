---
layout: post
title: "Embedding GitHub Gists in Tumblr Posts"
date: 2010-10-20 17:03
categories: [github, gist, tumblr, javascript, jquery]
---

**_(Update; Aug 9th, 2011) This post was originally on my Tumblr blog. I have since migrated to [Octopress](http://octopress.org/ "Octopress")._**

Tumblr's utter lack of Gist support was pretty much a show-stopper for me, which is why this is my first post. In trying to figure out how to hack it myself, I ran across [Jarred Grippe](http://jaredgrippe.com/ "Jarred Grippe")'s post describing [how he hacked it](http://jaredgrippe.com/post/243439007/github-gists-on-tumblr "GitHub Gists on Tumblr"). I refactored his solution a bit to add some error checking and a couple of features.

<!--more-->

<p class="gist"><a href="http://gist.github.com/637764">http://gist.github.com/637764</a></p>

Most of the magic comes from the call to `embedNextGist` inside the `document.write` overrides. Typically when scripts are being added to the page programatically, you have to be careful not to execute code that depends on the script before the script is loaded. For example, if I had instead just put `embedNextGist` in a loop, all of the `document.write` overrides and appending of script tags would have happened long before the first appended script even loaded. The calls to the overridden `document.write` do not occur until the script has loaded, which would mean that all of the appended scripts would use whichever version of `document.write` was provided in the last iteration of the loop. That is, each Gist would, in turn, write itself into the last `p.gist`.

But in this case, all of that trouble is circumvented by calling `embedNextGist` from `document.write` which is called by the appended script (a call which, naturally, cannot happen until the script is loaded).

Two other small notes:

- Jarred's version writes the stylesheet link for every Gist that it handles. My version never writes the stylesheet link because I have that link as part of my Tumblr template.
- My version caches `document.write` before processing Gists and restores it upon completion.