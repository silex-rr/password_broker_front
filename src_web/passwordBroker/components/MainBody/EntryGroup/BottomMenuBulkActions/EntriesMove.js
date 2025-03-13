import React, {useContext, useEffect, useState} from 'react';
import PasswordBrokerContext from '../../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import EntriesMoveSelect from './EntriesMoveSelect';
import {ROLE_CAN_EDIT} from '../../../../../../src_shared/passwordBroker/constants/EntryGroupRole';
import EntryBulkEditContext from '../../../../../../src_shared/passwordBroker/contexts/EntryBulkEditContext';

const EntriesMove = () => {
    const {entryGroupTrees} = useContext(PasswordBrokerContext);
    const {moveEntries, checkedEntries} = useContext(EntryBulkEditContext);
    const [targetGroup, setTargetGroup] = useState(null);
    const [targetGroupPath, setTargetGroupPath] = useState([]);
    const [entriesNum, setEntriesNum] = useState(checkedEntries.length);

    const canMove = targetGroup && ROLE_CAN_EDIT.includes(targetGroup.role);

    useEffect(() => {
        const currentEntriesNum = checkedEntries.length;
        if (currentEntriesNum !== entriesNum) {
            setEntriesNum(currentEntriesNum);
        }
    }, [checkedEntries.length]);

    const moveButtonClickHandler = () => {
        moveEntries(targetGroup);
    };

    if (entriesNum === 0) {
        return 'Use the checkboxes to select entries to delete';
    }

    return (
        <div>
            <label className="mr-2">Move to:</label>
            <EntriesMoveSelect
                lvl={0}
                groups={entryGroupTrees}
                setTargetGroup={setTargetGroup}
                targetGroupPath={targetGroupPath}
                setTargetGroupPath={setTargetGroupPath}
            />
            {targetGroup && (
                <div className="items-center py-1.5">
                    Target group: <span className="font-bold">{targetGroup.title}</span>
                    {canMove ? (
                        <button
                            className="btn btn-xs ml-2 bg-slate-800 px-12 text-slate-100 hover:text-slate-200"
                            onClick={moveButtonClickHandler}>
                            Move
                        </button>
                    ) : (
                        <span>You don&apos;t have permission to move to that group</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default EntriesMove;
