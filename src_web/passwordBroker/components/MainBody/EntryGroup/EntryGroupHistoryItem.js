import Moment from 'react-moment';
import React, {useContext, useState} from 'react';
import PasswordBrokerContext from '../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import EntryGroupContext from '../../../../../src_shared/passwordBroker/contexts/EntryGroupContext';

const EntryGroupHistoryItem = data => {
    const entryId = data.field.entry_id;
    const entryTitle = data.field.entry.title;

    const fieldId = data.field_id;
    const fieldTitle = data.field.title;
    const fieldType = data.field.type;
    const fieldEditLogId = data.field_edit_log_id;

    const [decryptedValue, setDecryptedValue] = useState('');
    const [decryptedValueVisible, setDecryptedValueVisible] = useState(false);
    const [buttonLoading, setButtonLoading] = useState('');
    const [historyVisible, setHistoryVisible] = useState(false);

    const passwordBrokerContext = useContext(PasswordBrokerContext);
    const {baseUrl, entryGroupId} = passwordBrokerContext;

    const entryGroupContext = useContext(EntryGroupContext);
    const {loadEntryFieldValueAndButtons} = entryGroupContext;

    const {value, buttons} = loadEntryFieldValueAndButtons(
        baseUrl +
            '/entryGroups/' +
            entryGroupId +
            '/entries/' +
            entryId +
            '/fields/' +
            fieldId +
            '/history/' +
            fieldEditLogId,
        {
            decryptedValue,
            setDecryptedValue,
            decryptedValueVisible,
            setDecryptedValueVisible,
            buttonLoading,
            setButtonLoading,
            historyVisible,
            setHistoryVisible,
        },
        data.field,
        true,
    );

    return (
        <tr key={fieldEditLogId}>
            <td className="bg-slate-700 text-slate-100">{entryTitle}</td>
            <td className="bg-slate-700 text-slate-100">{fieldTitle}</td>
            <td className="bg-slate-700 text-slate-100">{fieldType}</td>
            <td className="bg-slate-700 text-slate-100">{data.event_type}</td>
            <td className="bg-slate-700 text-slate-100">{data.user.name}</td>
            <td className="bg-slate-700 text-slate-100">
                <Moment format="YYYY.MM.DD HH:mm">{data.created_at}</Moment>
            </td>
            <td className="bg-slate-700 text-slate-100">{value}</td>
            <td className="bg-slate-700 text-slate-100">{buttons}</td>
        </tr>
    );
};

export default EntryGroupHistoryItem;
