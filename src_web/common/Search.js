import React, {useRef, useState} from 'react';
import {Input} from 'react-daisyui';
import {useNavigate} from 'react-router-dom';
import {MdKeyboardDoubleArrowRight, MdSearch} from 'react-icons/md';

const Search = () => {
    const [globalSearch, setGlobalSearch] = useState('');
    const globalSearchInput = useRef();
    const navigateFunction = useNavigate();
    const globalSearchChangeHandler = e => {
        setGlobalSearch(e.target.value);
    };

    const globalSearchActivate = () => {
        if (globalSearch.length > 0) {
            navigateFunction('/entrySearch/' + globalSearch);
        }
    };

    const focusOnGlobalSearch = () => {
        globalSearchInput.current.focus();
    };

    return (
        <div className="item-center m-0 flex justify-center rounded-sm bg-slate-800 p-0">
            <div className="h-full cursor-pointer px-2" onClick={focusOnGlobalSearch}>
                <MdSearch className="h-full text-3xl" />
            </div>
            <Input
                id="searchInput"
                ref={globalSearchInput}
                type="text"
                value={globalSearch}
                onChange={globalSearchChangeHandler}
                placeholder=""
                size="sm"
                className={
                    'h-full w-full rounded-none border-none bg-slate-800' +
                    ' align-top text-slate-200 placeholder-slate-300'
                }
                onKeyUp={event => {
                    if (event.code === 'Enter') {
                        globalSearchActivate();
                    }
                }}
            />
            <div
                className="h-full cursor-pointer px-2 hover:rounded-sm hover:bg-slate-600"
                onClick={globalSearchActivate}>
                <MdKeyboardDoubleArrowRight className="h-full text-3xl" />
            </div>
        </div>
    );
};

export default Search;
