import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import KanbanColumn from '../components/ui/KanbanColumn';
import KanbanCard from '../components/ui/KanbanCard';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const COLUMNS = ['To Do', 'In Progress', 'Completed'];

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', project: '', assignedTo: '' });
  const [editingTask, setEditingTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/tasks`, config),
        axios.get(`${import.meta.env.VITE_API_URL}/projects`, config),
        axios.get(`${import.meta.env.VITE_API_URL}/users`, config)
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
      if (projectsRes.data.length > 0) {
        setNewTask(prev => ({ ...prev, project: projectsRes.data[0]._id }));
      }
    } catch (error) {
      console.error('Error fetching data', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id; // over.id is the column name (To Do, In Progress, Completed)
    
    const task = tasks.find(t => t._id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistic update
    setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, { status: newStatus }, config);
    } catch (error) {
      console.error('Error updating status', error);
      toast.error('Failed to update task status');
      // Revert on failure
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: task.status } : t));
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.project) {
      toast.error('Please fill in required fields');
      return;
    }
    
    setCreating(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = { ...newTask };
      if (!payload.assignedTo) delete payload.assignedTo;

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/tasks`, payload, config);
      
      // We need to fetch tasks again to get populated user data or manually populate
      fetchData();
      
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', priority: 'Medium', project: projects[0]?._id || '', assignedTo: '' });
      toast.success('Task created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!editingTask.title || !editingTask.project) return;
    
    setUpdating(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = { ...editingTask };
      if (!payload.assignedTo) payload.assignedTo = null; // Unassign if empty

      await axios.put(`${import.meta.env.VITE_API_URL}/tasks/${editingTask._id}`, payload, config);
      fetchData(); // Refresh tasks
      setIsEditModalOpen(false);
      setEditingTask(null);
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${id}`, config);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-[calc(100vh-8rem)] flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Board View</h1>
          <p className="text-sm text-gray-500 mt-1">Manage tasks across all your projects</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="gap-2 hidden sm:flex">
            <SlidersHorizontal size={16} />
            Filter
          </Button>
          {user.role === 'Admin' && (
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus size={18} />
              New Task
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 h-full min-w-max">
            {COLUMNS.map((col) => {
              const columnTasks = tasks.filter(t => t.status === col);
              return (
                <KanbanColumn key={col} id={col} title={col} count={columnTasks.length}>
                  {columnTasks.map(task => (
                    <KanbanCard 
                      key={task._id} 
                      task={task} 
                      user={user}
                      onEdit={() => {
                        setEditingTask({
                          ...task,
                          project: task.project?._id || '',
                          assignedTo: task.assignedTo?._id || ''
                        });
                        setIsEditModalOpen(true);
                      }}
                      onDelete={() => handleDeleteTask(task._id)}
                    />
                  ))}
                </KanbanColumn>
              );
            })}
          </div>
        </DndContext>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateTask} className="space-y-4 mt-2">
          <Input
            label="Task Title *"
            placeholder="e.g. Design Landing Page"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Project *</label>
            <select
              className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer appearance-none"
              value={newTask.project}
              onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
              required
            >
              <option value="" disabled>Select a project</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
            <select
              className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer appearance-none"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign To</label>
            <select
              className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer appearance-none"
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
            >
              <option value="">Unassigned</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none h-24 placeholder:text-gray-400"
              placeholder="Add details about this task..."
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={creating}>
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Task">
        {editingTask && (
          <form onSubmit={handleUpdateTask} className="space-y-4 mt-2">
            <Input
              label="Task Title *"
              placeholder="e.g. Design Landing Page"
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Project *</label>
              <select
                className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer appearance-none"
                value={editingTask.project}
                onChange={(e) => setEditingTask({ ...editingTask, project: e.target.value })}
                required
              >
                <option value="" disabled>Select a project</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
              <select
                className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer appearance-none"
                value={editingTask.priority}
                onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select
                className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer appearance-none"
                value={editingTask.status}
                onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign To</label>
              <select
                className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer appearance-none"
                value={editingTask.assignedTo}
                onChange={(e) => setEditingTask({ ...editingTask, assignedTo: e.target.value })}
              >
                <option value="">Unassigned</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none h-24 placeholder:text-gray-400"
                placeholder="Add details about this task..."
                value={editingTask.description}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              ></textarea>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <Button variant="ghost" type="button" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={updating}>
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </motion.div>
  );
};

export default Tasks;
