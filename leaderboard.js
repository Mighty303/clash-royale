// Fetch and render top player leaderboard with clan icons
async function fetchAndRenderLeaderboard() {
    try {
        const response = await fetch('https://clash-royale-backend.onrender.com/top-players?limit=12');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const players = data.items || [];

        const tbody = document.querySelector('table tbody');
        tbody.innerHTML = ''; // Clear any hardcoded rows

        players.forEach((player, idx) => {
            // Alternate row color
            const bgColor = idx % 2 === 0 ? '#C0DDF6' : '#2185D0';

            tbody.innerHTML += `
                <tr style="background-color: ${bgColor};">
                    <td class="px-3 md:px-6 py-4">${idx + 1}</td>
                    <td class="px-3 md:px-6 py-4 flex items-center justify-center gap-2">
                        ${player.name}
                    </td>
                    <td class="px-3 md:px-6 py-4">${player.score}</td>
                    <td class="px-3 md:px-6 py-4 flex items-center justify-center gap-2">
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