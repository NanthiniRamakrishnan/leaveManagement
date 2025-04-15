import React, { useState } from 'react'
import { StyleSheet, Text, Platform, Alert, Dimensions, TouchableOpacity, StatusBar, KeyboardAvoidingView, View } from 'react-native';
import { Button, Icon, Image } from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Input } from "@rneui/themed";
import Snackbar from 'react-native-snackbar';

const LoginScreen = () => {
    const navigation = useNavigation();
    const primary = "#339966"
    const [orientation] = useState({
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    });
    const width = orientation.width;
    const [email, setEmail] = useState('');
    const [secure, setSecure] = useState({
        security: true,
        rightIcon: 'eye-off',
    });
    const [password, setPassword] = useState("");
    const [focus, setFocus] = useState({
        emailFocus: false,
        passwordFocus: false
    });

    const mockLogin = async () => {
        if (email === 'user@gmail.com' && password === 'password123') {
            const userData = { email, token: 'mock-token-12345', name: 'Nanthini' };
            await AsyncStorage.setItem('userSession', JSON.stringify(userData));
            Snackbar.show({
                text: 'Login Successful',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: primary
            })
            navigation.navigate('TabBar', { screen: 'Home' });
        } else {
            Alert.alert('Login Failed', 'Invalid credentials');
        }
    };

    const handlePasswordVisibility = () => {
        setSecure(prevState => ({
            rightIcon: prevState.rightIcon === 'eye' ? 'eye-off' : 'eye',
            security: !prevState.security,
        }));
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled={true}>
            <StatusBar backgroundColor={"#ffff"} barStyle={Platform.OS === 'android' ? 'dark-content' : 'light-content'} />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.title}>Leave Management</Text>
                <Image source={require('../assets/login.jpg')} style={{ height: 150, width: 150, marginBottom: 10 }} />
                <View style={{ padding: 10, height: 290, width: width - 20, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', borderWidth: 1, borderColor: "#a6a6a6", borderRadius: 10 }}>
                    <Input
                        placeholder="Email"
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onFocus={() => {
                            setFocus(prev => {
                                let value = { ...prev };
                                value['emailFocus'] = true;
                                return value;
                            });
                        }}
                        onEndEditing={() => {
                            setFocus(prev => {
                                let value = { ...prev };
                                value['emailFocus'] = false;
                                return value;
                            });
                        }}
                        placeholderTextColor={focus?.emailFocus ? primary : "#808080"}
                        inputStyle={{ fontSize: width > 600 ? 19 : 15 }}
                        inputContainerStyle={{ paddingLeft: 15, paddingVertical: 4, width: width > 600 ? '70%' : '100%', borderColor: focus?.emailFocus ? primary : "#000000aa" }}
                        leftIcon={<Icon name={"email"} type='material-community' size={20} color={focus?.emailFocus ? primary : "black"} />}
                    />
                    <Input
                        placeholder="Password"
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        value={password}
                        onFocus={() => {
                            setFocus(prev => {
                                let value = { ...prev };
                                value['passwordFocus'] = true;
                                return value;
                            });
                        }}
                        onEndEditing={() => {
                            setFocus(prev => {
                                let value = { ...prev };
                                value['passwordFocus'] = false;
                                return value;
                            });
                        }}
                        placeholderTextColor={focus?.passwordFocus ? primary : "#808080"}
                        inputStyle={{ fontSize: width > 600 ? 19 : 15 }}
                        inputContainerStyle={{ paddingLeft: 15, paddingVertical: 4, marginTop: 30, width: width > 600 ? '70%' : '100%', borderColor: focus?.passwordFocus ? primary : "#000000aa" }}
                        leftIcon={<Icon name={"lock"} type='material-community' size={20} color={focus?.passwordFocus ? primary : "black"} />}
                        rightIcon={<TouchableOpacity accessibilityLabel='eyeIcon' onPress={handlePasswordVisibility}><Icon name={secure.rightIcon} type='ionicon' size={20} color={focus?.passwordFocus ? primary : "black"} /></TouchableOpacity>}
                        secureTextEntry={
                            secure.security
                        }
                    />
                    <Button title="Login" onPress={mockLogin} buttonStyle={{ borderRadius: 5, width: 100, backgroundColor: primary }} containerStyle={{ alignSelf: 'center' }} />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    title: {
        fontSize: 25,
        marginBottom: 15,
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#eee',
        padding: 12,
        marginBottom: 15,
        // width: '100%',
        borderRadius: 10,
        borderColor: '#D3D3D3',
        borderWidth: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eee',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
});


