import Moment from "react-moment"
import { useContext, useEffect, useState } from "react"
import { IdentityContext } from "../../../../src_shared/identity/contexts/IdentityContext"
import { 
    USER_CONTROL_REQUIRE_LOADING, 
    USER_CONTROL_LOADED,
    USER_CONTROL_NOT_LOADED,
    USER_CONTROL_LOADING } from "./UserControlStatus"
import AdminPanelLoading from "../AdminPanelLoading";
import {FaEdit, FaTrashAlt} from "react-icons/fa";
import PaginationButton from "../Pagination";


const UserControl = () => {
    const {getUsers} = useContext(IdentityContext)

    const [userControlStatus, setUserControlStatus] = useState(USER_CONTROL_REQUIRE_LOADING)
    const [userControlData, setUserControlData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState()
    const [searchRequest, setSearchRequest] = useState('')
    const [usersPerPage, setUsersPerPage] = useState(20)

    const getUsersPerPage = () => {
        setUserControlStatus(USER_CONTROL_LOADING)
        getUsers(currentPage, usersPerPage, searchRequest).then((users) => {
            setLastPage(users.last_page)
            setUserControlData(users.data)
            setUserControlStatus(USER_CONTROL_LOADED)
        })
    }

    const handlePagination = (page) => {
        setCurrentPage(page)
        setUserControlStatus(USER_CONTROL_REQUIRE_LOADING)
    }

    const handleSearch = (request) => {
        request.preventDefault()
        if (searchRequest.trim() != '') {
            setCurrentPage(1)
            setUserControlStatus(USER_CONTROL_REQUIRE_LOADING)}
    }

    useEffect(() => {
        if (userControlStatus === USER_CONTROL_LOADED
            || userControlStatus === USER_CONTROL_LOADING
        ) {return}
        setUserControlStatus(USER_CONTROL_LOADING)
        getUsersPerPage(currentPage)
    }, [setUserControlData, setUserControlStatus, userControlStatus])

    const users = []
    if (userControlStatus === USER_CONTROL_LOADED) {
        userControlData.forEach((user) => {users.push(user)})
    } 
    return (
        <div className="overflow-x-auto mx-auto">
            <div className="navbar bg-base-100">
                    <form onSubmit={handleSearch}>
                        <input type="text" value={searchRequest} onChange={(e) => setSearchRequest(e.target.value)} placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                        <button type="submit" className="btn btn-ghost normal-case text-xl" />
                    </form>
            </div>
             {userControlStatus != USER_CONTROL_LOADED &&
                <AdminPanelLoading />
            }  
            {userControlStatus === USER_CONTROL_LOADED &&
             <div className="overflow-x-auto">
                 <table className="table p-3 table-xs">
                    <thead>
                    <tr>
                        <th></th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Created At</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr className="hover:bg-base-200 p-1" key={index}>
                                <td>{index+1 + ((currentPage > 1) ? (currentPage-1) * 20 : 0)}</td>
                                <td>{user.email}</td>
                                <td>{user.name}</td>
                                <td><Moment format="YYYY.MM.DD HH:mm">{user.created_at}</Moment></td>
                                <td><FaEdit /></td>
                                <td><FaTrashAlt /></td>
                            </tr>
                        ))}
                    </tbody> 
                </table>
                <PaginationButton currentPage={currentPage} lastPage={lastPage} handlePagination={handlePagination} />
             </div>
            }
        </div>
    )
}

export default UserControl