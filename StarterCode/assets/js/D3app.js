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
  })

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

  //Left Axis (Y) and Bottom Axis (X)
  var bottomXAxis = d3.axisBottom(xLinearScale);
  var bottomYAxis = d3.axisLeft(yLinearScale);

  //Calling the XAxis and the YAxis
  var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomXAxis);

  var yAxis = chartGroup.append("g")
  .classed("y-axis", true)
  .attr("transform", `translate(0,0)`)
  .call(bottomYAxis);

  //Default Circle Group Values
  var circlesGroup = chartGroup.selectAll("circle")
  .data(usa_data)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d[chosenYAxis]))
  .attr("r", 8)
  .attr("stroke","red")
  .attr("fill", "blue")
  .attr("opacity", "0.5")

  //Default Labels Group Values
  var labels =  chartGroup.append("g").selectAll("text")
  .data(usa_data)
  .enter()
  .append("text")
  .attr("x", d => xLinearScale(d[chosenXAxis]))
  .attr("y", d => yLinearScale(d[chosenYAxis]))
  .attr("dy", "0.35em")
  .attr("font-size",".6em")
  .attr("font-weight","bold")
  .attr("text-anchor","middle")
  .attr("font-family","Tahoma, sans-serif")
  .style("fill", "lightblue")
  .attr("class", "abbr")
  .text(function(d){return d.abbr});

  var xlabels = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 15})`);

  var povertyLabel = xlabels.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "poverty")
  .attr("id", "axislabels")
  .classed("active", true)
  .text("Poverty Rating");

  var ageLabel = xlabels.append("text")
  .attr("x", 0)
  .attr("y", 40)
  .attr("value", "age")
  .attr("id", "axislabels")
  .classed("inactive", true)
  .text("Age Rating");

  var incomeLabel = xlabels.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "income")
  .attr("id", "axislabels")
  .classed("inactive", true)
  .text("Income Rating");

  var ylabels = chartGroup.append("g")
  .attr("transform", "rotate(-90)");

  var healthcareLabel = ylabels.append("text")
  .attr("y", 0 - margin.left + 60)
  .attr("x", 0 - (height / 2))
  .attr("value", "healthcare")
  .attr("id", "axislabels")
  .classed("active", true)
  .text("Healthcare")

  var smokesLabel = ylabels.append("text")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 2))
  .attr("value", "smokes")
  .attr("id", "axislabels")
  .classed("inactive", true)
  .text("Smokes")

  var obesityLabel = ylabels.append("text")
  .attr("y", 0 - margin.left + 20)
  .attr("x", 0 - (height / 2))
  .attr("value", "obesity")
  .classed("inactive", true)
  .attr("id", "axislabels")
  .text("Obesity");

  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  xlabels.selectAll("text")
          .on("click", function () {

              var selected_item = d3.select(this);
              var selected_value = d3.select(this).attr("value");
              if (selected_value !== chosenXAxis) {

                  chosenXAxis = selected_value;
                  xLinearScale = xScale(usa_data, chosenXAxis);
                  xAxis = renderXAxes(xLinearScale, xAxis);


                  circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
                  circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
                  labels = renderXLabels(labels, xLinearScale, chosenXAxis);

                  if (chosenXAxis === "poverty") {

                      povertyLabel
                          .classed("active", true)
                          .classed("inactive", false);
                      ageLabel
                          .classed("active", false)
                          .classed("inactive", true);
                      incomeLabel
                          .classed("active", false)
                          .classed("inactive", true);

                  } else if (chosenXAxis === "age") {

                      povertyLabel
                          .classed("active", false)
                          .classed("inactive", true);
                      ageLabel
                          .classed("active", true)
                          .classed("inactive", false);
                      incomeLabel
                          .classed("active", false)
                          .classed("inactive", true);

                  } else {

                      povertyLabel
                          .classed("active", false)
                          .classed("inactive", true);
                      ageLabel
                          .classed("active", false)
                          .classed("inactive", true);
                      incomeLabel
                          .classed("active", true)
                          .classed("inactive", false);

                  }
              }
          });

          ylabels.selectAll("text")
          .on("click", function () {
              var selected_item = d3.select(this);
              var selected_value = d3.select(this).attr("value");
              if (selected_value !== chosenYAxis) {

                  chosenYAxis = selected_value;
                  yLinearScale = yScale(usa_data, chosenYAxis);
                  yAxis = renderYAxes(yLinearScale, yAxis);


                  circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
                  circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
                  labels = renderYLabels(labels, yLinearScale, chosenYAxis);

                  if (chosenYAxis === "obesity") {

                      obesityLabel
                          .classed("active", true)
                          .classed("inactive", false);
                      smokesLabel
                          .classed("active", false)
                          .classed("inactive", true);
                      healthcareLabel
                          .classed("active", false)
                          .classed("inactive", true);

                  } else if (chosenYAxis === "smokes") {

                      obesityLabel
                          .classed("active", false)
                          .classed("inactive", true);
                      smokesLabel
                          .classed("active", true)
                          .classed("inactive", false);
                      healthcareLabel
                          .classed("active", false)
                          .classed("inactive", true);

                  } else {

                      obesityLabel
                          .classed("active", false)
                          .classed("inactive", true);
                      smokesLabel
                          .classed("active", false)
                          .classed("inactive", true);
                      healthcareLabel
                          .classed("active", true)
                          .classed("inactive", false);

                  }
              }
          });


  });