import SQLite from 'react-native-sqlite-storage';
export class ConnectionSQLite {
    static DB_NAME = 'pb.sqlite';

    db = null;
    databaseInitiated = false;

    constructor() {
        SQLite.DEBUG(true);
        SQLite.enablePromise(true);
    }

    async connect() {
        this.db = await SQLite.openDatabase({name: ConnectionSQLite.DB_NAME, createFromLocation: 1});
    }

    async initDatabase() {
        return new Promise((resolve, reject) => {
            this.db.executeSql(
                'CREATE TABLE IF NOT EXISTS `settings` (\n' +
                    '`id`   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\n' +
                    '`name` VARCHAR(250) UNIQUE NOT NULL,\n' +
                    '`value` BLOB NOT NULL\n' +
                    ') ;',
                [],
                () => {
                    this.databaseInitiated = true;
                    typeof resolve === 'function' && resolve(null);
                },
                error => {
                    typeof reject === 'function' && reject(error);
                },
            );
        });
    }

    async get(name) {
        if (!this.databaseInitiated) {
            await this.connect();
            await this.initDatabase();
        }
        return new Promise((resolve, reject) => {
            this.db.executeSql(
                'SELECT `value` FROM `settings` WHERE `name` = ?;',
                [name],
                results => {
                    const len = results.rows.length;
                    if (len !== 1) {
                        typeof resolve === 'function' && resolve(null);
                        return;
                    }
                    typeof resolve === 'function' && resolve(results.rows.item(0).value);
                },
                error => {
                    typeof reject === 'function' && reject(error);
                },
            );
        });
    }

    async del(name) {
        return new Promise(async (resolve, reject) => {
            const nameExists = (await this.get(name)) !== null;
            if (nameExists) {
                this.db.executeSql(
                    'DELETE FROM `settings` WHERE `name` = ?;',
                    [name],
                    () => {
                        resolve(1);
                    },
                    error => {
                        typeof reject === 'function' && reject(error);
                    },
                );
                return;
            }
            resolve(0);
        });
    }
    async set(name, value) {
        if (!this.databaseInitiated) {
            await this.connect();
            await this.initDatabase();
        }
        return new Promise(async (resolve, reject) => {
            await this.del(name);
            this.db.executeSql(
                'INSERT INTO `settings` (`name`, `value`) VALUES (?, ?);',
                [name, value],
                results => {
                    const len = results.rows.length;
                    if (len === 1) {
                        typeof resolve === 'function' && resolve(null);
                        return;
                    }
                    typeof resolve === 'function' && resolve(results.insertId);
                },
                error => {
                    typeof reject === 'function' && reject(error);
                },
            );
        });
    }
}
