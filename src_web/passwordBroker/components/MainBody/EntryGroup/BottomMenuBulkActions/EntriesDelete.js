import React, {useContext, useEffect, useState} from 'react';
import EntryBulkEditContext from '../../../../../../src_shared/passwordBroker/contexts/EntryBulkEditContext';

const EntriesDelete = () => {
    const {deleteEntries, checkedEntries} = useContext(EntryBulkEditContext);
    const [entriesNum, setEntriesNum] = useState(checkedEntries.length);

    useEffect(() => {
        const currentEntriesNum = checkedEntries.length;
        if (currentEntriesNum !== entriesNum) {
            setEntriesNum(currentEntriesNum);
        }
    }, [checkedEntries.length]);

    if (entriesNum === 0) {
        return 'Use the checkboxes to select entries to delete';
    }

    return (
        <React.Fragment>
            <div>
                Are you sure you want to delete {entriesNum} Entries?
                <button
                    className="btn btn-xs ml-2 bg-slate-800 px-12 text-slate-100 hover:text-slate-200"
                    onClick={deleteEntries}
                    disabled={entriesNum === 0}>
                    Delete
                </button>
            </div>
        </React.Fragment>
    );
};

export default EntriesDelete;
