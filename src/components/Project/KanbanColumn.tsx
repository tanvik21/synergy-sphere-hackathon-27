import { useDroppable } from '@dnd-kit/core';
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types';

interface KanbanColumnProps {
  id: string;
  title: string;
  status: Task['status'];
  children: ReactNode;
}

export function KanbanColumn({ id, title, status, children }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const getColumnStyles = () => {
    switch (status) {
      case 'todo':
        return 'border-slate-200 bg-slate-50/50';
      case 'progress':
        return 'border-amber-200 bg-amber-50/50';
      case 'done':
        return 'border-emerald-200 bg-emerald-50/50';
      default:
        return 'border-border bg-muted/20';
    }
  };

  const getHeaderStyles = () => {
    switch (status) {
      case 'todo':
        return 'text-slate-700';
      case 'progress':
        return 'text-amber-700';
      case 'done':
        return 'text-emerald-700';
      default:
        return 'text-foreground';
    }
  };

  const getBadgeStyles = () => {
    switch (status) {
      case 'todo':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'progress':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'done':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card
      ref={setNodeRef}
      className={`${getColumnStyles()} ${
        isOver ? 'ring-2 ring-primary ring-opacity-50 bg-primary/5' : ''
      } transition-all duration-200 min-h-[600px]`}
    >
      <CardHeader className="pb-3">
        <CardTitle className={`text-lg font-semibold ${getHeaderStyles()}`}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
      </CardContent>
    </Card>
  );
}