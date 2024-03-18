import React from 'react';
import SystemContext from './SystemContext';
import axios from 'axios';
import { useContext } from 'react';
import IdentityContext from '../../identity/contexts/IdentityContext';
import { resolve } from 'uri-js';

const SystemContextProvider = props => {
    const { hostURL } = useContext(IdentityContext);
    const baseUrl = hostURL + '/system/api';
    /**
     * Retrieves the system backup settings.
     *
     * @returns {Promise} A promise that resolves with the backup settings or rejects with an error.
     *
     * @throws {Error} If the request to retrieve the backup settings fails.
     */
    const getSystemBackupSettings = () => {
        return new Promise((resolve, reject) => {
            axios.get(baseUrl + '/setting/backupSetting/backup').then(
                response => {
                    response.data.schedule = response.data.schedule.map(x => (x < 10 ? '0' : '') + x + ':00');
                    resolve(response.data);
                },
                error => {
                    reject(error);
                },
            );
        });
    };
    /**
     * Sets the system backup settings.
     *
     * @param {string[]} schedule - The schedule for the backup.
     * @param {boolean} enable - Whether to enable the backup.
     * @param {boolean} email_enable - Whether to enable backup email notifications.
     * @param {string} email - The email address to send the backup notifications to.
     * @param {string} archive_password - The password for the backup archive.
     * @returns {Promise}
     */
    const setSystemBackupSettings = ({ schedule, enable, email_enable, email, archive_password }) => {
        return new Promise((resolve, reject) => {
            const data = {
                schedule: [],
                enable: enable,
                email_enable: email_enable,
                email: email,
                archive_password: archive_password,
            };
            for (let i = 0; i < schedule.length; i++) {
                let time = schedule[i];
                if (time.includes(':')) {
                    time = time.split(':')[0];
                }
                data.schedule.push(time);
            }
            axios.post(baseUrl + '/setting/backupSetting/backup', data).then(
                response => {
                    resolve(response.data);
                },
                error => {
                    reject(error);
                },
            );
        });
    };

    const getBackups = (page = 1, perPage = 20) => {
        // const reqString = searchRequestString(searchQuery, page, perPage);

        const url = baseUrl + `/backups`;

        return new Promise((resolve, reject) => {
            axios.get(url).then(response => {
                resolve(response.data);
            }, reject);
        });
    };

    const createBackup = () => {
        const url = baseUrl + '/backups'
        return new Promise((resolve, reject) => {
            axios.post(url).then(response => {
                resolve();
            }, reject)
        })
    }

    return (
        <SystemContext.Provider
            value={{
                getSystemBackupSettings,
                setSystemBackupSettings,
                getBackups,
                createBackup,
            }}>
            {props.children}
        </SystemContext.Provider>
    );
};

export default SystemContextProvider;
