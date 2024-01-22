import Moment from 'react-moment';
import { useContext, useEffect, useState } from 'react';
import IdentityContext from '../../../../src_shared/identity/contexts/IdentityContext';
import {
    USER_CONTROL_REQUIRE_LOADING,
    USER_CONTROL_LOADED,
    USER_CONTROL_NOT_LOADED,
    USER_CONTROL_LOADING,
} from './UserControlStatus';
import AdminPanelLoading from '../AdminPanelLoading';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import PaginationButton from '../../../common/Pagination';
import SearchField from '../SearchField';
import UserControlNavigation from './UserControlNagivation';
import AppContext from '../../../AppContext';
import axios from 'axios';

const UserControl = () => {
    const { getUsers } = useContext(IdentityContext);

    const [userControlStatus, setUserControlStatus] = useState(USER_CONTROL_REQUIRE_LOADING);
    const [userControlData, setUserControlData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState();
    const [searchRequest, setSearchRequest] = useState('');
    const [usersPerPage, setUsersPerPage] = useState(20);
    const { hostURL } = useContext(AppContext);

    const getUsersPerPage = () => {
        setUserControlStatus(USER_CONTROL_LOADING);
        getUsers(currentPage, usersPerPage, searchRequest).then(users => {
            setLastPage(users.last_page);
            setUserControlData(users.data);
            setUserControlStatus(USER_CONTROL_LOADED);
        });
    };

    const handlePagination = page => {
        setCurrentPage(page);
        setUserControlStatus(USER_CONTROL_REQUIRE_LOADING);
    };

    const handleSearch = request => {
        request.preventDefault();
        if (searchRequest.trim() != '') {
            setCurrentPage(1);
            setUserControlStatus(USER_CONTROL_REQUIRE_LOADING);
        }
    };

    const handleDelete = async (e, user) => {
        e.preventDefault()
        console.log('delete handler was triggered', user)
        if (confirm(`Are you sure you want to delete ${user.name}`) == true) {
            console.log('confirmed', user.user_id)
            try {
                await axios.delete(hostURL + `/identity/api/user/${user.user_id}`)
                alert('The user has been deleted successfully')
                setUserControlStatus(USER_CONTROL_REQUIRE_LOADING)
            } catch (error) {
                console.log(error)
                alert("There has been an error. Try again later")
            }
        }
    }

    useEffect(() => {
        if (userControlStatus === USER_CONTROL_LOADED || userControlStatus === USER_CONTROL_LOADING) {
            return;
        }
        setUserControlStatus(USER_CONTROL_LOADING);
        getUsersPerPage(currentPage);
    }, [setUserControlData, setUserControlStatus, userControlStatus]);

    const users = [];
    if (userControlStatus === USER_CONTROL_LOADED) {
        userControlData.forEach(user => {
            users.push(user);
        });
    }
    return (
        <div className="mx-auto overflow-x-auto">
            <div className="navbar bg-base-100">
                <SearchField
                    handleSearch={handleSearch}
                    searchRequest={searchRequest}
                    setSearchRequest={setSearchRequest}
                />
            </div>
            {userControlStatus != USER_CONTROL_LOADED && <AdminPanelLoading />}
            {userControlStatus === USER_CONTROL_LOADED && (
                <div className="overflow-x-auto">
                    <table className="table table-xs p-3">
                        <thead>
                            <tr>
                                <th />
                                <th>Email</th>
                                <th>Name</th>
                                <th>Created At</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr className="p-1 hover:bg-base-200" key={index}>
                                    <td>{index + 1 + (currentPage > 1 ? (currentPage - 1) * 20 : 0)}</td>
                                    <td>{user.email}</td>
                                    <td>{user.name}</td>
                                    <td>
                                        <Moment format="YYYY.MM.DD HH:mm">{user.created_at}</Moment>
                                    </td>
                                    <td>
                                        <UserControlNavigation
                                            path={`/admin/user_control/update/${user.user_id}`}
                                            name={<FaEdit />}
                                        />
                                    </td>
                                    <td>
                                        <button onClick={(e) => handleDelete(e, user)}>
                                            <FaTrashAlt />
                                        </button>
                                    </td>
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

export default UserControl;
