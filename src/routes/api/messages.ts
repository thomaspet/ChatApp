import token from '$lib/token';

let ApiUrl = import.meta.env.VITE_API_URL;
const ApiToken = import.meta.env.VITE_API_TOKEN;

if (ApiUrl.endsWith('/')) {
    ApiUrl = ApiUrl.slice(0, -1);
}

export async function post({request, locals}) {
    const body = await request.text();
    const authToken = token.getToken(locals.userid);
    const resp = await fetch(`${ApiUrl}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'Authorization': 'Bearer ' + authToken,
            'X-Api-Token': ApiToken,
        },
        body: body
    });

    return {
        status: resp.status,
    }
}

export async function get({locals}) {
    const authToken = token.getToken(locals.userid);
    const resp = await fetch(`${ApiUrl}/messages`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + authToken,
            'X-Api-Token': ApiToken
        },
    });

    return {
        status: resp.status,
        body: await resp.json()
    }
}