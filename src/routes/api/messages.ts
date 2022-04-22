import token from '$lib/token';

export async function post({request, locals}) {
    const body = await request.text();
    const authToken = token.getToken(locals.userid);
    const resp = await fetch('http://localhost:8080/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'Authorization': 'Bearer ' + authToken,
            'X-Api-Token': import.meta.env.VITE_API_TOKEN
        },
        body: body
    });

    return {
        status: resp.status,
    }
}

export async function get({locals}) {
    const authToken = token.getToken(locals.userid);
    const resp = await fetch('http://localhost:8080/messages', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + authToken,
            'X-Api-Token': import.meta.env.VITE_API_TOKEN
        },
    });

    return {
        status: resp.status,
        body: await resp.json()
    }
}