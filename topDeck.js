// Fetch top deck data and top support card, then render all info in a horizontal flex box
async function fetchAndRenderDeck() {
    try {
        // Fetch deck info
        const deckResp = await fetch('https://clash-royale-backend.onrender.com/top-player-decks?limit=1');
        if (!deckResp.ok) throw new Error('Network response was not ok');
        const deckData = await deckResp.json();
        const deckInfo = deckData.top_player_decks && deckData.top_player_decks[0];
        if (!deckInfo) return;

        // Fetch top support card info
        const supportResp = await fetch('https://clash-royale-backend.onrender.com/top-support-cards?limit=1');
        if (!supportResp.ok) throw new Error('Network response was not ok');
        const supportData = await supportResp.json();
        const supportInfo = supportData.top_support_cards && supportData.top_support_cards[0];
        let topCardHtml = '';
        if (supportInfo && supportInfo.support_cards && supportInfo.support_cards.length > 0) {
            const topCard = supportInfo.support_cards.reduce(
                (max, card) => card.supportCount > max.supportCount ? card : max,
                supportInfo.support_cards[0]
            );
            const iconUrl = topCard.iconUrls && topCard.iconUrls.medium ? topCard.iconUrls.medium : 'images/default-card.png';
            topCardHtml = `
                <div class="flex items-center justify-center">
                    <img src="${iconUrl}" alt="${topCard.name || 'Unknown'}" class="w-10 h-auto mr-2">
                </div>
            `;
        }

        // Calculate average elixir and 4-card cycle
        const elixirCosts = deckInfo.deck.map(card => card.elixirCost || 0);
        const avgElixir = (elixirCosts.reduce((a, b) => a + b, 0) / elixirCosts.length).toFixed(2);
        const cycleElixir = elixirCosts.sort((a, b) => a - b).slice(0, 4).reduce((a, b) => a + b, 0).toFixed(2);

        // Render deck cards
        const deckCardsDiv = document.getElementById('deck-cards');
        deckCardsDiv.innerHTML = '';
        deckInfo.deck.forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'p-2 flex flex-col items-center';
            cardDiv.innerHTML = `
                <img src="${card.iconUrls.medium}" alt="${card.name}" class="w-32 h-auto">
            `;
            deckCardsDiv.appendChild(cardDiv);
        });

        // Render all info in a single horizontal flex box
        const deckInfoDiv = document.getElementById('deck-info');
        deckInfoDiv.innerHTML = `
            <div class="flex flex-col md:flex-row items-start md:items-center justify-start w-full mt-6 gap-6">
                ${topCardHtml}
                <div class="flex flex-col md:flex-row items-center gap-6">
                    <div class="flex items-center justify-start text-sm font-clash">
                        <img src="images/elixir.png" alt="Elixir" class="w-8 h-8 mr-2">
                        Average Elixir: <span class="ml-1">${avgElixir}</span>
                    </div>
                    <div class="flex items-center justify-start text-sm font-clash">
                        <img src="images/cycle.png" alt="4-Card Cycle" class="w-8 h-8 mr-2">
                        4-Card Cycle: <span class="ml-1">${cycleElixir}</span>
                    </div>
                </div>
            </div>
        `;

        // Update the hyperlink to open the deck in the Clash Royale app
        const copyBtn = document.getElementById('copy-deck-link');
        if (deckInfo && deckInfo.deck) {
            const deckIds = deckInfo.deck.map(card => card.id).join(';');
            // You can set l and tt to any valid values, or use deckInfo data if available
            const deckLabel = deckInfo.name || 'Royals';
            const deckTag = deckInfo.tt || '159000004'; // fallback to a known working tag
            const deckLink = `https://link.clashroyale.com/en/?clashroyale://copyDeck?deck=${deckIds}&l=${encodeURIComponent(deckLabel)}&tt=${deckTag}`;
            copyBtn.setAttribute('href', deckLink);
            copyBtn.setAttribute('target', '_blank');
        }
    } catch (error) {
        console.error('Error fetching deck or support card:', error);
    }
}

// Call the function when the page loads
window.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderDeck();
});
