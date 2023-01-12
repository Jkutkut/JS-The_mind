window.addEventListener('load', () => {
    const startBtn = document.getElementById('startBtn');
    const startRoundBtn = document.getElementById('startRoundBtn');
    const endRoundBtn = document.getElementById('endRoundBtn');
    const endGameBtn = document.getElementById('endGameBtn');
    startBtn.addEventListener('click', () => {
        makeRequestAPI('/debug/start');
    });
    startRoundBtn.addEventListener('click', () => {
        makeRequestAPI('/debug/startRound');
    });
    endRoundBtn.addEventListener('click', () => {
        makeRequestAPI('/debug/endRound');
    });
    endGameBtn.addEventListener('click', () => {
        makeRequestAPI('/debug/endGame');
    });
});