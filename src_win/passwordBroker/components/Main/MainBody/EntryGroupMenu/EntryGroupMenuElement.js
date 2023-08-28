import {Pressable, Text} from "react-native-windows";
import tw from "twrnc";

const EntryGroupMenuElement = ({
                                   id,
                                   onPress,
                                   text,
                                   selected = false,
                                   hovered = false,
                                   leftAdjacentSelected = false,
                                   rightAdjacentSelected = false,

                                   setHoveredElement: setHoveredElement
                               }) => {

    const unSelectedTab = ' bg-slate-200'
    const selectedTab = ' bg-slate-900'
    const leftAdjacent = ' rounded-bl-md'
    const rightAdjacent = ' rounded-br-md'
    const menuFontColor = 'text-slate-700'
    const menuFontColorSelected = 'text-slate-300'
    const menuTabStyle = 'px-3 py-1 rounded-t-md'

    const hoveredHolder = ' bg-slate-300'
    const hoveredText = ' text-slate-900'

    let holderStyle = menuTabStyle
    let textStyle = (hovered ? hoveredText : menuFontColor)

    if (selected) {
        holderStyle += selectedTab
        textStyle = menuFontColorSelected
    } else {
        holderStyle += (hovered ? hoveredHolder : unSelectedTab)

        if (leftAdjacentSelected) {
            holderStyle += leftAdjacent
        }
        if (rightAdjacentSelected) {
            holderStyle += rightAdjacent
        }
    }

    const hoverIn = () => {
        setHoveredElement(id)
    }
    const hoverOut = () => {
        setHoveredElement('')
    }

    return (
        <Pressable key={id}
                   onPress={onPress} style={tw`${holderStyle}`} onHoverIn={hoverIn} onHoverOut={hoverOut}>
            <Text style={tw`${textStyle}`}>{text}</Text>
        </Pressable>
    )
}

export default EntryGroupMenuElement