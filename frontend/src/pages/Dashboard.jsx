import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskForm from '../components/TaskForm';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const API_URL = 'http://localhost:5000/api';

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('board');
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [deleteTask, setDeleteTask] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
    const navigate = useNavigate();

    const fetchTasks = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/tasks?page=${page}&limit=50`);
            setTasks(res.data.tasks);
            setPagination(res.data.pagination);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/users`);
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, [fetchTasks]);

    const handleCreateTask = async (taskData) => {
        try {
            await axios.post(`${API_URL}/tasks`, taskData);
            fetchTasks();
            setShowTaskForm(false);
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleUpdateTask = async (taskData) => {
        try {
            await axios.put(`${API_URL}/tasks/${editingTask._id}`, taskData);
            fetchTasks();
            setEditingTask(null);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async () => {
        try {
            await axios.delete(`${API_URL}/tasks/${deleteTask._id}`);
            fetchTasks();
            setDeleteTask(null);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleStatusChange = async (taskId, status) => {
        try {
            await axios.patch(`${API_URL}/tasks/${taskId}/status`, { status });
            fetchTasks();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handlePriorityChange = async (taskId, priority) => {
        try {
            await axios.patch(`${API_URL}/tasks/${taskId}/priority`, { priority });
            fetchTasks();
        } catch (error) {
            console.error('Error updating priority:', error);
        }
    };

    const getTasksByPriority = (priority) => tasks.filter(t => t.priority === priority);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
    };

    const TaskCard = ({ task }) => (
        <div
            className="task-card"
            onClick={() => navigate(`/task/${task._id}`)}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('taskId', task._id)}
        >
            <div className="task-card-header">
                <span className="task-title">{task.title}</span>
                <span className={`task-status ${task.status}`}>
                    {task.status.replace('-', ' ')}
                </span>
            </div>
            {task.description && (
                <p className="task-description">{task.description}</p>
            )}
            <div className="task-meta">
                <span className={`task-due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
                    📅 {formatDate(task.dueDate)}
                </span>
                {task.assignedTo && (
                    <div className="task-assignee">
                        <div className="assignee-avatar">
                            {task.assignedTo.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const PriorityColumn = ({ priority, label, tasks }) => (
        <div
            className={`priority-column ${priority}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault();
                const taskId = e.dataTransfer.getData('taskId');
                handlePriorityChange(taskId, priority);
            }}
        >
            <div className="column-header">
                <div className="column-title">
                    <span className={`priority-dot ${priority}`}></span>
                    {label}
                </div>
                <span className="task-count">{tasks.length}</span>
            </div>
            <div className="task-list">
                {tasks.map(task => (
                    <TaskCard key={task._id} task={task} />
                ))}
            </div>
        </div>
    );

    if (loading && tasks.length === 0) {
        return <div className="loading-screen"><div className="spinner"></div></div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Task Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="view-toggle">
                        <button
                            className={`view-btn ${view === 'board' ? 'active' : ''}`}
                            onClick={() => setView('board')}
                        >
                            Board
                        </button>
                        <button
                            className={`view-btn ${view === 'list' ? 'active' : ''}`}
                            onClick={() => setView('list')}
                        >
                            List
                        </button>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowTaskForm(true)}>
                        + New Task
                    </button>
                </div>
            </div>

            {view === 'board' ? (
                <div className="priority-board">
                    <PriorityColumn
                        priority="high"
                        label="High Priority"
                        tasks={getTasksByPriority('high')}
                    />
                    <PriorityColumn
                        priority="medium"
                        label="Medium Priority"
                        tasks={getTasksByPriority('medium')}
                    />
                    <PriorityColumn
                        priority="low"
                        label="Low Priority"
                        tasks={getTasksByPriority('low')}
                    />
                </div>
            ) : (
                <div className="list-view">
                    <div className="list-header">
                        <span>Title</span>
                        <span>Priority</span>
                        <span>Status</span>
                        <span>Due Date</span>
                        <span>Assignee</span>
                        <span>Actions</span>
                    </div>
                    {tasks.map(task => (
                        <div key={task._id} className="list-item" onClick={() => navigate(`/task/${task._id}`)}>
                            <span className="task-title">{task.title}</span>
                            <span>
                                <span className={`priority-badge ${task.priority}`}>
                                    {task.priority}
                                </span>
                            </span>
                            <span>
                                <select
                                    className="status-select"
                                    value={task.status}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </span>
                            <span className={isOverdue(task.dueDate) ? 'task-due-date overdue' : ''}>
                                {formatDate(task.dueDate)}
                            </span>
                            <span>{task.assignedTo?.name || '-'}</span>
                            <span>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingTask(task);
                                    }}
                                >
                                    Edit
                                </button>
                            </span>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="empty-state">
                            <h3>No tasks found</h3>
                            <p>Create your first task to get started</p>
                        </div>
                    )}
                    {pagination.pages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-btn"
                                disabled={pagination.current === 1}
                                onClick={() => fetchTasks(pagination.current - 1)}
                            >
                                Previous
                            </button>
                            {Array.from({ length: pagination.pages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    className={`pagination-btn ${pagination.current === i + 1 ? 'active' : ''}`}
                                    onClick={() => fetchTasks(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                className="pagination-btn"
                                disabled={pagination.current === pagination.pages}
                                onClick={() => fetchTasks(pagination.current + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}

            {(showTaskForm || editingTask) && (
                <TaskForm
                    task={editingTask}
                    users={users}
                    onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                    onClose={() => {
                        setShowTaskForm(false);
                        setEditingTask(null);
                    }}
                />
            )}

            {deleteTask && (
                <DeleteConfirmModal
                    taskTitle={deleteTask.title}
                    onConfirm={handleDeleteTask}
                    onCancel={() => setDeleteTask(null)}
                />
            )}
        </div>
    );
}

export default Dashboard;
