import React, { useContext, useEffect, useState } from "react";
import BackupContext from "./BackupContext";
import Backup from "./Backup";
import SystemContext from "../../../../src_shared/system/contexts/SystemContext";

const BackupContextProvider = (props) => {
    const { getSystemBackupSettings } = useContext(SystemContext)
    const [isBackup, setIsBackup] = useState(false);
    const [currentBackups, setCurrentBackups] = useState(null);

    const getCurrentBackupSchedule = () => {
        getSystemBackupSettings().then(
            data => {
                setIsBackup(data.enable);
                setCurrentBackups(data)
            }
        )
    }
    useEffect(() => {
        getCurrentBackupSchedule()
    }, [])
    return (
        <BackupContext.Provider value={{ isBackup, currentBackups }}>
            <Backup />
            {/* {props.children} */}
        </BackupContext.Provider>
    )
}

export default BackupContextProvider