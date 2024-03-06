import React from 'react';
import {ClockLoader} from 'react-spinners';
import {FaCopy, FaDownload, FaEdit, FaHistory, FaRegEye, FaRegEyeSlash, FaTrashAlt} from 'react-icons/fa';
import {IoTimerOutline} from 'react-icons/io5';

const EntryFieldButton = ({icon, onclick, tip, colour = '', loading = false}) => {
    let iconElement = <span />;

    switch (icon) {
        case 'FaCopy':
            iconElement = <FaCopy />;
            break;
        case 'FaDownload':
            iconElement = <FaDownload />;
            break;
        case 'FaEdit':
            iconElement = <FaEdit />;
            break;
        case 'FaHistory':
            iconElement = <FaHistory />;
            break;
        case 'FaRegEye':
            iconElement = <FaRegEye />;
            break;
        case 'FaRegEyeSlash':
            iconElement = <FaRegEyeSlash />;
            break;
        case 'FaTrashAlt':
            iconElement = <FaTrashAlt />;
            break;
        case 'IoTimerOutline':
            iconElement = <IoTimerOutline />;
            break;
    }

    if (loading) {
        const color = '#e2e8f0';
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
        );
    }
    colour = colour === '' ? 'text-slate-100' : colour;

    return (
        <button
            className={colour + ' tooltip tooltip-left ml-2 w-7 items-baseline  text-2xl focus:outline-none'}
            onClick={onclick}
            data-tip={tip}>
            {iconElement}
        </button>
    );
};

export default EntryFieldButton;
