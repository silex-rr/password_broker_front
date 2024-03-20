import React, { useState, useContext, useEffect } from "react";
import PaginationButton from "../../../common/Pagination";
import AdminPanelLoading from "../AdminPanelLoading";
import SystemContext from "../../../../src_shared/system/contexts/SystemContext";
import BackupTable from "./BackupTable";
import BackupSchedule from "./BackupSchedule";
import BackupContext from "./BackupContext";
// https://heroicons.com icons

const Backup = () => {
    const { getBackups, createBackup } = useContext(SystemContext)
    const { isBackup, loading } = useContext(BackupContext)
    const [isBackupOn, setIsBackupOn] = useState(null)
    const [fetchingData, setFetchingData] = useState(true)
    //get backups starts
    const [currentBackups, setCurrentBackups] = useState(null)
    const [fetchingBackups, setFetchingBackups] = useState(false)
    const [hideBackupBlock, setHideBackupBlock] = useState(false)
    //get backups ends
    //pagination starts
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    //pagnation ends
    const [requireLoading, setRequireLoading] = useState(false)

    const handlePagination = page => {
        setCurrentPage(page)
        setRequireLoading(true)
    }

    const getCurrentBackups = () => {
        setFetchingBackups(true)
        console.log('within current backups', fetchingBackups)
        getBackups(currentPage)
            .then(data => {
                console.log(data);
                setCurrentBackups(data.data);
                // setBackupFetchingStatus(data.status);
                setFetchingBackups(false);
                setLastPage(data.last_page);
            })
            .catch(error => {
                console.error("Error fetching backups:", error);
                setFetchingBackups(false);
            });
    }

    useEffect(() => {
        console.log('use effect is backup', loading)
        if (requireLoading == true) {
            getCurrentBackups(currentPage)
            setRequireLoading(false)
            return
        }
        if (isBackup != null) {
            setIsBackupOn(isBackup)
        }
    }, [requireLoading, currentPage, isBackup, loading]);

    return (
        <div className="backup-block portrait:w-full mx-auto p-4">
            <div className="">
                <div className="" >
                    <BackupSchedule />
                    <section className="backup_table my-4" hidden={loading}>
                        <div className="flex justify-between">
                            <button className="px-4 w-[45%] py-2 rounded bg-blue-500 hover:bg-blue-700" onClick={getCurrentBackups}>Get backups</button>
                            <button className="px-4 w-[45%] py-2 rounded bg-blue-500 hover:bg-blue-700" onClick={createBackup}>Create a new backup</button>
                        </div>
                        <div hidden={currentBackups == null}>
                            <div className="flex justify-center px-4">
                                <button className="px-4 my-4 w-[90%] py-2 rounded border border-blue-500 hover:bg-blue-700" onClick={() => setHideBackupBlock(!hideBackupBlock)}>{hideBackupBlock ? 'Show Backups' : 'Hide backups'}</button>
                            </div>
                            <div hidden={hideBackupBlock}>
                                <div className="my-4  flex justify-center w-full " >
                                    {fetchingBackups ? (
                                        <div className="w-full">
                                            <AdminPanelLoading />
                                        </div>
                                    ) : (
                                        currentBackups ? (
                                            <BackupTable backups={currentBackups} />
                                        ) : (
                                            <div>No backup data available.
                                                Create a new one, set up a backup schedule, or get current backups.
                                            </div>
                                        )
                                    )}
                                </div>
                                <PaginationButton
                                    currentPage={currentPage}
                                    lastPage={lastPage}
                                    handlePagination={handlePagination}
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Backup;
