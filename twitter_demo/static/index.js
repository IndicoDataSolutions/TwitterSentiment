$(document).ready(function() {
    $('.search').click(function() {
        var query = $('.search-query').val();
        $.post('/', {'query': query}, function(err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log(data);
            }
        })
    })
})