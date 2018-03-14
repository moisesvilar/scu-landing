$(document).ready(function() {
    var $mailAnchors = $('a.email');
    $mailAnchors.on('hover', function() {
        var $mailAnchor = $(this);
        var user = $mailAnchor.data('user');
        var domain = $mailAnchor.data('domain');
        var emailAddress = `${user}@${domain}`;
        $mailAnchor.attr('href', `mailto:${emailAddress}`);
    });
});