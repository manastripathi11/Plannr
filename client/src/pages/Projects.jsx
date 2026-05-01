import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, MoreVertical, Calendar, Users, FolderKanban, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, config);
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name) return;
    
    setCreating(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/projects`, newProject, config);
      setProjects([...projects, data]);
      setIsModalOpen(false);
      setNewProject({ name: '', description: '' });
      toast.success('Project created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
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
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all your team's workspaces and projects</p>
        </div>
        {user.role === 'Admin' && (
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus size={18} />
            New Project
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Card className="h-full flex flex-col group cursor-pointer hover:-translate-y-1 transition-all duration-300">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <FolderKanban size={20} />
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical size={20} />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-primary-600 transition-colors">{project.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 h-10">
                  {project.description || 'No description provided.'}
                </p>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.members?.slice(0, 3).map((member, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm" title={member.name}>
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {project.members?.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                      +{project.members.length - 3}
                    </div>
                  )}
                  {(!project.members || project.members.length === 0) && (
                    <Badge variant="default" className="flex items-center gap-1 font-medium px-2 py-0.5">
                      <Users size={12} /> Only you
                    </Badge>
                  )}
                </div>
                <div className="text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-300">
                  <ArrowRight size={20} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {user.role === 'Admin' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: projects.length * 0.05 }}
          >
            <Card 
              className="h-full min-h-[220px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-primary-300 cursor-pointer group"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary-500 mb-4 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all-smooth">
                <Plus size={28} />
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">Create new project</h3>
              <p className="text-sm text-gray-500 mt-1">Start a fresh workspace</p>
            </Card>
          </motion.div>
        )}

        {projects.length === 0 && user.role !== 'Admin' && (
          <div className="col-span-full py-16 flex flex-col items-center text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FolderKanban className="text-gray-400" size={36} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No projects assigned</h3>
            <p className="text-gray-500 text-sm max-w-sm">You haven't been added to any projects yet. Please contact your administrator.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input
            label="Project Name"
            placeholder="e.g. Website Redesign"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            required
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none h-24 placeholder:text-gray-400"
              placeholder="Brief description of the project..."
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={creating}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Projects;
