$(function () {
    var mdata = {};
    var url = '/js/movie.json';

    var movie = $('#c_editor').attr('movie')
    if (movie) {
        url = '/movie/find/' + movie;
    }

    $.getJSON(url, function (data) {
        $('#c_editor').val(JSON.stringify(data));
    });

    $('#c_save').on('click', function () {
        var data = {};
        mdata['content'] = JSON.parse($('#c_editor').val());
        $.ajax({
            type: 'POST',
            url: '/movie/add',
            data: mdata,
            success: function (data, textStatus) {
                if (data.success) {
                    $('#msg').html('保存成功！');
                    $('#msg').addClass('alert alert-success');
                    // $(location).attr('href','/movie/'+mdata.content.name);
                } else {
                    $('#msg').html(data.err);
                    $('#msg').addClass('alert alert-error');
                }
            }
        });
    });

});
