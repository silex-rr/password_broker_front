import React, {useContext, useEffect} from "react";
import {PasswordBrokerContext} from "../contexts/PasswordBrokerContext";
import {
    ENTRY_GROUP_TREES_LOADED,
    ENTRY_GROUP_TREES_LOADING,
    ENTRY_GROUP_TREES_REQUIRED_LOADING, ENTRY_GROUP_TREES_UPDATING
} from "../constants/EntryGroupTreesStatus";
import MainLeftMenuTreeNode from "./MainLeftMenuTreeNode";
import EntryGroupAdd from "./MainBody/EntryGroup/EntryGroupAdd";
import MainLeftMenuImport from "./MainLeftMenuImport";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {RiFolderAddFill, RiFolderSettingsFill} from "react-icons/ri";
import MainLeftMenuRootDrop from "./MainLeftMenuRootDrop";
import {ClockLoader} from "react-spinners";

const MainLeftMenu = () => {

    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {
        loadEntryGroupTrees,
        entryGroupTrees,
        entryGroupTreesStatus,
        setEntryGroupTreesStatus,
        moveEntryGroupMode,
        setMoveEntryGroupMode,
    } = passwordBrokerContext

    const menuButtonSize = 'text-3xl'


    useEffect(() => {
        if (entryGroupTreesStatus === ENTRY_GROUP_TREES_REQUIRED_LOADING) {
            setEntryGroupTreesStatus(ENTRY_GROUP_TREES_LOADING)
            loadEntryGroupTrees()
        }
    }, [entryGroupTreesStatus, setEntryGroupTreesStatus, loadEntryGroupTrees]);


    let trees = <div className="px-4"></div>

    if (entryGroupTreesStatus === ENTRY_GROUP_TREES_LOADED
        || entryGroupTreesStatus === ENTRY_GROUP_TREES_UPDATING
    ) {
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
        <aside className="basis-1/4 bg-slate-900 text-slate-400 pr-1">
            <div className="w-full bg-slate-200 px-3 text-slate-800 py-1">
                <EntryGroupAdd
                    entryGroupId = {null}
                    entryGroupTitle = {null}
                    button = {
                    <div className="tooltip tooltip-right" data-tip="add new tree">
                        <RiFolderAddFill className={"inline-block " + menuButtonSize + " cursor-pointer"}/>
                    </div>
                    }
                />
                <MainLeftMenuImport menuButtonSize={menuButtonSize}/>
                <div className="tooltip tooltip-right px-2" data-tip={ (moveEntryGroupMode? "disable " : "enable ") + "Entry Group move mode"}>
                    <RiFolderSettingsFill
                        className={"inline-block " + menuButtonSize + " cursor-pointer" + (moveEntryGroupMode? " text-yellow-700": "")}
                        onClick={handleMoveEntryGroupMode}
                    />
                </div>
            </div>
            <div className="py-5 px-2 relative">
                <div className={"absolute top-0 left-0 w-full h-full bg-transparent/80 bg-slate-900 z-50 text-center flex items-center justify-center "
                        + ( entryGroupTreesStatus === ENTRY_GROUP_TREES_LOADED ? "hidden" : "")}>
                    <span className="flex justify-between">
                        <span className="px-2">
                            <ClockLoader
                                color="#e2e8f0"
                                size={20}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                                speedMultiplier={1}
                                className="inline-block w-2"
                            />
                        </span>
                        <span>
                            {(entryGroupTreesStatus === ENTRY_GROUP_TREES_UPDATING ? "updating" : "loading")}...
                        </span>
                    </span>
                </div>
                <DndProvider backend={HTML5Backend}>
                    <MainLeftMenuRootDrop />
                    {trees}
                </DndProvider>
            </div>
        </aside>
    )
}

export default MainLeftMenu