//----------------Objects----------------
// tag::point[]
function Point(x, y) {
    this.x = x;
    this.y = y;
}
// end::point[]
// tag::segment[]
function Segment(src, tgt) {
    this.src = src;
    this.tgt = tgt;
}
// end::segment[]

//----------------Variables----------------
// tag::variables[]
var segments = [
    new Segment(new Point( 20,  20), new Point(120, 120)),
    new Segment(new Point(120,  20), new Point( 20, 120))
];
var intersectionPoints = [
    new Point(70, 70)
];
// end::variables[]

//----------------Prelude----------------
// tag::prelude[]
function prelude() {
    var sketchpad = d3.select("#sketchpad");
    svg = sketchpad.append("svg")
                   .attr("viewBox", "0 0 300 300");
    return svg;
}
// end::prelude[]

// tag::refresh[]
function refresh() {
    svg.selectAll("line:not(#dragSegment)")
       .data(segments)
       .enter()
       .append("line")
       .attrs({x1: function(d) { return d.src.x; },
               y1: function(d) { return d.src.y; },
               x2: function(d) { return d.tgt.x; },
               y2: function(d) { return d.tgt.y; }});

    svg.selectAll("circle")
       .data(intersectionPoints)
       .enter()
       .append("circle")
       .attrs({cx: function(d) { return d.x; },
               cy: function(d) { return d.y; },
               r: function(d) { return 3; }
       })
}
// end::refresh[]

//----------------Interaction----------------
// tag::interactionVariables[]
var dragging = false;
var pointBegin = new Point(0, 0);
// end::interactionVariables[]

// tag::mousedown[]
var mousedown = function() {
    dragging = true;
    pointBegin.x = d3.mouse(this)[0];
    pointBegin.y = d3.mouse(this)[1];
    fifiSeg.attrs({x1: pointBegin.x,
                   y1: pointBegin.y,
                   x2: pointBegin.x,
                   y2: pointBegin.y})
           .style("opacity", 1.0);
};
// end::mousedown[]

// tag::mousemove[]
var mousemove = function() {
    if(dragging) {
        fifiSeg.attrs({x1: pointBegin.x,
                       y1: pointBegin.y,
                       x2: d3.mouse(this)[0],
                       y2: d3.mouse(this)[1]})
               .style("opacity", 1.0);
    }
};
// end::mousemove[]

// tag::mouseup[]
var mouseup = function() {
    segments.push(new Segment(new Point(pointBegin.x, pointBegin.y),
                              new Point(d3.mouse(this)[0], d3.mouse(this)[1])));
    var sl = segments.length;
    if(sl % 2 == 0) {
        d3.request("/calculate_intersection")
          .header("Content-Type", "application/json")
          .on("error", function(error) { console.log(error); })
          .on("load", function(xhr) {
              msg = JSON.parse(xhr.response);
              if(msg.intersection) {
                  intersectionPoints.push(new Point(msg.x, msg.y));
              }
              refresh();
          })
          .post(JSON.stringify({'seg1': segments[sl-2],
                                'seg2': segments[sl-1]}));
    }
    fifiSeg.style('opacity', 0.0);
    dragging = false;
    refresh();
};
// end::mouseup[]

// tag::main[]
function setup_callbacks(svg) {
    svg.on('mousedown', mousedown)
       .on('mousemove', mousemove)
       .on('mouseup', mouseup);
}

var svg = prelude();
var fifiSeg = svg.append("line")
                 .attr('id', 'dragSegment')
                 .attrs({x1: 0, y1: 0,
                         x2: 0, y2: 0})
                 .style('stroke', 'yellow')
                 .style("opacity", 0.0);

setup_callbacks(svg);
refresh();
// end::main[]
