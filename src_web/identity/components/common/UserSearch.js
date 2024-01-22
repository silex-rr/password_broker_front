import React, {useState} from 'react';
import UserSearchSuggestions from './UserSearchSuggestions';

const UserSearch = ({suggestionOnClick = () => {}, buttons = []}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchTermChange = e => {
        setSearchTerm(e.target.value);
    };

    return (
        <React.Fragment>
            <label htmlFor="UserSearch">Search: </label>
            <input
                id="UserSearch"
                type="text"
                className="input input-bordered input-xs w-full max-w-xs text-slate-800"
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
