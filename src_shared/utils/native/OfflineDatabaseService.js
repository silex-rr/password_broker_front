import AsyncStorage from '@react-native-async-storage/async-storage';
import {AES, enc, MD5} from 'crypto-js';

export class OfflineDatabaseService {
    static OFFLINE_DATABASE_STORAGE_PREFIX = 'OFFLINE_DATABASE_';
    static OFFLINE_DATABASE_KEY_STORAGE_PREFIX = 'OFFLINE_DATABASE_KEY_';
    static OFFLINE_DATABASE_SALT_STORAGE_PREFIX = 'OFFLINE_AES_SALT_';
    static STATUS_LOADED = 'loaded';
    static STATUS_LOADING = 'loading';
    static STATUS_DOES_NOT_EXISTS = 'does not exists';
    static STATUS_AWAIT = 'await';
    static STATUS_DECRYPTION_FAILED_WRONG_PIN = 'decryption failed wrong pin';
    static STATUS_CORRUPTED = 'corrupted';

    //DB
    databaseStatus = '';
    loadedDatabaseName = '';
    databaseTimestamp = 0;
    database = {};
    //Key
    keyStatus = '';
    loadedKeyName = '';
    keyTimestamp = 0;
    key = '';
    //Salt
    saltStatus = '';
    loadedSaltName = '';
    saltTimestamp = 0;
    salt = '';
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
    async loadDataBaseByToken(appToken, force = false) {
        const databaseName = this.getDatabaseNameByAppToken(appToken);
        await this.loadDatabase(databaseName, force);
    }

    /**
     * @param {AppToken} appToken
     * @param {boolean} force
     * @return {Promise<void>}
     */
    async loadKeyByToken(appToken, force = false) {
        const databaseKeyName = this.getDatabaseKeyNameByAppToken(appToken);
        await this.loadDatabaseKey(databaseKeyName, force);
    }

    /**
     * @param {AppToken} appToken
     * @param {boolean} force
     * @return {Promise<void>}
     */
    async loadSaltByToken(appToken, force = false) {
        const saltName = this.getDatabaseSaltNameByAppToken(appToken);
        await this.loadDatabaseSalt(saltName, force);
    }

    /**
     * @param {AppToken} appToken
     * @param {boolean} force
     * @return {Promise<void>}
     */
    async loadDataBaseWithKeyAndSaltByToken(appToken, force = false) {
        const databaseName = this.getDatabaseNameByAppToken(appToken);
        const databaseKeyName = this.getDatabaseKeyNameByAppToken(appToken);
        const saltName = this.getDatabaseSaltNameByAppToken(appToken);
        console.log('loadDataBaseWithKeyAndSaltByToken', databaseName, databaseKeyName, saltName);
        try {
            await this.loadDatabase(databaseName, force);
            await this.loadDatabaseKey(databaseKeyName, force);
            await this.loadDatabaseSalt(saltName, force);
        } catch (e) {
            console.log('loadDataBaseWithKeyAndSaltByToken error', e);
        }
        console.log('loadDataBaseWithKeyAndSaltByToken', 'loaded');
        return new Promise((resolve, reject) => {
            if (
                this.databaseStatus === this.constructor.STATUS_LOADED &&
                this.keyStatus === this.constructor.STATUS_LOADED &&
                this.saltStatus === this.constructor.STATUS_LOADED
            ) {
                resolve();
                return;
            }
            reject(this.databaseStatus, this.keyStatus, this.saltStatus);
        });
    }
    /**
     * @param {string} saltName
     * @param {boolean} force
     * @return {Promise<void>}
     */
    async loadDatabaseSalt(saltName, force = false) {
        if (
            force === false &&
            (this.saltStatus === this.constructor.STATUS_LOADED ||
                this.saltStatus === this.constructor.STATUS_LOADING) &&
            this.loadedSaltName === saltName
        ) {
            return;
        }
        this.loadedSaltName = saltName;
        this.saltStatus = this.constructor.STATUS_LOADING;
        const salt = await AsyncStorage.getItem(saltName);
        if (this.loadedSaltName !== saltName) {
            //Another loading has been started
            return;
        }
        if (salt === null) {
            this.salt = '';
            this.saltStatus = this.constructor.STATUS_DOES_NOT_EXISTS;
            return;
        }
        let saltDecrypted = '';
        try {
            saltDecrypted = AES.decrypt(salt, this.pinCode).toString(enc.Utf8);
        } catch (e) {
            this.saltStatus = this.constructor.STATUS_DECRYPTION_FAILED_WRONG_PIN;
            return;
        }
        let saltObject = {};
        try {
            saltObject = JSON.parse(saltDecrypted);
        } catch (e) {
            this.saltStatus = this.constructor.STATUS_CORRUPTED;
            return;
        }
        this.salt = saltObject.data;
        this.saltTimestamp = saltObject.timestamp;
        this.saltStatus = this.constructor.STATUS_LOADED;
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
            this.loadedKeyName === keyName
        ) {
            return;
        }
        this.loadedKeyName = keyName;
        this.keyStatus = this.constructor.STATUS_LOADING;
        const key = await AsyncStorage.getItem(keyName);
        if (this.loadedKeyName !== keyName) {
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
        this.keyTimestamp = keyObject.timestamp;
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
        let database = '';
        try {
            database = await AsyncStorage.getItem(databaseName);
        } catch (error) {
            this.databaseStatus = this.constructor.STATUS_CORRUPTED;
            return;
        }
        if (this.loadedDatabaseName !== databaseName) {
            //Another loading is working
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
     * @param {AppToken} appToken
     * @return {string}
     */
    getDatabaseSaltNameByAppToken(appToken) {
        return this.constructor.OFFLINE_DATABASE_SALT_STORAGE_PREFIX + MD5(appToken.url + appToken.login);
    }

    /**
     * @return {{}}
     */
    getDataBase() {
        return this.database;
    }

    unloadDatabase() {
        this.databaseStatus = this.constructor.STATUS_AWAIT;
        this.database = {};
        this.loadedDatabaseName = '';
    }

    async reloadDatabase() {
        if (this.loadedDatabaseName === '') {
            return;
        }
        await this.loadDatabase(this.loadedDatabaseName, true);
    }

    getKey() {
        return this.key;
    }
    async reloadKey(force = false) {
        if (this.loadedKeyName === '') {
            return;
        }
        console.log('reloadKey', this.loadedKeyName);
        await this.loadDatabaseKey(this.loadedKeyName, force);
    }

    getSalt() {
        return this.salt;
    }
    async reloadSalt(force = false) {
        if (this.loadedSaltName === '') {
            return;
        }
        console.log('reloadSalt', this.loadedSaltName);
        await this.loadDatabaseSalt(this.loadedSaltName, force);
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
        // console.log('saveDatabase', databaseName, jsonString);
        const jsonStringEncrypted = AES.encrypt(jsonString, this.pinCode).toString();
        await AsyncStorage.setItem(databaseName, jsonStringEncrypted);
        this.unloadDatabase();
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
        // console.log('saveKey', keyName, jsonString);
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

    /**
     * @param {string}saltName
     * @param {string}salt
     * @param {number}timestamp
     * @return {Promise<void>}
     */
    async saveSalt(saltName, salt, timestamp) {
        const jsonString = JSON.stringify({
            data: salt,
            timestamp: timestamp,
        });
        // console.log('saveSalt', saltName, jsonString);
        const jsonStringEncrypted = AES.encrypt(jsonString, this.pinCode).toString();
        await AsyncStorage.setItem(saltName, jsonStringEncrypted);
    }

    /**
     *
     * @param {AppToken} appToken
     * @param {string}salt
     * @param {number}timestamp
     * @return {Promise<void>}
     */
    async saveSaltByToken(appToken, salt, timestamp) {
        const SaltName = this.getDatabaseSaltNameByAppToken(appToken);
        await this.saveSalt(SaltName, salt, timestamp);
    }
}
