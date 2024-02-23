import React, { useState, useContext } from 'react';
import axios from 'axios';
import AppContext from '../../../AppContext';

const AddNewUser = () => {
    const { hostURL } = useContext(AppContext);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        password_confirmation: '',
        master_password: '',
        master_password_confirmation: ''
    });

    const [passwordValid, setPasswordValid] = useState({
        password: true,
        password_confirmation: true,
        master_password: true,
        master_password_confirmation: true
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showMasterPassword, setShowMasterPassword] = useState(false)

    const validatePassword = (password) => {
        // Password validation: check if the password contains at least one number
        return /\d/.test(password);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        // Validate password if it's one of the password fields
        if (name.includes('password')) {
            const isValid = validatePassword(value);
            setPasswordValid((prevValid) => ({
                ...prevValid,
                [name]: isValid,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        // Check if all passwords are valid
        const allPasswordsValid = Object.values(passwordValid).every((valid) => valid);

        if (allPasswordsValid) {
            try {
                const response = await axios.post(hostURL + `/identity/api/registration`, { user: formData });
                console.log('User created successfully:', response.data);
                // Reset form data after successful submission
                setFormData({
                    email: '',
                    username: '',
                    password: '',
                    password_confirmation: '',
                    master_password: '',
                    master_password_confirmation: ''
                });
            } catch (error) {
                console.error('Error creating user:', error);
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6">
            <h2 className="text-xl font-semibold mb-4">Create User</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium ">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    All passwords should contain at least one number
                </div>
                <section className='mt-4'>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium ">Password</label>
                        <div className='flex'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className={`mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-[90%] shadow-sm sm:text-sm border-gray-300 rounded-md ${passwordValid.password ? '' : 'border-red-500'}`}
                            />
                            <label className="swap">
                                <input
                                    id='show-password'
                                    type='checkbox'
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
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium ">Confirm Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password_confirmation"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            required
                            className={`mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-[90%] shadow-sm sm:text-sm border-gray-300 rounded-md ${passwordValid.password_confirmation ? '' : 'border-red-500'}`}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="master_password" className="block text-sm font-medium ">Master Password</label>
                        <div className='flex'>
                            <input
                                type={showMasterPassword ? 'text' : "password"}
                                id="master_password"
                                name="master_password"
                                value={formData.master_password}
                                onChange={handleChange}
                                required
                                className={`mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-[90%] shadow-sm sm:text-sm border-gray-300 rounded-md ${passwordValid.master_password ? '' : 'border-red-500'}`}
                            />
                            <label className="swap">
                                <input
                                    id='show-master-password'
                                    type='checkbox'
                                    onChange={() => setShowMasterPassword(!showMasterPassword)}
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
                    </div>
                    <div className="mb-4">
                        <label htmlFor="master_password" className="block text-sm font-medium ">Master Password Confirmation</label>
                        <div className='flex'>
                            <input
                                type={showMasterPassword ? 'text' : "password"}
                                id="master_password_confirmation"
                                name="master_password_confirmation"
                                value={formData.master_password_confirmation}
                                onChange={handleChange}
                                required
                                className={`mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-[90%] shadow-sm sm:text-sm border-gray-300 rounded-md ${passwordValid.master_password_confirmation ? '' : 'border-red-500'}`}
                            />
                        </div>
                    </div>
                </section>
                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-black rounded-md shadow-md text-black bg-transparent hover:text-white hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-shadow"
                >
                    Create User
                </button>


            </form>
        </div>
    );
};

export default AddNewUser;
