import React, {useEffect, useState} from 'react';
import CopyToClipboard from './CopyToClipboard';
import {TOTP as TOTPJS} from 'jsotp';

const TOTP = ({value}) => {
    const [token, setToken] = useState('');

    useEffect(() => {
        if (value) {
            const totp = new TOTPJS(value);
            setToken(totp.now());
            console.log(token);
        }
    }, [value]);

    return (
        <div className="col-span-3 basis-1/2 px-2">
            <CopyToClipboard value={value}>
                <div className="whitespace-pre-line">{value}</div>
            </CopyToClipboard>
            <CopyToClipboard>{token}</CopyToClipboard>
        </div>
    );
};

export default TOTP;
