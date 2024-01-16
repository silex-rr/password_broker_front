import React, {useContext, useState} from 'react';
import Moment from 'react-moment';
import {MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp} from 'react-icons/md';
import EntryFields from './MainBody/EntryGroup/EntryFields';
import PasswordBrokerContext from '../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';

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

    return (
        <React.Fragment>
            <tr key={entry_id + '_main'}>
                <td className="cursor-pointer bg-slate-700 text-slate-100" onClick={EntryFieldsVisibilityHandler}>
                    <MdKeyboardDoubleArrowDown className={'inline text-xl' + (entryFieldsIsVisible ? ' hidden' : '')} />
                    <MdKeyboardDoubleArrowUp className={'inline text-xl' + (entryFieldsIsVisible ? '' : ' hidden')} />
                    <span className="pl-2">{title}</span>
                </td>
                <td className="cursor-pointer bg-slate-700 text-slate-100" onClick={handleEntryGroupClick}>
                    {entry_group.name}
                </td>
                <td className="bg-slate-700 text-slate-100">
                    <Moment format="YYYY.MM.DD HH:mm">{created_at}</Moment>
                </td>
                <td className="bg-slate-700 text-slate-100">
                    <Moment format="YYYY.MM.DD HH:mm">{updated_at}</Moment>
                </td>
            </tr>
            <tr key={entry_id + '_fields'} className={entryFieldsIsVisible ? '' : 'hidden'}>
                <td colSpan="4" className="bg-slate-700 px-0 pt-0 text-slate-100">
                    <EntryFields
                        entryGroupId={entry_group_id}
                        entryId={entry_id}
                        fields={fields}
                        hideAdd={true}
                        hideEdit={true}
                    />
                </td>
            </tr>
        </React.Fragment>
    );
};

export default SearchResultEntry;
