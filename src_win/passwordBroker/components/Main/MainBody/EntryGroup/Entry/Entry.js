import Moment from 'react-moment';
import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import PasswordBrokerContext from '../../../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import {
    ENTRY_GROUP_ENTRY_FIELDS_LOADED,
    ENTRY_GROUP_ENTRY_FIELDS_LOADING,
    ENTRY_GROUP_ENTRY_FIELDS_NOT_LOADED,
    ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING,
} from '../../../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldsStatus';
import EntryFields from './EntryFields';
import {Text, View} from 'react-native-windows';
import {DataTable} from 'react-native-paper';
import tw from 'twrnc';

import {
    FIELD_EDITING_AWAIT,
    FIELD_EDITING_MODAL_SHOULD_BE_CLOSE,
} from '../../../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldEditingStates';
import EntryFieldContext from '../../../../../../../src_shared/passwordBroker/contexts/EntryFieldContext';
import AppContext from '../../../../../../AppContext';

const Entry = props => {
    const entryGroupId = props.entry_group_id;
    const entryId = props.entry_id;

    const {baseUrl, entryGroupFieldForEditState, setEntryGroupFieldForEditState} = useContext(PasswordBrokerContext);

    const {addingFieldState} = useContext(EntryFieldContext);
    const {modalClose, modalVisible} = useContext(AppContext);
    const [entryFieldsStatus, setEntryFieldsStatus] = useState(ENTRY_GROUP_ENTRY_FIELDS_NOT_LOADED);
    const [entryFieldsData, setEntryFieldsData] = useState([]);
    const [entryFieldsIsVisible, setEntryFieldVisible] = useState(false);

    useEffect(() => {
        if (modalVisible && entryGroupFieldForEditState === FIELD_EDITING_MODAL_SHOULD_BE_CLOSE) {
            modalClose();
            setEntryGroupFieldForEditState(FIELD_EDITING_AWAIT);
        }

        if (entryFieldsStatus === ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING) {
            setEntryFieldsStatus(ENTRY_GROUP_ENTRY_FIELDS_LOADING);
            axios.get(baseUrl + '/entryGroups/' + entryGroupId + '/entries/' + entryId + '/fields').then(response => {
                setEntryFieldsData(response.data);
                setEntryFieldsStatus(ENTRY_GROUP_ENTRY_FIELDS_LOADED);
            });
        }
    }, [
        entryFieldsStatus,
        baseUrl,
        entryGroupId,
        entryId,
        setEntryFieldsStatus,
        setEntryFieldsData,
        modalVisible,
        entryGroupFieldForEditState,
        addingFieldState,
        modalClose,
        setEntryGroupFieldForEditState,
    ]);

    const entryFieldsVisibility = () => {
        if (entryFieldsStatus === ENTRY_GROUP_ENTRY_FIELDS_NOT_LOADED) {
            setEntryFieldsStatus(ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING);
        }
        setEntryFieldVisible(!entryFieldsIsVisible);
    };

    let entryFields = <Text>''</Text>;

    switch (entryFieldsStatus) {
        default:
            break;

        case ENTRY_GROUP_ENTRY_FIELDS_LOADED:
            entryFields = (
                <EntryFields
                    fields={entryFieldsData}
                    entryGroupId={entryGroupId}
                    entryId={entryId}
                    entryTitle={props.title}
                    setEntryFieldsStatus={setEntryFieldsStatus}
                />
            );
            break;
        case ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING:
        case ENTRY_GROUP_ENTRY_FIELDS_LOADING:
        case ENTRY_GROUP_ENTRY_FIELDS_NOT_LOADED:
            entryFields = (
                <View style={tw`w-full text-center p-2 bg-slate-500`}>
                    <Text>Loading...</Text>
                </View>
            );
            break;
    }

    //    borderStyle: 'solid',
    //     borderBottomWidth: StyleSheet.hairlineWidth,
    //     minHeight: 48,
    //     paddingHorizontal: 16,
    const rowStyle = {borderColor: '#191e24', paddingHorizontal: 0};

    return (
        <React.Fragment>
            <DataTable.Row key={entryId + '_main'} style={rowStyle}>
                <DataTable.Cell style={tw`bg-slate-700 pl-4`} onPress={entryFieldsVisibility}>
                    <Text style={tw`text-slate-100`}>{props.title}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={tw`bg-slate-700 pl-4`}>
                    <Moment element={Text} format="YYYY.MM.DD HH:mm" style={tw`text-slate-100`}>
                        {props.created_at}
                    </Moment>
                </DataTable.Cell>
                <DataTable.Cell style={tw`bg-slate-700 pl-4`}>
                    <Moment element={Text} format="YYYY.MM.DD HH:mm" style={tw`text-slate-100`}>
                        {props.updated_at}
                    </Moment>
                </DataTable.Cell>
            </DataTable.Row>
            <View key={entryId + '_fields'} style={tw`${entryFieldsIsVisible ? '' : 'hidden'}`}>
                <View style={tw`bg-slate-700 text-slate-100 pt-0 px-0`}>{entryFields}</View>
            </View>
        </React.Fragment>
    );
};

export default Entry;
