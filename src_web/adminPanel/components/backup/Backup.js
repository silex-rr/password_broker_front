import React, { useState } from "react";

const Backup = () => {
    const [backupTime, setBackupTime] = useState("12:00");
    const [isBackupOn, setIsBackupOn] = useState(false);
    const [sendConfirmation, setSendConfirmation] = useState(false);
    const [email, setEmail] = useState("");

    const handleNewTime = () => {
        // Perform the POST request with the selected backupTime
        console.log("POST request with backupTime:", backupTime);
        // Include logic for sending confirmation email if sendConfirmation is true
        if (sendConfirmation) {
            console.log(`Sending confirmation email to: ${email}`);
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
            <div className="mb-4">
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
            <section className={`backup-time-select ${isBackupOn ? '' : 'opacity-50'}`}>
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
                </select>
            </section>
            <div className="mb-4 p-5 m-3">
                <label htmlFor="send-confirmation" className="flex items-center">
                    <input
                        id="send-confirmation"
                        type="checkbox"
                        checked={sendConfirmation}
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
                        className="w-full p-2 border rounded"
                    />
                )}
            </div>
            <div className="text-center">
                <button
                    className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 ${isBackupOn ? '' : 'cursor-not-allowed'}`}
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
