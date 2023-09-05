import Moment from "react-moment"
import { useContext, useEffect, useState } from "react"
import { IdentityContext } from "../../../../src_shared/identity/contexts/IdentityContext"
import { 
    USER_CONTROL_REQUIRE_LOADING, 
    USER_CONTROL_LOADED,
    USER_CONTROL_NOT_LOADED,
    USER_CONTROL_LOADING } from "./UserControlStatus"
import {ClockLoader} from "react-spinners";


const UserControl = () => {
    const {getUsers} = useContext(IdentityContext)
    getUsers().then((data) => {console.log(typeof getUsers, data)})

    const [userControlStatus, setUserControlStatus] = useState(USER_CONTROL_REQUIRE_LOADING)
    const [userControlData, setUserControlData] = useState([])

    useEffect(() => {
        console.log(userControlStatus)
        if (userControlStatus === USER_CONTROL_LOADED
            || userControlStatus === USER_CONTROL_LOADING
        ) {return}
        setUserControlStatus(USER_CONTROL_LOADING)
        console.log('before the promise')
        getUsers().then((users) => {
            console.log('a')
            setUserControlData(users)
            setUserControlStatus(USER_CONTROL_LOADED)
        })
    }, [setUserControlData, setUserControlStatus, userControlStatus])

    const users = []
    if (userControlStatus === USER_CONTROL_LOADED) {
        for (let i = 0; i<userControlData.length; i++) {
            console.log(userControlData[i])
            users.push(userControlData[i])
        }
    } 
    return (
        <div className="overflow-x-auto">
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
                    {userControlStatus != USER_CONTROL_LOADED &&
                        <tr key="empty_group_history">
                            <td colSpan="100%" className="bg-slate-700 text-slate-100 text-center">
                                <div className="w-full py-2 flex items-center justify-center">
                                    <ClockLoader
                                        color="#e2e8f0"
                                        size={18}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                        speedMultiplier={1}
                                    />
                                    <span className="px-1">loading...</span>
                                </div>
                            </td>
                        </tr>
                    }  
                    {users.map((user, index) => (
                        <tr>
                            <td>{index+1}</td>
                            <td>{user.email}</td> 
                            <td>{user.name}</td> 
                            <td><Moment format="YYYY.MM.DD HH:mm">{user.created_at}</Moment></td> 
                        </tr>
                    ))}
                </tbody> 
            </table>
        </div>
    )
}

export default UserControl