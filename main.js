const fruits = [
  { name: "🍊", count: 21 },
  { name: "🍇", count: 13 },
  { name: "🍏", count: 8 },
  { name: "🍌", count: 5 },
  { name: "🍐", count: 3 },
  { name: "🍋", count: 2 },
  { name: "🍎", count: 1 },
  { name: "🍉", count: 1 },
];

const fn = (d) => d.count;
const data = d3.pie().value(fn)(fruits);

const arc = d3
  .arc()
  .innerRadius(210)
  .outerRadius(310)
  .padRadius(300)
  .padAngle(2 / 300)
  .cornerRadius(8);

const js = d3.select("#js");
js.select(".loading").remove();

const svg = js
  .append("svg")
  .attr("viewBox", "-320 -320 640 640")
  .attr("width", "400")
  .attr("height", "400");

for (const d of data) {
  svg.append("path").style("fill", "steelblue").attr("d", arc(d));

  const text = svg
    .append("text")
    .style("fill", "white")
    .attr("transform", `translate(${arc.centroid(d).join(",")})`)
    .attr("text-anchor", "middle");

  text
    .append("tspan")
    .style("font-size", "24")
    .attr("x", "0")
    .text(d.data.name);

  text
    .append("tspan")
    .style("font-size", "18")
    .attr("x", "0")
    .attr("dy", "1.3em")
    .text(d.value);
}
