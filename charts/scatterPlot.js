(function(){

	var points = raw.models.points();

	var chart = raw.chart()
		.title('Scatter Plot')
		.description(
            "A scatter plot, scatterplot, or scattergraph is a type of mathematical diagram using Cartesian coordinates to display values for two variables for a set of data. The data is displayed as a collection of points, each having the value of one variable determining the position on the horizontal axis and the value of the other variable determining the position on the vertical axis. This kind of plot is also called a scatter chart, scattergram, scatter diagram, or scatter graph.")
		.thumbnail("imgs/scatterPlot.png")
	    .category('Dispersion')
		.model(points)

	var width = chart.number()
		.title("Width")
		.defaultValue(1000)
		//.fitToWidth(true)

	var height = chart.number()
		.title("Height")
		.defaultValue(1000)

	
	var topLeft = chart.texty()
		.title("topLeft")
		.defaultValue("Urgent")
	var topRight = chart.texty()
		.title("topRight")
		.defaultValue("Essentiel")
	var bottomLeft = chart.texty()
		.title("BottomLeft")
		.defaultValue("Bon à prendre")
	var bottomRight = chart.texty()
		.title("BottomRight")
		.defaultValue("Tâches de fond")
	var hs = chart.texty()
		.title("Horizontal scale")
		.defaultValue("Importance")
	var vs = chart.texty()
		.title("Vertical scale")
		.defaultValue("Urgence")
		
		
	var maxRadius = chart.number()
		.title("max radius")
		.defaultValue(20)

	var useZero = chart.checkbox()
		.title("set origin at (0,0)")
		.defaultValue(false)

	var colors = chart.color()
		 .title("Color scale")

	var showPoints = chart.checkbox()
		.title("show points")
		.defaultValue(false)
			
	chart.draw(function (selection, data){

		// Retrieving dimensions from model
		var x = points.dimensions().get('x'),
			y = points.dimensions().get('y');

		var g = selection
			.attr("width", +width() )
			.attr("height", +height() )
			.append("g")

		var marginLeft = 50 +  d3.max([maxRadius(),(d3.max(data, function (d) { return (Math.log(d.y) / 2.302585092994046) + 1; }) * 9)]),
			marginBottom = 20,
			w = width() - marginLeft,
			h = height() - marginBottom;

		var xExtent = !useZero()? d3.extent(data, function (d){ return d.x; }) : [-d3.max(data, function (d){ return d.x; }), d3.max(data, function (d){ return d.x; })],
			yExtent = !useZero()? d3.extent(data, function (d){ return d.y; }) : [-d3.max(data, function (d){ return d.y; }), d3.max(data, function (d){ return d.y; })];

		var xScale = x.type() == "Date"
				? d3.time.scale().range([120,width()-120-maxRadius()]).domain(xExtent)
				: d3.scale.linear().range([120,width()-maxRadius()-120]).domain(xExtent),
			yScale = y.type() == "Date"
				? d3.time.scale().range([h - 105- marginLeft - maxRadius(), 200]).domain(yExtent)
				: d3.scale.linear().range([h- 105 -marginLeft - maxRadius() , 200 ]).domain(yExtent),
			sizeScale = d3.scale.linear().range([1, Math.pow(+maxRadius(),2)*Math.PI]).domain([0, d3.max(data, function (d){ return d.size; })]),
			xAxis = d3.svg.axis().scale(xScale);
    		yAxis = d3.svg.axis().scale(yScale).orient("left");
						
		
        g.append("g")
            .attr("class", "x axis")
            .style("stroke-width", "5px")
        	//.style("font-size","9px")
        	.style("font-family","Arial, Helvetica")
            .attr("transform", "translate(" + 0 + "," + (height()/2) + ")")
            
            .call(xAxis).selectAll("text").remove();

      	g.append("g")
            .attr("class", "y axis")
            .style("stroke-width", "5px")
           // .style("font-size","9px")
			.style("font-family","Arial, Helvetica")
            .attr("transform", "translate(" + (width()/2) + "," + 0 + ")")
            
            .call(yAxis).selectAll("text").remove();

        d3.selectAll(".y.axis line, .x.axis line, .y.axis path, .x.axis path")
         	.style("shape-rendering","crispEdges")
         	.style("fill","none")
         	.style("stroke","#ccc")
         	
         	
         

		var circle = g.selectAll("g.circle")
			.data(data)
			.enter().append("g")
			.attr("class","circle")
			
	    var rect = g.selectAll("g.rect")
	    	.data(data)
	    	.enter().append("g")
	    	.attr("class","rect")

		var point = g.selectAll("g.point")
			.data(data)
			.enter().append("g")
			.attr("class","point")

		colors.domain(data, function(d){ return d.color; });

    	circle.append("circle")
            .style("fill", function(d) { return colors() ? colors()(d.color) : "#eeeeee"; })
            .style("fill-opacity", .9)
    	    .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
    	    .attr("r", function (d){ return Math.sqrt(sizeScale(d.size)/Math.PI); });

    	point.append("circle")
            .filter(function(){ return showPoints(); })
            .style("fill", "#000")
            .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
            .attr("r", 1);

    	circle.append("text")
    	    .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
    		.attr("text-anchor", "middle")
    		.style("font-size","20px")
    		.attr("dy", 15)
    		.style("font-family","Arial, Helvetica")
    	  	.text(function (d){ return d.label? d.label.join(", ") : ""; });
    	
		g.append('line')
					.attr('x1',100)
					.attr('y1',  height()/2)
					.attr('x2', width()-100)
					.attr('y2',  height()/2)
					.style("shape-rendering","crispEdges")
					.attr('stroke', "DarkGrey ")
					.attr('stroke-width', 10);
					
		
		
		g.append('line')
					.attr('x1',width()/2)
					.attr('y1', 100 )
					.attr('x2', width()/2)
					.attr('y2', height()-100 )
					.style("shape-rendering","crispEdges")
					.attr('stroke', "DarkGrey ")
					
					.attr('stroke-width', 10); 

    

			text = g.append('text').text(topLeft()).attr('dy', '1.35em').attr('x', width()/4 - 40)
			   	    .attr('y', 80).style("font-size","25px");
			text = g.append('text').text(bottomLeft()).attr('dy', '1.35em').attr('x',width()/4 - 40)
			   	    .attr('y', height()-160).style("font-size","25px");
			text = g.append('text').text(topRight()).attr('dy', '1.5em').attr('x', width()/2+80)
			   	    .attr('y', 80).style("font-size","25px");
			text = g.append('text').text(bottomRight()).attr('dy', '1.5em').attr('x', width()/2+65)
			   	    .attr('y', height()-160).style("font-size","25px");
			text = g.append('text').text(vs()).attr('dy', '1.5em').attr('x',70)
			   	    .attr('y', height()/2-130).style("font-size","40px").attr("writing-mode","tb-rl");			
			text = g.append('text').text(hs()).attr('dy', '1.5em').attr('x', width()/2-100)
			   	    .attr('y', height()-110).style("font-size","40px");		
			   	    
			
			 	var g2 = items.selectAll('g')
					.data(function(d){ var p = []; d.value.forEach(function(dd){ p = p.concat(dd); }); return p; });	
				
				var gEnter = g2.enter().append("g");				
					
		
			
			var slider = g2.append("g")
			.attr("class", "slider")
			.attr("transform", "translate(" + margin.left + "," + height -80 + ")");

			slider.append("line")
   		    .attr("class", "track")
			.attr("x1", x.range()[0])
			.attr("x2", x.range()[1])
				.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
				.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
			.attr("class", "track-overlay")
			.call(d3.drag()
			.on("start.interrupt", function() { slider.interrupt(); })
			.on("start drag", function() { hue(x.invert(d3.event.x)); }));

			slider.insert("g", ".track-overlay")
			.attr("class", "ticks")
			.attr("transform", "translate(0," + 18 + ")")
			.selectAll("text")
			.data(x.ticks(10))
			.enter().append("text")
			.attr("x", x)
			.attr("text-anchor", "middle")
			.text(function(d) { return d + "°"; });
			
			var handle = slider.insert("circle", ".track-overlay")
			.attr("class", "handle")
			.attr("r", 9);

			slider.transition() // Gratuitous intro!
    			.duration(750)
    			.tween("hue", function() {
      			var i = d3.interpolate(0, 70);
      			return function(t) { hue(i(t)); };
    			});

			function hue(h) {
  			handle.attr("cx", x(h));
  			svg.style("background-color", d3.hsl(h, 0.8, 0.8));
			}    	   	    
			
		

	})

})();