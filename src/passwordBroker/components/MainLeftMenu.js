import React, {useContext, useEffect} from "react";
import {PasswordBrokerContext} from "../contexts/PasswordBrokerContext";
import {
    ENTRY_GROUP_TREES_LOADED,
    ENTRY_GROUP_TREES_LOADING,
    ENTRY_GROUP_TREES_REQUIRED_LOADING
} from "../constants/EntryGroupTreesStatus";
import MainLeftMenuTreeNode from "./MainLeftMenuTreeNode";
import EntryGroupAdd from "./MainBody/EntryGroup/EntryGroupAdd";
import MainLeftMenuImport from "./MainLeftMenuImport";
import {DndProvider, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {RiFolderAddFill, RiFolderSettingsFill} from "react-icons/ri";
import MainLeftMenuRootDrop from "./MainLeftMenuRootDrop";
const MainLeftMenu = (props) => {

    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {
        loadEntryGroupTrees,
        entryGroupTrees,
        entryGroupTreesStatus,
        setEntryGroupTreesStatus,
        moveEntryGroupMode,
        setMoveEntryGroupMode,
    } = passwordBrokerContext


    useEffect(() => {
        if (entryGroupTreesStatus === ENTRY_GROUP_TREES_REQUIRED_LOADING) {
            setEntryGroupTreesStatus(ENTRY_GROUP_TREES_LOADING)
            loadEntryGroupTrees()
        }
    }, [entryGroupTreesStatus]);


    let trees = <div className="px-4">loading...</div>

    if (entryGroupTreesStatus === ENTRY_GROUP_TREES_LOADED) {
        trees = []
        entryGroupTrees.sort((a, b) => {return a.title === b.title ? 0 : a.title > b.title})
        for (let i = 0; i < entryGroupTrees.length; i++) {
            trees.push(
                <ul key={entryGroupTrees[i].entry_group_id} className="tree-container">
                    <MainLeftMenuTreeNode {...entryGroupTrees[i]} pid="root"/>
                </ul>
            )
        }
    }

    const handleMoveEntryGroupMode = () => {
        setMoveEntryGroupMode(!moveEntryGroupMode)
    }

//RiFolderSettingsFill
    return (
        <div className="basis-1/4 bg-slate-900 text-slate-400 h-full pr-1">
            <div className="w-full bg-slate-200 px-3 text-slate-800 py-1">
                <EntryGroupAdd
                    entryGroupId = {null}
                    entryGroupTitle = {null}
                    button = {
                    <div className="tooltip tooltip-right" data-tip="add new tree">
                        <RiFolderAddFill className="inline-block text-4xl cursor-pointer"/>
                    </div>
                    }
                />
                <MainLeftMenuImport />
                <div className="tooltip tooltip-right px-2" data-tip={ (moveEntryGroupMode? "disable " : "enable ") + "Entry Group move mode"}>
                    <RiFolderSettingsFill
                        className={"inline-block text-4xl cursor-pointer" + (moveEntryGroupMode? " text-yellow-700": "")}
                        onClick={handleMoveEntryGroupMode}
                    />
                </div>
            </div>
            <div className="py-5 px-2">
                <DndProvider backend={HTML5Backend}>
                    <MainLeftMenuRootDrop />
                    {trees}
                </DndProvider>
            </div>
        </div>
    )
}

export default MainLeftMenu