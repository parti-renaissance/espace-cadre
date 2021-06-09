const listOfElections = {
    europeennes2014(feature, layer) {
        for (let i = feature.properties.elections; i < feature.properties.elections.length; i += 1) {
            const pepito = feature.properties.elections[i];
            console.log(pepito);
        }
        const resultats = feature.properties.elections[2].resultats.map(
            (el) => `${el.nuance}: ${el.voix} voix<br>`,
        );

        const tooltip = `
            ${feature.properties.nom} > ${feature.properties.elections[2].election}<br><br>
            Voix exprimés:  ${feature.properties.elections[2].exprimes}<br>
            Nombre d'inscrits: ${feature.properties.elections[2].inscrits}<br>
            Nombre de votants: ${feature.properties.elections[2].votants}<br>
            Résultats:<br> ${resultats}
            `;
        layer.bindPopup(tooltip);
    },

    departementales2015(feature, layer) {
        const premierTour = feature.properties.elections[0].resultats.map(
            (el) => `${el.nuance}: ${el.voix} voix<br>`,
        );
        const secondTour = feature.properties.elections[1].resultats.map(
            (el) => `${el.nuance}: ${el.voix} voix<br>`,
        );
        const tooltip = `
                <div>
                    <strong>${feature.properties.nom} > ${feature.properties.elections[0].election}</strong><br><br>
                    <strong>1er tour:</strong><br>
                    Voix exprimés:  ${feature.properties.elections[0].exprimes}<br>
                    Nombre d'inscrits: ${feature.properties.elections[0].inscrits}<br>
                    Nombre de votants: ${feature.properties.elections[0].votants}<br>
                    Résultats:<br>${premierTour}<br><br>
                    <strong>2e tour:</strong><br>
                    Voix exprimés:  ${feature.properties.elections[1].exprimes}<br>
                    Nombre d'inscrits: ${feature.properties.elections[1].inscrits}<br>
                    Nombre de votants: ${feature.properties.elections[1].votants}<br>
                    Résultats:<br>${secondTour}
                </div>
            `;
        layer.bindPopup(tooltip);
    },
};
export default listOfElections;
