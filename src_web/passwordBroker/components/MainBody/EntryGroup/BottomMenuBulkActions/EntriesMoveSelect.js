import React, {useRef} from 'react';

const EntriesMoveSelect = ({lvl, groups, setTargetGroup, targetGroupPath, setTargetGroupPath, parentSelect}) => {
    const selectedGroupId = targetGroupPath[lvl] ?? null;
    const selectedGroup = groups.find(group => group.entry_group_id === selectedGroupId);
    const selectRef = useRef(undefined);

    const changeHandler = e => {
        const groupId = e.target.value;
        if (selectedGroupId) {
            targetGroupPath = targetGroupPath.splice(lvl);
        }
        if (groupId === '') {
            if (parentSelect) {
                const event = new Event('change', {bubbles: true});
                parentSelect.current.dispatchEvent(event);
            }
            return;
        }
        const group = groups.find(group => group.entry_group_id === groupId);
        targetGroupPath[lvl] = groupId;
        setTargetGroup(group);
        setTargetGroupPath(targetGroupPath);
    };

    return (
        <React.Fragment>
            <select
                ref={selectRef}
                className="select select-bordered select-xs min-w-28 rounded-none bg-slate-800 text-slate-100"
                defaultValue={selectedGroupId}
                onChange={changeHandler}>
                <option></option>
                {groups.map(group => (
                    <option key={group.entry_group_id} value={group.entry_group_id}>
                        {group.title}
                    </option>
                ))}
            </select>
            {selectedGroup && selectedGroup.children.length > 0 && (
                <EntriesMoveSelect
                    lvl={lvl + 1}
                    groups={selectedGroup.children}
                    setTargetGroup={setTargetGroup}
                    setTargetGroupPath={setTargetGroupPath}
                    targetGroupPath={targetGroupPath}
                    parentSelect={selectRef}
                />
            )}
        </React.Fragment>
    );
};

export default EntriesMoveSelect;
