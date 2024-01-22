import React, {useContext, useState} from 'react';
import Moment from 'react-moment';
// import {MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp} from 'react-icons/md';
import EntryFields from './MainBody/EntryGroup/Entry/EntryFields';
import PasswordBrokerContext from '../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import {DataTable} from 'react-native-paper';
import {Text, TouchableOpacity, View} from 'react-native-windows';
import tw from 'twrnc';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SearchResultEntry = ({
    entry_id,
    entry_group_id,
    title,
    created_at,
    updated_at,
    // deleted_at,
    passwords,
    links,
    notes,
    files,
    entry_group,
}) => {
    const {selectEntryGroup} = useContext(PasswordBrokerContext);
    const [entryFieldsIsVisible, setEntryFieldsIsVisible] = useState(false);
    const EntryFieldsVisibilityHandler = () => {
        setEntryFieldsIsVisible(!entryFieldsIsVisible);
    };

    const handleEntryGroupClick = () => {
        selectEntryGroup(entry_group_id);
    };

    const fields = [...passwords, ...links, ...notes, ...files];
    const iconColor = '#e2e8f0';


    return (
        <React.Fragment>
            <DataTable.Row key={entry_id + '_main'} style={tw`p-0`}>
                <DataTable.Cell style={tw`bg-slate-700 text-slate-100 pl-2`} onPress={EntryFieldsVisibilityHandler}>
                    {entryFieldsIsVisible ? (
                        <MaterialIcons name="keyboard-double-arrow-up" size={14} color={iconColor} />
                    ) : (
                        <MaterialIcons name="keyboard-double-arrow-down" size={14} color={iconColor} />
                    )}
                    <Text style={tw`text-slate-100`}> {title}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={tw`bg-slate-700 text-slate-100`}>
                    <TouchableOpacity onPress={handleEntryGroupClick}>
                        <Text>{entry_group.name}</Text>
                    </TouchableOpacity>
                </DataTable.Cell>
                <DataTable.Cell style={tw`bg-slate-700 text-slate-100`}>
                    <Moment element={Text} format="YYYY.MM.DD HH:mm">
                        {created_at}
                    </Moment>
                </DataTable.Cell>
                <DataTable.Cell style={tw`bg-slate-700 text-slate-100`}>
                    <Moment element={Text} format="YYYY.MM.DD HH:mm">
                        {updated_at}
                    </Moment>
                </DataTable.Cell>
            </DataTable.Row>
            <View key={entry_id + '_fields'} style={entryFieldsIsVisible ? '' : tw`hidden`}>
                {/*<DataTable.Row key={entry_id + '_fields'} style={entryFieldsIsVisible ? '' : tw`hidden`}>*/}
                {/*<DataTable.Cell style={tw`w-full bg-slate-700 px-0 pt-0 text-slate-100`}>*/}
                <EntryFields
                    entryGroupId={entry_group_id}
                    entryId={entry_id}
                    fields={fields}
                    hideAdd={true}
                    hideEdit={true}
                />
                {/*</DataTable.Cell>*/}
                {/*</DataTable.Row>*/}
            </View>
        </React.Fragment>
    );
};

export default SearchResultEntry;
