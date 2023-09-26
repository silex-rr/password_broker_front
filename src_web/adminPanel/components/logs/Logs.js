import axios from "axios";
import { useEffect, useState, useContext } from "react";
import AppContext from "../../../AppContext";
import AdminPanelLoading from "../AdminPanelLoading";
import Moment from "react-moment";
import PaginationButton from '../Pagination';
import SearchField from "../SearchField";

const Logs = props => {
    const [requireLoading, setRequireLoading] = useState(true);
    const { hostURL } = useContext(AppContext);
    const [searchRequest, setSearchRequest] = useState('');
    const [logsData, setLogsData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [perPage, setPerPage] = useState(20)

    const getLogsPerPage = (page) => {
        const req = [];
        if (page) {
            req.push(`page=${page}`);
        }
        if (perPage) {
            req.push(`perPage=${perPage}`);
        }
        if (searchRequest) {
            req.push(`q=${searchRequest}`);
        }
        const reqString = req.length > 0 ? '?' + req.join('&') : '';
        const url = hostURL + `/passwordBroker/api/entryGroup/history${reqString}`;

        return new Promise((resolve, reject) => {
            axios.get(url).then(response => {
                resolve(response.data)
            }, reject);
        });
    }

    const handlePagination = page => {
        setCurrentPage(page);
        setRequireLoading(true)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        console.log(searchRequest)
        if (searchRequest.trim() != '') {
            setCurrentPage(1);
            setRequireLoading(true)
        }
    }

    useEffect(() => {
        if (requireLoading) {
            getLogsPerPage(currentPage).then(data => {
                setLogsData(data.data);
                setLastPage(data.last_page)
                setRequireLoading(false)
            })

        } else {
            return;
        }
    }, [requireLoading, currentPage])

    const logs = []
    if (!requireLoading) {
        logsData.forEach((log) => logs.push(log))
    }
    // console.log('logs', logs.length, requireLoading, logsData)
    return (
        <div className="mx-auto overflow-x-auto">
            <div className="navbar bg-base-100">
                <SearchField
                    handleSearch={handleSearch}
                    searchRequest={searchRequest}
                    setSearchRequest={setSearchRequest}
                />
            </div>
            {requireLoading && <AdminPanelLoading />}
            {!requireLoading && (
                <div className="overflow-x-auto">
                    <table className="table table-xs p-3">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Date</th>
                                <th>Event type</th>
                                <th>Object</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, index) => (
                                <tr className="p-1 hover:bg-base-200" key={index}>
                                    <td>{index + 1 + (currentPage > 1 ? (currentPage - 1) * 20 : 0)}</td>
                                    <td><Moment format="YYYY.MM.DD HH:mm">{log.created_at}</Moment></td>
                                    <td>{log.event_type}</td>
                                    <td>{log.login}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <PaginationButton
                        currentPage={currentPage}
                        lastPage={lastPage}
                        handlePagination={handlePagination}
                    />
                </div>
            )}
        </div>
    );
};

export default Logs;
