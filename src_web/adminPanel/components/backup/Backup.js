import React, { useState, useContext, useEffect } from "react";
import axios from 'axios';
import AppContext from "../../../AppContext";
// https://heroicons.com icons

const Backup = () => {
    const [emptyTime, setEmptyTime] = useState(false);
    const [isBackupOn, setIsBackupOn] = useState(false);
    const [sendConfirmation, setSendConfirmation] = useState(false);
    const [backupPassword, setBackupPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [selectedBackupTimes, setSelectedBackupTimes] = useState([]);
    const { hostURL } = useContext(AppContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(hostURL + "/system/api/setting/backupSetting/backup");
                const formData = response.data;

                // Update state variables based on received FormData
                setIsBackupOn(formData.get('enable'));
                setSendConfirmation(formData.get('email_enable'));
                setBackupPassword(formData.has('archive_password'));
                setEmail(formData.get('email'));
                setPassword(formData.get('archive_password'));
                setSelectedBackupTimes(JSON.parse(formData.get('schedule')));
            } catch (error) {
                console.error("Error fetching backup data:", error);
            }
        };

        fetchData();
    }, [hostURL]);

    const handleBackupTimeChange = (time) => {
        if (selectedBackupTimes.includes(time)) {
            setSelectedBackupTimes(selectedBackupTimes.filter(selectedTime => selectedTime !== time));
        } else {
            setSelectedBackupTimes([...selectedBackupTimes, time]);
        }
    };


    const handleNewTime = async () => {
        console.log('func clicked', selectedBackupTimes.length);
        if (selectedBackupTimes.length > 0) {
            console.log('within if');
            const formData = new FormData();
            formData.append('schedule', JSON.stringify(selectedBackupTimes));
            formData.append('enable', isBackupOn);
            formData.append('email_enable', sendConfirmation);
            if (sendConfirmation) {
                formData.append('email', email);
            }
            if (backupPassword) {
                formData.append('archive_password', password);
            }

            try {
                console.log('try', formData);
                const response = await axios.post(hostURL + "/system/api/setting/backupSetting/backup", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 200) {
                    console.log("Backup time saved successfully!");
                } else {
                    console.error("Failed to save backup time");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        } else {
            setEmptyTime(true);
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
        <div className="backup-block w-[80%] mx-auto p-4">
            <div className="">
                <label htmlFor="backup-toggle" className="flex items-center text-lg">
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
            <div hidden={!isBackupOn}>
                <div
                    className="text-red-500 font-bold"
                    hidden={!emptyTime}
                >
                    picking time is required
                </div>
                <div className="m-3 w-[80%] ">
                    <label htmlFor="backupTimes">Select Backup Times:</label>
                    <div className="flex flex-wrap flex-row">

                        {availableBackupTimes.map((time, index) => (
                            <div
                                key={index}
                                className={`flex p-3 m-3 lg:m-1 lg:p-1 hover:cursor-pointer after:w-[25%] lg:w-[11%]
                                    ${selectedBackupTimes.includes(time) ? 'selected font-bold text-sky-500 ' : ''}
                                `}
                                onClick={() => handleBackupTimeChange(time)}
                            >
                                {time}
                            </div>
                        ))}
                    </div>

                    <div className="">
                        <p className="p-1 my-1">Selected Backup Times: {selectedBackupTimes.join(', ')}</p>
                        <button
                            className={` px-2 py-1 rounded ${isBackupOn
                                ? 'bg-blue-500  hover:bg-blue-700'
                                : 'cursor-not-allowed bg-gray-400'}`}
                            onClick={() => { setSelectedBackupTimes([]), setEmptyTime(false) }}>Reset</button>
                    </div>
                </div>

                {/* <section className={`backup-time-select m-3 ${isBackupOn ? '' : 'opacity-50'}`}>
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
                        ))} */}
                {/* <option value='custom-time'>Custom Time</option> */}
                {/* </select>
                </section> */}
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
                        <div className="flex gap-0 m-0 p-0">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id='password'
                                placeholder='Enter backup password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='w-[90%] ml-2 border rounded'
                            />
                            <label className="swap">
                                <input
                                    id='show-password'
                                    type='checkbox'
                                    disabled={!isBackupOn}
                                    onChange={() => setShowPassword(!showPassword)}
                                    className='w-[10%] m-0'
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="swap-on m-0 w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="swap-off m-0 w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>


                            </label>
                        </div>

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
                        Send backup on email
                    </label>
                    {sendConfirmation && (
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-[90%] m-2 border rounded"
                        />
                    )}
                </div>
                <div className="text-center">
                    <button
                        className={` px-4 py-2 rounded ${isBackupOn
                            ? 'bg-blue-500  hover:bg-blue-700'
                            : 'cursor-not-allowed bg-gray-400'}`}
                        onClick={handleNewTime}
                    >
                        Save backup time
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Backup;
