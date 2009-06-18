TestCase('plugin initialization', {
    testInitialization: function() {
        expectAsserts(1);
        assertEquals('message', typeof($.fn.toupee), 'function');
    }
});