d3.csv("../Base_application.csv").then(data => {
  const departments = data.map(d => d.Departement);
  const filteredData = data.filter(d => d.CO2_economise && !isNaN(parseFloat(d.CO2_economise)))
      .map(d => parseFloat(d.CO2_economise));
  const CO2Economise = d3.sum(filteredData);

}).catch(error => {
  console.error("Erreur lors du chargement des données CSV :", error);
});

// Données d'exemple
const data = [
  {label: "RH", value: 23.6, color: "#3C3C3B"},
  {label: "Com", value: 33.8, color: "#CB2D5A"},
  {label: "Commerce", value: 39.3, color: "#3C3C3B"},
  {label: "Production", value: 27.9, color: "#3C3C3B"},
];

// Dimensions du graphique
const width = 450;
const height = 300;
const margin = {top: 40, right: 20, bottom: 50, left: 50};

// Création du SVG
const svg = d3.select("#bar-chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Échelles
const xScale = d3.scaleBand()
  .domain(data.map(d => d.label))
  .range([margin.left, width - margin.right])
  .padding(0.3);

const yScale = d3.scaleLinear()
  .domain([0, 50]) // Maximum à ajuster selon vos données
  .range([height - margin.bottom, margin.top]);

// Axes
svg.append("g")
  .attr("transform", `translate(0, ${height - margin.bottom})`)
  .call(d3.axisBottom(xScale))
  .selectAll("text")
  .style("font-size", "14px")
  .style("fill", "#3C3C3B");

svg.append("g")
  .attr("transform", `translate(${margin.left}, 0)`)
  .selectAll("text")
  .style("font-size", "14px")
  .style("fill", "#3C3C3B");

// Dessin des colonnes
svg.selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", d => xScale(d.label))
  .attr("y", d => yScale(d.value))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - margin.bottom - yScale(d.value))
  .attr("fill", d => d.color)
  .attr("rx", 10) // Coins arrondis
  .attr("ry", 10);

// Ajout des étiquettes de pourcentage
svg.selectAll(".label")
  .data(data)
  .enter()
  .append("text")
  .attr("class", "label")
  .attr("x", d => xScale(d.label) + xScale.bandwidth() / 2)
  .attr("y", d => yScale(d.value) - 10)
  .attr("text-anchor", "middle")
  .style("fill", "#3C3C3B")
  .style("font-weight", "bold")
  .text(d => `${d.value}%`);
