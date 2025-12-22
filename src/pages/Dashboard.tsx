import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  MessageSquare, 
  BookOpen, 
  ArrowRight, 
  Clock,
  Target,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AppLayout from "@/components/layouts/AppLayout";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const quickActions = [
    {
      title: "Generate Curriculum",
      description: "Create a personalized study plan",
      icon: Sparkles,
      href: "/generator",
      gradient: true,
    },
    {
      title: "Open Chat",
      description: "Talk to your AI assistant",
      icon: MessageSquare,
      href: "/chat",
      gradient: false,
    },
    {
      title: "View History",
      description: "Review past curricula",
      icon: BookOpen,
      href: "/history/curriculum",
      gradient: false,
    },
  ];

  const stats = [
    { label: "Study Plans", value: "—", icon: BookOpen },
    { label: "Chat Sessions", value: "—", icon: MessageSquare },
    { label: "Hours Saved", value: "—", icon: Clock },
    { label: "Goals Completed", value: "—", icon: Target },
  ];

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="font-display text-3xl font-bold">
            Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
          </h1>
          <p className="text-muted-foreground">
            Ready to continue your learning journey? Here's what you can do today.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-display text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className={`p-6 cursor-pointer hover-lift transition-all ${
                  action.gradient 
                    ? "bg-gradient-primary text-white border-0" 
                    : "bg-card hover:border-primary/50"
                }`}
                onClick={() => navigate(action.href)}
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${
                  action.gradient ? "bg-white/20" : "bg-primary/10"
                }`}>
                  <action.icon className={`h-6 w-6 ${action.gradient ? "text-white" : "text-primary"}`} />
                </div>
                <h3 className="font-display font-semibold mb-1">{action.title}</h3>
                <p className={`text-sm ${action.gradient ? "text-white/80" : "text-muted-foreground"}`}>
                  {action.description}
                </p>
                <ArrowRight className={`h-4 w-4 mt-4 ${action.gradient ? "text-white/60" : "text-muted-foreground"}`} />
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display text-lg font-semibold mb-4">Your Progress</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display text-lg font-semibold mb-4">Recent Activity</h2>
          <Card className="p-8">
            <div className="text-center py-8">
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold mb-2">No recent activity</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                Start by generating your first curriculum or chatting with the AI assistant.
              </p>
              <Button onClick={() => navigate("/generator")} className="bg-gradient-primary hover:opacity-90">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Your First Curriculum
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
