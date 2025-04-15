import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';
import LeaveScreen from './src/screens/LeaveScreen'
import TabBar from './src/stacks/TabBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCheckInScreen from './src/screens/QRCheckInScreen';
import RequestLeave from './src/components/RequestLeave';
import Notification from './src/components/PushNotification';
import useAutoSync from './src/hooks/useAutoSync';
import { UserContext } from './src/components/common/UserContext';
import axios from 'axios';
import SplashScreen from './src/screens/SplashScreen';

LogBox.ignoreAllLogs();
export default function App() {
  const Stack = createNativeStackNavigator();
  const [isLoading, setIsLoading] = useState(true)
  const [userDetails, setUserDetails] = useState(null)

  const [authToken, setAuthToken] = useState(true)
  const checkLogin = async () => {
    let tempAuthToken = await AsyncStorage.getItem('userSession')
    setAuthToken(tempAuthToken)
    try {
      const response = await axios.get('https://67f6765442d6c71cca622823.mockapi.io/api/v1/users');
      const user = response.data;
      setUserDetails(user[0])
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  }
  // Custom hook to sync data when the app is online
  useAutoSync()
  useEffect(() => {
    checkLogin()
  }, []);
  return (
    <UserContext.Provider value={{ userDetails: userDetails, setUserDetails: setUserDetails }}>
      <NavigationContainer>
        {isLoading ? (
          <SplashScreen />
        ) : (
          <Stack.Navigator
            initialRouteName={authToken ? 'TabBar' : 'Login'}
            screenOptions={{ headerShown: false, animationEnabled: false }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="TabBar" component={TabBar} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Attendance" component={AttendanceScreen} />
            <Stack.Screen name="Leave" component={LeaveScreen} />
            <Stack.Screen name='QrCheckIn' component={QRCheckInScreen} />
            <Stack.Screen name='RequestLeave' component={RequestLeave} />
            <Stack.Screen name='PushNotification' component={Notification} />
          </Stack.Navigator>

        )}
        {/* <Stack.Navigator initialRouteName={!isLoading ? authToken ? "TabBar" : "Login" : "SplashScreen"} screenOptions={
          {
            headerShown: false, animationEnabled: false
          }
        }>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="TabBar" component={TabBar} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Attendance" component={AttendanceScreen} />
          <Stack.Screen name="Leave" component={LeaveScreen} />
          <Stack.Screen name='QrCheckIn' component={QRCheckInScreen} />
          <Stack.Screen name='RequestLeave' component={RequestLeave} />
          <Stack.Screen name='PushNotification' component={Notification} />
        </Stack.Navigator> */}
      </NavigationContainer>
    </UserContext.Provider>
  );
}
