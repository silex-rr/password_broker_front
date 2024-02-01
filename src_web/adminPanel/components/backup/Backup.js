import React, { useState } from "react";

const Backup = () => {
    const [backupTime, setBackupTime] = useState("12:00");
    const [isBackupOn, setIsBackupOn] = useState(false);
    const [sendConfirmation, setSendConfirmation] = useState(false);
    const [backupPassword, setBackupPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('')

    const handleNewTime = async () => {
        if (sendConfirmation) {
            const data = {
                schedule: [backupTime],
                enable: isBackupOn,
                email_enable: sendConfirmation,
                email: sendConfirmation ? email : null,
                archive_password: backupPassword ? password : null,
            };

            try {
                const response = await fetch("/system/api/setting/backupSetting/backup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    console.log("Backup time saved successfully!");
                } else {
                    console.error("Failed to save backup time");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };

    const availableBackupTimes = [
        "00:00", "01:00", "02:00", "03:00", "04:00",
        "05:00", "06:00", "07:00", "08:00", "09:00",
        "10:00", "11:00", "12:00", "13:00", "14:00",
        "15:00", "16:00", "17:00", "18:00", "19:00",
        "20:00", "21:00", "22:00", "23:00"
    ];

    return (
        <div className="backup-block w-80 mx-auto p-4">
            <div className="">
                <label htmlFor="backup-toggle" className="flex items-center">
                    <input
                        id="backup-toggle"
                        type="checkbox"
                        checked={isBackupOn}
                        onChange={() => setIsBackupOn(!isBackupOn)}
                        className="mr-2"
                    />
                    Turn on backup
                </label>
            </div>
            <section className={`backup-time-select m-3 ${isBackupOn ? '' : 'opacity-50'}`}>
                <label htmlFor="backup-time">Select a backup hour: </label>
                <select
                    id="backup-time"
                    name="backup-time"
                    value={backupTime}
                    onChange={(e) => setBackupTime(e.target.value)}
                    className="w-full p-2 border rounded"
                    disabled={!isBackupOn}
                >
                    {availableBackupTimes.map((time) => (
                        <option key={time} value={time}>
                            {time}
                        </option>
                    ))}
                    {/* <option value='custom-time'>Custom Time</option> */}
                </select>
            </section>
            <div className="m-3 w-80 backup-password">
                <label htmlFor="setup-password" >
                    <input
                        id='setup-password'
                        type='checkbox'
                        checked={backupPassword}
                        disabled={!isBackupOn}
                        onChange={() => setBackupPassword(!backupPassword)}
                        className='mr-2'
                    />
                    Set a password for the backup?
                </label>
                {backupPassword && (
                    <input
                        type='password'
                        id='password'
                        placeholder='Enter backup password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full m-2 border rounded'
                    />
                )}
            </div>
            <div className="w-80 m-3">
                <label htmlFor="send-confirmation" className="flex items-center">
                    <input
                        id="send-confirmation"
                        type="checkbox"
                        checked={sendConfirmation}
                        disabled={!isBackupOn}
                        onChange={() => setSendConfirmation(!sendConfirmation)}
                        className="mr-2"
                    />
                    Send backup confirmation on email
                </label>
                {sendConfirmation && (
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full m-2 border rounded"
                    />
                )}
            </div>
            <div className="text-center">
                <button
                    className={` px-4 py-2 rounded ${isBackupOn
                        ? 'bg-blue-500  hover:bg-blue-700'
                        : 'cursor-not-allowed bg-gray-400'}`}
                    onClick={handleNewTime}
                    disabled={!isBackupOn}
                >
                    Save backup time
                </button>
            </div>
        </div>
    );
};

export default Backup;
