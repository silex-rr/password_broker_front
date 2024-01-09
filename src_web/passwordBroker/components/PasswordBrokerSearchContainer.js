import Container from '../../common/Container';
import MainLeftMenu from './MainLeftMenu';
import React from 'react';
import SearchResult from './SearchResult';

const PasswordBrokerContainer = () => {
    return (
        <Container>
            <MainLeftMenu />
            <SearchResult />
        </Container>
    );
};

export default PasswordBrokerContainer;
