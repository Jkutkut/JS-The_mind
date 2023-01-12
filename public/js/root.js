let rootStatus;
let showCards = false;

window.addEventListener('load', () => {
    rootStatus = document.getElementById('rootStatus');
    const startBtn = document.getElementById('startBtn');
    const startRoundBtn = document.getElementById('startRoundBtn');
    const endRoundBtn = document.getElementById('endRoundBtn');
    const endGameBtn = document.getElementById('endGameBtn');

    const restartGameBtn = document.getElementById('restartGameBtn');
    const addLiveBtn = document.getElementById('addLiveBtn');
    const addPanicBtn = document.getElementById('addPanicBtn');

    const showCardsBtn = document.getElementById('showCardsBtn');

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

    showCardsBtn.addEventListener('click', () => showCards = !showCards);

    setInterval(updateRoot, 500);
});

async function updateRoot() {
    try {
        const status = await (await makeRequestAPI('/rootStatus')).json();
        if (!showCards) {
            status.players.forEach(player => {
                player.cards = "???";
            });
        }
        rootStatus.innerHTML = stringifyJSON(status);
    } catch (error) {
        console.error(error);
    }
}