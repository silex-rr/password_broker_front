import Moment from 'react-moment';
import axios from 'axios';
import React, {useContext, useEffect} from 'react';
import PasswordBrokerContext from '../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import {
    ENTRY_GROUP_ENTRY_FIELDS_LOADED,
    ENTRY_GROUP_ENTRY_FIELDS_LOADING,
    ENTRY_GROUP_ENTRY_FIELDS_NOT_LOADED,
    ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING,
} from '../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldsStatus';
import EntryFields from './EntryFields';
import EntryContext from '../../../../../src_shared/passwordBroker/contexts/EntryContext';
import {
    FIELD_EDITING_AWAIT,
    FIELD_EDITING_MODAL_SHOULD_BE_CLOSE,
} from '../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldEditingStates';

const Entry = props => {
    const entryGroupId = props.entry_group_id;
    const entryId = props.entry_id;

    const {baseUrl, entryGroupFieldForEditState, setEntryGroupFieldForEditState} = useContext(PasswordBrokerContext);

    const entryContext = useContext(EntryContext);

    const {
        entryFieldsStatus,
        setEntryFieldsStatus,
        entryFieldsData,
        setEntryFieldsData,
        entryFieldsIsVisible,
        setEntryFieldVisible,
    } = entryContext;

    useEffect(() => {
        if (entryGroupFieldForEditState === FIELD_EDITING_MODAL_SHOULD_BE_CLOSE) {
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
        entryGroupFieldForEditState,
        setEntryGroupFieldForEditState,
    ]);

    const EntryFieldsVisibility = () => {
        if (entryFieldsStatus === ENTRY_GROUP_ENTRY_FIELDS_NOT_LOADED) {
            setEntryFieldsStatus(ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING);
        }
        setEntryFieldVisible(!entryFieldsIsVisible);
    };

    let entryFields = '';

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
            entryFields = <div className="w-full bg-slate-500 p-2 text-center">Loading...</div>;
            break;
    }

    return (
        <React.Fragment>
            <tr key={entryId + '_main'}>
                <td className="cursor-pointer bg-slate-700 text-slate-100" onClick={EntryFieldsVisibility}>
                    {props.title}
                </td>
                <td className="bg-slate-700 text-slate-100">
                    <Moment format="YYYY.MM.DD HH:mm">{props.created_at}</Moment>
                </td>
                <td className="bg-slate-700 text-slate-100">
                    <Moment format="YYYY.MM.DD HH:mm">{props.updated_at}</Moment>
                </td>
            </tr>
            <tr key={entryId + '_fields'} className={entryFieldsIsVisible ? '' : 'hidden'}>
                <td colSpan="4" className="bg-slate-700 px-0 pt-0 text-slate-100">
                    {entryFields}
                </td>
            </tr>
        </React.Fragment>
    );
};

export default Entry;
