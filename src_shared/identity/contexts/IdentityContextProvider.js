import React, {useState} from 'react';
import {AUTH_MODE_BEARER_TOKEN, AUTH_MODE_COOKIE} from '../constants/AuthMode';
import {AUTH_LOGIN_AWAIT, AUTH_LOGIN_IN_PROCESS} from '../constants/AuthLoginStatus';
import {LOADING, LOG_IN_FORM, LOGGED_IN, SIGN_UP_FORM} from '../constants/AuthStatus';
import axios from 'axios';
import Cookies from 'js-cookie';
import IdentityContext from './IdentityContext';

const IdentityContextProvider = props => {
    const getAppUUId = props.getAppUUId
        ? props.getAppUUId
        : async () => {
              return '';
          };
    const appTokensService = props.AppTokensService ? props.AppTokensService : null;

    let hostURLDefault = '';
    if (props.hostURL) {
        hostURLDefault = props.hostURL;
    } else if (process.env.REACT_APP_PASSWORD_BROKER_HOST) {
        hostURLDefault = process.env.REACT_APP_PASSWORD_BROKER_HOST;
    }

    const [authStatus, setAuthStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [userNameInput, setUserNameInput] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userToken, setUserToken] = useState('');
    const [authMode, setAuthMode] = useState(props.tokenMode ? AUTH_MODE_BEARER_TOKEN : AUTH_MODE_COOKIE);
    const [hostURL, setHostURL] = useState(hostURLDefault);
    const [authLoginStatus, setAuthLoginStatus] = useState(AUTH_LOGIN_AWAIT);

    const changeAuthMode = newAuthMode => {
        if (![AUTH_MODE_BEARER_TOKEN, AUTH_MODE_COOKIE].includes(newAuthMode)) {
            return;
        }
        setAuthMode(newAuthMode);
    };
    const changeAuthStatusLogin = () => {
        setAuthStatus(LOG_IN_FORM);
    };
    const changeAuthStatusLoading = () => {
        setAuthStatus(LOADING);
    };

    const changeAuthStatusSignup = () => {
        setAuthStatus(SIGN_UP_FORM);
    };

    const handleUserNameInput = value => {
        setUserNameInput(value);
    };

    const handleUserEmail = value => {
        setUserEmail(value);
    };
    const handleHostURL = value => {
        setHostURL(value);
    };

    const handleUserPassword = value => {
        setUserPassword(value);
    };

    const signup = () => {
        // CSRF COOKIE
        // axios.get(hostURL + "/sanctum/csrf-cookie")
        CSRF().then(
            () => {
                //console.log(response);
                // SIGNUP / REGISTER
                axios
                    .post(hostURL + '/identity/api/register', {
                        name: userNameInput,
                        email: userEmail,
                        password: userPassword,
                    })
                    .then(
                        () => {
                            //console.log(response);
                            // GET USER
                            axios.get(hostURL + '/identity/api/user').then(
                                response => {
                                    //console.log(response);
                                    setUserId(response.data.id);
                                    setUserName(response.data.name);
                                    setErrorMessage('');
                                    setAuthStatus(LOGGED_IN);
                                },
                                // GET USER ERROR
                                () => {
                                    setErrorMessage('Could not complete the sign up');
                                },
                            );
                        },
                        // SIGNUP ERROR
                        error => {
                            if (error.response.data.errors.name) {
                                setErrorMessage(error.response.data.errors.name[0]);
                            } else if (error.response.data.errors.email) {
                                setErrorMessage(error.response.data.errors.email[0]);
                            } else if (error.response.data.errors.password) {
                                setErrorMessage(error.response.data.errors.password[0]);
                            } else if (error.response.data.message) {
                                setErrorMessage(error.response.data.message);
                            } else {
                                setErrorMessage('Could not complete the sign up');
                            }
                        },
                    );
            },
            // COOKIE ERROR
            () => {
                setErrorMessage('Could not complete the sign up');
            },
        );
    };
    const activateUserToken = token => {
        setUserToken(token);
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        // axios.interceptors.request.use((config) => {
        //     config.headers = {...config.headers, Authorization: `Bearer ${token}`}
        // })
    };
    const deactivateUserToken = () => {
        setUserToken('');
        axios.defaults.headers.common = {};
        // axios.interceptors.request.use(() => {})
    };

    const getUserToken = async login => {
        const appUUID = await getAppUUId();
        axios
            .post(hostURL + '/identity/api/token', {
                token_name: appUUID,
            })
            .then(
                response => {
                    const token = response.data.token;
                    appTokensService.addTokenByParams(login, hostURL, token);
                    activateUserToken(token);
                    // console.log(response)
                    setAuthStatus(LOGGED_IN);
                    // console.log('cookies', Cookies.get())
                },
                // error => {
                //     // console.log('getTokenError', error)
                // },
            );
    };

    const CSRF = () => {
        return new Promise((resolve, reject) => {
            axios.get(hostURL + '/sanctum/csrf-cookie').then(
                response => {
                    // console.log('csrf', response)
                    typeof resolve === 'function' && resolve(response);
                },
                error => {
                    typeof reject === 'function' && reject(error);
                },
            );
        });
    };

    const login = () => {
        // CSRF COOKIE
        // console.log(hostURL + "/sanctum/csrf-cookie")
        // axios.get(hostURL + "/sanctum/csrf-cookie")

        if (authLoginStatus !== AUTH_LOGIN_AWAIT) {
            return;
        }

        setAuthLoginStatus(AUTH_LOGIN_IN_PROCESS);

        const errorMessages = [];
        if (hostURL === '') {
            errorMessages.push('Field: Server URL should be filled in');
        }
        if (userEmail === '') {
            errorMessages.push('Field: Email should be filled in');
        }
        if (userPassword === '') {
            errorMessages.push('Field: Password should be filled in');
        }
        if (errorMessages.length > 0) {
            setErrorMessage(errorMessages.join('\r\n'));
            return;
        }
        CSRF().then(
            () => {
                // console.log('.login')
                // console.log('crf login', response)
                // console.log(userEmail)
                // console.log(userPassword)
                // LOGIN
                axios
                    .post(hostURL + '/identity/api/login', {
                        email: userEmail,
                        password: userPassword,
                    })
                    .then(
                        () => {
                            // console.log('login', response)
                            setAuthLoginStatus(AUTH_LOGIN_AWAIT);
                            getUser();
                        },
                        // LOGIN ERROR
                        error => {
                            setAuthLoginStatus(AUTH_LOGIN_AWAIT);
                            if (error.response) {
                                setErrorMessage(error.response.data.message);
                            } else {
                                setErrorMessage('Could not complete the login');
                            }
                        },
                    );
            },
            // COOKIE ERROR
            () => {
                setAuthLoginStatus(AUTH_LOGIN_AWAIT);
                setErrorMessage('Could not complete the login');
            },
        );
    };

    const loginByToken = token => {
        // console.log('aad')
        activateUserToken(token);
        // console.log(axios)
        CSRF().then(() => {
            // console.log('csrf getUser')
            getUser(false);
        });
    };

    async function logout(navigate) {
        axios.get(hostURL + '/identity/api/logout').then(() => {
            if (authMode === AUTH_MODE_COOKIE) {
                Cookies.remove('XSRF-TOKEN');
                Cookies.remove('laravel_session');
            }
            if (authMode === AUTH_MODE_BEARER_TOKEN) {
                deactivateUserToken();
            }
            setUserId('');
            setUserName('');
            setUserNameInput('');
            setUserEmail('');
            setUserPassword('');
            setAuthStatus('');
            navigate('/');
        });
    }

    const getUser = (getToken = true) => {
        changeAuthStatusLoading();
        // setAuthStatus(LOADING)
        // console.log(hostURL + "/identity/api/me")
        axios.get(hostURL + '/identity/api/me').then(
            response => {
                // console.log(response)
                switch (response.data.message) {
                    default:
                    case 'guest':
                        authMode === AUTH_MODE_BEARER_TOKEN
                            ? appTokensService.load().then(() => {
                                  changeAuthStatusLogin();
                              })
                            : changeAuthStatusLogin();
                        break;
                    case 'loggedIn':
                        setUserId(response.data.user.user_id);
                        setUserName(response.data.user.name);
                        setUserEmail(response.data.user.email);
                        if (authMode === AUTH_MODE_BEARER_TOKEN && userToken === '' && getToken) {
                            getUserToken(response.data.user.email).then(() => {});
                        } else {
                            setAuthStatus(LOGGED_IN);
                        }
                        break;
                    case 'firstUser':
                        changeAuthStatusSignup();

                        break;
                }
            },
            error => {
                console.log('identityContext.getUser error', error);
            },
        );
    };

    const getUsers = (page = 1, perPage = 20, searchQuery = '') => {
        const req = [];
        if (page) {
            req.push(`page=${page}`);
        }
        if (perPage) {
            req.push(`perPage=${perPage}`);
        }
        if (searchQuery) {
            req.push(`q=${searchQuery}`);
        }
        const reqString = req.length > 0 ? '?' + req.join('&') : '';
        const url = hostURL + `/identity/api/users/search${reqString}`;

        return new Promise((resolve, reject) => {
            axios.get(url).then(response => {
                resolve(response.data);
            }, reject);
        });
    };

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
                getUsers,
                handleUserNameInput,
                handleUserEmail,
                handleUserPassword,
                handleHostURL,
                signup,
                login,
                loginByToken,
                logout,
                getUser,
                errorMessage,
                appTokensService,
                CSRF,
                hostURL,
                authLoginStatus,
                changeAuthMode,
            }}>
            {props.children}
        </IdentityContext.Provider>
    );
};
export default IdentityContextProvider;
