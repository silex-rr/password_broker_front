import * as RNFS from '@dr.pogodin/react-native-fs';

const Buffer = require('buffer/').Buffer;
export class ConnectionRNFS {
    static PREFIX = 'storage_RNFS_';

    createFilePath(name) {
        // console.log(
        //            [RNFS.MainBundlePath,
        //             RNFS.CachesDirectoryPath,
        //             RNFS.ExternalCachesDirectoryPath,
        //             RNFS.DocumentDirectoryPath,
        //             RNFS.DownloadDirectoryPath,
        //             RNFS.ExternalDirectoryPath,
        //             RNFS.ExternalStorageDirectoryPath,
        //             RNFS.TemporaryDirectoryPath,
        //             RNFS.LibraryDirectoryPath,
        //             RNFS.PicturesDirectoryPath, // For Windows
        //             RNFS.FileProtectionKeys,
        //             RNFS.RoamingDirectoryPath, // For Windows
        //                ],
        //     RNFS
        // );
        return RNFS.CachesDirectoryPath + '\\' + ConnectionRNFS.PREFIX + name;
    }
    async get(name) {
        try {
            const path = this.createFilePath(name);
            const exists = await RNFS.exists(path);
            console.log(`ConnectionRNFS: ${name} exists: `, exists);
            if (!exists) {
                console.log(`ConnectionRNFS: ${name} does not exists`);
                return null;
            }
            const content = await RNFS.readFile(path, 'base64');
            return Buffer.from(content, 'base64').toString('binary');
        } catch (error) {
            console.error('Error reading file: ' + name, error);
        }
    }

    async set(name, value) {
        try {
            const content = Buffer.from(value, 'binary').toString('base64');
            await RNFS.writeFile(this.createFilePath(name), content, 'base64');
            console.log('file created:', this.createFilePath(name));
        } catch (error) {
            console.error('Error writing file: ' + name, error);
        }
    }

    async del(name) {
        try {
            await RNFS.unlink(this.createFilePath(name));
        } catch (error) {
            console.error('Error deleting file: ' + name, error);
        }
    }
}
