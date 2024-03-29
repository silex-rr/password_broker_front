import React, {useContext, useEffect} from 'react';
import PasswordBrokerContext from '../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import {
    ENTRY_GROUP_LOADED,
    ENTRY_GROUP_LOADING,
    ENTRY_GROUP_NOT_SELECTED,
    ENTRY_GROUP_REQUIRED_LOADING,
} from '../../../../src_shared/passwordBroker/constants/EntryGroupStatus';
import EntryGroup from './MainBody/EntryGroup/EntryGroup';
import {ROLE_ADMIN, ROLE_MEMBER, ROLE_MODERATOR} from '../../../../src_shared/passwordBroker/constants/EntryGroupRole';
import {
    ENTRY_GROUP_MENU_HISTORY,
    ENTRY_GROUP_MENU_MAIN,
    ENTRY_GROUP_MENU_SETTINGS,
    ENTRY_GROUP_MENU_USERS,
} from '../../../../src_shared/passwordBroker/constants/EntryGroupMenu';
import {
    ENTRY_GROUP_USERS_LOADED,
    ENTRY_GROUP_USERS_LOADING,
    ENTRY_GROUP_USERS_NOT_SELECTED,
    ENTRY_GROUP_USERS_REQUIRED_LOADING,
} from '../../../../src_shared/passwordBroker/constants/EntryGroupUsersStatus';
// import EntryGroupUsers from "./MainBody/EntryGroup/EntryGroupUsers";
// import EntryGroupHistory from "./MainBody/EntryGroup/EntryGroupHistory";
// import {EntryGroupProvider} from '../../../../src_shared/passwordBroker/contexts/EntryGroupContext';
import {ActivityIndicator, ScrollView, Text, View} from 'react-native-windows';
import tw from 'twrnc';
// import Link from './MainBody/EntryGroup/EntryFieldTypes/Link';
// import Password from './MainBody/EntryGroup/EntryFieldTypes/Password';
import EntryGroupMenu from './MainBody/EntryGroupMenu/EntryGroupMenu';
import EntryGroupHistory from './MainBody/EntryGroup/EntryGroupHistory';
// import {ENTRY_GROUP_TREES_UPDATING} from '../../../../src_shared/passwordBroker/constants/EntryGroupTreesStatus';

const MainBody = () => {
    const passwordBrokerContext = useContext(PasswordBrokerContext);

    let body = '';
    let head = '';

    const {
        entryGroupData,
        entryGroupId,
        entryGroupStatus,
        setEntryGroupStatus,
        loadEntryGroup,
        setEntryGroupMenu,
        entryGroupMenu,
        entryGroupUsersStatus,
        setEntryGroupUsersStatus,
        loadEntryGroupUsers,
    } = passwordBrokerContext;

    useEffect(() => {
        if (entryGroupStatus === ENTRY_GROUP_REQUIRED_LOADING) {
            setEntryGroupStatus(ENTRY_GROUP_LOADING);
            loadEntryGroup(entryGroupId);
        }
        if (entryGroupUsersStatus === ENTRY_GROUP_USERS_REQUIRED_LOADING) {
            setEntryGroupUsersStatus(ENTRY_GROUP_USERS_LOADING);
            loadEntryGroupUsers(entryGroupId);
        }
    }, [
        entryGroupStatus,
        entryGroupId,
        loadEntryGroup,
        setEntryGroupStatus,
        entryGroupUsersStatus,
        setEntryGroupUsersStatus,
        loadEntryGroupUsers,
    ]);

    const menuClickHandler = value => {
        if (value === ENTRY_GROUP_MENU_USERS && entryGroupUsersStatus === ENTRY_GROUP_USERS_NOT_SELECTED) {
            setEntryGroupUsersStatus(ENTRY_GROUP_USERS_REQUIRED_LOADING);
        }
        setEntryGroupMenu(value);
    };

    switch (entryGroupStatus) {
        default:
            break;
        case ENTRY_GROUP_LOADING:
        case ENTRY_GROUP_REQUIRED_LOADING:
            head = (
                <View style={tw`px-5 py-3 flex flex-row  `}>
                    <View style={tw`px-2`}>
                        <ActivityIndicator size="small" color="#334155" />
                    </View>
                    <Text style={tw`text-slate-700`}>loading...</Text>
                </View>
            );
            body = '';
            break;
        case ENTRY_GROUP_NOT_SELECTED:
            head = <Text style={tw`px-5 py-3 text-slate-700`}>Select an Entry Group</Text>;
            body = '';
            break;
        case ENTRY_GROUP_LOADED:
            const menuElements = [];

            switch (entryGroupData.role.role) {
                case ROLE_ADMIN:
                // menuElements.push({
                //     id: ENTRY_GROUP_MENU_SETTINGS,
                //     onPress: () => menuClickHandler(ENTRY_GROUP_MENU_SETTINGS),
                //     selected: entryGroupMenu === ENTRY_GROUP_MENU_SETTINGS,
                //     text: 'Settings',
                // });
                // eslint-disable-next-line no-fallthrough
                case ROLE_MODERATOR:
                // eslint-disable-next-line no-fallthrough
                default:
                case ROLE_MEMBER:
                    menuElements.push({
                        id: ENTRY_GROUP_MENU_USERS,
                        onPress: () => menuClickHandler(ENTRY_GROUP_MENU_USERS),
                        selected: entryGroupMenu === ENTRY_GROUP_MENU_USERS,
                        text: 'Users',
                    });

                    menuElements.push({
                        id: ENTRY_GROUP_MENU_HISTORY,
                        onPress: () => menuClickHandler(ENTRY_GROUP_MENU_HISTORY),
                        selected: entryGroupMenu === ENTRY_GROUP_MENU_HISTORY,
                        text: 'History',
                    });

                    menuElements.push({
                        id: ENTRY_GROUP_MENU_MAIN,
                        onPress: () => menuClickHandler(ENTRY_GROUP_MENU_MAIN),
                        selected: entryGroupMenu === ENTRY_GROUP_MENU_MAIN,
                        text: 'Entries',
                    });
            }
            menuElements.reverse();
            head = (
                <View style={tw`w-full flex flex-row justify-between`}>
                    <Text style={tw`px-5 py-3 text-slate-700 text-2xl`}>{entryGroupData.entryGroup.name}</Text>
                    <EntryGroupMenu elements={menuElements} />
                </View>
            );

            switch (entryGroupMenu) {
                default:
                case ENTRY_GROUP_MENU_MAIN:
                    body = <EntryGroup {...entryGroupData} />;
                    break;
                case ENTRY_GROUP_MENU_HISTORY:
                    body = <EntryGroupHistory />;
                    break;
                case ENTRY_GROUP_MENU_USERS:
                    switch (entryGroupUsersStatus) {
                        case ENTRY_GROUP_USERS_LOADED:
                            body = ''; //<EntryGroupUsers/>
                            break;
                        case ENTRY_GROUP_USERS_NOT_SELECTED:
                        case ENTRY_GROUP_USERS_LOADING:
                        case ENTRY_GROUP_USERS_REQUIRED_LOADING:
                            body = <Text>'loading...'</Text>;
                            break;

                        default:
                            body = <Text>'Error'</Text>;
                    }
                    break;
                case ENTRY_GROUP_MENU_SETTINGS:
                    body = <Text>'settings'</Text>;
                    break;
            }

            break;
    }

    return (
        <View style={tw`p-0 text-slate-100 bg-slate-600 w-full shrink`}>
            <View style={tw`p-0 bg-slate-200`}>{head}</View>
            <View style={tw`flex flex-1`}>
                <ScrollView style={tw`m-5`}>{body}</ScrollView>
            </View>
        </View>
    );
};

export default MainBody;
