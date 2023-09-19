import Container from '../../common/Container';
import MainLeftMenu from './MainLeftMenu';
import MainBody from './MainBody/MainBody';
import React from 'react';

const PasswordBrokerContainer = () => {
    return (
        <Container>
            <MainLeftMenu />
            <MainBody />
        </Container>
    );
};

export default PasswordBrokerContainer;
