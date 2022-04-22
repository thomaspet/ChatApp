class TokenSessions {
    private cache: { [userid: string]: any };

    constructor() {
        this.cache = {};
    }
    
    getToken(userid) {
        // Get token from this.cache if expireDate is in the future
        const token = this.cache[userid];

        if (token && token.expireDate > new Date()) {
            return token.access_token;
        }

        return null;
    }
    setToken(userid, token) {
        token.expireDate = new Date(new Date().getTime() + token.expires_in * 1000);
        this.cache[userid] = token;
    }
}

export default new TokenSessions();