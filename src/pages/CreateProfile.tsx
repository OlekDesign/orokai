import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heading1, Caption } from "@/components/ui/typography";
import { useUserProfile } from '../contexts/UserProfileContext';
import { cn } from "@/lib/utils";

export default function CreateProfile() {
  const navigate = useNavigate();
  const { setProfile } = useUserProfile();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const nameMobileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    if (!name.trim()) {
      setShowWarning(true);
      return;
    }
    
    setProfile({ name: name.trim(), avatar });
    navigate('/onboarding');
  };

  useEffect(() => {
    // Focus the appropriate input field based on screen size
    const focusInput = () => {
      if (window.innerWidth >= 768) {
        // Desktop: focus the desktop input
        nameInputRef.current?.focus();
      } else {
        // Mobile: focus the mobile input
        nameMobileInputRef.current?.focus();
      }
    };

    // Focus on mount
    focusInput();

    // Also focus when window is resized (in case user switches between layouts)
    window.addEventListener('resize', focusInput);
    
    return () => {
      window.removeEventListener('resize', focusInput);
    };
  }, []);

  return (
    <div className="min-h-screen bg-muted/50 px-4">
      {/* Desktop Layout - Centered */}
      <div className="hidden md:flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="max-w-[20rem] w-full space-y-8"
        >
          <div className="text-center">
            <Heading1>Create Profile</Heading1>
          </div>

          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div 
                className={cn(
                  "w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden cursor-pointer hover:bg-muted/80 transition-colors",
                  avatar && "p-0"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                {avatar ? (
                  <img 
                    src={avatar || ''} 
                    alt="Profile avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Add a photo
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">Enter your name</Label>
              <Input
                id="name"
                ref={nameInputRef}
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setShowWarning(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleContinue();
                  }
                }}
                className={cn(
                  "h-12",
                  showWarning && "border-destructive"
                )}
              />
              {showWarning && (
                <Caption className="text-destructive">
                  Please enter your name to continue
                </Caption>
              )}
            </div>

            {/* Continue Button */}
            <Button 
              onClick={handleContinue}
              className="w-full"
              size="lg"
            >
              Continue
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Layout - Content scrollable, form fixed at bottom */}
      <div className="md:hidden min-h-screen flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="flex-1 overflow-y-auto px-4 pt-8"
        >
          <div className="max-w-[20rem] mx-auto w-full">
            <div className="flex flex-col justify-center space-y-8">
              <div className="text-center">
                <Heading1>Create Profile</Heading1>
              </div>

              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div 
                  className={cn(
                    "w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden cursor-pointer hover:bg-muted/80 transition-colors",
                    avatar && "p-0"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatar ? (
                    <img 
                      src={avatar || ''} 
                      alt="Profile avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Add a photo
                </Button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fixed form at bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-background border-t border-border">
          <div className="max-w-[20rem] w-full mx-auto space-y-4">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name-mobile">Enter your name</Label>
              <Input
                id="name-mobile"
                ref={nameMobileInputRef}
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setShowWarning(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleContinue();
                  }
                }}
                className={cn(
                  "h-12",
                  showWarning && "border-destructive"
                )}
              />
              {showWarning && (
                <Caption className="text-destructive">
                  Please enter your name to continue
                </Caption>
              )}
            </div>

            {/* Continue Button */}
            <Button 
              onClick={handleContinue}
              className="w-full min-h-[44px] py-3"
              size="lg"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
