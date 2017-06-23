(function(){

    var tree = raw.models.tree();

    var chart = raw.chart()
        .title('Zoomable Treemap')
        .description(
        "A space filling visualization of data hierarchies and proportion between elements. The different hierarchical levels create visual clusters through the subdivision into rectangles proportionally to each element's value. Treemaps are useful to represent the different proportion of nested hierarchical data structures.<br/>Based on <a href='http://bl.ocks.org/mbostock/4063582'>http://bl.ocks.org/mbostock/4063582</a>")
        .thumbnail("imgs/Zoom.png")
        .category('Hierarchies')
        .model(tree)

    var rawWidth = chart.number()
        .title('Width')
        .defaultValue(100)
        .fitToWidth(true)

    var rawHeight = chart.number()
        .title("Height")
        .defaultValue(500)

    var padding = chart.number()
        .title("Padding")
        .defaultValue(0)

    var fontsize = chart.number()
    	.title("Text Size")
    	.defaultValue(22)

    var colors = chart.color()
        .title("Color scale")

    chart.draw(function (selection, root){

        root.name = 'ROOT';

        var margin = {top: 20, right: 0, bottom: 0, left: 0},
            width = +rawWidth(),
            height = +rawHeight() - margin.top - margin.bottom,
            formatNumber = d3.format(",d"),
            transitioning;

        var x = d3.scale.linear()
            .domain([0, width])
            .range([0, width]);

        var y = d3.scale.linear()
            .domain([0, height])
            .range([0, height]);

        console.log(padding());
        console.log(+padding());
        var treemap = d3.layout.treemap()
            .padding(+padding())
            .children(function(d, depth) { return depth ? null : d._children; })
            .sort(function(a, b) { return a.value - b.value; })
            .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
            .value(function(d) { return 1; })
            .round(false);

        var svg = selection
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.bottom + margin.top)
            .style("margin-left", -margin.left + "px")
            .style("margin.right", -margin.right + "px")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .style("shape-rendering", "crispEdges")


        var grandparent = svg.append("g")
            .attr("class", "grandparent");

        grandparent.append("rect")
            .attr("y", -margin.top)
            .attr("width", width)
            .attr("height", margin.top)
            .style("fill", function (d) { return colors()(d.color); })
            .style("stroke","#fff")

        grandparent.append("text")
            .attr("x", 6)
            .attr("y", 6 - margin.top)
            .attr("dy", ".75em")
            
        
     
            initialize(root);
            //console.log(root);
            //throw '';
            accumulate(root);
            layout(root);
            display(root);

            function initialize(root) {
                root.x = root.y = 0;
                root.dx = width;
                root.dy = height;
                root.depth = 0;
            }

            function accumulate(d) {
                return (d._children = d.children)
                    ? d.value = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
                    : d.value;
            }

            function layout(d) {
                if (d._children) {
                    //console.log(d);
                    //throw 'stop';
                    treemap.nodes({_children: d._children});
                    d._children.forEach(function(c) {
                        //console.log(d);
                        c.x = d.x + c.x * d.dx;
                        c.y = d.y + c.y * d.dy;
                        c.dx *= d.dx;
                        c.dy *= d.dy;
                        c.parent = d;
                        //console.log(c);
                        layout(c);
                    });
                }
            }

            function display(d) {
                grandparent
                    .datum(d.parent)
                    .on("click", transition)
                    .select("text")
                    .text(name(d));

                var g1 = svg.insert("g", ".grandparent")
                    .datum(d)
                    .attr("class", "depth");

                var g = g1.selectAll("g")
                    .data(d._children)
                    .enter().append("g");

                g.filter(function(d) { return d._children; })
                    .classed("children", true)
                    .on("click", transition);

                g.selectAll(".child")
                    .data(function(d) { return d._children || [d]; })
                    .enter().append("rect")
                    .attr("class", "child")
                    .call(rect);

                g.append("rect")
                    .attr("class", "parent")
                    .call(rect)
                    .append("title")
                    .text(function(d) { return formatNumber(d.value); })
                    .style("fill", function (d) { return colors()(d.color); })
                    .style("stroke","#fff")
                    

                
                
                
 				g.append("text")
                    .style("font-size",fontsize())
                    .style("font-family","Arial, Helvetica")
                    .attr("width",150)
                    .text(function(d) { return d.label ? d.label.join(", ") : d.name; }).call(text)
      
                     ;
                   
								
                function transition(d) {
                    if (transitioning || !d) return;
                    transitioning = true;

                    var g2 = display(d),
                        t1 = g1.transition().duration(750),
                        t2 = g2.transition().duration(750);

                    // Update the domain only after entering new elements.
                    x.domain([d.x, d.x + d.dx]);
                    y.domain([d.y, d.y + d.dy]);

                    // Enable anti-aliasing during the transition.
                    svg.style("shape-rendering", null);

                    // Draw child nodes on top of parent nodes.
                    svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

                    // Fade-in entering text.
                    g2.selectAll("text").style("fill-opacity", 0)
                    
;

                    // Transition to the new view.
                    t1.selectAll("text").call(text).style("fill-opacity", 0);
                    t2.selectAll("text").call(text).style("fill-opacity", 1)
                   
                    ;
                    t1.selectAll("rect").call(rect);
                    t2.selectAll("rect").call(rect);

                    // Remove the old node when the transition is finished.
                    t1.remove().each("end", function() {
                        svg.style("shape-rendering", "crispEdges");
                        transitioning = false;
                    });
                }

                return g;
            }

            function text(text) {
                text.attr("x", function(d) { return x(d.x) + 6; })
                    .attr("y", function(d) { return y(d.y) + 20; })
                    .attr("textLength", 200)
           		    .attr("lengthAdjust","spacingAndGlyphs")
                    
                    ;
            }

            function rect(rect) {
                rect.attr("x", function(d) { return x(d.x); })
                    .attr("y", function(d) { return y(d.y); })
                    .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
                    .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })
                    .style("fill", function (d) { return colors()(d.color); })
                    .style("stroke","#fff");
            }

            function name(d) {
                return d.parent
                    ? name(d.parent) + "." + d.name
                    : d.name;
            }


    })
})();