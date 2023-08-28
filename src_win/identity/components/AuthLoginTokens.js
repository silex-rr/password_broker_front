import {Alert, Text, View} from "react-native-windows";
import AuthLoginToken from "./AuthLoginToken";
import tw from "twrnc";
import React, {useContext} from "react";
import {IdentityContext} from "../../../src_shared/identity/contexts/IdentityContext";
import {Navigate, useLocation, useNavigate} from "react-router-dom";

const AuthLoginTokens = ({tokens, setTokens}) => {
    const {
        appTokensService,
        loginByToken,
        changeAuthStatusLoading,
    } = useContext(IdentityContext)

    const tokensView = []
    const navigate = useNavigate()
    const location = useLocation()
    for (let i = 0; i < tokens.length; i++) {

        const login = () => {
            // console.log('login by token', tokens[i].token)
            changeAuthStatusLoading()
            navigate("/identity/loading", location)
            loginByToken(tokens[i].token)
            // return (<Navigate to="/identity/loading" replace />)
        }
        const remove = () => {
            Alert.alert(
                    "Token deleting",
                `Are you sure you want to delete the Token for ${tokens[i].login}, ${tokens[i].url} ?`,
                [
                    {
                        text: 'YES',
                        onPress: () => {
                            appTokensService.removeTokenByParams(tokens[i].login, tokens[i].url).then(() => {
                                setTokens(appTokensService.getTokens())
                            })
                        }
                    },
                    {
                        text: 'NO'
                    },
                ]
            )
        }

        tokensView.push(<AuthLoginToken key={i} appToken={tokens[i]} login={login} remove={remove}/> )
    }

    return (
        <View style={tw`flex justify-center w-full mt-6`}>
            <View style={tw`mb-2`}>
                <Text style={tw`text-xl text-slate-700 text-center`}>active session{tokensView.length > 1 ? 's' : ''}:</Text>
            </View>
            {tokensView}
        </View>
    )
}

export default AuthLoginTokens