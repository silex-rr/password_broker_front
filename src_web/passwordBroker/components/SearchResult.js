import React, {useContext, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import PasswordBrokerContext from '../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import {
    ENTRY_SEARCH_RESULT_AWAIT,
    ENTRY_SEARCH_RESULT_LOADED,
    ENTRY_SEARCH_RESULT_LOADING,
    ENTRY_SEARCH_RESULT_REQUIRED_LOADING,
} from '../../../src_shared/passwordBroker/constants/EntrySearchStates';
import SearchResultEntries from './SearchResultEntries';

const SearchResult = () => {
    const {searchQuery: searchQuery} = useParams();

    const {
        entrySearchQuery,
        entrySearchPage,
        entrySearchPerPage,
        entrySearchState,
        entrySearchResult,
        getEntrySearchResult,
        handleEntrySearch,
    } = useContext(PasswordBrokerContext);

    useEffect(() => {
        if (entrySearchState === ENTRY_SEARCH_RESULT_REQUIRED_LOADING) {
            getEntrySearchResult(entrySearchPage, entrySearchPerPage, entrySearchQuery);
        }
    }, [entrySearchState, entrySearchQuery, entrySearchPage, entrySearchPerPage, getEntrySearchResult]);

    useEffect(() => {
        if (searchQuery !== entrySearchQuery) {
            handleEntrySearch(entrySearchPage, entrySearchPerPage, searchQuery);
        }
    }, [entrySearchPage, entrySearchPerPage, entrySearchQuery, handleEntrySearch, searchQuery]);


    let data = '';

    switch (entrySearchState) {
        case ENTRY_SEARCH_RESULT_LOADING:
        case ENTRY_SEARCH_RESULT_REQUIRED_LOADING:
            data = 'loading...';
            break;
        case ENTRY_SEARCH_RESULT_AWAIT:
            data = 'await';
            break;
        case ENTRY_SEARCH_RESULT_LOADED:
            console.log(entrySearchResult);
            console.log(entrySearchResult.data);
            data = <SearchResultEntries data={entrySearchResult.data} />;
            break;
    }

    return (
        <div className="basis-3/4 bg-slate-600 p-0 text-slate-100">
            <div className="grid grid-rows-3">
                <div className="row-span-3 p-5">{data}</div>
            </div>
        </div>
    );
};

export default SearchResult;
