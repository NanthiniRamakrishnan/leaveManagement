import React, { useContext, useState } from 'react';
import { View, PermissionsAndroid, Platform, Alert, StatusBar } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import moment from 'moment';
import { UserContext } from '../components/common/UserContext';
import CommonHeader from '../components/common/CommonHeader';


const QRCheckInScreen = () => {
    const primary = "#339966"
    const [scanned, setScanned] = useState(false);
    const { userDetails } = useContext(UserContext)

    // Android camera permission (not needed on iOS)
    React.useEffect(() => {
        if (Platform.OS === 'android') {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera Permission',
                    message: 'App needs camera permission for QR code scanning',
                    buttonPositive: 'OK',
                }
            );
        }
    }, []);

    const onQRRead = async (event) => {
        if (!scanned) {
            setScanned(true);
            const qrData = event.nativeEvent.codeStringValue;
            const response = await fetch('http://10.0.2.2:3000/qr-scan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "userId": userDetails?.user?.userId,
                    "qrData": qrData,
                    "scannedAt": moment().toISOString(),
                }),
            });
            if (response.ok) {
                Alert.alert('Clock In Successful', `Scanned: ${qrData}`);
            }
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor={primary} barStyle={"light-content"} />
            <CommonHeader title="QR Check-In" />
            <Camera
                cameraType={CameraType.Back}
                style={{ flex: 1 }}
                scanBarcode={true}
                onReadCode={(event) => onQRRead(event)}
                showFrame={true}
                laserColor='red'
                frameColor='white'
            />
        </View>
    );
};

export default QRCheckInScreen
