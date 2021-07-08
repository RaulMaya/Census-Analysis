//Starting Responsive Function
function makeResponsive() {

    //Selecting svgArea
    var svgArea = d3.select("scatter").select("svg");

    //Deleting svgArea if it already exists
    if (!svgArea.empty()) {
      svgArea.remove();
    };

    //Establishing SVG Height and Width
    var svgHeight = window.innerHeight;
    var svgWidth = window.innerWidth;

    //Setting Margins
    var margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    };

    //Defining Chart Height and Chart Width
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;

    //Creating SVG Container
    var svg = d3.select("scatter").append("svg")
          .attr("height", svgHeight)
          .attr("width", svgWidth);


    var chartGroup = svg.append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var xaxis = "poverty";
    var yaxis = "healthcare";

    function xScale(usa_data, xaxis) {
      var xLinearScale = d3.scaleLinear()
        .domain([d3.min(usa_data, d => d[xaxis]) * 0.9,
          d3.max(usa_data, d => d[xaxis]) * 1.1
        ])
        .range([0, width]);

      return xLinearScale;

    }

    function renderAxes(newXScale, new_xaxis) {
      var bottom_Axis = d3.axisBottom(newXScale);

      new_xaxis.transition()
        .duration(1000)
        .call(bottom_Axis);

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
