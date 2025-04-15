import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/base";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

const CommonHeader = (props) => {
    const primary = "#339966"
    const navigation = useNavigation()
    const orientation = Dimensions.get('window');
    const width = orientation.width;
    return (
        <View style={{ backgroundColor: primary, padding: 10, flexDirection: 'row', alignItems: 'center', flex: 0.05 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                <Icon type='ionicon' name='arrow-back' size={width > 600 ? 35 : 18} color={"#ffff"} />
            </TouchableOpacity>
            <Text style={{ color: "#ffff", fontSize: 18, fontWeight: 'bold' }}>{props.title}</Text>
        </View>
    )
}

export default CommonHeader;