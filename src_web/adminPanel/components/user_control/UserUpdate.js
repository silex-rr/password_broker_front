import React from 'react';
import axios from 'axios';
import {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import AppContext from '../../../AppContext';
import AdminPanelLoading from '../AdminPanelLoading';
import {FaCheck, FaXmark} from 'react-icons/fa6';

const UserUpdate = props => {
    const {userID, userIDparam} = useParams();
    const {hostURL} = useContext(AppContext);
    const [user, setUser] = useState('');
    const [userRequiresLoading, setUserRequiresLoading] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
    });
    const [updateStatus, setUpdateStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        // console.log(e);
        try {
            console.log('putting', userID, formData);
            await axios.put(hostURL + `/identity/api/user/${userID}`, formData);
            setUpdateStatus('updated');
        } catch (error) {
            // console.log('error', error);
            setUpdateStatus('error');
        }
        setIsLoading(false);
    };

    const handleNameChange = event => {
        setFormData(prevData => ({
            ...prevData,
            username: event.target.value,
        }));
    };

    const handleEmailChange = event => {
        // console.log(event);
        setFormData(prevData => ({
            ...prevData,
            email: event.target.value,
        }));
    };

    const handleClear = () => {
        setFormData(() => ({
            username: user.name,
            email: user.email,
        }));
    };

    // console.log("the url: ", hostURL + `/user/${userID}`)
    useEffect(() => {
        axios.get(hostURL + `/identity/api/user/${userID}`).then(
            user => {
                if (userRequiresLoading === true) {
                    setUserRequiresLoading(false);
                    setUser(user.data);
                    setFormData({username: user.data.name, email: user.data.email});
                }
            },
            error => {
                console.log(error);
            },
        );
    }, [setUserRequiresLoading, setUser, setFormData]);

    // console.log(`form data ${formData['email']}, ${formData['username']}`);
    // console.log('user ', user);

    return (
        <div className="form m-9 p-5">
            {userRequiresLoading === true && <AdminPanelLoading />}
            {userRequiresLoading === false && (
                <div className="flex flex-col justify-evenly space-y-4">
                    <span>{user.name}</span>
                    <div className="h-full min-h-12 basis-2/4">
                        <input
                            type="text"
                            className="user-name-edit h-full w-2/4 text-xl"
                            value={formData['username']}
                            onChange={e => {
                                handleNameChange(e);
                            }}
                            placeholder="Modify the name"
                        />
                    </div>
                    <span>{user.email}</span>
                    <div className="min-h-16 basis-2/4">
                        <input
                            type="email"
                            className="user-email-edit h-full w-2/4 text-xl"
                            value={formData['email']}
                            onChange={e => {
                                handleEmailChange(e);
                            }}
                            placeholder="Modify the email"
                        />
                    </div>
                    {updateStatus === 'error' && (
                        <p className="flex flex-row justify-center">
                            {' '}
                            <FaXmark /> An error occured, try again
                        </p>
                    )}
                    {updateStatus === 'updated' && (
                        <p className="flex flex-row justify-center">
                            {' '}
                            <FaCheck /> The User was successfully updated
                        </p>
                    )}
                    <button
                        type="submit"
                        className={
                            `submit-button m-3 bg-green-500 p-2 font-bold text-black hover:bg-green-600` +
                            ` hover:font-extrabold ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`
                        }
                        disabled={isLoading}
                        onClick={handleSubmit}>
                        {isLoading ? (
                            <div className="flex flex-row items-center justify-center">
                                <svg
                                    className="mr-3 h-5 w-5 animate-spin"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.373A8 8 0 0012 20v-4.373h-6z"
                                    />
                                </svg>
                                Processing...
                            </div>
                        ) : (
                            'Save'
                        )}
                    </button>
                    <button
                        className={`clear-button m-3 bg-red-400 p-2 font-bold text-black 
                            hover:bg-red-500 hover:font-extrabold ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                        onClick={handleClear}
                        disabled={isLoading}>
                        Clear changes
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserUpdate;
