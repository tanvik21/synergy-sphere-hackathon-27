import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, FileIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/store/useAppStore';
import { dummyUsers } from '@/data/dummyData';
import { Task } from '@/types';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function TaskModal() {
  const { 
    showTaskModal, 
    setShowTaskModal, 
    createTask, 
    updateTask,
    editingTask,
    currentProject 
  } = useAppStore();
  
  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [status, setStatus] = useState<Task['status']>(editingTask?.status || 'todo');
  const [priority, setPriority] = useState<Task['priority']>(editingTask?.priority || 'medium');
  const [assigneeId, setAssigneeId] = useState(editingTask?.assignee.id || dummyUsers[0].id);
  const [dueDate, setDueDate] = useState<Date | undefined>(
    editingTask?.dueDate ? new Date(editingTask.dueDate) : undefined
  );
  const [checklist, setChecklist] = useState(editingTask?.checklist || [
    { id: '1', text: 'Review requirements', completed: false },
    { id: '2', text: 'Create implementation plan', completed: false }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Task title is required",
        description: "Please enter a title for your task.",
        variant: "destructive",
      });
      return;
    }

    if (!currentProject) {
      toast({
        title: "No project selected",
        description: "Please select a project first.",
        variant: "destructive",
      });
      return;
    }

    if (!dueDate) {
      toast({
        title: "Due date is required",
        description: "Please select a due date for your task.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const assignee = dummyUsers.find(u => u.id === assigneeId) || dummyUsers[0];
      
      if (editingTask) {
        // Update existing task
        updateTask(editingTask.id, {
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          assignee,
          dueDate: dueDate.toISOString(),
        });
        
        toast({
          title: "Task updated!",
          description: `${title} has been updated successfully.`,
        });
      } else {
        // Create new task
        createTask({
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          assignee,
          dueDate: dueDate.toISOString(),
          projectId: currentProject.id,
        });
        
        toast({
          title: "Task created!",
          description: `${title} has been created successfully.`,
        });
      }
      
      // Reset form
      resetForm();
    } catch (error) {
      toast({
        title: "Error saving task",
        description: "Please try again.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('todo');
    setAssigneeId(dummyUsers[0].id);
    setDueDate(undefined);
  };

  const handleClose = () => {
    setShowTaskModal(false);
    resetForm();
  };

  return (
    <Dialog open={showTaskModal} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          <DialogDescription>
            {editingTask 
              ? 'Update the task details below.'
              : 'Create a new task and assign it to a team member.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                placeholder="Describe the task (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-status">Status</Label>
                <Select value={status} onValueChange={(value: Task['status']) => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-assignee">Assignee</Label>
                <Select value={assigneeId} onValueChange={setAssigneeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {dummyUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-xs">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Priority Level</Label>
              <Select value={priority} onValueChange={(value: Task['priority']) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="priority-low">Low</Badge>
                      <span>Low Priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="priority-medium">Medium</Badge>
                      <span>Medium Priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="priority-high">High</Badge>
                      <span>High Priority</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Task Checklist</Label>
              <div className="space-y-2">
                {checklist.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-3 p-2 bg-muted/30 rounded-lg">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={(checked) => {
                        const newChecklist = [...checklist];
                        newChecklist[index].completed = checked as boolean;
                        setChecklist(newChecklist);
                      }}
                    />
                    <Input
                      value={item.text}
                      onChange={(e) => {
                        const newChecklist = [...checklist];
                        newChecklist[index].text = e.target.value;
                        setChecklist(newChecklist);
                      }}
                      placeholder="Checklist item"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setChecklist(checklist.filter((_, i) => i !== index));
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setChecklist([...checklist, { 
                      id: Date.now().toString(), 
                      text: '', 
                      completed: false 
                    }]);
                  }}
                  className="w-full"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Checklist Item
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>File Attachments</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <FileIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag & drop files here or click to browse
                </p>
                <Button type="button" variant="outline" size="sm">
                  Choose Files
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Mock upload - files: design-mockup.figma, requirements.pdf
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="btn-hero">
              {loading 
                ? (editingTask ? 'Updating...' : 'Creating...') 
                : (editingTask ? 'Update Task' : 'Create Task')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}