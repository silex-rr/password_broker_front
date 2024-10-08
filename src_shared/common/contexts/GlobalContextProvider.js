import React, {useState} from 'react';
import GlobalContext from './GlobalContext';
import moment from 'moment';
import {toast} from 'react-toastify';

const GlobalContextProvider = props => {
    const [activityLog, setActivityLog] = useState([]);
    const logActivity = activity => {
        setActivityLog(prevActivityLog => [activity, ...prevActivityLog.slice(0, 20)]);
    };
    const logActivityManual = body => {
        const time = moment().format('HH:mm:ss');
        logActivity({
            time: time,
            body: body,
        });

        toast(body);
    };

    return (
        <GlobalContext.Provider
            value={{
                activityLog: activityLog,
                logActivity: logActivity,
                logActivityManual: logActivityManual,
            }}>
            {props.children}
        </GlobalContext.Provider>
    );
};

export default GlobalContextProvider;
