var updateLoop;
var user;

// Game
var containers, btnSend;

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
    user = urlParams.get('user');

    containers = {
        waitingLogin: document.getElementById('waitingLogin'),
        waitingInter: document.getElementById('waitingInter'),
        game: document.getElementById('game'),

        cards: document.getElementById('cards')
    }
    btnSend = document.getElementById('btnSend');
    btnSend.addEventListener('click', async () => {
        await fetch('/sendCard', {method: "GET"});
        updateGame();
    });

    updateLoop = setInterval(async () => {
        try {
            await updateGame();
        } catch (error) {
            console.error(error);
            alert(error);
            clearInterval(updateLoop);
        }
    }, 1500); updateGame();

    // ! DEBUG
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

// const STATES = {
//     LOGIN: 0,
//     PLAYING: 1,
//     INTER: 2,
//     END: 3
// }

const updateFts = [
    (status) => { // LOGIN
        waitingLogin.classList.remove("hidden");
        waitingInter.classList.add("hidden");
        game.classList.add("hidden");
    },
    (status) => { // playing
        waitingLogin.classList.add("hidden");
        waitingInter.classList.add("hidden");
        game.classList.remove("hidden");

        while (containers.cards.firstChild)
            containers.cards.removeChild(containers.cards.firstChild);

        let p;
        for (let i = 0; i < status.cards.length; i++) {
            p = document.createElement('p');
            p.innerHTML = status.cards[i];
            containers.cards.appendChild(p);
        }
    },
    (status) => { // Inter
        waitingLogin.classList.add("hidden");
        waitingInter.classList.remove("hidden");
        game.classList.add("hidden");
    },
    (status) => {} // Implemented by server
]

async function updateGame() {
    let status = await (await makeRequestAPI(`/game/status?user=${user}`)).json();
    console.log(status);
    updateFts[status.state](status);
}