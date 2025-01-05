import {Button} from 'react-daisyui';
import React, {useEffect, useState} from 'react';

const Confirmation = ({id, confirmRef, show, title, message, onConfirm, onCancel, confirmText, cancelText}) => {
    const [visible, setVisible] = useState(show ?? false);

    const controlled = confirmRef !== undefined;

    const onCanselClickHandler = () => {
        setVisible(false);
        if (onCancel && onCancel instanceof Function) {
            onCancel();
        }
    };

    const onConfirmClickHandler = () => {
        setVisible(false);
        onConfirm();
    };

    const id_ = id ?? 'confirmationModal-' + Math.random().toString(36).substring(2, 15);

    const openCloseModal = e => {
        if (!e.target.checked) {
            onCanselClickHandler();
        }
    };

    useEffect(() => {
        setVisible(show);
    }, [show]);

    return (
        <div className="m-0 p-0">
            <input
                type="checkbox"
                id={id_}
                className="modal-toggle"
                {...(controlled ? {ref: confirmRef} : {checked: visible, readOnly: true})}
                onChange={openCloseModal}
            />
            <label htmlFor={id_} className="modal cursor-pointer">
                <label className="modal-box relative w-1/3 max-w-none bg-slate-700 p-0" htmlFor="">
                    <h3 className="bg-slate-600 px-4 py-2 text-lg font-bold text-slate-200">{title}</h3>
                    <div className="px-2 py-4">
                        <div className="py-4">{message}</div>
                        <div className="modal-action flex flex-row justify-around">
                            <Button className={'btn-success btn-sm basis-1/3'} onClick={onConfirmClickHandler}>
                                {confirmText ?? 'confirm'}
                            </Button>

                            <Button
                                className="btn btn-outline btn-error btn-sm right-0 basis-1/3"
                                onClick={onCanselClickHandler}>
                                {cancelText ?? 'cansel'}
                            </Button>
                        </div>
                    </div>
                </label>
            </label>
        </div>
    );
};

export default Confirmation;
