import {useDrop} from "react-dnd";
import React, {useContext} from "react";
import {PasswordBrokerContext} from "../../../src_shared/passwordBroker/contexts/PasswordBrokerContext";

const MainLeftMenuRootDrop = () => {

    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {
        moveEntryGroupMode,
        moveEntryGroup
    } = passwordBrokerContext

    const [{ isOver, canDrop }, drop] = useDrop(
        () => ({
            accept: ["group"],
            drop(_item, monitor) {
                const didDrop = monitor.didDrop()
                if (didDrop) {
                    return
                }
                moveEntryGroup(monitor.getItem(), {
                    entryGroupId: '',
                    title: 'root',
                    materializedPath: '',
                    pid: ''
                })
                return undefined
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
                draggingColor: monitor.getItemType(),
            }),
        }),
        [moveEntryGroup],
    )

    return (
        <div ref={drop}  className={ 'ml-4 px-8 py-1 bg-yellow-600 text-slate-800 font-semibold' + (moveEntryGroupMode ? '' : ' hidden') }>
            drop a group here to move it to the root
        </div>
    )
}

export default MainLeftMenuRootDrop