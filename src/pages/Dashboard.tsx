import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  MessageSquare, 
  BookOpen, 
  ArrowRight, 
  Clock,
  Target,
  TrendingUp,
  Shield,
  GraduationCap,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AppLayout from "@/components/layouts/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import CountUp from "@/components/ui/CountUp";
import CardSwap, { Card as SwapCard } from "@/components/ui/CardSwap";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    curriculums: 0,
    chats: 0,
    hoursEstimate: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Fetch real stats from database
    const fetchStats = async () => {
      try {
        const [curriculumsRes, chatsRes] = await Promise.all([
          supabase.from("curriculums").select("id", { count: "exact" }).eq("user_id", user.id),
          supabase.from("conversations").select("id", { count: "exact" }).eq("user_id", user.id),
        ]);

        setStats({
          curriculums: curriculumsRes.count || 0,
          chats: chatsRes.count || 0,
          hoursEstimate: (curriculumsRes.count || 0) * 2, // Estimate 2 hours saved per curriculum
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
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

  const statCards = [
    { label: "Study Plans", value: stats.curriculums, icon: BookOpen },
    { label: "Chat Sessions", value: stats.chats, icon: MessageSquare },
    { label: "Hours Saved", value: stats.hoursEstimate, icon: Clock },
    { label: "Goals Tracked", value: stats.curriculums, icon: Target },
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
            {statCards.map((stat, index) => (
              <Card key={index} className="p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      <CountUp end={stat.value} duration={1500} delay={index * 100} />
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Highlights Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="font-display text-lg font-semibold mb-4">What You Can Build</h2>
          <CardSwap
            interval={4500}
            cards={[
              <SwapCard className="text-center py-8">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">Ethics-First Learning</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Create curricula that prioritize understanding over memorization, with AI guidance that respects academic integrity.
                </p>
              </SwapCard>,
              <SwapCard className="text-center py-8">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">Personalized Paths</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Get study plans tailored to your subjects, time availability, and learning goals.
                </p>
              </SwapCard>,
              <SwapCard className="text-center py-8">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">AI Study Companion</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Chat with an AI that explains concepts, answers questions, and guides your learning journey.
                </p>
              </SwapCard>,
            ]}
          />
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
