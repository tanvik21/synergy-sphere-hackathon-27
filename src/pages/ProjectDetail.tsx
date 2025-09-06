import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, MessageSquare, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/store/useAppStore';
import { KanbanBoard } from '@/components/Project/KanbanBoard';
import { DiscussionThread } from '@/components/Project/DiscussionThread';
import { TaskModal } from '@/components/Modals/TaskModal';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { 
    projects, 
    currentProject, 
    setCurrentProject, 
    setShowTaskModal,
    activeTab,
    setActiveTab 
  } = useAppStore();

  useEffect(() => {
    if (id && !currentProject) {
      const project = projects.find(p => p.id === id);
      if (project) {
        setCurrentProject(project);
      }
    }
  }, [id, projects, currentProject, setCurrentProject]);

  if (!currentProject) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Link to="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getProjectStats = () => {
    const totalTasks = currentProject.tasks.length;
    const completedTasks = currentProject.tasks.filter(task => task.status === 'done').length;
    const inProgressTasks = currentProject.tasks.filter(task => task.status === 'progress').length;
    const overdueTasks = currentProject.tasks.filter(task => 
      new Date(task.dueDate) < new Date() && task.status !== 'done'
    ).length;
    
    return { totalTasks, completedTasks, inProgressTasks, overdueTasks };
  };

  const stats = getProjectStats();

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{currentProject.name}</h1>
            <p className="text-muted-foreground mt-1">{currentProject.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Team Members */}
          <div className="flex -space-x-2">
            {currentProject.members.map((member) => (
              <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-xs bg-gradient-primary text-white">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          
          <Button 
            onClick={() => setShowTaskModal(true)}
            className="btn-hero"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="card-elegant">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalTasks}</p>
              </div>
              <CheckSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-warning">{stats.inProgressTasks}</p>
              </div>
              <div className="h-8 w-8 bg-warning/10 rounded-lg flex items-center justify-center">
                <span className="text-warning font-bold">⟳</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-success">{stats.completedTasks}</p>
              </div>
              <div className="h-8 w-8 bg-success/10 rounded-lg flex items-center justify-center">
                <span className="text-success font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-destructive">{stats.overdueTasks}</p>
              </div>
              <div className="h-8 w-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                <span className="text-destructive font-bold">!</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value: 'tasks' | 'discussion') => setActiveTab(value)}>
        <TabsList className="mb-6">
          <TabsTrigger value="tasks" className="flex items-center space-x-2">
            <CheckSquare className="h-4 w-4" />
            <span>Tasks</span>
            <Badge variant="secondary" className="ml-2">{stats.totalTasks}</Badge>
          </TabsTrigger>
          <TabsTrigger value="discussion" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Discussion</span>
            <Badge variant="secondary" className="ml-2">{currentProject.comments.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <KanbanBoard project={currentProject} />
        </TabsContent>

        <TabsContent value="discussion" className="space-y-4">
          <DiscussionThread project={currentProject} />
        </TabsContent>
      </Tabs>

      {/* Task Modal */}
      <TaskModal />
    </div>
  );
}