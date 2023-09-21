import React, {useState} from 'react';
import UserSearchSuggestions from './UserSearchSuggestions';
import {Input} from 'react-daisyui';

const UserSearch = ({suggestionOnClick = () => {}, buttons = []}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchTermChange = e => {
        setSearchTerm(e.target.value);
    };

    return (
        <React.Fragment>
            <label htmlFor="UserSearch">Search: </label>
            <Input
                id="UserSearch"
                type="text"
                className="input-sm"
                onChange={handleSearchTermChange}
                value={searchTerm}
            />
            <div className="mt-2">
                <UserSearchSuggestions
                    searchTerm={searchTerm}
                    suggestionOnClick={suggestionOnClick}
                    buttons={buttons}
                />
            </div>
        </React.Fragment>
    );
};

export default UserSearch;
