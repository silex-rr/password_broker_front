import {ClockLoader} from "react-spinners";
const AdminPanelLoading = () => {
    return(
        <div key="empty_group_history">
        <div colSpan="100%" className="bg-slate-700 text-slate-100 text-center">
            <div className="w-full py-2 flex items-center justify-center">
                <ClockLoader
                    color="#e2e8f0"
                    size={25}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    speedMultiplier={1}
                />
                <span className="px-1">loading...</span>
            </div>
        </div>
    </div>
    )
}

export default AdminPanelLoading