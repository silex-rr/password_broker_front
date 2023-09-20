const SearchField = ({handleSearch, searchRequest, setSearchRequest}) => {
    return (
        <form onSubmit={handleSearch}>
            <input
                type="text"
                value={searchRequest}
                onChange={e => setSearchRequest(e.target.value)}
                placeholder="Search"
                className="input input-bordered w-24 md:w-auto"
            />
            <button type="submit" className="btn btn-ghost text-xl normal-case" />
        </form>
    );
};

export default SearchField;
