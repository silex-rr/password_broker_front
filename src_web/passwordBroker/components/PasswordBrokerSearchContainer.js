import Container from '../../common/Container';
import MainLeftMenu from './MainLeftMenu';
import React from 'react';
import SearchResult from './SearchResult';
import MainLeftBlock from '../../common/MainLeftBlock';
import MainBodyBlock from '../../common/MainBodyBlock';

const PasswordBrokerContainer = () => {
    return (
        <Container>
            <MainLeftBlock>
                <MainLeftMenu />
            </MainLeftBlock>
            <MainBodyBlock>
                <SearchResult />
            </MainBodyBlock>
        </Container>
    );
};

export default PasswordBrokerContainer;
