import React, {useState} from 'react';
import Moment from 'react-moment';

const SearchResultEntry = ({
    entry_id,
    entry_group_id,
    title,
    created_at,
    updated_at,
    deleted_at,
    passwords,
    links,
    notes,
    files,
    entry_group,
}) => {
    const [entryFieldsIsVisible, setEntryFieldsIsVisible] = useState(false);

    const EntryFieldsVisibilityHandler = () => {};

    return (
        <React.Fragment>
            <tr key={entry_id + '_main'}>
                <td className="cursor-pointer bg-slate-700 text-slate-100" onClick={EntryFieldsVisibilityHandler}>
                    {title}
                </td>
                <td className="bg-slate-700 text-slate-100">
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
                <td colSpan="4" className="bg-slate-700 px-0 pt-0 text-slate-100" />
            </tr>
        </React.Fragment>
    );
};

export default SearchResultEntry;
