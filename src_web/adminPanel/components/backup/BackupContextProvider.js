import React, {useContext, useEffect, useState} from 'react';
import BackupContext from './BackupContext';
import Backup from './Backup';
import SystemContext from '../../../../src_shared/system/contexts/SystemContext';

const BackupContextProvider = props => {
    const {getSystemBackupSettings} = useContext(SystemContext);
    const [isBackup, setIsBackup] = useState(false);
    const [currentBackups, setCurrentBackups] = useState(null);
    const [loading, setLoading] = useState(true);

    const getCurrentBackupSchedule = () => {
        getSystemBackupSettings().then(data => {
            setIsBackup(data.enable);
            setCurrentBackups(data);
            setLoading(false);
        });
    };
    useEffect(() => {
        getCurrentBackupSchedule();
    }, []);
    return (
        <BackupContext.Provider value={{isBackup, currentBackups, loading}}>
            <Backup />
            {/* {props.children} */}
        </BackupContext.Provider>
    );
};

export default BackupContextProvider;
