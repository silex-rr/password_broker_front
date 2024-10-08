import React, {useState, useContext} from 'react';
import axios from 'axios';
import AppContext from '../../../AppContext';

const AddNewUser = () => {
    const {hostURL} = useContext(AppContext);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        password_confirmation: '',
        master_password: '',
        master_password_confirmation: '',
    });

    const [passwordValid, setPasswordValid] = useState({
        password: true,
        password_confirmation: true,
        master_password: true,
        master_password_confirmation: true,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showMasterPassword, setShowMasterPassword] = useState(false);
    const [axiosError, setAxiosError] = useState(false); // show error msg div
    const [errorMsg, setErrorMsg] = useState('');
    const [userCreated, setUserCreated] = useState(false);
    const validatePassword = password => {
        // Password validation: check if the password contains at least one number
        return /\d/.test(password);
    };

    const handleChange = e => {
        setAxiosError(false);
        const {name, value} = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
        // Validate password if it's one of the password fields
        if (name.includes('password')) {
            const isValid = validatePassword(value);
            setPasswordValid(prevValid => ({
                ...prevValid,
                [name]: isValid,
            }));
        }
        if (name === 'password_confirmation' || name === 'master_password_confirmation') {
            const passwordField = name.includes('master') ? 'master_password' : 'password';
            const confirmationField = name;
            if (formData[passwordField] !== value) {
                setPasswordValid(prevValid => ({
                    ...prevValid,
                    [confirmationField]: false,
                }));
            } else {
                setPasswordValid(prevValid => ({
                    ...prevValid,
                    [confirmationField]: true,
                }));
            }
        }
    };

    const svg_1 =
        // eslint-disable-next-line max-len
        'M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z';
    const svg_2 =
        // eslint-disable-next-line max-len
        'M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88';

    const handleSubmit = async e => {
        e.preventDefault();
        // Check if all passwords are valid
        const allPasswordsValid = Object.values(passwordValid).every(valid => valid);
        if (allPasswordsValid) {
            try {
                const response = await axios.post(hostURL + `/identity/api/registration`, {user: formData});
                setUserCreated(true);
                // Reset form data after successful submission
                setFormData({
                    email: '',
                    username: '',
                    password: '',
                    password_confirmation: '',
                    master_password: '',
                    master_password_confirmation: '',
                });
            } catch (error) {
                setAxiosError(true);
                setErrorMsg(error.message);
            }
        }
    };

    return (
        <div className="mx-auto mt-8 max-w-md p-6">
            <h2 className="mb-4 text-xl font-semibold">Create User</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={
                            'mt-1 block h-8 w-full rounded-md border-gray-300' +
                            ' shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                        }
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium ">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className={
                            'mt-1 block h-8 w-full rounded-md border-gray-300 shadow-sm' +
                            ' focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                        }
                    />
                </div>
                <div className="mb-4">All passwords should contain at least one number</div>
                <section className="mt-4">
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className={`block text-sm font-medium ${!passwordValid.password ? 'text-red-500' : ''}`}>
                            {passwordValid.password ? 'Enter Password' : 'Passwords do not match'}
                        </label>
                        <div className="flex">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className={
                                    'mt-1 block h-8 w-[90%] rounded-md border-gray-300 shadow-sm' +
                                    ' focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                                }
                            />
                            <label className="swap">
                                <input
                                    id="show-password"
                                    type="checkbox"
                                    onChange={() => setShowPassword(!showPassword)}
                                    className="m-0 w-[10%]"
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="swap-on m-0 h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={svg_1} />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                </svg>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="swap-off m-0 h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={svg_2} />
                                </svg>
                            </label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="confirmPassword"
                            className={
                                `block text-sm font-medium ` +
                                `${passwordValid.password_confirmation ? '' : 'text-red-500'}`
                            }>
                            {passwordValid.password_confirmation ? 'Confirm Password' : 'Passwords do not match'}
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password_confirmation"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            required
                            className={
                                'mt-1 block h-8 w-[90%] rounded-md shadow-sm focus:border-indigo-500' +
                                ' focus:ring-indigo-500 sm:text-sm '
                            }
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="master_password"
                            className={`block text-sm font-medium ${
                                passwordValid.master_password ? '' : 'text-red-500'
                            }`}>
                            {passwordValid.master_password ? 'Enter Master Password' : 'Master Passwords do not match'}
                        </label>
                        <div className="flex">
                            <input
                                type={showMasterPassword ? 'text' : 'password'}
                                id="master_password"
                                name="master_password"
                                value={formData.master_password}
                                onChange={handleChange}
                                required
                                className={
                                    'mt-1 block h-8 w-[90%] rounded-md border-gray-300 shadow-sm' +
                                    ' focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                                }
                            />
                            <label className="swap">
                                <input
                                    id="show-master-password"
                                    type="checkbox"
                                    onChange={() => setShowMasterPassword(!showMasterPassword)}
                                    className="m-0 w-[10%]"
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="swap-on m-0 h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={svg_1} />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                </svg>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="swap-off m-0 h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={svg_2} />
                                </svg>
                            </label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="master_password"
                            className={`block text-sm font-medium ${
                                passwordValid.master_password_confirmation ? '' : 'text-red-500'
                            }`}>
                            {passwordValid.master_password_confirmation
                                ? 'Confirm Master Password'
                                : 'Master Passwords do not match'}{' '}
                        </label>
                        <div className="flex">
                            <input
                                type={showMasterPassword ? 'text' : 'password'}
                                id="master_password_confirmation"
                                name="master_password_confirmation"
                                value={formData.master_password_confirmation}
                                onChange={handleChange}
                                required
                                className={
                                    `mt-1 block h-8 w-[90%] rounded-md border-gray-300 shadow-sm ` +
                                    `focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm  ${
                                        passwordValid.master_password_confirmation ? '' : 'border-red-500'
                                    }`
                                }
                            />
                        </div>
                    </div>
                </section>
                <button
                    type="submit"
                    className={
                        'w-full rounded-md border border-black bg-transparent px-4 py-2 text-black shadow-md' +
                        ' transition-shadow hover:bg-opacity-50 hover:text-white focus:outline-none focus:ring-2' +
                        ' focus:ring-indigo-500 focus:ring-offset-2'
                    }>
                    Create User
                </button>
            </form>
            {userCreated && (
                <div className="m-3 border-spacing-3 border border-green-700 bg-green-500/[.06] p-2">
                    The User has been created successfully.
                </div>
            )}
            {axiosError && (
                <div className="m-3 border-spacing-3 border border-red-400 bg-red-500/[.06] p-2">{errorMsg}</div>
            )}
        </div>
    );
};

export default AddNewUser;
