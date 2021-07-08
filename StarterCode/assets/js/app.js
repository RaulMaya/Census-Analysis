//Starting Responsive Function
function makeResponsive() {

    //Selecting svgArea
    var svgArea = d3.select("body").select("#scatter").select("svg");

    //Deleting svgArea if it already exists
    if (!svgArea.empty()) {
      svgArea.remove();
    };

    //Establishing SVG Height and Width
    var svgWidth = 960;
    var svgHeight = 500;

    //Setting Margins
    var margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    };

    //Defining Chart Height and Chart Width
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

    //Creating SVG Container
    var svg = d3.select("body").select("#scatter").append("svg")
          .attr("height", svgHeight)
          .attr("width", svgWidth);


    var chartGroup = svg.append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var xaxis = "poverty";

    function xScale(usa_data, xaxis) {
      var xLinearScale = d3.scaleLinear()
        .domain([d3.min(usa_data, d => d[xaxis]) * 0.9,
          d3.max(usa_data, d => d[xaxis]) * 1.1
        ])
        .range([0, width]);

      return xLinearScale;

    }

    function renderAxes(newXScale, new_xaxis) {
      var bottomAxis = d3.axisBottom(newXScale);

      new_xaxis.transition()
        .duration(1000)
        .call(bottomAxis);

      return new_xaxis;
    }

    function renderCircles(circlesGroup, newXScale, xaxis) {

      circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[xaxis]));

      return circlesGroup;
    }

    function updateToolTip(xaxis, circlesGroup) {

      var label;

      if (xaxis === "poverty") {
        label = "Poverty";
      }
      else if (xaxis === "age") {
          label = "Age";
      }
      else if (xaxis === "income") {
          label = "Income";
      }

      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.state}<br>${label} ${d[xaxis]}`);
        });

      circlesGroup.call(toolTip);

      circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
        })

        .on("mouseout", function(data, index) {
          toolTip.hide(data);
          });

        return circlesGroup;
    }

    d3.csv("StarterCode/assets/data/usa_data.csv").then(function(usa_data, err) {
      if (err) throw err;

      usa_data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
      });

      var xLinearScale = xScale(usa_data, xaxis);

      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(usa_data, d => d.obesity)])
        .range([height, 0]);


      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

      var new_xaxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

      chartGroup.append("g")
        .call(leftAxis);

      var circlesGroup = chartGroup.selectAll("circle")
        .data(usa_data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[xaxis]))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", 8)
        .attr("fill", "lightblue")
        .attr("opacity", "1")
        .attr("class", "abbr")
        .text(d=>d.abbr);

        var labelsGroup = chartGroup.append("g")
          .attr("transform", `translate(${width / 2}, ${height + 30})`);

        var povertyLabel = labelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 20)
          .attr("value", "poverty")
          .classed("active", true)
          .text("Poverty");

        var ageLabel = labelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 40)
          .attr("value", "age") // value to grab for event listener
          .classed("inactive", true)
          .text("Age");

          var incomeLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income") // value to grab for event listener
            .classed("inactive", true)
            .text("Income");

        // append y axis
        chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .classed("axis-text", true)
          .text("healthcare");

          var circlesGroup = updateToolTip(xaxis, circlesGroup);

          // x axis labels event listener
          labelsGroup.selectAll("text")
            .on("click", function() {
              // get value of selection
              var value = d3.select(this).attr("value");
              if (value !== xaxis) {

                // replaces chosenXAxis with value
                xaxis = value;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(usa_data, xaxis);

                // updates x axis with transition
                new_xaxis = renderAxes(xLinearScale, new_xaxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, xaxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(xaxis, circlesGroup);

              }
            });
          });
};
makeResponsive();
d3.select(window).on("resize", makeResponsive);
