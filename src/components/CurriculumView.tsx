import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, BookOpen, Link as LinkIcon, ExternalLink } from "lucide-react";
import { Curriculum } from "@/pages/Generator";

interface CurriculumViewProps {
  curriculum: Curriculum;
}

const CurriculumView = ({ curriculum }: CurriculumViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold mb-2">Your Study Plan</h1>
        <p className="text-muted-foreground text-lg">
          {curriculum.duration_weeks} week personalized curriculum
        </p>
      </div>

      <div className="space-y-6">
        {curriculum.modules.map((module, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 shadow-card hover:shadow-soft transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-display font-bold text-primary">
                      {module.week}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="font-medium">
                      {module.subject}
                    </Badge>
                  </div>

                  <h3 className="font-display text-xl font-semibold mb-3">
                    {module.title}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Learning Outcomes
                      </h4>
                      <ul className="space-y-1">
                        {module.learning_outcomes.map((outcome, i) => (
                          <li key={i} className="text-sm pl-6 relative">
                            <span className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Activities
                      </h4>
                      <ul className="space-y-1">
                        {module.activities.map((activity, i) => (
                          <li key={i} className="text-sm pl-6 relative">
                            <span className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-secondary" />
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {module.resources.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                          <LinkIcon className="h-4 w-4" />
                          Resources
                        </h4>
                        <ul className="space-y-2">
                          {module.resources.map((resource, i) => (
                            <li key={i} className="text-sm">
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors group"
                              >
                                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                                <span className="flex-1 group-hover:text-primary">
                                  {resource.title}
                                </span>
                                <Badge
                                  variant={resource.type === "free" ? "secondary" : "outline"}
                                  className="text-xs"
                                >
                                  {resource.type}
                                </Badge>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CurriculumView;