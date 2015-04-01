$(document).ready(function() {
    $('.search').click(function() {
        var query = $('.search-query').val();
        $.post('/texttags', {'query': query}, function(data) {
            var data = JSON.parse(data);
            var results = data.scores;
            $('#category').html(data.category);

            $('.svg-container').empty()

            var fill = d3.scale.category20();
            var size = 1000;
            var half = (size/2).toString()
            d3.layout.cloud().size([size, size])
                .words(Object.keys(results).map(function(d) {
                  console.log(d, results[d]);
                  return {text: d, size: 10 + Math.sqrt(results[d]) * 100};
                }))
                .padding(5)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function(d) { return d.size; })
                .on("end", draw)
                .start();
            function draw(words) {
              d3.select(".svg-container").append("svg")
                  .attr("width", size)
                  .attr("height", size)
                  .attr("class", "center")
                .append("g")
                  .attr("transform", "translate(" + half + "," + half + ")")
                .selectAll("text")
                  .data(words)
                .enter().append("text")
                  .style("font-size", function(d) { return d.size + "px"; })
                  .style("font-family", "Impact")
                  // .style("fill", function(d, i) { return fill(i); })
                  .attr("text-anchor", "middle")
                  .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                  })
                  .text(function(d) { return d.text; });
            }
        })
    })

    $('.search-query').keypress(function(e){
        if (e.which == 13){//Enter key pressed
            $('.search').click();//Trigger search button click event
        }
    });
})