// Fetch and render the top 4 decks from your FastAPI server
async function fetchAndRenderTopDecks() {
    try {
        const response = await fetch('http://localhost:8000/top-player-decks?limit=4');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const decks = data.top_player_decks || [];

        const grid = document.querySelector('grid');
        grid.innerHTML = ''; // Clear existing decks

        decks.forEach((deckInfo, idx) => {
            // Calculate average elixir and 4-card cycle
            const elixirCosts = deckInfo.deck.map(card => card.elixirCost || 0);
            const avgElixir = (elixirCosts.reduce((a, b) => a + b, 0) / elixirCosts.length).toFixed(1);
            const cycleElixir = elixirCosts.sort((a, b) => a - b).slice(0, 4).reduce((a, b) => a + b, 0).toFixed(1);

            // Build deck card images
            const cardImgs = deckInfo.deck.map(card => {
                if (card.name === "Vines") {
                    return `<img src="images/vines.png" alt="${card.name}" class="pt-6 w-32 h-auto">`;
                } else {
                    return `<img src="${card.iconUrls.medium}" alt="${card.name}" class="w-32 h-auto">`;
                }
            }).join('');

            console.log(cardImgs);

            // Build deck link
            const deckIds = deckInfo.deck.map(card => card.id).join(';');
            const deckLabel = deckInfo.name || 'Royals';
            const deckTag = deckInfo.tt || '159000004';
            const deckLink = `https://link.clashroyale.com/en/?clashroyale://copyDeck?deck=${deckIds}&l=${encodeURIComponent(deckLabel)}&tt=${deckTag}`;

            // Render deck block
            grid.innerHTML += `
                <div class="border border-8 border-blue-300 p-8">
                    <h2 class="text-2xl font-clash font-bold text-start uppercase text-[#2185D0]">Deck ${idx + 1}</h2>
                    <div class="mt-4 grid grid-cols-4 gap-2">
                        ${cardImgs}
                    </div>
                    <div class="flex items-center justify-start mt-6 gap-5">
                        <span class="flex items-center gap-3">
                            <img src="images/elixir.png" alt="average-elixir" class="w-auto h-auto">
                            <p class="text-center text-xl">Average Elixir: ${avgElixir}</p>
                        </span>
                        <span class="flex items-center gap-3">
                            <img src="images/cycle.png" alt="cycle-elixir" class="w-auto h-auto">
                            <p class="text-center text-xl">4-card cycle: ${cycleElixir}</p>
                        </span>
                    </div>
                    <a href="${deckLink}"
                        class="inline-block mt-6 bg-yellow-400 hover:bg-yellow-500 font-clash font-bold py-3 px-6 rounded-md shadow text-white">
                        Copy Deck
                    </a>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error fetching top decks:', error);
    }
}

// Call the function when the page loads
window.addEventListener('DOMContentLoaded', fetchAndRenderTopDecks);