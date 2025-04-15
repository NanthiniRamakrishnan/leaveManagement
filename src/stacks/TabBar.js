import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import LeaveScreen from '../screens/LeaveScreen';
import Notification from '../components/PushNotification';
import { TouchableOpacity } from 'react-native';

const App = () => {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Home':
                            iconName = 'home-outline';
                            break;
                        case 'Attendance':
                            iconName = 'calendar-outline';
                            break;
                        case 'Leave':
                            iconName = 'clipboard-outline';
                            break;
                        case 'Notification':
                            iconName = 'notifications-outline';
                            break;
                        default:
                            iconName = 'ellipse-outline';
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#339966",
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarButton: (props) => (
                    <TouchableOpacity {...props} activeOpacity={0.6} />
                ),
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Attendance" component={AttendanceScreen} />
            <Tab.Screen name="Leave" component={LeaveScreen} />
            <Tab.Screen name="Notification" component={Notification} />
        </Tab.Navigator>
    );
};

export default App;
