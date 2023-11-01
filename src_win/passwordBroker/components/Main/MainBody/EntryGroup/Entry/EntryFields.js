import React, {useContext, useEffect} from 'react';
import EntryField from './EntryField';
import {Text, View} from 'react-native-windows';
import tw from 'twrnc';
import EntryFieldAddButton from './EntryFieldAddButton';
// eslint-disable-next-line max-len
import {FIELD_EDITING_EDITING} from '../../../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldEditingStates';
import EntryFieldContext from '../../../../../../../src_shared/passwordBroker/contexts/EntryFieldContext';
// eslint-disable-next-line max-len
import {FIELD_TYPE_PASSWORD} from '../../../../../../../src_shared/passwordBroker/constants/MainBodyEntryGroupEntryFieldTypes';
import AppContext from '../../../../../../AppContext';
import PasswordBrokerContext from '../../../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import EntryFieldEdit from './EntryFieldEdit';
import UserApplicationContext from '../../../../../../../src_shared/identity/contexts/UserApplicationContext';
import {DATABASE_MODE_OFFLINE} from '../../../../../../../src_shared/identity/constants/DatabaseModeStates';

const EntryFields = ({
    fields,
    entryGroupId,
    entryId,
    entryTitle,

    setEntryFieldsStatus,
}) => {
    const fieldComponents = [];

    for (let i = 0; i < fields.length; i++) {
        fieldComponents.push(<EntryField key={fields[i].field_id} {...fields[i]} />);
    }

    const {entryGroupFieldForEditId, entryGroupFieldForEditDecryptedValue, entryGroupFieldForEditState} =
        useContext(PasswordBrokerContext);

    const {modalClose, modalVisible, modalShow} = useContext(AppContext);
    const {addingFieldType, changeLogin, changeValue, changeTitle, changeType, beforeModalOpen} =
        useContext(EntryFieldContext);
    const {databaseMode} = useContext(UserApplicationContext);

    const disableButtons = databaseMode === DATABASE_MODE_OFFLINE;
    const buttonColor = disableButtons ? 'bg-gray-500' : 'bg-slate-800';

    useEffect(() => {
        if (!entryGroupFieldForEditId || modalVisible || entryGroupFieldForEditState !== FIELD_EDITING_EDITING) {
            return;
        }
        let field = null;

        if (entryGroupFieldForEditId !== '') {
            for (let i = 0; i < fields.length; i++) {
                if (fields[i].field_id === entryGroupFieldForEditId) {
                    field = fields[i];
                    break;
                }
            }
        }

        if (!field) {
            return;
        }

        const fieldTypeDefault = field.type;
        const fieldTitleDefault = field.title;
        const fieldLoginDefault = fieldTypeDefault !== FIELD_TYPE_PASSWORD ? '' : field.login;
        const fieldValueDefault = entryGroupFieldForEditDecryptedValue;
        beforeModalOpen();

        if (fieldTypeDefault !== addingFieldType) {
            changeType(fieldTypeDefault);
        }

        changeValue(fieldValueDefault);
        changeTitle(fieldTitleDefault);
        changeLogin(fieldLoginDefault);
        modalShow(
            <EntryFieldEdit
                entryGroupId={entryGroupId}
                entryId={entryId}
                entryTitle={entryTitle}
                setEntryFieldsStatus={setEntryFieldsStatus}
            />,
            {width: 700},
        );
    }, [
        entryGroupFieldForEditState,
        changeValue,
        changeTitle,
        changeLogin,
        addingFieldType,
        changeType,
        entryGroupFieldForEditId,
        entryGroupFieldForEditDecryptedValue,
        modalVisible,
        fields,
        beforeModalOpen,
        modalShow,
        entryGroupId,
        entryId,
        entryTitle,
        setEntryFieldsStatus,
        modalClose,
    ]);

    return (
        <React.Fragment key={entryId + '_fields'}>
            <View style={tw`flex flex-row bg-slate-800`}>
                <Text style={tw`text-slate-100 font-bold px-2 basis-1/6`}>Title</Text>
                <Text style={tw`text-slate-100 font-bold px-2 basis-1/6`}>Type</Text>
                <Text style={tw`text-slate-100 font-bold px-2 basis-3/6`}>Value</Text>
                <Text style={tw`text-slate-100 font-bold px-2 basis-1/6`}>actions</Text>
            </View>

            {fieldComponents}

            <EntryFieldAddButton
                entryGroupId={entryGroupId}
                entryId={entryId}
                entryTitle={entryTitle}
                disabled={disableButtons}
                setEntryFieldsStatus={setEntryFieldsStatus}>
                <View style={tw`flex flex-row m-2`}>
                    <View style={tw`rounded py-2 px-10 ${buttonColor}`}>
                        <Text style={tw`text-slate-200 text-center`}>add new Field</Text>
                    </View>
                </View>
            </EntryFieldAddButton>
        </React.Fragment>
    );
};

export default EntryFields;
