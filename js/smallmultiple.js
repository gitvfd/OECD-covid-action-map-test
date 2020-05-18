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


  

}