import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Clock, Edit, Trash2, MoreVertical, CheckCircle, FileText } from 'lucide-react';
import { formatDistanceToNow, format, isPast } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export function TaskCard({ task, isDragging }: TaskCardProps) {
  const { setEditingTask, deleteTask } = useAppStore();
  const [showDetails, setShowDetails] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSorting,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.2, 0, 0, 1)',
  };

  const isOverdue = isPast(new Date(task.dueDate)) && task.status !== 'done';
  const dueDate = new Date(task.dueDate);

  const getStatusBadge = () => {
    const statusConfig = {
      todo: { label: 'To Do', className: 'bg-blue-100 text-blue-700 border-blue-200' },
      progress: { label: 'In Progress', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      done: { label: 'Done', className: 'bg-green-100 text-green-700 border-green-200' }
    };
    
    const config = statusConfig[task.status];
    return (
      <Badge variant="outline" className={`${config.className} text-xs font-medium`}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = () => {
    const priorityConfig = {
      low: { label: 'Low', className: 'priority-low' },
      medium: { label: 'Med', className: 'priority-medium' },
      high: { label: 'High', className: 'priority-high' }
    };
    
    const config = priorityConfig[task.priority];
    return (
      <Badge variant="outline" className={`${config.className} text-xs`}>
        {config.label}
      </Badge>
    );
  };

  const getCompletionRate = () => {
    if (!task.checklist || task.checklist.length === 0) return 0;
    const completed = task.checklist.filter(item => item.completed).length;
    return Math.round((completed / task.checklist.length) * 100);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTask(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`cursor-grab active:cursor-grabbing group transition-all duration-300 ${
          isDragging || isSorting 
            ? 'opacity-70 rotate-2 scale-105 shadow-xl z-50' 
            : 'hover:shadow-lg hover:-translate-y-1'
        } ${isOverdue ? 'ring-2 ring-destructive/30 bg-destructive/5' : 'bg-background'}`}
      >
        <CardContent className="p-4 space-y-3">
          {/* Header with Title and Actions */}
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-sm text-foreground leading-tight flex-1 pr-2">
              {task.title}
            </h4>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowDetails(true)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Quick View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Status and Priority Badges */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusBadge()}
              {getPriorityBadge()}
            </div>
            {isOverdue && (
              <Badge variant="destructive" className="text-xs animate-pulse">
                Overdue
              </Badge>
            )}
          </div>

          {/* Checklist Progress */}
          {task.checklist && task.checklist.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{getCompletionRate()}%</span>
              </div>
              <Progress value={getCompletionRate()} className="h-1" />
            </div>
          )}

          {/* Footer with Assignee and Due Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                <AvatarFallback className="text-xs bg-gradient-primary text-white">
                  {task.assignee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate">
                {task.assignee.name}
              </span>
            </div>

            <div className={`flex items-center space-x-1 text-xs ${
              isOverdue ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              <Calendar className="h-3 w-3" />
              <span title={format(dueDate, 'PPP')}>
                {formatDistanceToNow(dueDate, { addSuffix: true })}
              </span>
            </div>
          </div>

          {/* Attachments indicator */}
          {task.attachments && task.attachments.length > 0 && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span>{task.attachments.length} files</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Detail Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>{task.title}</span>
              {getStatusBadge()}
            </DialogTitle>
            <DialogDescription>
              {task.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Assignee:</span>
                <div className="flex items-center space-x-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                    <AvatarFallback className="text-xs">
                      {task.assignee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span>{task.assignee.name}</span>
                </div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Due Date:</span>
                <p className="mt-1">{format(dueDate, 'PPP')}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Priority:</span>
                <div className="mt-1">
                  {getPriorityBadge()}
                </div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Status:</span>
                <div className="mt-1">
                  {getStatusBadge()}
                </div>
              </div>
            </div>

            {task.checklist && task.checklist.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Checklist</span>
                  <span className="text-sm text-muted-foreground">
                    {getCompletionRate()}% complete
                  </span>
                </div>
                <div className="space-y-2">
                  {task.checklist.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox checked={item.completed} disabled />
                      <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {task.attachments && task.attachments.length > 0 && (
              <div className="space-y-2">
                <span className="font-medium text-sm">Attachments</span>
                <div className="space-y-1">
                  {task.attachments.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{file}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}