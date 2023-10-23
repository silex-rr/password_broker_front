import AsyncStorage from '@react-native-async-storage/async-storage';
import {AES, enc, MD5} from 'crypto-js';

export class OfflineDatabaseService {
    static OFFLINE_DATABASE_STORAGE_PREFIX = 'OFFLINE_DATABASE_';
    static OFFLINE_DATABASE_KEY_STORAGE_PREFIX = 'OFFLINE_DATABASE_KEY_';
    static STATUS_LOADED = 'loaded';
    static STATUS_LOADING = 'loading';
    static STATUS_DOES_NOT_EXISTS = 'does not exists';
    static STATUS_AWAIT = 'await';
    static STATUS_DECRYPTION_FAILED_WRONG_PIN = 'decryption failed wrong pin';
    static STATUS_CORRUPTED = 'corrupted';

    databaseStatus = '';
    loadedDatabaseName = '';
    databaseTimestamp = 0;
    keyTimestamp = 0;
    keyStatus = '';
    database = {};
    key = '';
    pinCode = '';
    constructor() {
        this.databaseStatus = this.constructor.STATUS_AWAIT;
        this.keyStatus = this.constructor.STATUS_AWAIT;
    }

    /**
     * @param {AppToken} appToken
     * @param {boolean} force
     * @return {Promise<void>}
     */
    async loadDataBaseWithKeyByToken(appToken, force = false) {
        const databaseName = this.getDatabaseNameByAppToken(appToken);
        const databaseKeyName = this.getDatabaseKeyNameByAppToken(appToken);
        await this.loadDatabase(databaseName, force);
        await this.loadDatabaseKey(databaseKeyName, force);

        return new Promise((resolve, reject) => {
            if (
                this.databaseStatus === this.constructor.STATUS_LOADED &&
                this.keyStatus === this.constructor.STATUS_LOADED
            ) {
                resolve();
                return;
            }
            reject(this.databaseStatus, this.keyStatus);
        });
    }
    /**
     * @param {string} keyName
     * @param {boolean} force
     * @return {Promise<void>}
     */
    async loadDatabaseKey(keyName, force = false) {
        if (
            force === false &&
            (this.keyStatus === this.constructor.STATUS_LOADED || this.keyStatus === this.constructor.STATUS_LOADING) &&
            this.keyStatus === keyName
        ) {
            return;
        }
        this.loadedDatabaseName = keyName;
        this.keyStatus = this.constructor.STATUS_LOADING;
        const key = await AsyncStorage.getItem(keyName);
        if (this.loadedDatabaseName !== keyName) {
            //Another loading has been started
            return;
        }
        if (key === null) {
            this.key = '';
            this.keyStatus = this.constructor.STATUS_DOES_NOT_EXISTS;
            return;
        }
        let keyDecrypted = '';
        try {
            keyDecrypted = AES.decrypt(key, this.pinCode).toString(enc.Utf8);
        } catch (e) {
            this.keyStatus = this.constructor.STATUS_DECRYPTION_FAILED_WRONG_PIN;
            return;
        }
        let keyObject = {};
        try {
            keyObject = JSON.parse(keyDecrypted);
        } catch (e) {
            this.keyStatus = this.constructor.STATUS_CORRUPTED;
            return;
        }
        this.key = keyObject.data;
        this.databaseTimestamp = keyObject.timestamp;
        this.keyStatus = this.constructor.STATUS_LOADED;
    }

    /**
     * @param {string} databaseName
     * @param {boolean} force
     * @return {Promise<void>}
     */
    async loadDatabase(databaseName, force = false) {
        if (
            force === false &&
            (this.databaseStatus === this.constructor.STATUS_LOADED ||
                this.databaseStatus === this.constructor.STATUS_LOADING) &&
            this.loadedDatabaseName === databaseName
        ) {
            return;
        }
        this.loadedDatabaseName = databaseName;
        this.databaseStatus = this.constructor.STATUS_LOADING;
        const database = await AsyncStorage.getItem(databaseName);
        if (this.loadedDatabaseName !== databaseName) {
            //Another loading has been started
            return;
        }
        if (database === null) {
            this.database = {};
            this.databaseStatus = this.constructor.STATUS_DOES_NOT_EXISTS;
            return;
        }
        let databaseDecrypted = '';
        try {
            databaseDecrypted = AES.decrypt(database, this.pinCode).toString(enc.Utf8);
        } catch (e) {
            this.databaseStatus = this.constructor.STATUS_DECRYPTION_FAILED_WRONG_PIN;
            return;
        }
        let databaseObject = {};
        try {
            databaseObject = JSON.parse(databaseDecrypted);
        } catch (e) {
            this.databaseStatus = this.constructor.STATUS_CORRUPTED;
            return;
        }
        this.database = databaseObject.data;
        this.databaseTimestamp = databaseObject.timestamp;
        this.databaseStatus = this.constructor.STATUS_LOADED;
    }

    /**
     * @param {AppToken} appToken
     * @return {string}
     */
    getDatabaseNameByAppToken(appToken) {
        return this.constructor.OFFLINE_DATABASE_STORAGE_PREFIX + MD5(appToken.url + appToken.login);
    }
    /**
     * @param {AppToken} appToken
     * @return {string}
     */
    getDatabaseKeyNameByAppToken(appToken) {
        return this.constructor.OFFLINE_DATABASE_KEY_STORAGE_PREFIX + MD5(appToken.url + appToken.login);
    }

    /**
     * @return {{}}
     */
    getDataBase() {
        return this.database;
    }

    /**
     * @param {string} databaseName
     * @param {Object} database
     * @param {number}timestamp
     * @return {Promise<void>}
     */
    async saveDatabase(databaseName, database, timestamp) {
        const jsonString = JSON.stringify({
            data: database,
            timestamp: timestamp,
        });
        const jsonStringEncrypted = AES.encrypt(jsonString, this.pinCode).toString();
        await AsyncStorage.setItem(databaseName, jsonStringEncrypted);
    }

    /**
     *
     * @param {AppToken} appToken
     * @param {Object} database
     * @param {number}timestamp
     * @return {Promise<void>}
     */
    async saveDatabaseByToken(appToken, database, timestamp) {
        const databaseName = this.getDatabaseNameByAppToken(appToken);
        await this.saveDatabase(databaseName, database, timestamp);
    }

    /**
     * @param {string}keyName
     * @param {string}key
     * @param {number}timestamp
     * @return {Promise<void>}
     */
    async saveKey(keyName, key, timestamp) {
        const jsonString = JSON.stringify({
            data: key,
            timestamp: timestamp,
        });
        const jsonStringEncrypted = AES.encrypt(jsonString, this.pinCode).toString();
        await AsyncStorage.setItem(keyName, jsonStringEncrypted);
    }

    /**
     *
     * @param {AppToken} appToken
     * @param {string}key
     * @param {number}timestamp
     * @return {Promise<void>}
     */
    async saveKeyByToken(appToken, key, timestamp) {
        const KeyName = this.getDatabaseKeyNameByAppToken(appToken);
        await this.saveKey(KeyName, key, timestamp);
    }
}
