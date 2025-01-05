import React, {useContext, useRef, useState} from 'react';
import PasswordBrokerContext from '../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import EntryFieldHistory from './EntryFieldHistory';
import EntryGroupContext from '../../../../../src_shared/passwordBroker/contexts/EntryGroupContext';

const EntryField = props => {
    const fieldId = props.field_id;
    const entryId = props.entry_id;
    const type = props.type;
    const title = props.title;
    const entryGroupId = props.entry_group_id;
    const hideEdit = props.hideEdit;

    const [decryptedValue, setDecryptedValue] = useState('');
    const [decryptedValueVisible, setDecryptedValueVisible] = useState(false);
    const [buttonLoading, setButtonLoading] = useState('');
    const [historyVisible, setHistoryVisible] = useState(false);
    const [trashed, setTrashed] = useState(false);
    const [totpActivated, setTotpActivated] = useState(false);
    const deleteFieldModalRef = useRef(undefined);

    //,

    const passwordBrokerContext = useContext(PasswordBrokerContext);
    const {baseUrl} = passwordBrokerContext;

    const entryGroupContext = useContext(EntryGroupContext);
    const {loadEntryFieldValueAndButtons} = entryGroupContext;

    const {value, buttons} = loadEntryFieldValueAndButtons(
        baseUrl + '/entryGroups/' + entryGroupId + '/entries/' + entryId + '/fields/' + fieldId,
        {
            decryptedValue,
            setDecryptedValue,
            decryptedValueVisible,
            setDecryptedValueVisible,
            buttonLoading,
            setButtonLoading,
            historyVisible,
            setHistoryVisible,
            trashed,
            setTrashed,
            totpActivated,
            setTotpActivated,
            deleteFieldModalRef,
        },
        props,
        hideEdit,
    );

    return (
        <React.Fragment key={fieldId}>
            <div
                className={
                    'flex w-full flex-row items-baseline bg-slate-500 px-2 hover:bg-slate-600' +
                    (trashed ? ' hidden' : '')
                }>
                <div className="basis-1/6 px-2">{title}</div>
                <div className="basis-1/6 px-2">{type}</div>
                {value}
                <div className="flex basis-1/6 justify-end px-2 py-1">{buttons}</div>
            </div>
            <EntryFieldHistory fieldProps={props} historyVisible={historyVisible} />
        </React.Fragment>
    );
};
export default EntryField;
