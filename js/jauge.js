(function() {
    d3.csv("../Base_application.csv").then(data => {
        // Filtrer et parser les données
        const filteredData = data.filter(d => d.CO2_economise && !isNaN(parseFloat(d.CO2_economise)))
                                 .map(d => parseFloat(d.CO2_economise));

        // Préparer les données pour le graphique
        const totalCO2 = d3.sum(filteredData);
        const categories = ["CO2 économisé", "Reste"];
        
        // Estimation des émissions théoriques de CO2
        const averageDistanceKm = 20; // Distance moyenne domicile-travail en km
        const factorEmission = 0.12; // Facteur d'émission en kg/km
        const numberOfEmployees = data.length; // Nombre d'employés (lignes dans le CSV)
        const theoreticalCO2 = averageDistanceKm * factorEmission * numberOfEmployees;


        const objectiveCO2 = theoreticalCO2 * 0.5;
        const dataPie = [
            {label: categories[0], value: totalCO2},
            {label: categories[1], value: objectiveCO2 - totalCO2 > 0 ? objectiveCO2 - totalCO2 : 0}
        ];

        // Dimensions du graphique
        const width = 300;
        const height = 300;
        const margin = 20;
        const radius = Math.min(width, height) / 2 - margin;

        // Créer un conteneur SVG
        const svg = d3.select("#statsE")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        // Générer les arcs
        const pie = d3.pie()
            .value(d => d.value);

        const dataReady = pie(dataPie);

        // Générer les sections de l'anneau
        const arc = d3.arc()
            .innerRadius(radius * 0.5) // Rayon intérieur pour créer l'effet "donut"
            .outerRadius(radius);

        // Ajouter les couleurs
        const color = d3.scaleOrdinal()
            .domain(categories)
            .range(["#4caf50", "#ddd"]);

        // Dessiner le graphique
        svg.selectAll("path")
            .data(dataReady)
            .join("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.label))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .on("mouseover", function(event, d) {
                tooltip.style("display", "block")
                       .text(`${d.data.label}: ${d.data.value.toFixed(2)} kg`);
            })
            .on("mousemove", function(event) {
                tooltip.style("left", (event.pageX + 10) + "px")
                       .style("top", (event.pageY - 25) + "px");
            })
            .on("mouseout", function() {
                tooltip.style("display", "none");
            });

        // Ajouter un tooltip
        const tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("background", "#333")
            .style("color", "#fff")
            .style("padding", "5px 10px")
            .style("border-radius", "5px")
            .style("font-size", "12px")
            .style("display", "none");

        // Ajouter les labels au centre du donut
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "-0.5em")
            .style("font-size", "16px")
            .text("Objectif");
        
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "1em")
            .style("font-size", "14px")
            .text(`${objectiveCO2.toFixed(2)} kg`);
    }).catch(error => {
        console.error("Erreur lors du chargement des données CSV :", error);
    });
})();
