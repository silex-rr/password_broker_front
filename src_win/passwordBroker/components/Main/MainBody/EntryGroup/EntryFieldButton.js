import React from "react";
import {ClockLoader} from "react-spinners";
import {FaCopy, FaDownload, FaEdit, FaHistory, FaRegEye, FaRegEyeSlash, FaTrashAlt} from "react-icons/fa";

const EntryFieldButton = ({iconName, onclick, tip, colour = '', loading = false}) => {

    let icon = (<span></span>)

    switch (iconName) {
        case 'FaCopy':
            icon = <FaCopy/>
            break;
        case 'FaDownload':
            icon = <FaDownload/>
            break;
        case 'FaEdit':
            icon = <FaEdit/>
            break;
        case 'FaHistory':
            icon = <FaHistory/>
            break;
        case 'FaRegEye':
            icon = <FaRegEye/>
            break;
        case 'FaRegEyeSlash':
            icon = <FaRegEyeSlash/>
            break;
        case 'FaTrashAlt':
            icon = <FaTrashAlt/>
            break;
    }

    if (loading) {
        const color = "#e2e8f0"
        return (
            <div className="ml-2 w-7 items-baseline pt-0.5">
                <ClockLoader
                    color={color}
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    speedMultiplier={1}
                />
            </div>
        )
    }
    colour = colour === '' ? 'text-slate-100' : colour
    return (
        <button
            className={colour + ' text-2xl focus:outline-none ml-2 w-7 items-baseline  tooltip tooltip-left'}
            onClick={onclick}
            data-tip={tip}
        >
            {icon}
        </button>
    )
}

export default EntryFieldButton