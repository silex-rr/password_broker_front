import {v4 as UUIDv4, validate} from 'uuid';

export const appClientIdFromStorage = async storage => {
    const uuid_key = 'CLIENT_ID';
    let uuid = null;
    try {
        uuid = await storage.get(uuid_key);
    } catch (e) {}

    if (uuid && validate(uuid)) {
        return uuid;
    }

    uuid = UUIDv4();

    try {
        uuid = await storage.set(uuid_key, uuid);
    } catch (e) {}

    return uuid;
};
