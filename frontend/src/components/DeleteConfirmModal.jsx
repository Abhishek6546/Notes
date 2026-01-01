import React from 'react';

function DeleteConfirmModal({ taskTitle, message, onConfirm, onCancel }) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-body">
                    <div className="confirm-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3>Confirm Deletion</h3>
                    <p>{message || `Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`}</p>
                    <div className="confirm-actions">
                        <button className="btn btn-secondary" onClick={onCancel}>
                            Cancel
                        </button>
                        <button className="btn btn-danger" onClick={onConfirm}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmModal;
