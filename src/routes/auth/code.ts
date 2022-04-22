import tokens from "$lib/token";


export async function get({ url: {searchParams} }) {
    const token = await getToken(searchParams.get('code'));
    const userid = searchParams.get('state');

    if (!token.access_token) {
        return {
            status: 401,
            body: 'Invalid code'
        };
    }

    tokens.setToken(userid, token);

    return {
        headers: {location: '/'},
        status: 303
    }
}

async function getToken(code) {
    const resp = await fetch('https://login.unieconomy.no/connect/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=authorization_code&code=${code}&client_id=${import.meta.env.VITE_CLIENTID}&redirect_uri=${import.meta.env.VITE_CODE_REDIRECT}&client_secret=${import.meta.env.VITE_CLIENTSECRET}`
    });

    return await resp.json();
}