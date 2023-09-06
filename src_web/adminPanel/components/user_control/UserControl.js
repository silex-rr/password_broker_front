import Moment from "react-moment"
import { useContext, useEffect, useState } from "react"
import { IdentityContext } from "../../../../src_shared/identity/contexts/IdentityContext"
import { 
    USER_CONTROL_REQUIRE_LOADING, 
    USER_CONTROL_LOADED,
    USER_CONTROL_NOT_LOADED,
    USER_CONTROL_LOADING } from "./UserControlStatus"
import AdminPanelLoading from "../AdminPanelLoading";


const UserControl = () => {
    const {getUsers} = useContext(IdentityContext)

    const [userControlStatus, setUserControlStatus] = useState(USER_CONTROL_REQUIRE_LOADING)
    const [userControlData, setUserControlData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState()

    const getUsersPerPage = () => {
        setUserControlStatus(USER_CONTROL_LOADING)
        getUsers(currentPage).then((users) => {
            setLastPage(users.last_page)
            setUserControlData(users.data)
            setUserControlStatus(USER_CONTROL_LOADED)
        })
    }
    const handlePagination = (page) => {
        setCurrentPage(page)
        setUserControlStatus(USER_CONTROL_REQUIRE_LOADING)
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
        for (let i = 0; i<userControlData.length; i++) {
            users.push(userControlData[i])
        }
    } 
    return (
        <div className="overflow-x-auto">
             {userControlStatus != USER_CONTROL_LOADED &&
                <AdminPanelLoading />
            }  
            {userControlStatus === USER_CONTROL_LOADED &&
             <div>
                 <table className="table table-xs">
                    <thead>
                    <tr>
                        <th></th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Created At</th>
                    </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>{index+1 + ((currentPage > 1) ? (currentPage-1) * 20 : 0)}</td>
                                <td>{user.email}</td>
                                <td>{user.name}</td>
                                <td><Moment format="YYYY.MM.DD HH:mm">{user.created_at}</Moment></td>
                            </tr>
                        ))}
                    </tbody> 
                </table>
                    <div className="join">
                        <button className="join-item btn-outline btn" disabled={currentPage === 1} onClick={() => {handlePagination(currentPage-1)}}>«</button>
                        <button onClick={() => {handlePagination(currentPage)}} className="join-item btn-outline btn">{currentPage}</button>
                        <button disabled={currentPage === lastPage} onClick={() => {handlePagination(currentPage+1)}} className="join-item btn-outline btn">»</button>
                    </div>
             </div>
            }
        </div>
    )
}

export default UserControl