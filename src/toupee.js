var $$ = function(param) {
    var node = jQuery(param)[0];
    var id = jQuery.data(node);
    jQuery.cache[id] = jQuery.cache[id] || {};
    jQuery.cache[id].node = node;
    return jQuery.cache[id];
};

(function($) {
    var createEditor = function(element, options) {
        return function(){
            
            // 'constants'
            var EVENTS = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mousemove', 'mouseout', 'keypress', 'keydown', 'keyup'];
            
            // private variables
            var editor, win, doc, textarea, toolbar, buttons, iframe, initialized, widget;
            
            // methods
            var bindEvents, buildWidget, bind, button, exec, htmlContent, initialize, run, clean, dirty, textContent;
            
            // init
            editor = {};
            textarea = element;
            buttons = [];
            initialized = false;
            options = options || {};
            clean = options['clean'] || $.fn.toupee.html.clean;
            dirty = options['dirty'] || $.fn.toupee.html.dirty;
            
            bindEvents = function() {
                $(doc).bind('keyup', function(event) {
                    $(textarea).html(htmlContent());
                    $(widget).trigger('change.toupee', [editor]);
                });
            };
            
            buildWidget = function() {
                // build markup and setup vars
                $(textarea).wrap('<div class="toupee-widget"></div>');
                $(textarea).hide().before('<iframe class="toupee-iframe" />');
                widget = $(textarea).closest('div.toupee-widget')[0];
                iframe = $(textarea).prev('iframe')[0];
                $(widget).prepend('<ul class="toupee-toolbar"></ul>');
                toolbar = $(widget).children('ul.toupee-toolbar')[0];
                
                // complete initialization once the iframe loads
                $(iframe).one('load', function() {
                    initialize();
                });
                
                // iframe onload never fires in webkit; this is a fallback
                if ($.fn.toupee.browser.webkit) {
                    setTimeout(function() { if (!initialized) { initialize(); } }, 100);
                }
                
                // events handler for toolbar clicks
                $(toolbar).click(function(event) {
                    var link = $(event.target).closest('a')[0];
                    if (link) {
                        $(widget).trigger(link.className + '.click.toupee', [editor]);
                        return false;                    
                    }
                });
            };

            var initialize = function() {
                initialized = true;
                
                doc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframe.contentDocument) {
                    win = iframe.contentDocument.defaultView;
                } else if (iframe.contentWindow.document) {
                    win = iframe.contentWindow;
                }
                doc.designMode = 'on';
                doc.execCommand("styleWithCSS", '', false);

                bindEvents();

                $(doc).find('body').html(dirty($(textarea).text()));
                $(widget).trigger('ready.toupee');
            }

            // let's go
            buildWidget();

            button = function(name, options) {
                options = options || {};
                var event = options.event || name;
                buttons.push({name: name, event: event});
                $(toolbar).append('<li><a href="#" class="' + name + '"><span>' + name + '</span></a></li>');
                return editor;
            };
            editor.button = button;
            
            bind = function(eventName, method) {
                $(widget).bind(eventName, method);
            }
            editor.bind = bind;
            
            exec = function(command, optional) {
                optional = optional || null;
                iframe.contentWindow.document.execCommand(command, false, optional);
            };
            editor.exec = exec;
            
            htmlContent = function() {
                return clean(doc.body.innerHTML);
            };
            editor.htmlContent = htmlContent;
            
            run = function() {
                $.each(arguments, function(index) {
                    this.call(editor);
                });
            };
            editor.run = run;
            
            editor.widget = function() { return widget; };
            editor.iframe = function() { return iframe; };
            
            return editor;
        }();
    };

    // initialize
    $.fn.toupee = function(options) {
        var args = arguments;
        this.each(function(index) {
            var editor = createEditor(this, options);
            $$(this).editor = editor;
        });
        return $$(this[0]).editor;
    };
})(jQuery);