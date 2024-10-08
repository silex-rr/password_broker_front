import React, {useContext, useRef} from 'react';
import AppContext from '../../../../../../AppContext';
import GlobalContext from '../../../../../../../src_shared/common/contexts/GlobalContext';

const CopyToClipboard = ({value, style, children, message = undefined}) => {
    const {copyToClipboard} = useContext(AppContext);
    const {logActivityManual} = useContext(GlobalContext);
    const refTarget = useRef();
    const copyClickHandler = () => {
        if (value === '' || value === undefined) {
            return;
        }
        copyToClipboard(value);
        if (message) {
            logActivityManual(message);
        }
        const classList = refTarget.current.classList;
        classList.remove('opacity-0');
        setTimeout(() => {
            classList.add('transition-opacity', 'duration-1500', 'opacity-0');
        }, 300);
    };

    return (
        <div onClick={copyClickHandler} className="relative">
            <div className={`flex flex-row flex-wrap ${style ? style : ''}`}>
                <div ref={refTarget} className="absolute left-0 -ml-14 rounded bg-sky-200 px-1 opacity-0">
                    <span className="text-slate-800">copied</span>
                </div>
                {children}
            </div>
        </div>
    );
};

export default CopyToClipboard;
