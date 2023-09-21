import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../../AppContext';
import AdminPanelLoading from '../AdminPanelLoading';

const UserUpdate = props => {
    const { userID, userIDparam } = useParams();
    const { hostURL } = useContext(AppContext);
    const [user, setUser] = useState('');
    const [userRequiresLoading, setUserRequiresLoading] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
    });
    const [updateStatus, setUpdateStatus] = useState('')

    const handleSubmit = async e => {
        e.preventDefault();
        // console.log(e);
        try {
            console.log('putting', userID, formData);
            await axios.put(hostURL + `/identity/api/user/${userID}`, formData);
            setUpdateStatus('updated')
        } catch (error) {
            // console.log('error', error);
            setUpdateStatus('error')
        }
    };

    const handleNameChange = event => {
        setFormData(prevData => ({
            ...prevData,
            'username': event.target.value,
        }));
    };

    const handleEmailChange = event => {
        // console.log(event);
        setFormData(prevData => ({
            ...prevData,
            'email': event.target.value,
        }));
    };

    const handleClear = () => {
        setFormData(() => ({
            'username': user.name,
            'email': user.email,
        }));
    };

    // console.log("the url: ", hostURL + `/user/${userID}`)
    useEffect(() => {
        axios.get(hostURL + `/identity/api/user/${userID}`).then(
            user => {
                if (userRequiresLoading === true) {
                    setUserRequiresLoading(false);
                    setUser(user.data);
                    setFormData({ 'username': user.data.name, 'email': user.data.email })
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
                    <div className="min-h-12 h-full basis-2/4">
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
                    {updateStatus === 'error' &&
                        <p>An error uccored, try again</p>}
                    {updateStatus === 'updated' &&
                        <p>The User was successfully updated</p>}
                    <button
                        className="edit-button m-3 basis-1/4 bg-green-500 p-2 font-bold text-black 
                            hover:bg-green-600 hover:font-extrabold"
                        onClick={handleSubmit}>
                        Save
                    </button>
                    <button
                        className="clear-button m-3 basis-1/4 bg-red-400 p-2 font-bold text-black 
                            hover:bg-red-500 hover:font-extrabold"
                        onClick={handleClear}>
                        Clear changes
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserUpdate;
