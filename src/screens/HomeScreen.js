import { StatusBar, Text, View, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Icon } from '@rneui/base'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../components/common/UserContext';
import CommonHeader from '../components/common/CommonHeader';

const HomeScreen = () => {
    const navigation = useNavigation()
    const [userData, setUserData] = useState('')
    const { userDetails } = useContext(UserContext)
    const primary = "#339966"
    const tempArray = [{ id: 1, name: "Attendance", navigate: "Attendance", icon: "event-available" }, { id: 2, name: "QR check-In", navigate: "QrCheckIn", icon: "qr-code" }, { id: 3, name: "Leave", navigate: "Leave", icon: "event-busy" }]

    useEffect(() => {
        getUserData()
    }, [])

    const getUserData = async () => {
        let user = await AsyncStorage.getItem('userSession')
        setUserData(JSON.parse(user))
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: primary, }}>
            <StatusBar backgroundColor={primary} barStyle={"light-content"} />
            <CommonHeader title="Home" />
            <View style={{ backgroundColor: '#ffff', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: "black", fontSize: 20, marginVertical: 20 }}> Welcome, <Text style={{ color: primary }}>{userData?.name}</Text></Text>
                <View style={{ flexDirection: 'row', width: "90%", flexWrap: "wrap", justifyContent: "space-between" }}>
                    {tempArray.map((item, index) => (
                        <TouchableOpacity onPress={() => item?.id == 2 ? navigation.navigate(item.navigate) : navigation.navigate("TabBar", { screen: item?.navigate })} key={index} style={{ borderRadius: 30, padding: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginVertical: 10, borderColor: "#cccccccc", width: "45%", height: '40%' }}>
                            <Icon type='material' name={item?.icon} size={50} color={primary} />
                            <Text style={{ color: 'black', size: 20, marginTop: 10 }}>{item?.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </SafeAreaView >
    )
}

export default HomeScreen

