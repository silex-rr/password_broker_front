
const AdminPanelLeftMenu = () => {
const title = "Admin panel elements"

    return (
        <section className=" bg-slate-900">
            <div className="basis-1/4 text-slate-400 pr-1">
                <div className="w-full bg-slate-200 px-3 text-slate-800 py-1">{title}</div>
            </div>
            <div className="py-5 px-2 relative">
                <a href='/admin/user_control/'>User Control</a>
            </div>
            <div className="py-5 px-2 relative">
                <a href='/admin/settings/'>Settings</a>
            </div>
            <div className="py-5 px-2 relative">
                <a href='/admin/logs/'>Logs</a>
            </div>
        </section>
    )
}

export default AdminPanelLeftMenu