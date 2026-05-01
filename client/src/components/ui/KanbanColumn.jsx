import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '../../utils/cn';

const KanbanColumn = ({ id, title, count, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div className="flex-shrink-0 w-80 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          {title}
          <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-md">
            {count}
          </span>
        </h3>
      </div>
      
      <div 
        ref={setNodeRef}
        className={cn(
          "flex-1 bg-surface-100/50 rounded-2xl p-2 space-y-2 overflow-y-auto transition-colors border-2 border-transparent",
          isOver && "bg-primary-50/50 border-primary-200"
        )}
      >
        {children}
        {count === 0 && (
          <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-sm text-gray-400 font-medium">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
