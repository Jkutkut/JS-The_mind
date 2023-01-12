async function makeRequestAPI(request) {
    return await fetch(
        request,
        {
            method: 'GET'
        }
    );
}