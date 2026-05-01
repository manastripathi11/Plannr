import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, GripVertical, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { Badge } from './Badge';
import { format } from 'date-fns';
import { Menu, Transition } from '@headlessui/react';

const KanbanCard = ({ task, user, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
    data: task,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const getPriorityVariant = (p) => {
    switch(p) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`bg-white p-4 rounded-xl border border-gray-100 shadow-[var(--shadow-subtle)] hover:shadow-md hover:border-primary-200 transition-shadow group ${isDragging ? 'opacity-50 ring-2 ring-primary-500 z-50' : ''}`}
    >
      <div className="flex justify-between items-start mb-3 gap-2">
        <Badge variant={getPriorityVariant(task.priority)} className="text-[10px] py-0">
          {task.priority}
        </Badge>
        
        <div className="flex items-center gap-1">
          {user?.role === 'Admin' && (
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="p-1 text-gray-300 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
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
                <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={onEdit}
                          className={`${
                            active ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                          } group flex w-full items-center rounded-lg px-2 py-2 text-sm transition-colors`}
                        >
                          <Edit2 size={14} className="mr-2" />
                          Edit Task
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={onDelete}
                          className={`${
                            active ? 'bg-rose-50 text-rose-700' : 'text-gray-700'
                          } group flex w-full items-center rounded-lg px-2 py-2 text-sm transition-colors`}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}

          <div 
            {...listeners} 
            {...attributes}
            title="Hold and drag to move task"
            className="text-gray-300 hover:text-gray-500 transition-colors p-1 cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={16} />
          </div>
        </div>
      </div>
      
      <h4 className="font-bold text-gray-900 text-sm mb-1.5 leading-tight">{task.title}</h4>
      <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>
      
      <div className="flex items-center justify-between text-xs mt-auto pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1.5 text-gray-500">
          <Calendar size={13} className={task.dueDate && new Date(task.dueDate) < new Date() ? 'text-rose-500' : ''} />
          <span className={task.dueDate && new Date(task.dueDate) < new Date() ? 'text-rose-600 font-semibold' : 'font-medium'}>
            {task.dueDate ? format(new Date(task.dueDate), 'MMM d') : 'No date'}
          </span>
        </div>
        
        {task.assignedTo && (
           <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-2 ring-white" title={task.assignedTo.name}>
             {task.assignedTo.name.charAt(0).toUpperCase()}
           </div>
        )}
      </div>
    </div>
  );
};

export default KanbanCard;
