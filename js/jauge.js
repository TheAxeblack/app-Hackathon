function createDonutChart(dataPath, elementId) {
  d3.csv(dataPath).then(data => {
    // Préparation des données
    const filteredData = data.filter(d => d.CO2_economise && !isNaN(parseFloat(d.CO2_economise)))
      .map(d => parseFloat(d.CO2_economise));
    const CO2Economise = d3.sum(filteredData);
    const categories = ["CO2 économisé", "Reste"];

    // Estimation des émissions théoriques de CO2
    const moyenneDistanceKm = 20; // Distance moyenne domicile-travail en km
    const facteurEmission = 0.12; // Facteur d'émission en kg/km
    const numberOfEmployees = data.length;
    const theoreticalCO2 = moyenneDistanceKm * facteurEmission * numberOfEmployees;
    const objectiveCO2 = theoreticalCO2 * 0.5;
    const resteC02 = objectiveCO2 - CO2Economise;

    const dataPie = [
      {label: categories[0], value: CO2Economise},
      {label: categories[1], value: resteC02 > 0 ? resteC02 : 0}
    ];

    // Dimensions du graphique
    const width = 300;
    const height = 300;
    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin;

    // Créer un conteneur SVG
    const svg = d3.select(elementId)
      .append("svg")
      .attr("class", "donut-chart")
      .attr("width", width)
      .attr("height", height);

    const g = svg.append("g")
      .attr("class", "donut-group")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Générer les arcs
    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);
    const color = d3.scaleOrdinal(categories, ["#77B82A", "#3C3C3B"]);
    const dataReady = pie(dataPie);

    // Dessiner le graphique
    g.selectAll("path")
      .data(dataReady)
      .join("path")
      .attr("class", "donut-arc")
      .attr("d", arc)
      .attr("fill", d => color(d.data.label));

    // Ajouter labels au centre
    g.append("text")
      .attr("class", "donut-label-title")
      .text("Objectif réalisé");

    g.append("text")
      .attr("class", "donut-label-value")
      .attr("dy", "1.5em")
      .text(`${(CO2Economise / objectiveCO2 * 100).toFixed(2)} %`);
  }).catch(error => {
    console.error("Erreur lors du chargement des données CSV :", error);
  });
}

createDonutChart("../Base_application.csv", "#donut");