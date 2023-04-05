import {HiOutlineFolder, HiOutlineFolderAdd, HiOutlineFolderRemove} from "react-icons/hi";
import React, {useContext, useEffect, useState} from "react";
import {PasswordBrokerContext} from "../contexts/PasswordBrokerContext";
import {ENTRY_GROUP_REQUIRED_LOADING} from "../constants/EntryGroupStatus";
import {ROLE_ADMIN, ROLE_GUEST, ROLE_MEMBER, ROLE_MODERATOR} from "../constants/EntryGroupRole";

const MainLeftMenuTreeNode = (props) => {

    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const entryGroupId = props.entry_group_id;
    const {
        setEntryGroupId,
        setEntryGroupStatus,
        entryGroupTreesOpened,
        setEntryGroupTreesOpened,
        selectEntryGroup,
    } = passwordBrokerContext

    const [isOpened, setOpened] = useState(entryGroupTreesOpened.includes(entryGroupId))
    const includes = entryGroupTreesOpened.includes(entryGroupId);

    if (isOpened !== includes) {
        setOpened(includes)
    }

    const hasChildren = props.children.length > 0

    const children = []

    for (let i = 0; i < props.children.length; i++) {
        children.push(MainLeftMenuTreeNode(props.children[i]))
    }

    const handleOpening = () => {
        // console.log(entryGroupTreesOpened)
        if (isOpened) {
            entryGroupTreesOpened.filter(e => e !== entryGroupId)
        } else {
            entryGroupTreesOpened.push(entryGroupId)
        }
        setEntryGroupTreesOpened(entryGroupTreesOpened)
        setOpened(!isOpened)
        // console.log(entryGroupTreesOpened)
    }

    const handleOpenEntryGroup = () => {
        selectEntryGroup(entryGroupId)
    }

    let groupColor = 'text-slate-200';

    switch (props.role){
        default:
        case ROLE_GUEST:
            groupColor = 'text-slate-200';
            break;
        case ROLE_ADMIN:
            groupColor = 'text-yellow-600';
            break;
        case ROLE_MODERATOR:
            groupColor = 'text-sky-800';
            break;
        case ROLE_MEMBER:
            groupColor = 'text-green-800';
            break;
    }


    return (
        <li key={entryGroupId} className="pl-2 ml-2 border-slate-200 border-l border-dotted">
            <div className="tree-corner">
                {hasChildren
                    ?
                        <span onClick={handleOpening} className="inline-block cursor-pointer">
                            {isOpened
                                ? <HiOutlineFolderRemove className={"inline-block text-2xl mr-2 " + groupColor}/>
                                : <HiOutlineFolderAdd className={"inline-block text-2xl mr-2 " + groupColor}/>
                            }
                        </span>
                    : <HiOutlineFolder className={"inline-block text-2xl mr-2 " + groupColor}/>
                }
                {props.role === ROLE_GUEST
                    ? <span className="inline-block align-middle">{props.title}</span>
                    :
                    <span onClick={handleOpenEntryGroup} className="cursor-pointer">
                        <span className="inline-block align-middle">{props.title}</span>
                    </span>
                }
            </div>
            <ul className={(!isOpened ? "hidden": "")}>{children}</ul>
        </li>
    )
}

export default MainLeftMenuTreeNode