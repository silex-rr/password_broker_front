import React, {useContext} from 'react';
import {
    FIELD_TYPE_FILE,
    FIELD_TYPE_LINK,
    FIELD_TYPE_NOTE,
    FIELD_TYPE_PASSWORD,
} from '../../../../../../../src_shared/passwordBroker/constants/MainBodyEntryGroupEntryFieldTypes';

// eslint-disable-next-line max-len
import {FIELD_ADDING_IN_PROGRESS} from '../../../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldAddingStates';
import EntryFieldContext from '../../../../../../../src_shared/passwordBroker/contexts/EntryFieldContext';
import PasswordBrokerContext from '../../../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';

// eslint-disable-next-line max-len
import {ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING} from '../../../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldsStatus';
import {ActivityIndicator, Pressable, Text, TextInput, View} from 'react-native-windows';
import tw from 'twrnc';
import {Picker} from '@react-native-picker/picker';
// import WebView from "react-native-webview";
import AppContext from '../../../../../../AppContext';
import Password from './EntryFieldTypes/Edit/Password';
import Note from './EntryFieldTypes/Edit/Note';
import Link from './EntryFieldTypes/Edit/Link';
import File from './EntryFieldTypes/Edit/File';
// import * as DocumentPicker from "react-native-document-picker";

const EntryFieldAdd = ({entryGroupId, entryId, entryTitle, setEntryFieldsStatus}) => {
    const {modalClose} = useContext(AppContext);
    const {masterPassword} = useContext(PasswordBrokerContext); //passwordBrokerContext

    const {
        addNewField,
        addingFieldType,
        changeLogin,
        addingFieldLogin,
        changeValue,
        addingFieldValue,
        masterPasswordInput,
        changeMasterPassword,
        addingFieldTitle,
        changeTitle,
        changeType,
        addingFieldState,
        errorMessage,
    } = useContext(EntryFieldContext);

    let value = '';

    switch (addingFieldType) {
        default:
            break;
        case FIELD_TYPE_PASSWORD:
            value = (
                <Password
                    entryId={entryId}
                    fieldLogin={addingFieldLogin}
                    fieldValue={addingFieldValue}
                    changeLogin={changeLogin}
                    changeValue={changeValue}
                />
            );
            break;
        case FIELD_TYPE_NOTE:
            value = <Note fieldValue={addingFieldValue} changeValue={changeValue} />;
            break;
        case FIELD_TYPE_LINK:
            value = <Link entryId={entryId} fieldValue={addingFieldValue} changeValue={changeValue} />;
            break;
        case FIELD_TYPE_FILE:
            value = <File entryId={entryId} fieldValue={addingFieldValue} changeValue={changeValue} />;
            break;
    }
    const sendFormHandler = () => {
        addNewField(entryGroupId, entryId).then(
            () => {
                setEntryFieldsStatus(ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING);
                modalClose();
            },
            error => {
                console.log(error);
            },
        );
    };

    let masterPasswordField = '';

    if (masterPassword === '') {
        masterPasswordField = (
            <View style={tw`flex flex-row py-1.5 items-center`}>
                <Text style={tw`inline-block basis-1/3 text-xl align-middle text`}>MasterPassword:</Text>
                <TextInput
                    secureTextEntry={true}
                    value={masterPasswordInput}
                    onChangeText={changeMasterPassword}
                    placeholder="type your master password"
                    style={tw`basis-2/3 bg-slate-800 text-slate-200 `}
                />
            </View>
        );
    }

    const addButtonStyle = {
        ...tw`rounded py-2 px-10 w-1/3`,
        backgroundColor: '#36d399',
    };
    return (
        <View style={tw`px-2 pb-2 w-full`}>
            <Text style={tw`text-lg font-bold`}>Adding new field for entry "{entryTitle}"</Text>
            <View style={tw`py-4`}>
                <View style={tw`flex flex-row py-1.5 items-center`}>
                    <Text htmlFor={'add-field-for-' + entryId + '-title'} style={tw`inline-block basis-1/3 text-lg`}>
                        Field Title:
                    </Text>
                    <TextInput
                        id={'add-field-for-' + entryId + '-title'}
                        value={addingFieldTitle}
                        onChangeText={changeTitle}
                        placeholder="type title for new field"
                        style={tw`basis-2/3 bg-slate-800 text-slate-200 `}
                    />
                </View>
                <View style={tw`flex flex-row py-1.5 items-center`}>
                    <Text htmlFor={'add-field-for-' + entryId + '-type'} style={tw`inline-block basis-1/3 text-lg`}>
                        Field Type:
                    </Text>
                    <Picker
                        id={'add-field-for-' + entryId + '-type'}
                        // ref={modalFieldTypeSelectorRef}
                        style={tw`basis-2/3 bg-slate-800 text-slate-200`}
                        selectedValue={addingFieldType}
                        onValueChange={changeType}>
                        <Picker.Item value={FIELD_TYPE_PASSWORD} label={FIELD_TYPE_PASSWORD} />
                        <Picker.Item value={FIELD_TYPE_LINK} label={FIELD_TYPE_LINK} />
                        <Picker.Item value={FIELD_TYPE_NOTE} label={FIELD_TYPE_NOTE} />
                        <Picker.Item value={FIELD_TYPE_FILE} label={FIELD_TYPE_FILE} />
                    </Picker>
                </View>

                {value}

                {masterPasswordField}

                <View style={tw`flex flex-row justify-around w-full mt-12`}>
                    <Pressable onPress={sendFormHandler} style={addButtonStyle}>
                        <View>
                            {addingFieldState !== FIELD_ADDING_IN_PROGRESS ? (
                                <Text style={tw`text-slate-700 text-center w-full font-bold`}>ADD</Text>
                            ) : (
                                <ActivityIndicator size="small" color="#e2e8f0" />
                            )}
                        </View>
                    </Pressable>
                    <Pressable onPress={modalClose} style={tw`rounded py-2 px-10 border border-red-400 w-1/3`}>
                        <Text style={tw`text-red-400 text-center w-full`}>CLOSE</Text>
                    </Pressable>
                </View>
                {errorMessage.length === 0 ? (
                    ''
                ) : (
                    <View style={tw`flex w-full bg-red-700 text-slate-100 text-center mt-8 py-1.5`}>
                        <Text style={tw`text-slate-100 text-center`}>{errorMessage}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default EntryFieldAdd;
