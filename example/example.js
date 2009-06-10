jQuery(function($) {
    $('textarea').toupee({}).run($.fn.toupee.toolbar.basic);
    
    $$('textarea').editor.button('link');
    $$('textarea').editor.bind('link.click.toupee', function(event, editor) {
        var link = prompt('Please enter the URL to link to:');
        if (link) {
            editor.exec('createLink', link);
        }
    });
    
    $$('textarea').editor.run(function() {
        this.button('embed');
        this.bind('embed.click.toupee', function(event, editor) {
            console.debug('adding an upload');
        });
    });
    
    var previousContent;
    $$('textarea').editor.bind('change.toupee', function(event, editor) {
        if (editor.htmlContent() != previousContent) {
            console.debug('something has changed!');
            previousContent = editor.htmlContent();
        }
    });
});