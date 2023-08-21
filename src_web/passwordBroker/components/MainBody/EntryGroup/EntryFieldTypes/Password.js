import React from "react";

const Password = ({login, value}) => {
    return (
        <React.Fragment>
            <div className="px-2 basis-1/4">
                <span className="text-slate-400 pr-3" >login: </span>
                <span>
                   {login}
                </span>
            </div>
            <div className="px-2 basis-1/4">
                <span className={value === '' ? "hidden" : "text-slate-400 pr-3"}>password: </span>
                <span>
                    {value}
                </span>
            </div>
        </React.Fragment>
    )
}

export default Password