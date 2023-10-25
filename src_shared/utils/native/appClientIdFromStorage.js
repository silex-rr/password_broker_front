import AsyncStorage from '@react-native-async-storage/async-storage';
import {v4 as UUIDv4, validate} from 'uuid';
export const appClientIdFromStorage = async () => {
    const uuid_key = 'CLIENT_ID';
    let uuid = null;
    try {
        uuid = await AsyncStorage.getItem(uuid_key);
    } catch (e) {}

    if (uuid && validate(uuid)) {
        return uuid;
    }

    uuid = UUIDv4();

    try {
        uuid = await AsyncStorage.setItem(uuid_key, uuid);
    } catch (e) {}

    return uuid;
};