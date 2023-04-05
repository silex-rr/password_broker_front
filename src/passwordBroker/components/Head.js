const Head = (props) => {
    return (
        <header className="bg-slate-700 text-slate-300 px16 w-full flex flex-row justify-between">
            <div className="flex justify-start px-5 py-2">
                <a href="/" className="btn btn-ghost normal-case text-3xl">PasswordBroker</a>
            </div>
            <nav className="flex justify-end px-5">
                <ul className="menu menu-horizontal p-0 font-bold align-middle flex self-center">
                    <li className="px-2"><a href="#">{props.userName}</a></li>
                    <li className="px-2"><a href="/identity/logout">logout</a></li>
                </ul>
            </nav>
        </header>
    )
}

export default Head