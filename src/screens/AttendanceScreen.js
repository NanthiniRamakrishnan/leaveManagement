import React, { useContext, useState } from 'react';
import { View, Text, Alert, PermissionsAndroid, TouchableOpacity, Platform, StyleSheet, StatusBar, FlatList } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Icon, Button, Divider } from '@rneui/base';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDistance } from 'geolib';
import Snackbar from 'react-native-snackbar';
import { UserContext } from '../components/common/UserContext';
import CommonHeader from '../components/common/CommonHeader';

const AttendancePage = () => {
    const currentDate = moment().format('dddd, MMM DD YYYY');
    const primary = "#339966"
    const [attendance, setAttendance] = useState({});
    const [clock, setClock] = useState({})
    const [address, setAddress] = useState('')
    const { userDetails } = useContext(UserContext)

    const isWithinOffice = (userCoords) => {
        const officeCoords = { latitude: 8.6935557, longitude: 77.7321738 };
        const distance = getDistance(userCoords, officeCoords);
        return distance <= 100;
    };

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'Location is needed to mark attendance',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };


    const getLocation = () => {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                position => resolve(position.coords),
                error => reject(error),
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }, 0
            );
            loadStoredAttendance()
        });
    };

    const handleAttendance = async (type, time) => {
        if (type == 'checkIn') {
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) {
                Alert.alert('Permission denied', 'Location permission is required to clock in.');
                return;
            }
            try {
                const coords = await getLocation();
                const allowed = isWithinOffice(coords);
                if (allowed) {
                    const response = await fetch('http://10.0.2.2:3000/clock-in', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "userId": userDetails?.user?.userId,
                            "time": moment().toISOString(),
                            "location": tempAddress
                        }),
                    });
                    if (response.ok) {
                        Snackbar.show({
                            text: 'Clocked in successfully',
                            duration: Snackbar?.LENGTH_LONG,
                        });
                    }
                    setClock(time)
                    const now = moment().format('HH : mm : ss ')
                    const updated = { ...attendance, [type]: now };
                    setAttendance(updated);
                    await AsyncStorage.setItem('attendance', JSON.stringify(updated));
                    await AsyncStorage.setItem('clock', JSON.stringify(time))
                } else {
                    Alert.alert('Out of Range', 'You are not in the office location ');
                }
            } catch (error) {
                console.log('Location error:', error);
                Alert.alert('Error', 'Could not fetch location');
            }
        }
        else {
            if (type == 'checkOut') {
                const response = await fetch('http://10.0.2.2:3000/clock-out', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "userId": userDetails?.user?.userId,
                        "time": moment().toISOString(),
                    }),
                });
                if (response.ok) {
                    Snackbar.show({
                        text: 'Clocked Out successfully',
                        duration: Snackbar?.LENGTH_LONG,
                    });
                }
            }
            setClock(time)
            const now = moment().format('HH : mm : ss ')
            const updated = { ...attendance, [type]: now };
            setAttendance(updated);
            await AsyncStorage.setItem('attendance', JSON.stringify(updated));
            await AsyncStorage.setItem('clock', JSON.stringify(time))
        }
    };

    const loadStoredAttendance = async () => {
        const stored = await AsyncStorage.getItem('attendance');
        const clockIn = await AsyncStorage.getItem('clock');
        if (stored) {
            setAttendance(JSON.parse(stored));
        }
        if (clockIn) {
            setClock(JSON.parse(clockIn))
        }
        setLoad(false)
    };

    const renderItem = ({ item, index }) => {
        return (
            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, backgroundColor: "#f2f2f2", borderRadius: 10, borderLeftWidth: 10, borderStartColor: primary, borderRadius: 10, padding: 15, }}>
                <Text style={{ color: "black", fontSize: 14, marginTop: 10 }}>{item?.date}</Text>
                <Divider style={{ borderWidth: 1, marginHorizontal: 10, borderColor: "#cccc", transform: [{ rotate: '180deg' }] }} />
                <View>
                    <Text style={{ color: "black", fontSize: 14 }}>Clock In</Text>
                    <Text style={{ color: primary, fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>{item?.clockIn}</Text>
                </View>
                <Divider style={{ borderWidth: 1, marginHorizontal: 10, borderColor: "#cccc", transform: [{ rotate: '180deg' }] }} />
                <View>
                    <Text style={{ color: "black", fontSize: 14 }}>Clock Out</Text>
                    <Text style={{ color: "red", fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>{item?.clockOut}</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor={primary} barStyle={"light-content"} />
            <CommonHeader title={"Attendance Management"} />
            <View style={{ flex: 1, }}>
                <View style={{ padding: 20, flex: 1, backgroundColor: "#fff" }}>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={{ color: "black", fontFamily: 'Roboto', fontSize: 18, marginBottom: 10 }}>Hello! <Text style={{ color: primary }}>{userDetails?.user?.name}</Text></Text>
                    </View>
                    <View style={{ backgroundColor: '#ffff', borderWidth: 1, borderColor: "#cccc", padding: 20, marginBottom: 10, borderRadius: 10 }}>
                        <Text style={{ color: "black", fontFamily: 'Roboto', fontSize: 15, marginBottom: 10 }}>{currentDate}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                            <TouchableOpacity disabled={clock?.In} onPress={() => { handleAttendance('checkIn', { Out: false, In: true, break: false }) }} style={{ backgroundColor: "#ffff", width: 150, marginRight: 5, borderWidth: 1, borderColor: "#cccc", justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }} >
                                <View style={{}}>
                                    <Text style={{ color: 'black', fontSize: 16, fontFamily: 'Roboto', textAlign: 'center' }}>{clock?.Out || Object.keys(clock).length == 0 ? '-' : attendance?.checkIn}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', opacity: clock?.In ? 0.5 : 1, alignItems: 'center', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 4, marginTop: 5, borderWidth: 1, borderColor: "#cccc", backgroundColor: primary }} >
                                    <Text style={{ color: '#ffff', fontSize: 16, fontFamily: 'Roboto', paddingRight: 5 }}>{'Clock In'}</Text>
                                    <Icon name={'arrow-right-bold-box-outline'} type='material-community' size={16} color={"#ffff"} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={clock?.Out || Object.keys(clock).length == 0} style={{ backgroundColor: "#ffff", borderWidth: 1, borderColor: "#cccc", justifyContent: 'center', alignItems: 'center', width: 150, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }} onPress={() => {
                                handleAttendance('checkOut', { Out: true, In: false, break: false })
                            }} >
                                <View>
                                    <Text style={{ color: clock?.Out ? 'red' : 'black', fontSize: 16, fontFamily: 'Roboto', textAlign: 'center' }}>{clock?.Out ? attendance?.checkOut : '-'}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', opacity: (clock?.Out || Object.keys(clock).length == 0) ? 0.5 : 1, alignItems: 'center', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 4, marginTop: 5, borderWidth: 1, borderColor: "#cccc", backgroundColor: primary }}>
                                    <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Roboto', paddingRight: 5 }}>{'Clock Out'}</Text>
                                    <Icon name={'arrow-left-bold-box-outline'} type='material-community' size={16} color={"#ffff"} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {clock.break && <Text style={{ marginBottom: 10 }}>{`Your break started at ${attendance?.startBreak ? attendance?.startBreak : null}`}</Text>}
                        <Button disabled={clock?.Out || Object.keys(clock).length == 0} title={clock.break ? "End Break" : "Start Break"} onPress={() => handleAttendance("startBreak", { Out: clock?.Out, In: clock?.In, break: !clock.break })} buttonStyle={{ backgroundColor: !clock.break ? primary : 'red', borderRadius: 8 }} icon={<View style={{ marginRight: 10 }}>
                            <Icon name='free-breakfast' type='material' size={18} color={"#ffffff"} />
                        </View>} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: "black", fontFamily: "Roboto", fontSize: 18, marginVertical: 10 }}>Attendance Data</Text>
                        <FlatList
                            data={userDetails?.userDetails}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={true}
                            style={{ flex: 1 }}
                        />
                    </View>
                </View>
            </View>

        </View >
    );
};

export default AttendancePage;
