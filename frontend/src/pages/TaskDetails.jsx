import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import TaskForm from '../components/TaskForm';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const API_URL = 'http://localhost:5000/api';

function TaskDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetchTask();
        fetchUsers();
    }, [id]);

    const fetchTask = async () => {
        try {
            const res = await axios.get(`${API_URL}/tasks/${id}`);
            setTask(res.data);
        } catch (error) {
            console.error('Error fetching task:', error);
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/users`);
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleUpdate = async (taskData) => {
        try {
            const res = await axios.put(`${API_URL}/tasks/${id}`, taskData);
            setTask(res.data);
            setEditing(false);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleStatusChange = async (status) => {
        try {
            const res = await axios.patch(`${API_URL}/tasks/${id}/status`, { status });
            setTask(res.data);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handlePriorityChange = async (priority) => {
        try {
            const res = await axios.patch(`${API_URL}/tasks/${id}/priority`, { priority });
            setTask(res.data);
        } catch (error) {
            console.error('Error updating priority:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}/tasks/${id}`);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return <div className="loading-screen"><div className="spinner"></div></div>;
    }

    if (!task) {
        return null;
    }

    return (
        <div className="task-details-page">
            <Link to="/dashboard" className="back-link">
                ← Back to Dashboard
            </Link>

            <div className="task-detail-card">
                <div className="task-detail-header">
                    <div>
                        <h1 className="task-detail-title">{task.title}</h1>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <span className={`priority-badge ${task.priority}`}>
                                {task.priority} priority
                            </span>
                            <span className={`task-status ${task.status}`}>
                                {task.status.replace('-', ' ')}
                            </span>
                        </div>
                    </div>
                    <div className="task-detail-actions">
                        <button className="btn btn-secondary" onClick={() => setEditing(true)}>
                            Edit
                        </button>
                        <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
                            Delete
                        </button>
                    </div>
                </div>

                <div className="task-detail-body">
                    <div className="detail-group">
                        <span className="detail-label">Description</span>
                        <p className="detail-value">{task.description || 'No description provided'}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div className="detail-group">
                            <span className="detail-label">Due Date</span>
                            <p className="detail-value">{formatDate(task.dueDate)}</p>
                        </div>

                        <div className="detail-group">
                            <span className="detail-label">Status</span>
                            <select
                                className="status-select"
                                value={task.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div className="detail-group">
                            <span className="detail-label">Priority</span>
                            <select
                                className="priority-select"
                                value={task.priority}
                                onChange={(e) => handlePriorityChange(e.target.value)}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="detail-group">
                            <span className="detail-label">Assigned To</span>
                            <p className="detail-value">{task.assignedTo?.name || 'Unassigned'}</p>
                        </div>

                        <div className="detail-group">
                            <span className="detail-label">Created By</span>
                            <p className="detail-value">{task.createdBy?.name}</p>
                        </div>

                        <div className="detail-group">
                            <span className="detail-label">Created At</span>
                            <p className="detail-value">{formatDate(task.createdAt)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {editing && (
                <TaskForm
                    task={task}
                    users={users}
                    onSubmit={handleUpdate}
                    onClose={() => setEditing(false)}
                />
            )}

            {showDeleteModal && (
                <DeleteConfirmModal
                    taskTitle={task.title}
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
}

export default TaskDetails;
