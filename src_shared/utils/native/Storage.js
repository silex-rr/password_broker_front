import {ConnectionSQLite} from './storages/ConnectionSQLite';
import {ConnectionAsyncStorage} from './storages/ConnectionAsyncStorage';
import {ConnectionRNFS} from './storages/ConnectionRNFS';

export class Storage {
    static CONNECTION_ASYNC_STORAGE = 'async_storage';
    static CONNECTION_SQLITE = 'sqlite';
    static CONNECTION_RNFS = 'rnfs';

    connection_name = '';
    /**
     * @type {ConnectionSQLite|ConnectionAsyncStorage}
     */
    connection = null;

    constructor(connection_name) {
        switch (connection_name) {
            case Storage.CONNECTION_ASYNC_STORAGE:
                this.connection_name = Storage.CONNECTION_ASYNC_STORAGE;
                this.connection = new ConnectionAsyncStorage();
                break;
            case Storage.CONNECTION_SQLITE:
                this.connection_name = Storage.CONNECTION_SQLITE;
                this.connection = new ConnectionSQLite();
                break;
            case Storage.CONNECTION_RNFS:
                this.connection_name = Storage.CONNECTION_RNFS;
                this.connection = new ConnectionRNFS();
                break;
            default:
                throw new Error(
                    'Connection should be specified as Storage.CONNECTION_ASYNC_STORAGE or Storage.CONNECTION_SQLITE',
                );
        }
    }

    getConnectionName() {
        return this.connection_name;
    }
    async get(key) {
        return await this.connection.get(key);
    }

    async set(key, value) {
        return await this.connection.set(key, value);
    }
}
