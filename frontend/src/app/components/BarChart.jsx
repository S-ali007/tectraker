import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const StackedBarChart = ({ width = 1330, height = 400 }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();

  // Data with categories representing seconds spent on different dates
  const data = [
    { date: "Sep 16", project1: 10, project2: 30, project3: 20 },
    { date: "Sep 17", project1: 30, project2: 50, project3: 10 },
    { date: "Sep 18", project1: 90, project2: 70, project3: 50 },
    { date: "Sep 19", project1: 50, project2: 40, project3: 30 },
    { date: "Sep 20", project1: 140, project2: 60, project3: 20 },
    { date: "Sep 21", project1: 0, project2: 0, project3: 0 },
    { date: "Sep 22", project1: 0, project2: 0, project3: 0 },
    { date: "Sep 23", project1: 0, project2: 0, project3: 0 },
  ];

  useEffect(() => {
    const margin = { top: 10, right: 50, bottom: 40, left: 50 };
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const tooltip = d3.select(tooltipRef.current);
    tooltip.style("opacity", 0); // Hide tooltip initially

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr("width", width).attr("height", height);

    // X scale (Dates)
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.date))
      .range([0, innerWidth])
      .padding(0.3);

    // Y scale (Time in seconds)
    const y = d3
      .scaleLinear()
      .domain([0, 240]) // Adjust domain as needed
      .range([innerHeight, 0]);

    const color = d3.scaleOrdinal()
      .domain(["project1", "project2", "project3"])
      .range(["#B1BFC4", "#4C6D93", "#E8DFF5"]);

    const stack = d3.stack()
      .keys(["project1", "project2", "project3"])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const series = stack(data);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X-axis (dates)
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickSize(0))
      .select("path")
      .style("stroke", "#9CAAAA");

    // Y grid lines
    const yTicks = y.ticks(5);
    yTicks.forEach((tick) => {
      g.append("line")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("y1", y(tick))
        .attr("y2", y(tick))
        .style("stroke", "#9CAAAA")
        .style("stroke-dasharray", "4, 2");
    });

    // Add labels on grid lines
    g.selectAll(".grid-label")
      .data(yTicks)
      .enter()
      .append("text")
      .attr("class", "grid-label")
      .attr("x", -10)
      .attr("y", (d) => y(d))
      .attr("dy", "0.32em")
      .attr("text-anchor", "end")
      .style("fill", "#000000")
      .style("font-size", "12px")
      .style("opacity", 0.8)
      .text((d) => {
        if (d === 0) return "(HH:MM)";
        if (d === 45) return "45 secs";
        const minutes = Math.floor(d / 60);
        const seconds = d % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      });

    // Bars with animation
    g.selectAll(".layer")
      .data(series)
      .enter()
      .append("g")
      .attr("class", "layer")
      .attr("fill", (d) => color(d.key))
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.data.date))
      .attr("y", innerHeight)
      .attr("height", 0)
      .attr("width", x.bandwidth())
      .on("mouseover", (event, d) => {
        const project1 = d.data.project1; // Accessing the value directly by key
        const project2 = d.data.project2; // Accessing the value directly by key
        const project3 = d.data.project3; // Accessing the value directly by key
        tooltip
            .style("opacity", 1)
            .html(`Date: ${d.data.date}<br/>project1: ${project1} secs<br/>project2: ${project2} secs<br/>project3: ${project3} secs`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 28}px`);
    })
    
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX - 270}px`)
          .style("top", `${event.pageY - 68}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      })
      .transition()
      .duration(800)
      .ease(d3.easeCubicInOut)
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]));

  }, [data, width, height]);

  return (
    <div className="relative">
      <svg ref={svgRef} />
      <div
        ref={tooltipRef}
        className="absolute bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded pointer-events-none"
        style={{ zIndex: 10 }}
      />
    </div>
  );
};

export default StackedBarChart;
