import Head from './Head';
import Footer from './Footer';
import MasterPasswordModal from './MasterPasswordModal';
import React from 'react';

const Container = props => {
    return (
        <div className="flex h-screen w-full flex-col">
            <Head />
            <main className="mb-auto flex flex-grow flex-row flex-wrap">{props.children}</main>
            <Footer />
            <MasterPasswordModal />
        </div>
    );
};

export default Container;
