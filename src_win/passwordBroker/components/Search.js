import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
// import {MdKeyboardDoubleArrowRight, MdSearch} from 'react-icons/md';
import {TextInput, TouchableOpacity, View} from 'react-native-windows';
import tw from 'twrnc';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Search = () => {
    const [globalSearch, setGlobalSearch] = useState('');
    const globalSearchInput = useRef();
    const navigateFunction = useNavigate();
    const {searchQuery: searchQuery} = useParams();
    const globalSearchChangeHandler = value => {
        setGlobalSearch(value);
    };

    const globalSearchActivate = () => {
        if (globalSearch.length > 0) {
            navigateFunction('/entrySearch/' + globalSearch);
        }
    };

    const focusOnGlobalSearch = () => {
        globalSearchInput.current.focus();
    };

    useEffect(() => {
        if (typeof searchQuery === 'string') {
            setGlobalSearch(searchQuery);
        }
    }, [searchQuery, setGlobalSearch]);

    const iconColor = '#e2e8f0';

    return (
        <View style={tw`flex flex-row item-center m-0 flex justify-center rounded-sm bg-slate-800 p-0`}>
            <TouchableOpacity style={tw`px-2 py-1`} onPress={focusOnGlobalSearch}>
                <MaterialIcons name="search" size={24} color={iconColor} />
            </TouchableOpacity>
            <TextInput
                id="searchInput"
                ref={globalSearchInput}
                value={globalSearch}
                onChangeText={globalSearchChangeHandler}
                style={{borderBottomWidth: 0, ...tw`bg-slate-800 align-top text-slate-200 placeholder-slate-300`}}
                onKeyPress={e => {
                    if (e.nativeEvent.key === 'Enter') {
                        globalSearchActivate();
                    }
                }}
            />
            <TouchableOpacity style={tw`px-2 py-1`} onPress={globalSearchActivate}>
                <MaterialIcons name="keyboard-double-arrow-right" size={24} color={iconColor} />
            </TouchableOpacity>
        </View>
    );
};

export default Search;
