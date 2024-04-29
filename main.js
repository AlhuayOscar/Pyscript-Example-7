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

function updateData() {
  // Actualizar los datos de frutas
  fruits.forEach((fruit) => {
    fruit.count = Math.floor(Math.random() * 20) + 1; // Simulación de datos cambiantes
  });

  const data = d3.pie().value(fn)(fruits);

  // Limpiar el SVG
  svg.selectAll("*").remove();

  // Volver a dibujar el gráfico
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
  
}

// Llamar a la función `updateData` cada 2 segundos
setInterval(updateData, 2000);

// Llamar a `updateData` por primera vez para dibujar el gráfico inicial
updateData();
