

var jobData, jobVariables;


var joburls = {
    jobactions: "data/jobActions.tsv",
    jobvariables: "data/jobVariables.tsv"
};


/*
var path = d3.geoPath()
    .projection(projection);*/

var jobsvg = d3.select("#jobMap").append("svg")
    .attr("width", width)
    .attr("height", height)

var jobworldMap = jobsvg.append("g")

var jobvoronoiLayer = jobsvg.append("g");

var jobvoronoi = d3.voronoi()
    .x(function (d) { return projection([d.lng, d.lat])[0]; })
    .y(function (d) { return projection([d.lng, d.lat])[1]; })
    .extent([[-1, -1], [width + 1, height + 1]]);

var jobpolygons;
var jobpolygonData;

d3.queue()
    .defer(d3.tsv, urls.jobactions)
    .defer(d3.tsv, urls.jobvariables)
    .await(render);



function jobrender(err,  jobactions, jobvariables) {

   /* var countryList = d3.nest()
        .key(function (d) { return d.Country; }).sortKeys(d3.ascending)
        .entries(actions);

    setDropdown(countryList);*/
    
    jobData = jobactions;
    jobVariables = jobvariables;
    //compChart(actions)
    //Container for the gradients //https://www.visualcinnamon.com/2016/06/glow-filter-d3-visualization.html
    var defs = worldMap.append("defs");

    //Filter for the outside glow
    var filter = defs.append("filter")
        .attr("id", "glow");
    filter.append("feGaussianBlur")
        .attr("stdDeviation", "1.75")
        .attr("result", "coloredBlur");
    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode")
        .attr("in", "coloredBlur");
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

    jobworldMap
        .attr("id", "world")
        .selectAll("path")
        .data(world.features)
        .enter().append("path")
        .attr("class", "world")
        .attr('fill', function (d) {
            var value = "#c0c7c9";
            /*actions.forEach(function(k){
                if(k.ISO3== d.properties.ISO3_CODE){
                    value = quarantinecolor(k['Containment-measures__Confinement-and-lock-downs__Level'])
                }
            })*/
            return value;
        })
        .attr('stroke', "#c0c7c9")
        .attr("d", path)

    jobworldMap
        .selectAll(".couCircle")
        .data(jobactions)
        .enter().append("circle").attr("class", "couCircle")
        .attr("id", function (d) { return d.ISO3 + "circle"; })
        .attr("cx", function (d) {
            return projection([d.lng, d.lat])[0];
        })
        .attr("cy", function (d) {
            return projection([d.lng, d.lat])[1];
        })
        .attr("r", function (d) {
            if (d.ISO3 == "EU" || d.ISO3 == "SEA")
                return width / 250;
            else
                return width / 350;
        })
        .attr("fill", function (d) {
            if (d.ISO3 == "EU" || d.ISO3 == "SEA")
                return "#17a2b8";
            else
                return "#39617D";//"#04629a";
        })




    jobpolygonData = jobactions;
    jobpolygons = jobvoronoi(jobpolygonData).polygons();

    jobvoronoiLayer.selectAll(".cell")
        .data(jobpolygons)
        .enter()
        .append("path")
        .attr("class", "cell")
        .attr("fill", "none")
        .style("pointer-events", "all")
        .attr("stroke", "none")
        .attr("d", function (d) { return "M" + d.join("L") + "Z"; })
        .on('mouseover', function (d) {

            //var element = 
            d3.select("#" + d.data.ISO3 + "circle").attr("fill", "#e73741")


            divMap.transition()
                .duration(250)
                .style("opacity", 1);

            
            var htmlText = "<b>" + d.data.Country 
            divMap.html(htmlText)
                .style("left", event.pageX - document.body.scrollLeft + "px")
                .style("top", event.pageY - document.body.scrollTop + "px");

        })
        .on('mouseout', function (d) {

            if (d.data.ISO3 == "EU" || d.data.ISO3 == "SEA")
                d3.select("#" + d.data.ISO3 + "circle").attr("fill", "#17a2b8");
            else
                d3.select("#" + d.data.ISO3 + "circle").attr("fill", "#39617D");

            divMap.transition()
                .duration(250)
                .style("opacity", 0);
        })
        .on('click', function (d) {
            jobupdateCard(d.data.Country)
        });

};



d3.select(window).on('resize', resize);

function resize() {
    // adjust things when the window size changes
    width = document.getElementById("aboutMap").offsetWidth,
        height = width * mapRatio;

    // update projection
    projection
        .translate([width / 2, 6 * height / 10])
        .scale(width / 7.5);




    // resize the map container
    svg.attr('width', width + 'px')
        .attr('height', height + 'px');

    // resize the map
    worldMap.selectAll('.world').attr('d', path);
    //world.selectAll('.state').attr('d', path);


    worldMap.selectAll('circle')
        .attr("cx", function (d) {
            return projection([d.lng, d.lat])[0];
        })
        .attr("cy", function (d) {
            return projection([d.lng, d.lat])[1];
        })
        .attr("r", width / 300);


    voronoi
        .extent([[-1, -1], [width + 1, height + 1]]);



    polygons = voronoi(polygonData.filter(function (d) { return d.isOnMap != ""; })).polygons();



    voronoiLayer.selectAll(".cell")
        .data(polygons)
        .attr("fill", "none")
        .style("pointer-events", "all")
        .attr("stroke", "none")
        .attr("d", function (d) { return "M" + d.join("L") + "Z"; })


}


function updateCard(couName) {

    var temp = jobData.filter(function (d) { return d.Country == couName })

    document.getElementById("CountryCard").style.display = 'block';
    //document.getElementById("modedemploi").style.display = 'none';

    document.getElementById("countrySel").innerHTML = temp[0].Country;

    document.getElementById("updateTime").innerHTML = "Updated on " + temp[0].update;
    var navText = "Table of content <Br/>";
    var countryText = "";
    jobVariables.forEach(function (d) {
        if (d.level == "SectionTitle") {
            countryText = countryText + "<div class=\"border\" id=\"" + d.title.replace(/ /g, "") + "\" ><span class=\"SectionTitle\">" + d.title + "</span></div><Br/>"
            navText = navText + "<a class=\"couNav\" href=\"#" + d.title.replace(/ /g, "") + "\">" + d.title + "</a><Br/>"
        } else if (d.level == "SectionText") {
            countryText = countryText + "<div  class=\"SectionText\"><b>" + d.title + "</b><br/>" + temp[0][d.code] + "</div><Br/>";
        } else if (d.level == "SectionChart") {
            countryText = countryText + "<div class=\"SectionChart\"><b>" + d.title + "</b> - <i>" + d.unit + "</i></div><br/><div class=\"SectionChart\" id=\"" + d.code + "\"></div><Br/>";
        }
    })

    document.getElementById("navbar").innerHTML = navText;
    document.getElementById("singleCountry").innerHTML = countryText

    if (couName == "Kosovo**")
        document.getElementById("noteCountry").innerHTML = "<b>Note on Kosovo</b>: This designation is without prejudice to positions on status, and is in line with United Nations Security Council Resolution 1244/99 and the Advisory Opinion of the International Court of Justice on Kosovo's declaration of independence."
    else if (couName == "Israel*")
        document.getElementById("noteCountry").innerHTML = "<b>Note on Israel</b>: The statistical data for Israel are supplied by and under the responsibility of the relevant Israeli authorities. The use of such data by the OECD is without prejudice to the status of the Golan Heights, East Jerusalem and Israeli settlements in the West Bank under the terms of international law."
    else
        document.getElementById("noteCountry").innerHTML = ""

    jobVariables.forEach(function (d) {
        if (d.level == "SectionChart") {
            compChart(jobData, d.code)
            highlight(couName, jobData.filter(function (k) { return k[d.code] != "--" && k[d.code] != "Information not available" && k[d.code] != "null" && k[d.code] != "" && !(isNaN(k[d.code])) }).length, d.code)

        }

    })
}

function updateTracker(value) {
    d3.selectAll(".mySlides").style("display", "none")

    document.getElementById(value).style.display = 'block';
    //document.getElementById("modedemploi").style.display = 'none';
}

function updateMap(value) {

    worldMap
        .selectAll("path")
        .data(worldData.features)

        .transition().duration(500)

        .attr('fill', function (d) {
            //console.log(d)
            var basecolor = "#c0c7c9";
            jobData.forEach(function (k) {
                if (k.ISO3 == d.properties.ISO3_CODE) {
                    if (k[value] != 'Information not available' && k[value] != '')
                        basecolor = quarantinecolor(k[value])
                }
            })
            return basecolor;
        })
        .style("opacity", 0.75)

    voronoiLayer.selectAll(".cell")

        .on('mouseover', function (d) {

            var variable = value.replace(/__Level/g, "") + "__Description";
            //var element = d3.select("#" + d.data.ISO3 + "circle")

            d3.select("#" + d.data.ISO3 + "circle").attr("fill", "#e73741")

            divMap.transition()
                .duration(250)
                .style("opacity", 1);

            var icuText;
            if (d.data[value] == 'Information not available' || d.data[value] == '')
                icuText = ""
            else
                icuText = "<br/><b>confinement Level: " + d.data[value] + "</b><Br/>" + d.data[variable];

            var htmlText = "<b>" + d.data.Country + "</b>" + icuText;

            divMap.html(htmlText)
                //	.style("left", parseFloat(document.getElementById("aboutMap").getBoundingClientRect().left) + parseFloat(element.attr('cx')) + "px")
                //	.style("top", parseFloat(document.getElementById("aboutMap").getBoundingClientRect().top) + parseFloat(element.attr('cy')) + "px");
                .style("left", event.pageX - document.body.scrollLeft + "px")
                .style("top", event.pageY - document.body.scrollTop + "px");

        })
        .on('mouseout', function (d) {

            if (d.data.ISO3 == "EU" || d.data.ISO3 == "SEA")
                d3.select("#" + d.data.ISO3 + "circle").attr("fill", "#17a2b8");
            else
                d3.select("#" + d.data.ISO3 + "circle").attr("fill", "#39617D");

            divMap.transition()
                .duration(250)
                .style("opacity", 0);
        })
        .on('click', function (d) {
            updateCard(d.data.Country)
        });

}


d3.select("#shutter")
    .on("mouseover", function () {
        d3.select(this).style("opacity", 0.5);
    })
    .on("mouseout", function () {
        d3.select(this).style("opacity", 1);
    })
    .on("click", function () {
        document.getElementById("CountryCard").style.display = 'none';

        document.getElementById("country_dropdown").value = '-';
        //document.getElementById("modedemploi").style.display = 'block';
    })


d3.select("#shuttertracker")
    .on("mouseover", function () {
        d3.select(this).style("opacity", 0.5);
    })
    .on("mouseout", function () {
        d3.select(this).style("opacity", 1);
    })
    .on("click", function () {

        document.getElementById("trackersLink").style.display = 'none';
    })

d3.select("#toTrackersBtn")
    .on("click", function () {
        document.getElementById("trackersLink").style.display = 'block';
    })

d3.selectAll(".button.grey")
    .on("click", function () {
        d3.selectAll(".button.grey")
            .style("background-color", "#ffffff").style("color", "#0b1e2d")
        d3.select(this)
            .style("background-color", "#04629a").style("color", "#ffffff")
    })

d3.selectAll(".button.green")
    .on("click", function () {
        d3.selectAll(".button.green")
            .style("background-color", "#548235")
        d3.select(this)
            .style("background-color", "#0b1e2d")
    })