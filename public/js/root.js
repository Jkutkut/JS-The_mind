window.addEventListener('load', () => {
    const startBtn = document.getElementById('startBtn');
    const startRoundBtn = document.getElementById('startRoundBtn');
    const endRoundBtn = document.getElementById('endRoundBtn');
    const endGameBtn = document.getElementById('endGameBtn');

    const restartGameBtn = document.getElementById('restartGameBtn');
    const addLiveBtn = document.getElementById('addLiveBtn');
    const addPanicBtn = document.getElementById('addPanicBtn');

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

    restartGameBtn.addEventListener('click', () => {
        makeRequestAPI('/debug/restartGame');
    });
    addLiveBtn.addEventListener('click', () => {
        makeRequestAPI('/debug/extraLive');
    });
    addPanicBtn.addEventListener('click', () => {
        makeRequestAPI('/debug/extraPanic');
    });

});