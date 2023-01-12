window.addEventListener('load', () => {
    const btn = document.getElementById('btn');
    const input = document.getElementById('input');
    const invalidMsg = document.getElementById('invalidMsg');

    btn.addEventListener('click', async () => {
        const user = input.value.trim();
        if (user.length == 0) {
            invalidMsg.innerHTML = "Invalid username";
            return;
        }
        fetch(
            '/signup',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user: user})
            }
        ).then(async (res) => {
            const response = await res.json();
            if (response.error)
                invalidMsg.innerHTML = response.error;
            else
                window.location = `/game?user=${user}`;
        }).catch((error) => {
            console.log(error);
        });
    });
});