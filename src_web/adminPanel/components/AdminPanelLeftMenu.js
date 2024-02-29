import AdminPanelLeftMenuNagivation from './AdminPanelLeftMenuNavigation';

const AdminPanelLeftMenu = () => {
    const title = 'Admin panel';
    const buttonStyle = "w-full p-2 text-left hover:text-black hover:bg-slate-400"

    return (
        <section className="bg-slate-900 flex flex-col portrait:flex-row portrait:w-full">
            <div className="">
                <div className="w-full bg-slate-200 px-3 py-1 text-slate-800">{title}</div>
            </div>
            <ul className="flex flex-col gap-3 portrait:flex-row">
                <button className={buttonStyle}>
                    <AdminPanelLeftMenuNagivation path={'/admin/user_control/'} name={'User Control'} />
                </button>
                <button className={buttonStyle}>
                    <AdminPanelLeftMenuNagivation path={'/admin/settings/'} name={'Settings'} />
                </button>
                <button className={buttonStyle}>
                    <AdminPanelLeftMenuNagivation path={'/admin/logs/'} name={'Logs'} />
                </button>
                <button className={buttonStyle}>
                    <AdminPanelLeftMenuNagivation path={'/admin/backup/'} name={'Backup'} />
                </button>
            </ul>
        </section>
    );
};

export default AdminPanelLeftMenu;
