import React, {useState} from "react";
import UserSearchSuggestions from "./UserSearchSuggestions";

const UserSearch = ({suggestionOnClick = () => {}, buttons = []}) => {

    const [searchTerm, setSearchTerm] = useState('')

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value)
    }

    return (
        <React.Fragment>
            <label htmlFor="UserSearch">Search: </label>
            <input id="UserSearch" type="text" onChange={handleSearchTermChange} value={searchTerm} />
            <UserSearchSuggestions searchTerm={searchTerm}
                                   suggestionOnClick={suggestionOnClick}
                                   buttons={buttons}
            />
        </React.Fragment>
    )
}

export default UserSearch