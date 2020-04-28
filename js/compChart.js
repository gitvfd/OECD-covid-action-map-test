
function compChart(data_temp, idChart) {
	var data = data_temp.filter(function (d) { return d[idChart] != "--" && d[idChart] != "Information not available" && d[idChart] != "null" && d[idChart] != "" && !(isNaN(d[idChart])) })
	
	var chartLoc = "#" + idChart;
	var colorChart = "#662D91"

			/*if(window.innerWidth>=1140)
				 popupWidth= 0.95* 1140;
			else*/
				popupWidth = 0.95 * window.innerWidth;


			var lollipopRadius;
			if (popupWidth > 1200) lollipopRadius = 6; else if (popupWidth > 700) lollipopRadius = 4; else lollipopRadius = 2.5; 
			
			

			margin_chart=100;
			var padding=0;
			/**var guides= ["←  less support", " more support  →"]**/
			

			var mousemove = function () {
				return divMap.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
			}

			var mouseout = function () { 
				return  divMap.transition()
					.duration(250)
					.style("opacity", 0); 
			} 


	


			if (popupWidth > 800) {

				heightChart = 0.4 * window.innerHeight;
				
				xScale = d3.scaleBand()
					.domain(data.sort(function (a, b) { return parseFloat(a[idChart]) - parseFloat(b[idChart]); }).map(function (d) { return d.Country }))
					.range([margin_chart, popupWidth - margin_chart ])
					.padding(padding);
				
				
				if (idChart == "Fiscal-measures__Overall-fiscal-measures__Impact-on-budget-balance" || idChart == "Fiscal-measures__Loan-guarantees-by-the-state-benefiting-private-borrowers__Value"){
					yScale = d3.scaleLinear()
						.domain([d3.min(data, function (d) { return parseFloat(d[idChart]); }), d3.max(data, function (d) { return parseFloat(d[idChart]); })])
						.range([heightChart - margin_chart, margin_chart / 3]);
				}else{
					yScale = d3.scaleLinear()
						.domain([0, d3.max(data, function (d) { return parseFloat(d[idChart]); })])
						.range([heightChart - margin_chart, margin_chart / 3]);
				}
				var idchartref=idChart+"_chart"
				var dimDescChart = d3.select(chartLoc).html('')
					.append('svg')
					.attrs({ width: popupWidth, height: heightChart, id: idchartref })


				/**var dimDescGuide = dimDescChart.append("text")
					.attr("x", 0)
					.attr("y", 0)
					.append("tspan")
					.attr("id", "chartGuideDimDesc")
					.attr("x", margin_chart)
					.attr("y", heightChart - margin_chart / 10)
					.html(guides[0])**/
				//.call(wrap,0.25*width);

				/**var dimDescGuideEnd = dimDescChart.append("text")
					.attr("x", 0)
					.attr("y", 0)
					.append("tspan")
					.attr("id", "chartGuideDimDescEnd")
					.attr("x", popupWidth - margin_chart / 2)
					.attr("y", heightChart - margin_chart / 10)
					.html(guides[1])
					.style("text-anchor", "end")**/


				//Create Y axis
				dimDescChart.append("g")
					.attr("class", "axis y yAxis")
					.attr("transform", "translate(" + margin_chart + ",0)")
					.call(d3.axisLeft(yScale)
						.tickSize( -(popupWidth - margin_chart - margin_chart))/*.ticks(null, "%")*/);


				///Lollipop dimDesc
				var lollipopsCircle = dimDescChart.selectAll("circle")
					.data(data)
					.enter().append("circle")
					.attr("class", "lollipopCircle")
					.attr("r", lollipopRadius)
					.attr("cx", function (d) {
						
						if (d[idChart] === "NA")
							return "-10";
						else
							return xScale(d.Country) + xScale.bandwidth() / 2;
					})
					.attr("cy", function (d) {
						if (d[idChart] === "NA")
							return "-10";
						else
							return yScale(d[idChart]);
					})
					.attr("fill", colorChart)
					.on("mouseover", function (d) {
						divMap.transition()
							.duration(250)
							.style("opacity", 1);
						var idTooltip = idChart.replace(/-percent__GDP/g,"")
						var unitTooltip;
						
						allVariables.forEach(function (k) {
							if (k.code == idTooltip)
								unitTooltip=k.unit;
						})
						var htmlText = "<b>" + d.Country + "</b><br> " + d3.format(".2f")(d[idChart]) + "%<br> " + d3.format(".1f")(d[idTooltip]) + " " + unitTooltip
						
							divMap.html(htmlText).style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");

					})
					.on("mousemove", mousemove)
					.on("mouseout", mouseout)
					.on("click",function(d){ return updateCard(d.Country)});


				var lollipopsText = dimDescChart.selectAll("circleText")
					.data(data)
					.enter().append("text")
					.attr("class", "lollipopText")

					.attr("transform", "translate(-3,15)rotate(-90)")
					.attr("dy", function (d) {
						if (d[idChart] == "NA")
							return "-10";
						else
							return xScale(d.Country) + xScale.bandwidth() / 2;
					})
					.attr("dx", function (d) {
						if (d[idChart] == "NA")
							return "-10";
						else
							return -yScale(d[idChart]);
					})
					.text(function (d) {
						return d.Country;
					})
					.attr("text-anchor", "end")
					.attr("fill", colorChart)
					.on("mouseover", function (d) {
						divMap.transition()
						.duration(250)
						.style("opacity", 1);

						var idTooltip = idChart.replace(/-percent__GDP/g,"")
						var unitTooltip;
						allVariables.forEach(function (k) {
							if (k.code == idTooltip)
								unitTooltip = k.unit;
						})
						var htmlText = "<b>" + d.Country + "</b><br> " + d3.format(".2f")(d[idChart]) + "%<br> " + d3.format(".1f")(d[idTooltip]) + " " + unitTooltip

						divMap.html(htmlText).style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
					})
					.on("mousemove", mousemove)
					.on("mouseout", mouseout)
					.on("click",function(d){ return updateCard(d.Country)});;;

				var lollipopsLine = dimDescChart.selectAll("circleLine")
					.data(data)
					.enter().append("line")
					.attr("class", "lollipopLine")
					.attr("x1", function (d) {
						if (d[idChart] == "NA")
							return "-10";
						else
							return xScale(d.Country) + xScale.bandwidth() / 2;
					})
					.attr("x2", function (d) {
						if (d[idChart] == "NA")
							return "-10";
						else
							return xScale(d.Country) + xScale.bandwidth() / 2;
					})
					.attr("y1", function (d) {
						if (d[idChart] == "NA")
							return "-10";
						else
							return yScale(0);
					})
					.attr("y2", function (d) {
						if (d[idChart] == "NA")
							return "-10";
						else
							return yScale(d[idChart]);
					})
					.attr("stroke", colorChart)
					.attr("stroke-width", "1")
					.on("mouseover", function (d) {
						divMap.transition()
						.duration(250)
						.style("opacity", 1);


						var idTooltip = idChart.replace(/-percent__GDP/g,"")
						var unitTooltip;
						allVariables.forEach(function (k) {
							if (k.code == idTooltip)
								unitTooltip = k.unit;
						})
						var htmlText = "<b>" + d.Country + "</b><br> " + d3.format(".2f")(d[idChart]) + "%<br> " + d3.format(".1f")(d[idTooltip]) + " " + unitTooltip

						divMap.html(htmlText).style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
					})
					.on("mousemove", mousemove)
					.on("mouseout", mouseout)
					.on("click",function(d){ return updateCard(d.Country)});


			}
			else {
				heightChart = window.innerHeight ;

				xScale = d3.scaleBand()
					.domain(data.sort(function (a, b) { return parseFloat(a[idChart]) - parseFloat(b[idChart]); }).map(function (d) { return d.Country }))
					.range([heightChart - margin_chart/2, margin_chart ])
					.padding(padding);

				if (idChart == "Fiscal-measures__Overall-fiscal-measures__Impact-on-budget-balance" || idChart == "Fiscal-measures__Loan-guarantees-by-the-state-benefiting-private-borrowers__Value") {
					yScale = d3.scaleLinear()
						.domain([d3.min(data, function (d) { return parseFloat(d[idChart]); }), d3.max(data, function (d) { return parseFloat(d[idChart]); })])
						.range([margin_chart , popupWidth - margin_chart]);
				} else {
					yScale = d3.scaleLinear()
						.domain([0, d3.max(data, function (d) { return parseFloat(d[idChart]); })])
						.range([margin_chart , popupWidth - margin_chart]);
				}
				var idchartref = idChart + "_chart"
				var dimDescChart = d3.select(chartLoc).html('')
					.append('svg')
					.attrs({ width: popupWidth, height: heightChart, id: idchartref })



				/**var dimDescGuide = dimDescChart.append("text")
					.attr("x", 0)
					.attr("y", 0)
					.append("tspan")
					.attr("id", "chartGuideDimDesc")
					.attr("x", margin_chart)
					.attr("y", heightChart - margin_chart / 4)
					.html(guides[0])**/
				//.call(wrap,0.25*width);

				/**var dimDescGuideEnd = dimDescChart.append("text")
					.attr("x", 0)
					.attr("y", 0)
					.append("tspan")
					.attr("id", "chartGuideDimDescEnd")
					.attr("x", popupWidth - margin_chart )
					.attr("y", margin_chart / 8)
					.html(guides[1])
					.style("text-anchor", "end")**/


				//Create Y axis
				dimDescChart.append("g")
					.attr("class", "axis y yAxis")
					.attr("transform", "translate(" + 0 + ","+ margin_chart / 2+")")
					.call(d3.axisTop(yScale).tickSize(-(heightChart - margin_chart / 2 - margin_chart / 2))/*.ticks(null, "%")*/);


				///Lollipop dimDesc
				var lollipopsCircle = dimDescChart.selectAll("circle")
					.data(data)
					.enter().append("circle")
					.attr("class", "lollipopCircle")
					.attr("r", lollipopRadius)
					.attr("cy", function (d) {
						if (d[idChart] === "NA")
							return "-10";
						else
							return xScale(d.Country) + xScale.bandwidth() / 2;
					})
					.attr("cx", function (d) {
						if (d[idChart] === "NA")
							return "-10";
						else
							return yScale(d[idChart]);
					})
					.attr("fill", colorChart)
					.on("mouseover", function (d) {
						divMap.transition()
						.duration(250)
						.style("opacity", 1);

						var idTooltip = idChart.replace(/-percent__GDP/g,"")
						var unitTooltip;
						allVariables.forEach(function (k) {
							if (k.code == idTooltip)
								unitTooltip = k.unit;
						})
						var htmlText = "<b>" + d.Country + "</b><br> " + d3.format(".2f")(d[idChart]) + "%<br> " + d3.format(".1f")(d[idTooltip]) + " " + unitTooltip

						divMap.html(htmlText).style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
					})
					.on("mousemove", mousemove)
					.on("mouseout", mouseout)
					.on("click",function(d){ return updateCard(d.Country)});


				var lollipopsText = dimDescChart.selectAll("circleText")
					.data(data)
					.enter().append("text")
					.attr("class", "lollipopText")

					.attr("transform", "translate(-10,-3)")
					.attr("dy", function (d) {
						if (d[idChart] == "NA")
							return "-10";
						else
							return xScale(d.Country) + xScale.bandwidth() / 2;
					})
					.attr("dx", function (d) {
						if (d[idChart] == "NA")
							return "-10";
						else
							return yScale(d[idChart]);
					})
					.text(function (d) {
						return d.Country;
					})
					.attr("text-anchor", "end")
					.attr("fill", colorChart)
					.on("mouseover", function (d) {
						divMap.transition()
						.duration(250)
						.style("opacity", 1);


						var idTooltip = idChart.replace(/-percent__GDP/g,"")
						var unitTooltip;
						allVariables.forEach(function (k) {
							if (k.code == idTooltip)
								unitTooltip = k.unit;
						})
						var htmlText = "<b>" + d.Country + "</b><br> " + d3.format(".2f")(d[idChart]) + "%<br> " + d3.format(".1f")(d[idTooltip]) + " " + unitTooltip

						divMap.html(htmlText).style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
					})
					.on("mousemove", mousemove)
					.on("mouseout", mouseout)
					.on("click",function(d){ return updateCard(d.Country)});;;

				var lollipopsLine = dimDescChart.selectAll("circleLine")
					.data(data)
					.enter().append("line")
					.attr("class", "lollipopLine")
					.attr("y1", function (d) {
						if (d[idChart] == "NA")
							return "-10";
						else
							return xScale(d.Country) + xScale.bandwidth() / 2;
					})
					.attr("y2", function (d) {
						if (d[idChart] == "NA")
							return "-10";
						else
							return xScale(d.Country) + xScale.bandwidth() / 2;
					})
					.attr("x1", function (d) {
						if (d[idChart] == "NA")
							return "-10";
						else
							return yScale(0);
					})
					.attr("x2", function (d) {
						if (d[idChart] == "NA")
							return "-10";
						else
							return yScale(d[idChart]);
					})
					.attr("stroke", colorChart)
					.attr("stroke-width", "1")
					.on("mouseover", function (d) {
						divMap.transition()
						.duration(250)
						.style("opacity", 1);


						var idTooltip = idChart.replace(/-percent__GDP/g,"")
						var unitTooltip;
						allVariables.forEach(function (k) {
							if (k.code == idTooltip) {

								unitTooltip = k.unit;

							}
						})
						var htmlText = "<b>" + d.Country + "</b><br> " + d3.format(".2f")(d[idChart]) + "%<br> " + d3.format(".1f")(d[idTooltip]) + " " + unitTooltip

						divMap.html(htmlText).style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
					})
					.on("mousemove", mousemove)
					.on("mouseout", mouseout)
					.on("click",function(d){ return updateCard(d.Country)});;;

			}



		}	
	
function highlight(couCode, couNum, idChart) {
	idChartref = "#" + idChart + "_chart";
	d3.select(idChartref).selectAll(".highlightBar").remove();

	var nameCou;
	allData.forEach(function(d){
		if(d.ISO3==couCode)
			 nameCou=d.Country;
	})

	if (!isNaN(xScale(nameCou))){	
			if (popupWidth > 800){
				d3.select(idChartref).append("rect")
					.attr("class","highlightBar")
					.attr("x", xScale(nameCou)-0.1* (popupWidth - margin_chart /2 - margin_chart/2) / couNum)
					.attr("y", 0)
					.attr("width", 1*(popupWidth - margin_chart/2  - margin_chart/2) / couNum)
					.attr("height", heightChart)
					.attr("fill","white")
					.attr("opacity", 0.5);
			}
			else{

				d3.select(idChartref).append("rect")
					.attr("class", "highlightBar")
					.attr("x", 0)
					.attr("y", xScale(nameCou)- 0.5*(heightChart - margin_chart/2 - margin_chart/2) / couNum)
					.attr("width", popupWidth)
					.attr("height", 1.5*(heightChart - margin_chart / 2 - margin_chart) / couNum)
					.attr("fill", "white")
					.attr("opacity",0.5);
			}
	}
}
