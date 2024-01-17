import React from 'react';

const PaginationButton = ({currentPage = 1, lastPage = 1, handlePagination}) => {
    if (lastPage <= 1) {
        return '';
    }
    const textColour = '!text-slate-200 disabled:!text-slate-400 ';
    return (
        <div className="flex justify-center p-3">
            <div className="join">
                <button
                    className={`btn btn-outline join-item btn-sm ${textColour}`}
                    disabled={currentPage === 1}
                    onClick={() => {
                        handlePagination(currentPage - 1);
                    }}>
                    «
                </button>
                {currentPage > 1 && (
                    <button
                        className={`btn btn-outline join-item btn-sm ${textColour}`}
                        onClick={() => handlePagination(1)}>
                        1
                    </button>
                )}
                {currentPage > 2 && (
                    <button className={`btn btn-outline join-item btn-sm ${textColour}`} disabled={true}>
                        ...
                    </button>
                )}
                <button
                    className={`btn btn-outline join-item btn-sm ${textColour}`}
                    onClick={() => {
                        handlePagination(currentPage);
                    }}>
                    {currentPage}
                </button>
                {currentPage !== lastPage && (
                    <button className={`btn btn-outline join-item btn-sm ${textColour}`} disabled={true}>
                        ...
                    </button>
                )}
                {currentPage !== lastPage && (
                    <button
                        className={`btn btn-outline join-item btn-sm ${textColour}`}
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
                    className={`btn btn-outline join-item btn-sm ${textColour}`}>
                    »
                </button>
            </div>
        </div>
    );
};

export default PaginationButton;
