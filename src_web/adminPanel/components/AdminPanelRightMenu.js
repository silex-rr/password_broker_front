import React from 'react';
const AdminPanelRightMenu = props => {
    const head = 'User list';
    const body = props.children;
    return (
        // <div className="basis-3/4 bg-slate-600 p-0 text-slate-100">
        <React.Fragment>
            <div className="grid grid-rows-3">
                <div className="row-span-3 bg-slate-200 pl-2 text-2xl text-slate-700">{head}</div>
                <div className="row-span-3 p-5">{body}</div>
            </div>
        </React.Fragment>

        // </div>
    );
};

export default AdminPanelRightMenu;
