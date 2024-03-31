import React, {useEffect, useState} from 'react';
import CopyToClipboard from './CopyToClipboard';
import {TOTP as TOTPJS} from 'jsotp';
import Countdown from './Countdown';

const TOTP = ({fieldId, value, decryptedValueVisible, totpActivated}) => {
    const [token, setToken] = useState('');
    const [left, setLeft] = useState(0);
    const [fromUTime, setFromUTime] = useState(null);
    const [reactivateCount, setReactivateCount] = useState(0);

    useEffect(() => {
        console.log(reactivateCount);
        if (totpActivated && value) {
            const totp = new TOTPJS(value);
            setToken(totp.now());
            const date = new Date();
            setFromUTime(Math.floor(Date.now() / 1000));
            setLeft(30 - (date.getSeconds() % 30));
            return;
        }
        if (token !== '') {
            setToken('');
        }
    }, [value, totpActivated, reactivateCount]);

    return (
        <React.Fragment>
            <div className="basis-1/4">
                <CopyToClipboard className="basis-1/4 px-2" value={token}>
                    <span className={token === '' ? 'hidden' : 'pr-3 text-slate-400'}>token: </span>
                    <span className="-mt-2 px-4 text-lg font-bold tracking-widest">{token}</span>
                    <span key={fieldId + reactivateCount} className="-mt-2 ml-2">
                        <Countdown
                            total={30}
                            left={left}
                            fromUTime={fromUTime}
                            size={24}
                            activated={totpActivated}
                            color="#e2e8f0"
                            numColor="#e2e8f0"
                            finisCallback={() => {
                                if ([30, 59].includes(new Date().getSeconds())) {
                                    setTimeout(() => {
                                        setReactivateCount(v => v + 1);
                                    }, 500);
                                } else {
                                    setReactivateCount(v => v + 1);
                                }
                            }}
                        />
                    </span>
                </CopyToClipboard>
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
