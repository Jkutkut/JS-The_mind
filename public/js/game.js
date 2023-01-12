var updateLoop;
var user;

// Game
var containers;

window.addEventListener('load', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    user = urlParams.get('user');

    containers = {
        waitingLogin: document.getElementById('waitingLogin'),
        waitingInter: document.getElementById('waitingInter'),
        game: document.getElementById('game'),

        // Playing
        lastCard: document.getElementById('lastCard'),
        cards: document.getElementById('cards'),

        // Inter
        roundResult: document.getElementById('roundResult'),
    }

    // Components
    const btnSend = document.getElementById('btnSend');
    btnSend.addEventListener('click', async () => {
        await postAPI(`/sendCard?user=${user}`);
        updateGame();
    });
    const btnPanic = document.getElementById('btnPanic');
    btnPanic.addEventListener('click', async () => {
        await postAPI(`/panic?user=${user}`);
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
        btnPanic.disabled = status.panics == 0 || status.inPanic;
        waitingLogin.classList.add("hidden");
        waitingInter.classList.add("hidden");
        game.classList.remove("hidden");

        lastCard.innerHTML = (status.lastCard == -1)? "" : "<h1>" + status.lastCard + "</h1>";

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
        roundResult.innerHTML = status.result;
    },
    (status) => {
        waitingLogin.classList.add("hidden");
        waitingInter.classList.remove("hidden");
        game.classList.add("hidden");
        roundResult.innerHTML = status.result;
        clearInterval(updateLoop);
    }
]

async function updateGame() {
    let status = await (await makeRequestAPI(`/game/status?user=${user}`)).json();
    console.log(status);
    if (status.state == -1)
        return window.location.reload();
    updateFts[status.state](status);
}