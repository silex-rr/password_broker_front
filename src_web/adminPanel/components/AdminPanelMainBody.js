import React from 'react';
import AdminPanelLeftMenu from './AdminPanelLeftMenu';
import AdminPanelRightMenu from './AdminPanelRightMenu';
import MainLeftBlock from '../../common/MainLeftBlock';
import MainBodyBlock from '../../common/MainBodyBlock';
const AdminPanelMainBody = props => {
    return (
        // <main className="mb-auto flex flex-grow flex-row flex-wrap">
        <React.Fragment>
            <MainLeftBlock>
                <AdminPanelLeftMenu />
            </MainLeftBlock>
            <MainBodyBlock>
                <AdminPanelRightMenu>{props.children}</AdminPanelRightMenu>
            </MainBodyBlock>
        </React.Fragment>

        // </main>
    );
};
export default AdminPanelMainBody;
