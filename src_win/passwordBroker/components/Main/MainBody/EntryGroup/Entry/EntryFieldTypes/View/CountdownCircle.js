import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native-windows';
import Svg, {Circle} from 'react-native-svg';

const CountdownCircle = ({
    timeLeft,
    timeTotal,
    size: s,
    reactivateId: reactivateId,
    activated = true,
    fromUTime = null,
    onCompleteCallback = () => {},
    colorMain = '#2563eb',
    colorSecond = '#f87171',
    colorNumber = '#2563eb',
    style = {},
}) => {
    const [countdown, setCountdown] = useState(timeLeft);
    const [startedAt, setStartedAt] = useState(fromUTime ?? Date.now());

    const r = (s * 0.4).toFixed(3);
    const percentage = (timeTotal - countdown) / timeTotal;
    const strokeDasharray = Math.ceil(2 * Math.PI * r);
    const strokeDashoffset = strokeDasharray - Math.ceil(strokeDasharray * percentage);

    const getDigitsNum = num => {
        if (num > 99) {
            return 3;
        }
        if (num > 9) {
            return 2;
        }
        return 1;
    };

    const digitsNum = getDigitsNum(countdown);

    useEffect(() => {
        if (!activated) {
            return;
        }
        setCountdown(timeLeft);
        setStartedAt(fromUTime ?? Date.now());
    }, [activated, reactivateId, timeLeft, setCountdown, fromUTime]);

    useEffect(() => {
        if (!activated) {
            return;
        }
        const interval = setInterval(() => {
            const curTime = Date.now();
            const timeElapsed = curTime - startedAt;
            const countdownTmp = timeLeft - timeElapsed;
            if (countdownTmp <= 0) {
                onCompleteCallback();
                return false;
            }
            setCountdown(countdownTmp);
        }, 100);

        return () => clearTimeout(interval);
    }, [activated, countdown, onCompleteCallback, setCountdown, startedAt, timeLeft]);

    if (!activated) {
        return '';
    }

    const cxy = s * 0.5;
    const strokeWidth = s * 0.1;

    const fontSize = r * (3.14 / 2 - 0.2 * digitsNum);

    return (
        <View style={{alignItems: 'center', justifyContent: 'center', width: s, height: s, ...style}}>
            <Text style={{fontSize: fontSize, color: colorNumber, position: 'absolute', fontFamily: 'monospace'}}>
                {Math.round(countdown / 1000)}
            </Text>

            <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{position: 'absolute'}}>
                <Circle cx={cxy} cy={cxy} r={r} strokeWidth={strokeWidth} stroke={colorSecond} fill="transparent" />
                <Circle
                    cx={cxy}
                    cy={cxy}
                    r={r}
                    strokeWidth={strokeWidth}
                    stroke={colorMain}
                    fill="transparent"
                    strokeDasharray={[strokeDashoffset, strokeDasharray]}
                    strokeDashoffset={0}
                    rotation="90"
                    origin={[cxy, cxy]}
                />
            </Svg>
        </View>
    );
};

export default CountdownCircle;
