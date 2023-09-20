import {ClockLoader} from 'react-spinners';
const AdminPanelLoading = () => {
    return (
        <div key="empty_group_history">
            <div colSpan="100%" className="bg-slate-700 text-center text-slate-100">
                <div className="flex w-full items-center justify-center py-2">
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
    );
};

export default AdminPanelLoading;
