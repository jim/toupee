(function($) {
    $.fn.toupee.selection = function(win, doc) {

        // public
        var node, range, select, selection;

        // private
        var compareRanges, createRangeFromElement, setBookmark, moveToBookmark;
        
        /**
         *  Get selected text.
        **/
        selection = function() {
            return win.getSelection ? win.getSelection() : doc.selection;
        };
        
        /**
         *  Get range for selected text.
        **/
        range = function() {
            var sel = selection();

            try {
                var range;
                if (sel.getRangeAt) {
                    range = sel.getRangeAt(0);
                } else {
                    range = sel.createRange();
                }
            } catch(e) { return null; }

            if ($.fn.toupee.browser.webkit) {
                range.setStart(sel.baseNode, sel.baseOffset);
                range.setEnd(sel.extentNode, sel.extentOffset);
            }

            return range;
        };
        
        /**
         *  Selects a node
        **/
        select = function(node) {
            var sel = selection();

            if ($.fn.toupee.browser.ie) {
                var range = createRangeFromElement(doc, node);
                range.select();
            } else if ($.fn.toupee.browser.webkit) {
                sel.setBaseAndExtent(node, 0, node, node.innerText.length);
            } else if ($.fn.toupee.browser.opera) {
                range = doc.createRange();
                range.selectNode(node);
                sel.removeAllRanges();
                sel.addRange(range);
            } else {
                var range = createRangeFromElement(doc, node);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
        
        /**
         *  Returns selected node.
        **/
        node = function() {
            var nodes = null, candidates = [], children, el;
            var range = range();

            if (!range)
                return null;

            var parent;
            if (range.parentElement) {
                parent = range.parentElement();
            } else {
                parent = range.commonAncestorContainer;                
            }

            if (parent) {
                while (parent.nodeType != 1) {
                    parent = parent.parentNode;
                }
                if (parent.nodeName.toLowerCase() != "body") {
                    el = parent;
                    do {
                        el = el.parentNode;
                        candidates[candidates.length] = el;
                    } while (el.nodeName.toLowerCase() != "body");
                }
                children = parent.all || parent.getElementsByTagName("*");
                for (var j = 0; j < children.length; j++) {
                    candidates[candidates.length] = children[j];                    
                }
                nodes = [parent];
                for (var ii = 0, r2; ii < candidates.length; ii++) {
                    r2 = createRangeFromElement(this.document, candidates[ii]);
                    if (r2 && compareRanges(range, r2)) {
                        nodes[nodes.length] = candidates[ii];
                    }
                }
            }

            return nodes.first();
        };
        
        createRangeFromElement = function(document, node) {
            if (document.body.createTextRange) {
                var range = document.body.createTextRange();
                range.moveToElementText(node);
            } else if (document.createRange) {
                var range = document.createRange();
                range.selectNodeContents(node);
            }
            return range;
        };
        
        compareRanges = function(r1, r2) {
            if (r1.compareEndPoints) {
                return !(
                    r2.compareEndPoints('StartToStart', r1) == 1 &&
                    r2.compareEndPoints('EndToEnd', r1) == 1 &&
                    r2.compareEndPoints('StartToEnd', r1) == 1 &&
                    r2.compareEndPoints('EndToStart', r1) == 1
                    ||
                    r2.compareEndPoints('StartToStart', r1) == -1 &&
                    r2.compareEndPoints('EndToEnd', r1) == -1 &&
                    r2.compareEndPoints('StartToEnd', r1) == -1 &&
                    r2.compareEndPoints('EndToStart', r1) == -1
                );
            } else if (r1.compareBoundaryPoints) {
                return !(
                    r2.compareBoundaryPoints(0, r1) == 1 &&
                    r2.compareBoundaryPoints(2, r1) == 1 &&
                    r2.compareBoundaryPoints(1, r1) == 1 &&
                    r2.compareBoundaryPoints(3, r1) == 1
                    ||
                    r2.compareBoundaryPoints(0, r1) == -1 &&
                    r2.compareBoundaryPoints(2, r1) == -1 &&
                    r2.compareBoundaryPoints(1, r1) == -1 &&
                    r2.compareBoundaryPoints(3, r1) == -1
                );
            };
            return null;
        };

        setBookmark = function() {
            var bookmark = this.document.getElementById('bookmark');
            if (bookmark) {
                bookmark.parentNode.removeChild(bookmark);                
            }
            bookmark = this.document.createElement('span');
            bookmark.id = 'bookmark';
            bookmark.innerHTML = '&nbsp;';
            if ($.fn.toupee.broser.ie) {
                var range = this.document.selection.createRange();
                var parent = this.document.createElement('div');
                parent.appendChild(bookmark);
                range.collapse();
                range.pasteHTML(parent.innerHTML);
            } else {
                var range = this.getRange();
                range.insertNode(bookmark);
            }
        };

        moveToBookmark = function() {
            var bookmark = this.document.getElementById('bookmark');
            if (!bookmark) {
                return;                
            }

            if ($.fn.toupee.browser.ie) {
                var range = this.getRange();
                range.moveToElementText(bookmark);
                range.collapse();
                range.select();
            } else if ($.fn.toupee.browser.webkit) {
                var selection = this.getSelection();
                selection.setBaseAndExtent(bookmark, 0, bookmark, 0);
            } else {
                var range = this.getRange();
                range.setStartBefore(bookmark);
            }

            bookmark.parentNode.removeChild(bookmark);
        }


        return {
            node: node,
            range: range,
            select: select,
            selection: selection
        };
    }
})(jQuery);