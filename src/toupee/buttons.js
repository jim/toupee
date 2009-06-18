(function($) {
    $.fn.toupee.toolbar = {};
    $.fn.toupee.toolbar.basic = function() {
        this.button('bold');
        this.bind('bold.click.toupee', function(event, editor) {
            editor.exec('bold');
        });
        this.button('italic');
        this.bind('italic.click.toupee', function(event, editor) {
            editor.exec('italic');
        });
        // this.button('underline');
        // this.bind('underline.click.toupee', function(event, editor) {
        //     editor.exec('underline');
        // });
        this.bind('underline.change.toupee', function(event, editor, button) {
            $(button).addClass('on');
        });
    };
})(jQuery);