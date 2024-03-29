import React, {useContext, useEffect} from 'react';
import PasswordBrokerContext from '../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import {
    ENTRY_GROUP_TREES_LOADED,
    ENTRY_GROUP_TREES_LOADING,
    ENTRY_GROUP_TREES_REQUIRED_LOADING,
    ENTRY_GROUP_TREES_UPDATING,
} from '../../../../src_shared/passwordBroker/constants/EntryGroupTreesStatus';
// import EntryGroupAdd from "./MainBody/EntryGroup/EntryGroupAdd";
import MainLeftMenuTreeNode from './MainLeftMenuTreeNode';
// import MainLeftMenuImport from "./MainLeftMenuImport";
// import {DndProvider} from "react-dnd";
// import {HTML5Backend} from 'react-dnd-html5-backend';
// import {RiFolderAddFill, RiFolderSettingsFill} from 'react-icons/ri';
// import MainLeftMenuRootDrop from "./MainLeftMenuRootDrop";
// import {ClockLoader} from 'react-spinners';
import {ActivityIndicator, ScrollView, Text, View} from 'react-native-windows';
import tw from 'twrnc';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import EntryGroupAdd from './MainBody/EntryGroup/EntryGroupAdd';
import EntryGroupAddButton from './MainBody/EntryGroup/EntryGroupAddButton';
import UserApplicationContext from '../../../../src_shared/identity/contexts/UserApplicationContext';
import {DATABASE_MODE_OFFLINE} from '../../../../src_shared/identity/constants/DatabaseModeStates';

const MainLeftMenu = () => {
    const {
        loadEntryGroupTrees,
        entryGroupTrees,
        entryGroupTreesStatus,
        setEntryGroupTreesStatus,
        // moveEntryGroupMode,
        // setMoveEntryGroupMode,
    } = useContext(PasswordBrokerContext);

    const {databaseMode, iconDisableColor} = useContext(UserApplicationContext);

    // const menuButtonSize = 'text-3xl';

    let trees = <View style={tw`px-4`} />;

    if (entryGroupTreesStatus === ENTRY_GROUP_TREES_LOADED || entryGroupTreesStatus === ENTRY_GROUP_TREES_UPDATING) {
        trees = [];
        entryGroupTrees.sort((a, b) => {
            return a.title === b.title ? 0 : a.title > b.title;
        });
        for (let i = 0; i < entryGroupTrees.length; i++) {
            trees.push(
                <View key={entryGroupTrees[i].entry_group_id} className="tree-container">
                    <MainLeftMenuTreeNode
                        {...entryGroupTrees[i]}
                        pid="root"
                        lvl={1}
                        last={i + 1 === entryGroupTrees.length}
                        parentLast={true}
                    />
                </View>,
            );
        }
    }

    const disableButtons = databaseMode === DATABASE_MODE_OFFLINE;
    const iconColor = disableButtons ? iconDisableColor : '#1e293b';

    useEffect(() => {
        if (entryGroupTreesStatus === ENTRY_GROUP_TREES_REQUIRED_LOADING) {
            setEntryGroupTreesStatus(ENTRY_GROUP_TREES_LOADING);
            loadEntryGroupTrees();
        }
    }, [entryGroupTreesStatus, setEntryGroupTreesStatus, loadEntryGroupTrees]);

    // const handleMoveEntryGroupMode = () => {
    //     setMoveEntryGroupMode(!moveEntryGroupMode);
    // };

    return (
        <View style={tw`bg-slate-900 text-slate-400 pr-1 h-full min-w-[20%]`}>
            <View style={tw`w-full bg-slate-200 px-3 text-slate-800 py-0 min-w-[40px]`}>
                <EntryGroupAddButton
                    entryGroupId={null}
                    entryGroupTitle={null}
                    disabled={disableButtons}
                    button={<MaterialCommunityIcons name="folder-plus" size={32} color={iconColor} />}
                />
            </View>
            <View style={tw`py-0 px-2 flex h-full mt-5 flex-1`}>
                <View
                    style={tw`absolute top-0 left-0 w-full h-full bg-transparent/80 bg-slate-900 z-50 text-center
                        flex items-center justify-center
                         ${entryGroupTreesStatus === ENTRY_GROUP_TREES_LOADED ? 'hidden' : ''}`}>
                    <View style={tw`flex flex-row justify-center`}>
                        <View style={tw`px-2`}>
                            <ActivityIndicator size="small" color="#e2e8f0" />
                        </View>
                        <Text>
                            {entryGroupTreesStatus === ENTRY_GROUP_TREES_UPDATING ? 'updating' : 'loading'}
                            ...
                        </Text>
                    </View>
                </View>
                {/*<DndProvider backend={HTML5Backend}>*/}
                {/*<MainLeftMenuRootDrop />*/}

                <ScrollView style={tw`py-0 px-2 h-full`} scrollEnabled={true}>
                    {trees}
                </ScrollView>
                {/*</DndProvider>*/}
            </View>
        </View>
        // <aside className="basis-1/4 bg-slate-900 text-slate-400 pr-1">
        //     <div className="w-full bg-slate-200 px-3 text-slate-800 py-1">
        //         <EntryGroupAdd
        //             entryGroupId = {null}
        //             entryGroupTitle = {null}
        //             button = {
        //             <div className="tooltip tooltip-right" data-tip="add new tree">
        //                 <RiFolderAddFill className={"inline-block " + menuButtonSize + " cursor-pointer"}/>
        //             </div>
        //             }
        //         />
        //         <MainLeftMenuImport menuButtonSize={menuButtonSize}/>
        //         <div className="tooltip tooltip-right px-2" data-tip={ (moveEntryGroupMode? "disable " : "enable ")
        //         + "Entry Group move mode"}>
        //             <RiFolderSettingsFill
        //                 className={"inline-block " + menuButtonSize + " cursor-pointer" + (moveEntryGroupMode?
        //                 " text-yellow-700": "")}
        //                 onClick={handleMoveEntryGroupMode}
        //             />
        //         </div>
        //     </div>
        //     <div className="py-5 px-2 relative">
        //         <div className={"absolute top-0 left-0 w-full h-full bg-transparent/80 bg-slate-900 z-50
        //          text-center flex items-center justify-center "
        //                 + ( entryGroupTreesStatus === ENTRY_GROUP_TREES_LOADED ? "hidden" : "")}>
        //             <span className="flex justify-between">
        //                 <span className="px-2">
        //                     <ClockLoader
        //                         color="#e2e8f0"
        //                         size={20}
        //                         aria-label="Loading Spinner"
        //                         data-testid="loader"
        //                         speedMultiplier={1}
        //                         className="inline-block w-2"
        //                     />
        //                 </span>
        //                 <span>
        //                     {(entryGroupTreesStatus === ENTRY_GROUP_TREES_UPDATING ? "updating" : "loading")}...
        //                 </span>
        //             </span>
        //         </div>
        //         <DndProvider backend={HTML5Backend}>
        //             <MainLeftMenuRootDrop />
        //             {trees}
        //         </DndProvider>
        //     </div>
        // </aside>
    );
};

export default MainLeftMenu;
