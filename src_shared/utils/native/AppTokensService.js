import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppToken} from './AppToken';

export class AppTokensService {
    static TOKENS_STORAGE_KEY = 'APPLICATION_TOKENS';
    loaded = false;

    /**
     * @type AppToken[]
     */
    tokens = [];
    constructor() {}
    async load(force = false) {
        if (this.loaded && force === false) {
            return;
        }
        // console.log(1)
        const tokens_json = await AsyncStorage.getItem(this.constructor.TOKENS_STORAGE_KEY);
        if (tokens_json === null) {
            this.tokens = [];
            this.loaded = true;
            return;
        }

        let tokens_raw = null;

        try {
            tokens_raw = JSON.parse(tokens_json);
        } catch (e) {
            this.tokens = [];
            this.loaded = true;
            return;
        }

        if (tokens_raw.constructor !== Array) {
            this.tokens = [];
            this.loaded = true;
            return;
        }

        // console.log(3, tokens_raw)
        const tokens = [];
        for (let i = 0; i < tokens_raw.length; i++) {
            if (!tokens_raw[i].login || !tokens_raw[i].url || !tokens_raw[i].token) {
                continue;
            }
            tokens.push(new AppToken(tokens_raw[i].login, tokens_raw[i].url, tokens_raw[i].token));
        }
        // console.log(4, tokens)
        this.tokens = tokens;
        this.loaded = true;
    }

    getTokens() {
        return this.tokens;
    }

    async setTokens(tokens) {
        if (typeof tokens !== 'object') {
            return;
        }
        await AsyncStorage.setItem(this.constructor.TOKENS_STORAGE_KEY, JSON.stringify(tokens));
        this.tokens = tokens;
    }

    async addToken(appToken) {
        if (appToken.constructor !== AppToken) {
            console.log("AppTokensService.addToken error: appToken isn't instance of class AppToken");
            return;
        }
        await this.load();
        let appTokens = this.getTokens();
        appTokens = appTokens.filter(token => token.login !== appToken.login && token.url !== appToken.url);
        appTokens.push(appToken);
        await this.setTokens(appTokens);
        // console.log('set', appTokens, appToken, appToken.url, appToken.login, appToken.token)
        await this.load(true);
    }

    async addTokenByParams(login, url, token) {
        await this.addToken(new AppToken(login, url, token));
    }

    /**
     * Remove tokens by matching their params
     * @param login if it is null then all tokens are going to match this removing filter
     * @param url if it is null then all tokens are going to match this removing filter
     * @returns {Promise<void>}
     */
    async removeTokenByParams(login = null, url = null) {
        await this.load();
        let tokens = this.getTokens();
        tokens = tokens.filter(
            token => !((login === null || token.login === login) && (url === null || token.url === url)),
        );
        await this.setTokens(tokens);
    }
}
