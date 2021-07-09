//Establishing SVG Height and Width
var svgWidth = 1000;
var svgHeight = 600;

//Setting Margins
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

//Defining Chart Height and Chart Width
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Creating SVG Container
var svg = d3.select("body").select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

//Creating the Chart Group, with the "g"
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Defining my 2 intial variables for my axis
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Creating my Scale of X-Axis
function xScale(usa_data, chosenXAxis) {

  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(usa_data, d => d[chosenXAxis]) * 0.8,
      d3.max(usa_data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// Creating my Scale of Y-Axis
function yScale(usa_data, chosenYAxis) {

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(usa_data, d => d[chosenYAxis]) * 0.8,
      d3.max(usa_data, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;
};

// Creating my X-Axis
function renderXAxes(newXScale, xAxis) {
  var bottomXAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomXAxis);

  return xAxis;
};

// Creating my Y-Axis
function renderYAxes(newYScale, yAxis) {
  var bottomYAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(bottomYAxis);

  return yAxis;
};

//Creation of Circles in X Axis
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))

  return circlesGroup;
}

//Creation of Circles in Y Axis
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));


  return circlesGroup;
};

//Defining Labels of X-Axis
function renderXLabels(labels, newXScale, chosenXAxis) {
  labels.transition()
  .duration(1000)
  .attr("x", d => newXScale(d[chosenXAxis]));

  return labels;
};

//Defining Labels of Y-Axis
function renderYLabels(labels, newYScale, chosenYAxis) {
  labels.transition()
  .duration(1000)
  .attr("y", d => newYScale(d[chosenYAxis]));

  return labels;
};

//Definition of UpdateToolTip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var xlabel;
  // X Labels Options

  if (chosenXAxis === "poverty") {
    xlabel = "Poverty";
  }
  else if (chosenXAxis === "age") {
      xlabel = "Age";
  }
  else if (chosenXAxis === "income") {
      xlabel = "Income";
  }

  //Y Labels Options
  var ylabel;

  if (chosenYAxis === "healthcare") {
    ylabel = "Healthcare";
  }
  else if (chosenYAxis === "obesity") {
      ylabel = "Obesity";
  }
  else if (chosenYAxis === "smokes") {
      ylabel = "Smokes";
  }


  //Establishing the Mouse Over and Mouse Out
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`<b>${d.state}</b><br><b>${xlabel}:</b> ${d[chosenXAxis]}<br><b>${ylabel}:</b> ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  });

    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

//Extracting Data From The CSV File, Following a Path
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

  //Redifining my Linear Scales
  var xLinearScale = xScale(usa_data, chosenXAxis);
  var yLinearScale = yScale(usa_data, chosenYAxis);



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
