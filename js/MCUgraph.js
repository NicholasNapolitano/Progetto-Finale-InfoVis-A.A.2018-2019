	d3.json("data/MCUNodes.json").then(function(nodi) {
		d3.json("data/MCUEdges.json").then(function(archi) {

			var nodi_id_eroe = [];
			var nodi_id_film = [];
			var nodi_eroe = [];
			var nodi_film = [];
			var edge_graph = [];
			var nodi_poteri = [];
			var nodi_date = [];
			var nodi_fase = [];
			
			//var result = [];
			nodi.forEach(function(value, index) {
				Object.keys(value).forEach(function(v, i) {
					//console.log(v);
					element = value[v];
					//console.log(element);
					if(v == "id"){
						if(element[0] == "h")
						    nodi_id_eroe.push(element);
						else
						    nodi_id_film.push(element);
					}
					else{
						//console.log(element);
						Object.keys(element).forEach(function(k, i) {
							help = element[k];
							//console.log(help);
							if(help["key"] == "hero"){
								 nodi_eroe.push(help["value"]);
								 nodi_poteri.push(help["Power"]);
							}
							else{
								 nodi_film.push(help["value"]);
								 nodi_fase.push(help["Phase"]);
								 nodi_date.push(help["Date"]);
							}
						})
					}
				})
			})
			/*console.log(nodi_id_eroe);
			console.log(nodi_id_film);
			console.log(nodi_eroe);
			console.log(nodi_film);
			console.log(nodi_poteri);
			console.log(nodi_fase);
			console.log(nodi_date);*/

			

			archi.forEach(function(value, index) {
				tmp = {"sorgente":value["source"],
					   "destinazione":value["target"]};
				edge_graph.push(tmp);
			})

			
			function getHeroes(id_film){
				//console.log(id_film);
				var heroes = [];
				archi.forEach(function(value, index) {
					element = value;
					//console.log(element.target);
						if(element.target == id_film){
						    //console.log(element.source);
							heroes.push(element.source);
						}
					})
				//console.log(heroes);
			    return heroes;
			}
	
			function getFilms(id_hero){
				//console.log(id_hero);
				var films = [];
				archi.forEach(function(value, index) {
					element = value;
					//console.log(element.target);
						if(element.source == id_hero){
						    //console.log(element.target);
							films.push(element.target);
						}
					})
				//console.log(films);
			    return films;
			}
	
			function updateColorHeroes(hero,color){
				for(var i=0; i<NodeData.length;i++){
					var tmp = NodeData[i];
					if(tmp.id==hero){
						tmp.color = color;
					}	
				}
			}

			function updateColorFilms(film,color){
				for(var i=0; i<NodeData.length;i++){
					var tmp = NodeData[i];
					if(tmp.id==film){
						tmp.color = color;
					}	
				}
			}

			function drawEdges(node_id){
                var PolygonData = [];
				console.log(node_id);
				//disegno archi
				var start;
				var ends = [];

			    //console.log(NodeData);
					for (var i = 0; i < (NodeData.length); i++) {
					  if(node_id == NodeData[i].id)
					      start = ({"id":node_id,"cx":parseInt(NodeData[i].cx,10),"cy":parseInt(NodeData[i].cy,10)});
				  }  

				  for (var j = 0; j < edge_graph.length; j++) {
					for (var i = 0; i < (NodeData.length); i++) {
						if(start.id==edge_graph[j].sorgente && NodeData[i].id == edge_graph[j].destinazione){
							ends.push({"id":edge_graph[j].destinazione,"cx":parseInt(NodeData[i].cx,10),"cy":parseInt(NodeData[i].cy,10)});
							break;
						}
						else if(start.id==edge_graph[j].destinazione && NodeData[i].id == edge_graph[j].sorgente){
							ends.push({"id":edge_graph[j].sorgente,"cx":parseInt(NodeData[i].cx,10),"cy":parseInt(NodeData[i].cy,10)});
							break;
						}
					}
				}
                console.log("inizio");
				console.log(start);
				console.log("fine");
				console.log(ends);

		for (var i = 0; i < ends.length; i++) {
			
			if ((start.cx < ends[i].cx)){
			
				var line = svg.append("line")
				.style("stroke", "black")
                .attr("x1", start.cx+x)
                .attr("y1", start.cy+y1/2)
                .attr("x2", ends[i].cx)
				.attr("y2", ends[i].cy+y1/2)
				.attr("marker-end", "url(#end)");

			}


		    if(start.cx>ends[i].cx){
		
			var line = svg.append("line")
			.style("stroke", "black")
			.attr("x1", start.cx)
			.attr("y1", start.cy+y1/2)
			.attr("x2", ends[i].cx+x)
			.attr("y2", ends[i].cy+y1/2);

			}
			
			
		}	
	}
			

	function showMoreInformation(node){
		var value1=node.nome;
		var queryString = "?para1=" + value1;
		if(node.id[0] == "h")
			 window.open("moreHeroInfo.html"+queryString,"_blank");
		else
			 window.open("moreFilmInfo.html"+queryString,"_blank");
	}




            




			//console.log(edge_graph);

			var x = 20;
			var y1 = 15;
			var y2 = 15;

			//Margini 
            var margin = {
	        top: 20,
	        right: 40,
	        bottom: 40,
	        left: 80
            },

            width = 1280 - margin.left - margin.right,  //Larghezza
            height = 615 - margin.top - margin.bottom;  //Altezza

            //SVG
			var svg = d3.select(".viz-portfolio-delinquent-status").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.style("border", "1px solid black")
			//.style(".background","url('https://www.filmpost.it/wp-content/uploads/2019/01/Top-10-attori-non-in-Marvel-Cinematic-Universe-11-1280x720.jpg') center")
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			
		
		    //disegno nodi
			var NodeData =[];

			//var xspacing = (width)/nodi_eroe.length/1.5;
		    var yspacing = (height)/nodi_eroe.length*1.1;
			
			for (var i = 0; i < nodi_eroe.length; i++) {
				var startx = width - 150*2;
				var starty = height-19;
				NodeData.push({"nome": nodi_eroe[i], "cx": startx+100, "cy": starty-(i*yspacing/1.1), "x": x, "y": y2, "color" : "blue", "id":nodi_id_eroe[i], "power": nodi_poteri[i]});
				svg.append("text").attr("id", nodi_id_eroe[i]).attr("x", startx+180).attr("y", starty-(i*yspacing)/1.1 + 13)
		        .attr("font-weight",800).text(nodi_eroe[i]).style("font-size", "11.5px").attr("alignment-baseline","middle");
			}


			for (var i = 0; i < nodi_film.length; i++) {
				var startx = 150+40;
				var starty = height-29;
				NodeData.push({"nome": nodi_film[i], "cx": startx, "cy": starty-(i*yspacing*1.05), "x": x, "y": y1, "color" : "orange", "id":nodi_id_film[i], "phase": nodi_fase[i], "date": nodi_date[i]});
				svg.append("text").attr("id", nodi_id_film[i]).attr("x", startx-240).attr("y", starty-(i*yspacing)*1.05 + 11)
		        .attr("font-weight",800).text(nodi_film[i]).style("font-size", "11.5px").attr("alignment-baseline","middle");
			}

            console.log(NodeData);

			//disegno archi
			var sorgente = [];
			var destinazione = [];
			//console.log(NodeData);
			for (var j = 0; j < edge_graph.length; j++) {
			  for (var i = 0; i < (NodeData.length); i++) {
				//console.log(NodeData[i].id);
				if (NodeData[i].id==edge_graph[j].sorgente){
					sorgente.push({"id":NodeData[i].id,"cx":parseInt(NodeData[i].cx,10),"cy":parseInt(NodeData[i].cy,10)});
				}
				if (NodeData[i].id==edge_graph[j].destinazione){
					destinazione.push({"id":NodeData[i].id,"cx":parseInt(NodeData[i].cx,10),"cy":parseInt(NodeData[i].cy,10)});
				}
			  }
			}

			/*for (var i = 0; i < destinazione.length; i++) {
			
				if ((sorgente[i].cx < destinazione[i].cx)){
				
					var line = svg.append("line")
					.style("stroke", "black")
					.attr("x1", sorgente[i].cx+x)
					.attr("y1", sorgente[i].cy+y1/2)
					.attr("x2", destinazione[i].cx)
					.attr("y2", destinazione[i].cy+y1/2)
					.attr("marker-end", "url(#end)");
	
				}
	
	
				if(sorgente[i].cx>destinazione[i].cx){
			
				var line = svg.append("line")
				.style("stroke", "black")
				.attr("x1", sorgente[i].cx)
				.attr("y1", sorgente[i].cy+y1/2)
				.attr("x2", destinazione[i].cx+x)
				.attr("y2", destinazione[i].cy+y1/2);
	
				}
			}*/
			
			

			//console.log("Sorgenti");
			//console.log(sorgente);
			//console.log("Destinazioni");
			//console.log(destinazione);
			
			// define tooltip
		    // create a tooltip
	        var new_tooltip = d3.select(".viz-portfolio-delinquent-status")
	        .append("div")
	        .attr("class", "tooltip")

	         new_tooltip.append('div')                           
			 .attr('class', 'descr');
			 
			 new_tooltip.style("visibility", "visible");
	            
		     svg.selectAll("rect")
		    .data(NodeData)
		    .enter()
			.append("rect")
			.attr("fill", d=> d.color)
		    .attr("x", d=> d.cx)
		    .attr("y", d=> d.cy)
		    .attr("width", x)
			.attr("height", d=>d.y)
			.on('mouseover', function(d){  
				new_tooltip.style("visibility", "visible");                        
				if(d.color =="orange"){
					new_tooltip.select('.descr').html(d.phase.bold() + "  ;  ".bold() + d.date.bold());     
			        new_tooltip.style('display', 'block')
					var tmp = getHeroes(d.id);
					for(var i=0; i<tmp.length; i++){
						    //console.log(tmp[i]);
							updateColorHeroes(tmp[i],"green");
			                
					}
					drawEdges(d.id);
					svg.append("rect").attr("id","hero_selected").attr("x", 185).attr("y", height+10).attr("width",15).attr("height",15).attr("fill", "green")
				    svg.append("text").attr("id","text_selected").attr("x", 215).attr("y", height+23).attr("font-weight",600).text("Eroi Presenti ("+tmp.length+")").style("font-size", "15px").attr("alignment-baseline","middle")
					d3.select("#"+d.id).remove();
					svg.append("text").attr("id","text_red").attr("x", d.cx-240).attr("y",d.cy+11)
				    .attr("font-weight",800).text(d.nome).style("font-size", "11.5px").style("fill", "red").attr("alignment-baseline","middle")
					svg.selectAll("rect")
					.attr("fill", d=> d.color)
				}
				if(d.color =="blue"){
					new_tooltip.select('.descr').html(d.power.bold());
					new_tooltip.style('display', 'block')
					var tmp2 = getFilms(d.id);
					for(var i=0; i<tmp2.length; i++){
						 updateColorFilms(tmp2[i],"red");
				}
				drawEdges(d.id);
				svg.append("rect").attr("id","film_selected").attr("x", 185).attr("y", height+10).attr("width",15).attr("height",15).attr("fill", "red")
				svg.append("text").attr("id","text_selected").attr("x", 215).attr("y", height+23).attr("font-weight",600).text("Presenze Film ("+tmp2.length+")").style("font-size", "15px").attr("alignment-baseline","middle")
				d3.select("#"+d.id).remove();
				svg.append("text").attr("id","text_green").attr("x", d.cx+80).attr("y",d.cy+13)
				.attr("font-weight",800).text(d.nome).style("font-size", "11.5px").style("fill", "green").attr("alignment-baseline","middle")
				svg.selectAll("rect")
				.attr("fill", d => d.color)
				}
			})
			.on('mouseout', function(d) {  
				svg.selectAll("line").remove();
				d3.select("#text_selected").remove();          
			    if(d.color =="orange"){
					d3.select("#text_red").remove();
					svg.append("text").attr("id", d.id).attr("x", d.cx-240).attr("y", d.cy+11)
		            .attr("font-weight",800).text(d.nome).style("font-size", "11.5px").attr("alignment-baseline","middle");
					d3.select("#hero_selected").remove();
				    var tmp3 = getHeroes(d.id);
				    //console.log(tmp2);
				    for(var i=0; i<tmp3.length; i++){
					   updateColorHeroes(tmp3[i],"blue");
				    }
				svg.selectAll("rect")
			    .attr("fill", d =>d.color)
			    }
			    if(d.color =="blue"){
					d3.select("#text_green").remove();
					svg.append("text").attr("id", d.id).attr("x", d.cx+80).attr("y", d.cy+13)
					.attr("font-weight",800).text(d.nome).style("font-size", "11.5px").attr("alignment-baseline","middle");
					d3.select("#film_selected").remove();         
				   var tmp4 = getFilms(d.id);
				   for(var i=0; i<tmp4.length; i++){
					  updateColorFilms(tmp4[i],"orange");
				   }
				svg.selectAll("rect")
				.attr("fill", d => d.color) 
			   }  
		    })
			.on('mousemove', function(d) { 
			new_tooltip.style('top', (height+40 ) + 'px') 
			.style('left', (600) + 'px'); 
			})
			.on("mouseleave", function(d) {
				new_tooltip.style("visibility", "hidden");
			})
			.on("click", function(d){
				showMoreInformation(d);
			})
			.append("text")
			.text(d=>d.text)
			.attr('fill', 'black');
			

			svg.append("rect").attr("x", 15).attr("y", height+10).attr("width",15).attr("height",15).attr("fill", "orange")
			svg.append("rect").attr("x", 100).attr("y", height+10).attr("width",15).attr("height",15).attr("fill", "blue")
			svg.append("text").attr("x", 45).attr("y", height+23).attr("font-weight",600).text("Film").attr("font-size", "15px").attr("alignment-baseline","middle")
			svg.append("text").attr("x", 130).attr("y", height+23)	.attr("font-weight",600).text("Eroi").attr("font-size", "15px").attr("alignment-baseline","middle")


		})
	});
