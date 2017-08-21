(function(){

    var nodes = raw.model();

	var source = nodes.dimension()
		.title("Source")
		.required(1);
		
	var target = nodes.dimension()
		.title("Target")
		.required(1);
		
	var linkWidth = nodes.dimension()
		.title("link Width")

	var sourceGroup = nodes.dimension()
		.title("Source Group")
		
	var targetGroup = nodes.dimension()
		.title("Target Group")
		
	var color = nodes.dimension()
        .title("Color")	
		


    nodes.map(function (data){
	
    	var sourceNode = data.map(function(d) {
    		return {   
    				node : source(d),
    				group: sourceGroup(d),
    				type  : 'node',
    				color: color(d),
    				} ; 		
    	});
    	
    	var targetNode = data.map(function(d) {
    		return {   
    				node : target(d),
    				group: targetGroup(d), 
    				type  : 'node',
    				color: color(d)
    				} ; 	
    	});
    	
    	var myRelations = data.map(function(d) {
    		return {
    				type : 'link',
    				interest: linkWidth(d),
    				source : source(d),
    				target : target(d),		
			}			
		});
		

		    		
    	var mySourceNodes = Array.from(new Set(sourceNode.map(JSON.stringify))).map(JSON.parse);
    	var myTargetNodes = Array.from(new Set(targetNode.map(JSON.stringify))).map(JSON.parse);
   	    var myNodes =  mySourceNodes.concat(myTargetNodes);
		var uniqueNodes = Array.from(new Set(myNodes.map(JSON.stringify))).map(JSON.parse);	
		var entries = uniqueNodes.concat(myRelations);
	 	
	 	var groups = d3.nest()
			.key(function (d){ return d.group; })
			.map(myNodes); 
			  	
   	    return entries.concat(groups);
   	    
     })

 	    var chart = raw.chart()
        	.title('Cartographie applicative')
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
		
	 var colors = chart.color()
         .title("Color scale")	

    	chart.draw(function (selection, data){
		
		var force = d3.layout.force()
			.nodes(data)
			.size([+width(), +height()])
			.gravity(.08)
			.charge(-100)
			.on("tick", tick)
			.on("end", function(){
			  chart.dispatchEndDrawing()
			})
			.start();

		var g = selection
			.attr("width", width)
			.attr("height", height);
	
    colors.domain(data.filter(function (d){ return d.type == "node"; }), function (d){ return d.color; });

		var link = g.selectAll("line")
			.data(data.filter(function (d){ return d.type == "link"; }))
			.enter().append("line")
				.style("stroke-width", function(d) { return d.interest ;})  
				.style("stroke", function(d) { return d.color ? colors()(d.color) : colors()(null); })
				.call(force.drag); 
	
		var node = g.selectAll("circle")
			.data(data.filter(function (d){ return d.type == "node"; }))
			.enter().append("circle")
				.attr("r", 8)
				.style("fill",  function(d) { return d.color ? colors()(d.color) : colors()(null); })
				.call(force.drag);	
					
					
		
		var text = g.selectAll("text")
			.data(data.filter(function (d){ return d.type == "node"; }))
			.enter().append("text")
					.text(function (d){ return d.node; })
					.attr("text-anchor", "top")
            		.attr("dy","4")
           			.style("font-size","11px")
           			.style("font-weight","bold")
            		.style("font-family","Arial, Helvetica")
            		.style("fill","black")
            		.call(force.drag);
					
                       
    	function tick(e) {           
       	var k = e.alpha * .1;
       	var nodes = data.filter(function (d){ return d.group; });
  		nodes.forEach(function(node) {
    		var center = nodes[node.group];
    		node.x += (center.x - node.x) * k;
    		node.y += (center.y - node.y )* k;  
   		 });

	    var q = d3.geom.quadtree(nodes),
	    i = 0,
	    n = nodes.length;
	    while (++i < n) q.visit(collide(nodes[i]));
               
        node
          .attr("cx", function(d) { return d.x = Math.max(radius(), Math.min(width() - radius(), d.x)); })
          .attr("cy", function(d) { return d.y = Math.max(radius(), Math.min(height()-10 - radius(), d.y)); });
        
    	link
          .attr("x1", function(d) { return d3.selectAll('circle').filter(function (k) { return d.source === k.node; }).attr('cx');})
          .attr("y1", function(d) { return d3.selectAll('circle').filter(function (k) { return d.source === k.node; }).attr('cy'); })	
          .attr("x2", function(d) { return d3.selectAll('circle').filter(function (k) { return d.target === k.node; }).attr('cx'); })
          .attr("y2", function(d) { return d3.selectAll('circle').filter(function (k) { return d.target === k.node; }).attr('cy'); });
		
		 text
          .attr("x", function(d) { return d.x ; })
          .attr("y", function(d) { return d.y - 12	; });       
             	
		     chart.dispatchStartDrawing()
    }
    
		function collide(node) {
  			var r = node.radius + 16,
      		nx1 = node.x - r,
     	 	nx2 = node.x + r,
      		ny1 = node.y - r,
      		ny2 = node.y + r;
 		 	return function(quad, x1, y1, x2, y2) {
    			if (quad.point && (quad.point !== node)) {
      				var x = node.x - quad.point.x,
          			y = node.y - quad.point.y,
          			l = Math.sqrt(x * x + y * y),
          			r = node.radius + quad.point.radius;
      			if (l < r) {
        			l = (l - r) / l * .5;
        			node.x -= x *= l;
        			node.y -= y *= l;
        			quad.point.x += x;
        			quad.point.y += y;
      			}
    		}
    		return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  		};
}
  })
  
})();
