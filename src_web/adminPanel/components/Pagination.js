const PaginationButton = ({currentPage = 1, lastPage = 1, handlePagination}) => {
    return (
        <div className="flex justify-center p-3">
            <div className="join">
                <button
                    className="btn btn-outline join-item"
                    disabled={currentPage === 1}
                    onClick={() => {
                        handlePagination(currentPage - 1);
                    }}>
                    «
                </button>
                {currentPage > 1 && (
                    <button className="btn btn-outline join-item" onClick={() => handlePagination(1)}>
                        1
                    </button>
                )}
                {currentPage > 2 && (
                    <button className="btn btn-outline join-item" disabled={true}>
                        ...
                    </button>
                )}
                <button
                    className="btn btn-outline join-item"
                    onClick={() => {
                        handlePagination(currentPage);
                    }}>
                    {currentPage}
                </button>
                {currentPage != lastPage && (
                    <button className="btn btn-outline join-item" disabled={true}>
                        ...
                    </button>
                )}
                {currentPage != lastPage && (
                    <button
                        className="btn btn-outline join-item"
                        onClick={() => {
                            handlePagination(lastPage);
                        }}>
                        {lastPage}
                    </button>
                )}
                <button
                    disabled={currentPage === lastPage}
                    onClick={() => {
                        handlePagination(currentPage + 1);
                    }}
                    className="btn btn-outline join-item">
                    »
                </button>
            </div>
        </div>
    );
};

export default PaginationButton;
