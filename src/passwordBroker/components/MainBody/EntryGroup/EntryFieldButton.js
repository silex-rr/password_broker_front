import React from "react";
import {ClockLoader} from "react-spinners";

const EntryFieldButton = ({icon, onclick, tip, colour = '', loading = false}) => {
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