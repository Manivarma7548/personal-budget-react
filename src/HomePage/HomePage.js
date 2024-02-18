import React, { useEffect, useRef } from "react";
import axios from "axios";
import { Chart as ChartJS } from "chart.js/auto";
import * as d3 from "d3";
import { pie, arc } from "d3-shape";

function HomePage() {
  const canvasRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const dataSource = {
      datasets: [
        {
          data: [],
          backgroundColor: [
            '#ffcd56',
            '#ff6384',
            '#36a2eb',
            '#fd6b19',
            '#ff5733',
            '#4caf50',
            '#9c27b0',
            '#008080',
            '#ffa500', 
            '#800080', 
            '#ff1493', 
            '#00ff00',
          ],
        },
      ],
      labels: [],
    };

    function createChart() {
      var ctx = canvasRef.current.getContext("2d");
      var myPieChart = new ChartJS(ctx, { 
        type: "pie",
        data: dataSource,
      });
    }

    function getBudget() {
      axios.get("/budget.json").then(function (res) {
        console.log(res);
        for (var i = 0; i < res.data.myBudget.length; i++) {
          dataSource.datasets[0].data[i] = res.data.myBudget[i].budget;
          dataSource.labels[i] = res.data.myBudget[i].title;
        }
        createChart();
        createD3Chart(res.data.myBudget);
      }).catch(function (error) {
        console.error("Error fetching budget data: ", error);
      });
    }

    function createD3Chart(data) {
        const svg = d3.select(svgRef.current);
        
        const width = 500;
        const height = 500;
        const radius = Math.min(width, height) / 2;
        
        svg.attr("width", width).attr("height", height);
        
        const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);
        
        const color = d3.scaleOrdinal()
          .domain(data.map((d) => d.title))
          .range([
            '#ffcd56',
            '#ff6384',
            '#36a2eb',
            '#fd6b19',
            '#ff5733',
            '#4caf50',
            '#9c27b0',
            '#008080', 
            '#ffa500', 
            '#800080', 
            '#ff1493', 
            '#00ff00', 
          ]);
      
        const pieGenerator = pie().value((d) => d.budget);
        
        const pathGenerator = arc()
          .outerRadius(radius * 0.6)
          .innerRadius(radius * 0.3);
        
        const arcs = pieGenerator(data);
        
        const arcPaths = g
          .selectAll("path")
          .data(arcs)
          .enter()
          .append("path")
          .attr("d", pathGenerator)
          .attr("fill", (d) => color(d.data.title))
          .attr("stroke", "white")
          .style("stroke-width", "2px")
          .on("mouseover", function(event, d) {
            d3.select(this)
              .attr("fill", "yellow")
              .attr("cursor", "pointer");
            
            // Tooltip
            const tooltip = d3.select("#tooltip");
            tooltip.style("visibility", "visible")
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 15) + "px")
              .text(`${d.data.title}: ${d.data.budget}`);
          })
          .on("mouseout", function(event, d) {
            d3.select(this)
              .attr("fill", (d) => color(d.data.title))
              .attr("cursor", "default");
            
            // Hide tooltip
            d3.select("#tooltip").style("visibility", "hidden");
          });
        
        // Legends
        const legend = svg.selectAll(".legend")
          .data(arcs)
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(" + (width - 100) + "," + (i * 20 + 20) + ")"; });
      
        legend.append("rect")
          .attr("x", 0)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", function(d) { return color(d.data.title); });
      
        legend.append("text")
          .attr("x", 25)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .text(function(d) { return d.data.title; });
        
        g.attr("transform", `translate(${width / 2},${height / 2})`);
        
        console.log("SVG Width:", width);
        console.log("SVG Height:", height);
      }
      
      

    getBudget();
  }, []);

  return (
    <div className="container center" id="main">
      <div className="page-area">
        <div className="text-box">
          <h1>Stay on track</h1>
          <p>
            Do you know where you are spending your money? If you really stop to track it down,
            you would get surprised! Proper budget management depends on real data... and this
            app will help you with that!
          </p>
        </div>

        <div className="text-box">
          <h1>Alerts</h1>
          <p>
            What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
          </p>
        </div>

        <div className="text-box">
          <h1>Results</h1>
          <p>
            People who stick to a financial plan, budgeting every expense, get out of debt faster!
            Also, they to live happier lives... since they expend without guilt or fear...
            because they know it is all good and accounted for.
          </p>
        </div>

        <div className="text-box">
          <h1>Free</h1>
          <p>
            This app is free!!! And you are the only one holding your data!
          </p>
        </div>

        <div className="text-box">
          <h1>Stay on track</h1>
          <p>
            Do you know where you are spending your money? If you really stop to track it down,
            you would get surprised! Proper budget management depends on real data... and this
            app will help you with that!
          </p>
        </div>

        <div className="text-box">
          <h1>Alerts</h1>
          <p>
            What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
          </p>
        </div>

        <div className="text-box">
          <h1>Results</h1>
          <p>
            People who stick to a financial plan, budgeting every expense, get out of debt faster!
            Also, they to live happier lives... since they expend without guilt or fear...
            because they know it is all good and accounted for.
          </p>
        </div>

        <div className="text-box">
          <h1>Chart</h1>
          <p>
            <canvas ref={canvasRef} width="400" height="400"></canvas>
          </p>
        </div>
        <div className="new" id="this">
          <h1>D3JS chart</h1>
          <svg ref={svgRef} width={900} height={900}></svg>
          <div id="tooltip" style={{ visibility: "hidden", position: "absolute", backgroundColor: "white", padding: "5px", border: "1px solid black" }}></div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
