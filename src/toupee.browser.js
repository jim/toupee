(function($) {
    /** 
    *  Feature detection isn't going to work in this case.
    *  So we kick it old school. 
    **/
    var sniffles = {
        ie:     !!(window.attachEvent && !window.opera), 
        ie7:    (/MSIE\s7/).test(navigator.appVersion), 
        ie6:    (/MSIE\s6/).test(navigator.appVersion), 
        opera:  !!window.opera, 
        webkit: (/AppleWebKit/).test(navigator.appVersion),
        khtml:  (/Konqueror|Safari|KHTML/).test(navigator.userAgent), 
        gecko:  (/Gecko/).test(navigator.userAgent) && !(/KHTML/).test(navigator.userAgent)
    };
    $.fn.toupee.browser = sniffles;
})(jQuery);