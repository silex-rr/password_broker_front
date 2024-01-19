import React, {useContext, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import PasswordBrokerContext from '../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import {
    ENTRY_SEARCH_RESULT_AWAIT,
    ENTRY_SEARCH_RESULT_LOADED,
    ENTRY_SEARCH_RESULT_LOADING,
    ENTRY_SEARCH_RESULT_REQUIRED_LOADING,
} from '../../../../src_shared/passwordBroker/constants/EntrySearchStates';
import SearchResultEntries from './SearchResultEntries';
import {Text, View} from 'react-native-windows';
import tw from 'twrnc';
// import PaginationButton from '../../common/Pagination';

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

    const handlePagination = page => {
        handleEntrySearch(page, entrySearchPerPage, searchQuery);
    };

    let data = '';

    switch (entrySearchState) {
        case ENTRY_SEARCH_RESULT_LOADING:
        case ENTRY_SEARCH_RESULT_REQUIRED_LOADING:
            data = '';
            break;
        case ENTRY_SEARCH_RESULT_AWAIT:
            data = '';
            break;
        case ENTRY_SEARCH_RESULT_LOADED:
            // const pagination = (
            //     <PaginationButton
            //         currentPage={entrySearchResult.current_page}
            //         lastPage={entrySearchResult.last_page}
            //         handlePagination={handlePagination}
            //     />
            // );
            data = (
                <React.Fragment>
                    {/*{pagination}*/}
                    <SearchResultEntries data={entrySearchResult.data} />
                    {/*{pagination}*/}
                </React.Fragment>
            );
            break;
    }

    return (
        <View style={tw`p-0 text-slate-100 bg-slate-600 w-full shrink`}>
            <View style={tw`p-0 bg-slate-200`}>
                <Text style={tw`w-full bg-slate-200 p-1 text-2xl text-slate-700`}>
                    Search results for: "{searchQuery}"
                </Text>
            </View>
            <View style={tw`p-5`}>{data}</View>
        </View>
    );
};

export default SearchResult;
