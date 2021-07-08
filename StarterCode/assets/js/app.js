//Starting Responsive Function
function makeResponsive() {

    //Selecting svgArea
    var svgArea = d3.select("body").select("svg");

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
}
