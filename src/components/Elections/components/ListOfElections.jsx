const listOfElections = {
    europeennes2014(feature, layer) {
        /* const resultats = feature.properties.elections[2].resultats.map(
            (el) => `${el.nuance}: ${el.voix.toLocaleString()} voix<br />`,
        ).join(''); */

        console.log(feature.properties.elections);

        const tooltip = `
            <div class="title">${feature.properties.nom} > ${feature.properties.elections[2].election}</div>
            <div class="card-container">
            <div class="tour">Tour unique</div>
                <div class="election-card">
                    <div class="value-key-container">
                        <div class="value">${feature.properties.elections[2].exprimes.toLocaleString()}</div>
                        <div class="key">Voix exprimés</div>
                    </div>
                    <div>
                        <div class="value">${feature.properties.elections[2].votants.toLocaleString()}</div>
                        <div class="key">votants</div>
                    </div>
                    <div class="value-key-container">
                        <div class="value">${feature.properties.elections[2].inscrits.toLocaleString()}</div>
                        <div class="key">inscrits</div>
                    </div>
                </div>
            </div>
        `;
        layer.bindPopup(tooltip);
    },

    departementales2015(feature, layer) {
        /* const premierTour = feature.properties.elections[0].resultats.map(
            (el) => `${el.nuance.replace('BC-', '')}: ${el.voix.toLocaleString()} voix<br />`,
        ).join('');
        const secondTour = feature.properties.elections[1].resultats.map(
            (el) => `${el.nuance}:${el.voix.toLocaleString()} voix<br />`,
        ).join(''); */

        const tooltip = `
            <div class="title">
                ${feature.properties.nom} > ${feature.properties.elections[0].election}
            </div>
            <div class="card-container container1">
                <div class="tour">1er tour:</div>
                <div class="election-card">
                    <div class="value-key-container">
                        <div class="value">${feature.properties.elections[0].exprimes.toLocaleString()}</div>
                        <div class="key">Voix exprimés</div>
                    </div>
                    <div>
                        <div class="value">${feature.properties.elections[0].votants.toLocaleString()}</div>
                        <div class="key">votants</div>
                    </div>
                    <div class="value-key-container">
                        <div class="value">${feature.properties.elections[0].inscrits.toLocaleString()}</div>
                        <div class="key">inscrits</div>
                    </div>
                </div>
            </div>
            <div class="card-container">
                <div class="tour tour2">2e tour:</div>
                <div class="election-card">
                    <div class="value-key-container">
                        <div class="value">${feature.properties.elections[1].exprimes.toLocaleString()}</div>
                        <div class="key">Voix exprimés</div>
                    </div>
                    <div>
                        <div class="value">${feature.properties.elections[1].votants.toLocaleString()}</div>
                        <div class="key">votants</div>
                    </div>
                    <div class="value-key-container">
                        <div class="value">${feature.properties.elections[1].inscrits.toLocaleString()}</div>
                        <div class="key">inscrits</div>
                    </div>
                </div>
            </div>
        `;
        layer.bindPopup(tooltip);
    },
};
export default listOfElections;
