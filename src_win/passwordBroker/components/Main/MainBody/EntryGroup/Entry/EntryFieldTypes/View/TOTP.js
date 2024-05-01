import React, {useEffect, useState} from 'react';
import CopyToClipboard from './CopyToClipboard';

import CountdownCircle from './CountdownCircle';
import tw from 'twrnc';
import {Text, View} from 'react-native-windows';
import {TOTP as TOTPJS} from 'jsotp';

const TOTP = ({value, decryptedValueVisible, totpActivated}) => {
    const [token, setToken] = useState('');
    const [left, setLeft] = useState(0);
    const [fromUTime, setFromUTime] = useState(null);
    const [reactivateId, setReactivateId] = useState(0);

    useEffect(() => {
        if (totpActivated && value) {
            const totp = new TOTPJS(value);
            setToken(totp.now());
            const date = new Date();
            setFromUTime(Date.now());
            setLeft(30 - (date.getSeconds() % 30));
            return;
        }
        if (token !== '') {
            setToken('');
        }
    }, [value, totpActivated, reactivateId]);

    return (
        <View style={tw`flex flex-row flex-wrap p-0 m-0`}>
            <CopyToClipboard value={token} style={tw`px-2`}>
                <Text style={tw`pr-3 text-slate-400`}>{token !== '' ? 'token: ' : ''}</Text>
                <Text style={{...tw`w-14 font-bold tracking-widest`, fontFamily: 'monospace'}}>{token}</Text>
            </CopyToClipboard>
            <CountdownCircle
                timeLeft={left * 1000}
                timeTotal={30_000}
                size={24}
                activated={totpActivated}
                fromUTime={fromUTime}
                reactivateId={reactivateId}
                onCompleteCallback={() => {
                    if ([30, 59].includes(new Date().getSeconds())) {
                        setTimeout(() => {
                            setReactivateId(v => v + 1);
                        }, 500);
                    } else {
                        setReactivateId(v => v + 1);
                    }
                }}
                colorMain="#e2e8f0"
                colorNumber="#e2e8f0"
                style={{marginTop: -4}}
            />
            <CopyToClipboard value={value} style={tw`px-2 ${decryptedValueVisible ? '' : 'hidden'}`}>
                <Text style={decryptedValueVisible ? tw`text-slate-400 pr-3` : tw`hidden`}>key: </Text>
                <Text style={decryptedValueVisible ? {} : tw`hidden`}>{value}</Text>
            </CopyToClipboard>
        </View>
    );
};

export default TOTP;
