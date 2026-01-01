const express = require('express');
const Task = require('../models/Task');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { status, priority, assignedTo } = req.query;

        let query = {};

        if (req.user.role !== 'admin') {
            query.$or = [
                { createdBy: req.user._id },
                { assignedTo: req.user._id }
            ];
        }

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (assignedTo) query.assignedTo = assignedTo;

        const tasks = await Task.find(query)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Task.countDocuments(query);

        res.json({
            tasks,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { title, description, dueDate, priority, assignedTo } = req.body;

        const task = new Task({
            title,
            description,
            dueDate,
            priority: priority || 'medium',
            assignedTo,
            createdBy: req.user._id
        });

        await task.save();
        await task.populate('assignedTo', 'name email');
        await task.populate('createdBy', 'name email');

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { title, description, dueDate, priority, assignedTo, status } = req.body;

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.title = title || task.title;
        task.description = description !== undefined ? description : task.description;
        task.dueDate = dueDate || task.dueDate;
        task.priority = priority || task.priority;
        task.status = status || task.status;
        if (assignedTo !== undefined) task.assignedTo = assignedTo;

        await task.save();
        await task.populate('assignedTo', 'name email');
        await task.populate('createdBy', 'name email');

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'in-progress', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('assignedTo', 'name email').populate('createdBy', 'name email');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.patch('/:id/priority', auth, async (req, res) => {
    try {
        const { priority } = req.body;

        if (!['low', 'medium', 'high'].includes(priority)) {
            return res.status(400).json({ message: 'Invalid priority' });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { priority },
            { new: true }
        ).populate('assignedTo', 'name email').populate('createdBy', 'name email');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
