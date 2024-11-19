import React, { ReactNode, useEffect } from 'react';
import './styles.scss';
import { IconX } from '../Icons/IconX';
import ReactDOM from 'react-dom';

interface ModalProps {
    show: boolean;
    width?: string;
    height?: string;
    title?: string | ReactNode;
    footer?: ReactNode;
    children: React.ReactNode;
    onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ show, width, height, title, children, onClose, footer }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleClose = () => {
        onClose();
    };

    const modalStyle = {
        width: width || 'auto',
        height: height || 'auto',
    };

    return show ? ReactDOM.createPortal(
        <div className={`modal-backdrop modal-open`}>
            <div className="modal" style={modalStyle}>
                <div className="modal-header">
                    <div
                        className="modal-title"
                        dangerouslySetInnerHTML={{ __html: String(title) }}
                    ></div>

                    <button className="close-button" onClick={handleClose}>
                        <IconX classes='w-6 h-6' />
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>

                {footer && <div className="modal-footer">
                    {footer}
                </div>}
            </div>
        </div>,
        document.body
    ) : null;
};
