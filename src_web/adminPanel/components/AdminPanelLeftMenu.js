import AdminPanelLeftMenuNagivation from './AdminPanelLeftMenuNavigation';

const AdminPanelLeftMenu = () => {
    const title = 'Admin panel elements';

    return (
        <section className="bg-slate-900 portrait:w-full">
            <div className="basis-1/4 pr-1 text-slate-400">
                <div className="w-full bg-slate-200 px-3 py-1 text-slate-800">{title}</div>
            </div>
            <ul className="menu flex flex-col portrait:flex-row">
                <li className="relative px-2 py-2">
                    <AdminPanelLeftMenuNagivation path={'/admin/user_control/'} name={'User Control'} />
                </li>
                <li className="relative px-2 py-2">
                    <AdminPanelLeftMenuNagivation path={'/admin/settings/'} name={'Settings'} />
                </li>
                <li className="relative px-2 py-2">
                    <AdminPanelLeftMenuNagivation path={'/admin/logs/'} name={'Logs'} />
                </li>
                <li className='relative px-2 py-2'>
                    <AdminPanelLeftMenuNagivation path={'/admin/backup/'} name={'Backup'} />
                </li>
            </ul>
        </section>
    );
};

export default AdminPanelLeftMenu;
