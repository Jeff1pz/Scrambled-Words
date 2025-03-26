
const leaderboardData = {
    players: []
};

document.addEventListener('DOMContentLoaded', () => {
    loadLeaderboardData();
});

function loadLeaderboardData() {
    const savedData = localStorage.getItem('wordScrambleLeaderboard');
    if (savedData) {
        leaderboardData.players = JSON.parse(savedData);
        displayLeaderboard();
    }
}

function displayLeaderboard() {
    const tableBody = document.querySelector('.leaderboard-table .table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    leaderboardData.players.forEach((player, index) => {
        const row = document.createElement('div');
        row.className = `table-row ${index < 3 ? 'top-player' : ''}`;
        
        row.innerHTML = `
            <div class="rank-col">
                <div class="rank-badge ${getRankClass(index + 1)}">${index + 1}</div>
            </div>
            <div class="player-col">
                <img src="https://api.dicebear.com/6.x/avataaars/svg?seed=${player.name}" alt="${player.name}" class="player-avatar">
                <div class="player-info">
                    <span class="player-name">${player.name}</span>
                    <span class="player-title">${getPlayerTitle(player.score)}</span>
                </div>
            </div>
            <div class="score-col">${player.score.toLocaleString()}</div>
            <div class="category-col">${player.category}</div>
            <div class="difficulty-col">${player.difficulty}</div>
            <div class="time-col">${formatTime(player.timeLeft)}</div>
        `;
        
        tableBody.appendChild(row);
    });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function getRankClass(rank) {
    switch(rank) {
        case 1: return 'gold';
        case 2: return 'silver';
        case 3: return 'bronze';
        default: return '';
    }
}

function getPlayerTitle(score) {
    if (score >= 9000) return "Grandmaster";
    if (score >= 8000) return "Expert";
    if (score >= 7000) return "Professional";
    if (score >= 6000) return "Advanced";
    return "Intermediate";
}

function updatePlayerScore(gameData) {
    const playerName = localStorage.getItem('playerName') || "Guest";
    const playerAvatar = "default-avatar.jpg";
    
    const newPlayer = {
        name: playerName,
        score: gameData.score,
        category: gameData.category,
        difficulty: gameData.difficulty,
        timeLeft: formatTime(gameData.timeLeft),
        avatar: playerAvatar,
        date: new Date().toISOString()
    };

    const existingPlayerIndex = leaderboardData.players.findIndex(p => p.name === playerName);
    if (existingPlayerIndex !== -1) {
        if (gameData.score > leaderboardData.players[existingPlayerIndex].score) {
            leaderboardData.players[existingPlayerIndex] = newPlayer;
        }
    } else {
        leaderboardData.players.push(newPlayer);
    }

    leaderboardData.players.sort((a, b) => b.score - a.score);
    
    // Keep only top 10 players
    leaderboardData.players = leaderboardData.players.slice(0, 10);
    
    localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData.players));
    
    displayLeaderboard();
}

window.leaderboard = {
    updatePlayerScore
};

function resetLeaderboard() {
    if (confirm("Are you sure you want to reset the leaderboard? This will clear all scores.")) {
        localStorage.removeItem('wordScrambleLeaderboard');
        leaderboardData.players = [];
        displayLeaderboard();
        
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <span class="notification-icon">✅</span>
            <span class="notification-message">Leaderboard has been reset!</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

window.resetLeaderboard = resetLeaderboard;
