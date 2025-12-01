import { motion } from "framer-motion";
import { BookOpen, Shield, Target, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

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

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="text-lg px-10 py-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate("/generator")}
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
            onClick={() => navigate("/generator")}
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