async function ladeAbgeordnete() {
    const container = document.getElementById('container');
    container.innerHTML = 'Lade Daten…';

    try {
        // Abfrage aller MdB (erste 100, kann angepasst werden)
        const res = await fetch('https://www.abgeordnetenwatch.de/api/v2/politicians?parliament=bundestag&page_size=100');
        const data = await res.json();

        container.innerHTML = '';

        for (const p of data.data) {
            const id = p.id;
            const name = p.attributes.full_name;

            // Nebentätigkeiten abrufen
            const sjRes = await fetch(`https://www.abgeordnetenwatch.de/api/v2/sidejobs?politician=${id}`);
            const sjData = await sjRes.json();

            const div = document.createElement('div');
            div.className = 'abgeordneter';

            div.innerHTML = `<h3>${name}</h3>
                <strong>Nebentätigkeiten:</strong>
                <ul>
                    ${sjData.data.length === 0 ? '<li>Keine veröffentlicht</li>' : sjData.data.map(job => `<li>${job.attributes.title} – ${job.attributes.organization}</li>`).join('')}
                </ul>`;

            container.appendChild(div);
        }
    } catch (err) {
        container.innerHTML = 'Fehler beim Laden der Daten';
        console.error(err);
    }
}

// Aufruf beim Laden der Seite
ladeAbgeordnete();
