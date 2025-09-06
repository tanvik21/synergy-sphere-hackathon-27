import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Calendar, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { ProjectModal } from '@/components/Modals/ProjectModal';
import { formatDistanceToNow, format, isPast } from 'date-fns';

export default function Dashboard() {
  const { projects, setCurrentProject, setShowProjectModal, showProjectModal } = useAppStore();
  const [animatedProgress, setAnimatedProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    // Animate progress bars on load
    const timer = setTimeout(() => {
      const progressData: Record<string, number> = {};
      projects.forEach(project => {
        progressData[project.id] = getProjectProgress(project);
      });
      setAnimatedProgress(progressData);
    }, 300);

    return () => clearTimeout(timer);
  }, [projects]);

  const getProjectProgress = (project: any) => {
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter((task: any) => task.status === 'done').length;
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const getProjectStats = () => {
    const totalProjects = projects.length;
    const totalTasks = projects.reduce((acc, p) => acc + p.tasks.length, 0);
    const completedTasks = projects.reduce((acc, p) => acc + p.tasks.filter(t => t.status === 'done').length, 0);
    const totalMembers = new Set(projects.flatMap(p => p.members.map(m => m.id))).size;
    
    return { totalProjects, totalTasks, completedTasks, totalMembers };
  };

  const stats = getProjectStats();

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Project Dashboard</h1>
          <p className="text-muted-foreground">Manage your projects and track progress</p>
        </div>
        <Button 
          onClick={() => setShowProjectModal(true)}
          className="btn-hero"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="card-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalProjects}</p>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalTasks}</p>
              </div>
              <div className="h-10 w-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">{stats.completedTasks}</p>
              </div>
              <div className="h-10 w-10 bg-success/10 rounded-lg flex items-center justify-center">
                <span className="text-success font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalMembers}</p>
              </div>
              <div className="h-10 w-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const progress = getProjectProgress(project);
          const overdueTasks = project.tasks.filter(task => 
            new Date(task.dueDate) < new Date() && task.status !== 'done'
          ).length;

          return (
            <Card key={project.id} className="card-elegant group cursor-pointer overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {project.icon || '📋'}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {project.name}
                      </CardTitle>
                      {project.deadline && (
                        <div className={`flex items-center space-x-1 text-xs mt-1 ${
                          isPast(new Date(project.deadline)) ? 'text-destructive' : 'text-muted-foreground'
                        }`}>
                          <Clock className="h-3 w-3" />
                          <span>
                            Due {format(new Date(project.deadline), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {overdueTasks > 0 && (
                    <Badge variant="destructive" className="text-xs animate-pulse-glow">
                      {overdueTasks} overdue
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress 
                    value={animatedProgress[project.id] || 0} 
                    className="h-2 animate-progress-fill" 
                    style={{ '--progress-width': `${progress}%` } as React.CSSProperties}
                  />
                </div>

                {/* Members */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 3).map((member) => (
                      <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xs bg-gradient-primary text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.members.length > 3 && (
                      <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          +{project.members.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {project.members.length} members
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {project.tasks.length} tasks
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 space-y-3 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Updated {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <Link
                    to={`/project/${project.id}`}
                    onClick={() => setCurrentProject(project)}
                    className="block"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Empty State */}
        {projects.length === 0 && (
          <Card className="card-elegant col-span-full">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first project to get started with team collaboration
              </p>
              <Button onClick={() => setShowProjectModal(true)} className="btn-hero">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Project Modal */}
      <ProjectModal />
    </div>
  );
}