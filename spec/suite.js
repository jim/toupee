include('diligence/diligence.js');

function color(command, text) {
  return "\033[" + command + "m" + text + "\033[0m";
}

function onLoad() {
    
  new diligence.Server(function(setup) {
    // setup.debug = true;
    setup.publicPath = 'diligence/public';
    setup.runnerPath = 'runner.html';
    setup.testPaths = [
      '../example/jquery-1.3.2.js',
      '../src/toupee.js',
      '../src/toupee/browser.js',
      '../src/toupee/buttons.js',
      '../src/toupee/html.js',
      '../src/toupee/selection.js',
      'dollar_spec.js',
      'toupee/html_spec.js',
      'respond.js'
    ];
    setup.process = function(browser, results) {
      
      puts('');
      puts(browser.name);
        
      if (results.failed.length > 0) {
        puts(color('31', results.failed.length.toString() + ' failures:'));
        for(var i=0,l=results.failed.length; i<l; i++) {
          puts('  *  ' + results.failed[i].name);
          puts('     ' + results.failed[i].errorName + ': ' + results.failed[i].message);
          puts('     in line ' + results.failed[i].lineNumber + ' of ' + results.failed[i].fileName);
          
          // need to do some stacktrace filtering
          // puts('     ' + results.failed[i].stack);
        }
      }
      
      if (results.pending.length > 0) {
        puts(color('33', results.pending.length.toString() + ' pending'));
      }
      
      if (results.passed.length > 0) {
        puts(color('32', results.passed.length.toString() + ' passed'));
      }

    };
  });

}