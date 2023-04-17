import {useContext, useEffect} from "react";
import {PasswordBrokerContext} from "../../contexts/PasswordBrokerContext";
import {
    ENTRY_GROUP_LOADED,
    ENTRY_GROUP_LOADING,
    ENTRY_GROUP_NOT_SELECTED,
    ENTRY_GROUP_REQUIRED_LOADING
} from "../../constants/EntryGroupStatus";
import EntryGroup from "./EntryGroup/EntryGroup";
import {ROLE_ADMIN, ROLE_MEMBER, ROLE_MODERATOR} from "../../constants/EntryGroupRole";
import {ENTRY_GROUP_MENU_MAIN, ENTRY_GROUP_MENU_SETTINGS, ENTRY_GROUP_MENU_USERS} from "../../constants/EntryGroupMenu";

const MainBody = () => {

    const passwordBrokerContext = useContext(PasswordBrokerContext)

    let body = '';
    let head = '';

    const {
        entryGroupData,
        entryGroupId,
        entryGroupStatus,
        setEntryGroupStatus,
        loadEntryGroup,
        setEntryGroupMenu,
        entryGroupMenu,
    } = passwordBrokerContext

    useEffect(() => {
        if (entryGroupStatus === ENTRY_GROUP_REQUIRED_LOADING) {
            setEntryGroupStatus(ENTRY_GROUP_LOADING)
            loadEntryGroup(entryGroupId)
        }
    }, [entryGroupStatus, entryGroupId, loadEntryGroup, setEntryGroupStatus])

    const menuClickHandler = (e) => {
        setEntryGroupMenu(e.target.id)
    }

    switch (entryGroupStatus) {
        default:
            break;
        case ENTRY_GROUP_LOADING:
        case ENTRY_GROUP_REQUIRED_LOADING:
            head = (<div className="px-5 py-3 ">loading</div>)
            body = ''
            break
        case ENTRY_GROUP_NOT_SELECTED:
            head = (<div className="px-5 py-3 ">Select an Entry Group</div>)
            body = ''
            break;
        case ENTRY_GROUP_LOADED:
            let menu = []
            let menu_selected = false;
            let selected = '';
            switch (entryGroupData.role.role) {
                case ROLE_ADMIN:
                    selected = ''
                    if (entryGroupMenu === ENTRY_GROUP_MENU_SETTINGS) {
                        selected = 'tab-active'
                        menu_selected = true
                    }
                    menu.push(
                        <span id={ENTRY_GROUP_MENU_SETTINGS} key={ENTRY_GROUP_MENU_SETTINGS}
                              onClick={menuClickHandler} className={"tab tab-lifted " + selected}>Settings</span>
                    )
                // eslint-disable-next-line no-fallthrough
                case ROLE_MODERATOR:
                    selected = ''
                    if (!menu_selected && entryGroupMenu === ENTRY_GROUP_MENU_USERS) {
                        selected = 'tab-active'
                        menu_selected = true
                    }
                    menu.push(
                        <span id={ENTRY_GROUP_MENU_USERS} key={ENTRY_GROUP_MENU_USERS}
                              onClick={menuClickHandler} className={"tab tab-lifted " + selected}>Users</span>
                    )
                // eslint-disable-next-line no-fallthrough
                default:
                case ROLE_MEMBER:
                    selected = ''
                    if (!menu_selected || entryGroupMenu === ENTRY_GROUP_MENU_MAIN) {
                        selected = 'tab-active'
                        menu_selected = true
                    }
                    menu.push(
                        <span id={ENTRY_GROUP_MENU_MAIN} key={ENTRY_GROUP_MENU_MAIN}
                              onClick={menuClickHandler} className={"tab tab-lifted " + selected}>Entry Group</span>
                    )
            }

            head = (
                <div className="w-full h-full flex flex-row">
                    <div className="px-5 py-3 basis-3/4">
                        {entryGroupData.entryGroup.name}
                    </div>
                    <div className="tabs basis-1/4">
                        {menu}
                    </div>
                </div>
            )
            body = <EntryGroup {...entryGroupData}/>
            break;
    }

    return (
        <div className="basis-3/4 h-full p-0 text-slate-100 bg-slate-600">
            <div className="grid grid-rows-3">
                <div className="p-0 row-span-3 text-2xl bg-slate-200 text-slate-700">{head}</div>
                <div className="p-5 row-span-3">{body}</div>
            </div>

        </div>
    )
}

export default MainBody
