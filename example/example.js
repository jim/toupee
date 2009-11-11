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
          var html = prompt('Please enter the HTML to be inserted');
          if (html) {
            $($$('textarea').editor.widget()).trigger('insert.toupee', [html]);
          }
        });
    });
    
    var previousContent;
    $$('textarea').editor.bind('change.toupee', function(event, editor) {
        if (editor.htmlContent() != previousContent) {
            previousContent = editor.htmlContent();
        }
    });
    
    $('a.insert-link').click(function(event) {
      var html = '<img class="upload image" src="http://static.open.salon.com/files/green_peppers1231794320.jpg" width="30%" height="30%" />';
      $($$('textarea').editor.widget()).trigger('insert.toupee', [html]);
      $$('textarea').editor.focus();
      return false;
    });
});