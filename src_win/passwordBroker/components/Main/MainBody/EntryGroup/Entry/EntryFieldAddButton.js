import {Pressable} from 'react-native-windows';
import React, {useContext} from 'react';
import AppContext from '../../../../../../AppContext';
import EntryFieldAdd from './EntryFieldAdd';
import EntryFieldContext from '../../../../../../../src_shared/passwordBroker/contexts/EntryFieldContext';
// eslint-disable-next-line max-len
import {FIELD_ADDING_EDITING} from '../../../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldAddingStates';

const EntryFieldAddButton = ({entryGroupId, entryId, entryTitle, setEntryFieldsStatus, children}) => {
    const {modalShow} = useContext(AppContext);

    const {beforeModalOpen, setAddingFieldState} = useContext(EntryFieldContext);

    const openModal = () => {
        beforeModalOpen();
        setAddingFieldState(FIELD_ADDING_EDITING);
        modalShow(
            <EntryFieldAdd
                entryGroupId={entryGroupId}
                entryId={entryId}
                entryTitle={entryTitle}
                setEntryFieldsStatus={setEntryFieldsStatus}
            />,
            {width: 700},
        );
    };

    return <Pressable onPress={openModal}>{children}</Pressable>;
};

export default EntryFieldAddButton;
