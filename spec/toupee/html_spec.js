$spec.describe('toupee.html', function(spec) {
  spec.describe('sanitize', function(spec) {
    
    var s = $.fn.toupee.html.sanitize;
    
    spec.it('does not alter simple strings', function(expect) {
      expect(s("Hello")).to.equal("Hello");
    });
    
    spec.it('removes prohibited tags', function(expect) {
      expect(s("<strong>Hello</strong>")).to.equal("Hello");
    });
    
    spec.it('removes nested prohibited tags', function(expect) {
      expect(s("<em><strong>Hello</strong></em>")).to.equal("Hello");
    });
    
    spec.it('allows whitelisted tags', function(expect) {
      expect(
        s("<strong>Hello</strong>", { tags: ['strong']})
      ).to.equal(
        "<strong>Hello</strong>"
      );
    });
    
    spec.it('allows only whitelisted tags', function(expect) {
      expect(
        s("<strong><em>Hello</em></strong>", { tags: ['strong']})
      ).to.equal(
        "<strong>Hello</strong>"
      );
    });
    
    spec.it('allows multiple whitelisted tags', function(expect) {
      expect(
        s("<strong><em>Hello</em></strong>", { tags: ['em', 'strong']})
      ).to.equal(
        "<strong><em>Hello</em></strong>"
      );
    });
    
    spec.it('preserves text nodes', function(expect) {
      expect(
        s("<p><strong><em>Hello</em></strong> World!</p>", { tags: ['strong']})
      ).to.equal(
        "<strong>Hello</strong> World!"
      );
    });
    
    spec.it('strips all attributes by default', function(expect) {
      expect(
        s("<a href='http://www.google.com/' title=\"Google\">Google</a>", { tags: ['a']})
      ).to.equal(
        "<a>Google</a>"
      );
    });
    
    spec.it('allows whitelisted attributes', function(expect) {
      expect(
        s('<a href="http://www.google.com/" title=\"Google\">Google</a>', { tags: ['a'], attributes: ['href']})
      ).to.equal(
        '<a href="http://www.google.com/">Google</a>'
      );
    });
    
    spec.it('preserves span ids', function(expect) {
      var html = 'Hello<span id="bookmark"> </span>';
      expect(
        s(html, {tags: ['span'], attributes: ['id']})
      ).to.equal(html);
    });
    
    spec.it('preserves image attributes', function(expect) {
      var html = '<img src="http://www.google.com/intl/en_ALL/images/logo.gif">';
      expect(
        s(html, {tags: ['img'], attributes: ['src', 'href']})
      ).to.equal(html);
    });
    
  });
  
  spec.describe('gsub', function(spec) {
    
    var original = 'foo boo boz';
    var g = $.fn.toupee.html.gsub;
    
    spec.it('uses a replacement function 1', function(expect) {
      expect(
        g(original, /[^o]+/, function(match) {
          return match[0].toUpperCase();
        })
      ).to.equal('Foo Boo BoZ');
    });
    
    spec.it('uses a replacement function 2', function(expect) {
      expect(
        g(original, /o+/, function(match) {
          return match[0].length;
        })
      ).to.equal('f2 b2 b1z');
    });
    
    spec.it('uses a replacement function 3', function(expect) {
      expect(
        g(original, /o+/, function(match) {
          return match[0].length % 2;
        })
      ).to.equal('f0 b0 b1z');
    });
    
  });
  
});