var updateLoop;
var user;

async function makeRequestAPI(request) {
    return await fetch(
        request,
        {
            method: 'GET',
            // headers: {
            //     'Content-Type': 'application/json',
            // },
            // body: JSON.stringify(body)
        }
    );
}

window.addEventListener('load', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const startBtn = document.getElementById('startBtn');
    const startRoundBtn = document.getElementById('startRoundBtn');
    const endRoundBtn = document.getElementById('endRoundBtn');
    const endGameBtn = document.getElementById('endGameBtn');

    user = urlParams.get('user');

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

    updateLoop = setInterval(async () => {
        try {
            await updateGame();
        } catch (error) {
            console.error(error);
            alert(error);
            clearInterval(updateLoop);
        }
    }, 1500);
});

async function updateGame() {
    let status = await (await makeRequestAPI(`/game/status?user=${user}`)).json();

    console.log(status);
}