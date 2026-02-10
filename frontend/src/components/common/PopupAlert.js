import React, { useEffect, useState, useRef } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import './PopupAlert.css';

const PopupAlert = ({ message, type = 'error', onClose, show = true, style = {} }) => {
    const [visible, setVisible] = useState(show);
    const alertRef = useRef(null);

    useEffect(() => {
        setVisible(show);
    }, [show]);

    useEffect(() => {
        if (visible && alertRef.current) {
            alertRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [visible]);

    if (!visible) return null;

    const handleClose = (e) => {
        e.stopPropagation();
        setVisible(false);
        if (onClose) onClose();
    };

    return (
        <div ref={alertRef} className={`popup-alert alert-message ${type}`} style={style}>
            <div className="alert-content">
                {message}
            </div>
            {onClose && (
                <button className="close-alert-btn" onClick={handleClose}>
                    <CloseOutlined />
                </button>
            )}
        </div>
    );
};

export default PopupAlert;
