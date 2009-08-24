$spec.describe('before and after callbacks', function(spec) {
  spec.describe('before', function(spec) {
    var runs = 0;

    spec.before(function() {
        runs += 1; 
    });

    spec.it('calls before before the first spec', function(expect) {
      expect(runs).to.equal(1);
    });

    spec.it('calls before before the second spec', function(expect) {
      expect(runs).to.equal(2);
    });
  });

  spec.describe('after', function(spec) {
    var zeroed;

    spec.after(function() {
      zeroed = true; 
    });

    spec.it('calls after after the first spec', function(expect) {
      zeroed = false;
      expect(zeroed).to.be(false);
    });

    spec.it('calls after after the first spec', function(expect) {
      expect(zeroed).to.be(true);
    });
  }); 
});