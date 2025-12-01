import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CurriculumView from "@/components/CurriculumView";

export interface Resource {
  title: string;
  url: string;
  type: "free" | "paid";
}

export interface CurriculumModule {
  week: number;
  subject: string;
  title: string;
  learning_outcomes: string[];
  activities: string[];
  resources: Resource[];
  biasNote?: string;
}

export interface Curriculum {
  planId: string;
  duration_weeks: number;
  modules: CurriculumModule[];
}

const Generator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    subjects: "",
    durationWeeks: "",
    hoursPerDay: "",
    goal: "",
    hardestSubject: "",
    learningStyle: "Mixed",
    includeBiasWarnings: false,
    focusOnFairness: false,
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // Load user's most recent curriculum
        const { data: curriculums } = await supabase
          .from('curriculums')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (curriculums && curriculums.length > 0) {
          const saved = curriculums[0];
          setCurriculum({
            planId: saved.plan_id,
            duration_weeks: saved.duration_weeks,
            modules: saved.modules as any
          });
        }
      }
    };
    getUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subjects || !formData.durationWeeks || !formData.hoursPerDay) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-curriculum", {
        body: {
          subjects: formData.subjects.split(",").map((s) => s.trim()),
          durationWeeks: parseInt(formData.durationWeeks),
          hoursPerDay: parseInt(formData.hoursPerDay),
          goal: formData.goal,
          hardestSubject: formData.hardestSubject,
          learningStyle: formData.learningStyle,
          includeBiasWarnings: formData.includeBiasWarnings,
          focusOnFairness: formData.focusOnFairness,
        },
      });

      if (error) throw error;

      setCurriculum(data);
      
      // Save to database
      if (userId) {
        const { error: dbError } = await supabase.from('curriculums').insert({
          user_id: userId,
          plan_id: data.planId,
          title: `${formData.subjects} - ${formData.goal || 'Learning Plan'}`,
          duration_weeks: data.duration_weeks,
          subjects: formData.subjects.split(",").map((s: string) => s.trim()),
          goal: formData.goal,
          modules: data.modules
        });

        if (dbError) console.error('Error saving curriculum:', dbError);

        // Create progress tracking entry
        const { data: savedCurriculum } = await supabase
          .from('curriculums')
          .select('id')
          .eq('user_id', userId)
          .eq('plan_id', data.planId)
          .single();

        if (savedCurriculum) {
          await supabase.from('progress_tracking').upsert({
            user_id: userId,
            curriculum_id: savedCurriculum.id,
            total_modules: data.modules.length,
            completed_modules: 0
          });
        }
      }
      
      toast({
        title: "Curriculum Generated!",
        description: "Your personalized study plan is ready.",
      });
    } catch (error) {
      console.error("Error generating curriculum:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate curriculum. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {!curriculum ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-8 shadow-soft">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-6 w-6 text-primary" />
                <h1 className="font-display text-3xl font-bold">Generate Your Curriculum</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="subjects">
                    Subjects <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="subjects"
                    placeholder="Math, Physics, Chemistry (comma separated)"
                    value={formData.subjects}
                    onChange={(e) =>
                      setFormData({ ...formData, subjects: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">
                      Duration (weeks) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      max="52"
                      placeholder="12"
                      value={formData.durationWeeks}
                      onChange={(e) =>
                        setFormData({ ...formData, durationWeeks: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="hours">
                      Hours/Day <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="hours"
                      type="number"
                      min="1"
                      max="24"
                      placeholder="3"
                      value={formData.hoursPerDay}
                      onChange={(e) =>
                        setFormData({ ...formData, hoursPerDay: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="goal">Academic Goal</Label>
                  <Textarea
                    id="goal"
                    placeholder="E.g., Prepare for university entrance exams"
                    value={formData.goal}
                    onChange={(e) =>
                      setFormData({ ...formData, goal: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="hardest">Hardest Subject (Optional)</Label>
                  <Input
                    id="hardest"
                    placeholder="E.g., Calculus"
                    value={formData.hardestSubject}
                    onChange={(e) =>
                      setFormData({ ...formData, hardestSubject: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="learningStyle">
                    Learning Style <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="learningStyle"
                    value={formData.learningStyle}
                    onChange={(e) =>
                      setFormData({ ...formData, learningStyle: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                  >
                    <option value="Visual">Visual</option>
                    <option value="Reading/Writing">Reading/Writing</option>
                    <option value="Hands-On">Hands-On</option>
                    <option value="Video-Based">Video-Based</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>

                <div className="space-y-4 border border-border rounded-md p-4 bg-muted/20">
                  <h3 className="font-semibold text-sm">Ethical AI Options</h3>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeBiasWarnings"
                      checked={formData.includeBiasWarnings}
                      onChange={(e) =>
                        setFormData({ ...formData, includeBiasWarnings: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-primary text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                    <Label htmlFor="includeBiasWarnings" className="font-normal cursor-pointer">
                      Include bias warnings in curriculum
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="focusOnFairness"
                      checked={formData.focusOnFairness}
                      onChange={(e) =>
                        setFormData({ ...formData, focusOnFairness: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-primary text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                    <Label htmlFor="focusOnFairness" className="font-normal cursor-pointer">
                      Add module on Fair Learning Practices
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Curriculum
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>
        ) : (
          <CurriculumView curriculum={curriculum} />
        )}
      </div>
    </div>
  );
};

export default Generator;