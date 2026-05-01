import Task from '../models/Task.js';

export const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    let query = {};
    if (projectId) {
      query.project = projectId;
    }
    const tasks = await Task.find(query).populate('assignedTo', 'name email').populate('project', 'name');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo, project } = req.body;
    const task = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      project,
    });
    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    
    // Allow members to update status. Only admins can update other fields easily, but for simplicity let's allow assigned members to update it.
    if (req.user.role === 'Member' && task.assignedTo?.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this task');
    }

    task.title = title || task.title;
    task.description = description || task.description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (assignedTo) task.assignedTo = assignedTo;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    next(error);
  }
};
