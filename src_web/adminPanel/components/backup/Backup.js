import React, { useState } from "react";

const Backup = () => {
    const [backupTime, setBackupTime] = useState("12:00");

    const handleNewTime = () => {
        // Perform the POST request with the selected backupTime
        console.log("POST request with backupTime:", backupTime);
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
            <section className="backup-time-select">
                <label htmlFor="backup-time">Select a backup hour: </label>
                <select
                    id="backup-time"
                    name="backup-time"
                    value={backupTime}
                    onChange={(e) => setBackupTime(e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    {availableBackupTimes.map((time) => (
                        <option key={time} value={time}>
                            {time}
                        </option>
                    ))}
                </select>
            </section>
            <div className="mt-4 text-center">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={handleNewTime}
                >
                    Save backup time
                </button>
            </div>
        </div>
    );
};

export default Backup;
