import Project from '../models/Project.js';
import Task from '../models/Task.js';

export const getProjects = async (req, res, next) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      projects = await Project.find({}).populate('members', 'name email');
    } else {
      projects = await Project.find({ members: req.user._id }).populate('members', 'name email');
    }
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { name, description, members } = req.body;
    const project = new Project({
      name,
      description,
      members,
      createdBy: req.user._id,
    });
    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('members', 'name email');
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { name, description, members } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    project.name = name || project.name;
    project.description = description || project.description;
    if (members) project.members = members;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    await Task.deleteMany({ project: req.params.id });
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    next(error);
  }
};
