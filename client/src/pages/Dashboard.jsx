import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { CheckCircle2, Clock, AlertCircle, ListTodo, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, { status: newStatus }, config);
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      toast.success(`Task marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating status', error);
      toast.error(error.response?.data?.message || 'Failed to update task status');
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`, config);
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const todoTasks = tasks.filter(t => t.status === 'To Do').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  
  const now = new Date();
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Completed').length;

  const statsCards = [
    { title: 'Total Tasks', value: tasks.length, icon: ListTodo, color: 'text-primary-600', bg: 'bg-primary-50', border: 'border-primary-100' },
    { title: 'Completed', value: completedTasks, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { title: 'In Progress', value: inProgressTasks, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { title: 'Overdue', value: overdueTasks, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  ];

  const pieData = [
    { name: 'To Do', value: todoTasks },
    { name: 'In Progress', value: inProgressTasks },
    { name: 'Completed', value: completedTasks },
  ];
  const COLORS = ['#cbd5e1', '#f59e0b', '#10b981'];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'warning';
      default: return 'default';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Here is what's happening with your projects today.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 font-medium bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 relative group overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-white/40 -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-150`}></div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">{stat.title}</p>
                  <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.border} border flex items-center justify-center shadow-sm`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 col-span-1 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Tasks</h3>
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors">
              View all <ArrowUpRight size={16} />
            </button>
          </div>
          
          <div className="flex-1 overflow-auto pr-2 space-y-3">
            {tasks.slice(0, 6).map((task) => (
              <div key={task._id} className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm bg-gray-50/50 hover:bg-white transition-all-smooth cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    task.status === 'Completed' ? 'bg-emerald-500' :
                    task.status === 'In Progress' ? 'bg-amber-500' : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{task.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{task.project?.name || 'Personal'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getPriorityColor(task.priority)} className="hidden sm:inline-flex">
                    {task.priority}
                  </Badge>
                  <Badge variant={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                      <MoreHorizontal size={16} />
                    </Menu.Button>
                    <Transition
                      as={React.Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        <div className="px-1 py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(task._id, 'To Do');
                                }}
                                className={`${
                                  active ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                                } group flex w-full items-center rounded-lg px-2 py-2 text-sm transition-colors`}
                              >
                                Mark as To Do
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(task._id, 'In Progress');
                                }}
                                className={`${
                                  active ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                                } group flex w-full items-center rounded-lg px-2 py-2 text-sm transition-colors`}
                              >
                                Mark as In Progress
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(task._id, 'Completed');
                                }}
                                className={`${
                                  active ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                                } group flex w-full items-center rounded-lg px-2 py-2 text-sm transition-colors`}
                              >
                                Mark as Completed
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-12 flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-500 font-medium">You're all caught up!</p>
                <p className="text-sm text-gray-400 mt-1">No recent tasks found.</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 col-span-1">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Status Overview</h3>
          <div className="h-[240px] flex items-center justify-center relative">
            {tasks.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#111827', fontWeight: 500 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-gray-400">No data available</div>
            )}
            
            {tasks.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-extrabold text-gray-900">{tasks.length}</span>
                <span className="text-xs font-medium text-gray-500">Tasks</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-3 mt-6">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default Dashboard;
