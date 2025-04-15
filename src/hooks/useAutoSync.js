import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const useAutoSync = () => {
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(async (state) => {
            if (state.isConnected) {
                // Fetch unsynced data from AsyncStorage
                const unsyncedData = await AsyncStorage.getItem('attendance');
                if (unsyncedData) {
                    const clockInData = JSON.parse(unsyncedData);
                    try {
                        await axios.post('https://67f6765442d6c71cca622823.mockapi.io/api/v1/users', clockInData);
                        await AsyncStorage.removeItem('attendance');
                    } catch (error) {
                        console.error('Sync failed', error);
                    }
                }
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);
};

export default useAutoSync;
