(function($) {    

    // The following 4 functions were yanked from Prototype proper
    
    var prepareReplacement = function(replacement) {
        if (jQuery.isFunction(replacement))  {
            return replacement;
        }
        return function(match) { return match };
    };
    
    var blank = function(text) {
        return /^\s*$/.test(text);
    };

    var interpret = function(text) {
        return text == null ? '' : String(text);
    };
    
    var gsub = function(source, pattern, replacement) {
        var result = '', match;
        replacement = prepareReplacement(replacement);

        if (typeof(pattern) == 'string') {
            pattern = RegExp.escape(pattern);
        };

        if (!(pattern.length || pattern.source)) {
            replacement = replacement('');
            return replacement + source.split('').join(replacement) + replacement;
        }

        while (source.length > 0) {
            if (match = source.match(pattern)) {
              result += source.slice(0, match.index);
              result += interpret(replacement(match));
              source  = source.slice(match.index + match[0].length);
            } else {
              result += source, source = '';
            }
        }
        return result;
    };

    /**
    *  Normalizes and tidies text into XHTML content.
    *
    *  - Strips out browser line breaks, '\r'
    *  - Downcases tag names
    *  - Closes line break tags
    **/
    var tidyXHTML = function(text) {
        // Remove IE's linebreaks
        text = gsub(text, /\r\n?/, "\n");

        // Downcase tags
        text = gsub(text, /<([A-Z]+)([^>]*)>/, function(match) {
          return '<' + match[1].toLowerCase() + match[2] + '>';
        });

        text = gsub(text, /<\/([A-Z]+)>/, function(match) {
          return '</' + match[1].toLowerCase() + '>';
        });

        // Close linebreak elements
        text = text.replace(/<br>/g, "<br />");

        return text;
    };

    /**
    *  Convert browser-created html to something nice and clean
    *
    *  There is no standard formatting among the major browsers for the rich
    *  text output. Safari wraps its line breaks with "div" tags, Firefox puts
    *  "br" tags at the end of the line, and other such as Internet Explorer
    *  wrap lines in "p" tags.
    *
    *  The output is a standarizes these inconsistencies and produces a clean
    *  result. A single return creates a line break "br" and double returns
    *  create a new paragraph. This is similar to how Textile and Markdown
    *  handle whitespace.
    *
    *  Raw browser content => clean() => Textarea
    **/
    var clean = function(dirtyHTML) {
        var text = tidyXHTML(dirtyHTML);
        if ($.fn.toupee.browser.webkit) {
            // Extra divs expand to line breaks
            text = text.replace(/(<div>)+/g, "\n");
            text = text.replace(/(<\/div>)+/g, "");

            // Trash extra paragraphs
            text = text.replace(/<p>\s*<\/p>/g, "");

            // Convert line break tags into real line breaks
            text = text.replace(/<br \/>(\n)*/g, "\n");
        } else if ($.fn.toupee.browser.gecko) {
            // Convert any strangling paragraphs into line breaks
            text = text.replace(/<p>/g, "");
            text = text.replace(/<\/p>(\n)?/g, "\n");

            // Convert line break tags into real line breaks
            text = text.replace(/<br \/>(\n)*/g, "\n");
        } else if ($.fn.toupee.browser.ie || $.fn.toupee.browser.opera) {
            // Treat lines with one space as returns
            text = text.replace(/<p>(&nbsp;|&#160;|\s)<\/p>/g, "<p></p>");

            // Line break tags are useless
            text = text.replace(/<br \/>/g, "");

            // Kill all paragraph opens
            text = text.replace(/<p>/g, '');

            // Clean up nonbreaking spaces
            text = text.replace(/&nbsp;/g, '');

            // Paragraphs translate to line breaks
            text = text.replace(/<\/p>(\n)?/g, "\n");

            // Trim off leading and trailing paragraph tags
            // TODO: Removing the following line does not cause any tests to fail
            text = gsub(text, /^<p>/, '');
            // TODO: Removing the following line does not cause any tests to fail
            text = gsub(text, /<\/p>$/, '');
        }

        // bold tag to strong
        // TODO: Removing the following line does not cause any tests to fail
        text = gsub(text, /<b>/, "<strong>");
        // TODO: Removing the following line does not cause any tests to fail
        text = gsub(text, /<\/b>/, "</strong>");

        // italic tag to em
        // TODO: Removing the following line does not cause any tests to fail
        text = gsub(text, /<i>/, "<em>");
        // TODO: Removing the following line does not cause any tests to fail
        text = gsub(text, /<\/i>/, "</em>");

        // Convert double returns into paragraphs
        text = text.replace(/\n\n+/g, "</p>\n\n<p>");

        // Convert a single return into a line break
        text = gsub(text, /(([^\n])(\n))(?=([^\n]))/, function(match) {
            return match[2] + "<br />\n";
        });

        // Sandwich with p tags
        text = '<p>' + text + '</p>';

        // Trim whitespace before and after paragraph tags
        text = text.replace(/<p>\s*/g, "<p>");
        text = text.replace(/\s*<\/p>/g, "</p>");

        var element = $('<div></div>');
        element.html(text);

        if ($.fn.toupee.browser.webkit || $.fn.toupee.browser.gecko) {
          var replaced;
          do {
            replaced = false;
            element.find('span').each(function(index) {
                var span = $(this);
              if (span.hasClass('Apple-style-span')) {
                span.removeClass('Apple-style-span');
                if (span.className == '')
                  span.removeAttr('class');
                replaced = true;
              } else if (span.css('fontWeight') == 'bold') {
                span.css('fontWeight',  '');
                if (span.attr('style').length == 0)
                  span.removeAttr('style');
                span.html('<strong>' + span.html() + '</strong>');
                replaced = true;
              } else if (span.css('fontStyle') == 'italic') {
                span.css('fontStyle', '');
                if (span.attr('style').length == 0)
                  span.removeAttr('style');
                span.html('<em>' + span.html() + '</em>');
                replaced = true;
              } else if (span.css('textDecoration') == 'underline') {
                span.css('textDecoration', '');
                if (span.attr('style').length == 0)
                  span.removeAttr('style');
                span.html('<u>' + span.html() + '</u>');
                replaced = true;
              } else if (span[0].attributes.length == 0) {
                span.replaceWith(span.innerHTML);
                replaced = true;
              }
            });
          } while (replaced);
        }

        // TODO: This should be configurable
        var acceptableBlankTags = ['BR', 'IMG'];

        element.find('*').each(function(index) {
             if (blank(this.innerHTML) && jQuery.inArray(this.nodeName, acceptableBlankTags) != -1 && this.id != 'bookmark')
               $(this).remove();
        });

        text = element.html();
        text = tidyXHTML(text);

        // Normalize whitespace after linebreaks and between paragraphs
        text = text.replace(/<br \/>(\n)*/g, "<br />\n");
        text = text.replace(/<\/p>\n<p>/g, "</p>\n\n<p>");

        // Cleanup empty paragraphs
        text = text.replace(/<p>\s*<\/p>/g, "");

        // Trim whitespace at the end
        text = text.replace(/\s*$/g, "");

        return text;
    };
    
    /**
    *  Convert clean html to something browsers can edit
    *
    *  This function preforms the reserve function of `String#formatHTMLOutput`. Each
    *  browser has difficulty editing mix formatting conventions. This restores
    *  most of the original browser specific formatting tags and some other
    *  styling conventions.
    *
    *  Textarea => dirty() => Raw content
    **/
    var dirty = function(text) {

        var element = $('<div></div>');
        element.html(text);

        if ($.fn.toupee.browser.webkit || $.fn.toupee.browser.gecko) {
            // Convert style spans back
            $(element).find('strong').each(function(index) {
              $(this).replaceWith('<span style="font-weight: bold;">' + this.innerHTML + '</span>');
            });
            $(element).find('em').each(function(index) {
              $(this).replaceWith('<span style="font-style: italic;">' + this.innerHTML + '</span>');
            });
            $(element).find('u').each(function(index) {
              $(this).replaceWith('<span style="text-decoration: underline;">' + this.innerHTML + '</span>');
            });
        }

        // TODO: Test if WebKit has issues editing spans without
        // "Apple-style-span". If not, remove this.
        if ($.fn.toupee.browser.webkit)
        element.find('span').each(function(index) {
            var span = $(this);
            if (span.css('fontWeight') == 'bold')
                span.addClass('Apple-style-span');

            if (span.css('fontStyle') == 'italic')
                span.addClass('Apple-style-span');

            if (span.css('textDecoration') == 'underline')
                span.addClass('Apple-style-span');
        });

        text = element.html();
        text = tidyXHTML(text);

        // Convert paragraphs into double returns
        text = text.replace(/<\/p>(\n)*<p>/g, "\n\n");

        // Convert line breaks into single returns
        text = text.replace(/(\n)?<br( \/)?>(\n)?/g, "\n");

        // Chop off leading and trailing paragraph tags
        text = text.replace(/^<p>/g, '');
        text = text.replace(/<\/p>$/g, '');

        if ($.fn.toupee.browser.gecko) {
            // Replace returns with line break tags
            text = text.replace(/\n/g, "<br>");
            text = text + '<br>';
        } else if ($.fn.toupee.browser.webkit) {
        // Wrap lines in div tags
            text = text.replace(/\n/g, "</div><div>");
            text = '<div>' + text + '</div>';
            text = text.replace(/<div><\/div>/g, "<div><br></div>");
        } else if ($.fn.toupee.browser.ie || $.fn.toupee.browser.opera) {
            text = text.replace(/\n/g, "</p>\n<p>");
            text = '<p>' + text + '</p>';
            text = text.replace(/<p><\/p>/g, "<p>&nbsp;</p>");
            text = text.replace(/(<p>&nbsp;<\/p>)+$/g, "");
        }

        return text;
    }
    
    $.fn.toupee.html = {
        clean: clean,
        dirty: dirty
    };
})(jQuery);