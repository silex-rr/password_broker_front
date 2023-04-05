import {useContext, useEffect} from "react";
import {PasswordBrokerContext} from "../contexts/PasswordBrokerContext";
import {
    ENTRY_GROUP_TREES_LOADED,
    ENTRY_GROUP_TREES_LOADING,
    ENTRY_GROUP_TREES_REQUIRED_LOADING
} from "../constants/EntryGroupTreesStatus";
import MainLeftMenuTreeNode from "./MainLeftMenuTree";
import {HiFolderAdd} from "react-icons/hi";
import EntryGroupAdd from "./MainBody/EntryGroup/EntryGroupAdd";

const MainLeftMenu = (props) => {

    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {
        loadEntryGroupTrees,
        entryGroupTrees,
        entryGroupTreesStatus,
        setEntryGroupTreesStatus,
    } = passwordBrokerContext


    useEffect(() => {
        if (entryGroupTreesStatus === ENTRY_GROUP_TREES_REQUIRED_LOADING) {
            setEntryGroupTreesStatus(ENTRY_GROUP_TREES_LOADING)
            loadEntryGroupTrees()
        }
    }, [entryGroupTreesStatus]);


    let trees = 'loading...'

    if (entryGroupTreesStatus === ENTRY_GROUP_TREES_LOADED) {
        trees = []

        for (let i = 0; i < entryGroupTrees.length; i++) {
            trees.push(
                <ul key={entryGroupTrees[i].entry_group_id} className="tree-container">
                    <MainLeftMenuTreeNode {...entryGroupTrees[i]}/>
                </ul>
            )
        }
    }

    return (
        <div className="basis-1/4 bg-slate-900 text-slate-400 h-full pr-1">
            <div className="w-full bg-slate-200 px-3 text-slate-800 py-1">
                <EntryGroupAdd
                    entryGroupId = {null}
                    entryGroupTitle = {null}
                    button = {
                    <div className="tooltip tooltip-right" data-tip="add new tree">
                        <HiFolderAdd className="inline-block text-2xl cursor-pointer"/>
                    </div>
                    }
                />
            </div>
            <div className="py-5 px-2">
                {trees}
            </div>
        </div>
    )
}

export default MainLeftMenu