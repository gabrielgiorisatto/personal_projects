'use client'
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const getRandom = (min: number, max: number): number => min + Math.round(Math.random() * 10)*(max-min)/10;

const App: React.FC = () => {
  const [circles, setCircles] = useState<{ x: number, y: number, radius: number }[]>([]);
  const [linked, setLinked] = useState(false);
  const svgRef = useRef(null);

  function randomizeCircles() {
    const generatedCircles = Array.from({ length: 10 }, () => ({
      x: getRandom(40, 560),
      y: getRandom(40, 560),
      radius: 10
    }));
    setCircles(generatedCircles);
  }

  useEffect(() => {
    randomizeCircles();
  }, []);

  useEffect(() => {
    const width = 600;
    const height = 600;
    const marginTop = 40;
    const marginRight = 40;
    const marginBottom = 40;
    const marginLeft = 40;
    const svg = d3.select(svgRef.current)
      .attr('class', 'relative bg-gray-200')
      .attr('width', width)
      .attr('height', height)
      .attr("viewBox", [0, 0, width, height]);

    // Limpa o SVG antes de re-renderizar
    svg.selectAll('*').remove();

    const x = d3.scaleLinear().domain([0, 1])
      .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear().domain([0, 1])
      .range([height - marginBottom, marginTop]);

    const axisx = svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).tickSize(-height + marginTop + marginBottom).ticks(10));

    axisx.selectAll("line")
    .style("stroke", "black");
    axisx.selectAll("path")
    .style("stroke", "black");
    axisx.selectAll("text")
    .style("stroke", "black");

    const axisy = svg.append("g")
    .attr("transform", `translate(${marginLeft}, 0)`)
    .call(d3.axisLeft(y).tickSize(-width + marginLeft + marginRight).ticks(10));

    axisy.selectAll("line")
    .style("stroke", "black");
    axisy.selectAll("path")
    .style("stroke", "black");
    axisy.selectAll("text")
    .style("stroke", "black");

    // svg.append('g')
    // .attr('class', 'y axis-grid')
    // .call(d3.axisLeft(y).tickSize(-width + marginLeft).ticks(10));

    // Desenha os círculos
    svg.selectAll('circle')
      .data(circles)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.radius)
      .attr('fill', 'blue');

    // Desenha as linhas entre os círculos se linked for true
    if (linked) {
      circles.forEach((circleA, indexA) => {
        circles.slice(indexA + 1).forEach((circleB) => {
          svg.append('line')
            .attr('x1', circleA.x)
            .attr('y1', circleA.y)
            .attr('x2', circleB.x)
            .attr('y2', circleB.y)
            .attr('stroke', 'black')
            .attr('stroke-width', 2);
        });
      });
    }

  }, [circles, linked]);

  const toggleLinked = () => {
    setLinked(prevLinked => !prevLinked);
  };

  return (
    <div>
      <button onClick={toggleLinked} className="mb-4 p-2 bg-blue-500 text-white">
        {linked ? 'Unlink Circles' : 'Link Circles'}
      </button>
      <button onClick={randomizeCircles} className="mb-4 p-2 bg-blue-500 text-white">
        Randomize Circles
      </button>
      <svg style={{margin: '40px'}} ref={svgRef}></svg>
    </div>
  );
};

export default App;
