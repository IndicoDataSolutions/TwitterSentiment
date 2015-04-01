var populate = function(table, tweets) {
    $(table).empty();
    for (i=0; i<tweets.length; i++) {
        var tweet = tweets[i];

        var sentiment = tweet[0].toString();
        var text = tweet[1];

        $(table).append(
            "<tr><td>" + sentiment + "</td>" + 
            "<td>" + text + "</td></tr>"
        )
    }
}

$(document).ready(function() {
    $('.search').click(function() {
        var query = $('.search-query').val();
        $.post('/sentiment', {'query': query}, function(data) {
            var results = JSON.parse(data);
            populate('#table-positive', results.most_positive);
            populate('#table-negative', results.most_negative);
            $('#average').html(results.average.toFixed(2).toString());
        });
    })

    $('.search-query').keypress(function(e){
        if (e.which == 13){//Enter key pressed
            $('.search').click();//Trigger search button click event
        }
    });
})