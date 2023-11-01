import React, {useCallback, useEffect, useState} from 'react';
import {AUTH_MODE_BEARER_TOKEN, AUTH_MODE_COOKIE} from '../constants/AuthMode';
import {AUTH_LOGIN_AWAIT, AUTH_LOGIN_IN_PROCESS} from '../constants/AuthLoginStatus';
import {LOADING, LOG_IN_FORM, LOGGED_IN, NETWORK_ERROR, SIGN_UP_FORM} from '../constants/AuthStatus';
import axios from 'axios';
import Cookies from 'js-cookie';
import IdentityContext from './IdentityContext';
import {useNavigate} from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import {AppTokensService} from '../../utils/native/AppTokensService';
// eslint-disable-next-line no-unused-vars
import {OfflineDatabaseService} from '../../utils/native/OfflineDatabaseService';
import {AppToken} from '../../utils/native/AppToken';
import {DATABASE_MODE_OFFLINE} from '../constants/DatabaseModeStates';

const IdentityContextProvider = props => {
    const getClientId = props.getClientId
        ? props.getClientId
        : async () => {
              return '';
          };
    // const AppContext = props.AppContext;
    /**
     * @type {AppTokensService} appTokensService
     */
    const appTokensService = props.appTokensService ? props.appTokensService : null;
    /**
     * @type {OfflineDatabaseService} offlineDatabaseService
     */
    // const offlineDatabaseService = useContext(AppContext).offlineDatabaseService;

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
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    /**
     * @var {AppToken} userAppToken
     */
    const [userAppToken, setUserAppToken] = useState(null);
    const [authMode, setAuthMode] = useState(props.tokenMode ? AUTH_MODE_BEARER_TOKEN : AUTH_MODE_COOKIE);
    const [hostURL, setHostURL] = useState(hostURLDefault);
    const [authLoginStatus, setAuthLoginStatus] = useState(AUTH_LOGIN_AWAIT);
    const navigate = useNavigate();

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
    const changeAuthStatusLoggedIn = () => {
        setAuthStatus(LOGGED_IN);
    };

    const changeAuthStatusNetworkError = () => {
        setAuthStatus(NETWORK_ERROR);
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
                                    changeAuthStatusLoggedIn();
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
    /**
     * @param {AppToken} appToken
     */
    const activateUserToken = appToken => {
        setUserToken(appToken.token);
        setUserAppToken(appToken);
        axios.defaults.headers.common.Authorization = `Bearer ${appToken.token}`;
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
        const clientId = await getClientId();
        axios
            .post(hostURL + '/identity/api/token', {
                token_name: clientId,
            })
            .then(
                response => {
                    console.log('getUserToken', response);
                    const token = response.data.token;
                    const user = response.data.user;
                    console.log('token creating');
                    let appToken = null;
                    try {
                        appToken = new AppToken(user.user_id, login, user.name, hostURL, token, user.is_admin);
                    } catch (error) {
                        console.log('token error', error);
                        return;
                    }
                    console.log('token', appToken);

                    appTokensService.addToken(appToken).then(
                        () => {
                            console.log('token', 'saved');
                            activateUserToken(appToken);
                            changeAuthStatusLoggedIn();
                        },
                        error => {
                            console.log('appTokensService.addToken', error);
                        },
                    );

                    // console.log('cookies', Cookies.get());
                },
                // error => {
                //     // console.log('getTokenError', error)
                // },
            );
    };

    const CSRF = () => {
        return new Promise((resolve, reject) => {
            axios.get(getUrlCsrf()).then(
                response => {
                    // console.log('csrf', response)
                    typeof resolve === 'function' && resolve(response);
                },
                error => {
                    console.log(error);
                    if (error.code === 'ERR_NETWORK' && authMode === AUTH_MODE_BEARER_TOKEN) {
                        changeAuthStatusNetworkError();
                        return;
                    }
                    typeof reject === 'function' && reject(error);
                },
            );
        });
    };

    const getUrlCsrf = useCallback(() => {
        return hostURL + '/sanctum/csrf-cookie';
    }, [hostURL]);
    const getUrlLogin = useCallback(() => {
        return hostURL + '/identity/api/login';
    }, [hostURL]);
    const getUrlLogout = useCallback(() => {
        return hostURL + '/identity/api/logout';
    }, [hostURL]);
    const getUrlUser = useCallback(() => {
        return hostURL + '/identity/api/me';
    }, [hostURL]);

    const login = () => {
        // CSRF COOKIE
        // console.log(hostURL + "/sanctum/csrf-cookie")
        // axios.get(hostURL + "/sanctum/csrf-cookie")

        if (authLoginStatus !== AUTH_LOGIN_AWAIT) {
            return;
        }

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
        setErrorMessage('');
        setAuthLoginStatus(AUTH_LOGIN_IN_PROCESS);

        CSRF().then(
            () => {
                // console.log('.login')
                // console.log('crf login', response)
                // console.log(userEmail)
                // console.log(userPassword)
                // LOGIN
                axios
                    .post(getUrlLogin(), {
                        email: userEmail,
                        password: userPassword,
                    })
                    .then(
                        () => {
                            console.log('login', 'logged', authMode);
                            setAuthLoginStatus(AUTH_LOGIN_AWAIT);
                            if (authMode === AUTH_MODE_BEARER_TOKEN) {
                                getUser(true);
                            } else {
                                setAuthStatus('');
                                navigate('/identity/loading');
                            }
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
            // COOKIE ERROR{
            error => {
                setAuthLoginStatus(AUTH_LOGIN_AWAIT);
                console.log('csrf', error);
                if (error.code === 'ERR_NETWORK') {
                    setErrorMessage('Cannot establish connection with ' + hostURL);
                    return;
                }
                setErrorMessage('Could not complete the login');
            },
        );
    };

    /**
     * @param {AppToken} appToken
     */
    const loginByToken = appToken => {
        // console.log('aad')
        activateUserToken(appToken);
        setHostURL(appToken.url);
        setAuthStatus('');
        // console.log(axios)
        // CSRF().then(
        //     () => {
        //         // console.log('csrf getUser')
        //         getUser(false);
        //     },
        //     error => {
        //         console.log(error);
        //         if (error.code === 'ERR_NETWORK' && authMode === AUTH_MODE_BEARER_TOKEN) {
        //             changeAuthStatusNetworkError();
        //         }
        //     },
        // );
    };

    /**
     * @param {AppToken} appToken
     */
    const offlineLoginByToken = appToken => {
        setUserId(appToken.user_id);
        setUserName(appToken.name);
        setUserEmail(appToken.login);
        setUserIsAdmin(appToken.is_admin);
        setErrorMessage('');
        changeAuthStatusLoggedIn();
    };

    const logout = async databaseMode => {
        const afterLogout = () => {
            if (authMode === AUTH_MODE_COOKIE) {
                Cookies.remove('XSRF-TOKEN');
                Cookies.remove('laravel_session');
            }
            if (authMode === AUTH_MODE_BEARER_TOKEN) {
                deactivateUserToken();
            }
            setUserId('');
            setUserIsAdmin(false);
            setUserName('');
            setUserNameInput('');
            setUserEmail('');
            setUserPassword('');
            setAuthStatus('');
        };

        if (databaseMode === DATABASE_MODE_OFFLINE) {
            afterLogout();
            return;
        }

        try {
            await axios.get(getUrlLogout());
        } catch (e) {
            console.log('logout error', e);
        }
        afterLogout();
    };

    const getUser = (getToken = true) => {
        changeAuthStatusLoading();
        CSRF().then(() =>
            axios.get(getUrlUser()).then(
                response => {
                    console.log('getUser', response);
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
                            setUserIsAdmin(response.data.user.is_admin === '1');
                            console.log(
                                'getUserToken act',
                                authMode === AUTH_MODE_BEARER_TOKEN && userToken === '' && getToken,
                            );
                            if (authMode === AUTH_MODE_BEARER_TOKEN && userToken === '' && getToken) {
                                getUserToken(response.data.user.email).then(() => {});
                            } else {
                                changeAuthStatusLoggedIn();
                            }
                            break;
                        case 'firstUser':
                            changeAuthStatusSignup();
                            break;
                    }
                },
                error => {
                    console.log('identityContext.getUser error', error);
                    navigate('/identity/login');
                },
            ),
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

    useEffect(() => {
        // console.log('activate interceptors');
        axios.defaults.withCredentials = true;
        axios.defaults.timeout = 30000;
        let requestInterceptor = null;
        if (authStatus !== LOGGED_IN) {
            // console.log('request interceptor activated', authStatus);
            const validUrl = [getUrlLogin(), getUrlLogout(), getUrlCsrf(), getUrlUser()];

            requestInterceptor = axios.interceptors.request.use(
                config => {
                    if (validUrl.includes(config.url)) {
                        return config;
                    }
                    console.log('user is logout', config);
                    return Promise.reject({reason: 'user is logout', config: config});
                },
                error => {
                    return Promise.reject(error);
                },
            );
        }
        return () => {
            if (requestInterceptor) {
                // console.log('request interceptor ejected');
                axios.interceptors.request.eject(requestInterceptor);
            }
        };
    }, [authStatus, getUrlCsrf, getUrlLogin, getUrlLogout, getUrlUser]);

    return (
        <IdentityContext.Provider
            value={{
                userAppToken,
                authStatus,
                changeAuthStatusLogin,
                changeAuthStatusSignup,
                changeAuthStatusLoading,
                changeAuthStatusNetworkError,
                changeAuthStatusLoggedIn,
                userId,
                userName,
                userNameInput,
                userEmail,
                userPassword,
                userIsAdmin,
                getUsers,
                handleUserNameInput,
                handleUserEmail,
                handleUserPassword,
                handleHostURL,
                signup,
                login,
                loginByToken,
                offlineLoginByToken,
                logout,
                getUser,
                errorMessage,
                appTokensService,
                CSRF,
                hostURL,
                authLoginStatus,
                authMode,
                changeAuthMode,
            }}>
            {props.children}
        </IdentityContext.Provider>
    );
};
export default IdentityContextProvider;
