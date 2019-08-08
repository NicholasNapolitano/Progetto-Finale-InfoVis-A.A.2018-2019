d3.json("data/MCUNodes.json").then(function (nodi) {
	d3.json("data/MCUEdges.json").then(function (archi) {

		//Riepimento strutture dati
		var nodi_id_eroe = [];
		var nodi_id_film = [];
		var nodi_eroe = [];
		var nodi_film = [];
		var edge_graph = [];
		var nodi_poteri = [];
		var nodi_date = [];
		var nodi_fase = [];


		nodi.forEach(function (value, index) {
			Object.keys(value).forEach(function (v, i) {
				element = value[v];
				if (v == "id") {
					if (element[0] == "h")
						nodi_id_eroe.push(element);
					else
						nodi_id_film.push(element);
				}
				else {
					Object.keys(element).forEach(function (k, i) {
						help = element[k];
						if (help["key"] == "hero") {
							nodi_eroe.push(help["value"]);
							nodi_poteri.push(help["Power"]);
						}
						else {
							nodi_film.push(help["value"]);
							nodi_fase.push(help["Phase"]);
							nodi_date.push(help["Date"]);
						}
					})
				}
			})
		})

		archi.forEach(function (value, index) {
			tmp = {
				"sorgente": value["source"],
				"destinazione": value["target"]
			};
			edge_graph.push(tmp);
		})

		//Funzione per ritornare gli eroi presenti in un certo film
		function getHeroes(id_film) {
			var heroes = [];
			archi.forEach(function (value, index) {
				element = value;
				if (element.target == id_film) {
					heroes.push(element.source);
				}
			})
			return heroes;
		}

		//Funzione per ritornare i film in cui è presente un certo eroe
		function getFilms(id_hero) {
			var films = [];
			archi.forEach(function (value, index) {
				element = value;
				if (element.source == id_hero) {
					films.push(element.target);
				}
			})
			return films;
		}

		//Funzione per aggiornare il colore dei nodi degli eroi
		function updateColorHeroes(hero, color) {
			for (var i = 0; i < NodeData.length; i++) {
				var tmp = NodeData[i];
				if (tmp.id == hero) {
					tmp.color = color;
				}
			}
		}

		//Funzione per aggiornare il colore dei nodi dei film
		function updateColorFilms(film, color) {
			for (var i = 0; i < NodeData.length; i++) {
				var tmp = NodeData[i];
				if (tmp.id == film) {
					tmp.color = color;
				}
			}
		}

		//Funzione che disegna gli archi relativi ad un certo nodo
		function drawEdges(node_id) {
			var start;
			var ends = [];

			for (var i = 0; i < (NodeData.length); i++) {
				if (node_id == NodeData[i].id)
					start = ({ "id": node_id, "cx": parseInt(NodeData[i].cx, 10), "cy": parseInt(NodeData[i].cy, 10) });
			}

			for (var j = 0; j < edge_graph.length; j++) {
				for (var i = 0; i < (NodeData.length); i++) {
					if (start.id == edge_graph[j].sorgente && NodeData[i].id == edge_graph[j].destinazione) {
						ends.push({ "id": edge_graph[j].destinazione, "cx": parseInt(NodeData[i].cx, 10), "cy": parseInt(NodeData[i].cy, 10) });
						break;
					}
					else if (start.id == edge_graph[j].destinazione && NodeData[i].id == edge_graph[j].sorgente) {
						ends.push({ "id": edge_graph[j].sorgente, "cx": parseInt(NodeData[i].cx, 10), "cy": parseInt(NodeData[i].cy, 10) });
						break;
					}
				}
			}

			drawSecondLevel(ends); //Disegno archi di II livello

			//Disegno Archi di I livello
			for (var i = 0; i < ends.length; i++) {

				if ((start.cx < ends[i].cx)) {

					var line = svg.append("line")
						.style("stroke", "black")
						.style("stroke-opacity", "2")
						.attr("id", "black_line")
						.attr("x1", start.cx + x)
						.attr("y1", start.cy + y1 / 2)
						.attr("x2", ends[i].cx)
						.attr("y2", ends[i].cy + y1 / 2)
						.attr("marker-end", "url(#end)");

				}

				if (start.cx > ends[i].cx) {

					var line = svg.append("line")
						.style("stroke", "black")
						.style("stroke-opacity", "2")
						.attr("id", "black_line")
						.attr("x1", start.cx)
						.attr("y1", start.cy + y1 / 2)
						.attr("x2", ends[i].cx + x)
						.attr("y2", ends[i].cy + y1 / 2)
						.attr("marker-end", "url(#end)");

				}

			}
		}

		//Funzione di appoggio che disegna gli archi di II livello
		function drawSecondLevel(nodes) {
			for (var k = 0; k < nodes.length; k++) {
				var node_id = nodes[k].id;
				var start;
				var ends = [];
				if (node_id[0] == "m") {
					var tmp5 = getHeroes(node_id);
					for (var i = 0; i < tmp5.length; i++) {
						updateColorHeroes(tmp5[i], "magenta");
					}
				} else {
					var tmp6 = getFilms(node_id);
					for (var i = 0; i < tmp6.length; i++) {
						updateColorFilms(tmp6[i], "magenta");
					}
				}

				for (var i = 0; i < (NodeData.length); i++) {
					if (node_id == NodeData[i].id)
						start = ({ "id": node_id, "cx": parseInt(NodeData[i].cx, 10), "cy": parseInt(NodeData[i].cy, 10) });
				}

				for (var j = 0; j < edge_graph.length; j++) {
					for (var i = 0; i < (NodeData.length); i++) {
						if (start.id == edge_graph[j].sorgente && NodeData[i].id == edge_graph[j].destinazione) {
							ends.push({ "id": edge_graph[j].destinazione, "cx": parseInt(NodeData[i].cx, 10), "cy": parseInt(NodeData[i].cy, 10) });
							break;
						}
						else if (start.id == edge_graph[j].destinazione && NodeData[i].id == edge_graph[j].sorgente) {
							ends.push({ "id": edge_graph[j].sorgente, "cx": parseInt(NodeData[i].cx, 10), "cy": parseInt(NodeData[i].cy, 10) });
							break;
						}
					}
				}

				for (var i = 0; i < ends.length; i++) {

					if ((start.cx < ends[i].cx)) {

						var line = svg.append("line")
							.style("stroke", "magenta")
							.style("stroke-opacity", "0.5")
							.attr("id", "purple_line")
							.attr("x1", start.cx + x)
							.attr("y1", start.cy + y1 / 2)
							.attr("x2", ends[i].cx)
							.attr("y2", ends[i].cy + y1 / 2)
							.attr("marker-end", "url(#end)");



					}


					if (start.cx > ends[i].cx) {

						var line = svg.append("line")
							.style("stroke", "magenta")
							.style("stroke-opacity", "0.5")
							.attr("id", "purple_line")
							.attr("x1", start.cx)
							.attr("y1", start.cy + y1 / 2)
							.attr("x2", ends[i].cx + x)
							.attr("y2", ends[i].cy + y1 / 2)
							.attr("marker-end", "url(#end)");

					}

				}
			}
		}

		//Funzione che porta alla Schermata Intermedia
		function showMoreInformation(node) {
			var value1 = node.nome;
			var queryString = "?para1=" + value1;
			if (node.id[0] == "h")
				window.open("moreHeroInfo.html" + queryString, "_blank");
			else
				window.open("moreFilmInfo.html" + queryString, "_blank");
		}

		//Funzione di appoggio che conta il numero di nodi color magenta
		function countmagentaRects(data) {
			var c = 0;
			for (var i = 0; i < (NodeData.length); i++)
				if (NodeData[i].color == "magenta")
					c++;
			return c;
		}

		//Dimensioni Nodi 
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
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		//Disegno nodi
		var NodeData = [];

		var yspacing = (height) / nodi_eroe.length * 1.1;

		for (var i = 0; i < nodi_eroe.length; i++) {
			var startx = width - 150 * 2;
			var starty = height + 20;
			NodeData.push({ "nome": nodi_eroe[i], "cx": startx + 100, "cy": starty - (i * yspacing / 1.1), "x": x, "y": y2, "color": "blue", "id": nodi_id_eroe[i], "power": nodi_poteri[i] });
			svg.append("text").attr("id", nodi_id_eroe[i]).attr("x", startx + 180).attr("y", starty - (i * yspacing) / 1.1 + 13)
				.attr("font-weight", 800).text(nodi_eroe[i]).style("font-size", "11.5px").attr("alignment-baseline", "middle");
		}


		for (var i = 0; i < nodi_film.length; i++) {
			var startx = 150 + 40;
			var starty = height + 10;
			NodeData.push({ "nome": nodi_film[i], "cx": startx, "cy": starty - (i * yspacing * 1.05), "x": x, "y": y1, "color": "orange", "id": nodi_id_film[i], "phase": nodi_fase[i], "date": nodi_date[i] });
			svg.append("text").attr("id", nodi_id_film[i]).attr("x", startx - 240).attr("y", starty - (i * yspacing) * 1.05 + 11)
				.attr("font-weight", 800).text(nodi_film[i]).style("font-size", "11.5px").attr("alignment-baseline", "middle");
		}


		//Disegno archi Grafo Completo
		var sorgente = [];
		var destinazione = [];
		for (var j = 0; j < edge_graph.length; j++) {
			for (var i = 0; i < (NodeData.length); i++) {
				if (NodeData[i].id == edge_graph[j].sorgente) {
					sorgente.push({ "id": NodeData[i].id, "cx": parseInt(NodeData[i].cx, 10), "cy": parseInt(NodeData[i].cy, 10) });
				}
				if (NodeData[i].id == edge_graph[j].destinazione) {
					destinazione.push({ "id": NodeData[i].id, "cx": parseInt(NodeData[i].cx, 10), "cy": parseInt(NodeData[i].cy, 10) });
				}
			}
		}

		for (var i = 0; i < destinazione.length; i++) {

			if ((sorgente[i].cx < destinazione[i].cx)) {

				var line = svg.append("line")
					.style("stroke", "grey")
					.style("stroke-opacity", "0.4")
					.attr("x1", sorgente[i].cx + x)
					.attr("y1", sorgente[i].cy + y1 / 2)
					.attr("x2", destinazione[i].cx)
					.attr("y2", destinazione[i].cy + y1 / 2)
					.attr("marker-end", "url(#end)");

			}


			if (sorgente[i].cx > destinazione[i].cx) {

				var line = svg.append("line")
					.style("stroke", "grey")
					.style("stroke-opacity", "0.4")
					.attr("x1", sorgente[i].cx)
					.attr("y1", sorgente[i].cy + y1 / 2)
					.attr("x2", destinazione[i].cx + x)
					.attr("y2", destinazione[i].cy + y1 / 2);

			}

		}

		// define tooltip
		// create a tooltip
		var new_tooltip = d3.select(".viz-portfolio-delinquent-status")
			.append("div")
			.attr("class", "tooltip")

		new_tooltip.append('div')
			.attr('class', 'descr');

		new_tooltip.style("visibility", "visible");

		//Applicazione logica Nodi
		svg.selectAll("rect")
			.data(NodeData)
			.enter()
			.append("rect")
			.attr("fill", d => d.color)
			.attr("x", d => d.cx)
			.attr("y", d => d.cy)
			.attr("width", x)
			.attr("height", d => d.y)
			.on('mouseover', function (d) {  //Logica quando si punta su un nodo
				new_tooltip.style("visibility", "visible");
				if (d.color == "orange") { //Se il nodo è un film
					new_tooltip.select('.descr').html(d.date.bold() + "  (".bold() + d.phase.bold() + ")".bold());
					new_tooltip.style('display', 'block')
					var tmp = getHeroes(d.id);
					for (var i = 0; i < tmp.length; i++) {
						updateColorHeroes(tmp[i], "green"); //Aggiornamento colore nodi eroi nel film selezionato

					}
					drawEdges(d.id); //Disegno archi
					d.color = "orange";
					var l = countmagentaRects(NodeData); //Aggiornamento colore vicini di II Livello (Film-Eori-Film)
					//Mostra Legenda Dinamica
					svg.append("rect").attr("id", "hero_selected").attr("x", 715).attr("y", 2).attr("width", 15).attr("height", 15).attr("fill", "green")
					svg.append("text").attr("id", "text_selected").attr("x", 745).attr("y", +15).attr("font-weight", 600).text("Eroi In " + d.nome + " (" + tmp.length + ")").style("font-size", "13px").attr("alignment-baseline", "middle")
					svg.append("rect").attr("id", "other_film_selected").attr("x", 140).attr("y", 1).attr("width", 15).attr("height", 15).attr("fill", "magenta")
					svg.append("text").attr("id", "other_text_selected").attr("x", 170).attr("y", +14).attr("font-weight", 600).text("Presenze In Altri Film Degli Eroi Presenti  (" + l + ")").style("font-size", "13px").attr("alignment-baseline", "middle");
					d3.select("#" + d.id).remove();
					svg.append("text").attr("id", "text_red").attr("x", d.cx - 240).attr("y", d.cy + 11)
						.attr("font-weight", 800).text(d.nome).style("font-size", "11.5px").style("fill", "red").attr("alignment-baseline", "middle")
					svg.selectAll("rect")
						.attr("fill", d => d.color)
				}
				if (d.color == "blue") { //Se il nodo è un eroe
					new_tooltip.select('.descr').html(d.power.bold());
					new_tooltip.style('display', 'block')
					var tmp2 = getFilms(d.id);
					for (var i = 0; i < tmp2.length; i++) {
						updateColorFilms(tmp2[i], "red"); //Aggiornamento colore nodi film dell'eroe selezionato
					}
					drawEdges(d.id); //Disegno archi
					d.color = "blue";
					var l = countmagentaRects(NodeData); //Aggiornamento colore vicini di II Livello (Eroi-Film-Eroi)
					//Mostra Legenda Dinamica
					svg.append("rect").attr("id", "film_selected").attr("x", 160).attr("y", 1).attr("width", 15).attr("height", 15).attr("fill", "red")
					svg.append("text").attr("id", "text_selected").attr("x", 190).attr("y", +15).attr("font-weight", 600).text("Presenze Film Di " + d.nome + " (" + tmp2.length + ")").style("font-size", "13px").attr("alignment-baseline", "middle")
					svg.append("rect").attr("id", "other_hero_selected").attr("x", 700).attr("y", 1).attr("width", 15).attr("height", 15).attr("fill", "magenta")
					svg.append("text").attr("id", "other_text_selected").attr("x", 730).attr("y", +15).attr("font-weight", 600).text("Presenze Di Altri Eroi Nei Film (" + l + ")").style("font-size", "13px").attr("alignment-baseline", "middle");
					d3.select("#" + d.id).remove();
					svg.append("text").attr("id", "text_green").attr("x", d.cx + 80).attr("y", d.cy + 13)
						.attr("font-weight", 800).text(d.nome).style("font-size", "11.5px").style("fill", "green").attr("alignment-baseline", "middle")
					svg.selectAll("rect")
						.attr("fill", d => d.color)
				}
			})
			.on('mouseout', function (d) { //Logica quando non si punta più su un nodo
				d3.selectAll("#black_line").remove();
				d3.selectAll("#purple_line").remove();
				d3.select("#text_selected").remove();
				d3.select("#other_text_selected").remove();
				//Ripristino colore originale di nodi ed archi 
				if (d.color == "orange" || d.color == "magenta") { //Se il nodo è un film
					d3.select("#text_red").remove();
					d3.select("#other_film_selected").remove();
					svg.append("text").attr("id", d.id).attr("x", d.cx - 240).attr("y", d.cy + 11)
						.attr("font-weight", 800).text(d.nome).style("font-size", "11.5px").attr("alignment-baseline", "middle");
					d3.select("#hero_selected").remove();
					d3.select("#other_film_selected").remove();
					var tmp3 = getHeroes(d.id);
					for (var i = 0; i < tmp3.length; i++) {
						updateColorHeroes(tmp3[i], "blue");
					}
					for (var i = 0; i < nodi_id_film.length; i++) {
						updateColorFilms(nodi_id_film[i], "orange");
					}
					svg.selectAll("rect")
						.attr("fill", d => d.color)
				}
				if (d.color == "blue" || d.color == "magenta") { //Se il nodo è un eroe
					d3.select("#text_green").remove();
					d3.select("#other_hero_selected").remove();
					svg.append("text").attr("id", d.id).attr("x", d.cx + 80).attr("y", d.cy + 13)
						.attr("font-weight", 800).text(d.nome).style("font-size", "11.5px").attr("alignment-baseline", "middle");
					d3.select("#film_selected").remove();
					var tmp4 = getFilms(d.id);
					for (var i = 0; i < tmp4.length; i++) {
						updateColorFilms(tmp4[i], "orange");
					}
					for (var i = 0; i < nodi_id_eroe.length; i++) {
						updateColorHeroes(nodi_id_eroe[i], "blue");
					}
					svg.selectAll("rect")
						.attr("fill", d => d.color)
				}
			})
			.on('mousemove', function (d) { //Logica quando il puntatore si muove su un nodo
				new_tooltip.style('top', (35) + 'px')
					.style('left', (580) + 'px');
			})
			.on("mouseleave", function (d) { //Logica quando il puntatore esce da un nodo
				new_tooltip.style("visibility", "hidden");
			})
			.on("click", function (d) { //Logica quando si cliccaa su un nodo
				showMoreInformation(d);
			})
			.append("text")
			.text(d => d.text)
			.attr('fill', 'black');

		//Legenda Fissa
		svg.append("rect").attr("x", -30).attr("y", 1).attr("width", 15).attr("height", 15).attr("fill", "orange")
		svg.append("rect").attr("x", 1070).attr("y", 4).attr("width", 15).attr("height", 15).attr("fill", "blue")
		svg.append("text").attr("x", 0).attr("y", 14).attr("font-weight", 600).text("Film").attr("font-size", "13px").attr("alignment-baseline", "middle")
		svg.append("text").attr("x", 1100).attr("y", 17).attr("font-weight", 600).text("Eroi").attr("font-size", "13px").attr("alignment-baseline", "middle")

	})
});
