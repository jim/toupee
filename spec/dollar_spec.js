//  DollarSpec
//  JavaScript testing with minimal syntax

var $spec = (function() {

    // public methods
    var matcher, matchers, verbs, describe, it, report, reportToConsole, run, stats;

    // private methods
    var pass, pend, fail;

    // private properties
    var specs, failed, passed, pending, runners;
    
    passed = [];
    failed = [];
    pending = [];
    matchers = {};
    verbs = [];
    runners = [];
    specs = [];
    
    var Runner = function(namespaces, befores, afters) {
                
        // public methods
        var before, after, it, describe;

        // private properties
        var befores, afters;

        befores = [];
        afters = [];
        
        before = function(callback) { befores.push(callback) };
        this.before = before;

        after = function(callback) { afters.push(callback) };
        this.after = after;

        it = function(name, method) {
            var completeName = namespaces.join(' ') + ' ' + name;
            specs.push([completeName, method, befores, afters]);
        };
        this.it = it;
        
        describe = function(namespace, callback) {
            var newNamespaces = namespaces.slice(0);
            newNamespaces.push(namespace);
            var newBefores = befores.slice(0);
            var newAfters = afters.slice(0);
            var runner = new Runner(newNamespaces, newBefores, newAfters);
            callback.call({}, runner);
        };
        this.describe = describe;
    };    
    
    describe = function(namespace, callback) {
        var runner = new Runner([namespace], [], []);
        callback.call({}, runner);
    };
    
    run = function() {
        
        var execute = function(methods) {
            for (var i=0,l=methods.length; i<l; i++) {
                methods[i].call({});
            }
        };
        
        for (var i=0, l=specs.length; i < l; i++) {
            
            var spec, name = specs[i][0], method = specs[i][1];
            var befores = specs[i][2], afters = specs[i][3];
            spec = new $spec.Spec(name, method);
            
            execute(befores);
            try {
                spec.run();
                if (spec.success() === true) {
                    pass(spec);
                } else if (spec.success() === false) {
                    fail(spec);
                } else {
                    pend(spec);
                }
            } catch(e) {
                spec.recover(e);
                fail(spec);
            }
            execute(afters);
        }
        
        if ($spec.opts.console) {
            console.debug(reportToConsole());
        }
    };
    
    report = function() {        
        var response = {};
        var build = function(collection, name, specs) {
            response[name] = [];
            for (var i=0,l=specs.length; i < l; i++) {
                var spec = specs[i]
                response[name].push({
                    name: spec.name(),
                    success: spec.success(),
                    message: spec.message()
                });
            }
        };
        
        build(response, 'passed', passed);
        build(response, 'failed', failed);        
        build(response, 'pending', pending);

        return response;
    };
    
    reportToConsole = function() {
        return "There are " + passed.length.toString() + ' passing, '
                            + failed.length.toString() + ' failing, and '
                            + pending.length.toString() + ' pending specs!';
    };
    
    matcher = function(name, method) {
      matchers[name] = method;
    };
    
    verb = function(name, method) {
      verbs.push([name, method]);
    };
    
    pass = function(spec) {
        passed.push(spec);
        if ($spec.opts.console) {
            console.info('PASS ' + spec.name());
        }
    };
    
    pend = function(spec) {
        pending.push(spec);
        if ($spec.opts.console) {
            console.warn('PENDING ' + spec.name());
        }
    };
    
    fail = function(spec) {
        failed.push(spec);
        if ($spec.opts.console) {
            console.error('FAIL ' + spec.name() + ': ', spec.message());
        }
    };
    
    map = function(array) {
      var result = [];
      for (var i=0,l=array.length; i<l; i++) {
        var spec = array[i];
        result.push(spec.data());
      }
      return result;
    };
    
    stats = function() {
        return { passed: map(passed),
                 failed: map(failed),
                 pending: map(pending) };
    };
    
    return {
        matcher: matcher,
        verb: verb,
        verbs: verbs,
        describe: describe,
        it: it,
        run: run,
        report: report,
        reportToConsole: reportToConsole,
        matchers: matchers,
        stats: stats
    };

})();

$spec.opts = {
    console: true,
    verbose: true
};$spec.matcher('be', function(result) {
  
  var actualName = this.actual == null ? 'null' : this.actual.toString();
  var expectedName = this.expected == null ? 'null' : this.expected.toString();

  result.failure = "Expected " + actualName + " to be the same as " + expectedName;
  result.negatedFailure = "Expected " + actualName + " to not be the same as " + expectedName;

  var actual = typeof(this.actual) == 'function' ? this.actual() : this.actual;
  
  return this.expected === actual;
});

$spec.matcher('beA', function(result) {
  result.failure = "Expected an instance of " + this.klass.toString() + ", but it was " + typeof(this.actual);
  result.negatedFailure = "Expected instance of a class other than " + this.klass.toString() + ", but it was one";
  
  return this.actual instanceof(this.klass);
});

$spec.matcher('equal', function(result) {
  
  var actual = typeof(this.actual) == 'function' ? this.actual() : this.actual;
  
  result.failure = "Expected " + actual.toString() + " to be the same as " + this.expected.toString();
  result.negatedFailure = "Expected " + actual.toString() + " to not be the same as " + this.expected.toString();
  
  return this.expected == actual;
});

$spec.matcher('change', function(result) {
  result.failure = 'Expected ' + originalValue + ' to change, but it did not';
  result.negatedFailure = 'Expected ' + originalValue + ' to not change, but it did';  

  var originalValue = this.affected();
  this.actual();
  var newValue = this.affected();
  
  return originalValue !== newValue;
});

$spec.matcher('changeBy', function(result) {
  var originalValue = this.affected();
  this.actual();
  var newValue = this.affected();
  var difference = newValue - originalValue;
  
  result.failure = 'Expected ' + originalValue + ' to change by ' + this.amount.toString() + ', but it changed by ' + difference.toString();
  result.negatedFailure = 'Expected ' + originalValue + ' to not change by ' + this.amount.toString() + ', but it did';
  
  return difference === this.amount;
});

$spec.matcher('raiseError', function(result) {
  result.failure = "Expected an error to be raised, but it was not";
  result.negatedFailure = "Expected an error to not be raised, but it was";
  
  var verify = this.verify || function(e) {
    return e instanceof(Error);
  };
  
  try {
    this.actual();
    return false;
  } catch(e) {
    return verify(e);
  }
  
});$spec.verb('by', function(amount) {
  this.set('amount', amount);
  this.set('matcher', 'changeBy');
  return this;
});

$spec.verb('not', function() {
  this.set('negated', true);
  return this;
});

$spec.verb('equal', function(expected) {
  this.set('matcher', 'equal');
  this.set('expected', expected);
  return this;
});

$spec.verb('beNull', function(expected) {
  this.set('matcher', 'be');
  this.set('expected', expected);
  return this;
});

$spec.verb('change', function(affected) {
  this.set('matcher', 'change');
  this.set('affected', affected);
  return this;
});

$spec.verb('be', function(expected) {
  this.set('matcher', 'be');
  this.set('expected', expected);
  return this;
});

$spec.verb('beA', function(klass) {
  this.set('matcher', 'beA');
  this.set('klass', klass);
  return this;
});

$spec.verb('beAn', function(klass) {
  this.set('matcher', 'beA');
  this.set('klass', klass);
  return this;
});

$spec.verb('raiseError', function(verify) {
  this.set('matcher', 'raiseError');
  this.set('verify', verify);
});var Scope = function() {

  var data = {};

  for (var i =0, l = $spec.matchers.length; i < l; i++) {
    this[$spec.matchers[i][0]] = $spec.matchers[i][1];
  }

  for (var i =0, l = $spec.verbs.length; i < l; i++) {
    this[$spec.verbs[i][0]] = $spec.verbs[i][1];
  }

  this.to = this;

  this.set = function(name, value) {
    data[name] = value;
  };
  
  this.data = function() {
    return data;
  };
};

$spec.Spec = function(name, method) {
    var expectations = [];
    var data = {};
    var scope;

    data.name = name;

    var clearStack = function() {
      scope.set('name', name);
      var meta = {};
      
      result = $spec.matchers[scope.data().matcher].call(scope.data(), meta);
      
      if (scope.data().negated === true) {
        scope.set('result', !result);
        if ((!result) === false && meta.negatedFailure) {
          scope.set('message', meta.negatedFailure);
        }
      } else {
        scope.set('result', result);
        if ((result) === false && meta.failure) {
          scope.set('message', meta.failure);
        }
      }

      expectations.push(scope.data());
    }

    var run = function() {
      var expecter = function(actual) {
        if (typeof(scope) != 'undefined') {
          clearStack();
        }
        scope = new Scope();
        scope.set('actual', actual);
        scope.set('name', name);
        return scope;
      };
      
      var returned = method.call({}, expecter);
      if (typeof(scope) != 'undefined') {
        clearStack();
      }     
      if (returned === false || expectations.length == 0) {
          data.success = null;
          return;
      // } else if (result === true) {
          // data.success = undefined;
      } else {
        for (var i=0, l=expectations.length; i<l; i++) {
          var e = expectations[i];
          if (e.result == false) {
            data.success = false; 
            data.message = e.message;
            return;
          }
        }
        data.success = true;
      }

    };
    this.run = run;
    
    this.success = function() {
        return data.success;
    };

    this.message = function() {
        return data.message;
    };
    
    this.name = function() {
        return data.name;
    };
    
    this.data = function() {
      return data;
    };
    
    this.recover = function(exception) {
      data.success = false;
      data.errorName = exception.name;
      data.message = exception.message;
      data.fileName = exception.fileName;
      data.lineNumber = exception.lineNumber;
      data.stack = exception.stack;
    };

};

