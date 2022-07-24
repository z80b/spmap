Drupal.behaviors.uploadComplite = function(args) {
    if (this.data && this.data.status) {
        var file = eval('('+this.data.files+')');
        if (window.currentOverlay) {
            if (window.currentOverlay.file) {
                var fid = window.currentOverlay.file.split(';').shift();
                $.getJSON('/gmapdelete/' + fid);
            }
            window.currentOverlay.file = file.fid + ';' + file.filename;
        }
        $('#edit-upload').val('');
    }
}