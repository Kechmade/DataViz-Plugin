(function(){

    var nodes = raw.model();

	var source = nodes.dimension()
		.title("Source")
		.required(1);
		
	var target = nodes.dimension()
		.title("Target")
		.required(1);


    nodes.map(function (data){
	
    	var sourceNode = data.map(function(d) {
    		return {   
    				node : source(d),
    				type  : 'node'
    				} ; 
    		
    	});
    	
    	var targetNode = data.map(function(d) {
    		return {   
    				node : target(d),
    				type  : 'node'
    				} ; 
    		
    	});
    	
    	var myRelations = data.map(function(d) {
    		return {
    				type : 'link',
    				source : source (d),
    				target : target(d),
			
			}
		});
    		
    	var mySourceNodes = Array.from(new Set(sourceNode.map(JSON.stringify))).map(JSON.parse);
    	var myTargetNodes = Array.from(new Set(targetNode.map(JSON.stringify))).map(JSON.parse);
    
   	    var myNodes =  mySourceNodes.concat(myTargetNodes);

		var uniqueNodes = Array.from(new Set(myNodes.map(JSON.stringify))).map(JSON.parse);
		return uniqueNodes.concat(myRelations);
   	    
     })

    var chart = raw.chart()
        .title('Another test')
        .description(
            "Cartographie applicative")
        .thumbnail("imgs/clusterForce.png")
        .category('Hierarchy (weighted)')
        .model(nodes)

    var width = chart.number()
        .title("Width")
        .defaultValue(1000)
        .fitToWidth(true)

    var height = chart.number()
        .title("Height")
        .defaultValue(500)
        
    var radius = chart.number()
        .title("Radius")
        .defaultValue(6)


    chart.draw(function (selection, data){

//     d3.layout.pack()
//             .sort(null)
//             .size([+width(), +height()])
//             .padding(d3.max([2,10]))
//             .children(function (d) { return d.values; })
//             .value(function (d) { return +d.size; })
//             .nodes({
//                 values: d3.nest()
//                     .key(function (d) { return d.type; })
//                     .entries(data)
//                 }
//             );

    var force = d3.layout.force()
        .nodes(data)
        .size([+width(), +height()])
        .gravity(.08)
        .charge(-10)
        .on("tick", tick)
        .on("end", function(){
          chart.dispatchEndDrawing()
        })
        .start();

    var g = selection
        .attr("width", width)
        .attr("height", height);


    var link = g.selectAll("line")
        .data(data.filter(function (d){ return d.type == "link"; }))
        .enter().append("line")
            .style("stroke-width", "0.5")
            .style("stroke", "grey")
            .call(force.drag); 
    
    var node = g.selectAll("circle")
        .data(data.filter(function (d){ return d.type == "node"; }))
        .enter().append("circle")
        .attr("r", 5)
        .style("fill", "blue")
            .call(force.drag);
            
            
    function tick(e) {
        node
          .attr("cx", function(d) { return d.x = Math.max(radius(), Math.min(width() - radius(), d.x)); })
          .attr("cy", function(d) { return d.y = Math.max(radius(), Math.min(height()-10 - radius(), d.y)); });

  	        
    	link
          .attr("x1", function(d) { return d3.selectAll('circle').filter(function (k) { return d.source === k.node; }).attr('cx');})
          .attr("y1", function(d) { return d3.selectAll('circle').filter(function (k) { return d.source === k.node; }).attr('cy'); })	
          .attr("x2", function(d) { return d3.selectAll('circle').filter(function (k) { return d.target === k.node; }).attr('cx'); })
          .attr("y2", function(d) { return d3.selectAll('circle').filter(function (k) { return d.target === k.node; }).attr('cy'); });
		
		     chart.dispatchStartDrawing()

    }
    

  })

})();
