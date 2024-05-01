import React, {useContext} from 'react';
import {
    FIELD_TYPE_FILE,
    FIELD_TYPE_LINK,
    FIELD_TYPE_NOTE,
    FIELD_TYPE_PASSWORD,
    FIELD_TYPE_TOTP,
} from '../../../../../../../src_shared/passwordBroker/constants/MainBodyEntryGroupEntryFieldTypes';
import PasswordBrokerContext from '../../../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';

import {
    FIELD_EDITING_AWAIT,
    FIELD_EDITING_IN_PROGRESS,
} from '../../../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldEditingStates';
import EntryFieldContext from '../../../../../../../src_shared/passwordBroker/contexts/EntryFieldContext';
import Password from './EntryFieldTypes/Edit/Password';
import Note from './EntryFieldTypes/Edit/Note';
import Link from './EntryFieldTypes/Edit/Link';
import TOTP from './EntryFieldTypes/Edit/TOTP';
import {ActivityIndicator, Pressable, Text, TextInput, View} from 'react-native-windows';
import tw from 'twrnc';
import AppContext from '../../../../../../AppContext';

const EntryFieldEdit = ({setEntryFieldsStatus, entryGroupId, entryId, entryTitle}) => {
    const passwordBrokerContext = useContext(PasswordBrokerContext);
    const {modalClose} = useContext(AppContext);
    const {entryGroupFieldForEditId, entryGroupFieldForEditState, setEntryGroupFieldForEditState} =
        passwordBrokerContext;
    const {
        updateField,
        addingFieldType,
        changeLogin,
        addingFieldLogin,
        changeValue,
        addingFieldValue,
        addingFieldTitle,
        changeTitle,
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
            break;
        case FIELD_TYPE_TOTP:
            value = <TOTP entryId={entryId} fieldValue={addingFieldValue} changeValue={changeValue} />;
            break;
    }

    const saveClickHandler = () => {
        updateField(entryGroupId, entryId, entryGroupFieldForEditId, setEntryFieldsStatus);
    };

    const closeClickHandler = () => {
        setEntryGroupFieldForEditState(FIELD_EDITING_AWAIT);
        modalClose();
    };

    const addButtonStyle = {
        ...tw`rounded py-2 px-10 w-1/3`,
        backgroundColor: '#36d399',
    };

    return (
        <View style={tw`px-2 pb-2 w-full`}>
            <Text style={tw`text-lg font-bold`}>
                Editing field {addingFieldType} "{addingFieldTitle}" for entry "{entryTitle}"
            </Text>
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

                {value}

                <View style={tw`flex flex-row justify-around w-full mt-12`}>
                    <Pressable onPress={saveClickHandler} style={addButtonStyle}>
                        <View>
                            {entryGroupFieldForEditState !== FIELD_EDITING_IN_PROGRESS ? (
                                <Text style={tw`text-slate-700 text-center w-full font-bold`}>SAVE CHANGES</Text>
                            ) : (
                                <ActivityIndicator size="small" color="#e2e8f0" />
                            )}
                        </View>
                    </Pressable>
                    <Pressable onPress={closeClickHandler} style={tw`rounded py-2 px-10 border border-red-400 w-1/3`}>
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
    //
    //
    // (
    //     <div className="px-2 pb-2">
    //         <input
    //             type="checkbox"
    //             id="entryFieldEditModal"
    //             className="modal-toggle"
    //             ref={modalVisibilityRef}
    //             onChange={openModal}
    //         />
    //         <label htmlFor="entryFieldEditModal" className="modal cursor-pointer">
    //             <label className="modal-box relative w-1/3 max-w-none bg-slate-700" htmlFor="">
    //                 <h3 className="text-lg font-bold">
    //                     Editing field "{fieldTitleDefault}" for entry "{entryTitle}"
    //                 </h3>
    //                 <div className="py-4">
    //                     <div className="flex flex-row items-center py-1.5">
    //                         <label
    //                             htmlFor={'edit-field-for-' + entryId + '-title'}
    //                             className="inline-block basis-1/3 text-lg">
    //                             Field Title:
    //                         </label>
    //                         <Input
    //                             id={'edit-field-for-' + entryId + '-title'}
    //                             type="text"
    //                             value={addingFieldTitle}
    //                             onChange={e => changeTitle(e.target.value)}
    //                             placeholder={fieldTitleDefault}
    //                             className={
    //                                 'input-bordered input-sm basis-2/3 bg-slate-800 text-slate-200 ' +
    //                                 ''
    //                             }
    //                         />
    //                     </div>
    //
    //                     {value}
    //
    //                     <div className="modal-action flex flex-row justify-around">
    //                         <Button
    //                             className={
    //                                 'btn-success btn-sm basis-1/3' +
    //                                 (entryGroupFieldForEditState === FIELD_EDITING_IN_PROGRESS ? ' loading' : '')
    //                             }
    //                             onClick={saveClickHandler}>
    //                             {entryGroupFieldForEditState === FIELD_EDITING_EDITING ? 'save changes' : ''}
    //                         </Button>
    //
    //                         <label
    //                             htmlFor="entryFieldEditModal"
    //                             className="btn btn-error btn-outline btn-sm right-0 basis-1/3">
    //                             close
    //                         </label>
    //                     </div>
    //                     {errorMessage.length === 0 ? (
    //                         ''
    //                     ) : (
    //                         <div className="mt-8 w-full bg-red-700 py-1.5 text-center text-slate-100">
    //                             {errorMessage}
    //                         </div>
    //                     )}
    //                 </div>
    //             </label>
    //         </label>
    //     </div>
    // );
};

export default EntryFieldEdit;
