import { motion } from "framer-motion";
import { BookOpen, MessageSquare, GraduationCap, Shield, Brain, Target, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Landing = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Navigation */}
      <nav className="container mx-auto px-4 pt-6 pb-4">
        <div className="flex justify-end gap-3">
          {user ? (
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="gap-2"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>
              <Button
                onClick={() => navigate("/register")}
                className="gap-2 bg-gradient-primary"
              >
                Register
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-4 pt-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-primary/10 rounded-full"
          >
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Ethical AI Learning Platform</span>
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
            Ethical AI Curriculum Builder
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
            Create AI-powered study plans that follow ethical AI principles. 
            <br className="hidden md:block" />
            No cheating. Just learning.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-primary hover:opacity-90 transition-all shadow-soft"
              onClick={() => navigate("/generator")}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Generate Curriculum
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2"
              onClick={() => navigate("/chat")}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Open Chat Assistant
            </Button>
          </div>
        </motion.div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          <Card className="p-8 bg-card shadow-card hover:shadow-soft transition-all border-border">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Personalized Learning</h3>
            <p className="text-muted-foreground">
              Generate custom curriculum plans tailored to your subjects, pace, and academic goals.
            </p>
          </Card>

          <Card className="p-8 bg-card shadow-card hover:shadow-soft transition-all border-border">
            <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">AI Assistant</h3>
            <p className="text-muted-foreground">
              Chat with an ethical AI that explains concepts, adjusts plans, and guides your learning journey.
            </p>
          </Card>

          <Card className="p-8 bg-card shadow-card hover:shadow-soft transition-all border-border">
            <div className="h-12 w-12 rounded-full bg-accent-foreground/10 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-accent-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Ethical Guidance</h3>
            <p className="text-muted-foreground">
              Built with principles that encourage understanding over shortcuts. No exam answers, only learning support.
            </p>
          </Card>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <Card className="p-10 bg-gradient-primary text-primary-foreground shadow-soft border-0">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to start learning ethically?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join students and teachers who are building better study habits with AI assistance.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6"
              onClick={() => navigate("/generator")}
            >
              Get Started Now
            </Button>
          </Card>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;