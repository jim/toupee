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
            var editor, win, doc, textarea, toolbar, buttons, iframe, initialized, widget, styles;
            
            // methods
            var bindEvents, buildWidget, bind, button, exec, focus, htmlContent, initialize, run, range, reload, selection, clean, dirty, textContent;
            
            // init
            editor = {};
            textarea = element;
            buttons = [];
            initialized = false;
            options = options || {};
            clean = options['clean'] || $.fn.toupee.html.clean;
            dirty = options['dirty'] || $.fn.toupee.html.dirty;
            
            styles = options['styles'] || {
              'font-family': 'Helvetica, Arial, san-serif',
              'font-size': '12px',
              'line-height': '1.4em'
            };
            
            bindEvents = function() {
                
                var previousContent;
                
                $.each(EVENTS, function(index, eventName) {
                    $(doc).bind(eventName, function(event) {
                        if (htmlContent() != previousContent) {
                            $(widget).trigger('change.toupee', [editor]);
                            
                            previousContent = editor.htmlContent();
                        }                         
                    });
                });

                bind('insert.toupee', function(event, html) {
                  // According to Mozilla's docs, IE does not support insertHTML
                  exec('insertHTML', html);
                  reload();
                });
                
                $(textarea).closest('form').bind('submit', function(event) {
                  $(textarea).val(htmlContent());
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
                
                // iframe onload never fires in webkit or ie; this is a fallback
                if ($.fn.toupee.browser.webkit) {
                    setTimeout(function() { if (!initialized) { initialize(); } }, 1000);
                }
                
                // events handler for toolbar clicks
                $(toolbar).click(function(event) {
                    var link = $(event.target).closest('a')[0];
                    if (link) {
                        $(widget).trigger(link.className + '.click.toupee', [editor]);
                        link.blur();
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
                
                
                // doc.designMode = 'on';
                // doc.execCommand('undo', false, null);
                // doc.execCommand("styleWithCSS", '', false);

                bindEvents();

                setTimeout(function() {
                
                  // TODO refactor the heck out of this style assignment
                  
                  if ($.fn.toupee.browser.ie) {
                    var style = doc.createStyleSheet();
                    style.addRule("body", "border: 0");
                    style.addRule("p", "margin: 0");
                
                    $.each(styles, function(index, element) {
                      var value = element + ': ' + styles[element];
                      style.addRule('body', value);
                    });
                  } else if ($.fn.toupee.browser.opera) {
                    var style = $(doc).find('style').text("p { margin: 0; }");
                    var head = doc.getElementsByTagName('head')[0];
                    head.appendChild(style);
                  } else {
                    var styleText = "p { margin: 0; }";
                    var head = doc.getElementsByTagName("head")[0];
                    var styleNode = doc.createElement("style");
                    styleNode.appendChild(doc.createTextNode(styleText));
                    head.appendChild(styleNode);
                    $('body', doc).css(styles);
                  }
                
                  doc.body.innerHTML = dirty($(textarea).text());
                  
                  reload();
                  
                  $(widget).trigger('ready.toupee');
                }, 20);

                // setTimeout(function() {
                  // doc.designMode = 'on';
                  // doc.execCommand('undo', false, null);
                // }, 100);

                // $(doc).find('body').html(dirty($(textarea).text()));
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
            
            focus = function() {
              win.focus();
            };
            editor.focus = focus;
            
            exec = function(command, optional) {
                optional = optional || null;
                iframe.contentWindow.document.execCommand(command, false, optional);
            };
            editor.exec = exec;
            
            htmlContent = function() {
                return clean(doc.body.innerHTML);
            };
            editor.htmlContent = htmlContent;
            
            selection = function() {
                return win.getSelection ? win.getSelection() : doc.selection;
            };
            editor.selection = selection;
            
            range = function() {
                
            };
            editor.range = range;
            
            reload = function() {
              var content = doc.body.innerHTML;
              doc.designMode = 'off';
              doc.body.innerHTML = content;
              setTimeout(function() {
                doc.designMode = 'on';
                doc.execCommand('undo', false, null);
              }, 1000);
            };
            
            run = function() {
                $.each(arguments, function(index, method) {
                    try {
                        method.call(editor);
                    } catch(e) {
                        console.error('Invalid value passed to editor.run(): ', method);
                    }
                });
            };
            editor.run = run;
            
            editor.widget = function() { return widget; };
            editor.iframe = function() { return iframe; };
            editor.doc = function() { return doc; };
            
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