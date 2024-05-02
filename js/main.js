/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

const WIDTH = 800;
const HEIGHT = 600;

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT)

// create margins & dimensions
const margin = {top: 20, right: 20, bottom: 100, left: 100};
const graphWidth = WIDTH - margin.left - margin.right;
const graphHeight = HEIGHT - margin.top - margin.bottom;

const graph = svg.append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// create axes groups
const xAxisGroup = graph.append('g')
  .attr('transform', `translate(0, ${graphHeight})`)

const yAxisGroup = graph.append('g');

//X label
graph.append("text")
  .attr("class", "x axis-label")
  .attr("x", graphWidth / 2)
  .attr("y", graphHeight + 70)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Month")

// Y label
graph.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (graphHeight / 2))
  .attr("y", -80)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Revenue ($)")

//scales;
const x = d3.scaleBand()
    .range([0, graphWidth])
    .paddingInner(0.2)
    .paddingOuter(0.2)

const y = d3.scaleLinear()
    .range([graphHeight, 0]);

// create axes
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y).ticks(3).tickFormat(d => '$' + d);

//update x axes text;
xAxisGroup.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end')
    .attr('fill', 'purple')

//transition;
const t = d3.transition().duration(500);

//update function;
const update = (data) => {

  //updating scale domains;
  x.domain(data.map(d => d.month));
  y.domain([0, d3.max(data, d => d.revenue)]);

  // join the data to circs
  const rects = graph.selectAll("rect").data(data);

  //remove exit selection;
  rects.exit().remove();

  // append the enter selection to the DOM
  rects.enter().append("rect")
    .attr("y", graphHeight)
    .attr("x", (d) => x(d.month))
    .attr("width", x.bandwidth)
    .attr("height", 0)
    .attr("fill", "purple")
    .transition().duration(500)
      .attr("y", d => y(d.revenue))
      .attr("height", d => graphHeight - y(d.revenue))



  //call axes
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
}

const data = [];

//get data from firestore
db.collection('revenues').onSnapshot(res => {


  res.docChanges().forEach(change => {

    const doc = {...change.doc.data(), id: change.doc.id};

    switch(change.type) {
      case 'added':
        data.push(doc);
        break;
      case 'modified':
        const index = data.findIndex(item = item.id === doc.id);
        data[index] = doc;
        break;
      case 'removed':
        data = data.filter(item => item.id !== doc.id);
        break;
      default:
        break;
    }
  })

  update(data);

})
