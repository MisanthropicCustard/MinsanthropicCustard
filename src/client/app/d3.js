// var data = require('./index.jsx');
// console.log('==================',data.data);
// console.log('-----------', data);
var load = function() {
  console.log('==-----',window.data1[0]);
  var counter = -1;
  var data = [];
  var names = [];
  for (var i = 0; i < window.data1.length; i++) {
    // data.push(window.data1[i].venue.stats.checkinsCount)
    data.push(window.data1[i].venue.stats.checkinsCount);
    names.push(window.data1[i].venue.name);

  }

  var r  = 140;

  var colors = d3.scaleOrdinal()
              .range(["#FFA500", "#DAA520", "#FF8C00", "#A52A2A", "#DC143C", "#B22222", "#FF4500"])

  var canvas = d3.select("#d3").append('svg')
               .attr("width", 550)
               .attr("height", 550)
  var group = canvas.append("g")
              .attr("transform", "translate(300,300)");

  var arc = d3.arc()
            .innerRadius(250)
            .outerRadius(r);

  var chart = d3.pie()
            .value(function(d) { return d; });

  var arcs = group.selectAll(".arc")
             .data(chart(data))
             .enter()
             .append("g")
             .attr("class", "arc")
  arcs.append("path")
       .attr("d", arc)
       .attr("fill", function(d) {return colors(d.data);})
       .transition()
       .ease(d3.easeLinear)
       .duration(3000)
       .attrTween("d", d3Animation);
  arcs.append("text")
       .transition()
       .ease(d3.easeLinear)
       .duration(3000)
       .attr("transform", function(d) { return "translate (" + arc.centroid(d) + ")"})
       .attr("text-anchor", "middle")
       .attr("font-size", "1.5em")
       .text(function(d) {
        counter++;
        var name = names[counter].split(' ')[0]
        return name
      })

  function d3Animation(b) {
    b.innerRadius = 0;
    var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
    return function(t) { return arc(i(t)); };
  }
}
window.load = load;