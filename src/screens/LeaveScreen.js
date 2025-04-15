import { StyleSheet, Text, View, TouchableOpacity, StatusBar, FlatList } from 'react-native'
import { Icon } from '@rneui/base'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import CommonHeader from '../components/common/CommonHeader'

const LeaveScreen = () => {
    const navigation = useNavigation()
    const [leave, setLeave] = useState([])
    const primary = "#339966"
    const getAllLeaves = async () => {
        try {
            const response = await axios.get('http://10.0.2.2:3000/all-leave-requests', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setLeave(response.data)
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    }

    useEffect(() => {
        getAllLeaves()
    }, [])

    const renderItem = ({ item, index }) => {
        return (
            <View key={index} style={styles.renderContainer}>
                <View style={{ backgroundColor: item?.status == "Rejected" ? '#ffcccc' : item?.status == "Pending" ? '#ccccff' : '#e6ffe6', width: 75, alignItems: 'center', justifyContent: 'center', paddingVertical: 3, borderRadius: 5 }}>
                    <Text style={{ color: item?.status == "Rejected" ? "red" : item?.status == "Pending" ? "blue" : "green", fontSize: 12 }}>{item?.status}</Text>
                </View>
                <Text style={{ fontSize: 15, marginTop: 10 }}>{item?.leaveType}</Text>
                <Text style={{ fontSize: 12, color: "#a6a6a6" }}>Type</Text>
                <View style={{ flexDirection: 'row', justifyContent: "flex-start", marginTop: 10, alignItems: 'center' }}>
                    <View style={{ marginRight: 20 }}>
                        <Text style={{ fontSize: 15 }}>{item?.fromDate}</Text>
                        <Text style={{ fontSize: 12, color: "#a6a6a6" }}>Start Date</Text>
                    </View>
                    <View style={{ marginRight: 20 }}>
                        <Text style={{ fontSize: 15 }}>{item?.toDate}</Text>
                        <Text style={{ fontSize: 12, color: "#a6a6a6" }}>End Date</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 15 }}>{item?.duration} day{item?.duration > 1 ? 's' : ''}</Text>
                        <Text style={{ fontSize: 12, color: "#a6a6a6" }}>Duration</Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={primary} />
            <CommonHeader title="Leave Management" />
            <View style={{ flex: 1, margin: 20 }}>
                <FlatList
                    data={leave}
                    keyExtractor={(item) => item?.id?.toString()}
                    renderItem={renderItem}
                />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('RequestLeave')} style={styles.plusIcon}>
                <Icon name='plus' type='octicon' color={"#ffff"} size={30} />
            </TouchableOpacity>
        </View>
    )
}

export default LeaveScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    subContainer: {
        backgroundColor: "#339966",
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 0.05
    },
    header: {
        color: "#ffff", fontSize: 18, fontWeight: 'bold'
    },
    plusIcon: {
        position: 'absolute', bottom: 20, right: 20, backgroundColor: "#339966", padding: 10, paddingHorizontal: 15, borderRadius: 50, opacity: 0.9, alignSelf: 'flex-end'
    },
    renderContainer: {
        borderRadius: 10, padding: 10, borderColor: "#cccc", borderWidth: 1, marginBottom: 15
    }
})