import React, {useEffect, useRef} from 'react';

const Countdown = ({left, seconds}) => {
    // const [timeLeft, setTimeLeft] = useState(seconds);
    const circleTimeLeft = useRef(undefined);

    const percentage = l => ((seconds - l) / seconds) * 100;
    const getStrokeDashoffset = p => Math.ceil(283 - (283 * p) / 100);

    useEffect(() => {
        if (!left) {
            return;
        }

        const intervalId = setInterval(() => {
            if (!left) {
                return false;
            }
            left -= 1;
            circleTimeLeft.current.setAttribute('stroke-dashoffset', getStrokeDashoffset(percentage(left)));
            console.log(left, getStrokeDashoffset(percentage(left)), circleTimeLeft.current.getAttribute('stroke-dashoffset'));
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <svg width="1em" height="1em">
            <circle cx="0.5em" cy="0.5em" r="0.45em" stroke="blue" strokeWidth="0.1em" fill="transparent" />
            <circle
                ref={circleTimeLeft}
                cx="0.5em"
                cy="0.5em"
                r="0.45em"
                stroke="orange"
                strokeWidth="0.1em"
                fill="transparent"
                strokeDasharray="283"
                strokeDashoffset="100"
                style={{transition: 'stroke-dashoffset 1s linear'}}
            />
        </svg>
    );
};

export default Countdown;
