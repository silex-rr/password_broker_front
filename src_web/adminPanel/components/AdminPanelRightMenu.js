
const AdminPanelRightMenu = (props) => {
    const head = 'Element list'
    const body = props.children
    return (
        <div className="basis-3/4 p-0 text-slate-100 bg-slate-600">
            <div className="grid grid-rows-3">
                <div className="p-0 row-span-3 text-2xl bg-slate-200 text-slate-700">{head}</div>
                <div className="p-5 row-span-3">
                    {body}
                </div>
            </div>
       </div>
    )
}

export default AdminPanelRightMenu