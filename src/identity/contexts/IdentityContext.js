import React, {useState} from "react"
import axios from "axios"
import Cookies from "js-cookie"
import {LOADING, LOG_IN_FORM, LOGGED_IN, SIGN_UP_FORM,} from "../constants/AuthStatus"

const IdentityContext = React.createContext();

const IdentityProvider = (props) => {

    const hostName = props.hostName ? props.hostName : process.env.REACT_APP_PASSWORD_BROKER_HOST

    const [authStatus, setAuthStatus] = useState("")

    const [errorMessage, setErrorMessage] = useState("")
    const [userId, setUserId] = useState("")
    const [userName, setUserName] = useState("")
    const [userNameInput, setUserNameInput] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [userPassword, setUserPassword] = useState("")

    function changeAuthStatusLogin() {
        setAuthStatus(LOG_IN_FORM)
    }

    function changeAuthStatusLoading() {
        setAuthStatus(LOADING)
    }

    function changeAuthStatusSignup() {
        setAuthStatus(SIGN_UP_FORM)
    }

    function handleUserNameInput(value) {
        setUserNameInput(value)
    }

    function handleUserEmail(value) {
        setUserEmail(value)
    }

    function handleUserPassword(value) {
        setUserPassword(value)
    }

    const signup = () => {
        axios.defaults.withCredentials = true;
        // CSRF COOKIE
        axios.get(hostName + "/sanctum/csrf-cookie").then(
            () => {
                //console.log(response);
                // SIGNUP / REGISTER
                axios
                    .post(hostName + "/identity/api/register", {
                        name: userNameInput,
                        email: userEmail,
                        password: userPassword,
                    })
                    .then(
                        () => {
                            //console.log(response);
                            // GET USER
                            axios.get(hostName + "/identity/api/user").then(
                                (response) => {
                                    //console.log(response);
                                    setUserId(response.data.id)
                                    setUserName(response.data.name)
                                    setErrorMessage("")
                                    setAuthStatus(LOGGED_IN)
                                },
                                // GET USER ERROR
                                () => {
                                    setErrorMessage("Could not complete the sign up")
                                }
                            );
                        },
                        // SIGNUP ERROR
                        (error) => {
                            if (error.response.data.errors.name) {
                                setErrorMessage(error.response.data.errors.name[0]);
                            } else if (error.response.data.errors.email) {
                                setErrorMessage(error.response.data.errors.email[0]);
                            } else if (error.response.data.errors.password) {
                                setErrorMessage(error.response.data.errors.password[0]);
                            } else if (error.response.data.message) {
                                setErrorMessage(error.response.data.message)
                            } else {
                                setErrorMessage("Could not complete the sign up")
                            }
                        }
                    );
            },
            // COOKIE ERROR
            () => {
                setErrorMessage("Could not complete the sign up")
            }
        );
    };

    const login = () => {
        axios.defaults.withCredentials = true;
        // CSRF COOKIE
        console.log(hostName + "/sanctum/csrf-cookie")
        axios.get(hostName + "/sanctum/csrf-cookie").then(
            (response) => {
                console.log('.login')
                console.log(response)
                console.log(userEmail)
                console.log(userPassword)
                // LOGIN
                axios
                    .post(hostName + "/identity/api/login", {
                        email: userEmail,
                        password: userPassword,
                    })
                    .then(
                        () => {
                            getUser()
                        },
                        // LOGIN ERROR
                        (error) => {
                            if (error.response) {
                                setErrorMessage(error.response.data.message)
                            } else {
                                setErrorMessage("Could not complete the login")
                            }
                        }
                    );
            },
            // COOKIE ERROR
            () => {
                setErrorMessage("Could not complete the login")
            }
        );
    };

    async function logout(navigate) {
        axios.defaults.withCredentials = true;
        axios.get(hostName + "/identity/api/logout").then(() => {
            Cookies.remove('XSRF-TOKEN')
            Cookies.remove('laravel_session')
            setUserId("")
            setUserName("")
            setUserNameInput("")
            setUserEmail("")
            setUserPassword("")
            setAuthStatus("")
            navigate('/')
        });
    }

    function getUser() {
        changeAuthStatusLoading()
        // setAuthStatus(LOADING)
        axios.defaults.withCredentials = true;
        // console.log(hostName + "/identity/api/me")
        axios.get(hostName + "/identity/api/me").then(
            (response) => {
                console.log(response)
                switch (response.data.message) {
                    default:
                    case 'guest':
                        changeAuthStatusLogin()
                        break;
                    case 'loggedIn':
                        setAuthStatus(LOGGED_IN)

                        setUserId(response.data.user.user_id);
                        setUserName(response.data.user.name);
                        setUserEmail(response.data.user.email);
                        break;
                    case 'firstUser':
                        changeAuthStatusSignup()

                        break;
                }
            },
            (error) => {
                console.log('identityContext.getUser error', error)
            }
        )
    }

    return (
        <IdentityContext.Provider
            value={{
                authStatus,
                changeAuthStatusLogin,
                changeAuthStatusSignup,
                changeAuthStatusLoading,
                userId,
                userName,
                userNameInput,
                userEmail,
                userPassword,
                handleUserNameInput,
                handleUserEmail,
                handleUserPassword,
                signup,
                login,
                logout,
                getUser,
                errorMessage,
            }}
        >
            {props.children}
        </IdentityContext.Provider>
    );
};

export { IdentityContext, IdentityProvider };
