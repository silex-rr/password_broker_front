import React, { useState, useContext } from "react";
import AppContext from "../../../AppContext";
import { FaRegCopy } from "react-icons/fa";
import axios from "axios";

const UserInvite = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [link, setLink] = useState('');
    const [sending, setSending] = useState(false);
    const [serverResponse, setServerResponse] = useState(null);
    const [emailError, setEmailError] = useState("");

    const { hostURL, copyToClipboard } = useContext(AppContext);

    const handleIntiveUser = async (event) => {
        event.preventDefault();

        // Validate email
        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address.");
            return;
        }

        try {
            setSending(true);
            const formData = { email: email, username: username || null };
            console.log(formData);
            const response = await axios.post(hostURL + `/identity/api/invite`, { user: formData });
            setServerResponse(200)
            setLink(response.data.inviteLinkUrl)
            console.log('response.status: ', response);
        } catch (error) {
            // console.log(error)
            setServerResponse(error.response.data.message);
        }

        setEmail("");
        setUsername("");
        setSending(false);
        console.log('Send button clicked');
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    return (
        <div className="w-[90%] border border-blue-500 flex flex-col m-3">
            <div>
                <div>Fill in the fields below to invite a new user.</div>
                <div className="flex flex-col gap-3 m-3 w-[50%]">
                    <label htmlFor='invite-new-user_email'>Email: (required)</label>
                    <input
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError("");
                        }}
                        type='email'
                        className=""
                        id="invite-new-user_email"
                        required
                    />
                    {emailError && <span style={{ color: "red" }}>{emailError}</span>}
                    <label htmlFor="intive-new-user_username">Username: </label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        id="intive-new-user_username"
                    />
                    <button
                        className={`px-4 py-2 rounded bg-blue-500 hover:bg-blue-700`}
                        onClick={handleIntiveUser}
                    >
                        {sending ? "The data is being sent" : "Send an invitation"}
                    </button>
                </div>
            </div>
            <div className="flex border border-gray-300 m-3 p-3 flex-col" hidden={link.length === 0}>
                The invitation link has been sent to email, either click on the one in the letter, or use the link below to register.
                <div className="flex gap-1" >{link}
                    <button onClick={() => copyToClipboard(link)} disabled={sending}><FaRegCopy /></button>
                </div>
            </div>
            <div>{serverResponse == 200 ? "" : serverResponse}</div>
        </div>
    );
}

export default UserInvite;
