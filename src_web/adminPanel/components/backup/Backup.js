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
    //get backups starts
    const [currentBackups, setCurrentBackups] = useState(null)
    const [fetchingBackups, setFetchingBackups] = useState(false)
    const [hideBackupBlock, setHideBackupBlock] = useState(false)
    //get backups ends
    //pagination starts
    const [requireLoading, setRequireLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    //pagnation ends
    //create backup starts
    const [createBackupButtonText, setCreateBackupButtonText] = useState('Create a new backup')
    const [backupRequestSent, setBackupRequestSent] = useState(false)
    const [sendingBackupRequest, setSendingBackupRequest] = useState(false)
    //create backup ends

    const handlePagination = page => {
        setCurrentPage(page)
        setRequireLoading(true)
    }

    const handleCreateBackup = () => {
        const msg1 = 'Sending a backup request...'
        const msg2 = (<div className="flex justify-center">Backup request has been sent
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 ml-2 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
        </div>)
        const errorMsg = 'Something went wrong, try again'
        setSendingBackupRequest(true) //cursor style only
        setBackupRequestSent(false) //ensures the blue button colour
        const showMsg1 = setTimeout(() => {
            setCreateBackupButtonText(msg1)
        }, 0);
        const showMsg2 = setTimeout(() => {
            createBackup().then(() => {
                setCreateBackupButtonText(msg2)
            }).catch(error => {
                console.log('creating backup error: ', error)
                setCreateBackupButtonText(errorMsg)
            });
            setSendingBackupRequest(false);
            setBackupRequestSent(true);
        }, 3000);

        return () => {
            clearTimeout(showMsg1);
            clearTimeout(showMsg2);
        }
    }

    const getCurrentBackups = () => {
        setFetchingBackups(true)
        // console.log('within current backups', fetchingBackups)
        getBackups(currentPage)
            .then(data => {
                // console.log(data);
                setCurrentBackups(data.data);
                // setBackupFetchingStatus(data.status);
                setFetchingBackups(false);
                setHideBackupBlock(false);
                setLastPage(data.last_page);
            })
            .catch(error => {
                console.error("Error fetching backups:", error);
                setFetchingBackups(false);
            });
    }

    useEffect(() => {
        // console.log('use effect is backup', loading)
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
                            <button
                                className={`px-4 w-[45%] py-2 rounded  ${fetchingBackups ? 'cursor-progress bg-gray-400 hover:bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'}`}
                                onClick={getCurrentBackups}>Get backups</button>
                            <button
                                className={`px-4 w-[45%] py-2 rounded ${sendingBackupRequest ? 'cursor-progress' : ''} ${backupRequestSent ? 'bg-green-600 hover:bg-green-700' : "bg-blue-500 hover:bg-blue-700"}`}
                                onClick={handleCreateBackup}
                            >
                                {createBackupButtonText}
                            </button>
                        </div>
                        <div>
                            <div className="flex justify-center px-4" hidden={currentBackups == null}>
                                <button className="px-4 my-4 w-[90%] py-2 rounded border border-blue-500 hover:bg-blue-700"
                                    onClick={() => setHideBackupBlock(!hideBackupBlock)}
                                >{hideBackupBlock ? 'Show Backups' : 'Hide backups'}</button>
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
                                            <div className="font-medium m-2">
                                                <p>No backup data available.</p>
                                                <p>Create a new one, set up a backup schedule or get current backups.</p>
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
