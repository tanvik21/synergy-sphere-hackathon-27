import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { Task, Project } from '@/types';
import { TaskCard } from './TaskCard';
import { KanbanColumn } from './KanbanColumn';
import { useAppStore } from '@/store/useAppStore';

interface KanbanBoardProps {
  project: Project;
}

export function KanbanBoard({ project }: KanbanBoardProps) {
  const { updateTaskStatus } = useAppStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = [
    { id: 'todo', title: 'To Do', status: 'todo' as const },
    { id: 'progress', title: 'In Progress', status: 'progress' as const },
    { id: 'done', title: 'Done', status: 'done' as const },
  ];

  const getTasksByStatus = (status: Task['status']) => {
    return project.tasks.filter(task => task.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = project.tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Task['status'];

    // Find the task being moved
    const task = project.tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Update task status
    updateTaskStatus(taskId, newStatus);
    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            status={column.status}
          >
            <SortableContext
              items={getTasksByStatus(column.status).map(task => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {getTasksByStatus(column.status).map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </SortableContext>
          </KanbanColumn>
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}