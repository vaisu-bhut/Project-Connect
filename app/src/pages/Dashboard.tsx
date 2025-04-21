
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { contacts, interactions, reminders } from "@/data/sampleData";
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { Users, MessageSquare, Bell } from "lucide-react";

const Dashboard = () => {
  // Calculate metrics
  const totalContacts = contacts.length;
  const totalInteractions = interactions.length;
  const totalReminders = reminders.length;
  const pendingReminders = reminders.filter(r => !r.isCompleted).length;
  
  // Generate data for contact categories chart
  const categoryData = contacts.reduce((acc, contact) => {
    const categoryIndex = acc.findIndex(item => item.name === contact.category);
    if (categoryIndex >= 0) {
      acc[categoryIndex].value += 1;
    } else {
      acc.push({ name: contact.category, value: 1 });
    }
    return acc;
  }, [] as { name: string, value: number }[]);
  
  // Generate data for interactions by month chart
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 5);
  
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(sixMonthsAgo);
    date.setMonth(sixMonthsAgo.getMonth() + i);
    return {
      name: date.toLocaleString('default', { month: 'short' }),
      date: new Date(date.getFullYear(), date.getMonth(), 1)
    };
  });
  
  const interactionsByMonth = months.map(month => {
    const count = interactions.filter(interaction => {
      const interactionDate = new Date(interaction.date);
      return interactionDate.getMonth() === month.date.getMonth() && 
             interactionDate.getFullYear() === month.date.getFullYear();
    }).length;
    
    return {
      name: month.name,
      interactions: count
    };
  });
  
  // Color configurations
  const COLORS = ['#6C5DD3', '#4C6FFF', '#01CDCE', '#8A7FE8', '#7991FF'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">An overview of your network and activities.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
            <p className="text-xs text-muted-foreground">
              {contacts.length > 0 ? `Last added on ${new Date(Math.max(...contacts.map(c => new Date(c.createdAt).getTime()))).toLocaleDateString()}` : 'No contacts yet'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Interactions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInteractions}</div>
            <p className="text-xs text-muted-foreground">
              {interactions.length > 0 ? `Last interaction on ${new Date(Math.max(...interactions.map(i => new Date(i.date).getTime()))).toLocaleDateString()}` : 'No interactions yet'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reminders</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReminders}</div>
            <p className="text-xs text-muted-foreground">
              Out of {totalReminders} total reminders
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Contact Categories</CardTitle>
            <CardDescription>
              Distribution of your network by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Interaction History</CardTitle>
            <CardDescription>
              Number of interactions over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={interactionsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="interactions" fill="#6C5DD3" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest interactions and reminders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interactions.slice(0, 3).map(interaction => (
                <div key={interaction.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{interaction.title}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{new Date(interaction.date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>{interaction.contacts.map(c => `${c.firstName} ${c.lastName}`).join(', ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Upcoming Reminders</CardTitle>
            <CardDescription>
              Tasks and reminders that need your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reminders.filter(r => !r.isCompleted).slice(0, 3).map(reminder => (
                <div key={reminder.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="bg-network-teal/10 p-2 rounded-full">
                    <Bell className="h-5 w-5 text-network-teal" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{reminder.title}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{new Date(reminder.date).toLocaleDateString()}</span>
                      {reminder.interaction && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Related to: {reminder.interaction.title}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
