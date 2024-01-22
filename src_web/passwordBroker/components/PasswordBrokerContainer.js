import Container from '../../common/Container';
import MainLeftMenu from './MainLeftMenu';
import MainBody from './MainBody/MainBody';
import React from 'react';
import MainLeftBlock from '../../common/MainLeftBlock';
import MainBodyBlock from '../../common/MainBodyBlock';

const PasswordBrokerContainer = () => {
    return (
        <Container>
            <MainLeftBlock>
                <MainLeftMenu />
            </MainLeftBlock>
            <MainBodyBlock>
                <MainBody />
            </MainBodyBlock>
        </Container>
    );
};

export default PasswordBrokerContainer;
