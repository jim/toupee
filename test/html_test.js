TestCase('html', {
    testGsubWithReplacementFunction: function() {
        expectAsserts(3);
        var source = 'foo boo boz';

        assertEquals('Foo Boo BoZ',
            $.fn.toupee.html.gsub(source, /[^o]+/, function(match) {
                return match[0].toUpperCase()
        }));
        assertEquals('f2 b2 b1z',
            $.fn.toupee.html.gsub(source, /o+/, function(match) {
                return match[0].length;
        }));
        assertEquals('f0 b0 b1z',
            $.fn.toupee.html.gsub(source, /o+/, function(match) {
                return match[0].length % 2;
        }));
    },

    testGsubWithReplacementString: function() {
        expectAsserts(6);
        
        var source = 'foo boo boz';
        assertEquals('foobooboz', $.fn.toupee.html.gsub(source, /\s+/, ''));
        assertEquals('  z', $.fn.toupee.html.gsub(source, /(.)(o+)/, ''));
    
        assertEquals('ウィメンズ2007<br/>クルーズコレクション', $.fn.toupee.html.gsub('ウィメンズ2007\nクルーズコレクション', /\n/,'<br/>'));
        assertEquals('ウィメンズ2007<br/>クルーズコレクション', $.fn.toupee.html.gsub('ウィメンズ2007\nクルーズコレクション', '\n','<br/>'));
    
        assertEquals('barfbarobarobar barbbarobarobar barbbarobarzbar', $.fn.toupee.html.gsub(source, '', 'bar'));
        assertEquals('barfbarobarobar barbbarobarobar barbbarobarzbar', $.fn.toupee.html.gsub(source, new RegExp(''), 'bar'));
    },
        
    testTidyHTML: function() {
       var cases = [
            ['Hello', 'Hello'],
            ['Hello\nWorld\n', 'Hello\r\nWorld\r\n'],
            ['<p>Hello</p>\n<p>World</p>', '<p>Hello</p>\n<p>World</p>'],
            ['<p>Hello</p>\n<p>World</p>', '<P>Hello</P>\n<P>World</P>'],
            ['<p class="greeting">Hello</p>\n<p>World</p>', '<P class="greeting">Hello</P>\n<P>World</P>'],
            ['Hello<br />\nWorld', 'Hello<BR>\r\nWorld']
        ];
               
        expectAsserts(cases.length);
    
        jQuery.each(cases, function(index, testCase) {
            assertEquals('case ' + index.toString(), testCase[0], $.fn.toupee.html.tidyXHTML(testCase[1]));
        });
    },

    testCleanInSafari: function() {
        if ($.fn.toupee.browser.webkit) {
            var cases = [
                ['<p>Here is some basic text<br />\nwith a line break.</p>\n\n<p>And maybe another paragraph</p>',
                '<div>Here is some basic text</div><div>with a line break.</div><div><br></div><div>And maybe another paragraph</div>'],
                ['<p>Hello</p>\n\n<p>World!</p>', '<div>Hello</div><div><br></div><div>World!</div>'],
                ['<p>Hello</p>\n\n<p>World!</p>', '<div><p>Hello</p></div><div><br></div><div>World!</div>'],
                ['<p>Hello</p>\n\n<p>World!</p>', '<div>Hello<p></p></div><div><p></p></div><div><p></p></div><div><p>World!</p></div>'],
                ['<p>Hello<br />\nWorld!<br />\nGoodbye!</p>', 'Hello<div><div><div>World!<br></div><div>Goodbye!</div></div></div>'],
                ['<p>Hello<br />\nWorld!<br />\nGoodbye!</p>', 'Hello<div><div><div><div>World!</div><div>Goodbye!</div></div></div></div>'],
                ['<p>Hello</p>\n\n<p>World!<br />\nGoodbye!</p>', 'Hello<div><br><div><div><div>World!<br></div><div>Goodbye!</div></div></div></div>'],
                ['<p>Hello<br />\nWorld!</p>\n\n<p>Goodbye!</p>', 'Hello<div><div><div><div>World!<br></div><div><br></div><div>Goodbye!</div></div></div></div>'],
                ['<p>Some <strong>bold</strong> text</p>',
                'Some <span class="Apple-style-span" style="font-weight: bold;">bold</span> text'],
                ['<p>Some <em>italic</em> text</p>',
                'Some <span class="Apple-style-span" style="font-style: italic;">italic</span> text'],
                ['<p>Some <u>underlined</u> text</p>',
                'Some <span class="Apple-style-span" style="text-decoration: underline;">underlined</span> text'],
                ['<p>Some <strong><em>bold and italic</em></strong> text</p>',
                'Some <span class="Apple-style-span" style="font-weight: bold;"><span class="Apple-style-span" style="font-style: italic;">bold and italic</span></span> text'],
                ['<p>Some <em><strong>italic and bold</strong></em> text</p>',
                'Some <span class="Apple-style-span" style="font-style: italic;"><span class="Apple-style-span" style="font-weight: bold;">italic and bold</span></span> text'],
                ['<p>Some <strong><u><em>bold, underlined, and italic</em></u></strong> text</p>',
                'Some <span class="Apple-style-span" style="font-weight: bold;"><span class="Apple-style-span" style="text-decoration: underline;"><span class="Apple-style-span" style="font-style: italic;">bold, underlined, and italic</span></span></span> text'],
                ['<p>Hello<br />\n </p>', '<div>Hello</div><div> <span class="Apple-style-span" style="font-weight: bold;"></span></div>'],
                ['<p>Hello<span id="bookmark"> </span></p>', '<div>Hello<span id="bookmark"> </span></div>'],
                ["<p><img src=\"http://www.google.com/intl/en_ALL/images/logo.gif\"></p>", "<img src=\"http://www.google.com/intl/en_ALL/images/logo.gif\">"]
            ];

            expectAsserts(cases.length);

            jQuery.each(cases, function(index, testCase) {
                assertEquals('case ' + index.toString(), testCase[0], $.fn.toupee.html.clean(testCase[1]));
            });
        }
    }
});