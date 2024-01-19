import React from 'react';
import SearchResultEntry from './SearchResultEntry';
import {Text, View} from 'react-native-windows';
import {DataTable} from 'react-native-paper';
import tw from 'twrnc';

const SearchResultEntries = ({data}) => {
    const entries = [];
    for (let i = 0; i < data.length; i++) {
        entries.push(<SearchResultEntry key={'entry_' + i} {...data[i]} />);
    }

    const dataTableHeaderStyle = {borderColor: '#191e24', paddingHorizontal: 0};

    return (
        <View style={tw`w-full`}>
            <DataTable style={dataTableHeaderStyle}>
                <DataTable.Header style={tw`p-0`}>
                    <DataTable.Title style={tw`bg-slate-900 pl-4`}>
                        <Text style={tw`text-slate-200`}>Entry title</Text>
                    </DataTable.Title>
                    <DataTable.Title style={tw`bg-slate-900 pl-4`}>
                        <Text style={tw`text-slate-200`}>Entry Group</Text>
                    </DataTable.Title>
                    <DataTable.Title style={tw`bg-slate-900 pl-4`}>
                        <Text style={tw`text-slate-200`}>Created at</Text>
                    </DataTable.Title>
                    <DataTable.Title style={tw`bg-slate-900 pl-4`}>
                        <Text style={tw`text-slate-200`}>Updated at</Text>
                    </DataTable.Title>
                </DataTable.Header>
                {entries}
            </DataTable>
        </View>
    );
};

export default SearchResultEntries;
