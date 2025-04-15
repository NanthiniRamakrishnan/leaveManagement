import React, { useContext, useState } from 'react'
import { StatusBar, Dimensions, TouchableOpacity, View, KeyboardAvoidingView, ScrollView } from 'react-native'
import { Icon, Button, Image } from '@rneui/base'
import { useNavigation } from '@react-navigation/native'
import DropDownPicker from 'react-native-dropdown-picker'
import DatePicker from 'react-native-date-picker'
import { Input } from '@rneui/themed'
import moment from 'moment'
import Snackbar from 'react-native-snackbar';
import { UserContext } from './common/UserContext'
import CommonHeader from './common/CommonHeader'

const RequestLeave = () => {
    const orientation = Dimensions.get('window');
    let dropDown = [{ id: 1, value: "Personal", label: "Personal" }, { id: 2, value: "Casual", label: "Casual" }, { id: 3, value: "Sick", label: "Sick" }]
    const width = orientation.width;
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = useState({ start: "", end: "" })
    const [openDatePicker, setOpenDatePicker] = useState(false)
    const [toOpenPicker, setToOpenDatePicker] = useState(false)
    const [value, setValue] = useState('')
    const [reason, setReason] = useState('')
    const navigation = useNavigation()
    const primary = "#339966"
    const { userDetails } = useContext(UserContext)

    const submit = async () => {
        const response = await fetch('http://10.0.2.2:3000/leave-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "userId": userDetails?.user?.userId,
                "fromDate": date.start,
                "toDate": date.to,
                "reason": reason,
            }),
        });
        if (response.ok) {
            setDate({ start: "", end: "" })
            setValue('')
            setReason('')
            Snackbar.show({
                text: 'Your request has been submitted successfully',
                duration: Snackbar?.LENGTH_LONG,
                backgroundColor: primary,
            });
            navigation.navigate('TabBar', { screen: 'Leave' })
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "white" }}>
            <StatusBar backgroundColor={primary} />
            <CommonHeader title="Request Leave" />
            <ScrollView nestedScrollEnabled contentContainerStyle={{ alignItems: 'center', marginTop: 30 }}>
                <Image source={require('../assets/leave.png')} style={{ height: 150, width: 150 }} />
                <View style={{ margin: 20 }}>
                    <DropDownPicker
                        items={dropDown}
                        placeholder='Select your Leave type'
                        placeholderStyle={{ color: "#bfbfbf" }}
                        value={value}
                        flatListProps={{ scrollEnabled: false }}
                        open={open}
                        setOpen={setOpen}
                        onSelectItem={(val) => {
                            setValue(val.value)
                        }}
                        style={{ backgroundColor: '#ffff', borderColor: "#cccccc" }}
                        dropDownContainerStyle={{ borderColor: "#cccccc" }}
                        textStyle={{ fontSize: 15, color: "black" }}
                        selectedItemLabelStyle={{ color: primary }}
                        tickIconStyle={{ tintColor: primary }}
                        containerStyle={{}}
                    />
                </View>
                <Input
                    placeholder="From"
                    editable={false}
                    placeholderTextColor={"#bfbfbf"}
                    rightIcon={<TouchableOpacity onPress={() => { date.start ? setDate({ ...date, start: "" }) : setOpenDatePicker(!openDatePicker) }} >
                        <Icon name={date.start ? "close" : "date-range"} type="material-icons" size={20} color={"#4b4a4a"}
                        />
                    </TouchableOpacity>
                    }
                    rightIconContainerStyle={{ marginRight: 10 }}
                    value={date.start ? moment(date.start).format("MM/DD/YYYY") : ""}
                    inputStyle={{ fontSize: 14, color: "black" }}
                    inputContainerStyle={{ margin: 10, borderRadius: 10, borderColor: "#cccccc", borderWidth: 1, paddingHorizontal: 5 }}
                />
                <DatePicker
                    modal
                    title={"Start date"}
                    date={date.start || new Date()}
                    open={openDatePicker}
                    mode="date"
                    textColor={"black"}
                    onConfirm={(data) => {
                        setDate({ ...date, start: data })
                        setOpenDatePicker(false)
                    }}
                    onCancel={(date) => setOpenDatePicker(false)}
                />
                <Input
                    placeholder="To"
                    editable={false}
                    placeholderTextColor={"#bfbfbf"}
                    rightIcon={<TouchableOpacity onPress={() => { date.end ? setDate({ ...date, end: "" }) : setToOpenDatePicker(!toOpenPicker) }} >
                        <Icon name={date.end ? "close" : "date-range"} type="material-icons" size={20} color={"#4b4a4a"}
                        />
                    </TouchableOpacity>
                    }
                    rightIconContainerStyle={{ marginRight: 10 }}
                    value={date.end ? moment(date.end).format("MM/DD/YYYY") : ""}
                    inputStyle={{ fontSize: 14, color: "black" }}
                    inputContainerStyle={{ marginHorizontal: 10, borderRadius: 10, borderColor: "#cccccc", borderWidth: 1, paddingHorizontal: 5 }}
                />
                <DatePicker
                    modal
                    title={"End date"}
                    date={date.end || new Date()}
                    open={toOpenPicker}
                    minimumDate={date.start}
                    mode="date"
                    textColor={"black"}
                    onConfirm={(data) => {
                        setDate({ ...date, end: data })
                        setToOpenDatePicker(false)
                    }}
                    onCancel={(date) => setToOpenDatePicker(false)}
                />
                <Input
                    placeholder="Reason"
                    placeholderTextColor={"#bfbfbf"}
                    rightIconContainerStyle={{ marginRight: 10 }}
                    value={reason}
                    editable
                    inputStyle={{ fontSize: 14, color: "black" }}
                    onChangeText={(text) => setReason(text)}
                    inputContainerStyle={{ marginHorizontal: 10, height: 100, alignItems: 'flex-start', borderRadius: 10, borderColor: "#cccccc", borderWidth: 1, paddingHorizontal: 5 }}
                />
                <Button title="Submit" onPress={submit} buttonStyle={{ borderRadius: 5, width: 100, backgroundColor: primary }} containerStyle={{ alignSelf: 'center' }} />
            </ScrollView>
        </KeyboardAvoidingView >
    )
}

export default RequestLeave
