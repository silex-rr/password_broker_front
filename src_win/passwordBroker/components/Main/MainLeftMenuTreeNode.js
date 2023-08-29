// import {HiOutlineFolder, HiOutlineFolderAdd, HiOutlineFolderRemove} from "react-icons/hi";
import React, {useCallback, useContext, useState} from "react";
import {PasswordBrokerContext} from "../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext";
import {ROLE_ADMIN, ROLE_GUEST, ROLE_MEMBER, ROLE_MODERATOR} from "../../../../src_shared/passwordBroker/constants/EntryGroupRole";
// import {useDrag, useDrop} from "react-dnd";
import {Text, TouchableOpacity, View} from "react-native-windows";
import tw from "twrnc";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
// import {RiDraggable} from "react-icons/ri";
const MainLeftMenuTreeNode = (props) => {
    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const entryGroupIdCurrent = props.entry_group_id;
    const {
        pid,
        lvl,
        last,
        parentLast
    } = props;
    const {
        setEntryGroupId,
        entryGroupId,
        setEntryGroupStatus,
        entryGroupTreesOpened,
        setEntryGroupTreesOpened,
        selectEntryGroup,
        moveEntryGroup,
        moveEntryGroupMode
    } = passwordBrokerContext

    const [isOpened, setOpened] = useState(entryGroupTreesOpened.includes(entryGroupIdCurrent))
    const includes = entryGroupTreesOpened.includes(entryGroupIdCurrent);

    if (isOpened !== includes) {
        setOpened(includes)
    }

    const hasChildren = props.children.length > 0

    const children = []

    props.children.sort((a, b) => {return a.title === b.title ? 0 : a.title > b.title})

    const lvl_next = lvl + 1
    for (let i = 0; i < props.children.length; i++) {
        children.push(MainLeftMenuTreeNode({
            ...props.children[i],
            pid: entryGroupIdCurrent,
            lvl: lvl_next,
            last: i + 1 === props.children.length,
            parentLast: last
        }))
    }

    const handleOpening = () => {
        let entryGroupTreesOpenedNew = entryGroupTreesOpened;
        if (isOpened) {
            entryGroupTreesOpenedNew = entryGroupTreesOpened.filter(e => e !== entryGroupIdCurrent)
        } else {
            entryGroupTreesOpenedNew.push(entryGroupIdCurrent)
        }
        setEntryGroupTreesOpened(entryGroupTreesOpenedNew)
        setOpened(!isOpened)

    }

    const handleOpenEntryGroup = () => {
        selectEntryGroup(entryGroupIdCurrent)
    }

    let groupColor = '#e2e8f0'//'text-slate-200';
    let canDrag = false
    let canBeDropped = false
    switch (props.role){
        default:
        case ROLE_GUEST:
            groupColor = '#e2e8f0';
            break;
        case ROLE_ADMIN:
            groupColor = '#ca8a04'//'text-yellow-600';
            canDrag = true && moveEntryGroupMode
            canBeDropped = true && moveEntryGroupMode
            break;
        case ROLE_MODERATOR:
            groupColor = '#075985'//'text-sky-800';
            break;
        case ROLE_MEMBER:
            groupColor = '#166534'//'text-green-800';
            break;
    }


    //
    // const [{ isDragging, opacity }, drag] = useDrag(
    //     () => ({
    //         type: "group",
    //         canDrag: canDrag,
    //         item: {
    //             entryGroupId: entryGroupIdCurrent,
    //             title: props.title,
    //             materializedPath: props.materialized_path,
    //             pid: pid
    //         },
    //         // end: (item, monitor) => {
    //         //     const dropResult = monitor.getDropResult()
    //         //     if (item && dropResult) {
    //         //         alert(`You dropped ${item.name} into ${dropResult.name}!`)
    //         //     }
    //         // },
    //         collect: (monitor) => ({
    //             isDragging: monitor.isDragging(),
    //             opacity: monitor.isDragging() ? 0.4 : 1,
    //         }),
    //     }),
    //     [canDrag, entryGroupIdCurrent],
    // )

    // const [{ isOver, canDrop }, drop] = useDrop(
    //     () => ({
    //         accept: ["group"],
    //         drop(_item, monitor) {
    //             const didDrop = monitor.didDrop()
    //             if (didDrop) {
    //                 return
    //             }
    //             moveEntryGroup(monitor.getItem(), {
    //                 entryGroupId: entryGroupIdCurrent,
    //                 title: props.title,
    //                 materializedPath: props.materialized_path,
    //                 pid: pid
    //             })
    //             return undefined
    //         },
    //         collect: (monitor) => ({
    //             isOver: monitor.isOver(),
    //             canDrop: monitor.canDrop() && canBeDropped,
    //             draggingColor: monitor.getItemType(),
    //         }),
    //     }),
    //     [moveEntryGroup, canBeDropped, entryGroupIdCurrent],
    // )

// + ' opacity: ' + opacity

    //ray-start alpha-l

    const treePath = pid === 'root'
        ? ''
        : (
            <React.Fragment>
                <View style={{...tw`absolute`, ...{
                        top: -1,
                        left: 5,
                        opacity: 0.3,
                        transform: [{rotate: '0deg'}],
                    }}}
                >
                    <MaterialCommunityIcons name='ray-start' size={26} />
                </View>
                <View style={{...tw`absolute bg-slate-100`, ...{
                        top: -8,
                        left: 8,
                        opacity: 0.3,
                        height: 18,
                        width: 2,
                        // transform: [{rotate: '90deg'}],
                    }}}>
                </View>
            </React.Fragment>
        )

    const treePtahUpper = lvl < 3 || parentLast
        ? ''
        : (
        <React.Fragment>

            <View style={{...tw`absolute bg-slate-100 h-full`, ...{
                    top: -8,
                    left: -8,
                    opacity: 0.3,
                    width: 2,
                    zIndex: -1
                }}}>
            </View>
        </React.Fragment>
    )

    return (
        <View style={tw`relative`} key={entryGroupIdCurrent}>

            {treePath}
            {treePtahUpper}

            <View
                // ref={drag} border-slate-200 border-l
                style={tw`pl-2 ml-2`}
            >
                <View
                    // ref={drop}
                      style={{...tw`flex flex-row bg-slate-900`, zIndex:100}} >
                    {hasChildren
                        ?
                            <TouchableOpacity
                                onPress={handleOpening}
                                style={tw``}>
                                {isOpened
                                    ? <MaterialCommunityIcons name='folder-open-outline' size={24} color={groupColor}/>//<HiOutlineFolderRemove className={"inline-block text-2xl " + groupColor}/>
                                    : <MaterialCommunityIcons name='folder-multiple-outline' size={24} color={groupColor}/>//<HiOutlineFolderAdd className={"inline-block text-2xl " + groupColor}/>
                                }
                            </TouchableOpacity>
                        : <MaterialCommunityIcons name='folder-outline' size={24} color={groupColor}/>//<HiOutlineFolder className={"inline-block text-2xl " + groupColor}/>
                    }

                    <View style={{...tw``, ...(canDrag ? {}: tw`w-2`)}}>
                        {canDrag
                            ? <Text>dragable</Text>//<RiDraggable className={groupColor}/>
                            : ''
                        }
                    </View>
                    {props.role === ROLE_GUEST
                        ? <Text>{props.title}</Text>
                        :
                        <TouchableOpacity onPress={handleOpenEntryGroup} style={tw`justify-center`}>
                            <Text
                                style={tw``
                                    + (entryGroupId === entryGroupIdCurrent ? ` font-bold text-slate-200`: ``)}
                            >
                                {props.title}
                            </Text>
                        </TouchableOpacity>
                    }
                </View>
                <View
                    style={!isOpened ? tw`hidden`: {}}
                    >
                        {children}
                </View>
            </View>
        </View>
    )
}

export default MainLeftMenuTreeNode