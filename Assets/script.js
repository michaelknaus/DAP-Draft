// Load the CSV data
d3.csv('data_wo_nan.csv').then(data => {
    // Parse the date and convert string to number
    data.forEach(d => {
        d.time = new Date(d.time);
        d.tmax = +d.tmax;
        d.tmin = +d.tmin;
        d.t = +d.t;
    });

    // Set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#chart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.time))
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([d3.min(data, d=>d.tmin), d3.max(data, d => d.tmax)])
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add the line
    const line = svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5);

    // Function to update the line based on selected temperature type
    function update(tempType, month) {
        let filteredData = data.filter(d => d.time.getUTCMonth() === month);
        line.datum(filteredData) 
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x(d => x(d.time))
                .y(d => y(d[tempType]))
            );
    }

    // Create a dropdown to toggle between different temperature types
    const tempDropdown = d3.select("body")
        .append("select")
        .attr("id", "tempDropdown")
        .on("change", function() {
            update(this.value, +document.getElementById('monthDropdown').value);
        });
    tempDropdown.selectAll("option")
        .data(["tmax", "tmin", "t"])
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    // Create a dropdown to toggle between different months
    const monthDropdown = d3.select("body")
        .append("select")
        .attr("id", "monthDropdown")
        .on("change", function() {
            update(document.getElementById('tempDropdown').value, +this.value);
        });
    monthDropdown.selectAll("option")
        .data(d3.range(0, 12))
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d3.timeFormat("%B")(new Date(2000, d)));  // Format month number as month name

    // Initial rendering
    update('tmax', 0);
});