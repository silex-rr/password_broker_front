const PaginationButton = ({currentPage=1, lastPage=1, handlePagination}) => {
    return(
        <div className="flex justify-center p-3">
            <div className="join">
                <button className="join-item btn-outline btn" disabled={currentPage === 1} onClick={() => {handlePagination(currentPage-1)}}>«</button>
                {currentPage>1 &&
                    <button className="join-item btn-outline btn" onClick={() => handlePagination(1)}>1</button>
                }
                {currentPage>2 &&
                    <button className="join-item btn-outline btn" disabled={true}>...</button>
                }
                <button className="join-item btn-outline btn" onClick={() => {handlePagination(currentPage)}} >{currentPage}</button>
                { currentPage!=lastPage &&
                    <button className="join-item btn-outline btn" disabled={true}>...</button>
                }
                {currentPage!=lastPage &&
                    <button className="join-item btn-outline btn" onClick={() => {handlePagination(lastPage)}}>{lastPage}</button>
                }
                <button disabled={currentPage === lastPage} onClick={() => {handlePagination(currentPage+1)}} className="join-item btn-outline btn">»</button>
            </div>
        </div>
    )
}

export default PaginationButton