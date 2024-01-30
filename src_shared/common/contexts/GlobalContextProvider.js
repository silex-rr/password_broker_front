import React, {useState} from 'react';
import GlobalContext from './GlobalContext';
import moment from 'moment';
const GlobalContextProvider = props => {
    const [activityLog, setActivityLog] = useState([]);
    const logActivity = activity => {
        setActivityLog([activity, ...activityLog.slice(0, 20)]);
    };
    const logActivityManual = body => {
        logActivity({
            time: moment().format('HH:mm:ss'),
            body: body,
        });
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
