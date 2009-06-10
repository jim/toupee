Toupee
=======

#### A jQuery port of the WysiHat JavaScript framework

Toupee is heavily based on work by Joshua Peek and the other contributors to the WysiHat project (http://github.com/josh/wysihat).

## Introduction

### Supported platforms

This is alpha quality software; use at your own risk. Toupee appears to work in:

* Firefox 3
* Safari 4 beta

It has *not* been examined in:

* Microsoft Internet Explorer
* Mozilla Firefox 2
* Apple Safari 3
* Opera
* Google Chrome

### Known shortcomings

* The test suite hasn't been ported over yet
* The selection and range components of WysiHat haven't been ported yet
* Copy/Cut/Paste not yet implemented

### Dependencies

* jQuery 1.3.2

## API

Toupee takes a somewhat different approach that WysiHat when it comes to code structure and extensibility. My goal is to leverage custom events to make Toupee as flexible as possible.

### $$

There is a global utility method, <code>$$</code> for accessing a DOM element's jQuery data hash. This technique and code are lifted from an article by Yehuda Katz on [evented programming](http://yehudakatz.com/2009/04/20/evented-programming-with-jquery/).

### Creating an editor

To create an instance of the Toupee editor, call <code>toupee()</code> on a jQuery object that contains <code>textareas</code>:

    $('textarea').toupee();
    
This method will return the first element's <code>editor</code> instance, which can also be accessed using the aforementioned <code>$$</code> method:

    $$(domNodeOrJQuery).editor;

When a change is made by the user, the hidden textarea's content is updated. So form submissions should work as the did before enhancement.

The <code>editor</code> has many useful methods.

### How it works

Toupee, like most other WYSIWYG editors, uses an <code>iframe</code> with <code>designMode</code> turned on. The original textarea is hidden, and it's contents are updated as changes are made to the content in the iframe.

### editor.bind(eventName, callback)

<code>editor.bind</code> is a convenience method for binding event listeners to the editor (actually, all events/listeners are fired/attached to <code>editor.widget</code>). Inside the callback, <code>this</code> is a reference to <code>editor.widget</code>.

Here is how to create a button that will create a link when clicked:

    $$(domNome).editor.bind('link.click.toupee', function(event, editor) {
        var link = prompt('Please enter the URL to link to:');
        if (link) {
            editor.exec('createLink', link);
        }
    });
    
### editor.button(buttonName, options)

Creates a new button in the toolbar, which will fire <code>buttonName.click.toupee</code> on <code>editor.widget</code> when clicked. This method and <code>editor.bind</code> will allow for the creation of custom toolbars.

### editor.exec(commandName, optionalArgument)

Basically a wrapper for <code>execCommand</code>. For more info, see [Rich-Text Editing in Mozilla](https://developer.mozilla.org/en/Rich-Text_Editing_in_Mozilla).

### editor.run(func1, func2, ...)

Since all configuration is done by calling methods on an <code>editor</code> instance, this method will call all argument functions, passing in the <code>editor</code>. This allows for packaging a set of toolbar buttons or configurations into a function for easy reuse. See <code>toupee.buttons.js</code> for some examples.

### editor.htmlContent()

Returns the cleaned HTML content from the <code>editor</code>.

## Examples

There is a single example under `example/` to get you started.

## License

Toupee, like WysiHat, is released under the MIT license.