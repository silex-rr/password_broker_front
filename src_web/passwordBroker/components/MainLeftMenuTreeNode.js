import {HiOutlineFolder, HiOutlineFolderAdd, HiOutlineFolderRemove} from "react-icons/hi";
import React, {useCallback, useContext, useState} from "react";
import {PasswordBrokerContext} from "../../../src_shared/passwordBroker/contexts/PasswordBrokerContext";
import {ROLE_ADMIN, ROLE_GUEST, ROLE_MEMBER, ROLE_MODERATOR} from "../../../src_shared/passwordBroker/constants/EntryGroupRole";
import {useDrag, useDrop} from "react-dnd";
import {RiDraggable} from "react-icons/ri";
const MainLeftMenuTreeNode = (props) => {

    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const entryGroupIdCurrent = props.entry_group_id;
    const pid = props.pid;
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

    for (let i = 0; i < props.children.length; i++) {
        children.push(MainLeftMenuTreeNode({...props.children[i], pid: entryGroupIdCurrent}))
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

    let groupColor = 'text-slate-200';
    let canDrag = false
    let canBeDropped = false
    switch (props.role){
        default:
        case ROLE_GUEST:
            groupColor = 'text-slate-200';
            break;
        case ROLE_ADMIN:
            groupColor = 'text-yellow-600';
            canDrag = true && moveEntryGroupMode
            canBeDropped = true && moveEntryGroupMode
            break;
        case ROLE_MODERATOR:
            groupColor = 'text-sky-800';
            break;
        case ROLE_MEMBER:
            groupColor = 'text-green-800';
            break;
    }


    const [{ isDragging, opacity }, drag] = useDrag(
        () => ({
            type: "group",
            canDrag: canDrag,
            item: {
                entryGroupId: entryGroupIdCurrent,
                title: props.title,
                materializedPath: props.materialized_path,
                pid: pid
            },
            // end: (item, monitor) => {
            //     const dropResult = monitor.getDropResult()
            //     if (item && dropResult) {
            //         alert(`You dropped ${item.name} into ${dropResult.name}!`)
            //     }
            // },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
                opacity: monitor.isDragging() ? 0.4 : 1,
            }),
        }),
        [canDrag, entryGroupIdCurrent],
    )

    const [{ isOver, canDrop }, drop] = useDrop(
        () => ({
            accept: ["group"],
            drop(_item, monitor) {
                const didDrop = monitor.didDrop()
                if (didDrop) {
                    return
                }
                moveEntryGroup(monitor.getItem(), {
                    entryGroupId: entryGroupIdCurrent,
                    title: props.title,
                    materializedPath: props.materialized_path,
                    pid: pid
                })
                return undefined
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop() && canBeDropped,
                draggingColor: monitor.getItemType(),
            }),
        }),
        [moveEntryGroup, canBeDropped, entryGroupIdCurrent],
    )


    return (
        <li key={entryGroupIdCurrent}
            ref={drag}
            className="pl-2 ml-2 border-slate-200 border-l border-dotted"
            style={{opacity: opacity}}
        >
            <div ref={drop} className="tree-corner" >
                {hasChildren
                    ?
                        <span onClick={handleOpening} className="inline-block cursor-pointer">
                            {isOpened
                                ? <HiOutlineFolderRemove className={"inline-block text-2xl " + groupColor}/>
                                : <HiOutlineFolderAdd className={"inline-block text-2xl " + groupColor}/>
                            }
                        </span>
                    : <HiOutlineFolder className={"inline-block text-2xl " + groupColor}/>
                }

                <div className={"inline-block align-middle " + (canDrag ? '': 'w-2')}>
                    {canDrag
                        ? <RiDraggable className={groupColor}/>
                        : ''
                    }
                </div>
                {props.role === ROLE_GUEST
                    ? <span className="inline-block align-middle">{props.title}</span>
                    :
                    <span onClick={handleOpenEntryGroup} className="cursor-pointer">
                        <span
                            className={"inline-block align-middle"
                                + (entryGroupId === entryGroupIdCurrent ? " font-bold text-slate-200": "")}
                        >
                            {props.title}
                        </span>
                    </span>
                }
            </div>
            <ul
                className={(!isOpened ? "hidden": "")}>
                    {children}
            </ul>
        </li>
    )
}

export default MainLeftMenuTreeNode