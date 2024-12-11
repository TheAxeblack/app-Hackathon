(function(){
    // Charger les données CSV
    d3.csv("Base_application.csv").then(data => {
        // Filtrer et parser les données pour éviter les valeurs incorrectes
        const filteredData = data.filter(d => d.CO2_economise && !isNaN(parseFloat(d.CO2_economise)))
                                 .map(d => parseFloat(d.CO2_economise));

        // Calculer le total de CO2 économisé
        const totalCO2 = d3.sum(filteredData);

        // Estimation des émissions théoriques de CO2
        const averageDistanceKm = 20; // Distance moyenne domicile-travail en km
        const factorEmission = 0.12; // Facteur d'émission en kg/km
        const numberOfEmployees = data.length; // Nombre d'employés (lignes dans le CSV)
        const theoreticalCO2 = averageDistanceKm * factorEmission * numberOfEmployees;

        // Objectif à 50% de l'estimation théorique
        const objectiveCO2 = theoreticalCO2 * 0.5;

        // Définir les dimensions de la jauge
        const gaugeHeight = 300; // Ajuster la hauteur de la jauge
        const gaugeWidth = 100;  // Largeur de la jauge
        const maxCO2 = Math.max(500, theoreticalCO2); // Ajuster le max pour inclure l'estimation

        // Créer un conteneur SVG
        const svg = d3.select("#statsE")
            .append("svg")
            .attr("width", gaugeWidth + 50) // Ajouter de l'espace pour l'échelle
            .attr("height", gaugeHeight + 20) // Ajouter de l'espace pour éviter la coupure
            .style("margin-top", "10px"); // Ajouter une marge supérieure pour centrer visuellement

        // Échelle pour la jauge
        const scale = d3.scaleLinear()
            .domain([0, maxCO2])
            .range([gaugeHeight, 0]);

        // Ajouter une bordure autour de la jauge
        svg.append("rect")
            .attr("x", gaugeWidth / 4 - 5)
            .attr("y", 0)
            .attr("width", gaugeWidth / 2 + 10)
            .attr("height", gaugeHeight)
            .attr("fill", "none")
            .attr("stroke", "#000")
            .attr("stroke-width", 2);

        // Ajouter un rectangle pour la jauge
        svg.append("rect")
            .attr("x", gaugeWidth / 4)
            .attr("y", scale(0))
            .attr("width", gaugeWidth / 2)
            .attr("height", gaugeHeight - scale(0))
            .attr("fill", "#ddd");

        // Ajouter la jauge qui affiche le CO2 économisé
        const bar = svg.append("rect")
            .attr("x", gaugeWidth / 4)
            .attr("y", scale(0))
            .attr("width", gaugeWidth / 2)
            .attr("height", 0)
            .attr("fill", "#4caf50")
            .on("mouseover", function() {
                tooltip.style("display", "block")
                       .text(`${totalCO2.toFixed(2)} kg`);
            })
            .on("mousemove", function(event) {
                tooltip.style("left", (event.pageX + 10) + "px")
                       .style("top", (event.pageY - 25) + "px");
            })
            .on("mouseout", function() {
                tooltip.style("display", "none");
            })
            .transition()
            .duration(2000)
            .attr("y", scale(totalCO2))
            .attr("height", gaugeHeight - scale(totalCO2));

        // Ajouter une ligne pour l'objectif
        svg.append("line")
            .attr("x1", gaugeWidth / 4)
            .attr("x2", (3 * gaugeWidth) / 4)
            .attr("y1", scale(objectiveCO2))
            .attr("y2", scale(objectiveCO2))
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "4,2");

        // Ajouter le texte pour la limite
        svg.append("text")
            .attr("x", gaugeWidth / 2)
            .attr("y", scale(objectiveCO2) - 5)
            .attr("text-anchor", "middle")
            .text(`Limite : ${objectiveCO2.toFixed(2)}`)
            .style("fill", "red")
            .style("font-size", "12px");

        // Ajouter les graduations
        const ticks = scale.ticks(5);
        ticks.forEach(tick => {
            svg.append("line")
                .attr("x1", gaugeWidth / 4 - 10) // Décalé légèrement à gauche du rectangle
                .attr("x2", gaugeWidth / 4)
                .attr("y1", scale(tick))
                .attr("y2", scale(tick))
                .attr("stroke", "black")
                .attr("stroke-width", 1);

            svg.append("text")
                .attr("x", gaugeWidth / 4 - 15) // Position du texte à gauche des graduations
                .attr("y", scale(tick) + 5)
                .attr("text-anchor", "end")
                .text(`${tick.toFixed(0)}`) // Retirer 'kg'
                .style("fill", "black")
                .style("font-size", "10px");
        });

        // Ajouter un tooltip pour afficher la valeur au survol
        const tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("background", "#333")
            .style("color", "#fff")
            .style("padding", "5px 10px")
            .style("border-radius", "5px")
            .style("font-size", "12px")
            .style("display", "none");
    }).catch(error => {
        console.error("Erreur lors du chargement des données CSV :", error);
    });
})();
