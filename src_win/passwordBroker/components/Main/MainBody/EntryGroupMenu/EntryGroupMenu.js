import {View} from "react-native-windows";
import tw from "twrnc";
import EntryGroupMenuElement from "./EntryGroupMenuElement";
import {useState} from "react";

/**
 *
 * @param Array elements
 *                         id: ENTRY_GROUP_MENU_MAIN,
 *                         onPress: () => menuClickHandler(ENTRY_GROUP_MENU_MAIN),
 *                         selected: entryGroupMenu === ENTRY_GROUP_MENU_MAIN,
 *                         text: "Entries"
 * @returns {JSX.Element}
 * @constructor
 */
const EntryGroupMenu = ({elements}) => {

    const [hoveredElement, setHoveredElement] = useState('')

    let prevSelected = false

    for (let i = 0; i < elements.length; i++) {
        elements[i].hovered = hoveredElement === elements[i].id
        elements[i].leftAdjacentSelected = prevSelected
        elements[i].rightAdjacentSelected = false
        prevSelected = elements[i].selected
        if (elements[i].selected && i > 0) {
            elements[i - 1].rightAdjacentSelected = true
        }
    }

    const entryGroupMenuElements = []
    for (let i = 0; i < elements.length; i++) {
        entryGroupMenuElements.push(<EntryGroupMenuElement {...elements[i]} setHoveredElement={setHoveredElement}/>)
    }

    return (
        <View style={tw`flex flex-row text-slate-800 pr-5 items-end border-b border-slate-900 realtive`}>
            <View style={tw`absolute b-0 w-full bg-slate-900 h-4`}></View>
            <View style={tw`flex flex-row justify-around`}>
                {entryGroupMenuElements}
            </View>
        </View>
    )
}

export default EntryGroupMenu