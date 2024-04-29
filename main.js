const fruits = [
  { name: "🍊", count: 21 },
  { name: "🍇", count: 13 },
  { name: "🍏", count: 8 },
  { name: "🍌", count: 5 },
  { name: "🍐", count: 4 },
  { name: "🍋", count: 2 },
  { name: "🍎", count: 2 },
  { name: "🍉", count: 2 },
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

  // Seleccionar todos los elementos `path`
  const paths = svg.selectAll("path").data(data);

  // Eliminar los elementos `path` que no se necesitan
  paths.exit().remove();

  // Aplicar transiciones a los elementos existentes
  paths
    .transition()
    .duration(1000) // Duración de la transición
    .attr("d", arc);

  // Añadir nuevos elementos `path`
  paths
    .enter()
    .append("path")
    .style("fill", "steelblue")
    .attr("d", arc)
    .transition()
    .duration(1000) // Duración de la transición
    .attrTween("d", function (d) {
      const interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function (t) {
        return arc(interpolate(t));
      };
    });

  // Seleccionar todos los elementos de texto
  const text = svg.selectAll("text").data(data);

  // Eliminar los elementos de texto que no se necesitan
  text.exit().remove();

  // Añadir nuevos elementos de texto
  const newText = text
    .enter()
    .append("text")
    .style("fill", "white")
    .attr("text-anchor", "middle")
    .attr("transform", function (d) {
      const centroid = arc.centroid(d);
      return `translate(${centroid})`;
    });

  // Añadir primer línea de texto (nombre de la fruta)
  newText
    .append("tspan")
    .style("font-size", "24")
    .attr("x", "0")
    .text(function (d) {
      return d.data.name;
    });

  // Añadir segunda línea de texto (cantidad)
  newText
    .append("tspan")
    .style("font-size", "18")
    .attr("x", "0")
    .attr("dy", "1.3em")
    .text(function (d) {
      return d.value;
    });
}

// Llamar a la función `updateData` cada 2 segundos
setInterval(updateData, 2000);

// Llamar a `updateData` por primera vez para dibujar el gráfico inicial
updateData();
