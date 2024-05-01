import React from 'react';
import {ClockLoader} from 'react-spinners';
import {FaCopy, FaDownload, FaEdit, FaHistory, FaRegEye, FaRegEyeSlash, FaTrashAlt} from 'react-icons/fa';
import {IoTimerOutline} from 'react-icons/io5';

const EntryFieldButton = ({icon, onclick, tip, colour = '', loading = false}) => {
    let iconElement = <span />;

    colour = colour === '' ? '#f1f5f9' : colour;

    switch (icon) {
        case 'FaCopy':
            iconElement = <FaCopy color={colour} />;
            break;
        case 'FaDownload':
            iconElement = <FaDownload color={colour} />;
            break;
        case 'FaEdit':
            iconElement = <FaEdit color={colour} />;
            break;
        case 'FaHistory':
            iconElement = <FaHistory color={colour} />;
            break;
        case 'FaRegEye':
            iconElement = <FaRegEye color={colour} />;
            break;
        case 'FaRegEyeSlash':
            iconElement = <FaRegEyeSlash color={colour} />;
            break;
        case 'FaTrashAlt':
            iconElement = <FaTrashAlt color={colour} />;
            break;
        case 'IoTimerOutline':
            iconElement = <IoTimerOutline color={colour} />;
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

    return (
        <button
            className={' tooltip tooltip-left ml-2 w-7 items-baseline  text-2xl focus:outline-none'}
            onClick={onclick}
            data-tip={tip}>
            {iconElement}
        </button>
    );
};

export default EntryFieldButton;
