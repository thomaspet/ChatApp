export async function get({ locals: {userid}, url: {origin} }) {
    
    const clientId = import.meta.env.VITE_CLIENTID;
    const returnUrl = `${origin}/auth/code`;

    const loginUrl = `https://login.unieconomy.no/connect/authorize?client_id=${clientId}&redirect_uri=${returnUrl}&response_type=code&scope=AppFramework+offline_access+openid+profile&state=${userid}`;


    return {
        headers: {location: loginUrl},
        status: 303
    }
}