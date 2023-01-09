window.addEventListener('load', () => {
    const btn = document.getElementById('btn');
    const input = document.getElementById('input');

    btn.addEventListener('click', async () => {
        const user = input.value.trim();
        if (user.length == 0)
            return;
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
                console.error(response);
            else
                window.location = `/game?user=${user}`;
        }).catch((error) => {
            console.log(error);
        })
    });
});