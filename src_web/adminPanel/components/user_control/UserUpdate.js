import axios from 'axios';
import {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import AppContext from '../../../AppContext';
import {FaEdit} from 'react-icons/fa';
import AdminPanelLoading from '../AdminPanelLoading';
import {debounce} from 'lodash.debounce';

const UserUpdate = props => {
    const {userID, userIDparam} = useParams();
    const {hostURL} = useContext(AppContext);
    const [user, setUser] = useState('');
    const [userRequiresLoading, setUserRequiresLoading] = useState(true);
    const [formData, setFormData] = useState({
        'user.name': '',
        'user.email': '',
    });
    const [tempName, setTempName] = useState('');
    const [tempEmail, setTempEmail] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        console.log(e);

        if (formData['user.email'] != tempEmail || formData['user.name'] != tempName) {
            try {
                console.log('putting');
                await axios.put(hostURL + `/identity/api/user/${userID}`, formData);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleNameChange = event => {
        setFormData(prevData => ({
            ...prevData,
            'user.name': event.target.value,
        }));
    };

    const handleEmailChange = event => {
        console.log(event);
        setFormData(prevData => ({
            ...prevData,
            'user.email': event.target.value,
        }));
    };

    const handleClear = () => {
        setFormData(() => ({
            'user.name': '',
            'user.email': '',
        }));
    };

    // console.log("the url: ", hostURL + `/user/${userID}`)
    useEffect(() => {
        axios.get(hostURL + `/identity/api/user/${userID}`).then(
            user => {
                if (userRequiresLoading === true) {
                    setUserRequiresLoading(false);
                    setUser(user.data);
                    setTempName(user.data.name);
                    setTempEmail(user.data.email);
                }
            },
            error => {
                console.log(error);
            },
        );
    }, [setUserRequiresLoading, setUser, setTempName, setTempEmail]);

    console.log(`form data ${formData['user.email']}, ${formData['user.name']}`);
    console.log('user ', user);

    return (
        <div className="form m-9 p-5">
            {userRequiresLoading === true && <AdminPanelLoading />}
            {userRequiresLoading === false && (
                <div className="flex flex-col justify-evenly space-y-4">
                    <span>{tempName}</span>
                    <div className="min-h-16 h-full basis-2/4">
                        <input
                            type="text"
                            className="user-name-edit h-full w-2/4 text-xl"
                            value={formData['user.name']}
                            onChange={e => {
                                handleNameChange(e);
                            }}
                            placeholder="Modify the name"
                        />
                    </div>
                    <span>{tempEmail}</span>
                    <div className="min-h-16 basis-2/4">
                        <input
                            type="email"
                            className="user-email-edit h-full w-2/4 text-xl"
                            value={formData['user.email']}
                            onChange={e => {
                                handleEmailChange(e);
                            }}
                            placeholder="Modify the email"
                        />
                    </div>
                    <button
                        className="edit-button m-3 basis-1/4 bg-green-500 p-2 font-bold text-black hover:bg-green-600 hover:font-extrabold"
                        onClick={handleSubmit}>
                        Save
                    </button>
                    <button
                        className="clear-button m-3 basis-1/4 bg-red-400 p-2 font-bold text-black hover:bg-red-500 hover:font-extrabold"
                        onClick={handleClear}>
                        Clear changes
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserUpdate;
