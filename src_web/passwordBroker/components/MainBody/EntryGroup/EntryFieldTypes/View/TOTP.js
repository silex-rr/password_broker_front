import React, {useEffect, useState} from 'react';
import CopyToClipboard from './CopyToClipboard';
// import {TOTP as TOTPJS} from 'jsotp';
import generatorTOTP from '../../../../../../../src_shared/utils/TOTP';
// const TOTPJS = generatorTOTP();
import {CountdownCircle} from 'react-countdowns-svg';
// eslint-disable-next-line max-len
import {ENTRY_GROUP_ENTRY_FIELD_TOTP_ALGORITHMS_TO_TOTPJS} from '../../../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldTOTPAlgorithms';

const TOTP = ({fieldId, value, decryptedValueVisible, totpActivated, totpHashAlgorithm, totpTimeout, title = ''}) => {
    const [token, setToken] = useState('');
    const [left, setLeft] = useState(0);
    const [fromUTime, setFromUTime] = useState(null);
    const [reactivateCount, setReactivateCount] = useState(0);

    useEffect(() => {
        if (totpActivated && value) {
            const totp = generatorTOTP(
                value,
                totpTimeout,
                ENTRY_GROUP_ENTRY_FIELD_TOTP_ALGORITHMS_TO_TOTPJS[totpHashAlgorithm],
            );
            setToken(totp);
            const date = new Date();
            setFromUTime(Math.floor(Date.now() / 1000));
            setLeft(totpTimeout - (date.getSeconds() % totpTimeout));
            return;
        }
        if (token !== '') {
            setToken('');
        }
    }, [value, totpActivated, reactivateCount]);

    return (
        <React.Fragment>
            <div className="basis-1/4">
                <CopyToClipboard className="basis-1/4 px-2" value={token} message={`TOTP for "${title}" copied`}>
                    <span className={token === '' ? 'hidden' : 'pr-3 text-slate-400'}>token: </span>
                    <span className="-mt-2 px-4 text-lg font-bold tracking-widest">{token}</span>
                    <span key={fieldId + reactivateCount} className="-mt-2 ml-2">
                        <CountdownCircle
                            timeLeft={left}
                            timeTotal={totpTimeout}
                            size={24}
                            activated={totpActivated}
                            fromUTime={fromUTime}
                            onCompleteCallback={() => {
                                if ([30, 59].includes(new Date().getSeconds())) {
                                    setTimeout(() => {
                                        setReactivateCount(v => v + 1);
                                    }, 500);
                                } else {
                                    setReactivateCount(v => v + 1);
                                }
                            }}
                            colorMain="#e2e8f0"
                            colorNumber="#e2e8f0"
                        />
                    </span>
                </CopyToClipboard>
            </div>
            <div className="basis-1/4">
                <CopyToClipboard value={decryptedValueVisible ? value : ''} message={`Key for TOTP "${title}" copied`}>
                    <span className={decryptedValueVisible ? 'pr-3 text-slate-400' : 'hidden'}>key: </span>
                    <div className="whitespace-pre-line">{decryptedValueVisible ? value : ''}</div>
                </CopyToClipboard>
                <div title={decryptedValueVisible ? 'Algorithm' : ''}>
                    <span className={decryptedValueVisible ? 'inline-block pr-3 text-slate-400' : 'hidden'}>alg: </span>
                    <span className="whitespace-pre-line">{decryptedValueVisible ? totpHashAlgorithm : ''}</span>
                </div>
                <div title={decryptedValueVisible ? 'Timeout in seconds' : ''}>
                    <span className={decryptedValueVisible ? 'inline-block pr-3 text-slate-400' : 'hidden'}>
                        timeout:
                    </span>
                    <span className="whitespace-pre-line">{decryptedValueVisible ? totpTimeout : ''}</span>
                </div>
            </div>
        </React.Fragment>
    );
};

export default TOTP;
