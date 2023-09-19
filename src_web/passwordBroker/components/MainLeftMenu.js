import React, {useContext, useEffect} from 'react';
import PasswordBrokerContext from '../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import {
    ENTRY_GROUP_TREES_LOADED,
    ENTRY_GROUP_TREES_LOADING,
    ENTRY_GROUP_TREES_REQUIRED_LOADING,
    ENTRY_GROUP_TREES_UPDATING,
} from '../../../src_shared/passwordBroker/constants/EntryGroupTreesStatus';
import MainLeftMenuTreeNode from './MainLeftMenuTreeNode';
import EntryGroupAdd from './MainBody/EntryGroup/EntryGroupAdd';
import MainLeftMenuImport from './MainLeftMenuImport';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {RiFolderAddFill, RiFolderSettingsFill} from 'react-icons/ri';
import MainLeftMenuRootDrop from './MainLeftMenuRootDrop';
import {ClockLoader} from 'react-spinners';

const MainLeftMenu = () => {
    const passwordBrokerContext = useContext(PasswordBrokerContext);
    const {
        loadEntryGroupTrees,
        entryGroupTrees,
        entryGroupTreesStatus,
        setEntryGroupTreesStatus,
        moveEntryGroupMode,
        handleMoveEntryGroupMode,
    } = passwordBrokerContext;

    const menuButtonSize = 'text-3xl';

    useEffect(() => {
        if (entryGroupTreesStatus === ENTRY_GROUP_TREES_REQUIRED_LOADING) {
            setEntryGroupTreesStatus(ENTRY_GROUP_TREES_LOADING);
            loadEntryGroupTrees();
        }
    }, [entryGroupTreesStatus, setEntryGroupTreesStatus, loadEntryGroupTrees]);

    let trees = <div className="px-4" />;

    if (entryGroupTreesStatus === ENTRY_GROUP_TREES_LOADED || entryGroupTreesStatus === ENTRY_GROUP_TREES_UPDATING) {
        trees = [];
        entryGroupTrees.sort((a, b) => {
            return a.title === b.title ? 0 : a.title > b.title;
        });
        for (let i = 0; i < entryGroupTrees.length; i++) {
            trees.push(
                <ul key={entryGroupTrees[i].entry_group_id} className="tree-container">
                    <MainLeftMenuTreeNode {...entryGroupTrees[i]} pid="root" />
                </ul>,
            );
        }
    }

    //RiFolderSettingsFill
    return (
        <aside className="basis-1/4 bg-slate-900 pr-1 text-slate-400">
            <div className="w-full bg-slate-200 px-3 py-1 text-slate-800">
                <EntryGroupAdd
                    entryGroupId={null}
                    entryGroupTitle={null}
                    button={
                        <div className="tooltip tooltip-right" data-tip="add new tree">
                            <RiFolderAddFill className={'inline-block ' + menuButtonSize + ' cursor-pointer'} />
                        </div>
                    }
                />
                <MainLeftMenuImport menuButtonSize={menuButtonSize} />
                <div
                    className="tooltip tooltip-right px-2"
                    data-tip={(moveEntryGroupMode ? 'disable ' : 'enable ') + 'Entry Group move mode'}>
                    <RiFolderSettingsFill
                        className={
                            'inline-block ' +
                            menuButtonSize +
                            ' cursor-pointer' +
                            (moveEntryGroupMode ? ' text-yellow-700' : '')
                        }
                        onClick={handleMoveEntryGroupMode}
                    />
                </div>
            </div>
            <div className="relative px-2 py-5">
                <div
                    className={
                        'absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center' +
                        ' bg-slate-900 bg-transparent/80 text-center ' +
                        (entryGroupTreesStatus === ENTRY_GROUP_TREES_LOADED ? 'hidden' : '')
                    }>
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
                            {entryGroupTreesStatus === ENTRY_GROUP_TREES_UPDATING ? 'updating' : 'loading'}
                            ...
                        </span>
                    </span>
                </div>
                <DndProvider backend={HTML5Backend}>
                    <MainLeftMenuRootDrop />
                    {trees}
                </DndProvider>
            </div>
        </aside>
    );
};

export default MainLeftMenu;
