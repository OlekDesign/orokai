import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Heading1, BodyText } from "@/components/ui/typography";
import { useUserProfile } from '../contexts/UserProfileContext';

export function OnboardingWelcome() {
  const navigate = useNavigate();
  const { profile } = useUserProfile();

  const handleStartInvesting = () => {
    navigate('/invest-empty');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="max-w-[40rem] w-full space-y-8"
      >
        <div className="text-center space-y-8">
          {/* Welcome Text */}
          <div className="space-y-4">
            <BodyText className="text-lg text-muted-foreground">
              Welcome to Your Financial Freedom
            </BodyText>
            <Heading1>Your Account is Tailored for You, {profile?.name || 'User'}</Heading1>
          </div>

          {/* Video Placeholder */}
          <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10" />
            <Button
              variant="secondary"
              size="lg"
              className="relative z-10 rounded-full w-16 h-16 p-0"
            >
              <Play className="w-6 h-6 ml-1" />
            </Button>
          </div>

          {/* Start Investing Button */}
          <Button 
            onClick={handleStartInvesting}
            size="lg"
          >
            Start Investing
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
