d3.csv("../Base_application.csv").then(data => {
  // Préparer les catégories
  const categories = Array.from(new Set(data.map(d => d.Departement))).filter(d => d);

  // Compter le nombre d'occurrences de chaque catégorie dans "Departement"
  const departmentCounts = categories.map(category => {
    return {
      label: category,
      value: data.filter(d => d.Departement === category).length,
      color: category === "Com" ? "#CB2D5A" : "#3C3C3B" // Couleur spéciale pour "Com"
    };
  });

  // Calculer le pourcentage de chaque catégorie
  const total = d3.sum(departmentCounts, d => d.value);
  const dataWithPercentages = departmentCounts.map(d => ({
    ...d,
    percentage: total > 0 ? (d.value / total * 100).toFixed(1) : 0
  }));

  // Dimensions du graphique
  const width = 400;
  const height = 300;
  const margin = {top: 40, right: 20, bottom: 50, left: 50};

  // Créer le conteneur SVG
  const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("width", width + 50)
    .attr("height", height + 125);

  // Créer les échelles
  const xScale = d3.scaleBand()
    .domain(dataWithPercentages.map(d => d.label))
    .range([margin.left, width - margin.right])
    .padding(0.3);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataWithPercentages, d => d.percentage)])
    .range([height - margin.bottom, margin.top]);

  // Ajouter les axes
  svg.append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("font-size", "10px")
    .style("fill", "#3C3C3B")
    .attr("transform", "rotate(45)")
    .attr("text-anchor", "start");


  svg.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale).ticks(5))
    .selectAll("text")
    .style("font-size", "14px")
    .style("fill", "#3C3C3B");

  // Dessiner les barres
  svg.selectAll(".bar")
    .data(dataWithPercentages)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.label) + 5)
    .attr("y", d => yScale(d.percentage))
    .attr("width", xScale.bandwidth() - 10)
    .attr("height", d => height - margin.bottom - yScale(d.percentage))
    .attr("fill", d => d.color)
    .attr("rx", 10)
    .attr("ry", 10);

  // Ajouter les labels
  svg.selectAll(".label")
    .data(dataWithPercentages)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", d => xScale(d.label) + xScale.bandwidth() / 2)
    .attr("y", d => yScale(d.percentage) - 10)
    .attr("text-anchor", "middle")
    .style("fill", "#3C3C3B")
    .style("font-weight", "bold")
    .text(d => `${d.percentage}`);
}).catch(error => {
  console.error("Erreur lors du chargement des données CSV :", error);
});