import React from 'react';
import SearchResultEntry from './SearchResultEntry';

const SearchResultEntries = ({data}) => {
    const entries = [];
    for (let i = 0; i < data.length; i++) {
        entries.push(<SearchResultEntry {...data[i]} />);
    }
    console.log(data, entries);

    return (
        <div className="overflow-x-auto">
            <table className="table-compact table w-full">
                <thead>
                    <tr>
                        <th className="bg-slate-900 text-slate-200">Entry title</th>
                        <th className="bg-slate-900 text-slate-200">Entry Group</th>
                        <th className="bg-slate-900 text-slate-200">Created at</th>
                        <th className="bg-slate-900 text-slate-200">Updated at</th>
                    </tr>
                </thead>
                <tbody>{entries}</tbody>
            </table>
        </div>
    );
};

export default SearchResultEntries;
