import React, {useCallback, useEffect, useState} from 'react';
import {AUTH_MODE_BEARER_TOKEN, AUTH_MODE_COOKIE} from '../constants/AuthMode';
import {AUTH_LOGIN_AWAIT, AUTH_LOGIN_IN_PROCESS} from '../constants/AuthLoginStatus';
import {LOADING, LOG_IN_FORM, LOGGED_IN, NETWORK_ERROR, SIGN_UP_FORM} from '../constants/AuthStatus';
import axios from 'axios';
import Cookies from 'js-cookie';
import IdentityContext from './IdentityContext';
import {useNavigate} from 'react-router-dom';
// // eslint-disable-next-line no-unused-vars
// import {AppTokensService} from '../../utils/native/AppTokensService';
// // eslint-disable-next-line no-unused-vars
// import {OfflineDatabaseService} from '../../utils/native/OfflineDatabaseService';
import {AppToken} from '../../utils/native/AppToken';
import {DATABASE_MODE_OFFLINE} from '../constants/DatabaseModeStates';
import {REGISTRATION_AWAIT, REGISTRATION_IN_PROCESS} from '../constants/RegistrationStates';

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
    const [userPasswordConfirmation, setUserPasswordConfirmation] = useState('');
    const [userRegistrationMasterPassword, setUserRegistrationMasterPassword] = useState('');
    const [userRegistrationMasterPasswordConfirmation, setUserRegistrationMasterPasswordConfirmation] = useState('');
    const [registrationState, setRegistrationState] = useState(REGISTRATION_AWAIT);
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
    const handleUserPasswordConfirmation = value => {
        setUserPasswordConfirmation(value);
    };
    const handleUserRegistrationMasterPassword = value => {
        setUserRegistrationMasterPassword(value);
    };
    const handleUserRegistrationMasterPasswordConfirmation = value => {
        setUserRegistrationMasterPasswordConfirmation(value);
    };

    const checkCsrfMismatch = error => {
        return error?.response?.data?.message === 'CSRF token mismatch.';
    };

    const signupValidator = () => {
        const signUpErrors = {};
        const signUpWarnings = {};
        if (userNameInput.length < 1) {
            signUpErrors.userName = ['User Name is empty'];
        }
        const emailReg = /.+?@.+\..+/;
        if (!userEmail.match(emailReg)) {
            signUpErrors.userEmail = ['Incorrect email'];
        }
        if (userPassword.length < 1) {
            signUpErrors.userPassword = ['Password is empty'];
        } else if (userPassword !== userPasswordConfirmation) {
            signUpErrors.userPasswordConfirmation = ['Password Confirmation mismatch to Password'];
        }
        if (userRegistrationMasterPassword.length < 1) {
            signUpErrors.userRegistrationMasterPassword = ['Master Password is empty'];
        } else if (userRegistrationMasterPassword !== userRegistrationMasterPasswordConfirmation) {
            signUpErrors.userRegistrationMasterPasswordConfirmation = [
                'Master Password Confirmation mismatch to Master Password',
            ];
        } else if (userRegistrationMasterPassword === userPassword) {
            signUpWarnings.userRegistrationMasterPassword = ['Master Password is identical to Password'];
        }
        return {
            signUpErrors: signUpErrors,
            signUpWarnings: signUpWarnings,
        };
    };
    const signup = () => {
        // CSRF COOKIE
        // axios.get(hostURL + "/sanctum/csrf-cookie")
        if (registrationState === REGISTRATION_IN_PROCESS) {
            return;
        }
        setRegistrationState(REGISTRATION_IN_PROCESS);
        CSRF().then(
            () => {
                axios
                    .post(
                        getUrlSingUp(),
                        {
                            user: {
                                username: userNameInput,
                                email: userEmail,
                                password: userPassword,
                                password_confirmation: userPasswordConfirmation,
                                master_password: userRegistrationMasterPassword,
                                master_password_confirmation: userRegistrationMasterPasswordConfirmation,
                            },
                        },
                        {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                            },
                        },
                    )
                    .then(
                        () => {
                            setRegistrationState(REGISTRATION_AWAIT);
                            setAuthLoginStatus(AUTH_LOGIN_AWAIT);
                            if (authMode === AUTH_MODE_BEARER_TOKEN) {
                                getUser(true);
                            } else {
                                setAuthStatus('');
                                navigate('/identity/loading');
                            }
                        },
                        // SIGNUP ERROR
                        error => {
                            setRegistrationState(REGISTRATION_AWAIT);
                            //console.log(error);
                            if (checkCsrfMismatch(error)) {
                                Cookies.remove('XSRF-TOKEN', {path: ''});
                                //console.log(Cookies.get());
                            }
                            let errorMessages = [];
                            if (error?.response?.data?.errors) {
                                if (error.response.data.errors['user.name']) {
                                    errorMessages = errorMessages.concat(error.response.data.errors['user.name']);
                                }
                                if (error.response.data.errors['user.email']) {
                                    errorMessages = errorMessages.concat(error.response.data.errors['user.email']);
                                }
                                if (error.response.data.errors['user.password']) {
                                    errorMessages = errorMessages.concat(error.response.data.errors['user.password']);
                                }
                                if (error.response.data.errors['user.password_confirmation']) {
                                    errorMessages = errorMessages.concat(
                                        error.response.data.errors['user.password_confirmation'],
                                    );
                                }
                                if (error.response.data.errors['user.master_password']) {
                                    errorMessages = errorMessages.concat(
                                        error.response.data.errors['user.master_password'],
                                    );
                                }
                                if (error.response.data.errors['user.master_password_confirmation']) {
                                    errorMessages = errorMessages.concat(
                                        error.response.data.errors['user.master_password_confirmation'],
                                    );
                                }
                            }
                            if (errorMessages.length > 0) {
                                setErrorMessage(errorMessages.join('\r\n'));
                            } else if (error?.response?.data?.message) {
                                setErrorMessage(error.response.data.message);
                            } else if (error?.message) {
                                setErrorMessage(error.message);
                            } else {
                                setErrorMessage('Could not complete the sign up');
                            }
                        },
                    );
            },
            // COOKIE ERROR
            () => {
                setErrorMessage('Could not complete the sign up');
                setRegistrationState(REGISTRATION_AWAIT);
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
        setUserAppToken(null);
        axios.defaults.headers.common = {};
        // axios.interceptors.request.use(() => {})
    };

    const _setTokenFromResponse = response => {
        const token = response.data.token;
        const user = response.data.user;
        let appToken = null;
        try {
            appToken = new AppToken(user.user_id, user.email, user.name, hostURL, token, user.is_admin);
        } catch (error) {
            return;
        }

        appTokensService.addToken(appToken).then(
            () => {
                activateUserToken(appToken);
                changeAuthStatusLoggedIn();
            },
            error => {
                setAuthLoginStatus(AUTH_LOGIN_AWAIT);
                console.log('appTokensService.addToken', error);
            },
        );
    };
    const getUserToken = async () => {
        const clientId = await getClientId();
        axios
            .post(hostURL + '/identity/api/token', {
                token_name: clientId,
            })
            .then(
                response => {
                    _setTokenFromResponse(response);

                    // console.log('cookies', Cookies.get());
                },
                // error => {
                //     // console.log('getTokenError', error)
                // },
            );
    };

    const CSRF = () => {
        return new Promise((resolve, reject) => {
            //console.log('csrf current:', Cookies.get('XSRF-TOKEN'));
            if (Cookies.get('XSRF-TOKEN')) {
                typeof resolve === 'function' && resolve(null);
                return;
            }
            axios.get(getUrlCsrf()).then(
                response => {
                    //console.log('csrf', response);
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
    const getUrlSingUp = useCallback(() => {
        return hostURL + '/identity/api/registration';
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
        const loginRequestData = {
            email: userEmail,
            password: userPassword,
        };
        const loginRequest = () => {
            CSRF().then(
                () => {
                    console.log('.login');
                    // console.log('crf login', response)
                    // console.log(userEmail)
                    // console.log(userPassword)
                    // LOGIN
                    axios.post(getUrlLogin(), loginRequestData).then(
                        r => {
                            console.log(r, authMode);
                            // console.log('login', 'logged', authMode);
                            // console.log(authMode === AUTH_MODE_BEARER_TOKEN, r.data?.token,  r.data?.user);
                            if (authMode === AUTH_MODE_BEARER_TOKEN) {
                                if (r.data?.token && r.data?.user) {
                                    _setUserFromResponse(r);
                                    _setTokenFromResponse(r);
                                } else {
                                    setAuthLoginStatus(AUTH_LOGIN_AWAIT);
                                    getUser(true);
                                }
                            } else {
                                setAuthLoginStatus(AUTH_LOGIN_AWAIT);
                                setAuthStatus('');
                                navigate('/identity/loading');
                            }
                        },
                        // LOGIN ERROR
                        error => {
                            console.log(error);
                            setAuthLoginStatus(AUTH_LOGIN_AWAIT);
                            if (checkCsrfMismatch(error)) {
                                Cookies.remove('XSRF-TOKEN');
                            }
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
        if (authMode === AUTH_MODE_BEARER_TOKEN) {
            getClientId().then(
                clientId => {
                    loginRequestData.token_is_required = true;
                    loginRequestData.token_name = clientId;
                    loginRequest();
                },
                error => {
                    console.log('error getting ClientId: ' + error);
                },
            );
        } else {
            loginRequest();
        }
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

    const _setUserFromResponse = response => {
        setUserId(response.data.user.user_id);
        setUserName(response.data.user.name);
        setUserEmail(response.data.user.email);
        setUserIsAdmin(response.data.user.is_admin === '1');
    };
    const getUser = (getToken = true) => {
        changeAuthStatusLoading();
        CSRF().then(
            () =>
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
                                _setUserFromResponse(response);
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
            error => console.log('getUser csrf error', error),
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
            const validUrl = [getUrlLogin(), getUrlLogout(), getUrlCsrf(), getUrlUser(), getUrlSingUp()];

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
    }, [authStatus, getUrlCsrf, getUrlLogin, getUrlLogout, getUrlUser, getUrlSingUp]);

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
                userPasswordConfirmation,
                userRegistrationMasterPassword,
                userRegistrationMasterPasswordConfirmation,
                userIsAdmin,
                getUsers,
                handleUserNameInput,
                handleUserEmail,
                handleUserPassword,
                handleUserPasswordConfirmation,
                handleUserRegistrationMasterPassword,
                handleUserRegistrationMasterPasswordConfirmation,
                handleHostURL,
                signup,
                signupValidator,
                registrationState,
                setRegistrationState,
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
