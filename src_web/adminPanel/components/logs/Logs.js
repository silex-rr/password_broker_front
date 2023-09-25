import axios from "axios";
import { useEffect, useState, useContext } from "react";
import AppContext from "../../../AppContext";
import AdminPanelLoading from "../AdminPanelLoading";
import Moment from "react-moment";

const Logs = props => {
    const [requireLoading, setRequireLoading] = useState(true);
    const { hostURL } = useContext(AppContext);
    const [searchRequest, setSearchRequest] = useState('');
    const [logsData, setLogsData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
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
                resolve(response.data.data, console.log("resolved"))
            }, reject);
        });
    }

    useEffect(() => {
        if (requireLoading) {
            getLogsPerPage(currentPage).then(data => {
                setLogsData(data);
                setRequireLoading(false)
            })

        } else {
            return console.log("else");
        }
    }, [requireLoading, currentPage])

    const logs = []
    if (!requireLoading) {
        logsData.forEach((log) => logs.push(log))
    }
    console.log('logs', logs.length, requireLoading, logsData)
    return (
        <div>
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
                </div>
            )}
        </div>
    );
};

export default Logs;
