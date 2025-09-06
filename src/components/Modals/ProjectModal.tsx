import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';

export function ProjectModal() {
  const { showProjectModal, setShowProjectModal, createProject } = useAppStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Project name is required",
        description: "Please enter a name for your project.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      createProject(name.trim(), description.trim());
      
      toast({
        title: "Project created!",
        description: `${name} has been created successfully.`,
      });
      
      // Reset form
      setName('');
      setDescription('');
    } catch (error) {
      toast({
        title: "Error creating project",
        description: "Please try again.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const handleClose = () => {
    setShowProjectModal(false);
    setName('');
    setDescription('');
  };

  return (
    <Dialog open={showProjectModal} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Create a new project to organize your team's work and collaboration.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="Enter project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                placeholder="Describe your project (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
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
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}