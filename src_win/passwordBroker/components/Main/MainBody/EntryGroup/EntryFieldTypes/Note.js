import {View} from "react-native-windows";
import {Textarea} from "react-daisyui";
import tw from "twrnc";

const Note = ({value}) => {
    return (
        <View style={tw`col-span-3 px-2 basis-1/2`}>
            <Textarea style={tw`whitespace-pre-line`}>{value}</Textarea>
        </View>
    )
}

export default Note