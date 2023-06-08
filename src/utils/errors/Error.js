import React from "react";
import ErrorField from "./ErrorField";

const Error = ({message, errors}) => {
    const errorFields = []

    for (let field in errors) {
        errorFields.push(<ErrorField field={field} problems={errors[field]} />)
    }

    return (
        <React.Fragment>
            <p className="text-center text-xl">{message}</p>
            <div className="text-left text-sm">
                {errorFields}
            </div>
        </React.Fragment>
    )
}

export default Error