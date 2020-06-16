function smallMultiples(data,identifier) {
    
    //data.documentElement.getElementsByTagName("ObsValue")

    data = [].map.call(data.documentElement.getElementsByTagName("Obs"), function (serie) {
         return {
            value: +serie.getElementsByTagName("ObsValue")[0].getAttribute("value"),
            date: serie.getElementsByTagName("Time")[0].childNodes[0].nodeValue
        };
    });

    var minAxis ;
   /**  if (d3.min(data, function (d) { return parseFloat(d.value); })>0)
        minAxis=0;
    else*/
        minAxis = d3.min(data, function (d) { return parseFloat(d.value); })
    var parseDate = d3.timeParse("%Y-%m")

    var bisectDate = d3.bisector(function (d) { return parseDate(d.date); }).left;

     
    // set the dimensions and margins of the graph
    var marginSmall = { top: 10, right: 10, bottom: 30, left: 30 },widthSmall,heightSmall;
    if(width>500){
        widthSmall = 0.4 * width - marginSmall.left - marginSmall.right;
        heightSmall = 250 - marginSmall.top - marginSmall.bottom;
    }else{

        widthSmall = 0.8*width - marginSmall.left - marginSmall.right;
        heightSmall = 200 - marginSmall.top - marginSmall.bottom;
    }

        // group the data: I want to draw one line per group

    var div2sel = "#" + identifier;
        // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
    var svg = d3.select(div2sel)
            .append("svg")
            .attr("width", widthSmall + marginSmall.left + marginSmall.right)
            .attr("height", heightSmall + marginSmall.top + marginSmall.bottom)
            .append("g")
            .attr("transform",
                "translate(" + marginSmall.left + "," + marginSmall.top + ")");

        // Add X axis --> it is a date format
        var x = d3.scaleLinear()
            .domain(d3.extent(data, function (d) { return parseDate(d.date); }))
            .range([0, widthSmall]);
        svg
            .append("g")
            .attr("class", "axisContext")
            .attr("transform", "translate(0," + heightSmall + ")")
            .call(d3.axisBottom(x).ticks(8)
                .tickFormat(d3.timeFormat("%Y")));

        //Add Y axis
        var y = d3.scaleLinear() //or scaleLog
            .domain([minAxis, d3.max(data, function (d) { return parseFloat(d.value); })])
            .range([heightSmall, 0]);
       
    svg.append("g")
        .attr("class", "axisContext")
                .call(d3.axisLeft(y).tickFormat(function (d) {
                return y.tickFormat(10, d3.format(",d"))(d)
            }).tickSize(-(widthSmall)));

        // Draw the line
        svg
            .append("path")
            .attr("fill", "none"/*"#8DCD79"*/ )
            .attr("stroke", function (d) { return /*color(d.key)*/"#E73741" })
            .attr("stroke-width", 1.9)
            .attr("class","lineContext")
            .attr("id", function (d) { return identifier.split(' ').join('').replace("*", "").replace("\''", "").replace("-", "").replace("(", "").replace(")", "") + "area";})
            .attr("d", function (d) {
                return d3.line()//area
                    .x(function (d) { return x(parseDate(d.date)); })
                   // .y0(y(0))
                    .y(function (d) { return y(parseFloat(d.value)); })
                    (data)
            })



    var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", heightSmall);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", widthSmall)
        .attr("x2", widthSmall);

    focus.append("circle")
        .attr("r", 7.5);

    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", widthSmall + marginSmall.left + marginSmall.right)
        .attr("height", heightSmall + marginSmall.top + marginSmall.bottom)
        .on("mouseover", function () {
            focus.style("display", null);
        })
        .on("mouseout", function () {
            divMap.transition()
                .duration(100)
                .style("opacity", 0);
            focus.style("display", "none");
        })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]);

        var j = bisectDate(data, new Date(x0), 1);
        var l = bisectDate(data, new Date(x0), 1);

        var d0 = data[j - 1];
        var d1 = data[j];
        var d = new Date(x0) - parseDate(d0.date) > parseDate(d1.date) - new Date(x0) ? d1 : d0;

        var max, max_1, max_tot, d0_1, d1_1, d_1;

   //     if (typeof selCountries[1] != "undefined") {
            d0_1 = data[j - 1];
            d1_1 = data[j];
            d_1 = new Date(x0) - parseDate(d0_1.date) > parseDate(d1_1.date) - new Date(x0) ? d1_1 : d0_1;
   /*     } else {
            d0_1 = d0; d1_1 = d1; d_1 = d;
        }/*

       /* if (parseFloat(d.Scenario1Val) >= parseFloat(d.Scenario2Val)) max = d.Scenario1Val; else max = d.Scenario2Val;
        if (parseFloat(d_1.Scenario1Val) >= parseFloat(d_1.Scenario2Val)) max_1 = d_1.Scenario1Val; else max_1 = d_1.Scenario2Val;
        if (parseFloat(max) >= parseFloat(max_1)) max_tot = max; else max_tot = max_1;
*/
        focus.attr("transform", "translate(" + x(parseDate(d.date)) + "," + y(d.value) + ")");


       // if (typeof selCountries[1] != "undefined") {
            divMap.transition()
                .duration(100)
                .style("opacity", 1);

        var htmlText = "<b>" + d.date + "</b>:&nbsp;" + d3.format(".1f")(d.value);

            if (event.pageX < width - 75) {
                divMap.html(htmlText)
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY + "px");
            } else {
                divMap.html(htmlText)
                    .style("left", width - 100 + "px")
                    .style("top", event.pageY + "px");
            }
            // focus.select("text").html(function () { return d.date+"<br>"+ Math.round(d.Value*10)/10; });
    /*    } else {
            divMap.transition()
                .duration(100)
                .style("opacity", 1);

            var htmlText = "<b>" + d.date + "</b><br/><b>&nbsp;" + countryName(d.LOCATION) + "</b><br>Single-hit scenario: " + Math.round(d.Scenario1Val * 10) / 10 + "%<br>Double-hit scenario: " + Math.round(d.Scenario2Val * 10) / 10 + "%";

            if (event.pageX < width - 75) {
                divMap.html(htmlText)
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY + "px");
            } else {
                divMap.html(htmlText)
                    .style("left", width - 100 + "px")
                    .style("top", event.pageY + "px");
            }

            // focus.select("text").html(function () { return "<b>"+d.date+"</b> "+ "<br>" +  Math.round(d.Value * 100) / 100; });
        }
*/
        focus.select(".x-hover-line").attr("y2", height - y(d.value));
        focus.select(".y-hover-line").attr("x2", width + width);

    }


}

