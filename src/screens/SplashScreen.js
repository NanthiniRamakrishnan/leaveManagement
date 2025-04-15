import { Text } from "@rneui/base"
import { ImageBackground, StatusBar, View } from "react-native"

const SplashScreen = () => {
    return (
        <View style={{ flex: 1, backgroundColor: '#C8E9D8' }}>
            <StatusBar backgroundColor={"transparent"} translucent={true} barStyle={'light-content'} />
            {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> */}
            <ImageBackground source={require('../assets/Splash.jpg')} style={{ height: '100%', width: '100%', alignItems: "center", justifyContent: "center" }} resizeMode="contain" blurRadius={1} >
                <Text style={{ fontSize: 25 }}>Welcome to</Text>
                <Text style={{ fontSize: 16 }}>Leave And Attendance Management</Text>
            </ImageBackground>
            {/* </View> */}
        </View >
    )
}

export default SplashScreen