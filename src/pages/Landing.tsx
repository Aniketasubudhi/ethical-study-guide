import { motion } from "framer-motion";
import { BookOpen, Shield, Target, MessageCircle, Send, History, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

const Landing = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    // Fetch user count
    const fetchUserCount = async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (count) setUserCount(count);
    };

    fetchUserCount();

    return () => subscription.unsubscribe();
  }, []);

  const handleStartBuilding = () => {
    if (!isAuthenticated) {
      navigate("/auth");
    } else {
      navigate("/generator");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Sticky Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold">EthicalAI Learn</span>
          </div>
          <Button
            variant="default"
            className="rounded-full bg-foreground text-background hover:bg-foreground/90"
            onClick={() => navigate("/auth")}
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-4 pt-20 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build Your Learning Path
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              with Ethical AI
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
            Generate personalized, transparent, and bias-free educational curricula. 
            Learn with confidence knowing your path is fair and credible.
          </p>

          <div className="flex items-center justify-center gap-2 mb-8">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold text-blue-600">
              {userCount.toLocaleString()}+ learners have joined!
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="text-lg px-10 py-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
              onClick={handleStartBuilding}
            >
              Start Building
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-7 rounded-full border-2 bg-white hover:bg-gray-50"
              onClick={() => navigate("/auth")}
            >
              Sign In with Google
            </Button>
          </div>
        </motion.div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-16">
            Why Choose EthicalAI Learn?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
              <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Personalized Learning</h3>
              <p className="text-muted-foreground leading-relaxed">
                Curricula tailored to your subject, level, duration, and learning style preferences.
              </p>
            </Card>

            <Card className="p-8 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
              <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Bias Detection</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every resource includes bias scores and credibility ratings for transparent learning.
              </p>
            </Card>

            <Card className="p-8 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
              <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <MessageCircle className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">AI Assistant</h3>
              <p className="text-muted-foreground leading-relaxed">
                Chat with our AI to understand your curriculum and get learning guidance.
              </p>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* AI Chatbot Section */}
      <section className="container mx-auto px-4 py-20 bg-white/50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Meet Your AI Study Assistant
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ask questions, refine your curriculum, and get on-demand guidance from our Ethical AI tutor.
            </p>
          </div>

          <div className="grid lg:grid-cols-[300px_1fr_300px] gap-6 max-w-7xl mx-auto">
            {/* Left Panel - Chat History */}
            <Card className="p-6 bg-white hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-blue-600" />
                <h3 className="font-display text-lg font-semibold">Chat History</h3>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">Cyber Security CIE Prep</div>
                      <div className="text-xs text-muted-foreground">2 days ago</div>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">Quantum Physics Unit 3</div>
                      <div className="text-xs text-muted-foreground">5 days ago</div>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">AI for MPLS & SR</div>
                      <div className="text-xs text-muted-foreground">1 week ago</div>
                    </div>
                  </Button>
                </div>
              </ScrollArea>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => navigate("/chat")}
              >
                View All History
              </Button>
            </Card>

            {/* Center Panel - Main Chatbot */}
            <Card className="p-6 bg-white hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-display text-lg font-semibold">AI Assistant</h3>
              </div>

              <ScrollArea className="flex-1 mb-4 h-[300px]">
                <div className="space-y-4 p-2">
                  {/* Sample conversation */}
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">
                        Hi! I'm your ethical AI learning assistant. Ask me questions about your studies, and I'll help guide your learning journey.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">
                        Can you help me understand quantum entanglement?
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">
                        Quantum entanglement is a fascinating phenomenon! Let me break it down...
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  placeholder="Ask anything about your studies..."
                  disabled
                  className="bg-muted/50"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <Button
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/auth");
                  } else {
                    navigate("/chat");
                  }
                }}
              >
                {isAuthenticated ? "Open Full Chat" : "Sign In to Chat"}
              </Button>
            </Card>

            {/* Right Panel - Progress Dashboard */}
            <Card className="p-6 bg-white hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="font-display text-lg font-semibold">Your Progress</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Cyber Security</span>
                      <span className="text-xs text-muted-foreground">60%</span>
                    </div>
                    <Progress value={60} className="h-1.5" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Quantum Physics</span>
                      <span className="text-xs text-muted-foreground">30%</span>
                    </div>
                    <Progress value={30} className="h-1.5" />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Study Streak</span>
                    <span className="text-2xl font-bold text-blue-600">5</span>
                  </div>
                  <p className="text-xs text-muted-foreground">days in a row</p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-1">Last Active Topic</p>
                  <p className="text-sm font-medium">Unit 3 – Lasers & Optical Fibers</p>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/generator")}
                >
                  View Full Report
                </Button>
              </div>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-br from-blue-600 to-blue-500 rounded-3xl p-16 shadow-2xl"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Start Learning?
          </h2>
          <p className="text-xl mb-10 text-blue-50 max-w-2xl mx-auto">
            Join thousands of learners building ethical, personalized education paths.
          </p>
          <Button
            size="lg"
            className="text-lg px-12 py-7 rounded-full bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all font-semibold"
            onClick={handleStartBuilding}
          >
            Get Started Now
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-6 w-6" />
            <span className="font-display text-xl font-bold">EthicalAI Learn</span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2025 EthicalAI Learn. Building transparent, fair education for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;