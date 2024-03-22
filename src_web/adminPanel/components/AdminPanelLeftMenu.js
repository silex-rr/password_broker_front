import React, { useState } from 'react';
import AdminPanelLeftMenuNagivation from './AdminPanelLeftMenuNavigation';

const AdminPanelLeftMenu = () => {
    const title = 'Admin panel';
    const [selectedItem, setSelectedItem] = useState(null)

    const buttonStyle = "w-full h-3rem p-2 text-left hover:text-black hover:bg-slate-400"

    const handleSelection = (path) => {
        setSelectedItem(path)
    }

    return (
        <section className="bg-slate-900 flex flex-col portrait:flex-row portrait:w-full">
            <div className="">
                <div className="w-full bg-slate-200 px-3 py-1 text-slate-800">{title}</div>
            </div>
            <ul className="flex flex-col gap-3 portrait:flex-row">
                <button className={buttonStyle} onClick={() => handleSelection('/admin/user_control/')}>
                    <AdminPanelLeftMenuNagivation selectedItem={selectedItem} path={'/admin/user_control/'} name={'User Control'} />
                </button>
                <button className={buttonStyle} onClick={() => handleSelection('/admin/settings/')}>
                    <AdminPanelLeftMenuNagivation selectedItem={selectedItem} path={'/admin/settings/'} name={'Settings'} />
                </button>
                <button className={buttonStyle} onClick={() => handleSelection('/admin/logs/')}>
                    <AdminPanelLeftMenuNagivation selectedItem={selectedItem} path={'/admin/logs/'} name={'Logs'} />
                </button>
                <button className={buttonStyle} onClick={() => handleSelection('/admin/backup/')}>
                    <AdminPanelLeftMenuNagivation selectedItem={selectedItem} path={'/admin/backup/'} name={'Backup'} />
                </button>
            </ul>
        </section>
    );
};

export default AdminPanelLeftMenu;
