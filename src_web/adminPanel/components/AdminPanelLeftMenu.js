import AdminPanelLeftMenuNagivation from "./AdminPanelLeftMenuNavigation"

const AdminPanelLeftMenu = () => {
    const title = "Admin panel elements"

    return (
        <section className=" bg-slate-900">
            <div className="basis-1/4 text-slate-400 pr-1">
                <div className="w-full bg-slate-200 px-3 text-slate-800 py-1">{title}</div>
            </div>
            <ul className="menu">
                <li className="py-2 px-2 relative">
                    <AdminPanelLeftMenuNagivation path={'/admin/user_control/'} name={'User Control'}/>
                </li>
                <li className="py-2 px-2 relative">
                    <AdminPanelLeftMenuNagivation path={'/admin/settings/'} name={'Settings'} />
                </li>
                <li className="py-2 px-2 relative">
                    <AdminPanelLeftMenuNagivation path={'/admin/logs/'} name={'Logs'} />
                </li>
            </ul>
        </section>
    )
}

export default AdminPanelLeftMenu