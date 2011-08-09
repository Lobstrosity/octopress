---
layout: post
title: "Mapping Parent-Child Relationships With Dapper"
date: 2011-08-08 17:39
comments: true
categories: [dapper, dot-net]
---
Dapper is a great, new (kind of), tiny database object mapper for the .NET framework. Its footprint is a single file. Drop it in your project and it adds a handful of extension methods to the `IDbConnection` interface.

Dapper's focus is on speed. According to the [project's home page](http://code.google.com/p/dapper-dot-net/#Performance "dapper-dot-net Performance"), it's barely slower than hand-coding your own mapping with a `SqlDataReader`. What those few milliseconds buy you, though, is automatic mapping to your POCOs. Speed isn't free, though. But I'll get to that part later.

<!--more-->

### Benefits

Take the following example class:

<p class="gist"><a href="http://gist.github.com/1133111#file_1.widget.cs" data-file="1.Widget.cs">http://gist.github.com/1133111#file_1.widget.cs</a></p>

A hand-coded `SqlDataReader` method to get all widgets would look something like this:

<p class="gist"><a href="http://gist.github.com/1133111#file_2.get_all_widgets_with_sql_data_reader.cs" data-file="2.GetAllWidgetsWithSqlDataReader.cs">http://gist.github.com/1133111#file_2.get_all_widgets_with_sql_data_reader.cs</a></p>

A Dapper-powered method to get all widgets would look much simpler. Something like:

<p class="gist"><a href="http://gist.github.com/1133111#file_3.get_all_widgets_with_dapper.cs" data-file="3.GetAllWidgetsWithDapper.cs">http://gist.github.com/1133111#file_3.get_all_widgets_with_dapper.cs</a></p>

The `Query` method used above is one of the extension methods provided by Dapper. Provide the type you want to map to and a corresponding SQL query and it will return an `IEnumerable` of that type, populated with the results of the query.

There's also an `Execute` method, useful for updates and inserts. It takes a parameterized command and an `object` parameter. It will then populate the parameters of the command with the properties of the `object`, matching based on name.

So, a (contrived) method to insert a new widget would look like:

<p class="gist"><a href="http://gist.github.com/1133111#file_4.add_widget.cs" data-file="4.AddWidget.cs">http://gist.github.com/1133111#file_4.add_widget.cs</a></p>

Dapper will scan the property names of the `object` parameter--in this case, a populated `Widget`--and populate the parameters of the command with the widget's property values.

But, as I said before, Dapper's focus is on speed. So there are a few trade-offs in the deal.

### Drawbacks

First, validation becomes your responsibility. Dapper doesn't automatically perform validation on inserts and updates (like, e.g., Entity Framework does, based on `DataAnnotations` attributes and `IValidatableObject` implementations).

Another great feature that Entity Framework handles pretty much automatically is the mapping of object hierarchies.

Take the following domain model:

<p class="gist"><a href="http://gist.github.com/1133111#file_5.domain_model.cs" data-file="5.DomainModel.cs">http://gist.github.com/1133111#file_5.domain_model.cs</a></p>

And based on an assumed database schema, a `Category` can have any number of `Widget` children and a `Widget` must have one and only one `Category` parent.

If you were to sprinkle a few `KeyAttribute`s in there, Entity Framework would be able to track and validate the parent-child relationships for you automatically.

Let's say we want to build a method that returns a collection of `Category` instances, with their children populated. Dapper has overloads of the `Query` method that allow you to use a single query to return multiple records per row. Perfect for generating an entire parnet-child object graph with a single `JOIN` query, right?

Not so fast.

The previously mentioned overloads look like:

<p class="gist"><a href="http://gist.github.com/1133111#file_6.query.cs" data-file="6.Query.cs">http://gist.github.com/1133111#file_6.query.cs</a></p>

Where the first N types are the types being queried for (in the order in which they appear in the query) and the last type is the type of the `IEnumerable` that will be returned. The `map` parameter allows you to pass a function that tells Dapper how to map the objects in each row of the result to each other.

So, a first pass:

<p class="gist"><a href="http://gist.github.com/1133111#file_7.get_hierarchy_first_pass.cs" data-file="7.GetHierarchyFirstPass.cs">http://gist.github.com/1133111#file_7.get_hierarchy_first_pass.cs</a></p>

That SQL query will return one row per widget, with the category information for that widget's parent. Dapper doesn't care, though, that such a result set contains duplicate categories. So Dapper returns a collection of categories (containing duplicates), each with exactly one child widget.

So, if your tree logically looked like:

- Category 1
  - Widget 1
  - Widget 2
- Category 2
  - Widget 3
  - Widget 4

...Dapper would return an object hierarchy that actually looks like:

- Category 1
  - Widget 1
- Category 1
  - Widget 2
- Category 2
  - Widget 3
- Category 2
  - Widget 4

You can't fix this with a simple `Distinct()` call tacked on the result of `Query`. This is because each of these categories are distinct objects with duplicate data, as opposed to being duplicate references to distinct objects. The `map` function can be modified, however, to account for the duplicates:

### Solution

<p class="gist"><a href="http://gist.github.com/1133111#file_8.get_hierarchy.cs" data-file="8.GetHierarchy.cs">http://gist.github.com/1133111#file_8.get_hierarchy.cs</a></p>

The `map` function now uses a dictionary to store and retrieve the distinct categories. Also note that `Distinct()` has to be called on the final result. This is because `map` must return a `Category`, which means that `Query` will be returning duplicates. But, due to the `lookup` logic, "duplicate" in this case means duplicate references, unlike in the first pass implementaiton.

Due to Dapper's focus on performance (and reducing instances of N+1 queries), you'd think they would highlight a use case like this on their website. Sadly, they don't. I had to dig down deep in their test cases to find the basic implementation above (in the [ParentChildIdentityAssociations test](http://code.google.com/p/dapper-dot-net/source/browse/Tests/Tests.cs#824)), and even then, they don't provide comments as to why they're doing what they're doing.