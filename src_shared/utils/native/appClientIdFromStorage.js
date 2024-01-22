import {validate} from 'uuid';
import uuid from 'react-native-uuid';

export const appClientIdFromStorage = async storage => {
    const uuid_key = 'CLIENT_ID';
    let clientId = null;
    try {
        clientId = await storage.get(uuid_key);
    } catch (e) {
        throw new Error('Cant read CLIENT_ID' + JSON.stringify(e));
    }

    if (clientId && validate(clientId)) {
        return clientId;
    }

    clientId = uuid.v4();

    try {
        await storage.set(uuid_key, clientId);
    } catch (e) {
        throw new Error('Cant write CLIENT_ID' + JSON.stringify(e));
    }

    return clientId;
};
