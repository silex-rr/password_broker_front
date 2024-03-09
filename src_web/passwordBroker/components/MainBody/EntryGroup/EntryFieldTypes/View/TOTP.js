import React, {useEffect, useState} from 'react';
import CopyToClipboard from './CopyToClipboard';
import {TOTP as TOTPJS} from 'jsotp';
import Countdown from './Countdown';

const TOTP = ({value, decryptedValueVisible, totpActivated}) => {
    const [token, setToken] = useState('');

    useEffect(() => {
        if (totpActivated && value) {
            const totp = new TOTPJS(value);
            setToken(totp.now());
            return;
        }
        if (token !== '') {
            setToken('');
        }
    }, [value, totpActivated]);

    return (
        <React.Fragment>
            <div className="basis-1/4">
                <CopyToClipboard className="basis-1/4 px-2" value={token}>
                    <span className={token === '' ? 'hidden' : 'pr-3 text-slate-400'}>token: </span>
                    <span>{token}</span>
                </CopyToClipboard>
                <Countdown seconds={30} left={21} />
            </div>
            <div className="basis-1/4">
                <CopyToClipboard value={decryptedValueVisible ? value : ''}>
                    <span className={decryptedValueVisible ? 'pr-3 text-slate-400' : 'hidden'}>key: </span>
                    <div className="whitespace-pre-line">{decryptedValueVisible ? value : ''}</div>
                </CopyToClipboard>
            </div>
        </React.Fragment>
    );
};

export default TOTP;
