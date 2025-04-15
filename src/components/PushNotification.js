import { getMessaging, requestPermission, getToken, onTokenRefresh } from '@react-native-firebase/messaging';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getApp } from '@react-native-firebase/app';
import { Icon } from '@rneui/base';
import PushNotification from 'react-native-push-notification';
import axios from 'axios';
import { FlatList } from 'react-native';
import CommonHeader from './common/CommonHeader';

const Notification = () => {
    const [notification, setNotification] = React.useState({});
    const [token, setToken] = useState('')
    const primary = "#339966"
    const messaging = getMessaging(getApp());

    const requestUserPermission = async () => {
        const authStatus = await requestPermission(messaging);
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
            console.log('Authorization status:', authStatus);
        } else {
            console.warn('Notification permissions not granted.');
        }
    }

    const getAllNotifications = async () => {
        const response = await axios.get('https://67f6765442d6c71cca622823.mockapi.io/api/v1/login');
        console.log('All Notifications:', response.data);
        setNotification(response.data);
    }

    const getFCMToken = async () => {
        try {
            const token = await getToken(messaging);
            setToken(token)
            console.log('FCM Token:', token);
        } catch (error) {
            console.error('Error fetching FCM token:', error);
        }
    };

    useEffect(() => {
        requestUserPermission();
        getFCMToken();
        const unsubscribe = onTokenRefresh(messaging, (token) => {
            console.log('Token refreshed:', token);
        });
        return unsubscribe;
    }, []);

    const sendMockNotification = async (status) => {
        try {
            const response = await fetch('http://10.0.2.2:3000/send-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'Leave Request Update',
                    body: `Your leave request has been ${status}.`,
                    token: token, // Replace with actual FCM token if available
                }),
            });
            if (response.ok) {
                const result = await response.json(); // If your mock API returns data
                console.log('API Response:', result);
                PushNotification.localNotification({
                    channelId: 'local-notify',
                    title: 'Leave Request Update',
                    message: `Your leave request has been ${status}.`,
                    playSound: true,
                    soundName: 'default',
                    importance: 'high',
                    vibrate: true,
                });
            } else {
                console.error('Failed to send mock notification:', response.status);
            }
        } catch (error) {
            console.error('Error sending mock notification:', error);
        }
    };

    useEffect(() => {
        PushNotification.configure({
            onNotification: function (notification) {
                console.log("onNotification", notification?.title);
            },
            senderID: "230605292963",
            popInitialNotification: true,
            requestPermissions: true,
        });
        PushNotification.createChannel(
            {
                channelId: 'local-notify',
                channelName: 'Local Notifications',
                playSound: true,
                soundName: 'default',
                vibrate: true,
            },
            (created) => console.log('push notify createChannel', created)
        );
        getAllNotifications()
    }, []);

    const renderItem = ({ item }) => {
        const initials = item.name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase();
        return (
            <View style={{ padding: 20, borderBottomWidth: 1, flex: 1, justifyContent: 'center', borderBottomColor: '#ccc' }}>
                <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'flex-start' }}>
                    <View style={styles.initialAvatar}>
                        <Text style={styles.initialText}>{initials}</Text>
                    </View>
                    <View style={{ paddingLeft: 10, flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                        <Text style={{}} >{item.content}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                        <TouchableOpacity onPress={() => sendMockNotification('accepted')}>
                            <Icon name='checkbox' type='ionicon' color={"#00cc00"} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => sendMockNotification('rejected')}>
                            <Icon name='squared-cross' type='entypo' color="#ff4d4d" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor={primary} />
            <CommonHeader title={"Notifications"} />
            <FlatList
                data={notification}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

export default Notification;

const styles = StyleSheet.create({
    initialAvatar: {
        width: 40,
        height: 40,
        borderRadius: 40,
        backgroundColor: '#ff6666',
        alignItems: 'center',
        justifyContent: 'center',
    },
    initialText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});