// Fetch and render top 10 players from your FastAPI server
async function fetchAndRenderLeaderboard() {
    try {
        const response = await fetch('http://localhost:8000/top-players?limit=10');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const players = data.items || [];

        const tbody = document.querySelector('table tbody');
        tbody.innerHTML = ''; // Remove hardcoded rows

        players.forEach((player, idx) => {
            // Build clan icon URL using badgeId if present
            let clanIcon = 'images/default-clan.png';
            if (player.clan && player.clan.badgeId) {
                clanIcon = `https://api-assets.clashroyale.com/badges/160/${player.clan.badgeId}.png`;
            }

            // Alternate row color
            const bgColor = idx % 2 === 0 ? '#C0DDF6' : '#2185D0';

            tbody.innerHTML += `
                <tr style="background-color: ${bgColor};">
                    <td class="px-3 md:px-6 py-4 text-center">${player.rank}</td>
                    <td class="px-3 md:px-6 py-4">${player.name}</td>
                    <td class="px-3 md:px-6 py-4 text-center">${player.score}</td>
                    <td class="px-3 md:px-6 py-4 flex items-center justify-center gap-2">
                        <img src="${clanIcon}" alt="${player.clan ? player.clan.name : ''}" class="h-6 w-6 mr-2">
                        ${player.clan ? player.clan.name : 'No Clan'}
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }
}

// Call the function when the page loads
window.addEventListener('DOMContentLoaded', fetchAndRenderLeaderboard);