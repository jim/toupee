// $spec.opts.console = false;
$spec.run();
diligence.respond($spec.stats());

var summary = function() {
    var html = '', div = document.getElementById('summary');
    var stats = $spec.stats();
    
    var types = ['passed', 'failed', 'pending'];
    
    for (var i=0, l = types.length; i < l; i++) {
        var count = stats[types[i]].length;
        if (count > 0) {
            html += '<h1 class="' + types[i] + '">' + count + ' ' + types[i] + '</h1>';
        }
    }

    div.innerHTML = html;
};