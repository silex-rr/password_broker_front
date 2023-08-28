import {useContext, useEffect, useState} from "react"
import debounce from "lodash/debounce"
import axios from "axios"
import {PasswordBrokerContext} from "../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext"

const UserSearchSuggestions = ({ searchTerm, suggestionOnClick, buttons }) => {
    const [suggestions, setSuggestions] = useState([])
    const [loading, setLoading] = useState(false)

    const passwordBrokerContext = useContext(PasswordBrokerContext)

    const {hostURL, entryGroupId} = passwordBrokerContext

    useEffect(() => {
        const abortController = new AbortController()

        const fetchSuggestions = debounce(async (searchTerm) => {
            setLoading(true)
            try {
                const response = await axios.get(
                    hostURL + `/identity/api/users/search?q=${searchTerm}&entryGroupExclude=${entryGroupId}`,
                    {signal: abortController.signal}
                )
                if (response.status === 200) {
                    setSuggestions(response.data.data)
                }
                setLoading(false)
            } catch (error) {
                setLoading(false)
                if (axios.isCancel(error)) {
                    console.log('Request cancelled by user')
                } else {
                    console.log('Error fetching search suggestions:', error)
                }
            }

        }, 500)
        if (searchTerm.length > 0) {
            fetchSuggestions(searchTerm)
        } else {
            setSuggestions([])
        }

        return () => {
            abortController.abort()
        }
    }, [searchTerm])

    return (
        <ul>
            {loading && <li>Loading...</li>}
            {!loading && searchTerm && !suggestions.length && (<li>... empty result</li>)}
            {!loading && suggestions.map((suggestion) => (
                <li
                    key={suggestion.user_id}
                    onClick={suggestionOnClick}
                    className="cursor-pointer"
                    data-user_id={suggestion.user_id}
                >{suggestion.name}
                    {buttons.map((button) => (button(suggestion.user_id)))}
                </li>
            ))}
        </ul>
    )
}

export default UserSearchSuggestions