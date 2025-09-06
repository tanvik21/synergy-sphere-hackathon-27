import { useState } from 'react';
import { Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Project } from '@/types';
import { useAppStore } from '@/store/useAppStore';

interface DiscussionThreadProps {
  project: Project;
}

export function DiscussionThread({ project }: DiscussionThreadProps) {
  const { user, addComment } = useAppStore();
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;

    setIsSubmitting(true);
    
    try {
      addComment(project.id, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
    
    setIsSubmitting(false);
  };

  const sortedComments = [...project.comments].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Discussion Header */}
      <Card className="card-elegant">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">Team Discussion</h3>
          <p className="text-muted-foreground text-sm">
            Collaborate with your team members, share updates, and discuss project details.
          </p>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="card-elegant">
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] p-6">
            <div className="space-y-4">
              {sortedComments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h4 className="font-medium text-foreground mb-2">No messages yet</h4>
                  <p className="text-sm text-muted-foreground">
                    Start the conversation by sending the first message.
                  </p>
                </div>
              ) : (
                sortedComments.map((comment) => {
                  const isCurrentUser = comment.user.id === user?.id;
                  
                  return (
                    <div
                      key={comment.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div className={`flex max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
                        {!isCurrentUser && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                            <AvatarFallback className="text-xs bg-gradient-primary text-white">
                              {comment.user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`space-y-1 ${isCurrentUser ? 'mr-3' : 'ml-3'}`}>
                          <div className={`${
                            isCurrentUser 
                              ? 'chat-bubble-sent' 
                              : 'chat-bubble-received'
                          } animate-scale-in`}>
                            <p className="text-sm leading-relaxed">{comment.text}</p>
                          </div>
                          
                          <div className={`flex items-center space-x-2 text-xs text-muted-foreground ${
                            isCurrentUser ? 'justify-end' : 'justify-start'
                          }`}>
                            {!isCurrentUser && (
                              <span className="font-medium">{comment.user.name}</span>
                            )}
                            <span>
                              {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                        </div>

                        {isCurrentUser && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                            <AvatarFallback className="text-xs bg-gradient-primary text-white">
                              {comment.user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Message Input */}
      <Card className="card-elegant">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="text-xs bg-gradient-primary text-white">
                {user?.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 flex items-center space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={isSubmitting}
                className="flex-1 bg-muted/50 border-muted-foreground/20 focus:bg-background"
              />
              
              <Button
                type="submit"
                size="sm"
                disabled={!newMessage.trim() || isSubmitting}
                className="btn-hero px-4"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}