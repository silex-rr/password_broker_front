import AsyncStorage from '@react-native-async-storage/async-storage';

export class ConnectionAsyncStorage {
    async get(name) {
        return await AsyncStorage.getItem(name);
    }

    async set(name, value) {
        await AsyncStorage.setItem(name, value);
    }

    async del(name) {
        await AsyncStorage.setItem(name, null);
    }
}
