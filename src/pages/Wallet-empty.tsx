import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet2, 
  CreditCard, 
  Plus,
  X,
  Check,
  Copy,
  LogOut,
  User,
  Edit3,
  Save,
  MessageCircleQuestionMark,
  BellRing
} from 'lucide-react';
import { MetaMaskIcon } from '../components/MetaMaskIcon';
import { Tooltip } from '../components/Tooltip';
import { Button } from "@/components/ui/button";
import { Heading2, Heading3, Label, BodyTextSmall } from "@/components/ui/typography";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUserProfile } from '../contexts/UserProfileContext';
import { useAuth } from '../contexts/AuthContext';

const DEMO_WALLET = {
  address: '0x1234567890123456789012345678901234567890',
};

export default function WalletEmpty() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { profile, setProfile } = useUserProfile();
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  
  // Profile editing states
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(profile?.name || '');
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [showAvatarEdit, setShowAvatarEdit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopiedTooltip(true);
      setTimeout(() => {
        setShowCopiedTooltip(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNameEdit = () => {
    setIsEditingName(true);
    setEditedName(profile?.name || '');
  };

  const handleNameSave = () => {
    if (editedName.trim() && profile) {
      setProfile({ ...profile, name: editedName.trim() });
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setEditedName(profile?.name || '');
    setIsEditingName(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && profile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const avatar = e.target?.result as string;
        setProfile({ ...profile, avatar });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="relative w-10 h-10"
            onMouseEnter={() => setShowAvatarEdit(true)}
            onMouseLeave={() => setShowAvatarEdit(false)}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-muted cursor-pointer">
              {profile?.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.name || "Profile"} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={20} className="text-muted-foreground" />
              )}
            </div>
            {showAvatarEdit && (
              <Button
                size="icon"
                variant="secondary"
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full shadow-lg"
                onClick={() => fileInputRef.current?.click()}
              >
                <Edit3 size={12} />
              </Button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          
          {profile?.name && (
            <div 
              className="relative"
              onMouseEnter={() => setShowNameEdit(true)}
              onMouseLeave={() => setShowNameEdit(false)}
            >
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="h-8 text-lg font-semibold"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNameSave();
                      if (e.key === 'Escape') handleNameCancel();
                    }}
                    autoFocus
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-6 h-6"
                    onClick={handleNameSave}
                  >
                    <Save size={12} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-6 h-6"
                    onClick={handleNameCancel}
                  >
                    <X size={12} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Heading3>{profile.name}</Heading3>
                  {showNameEdit && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-6 h-6 opacity-70 hover:opacity-100"
                      onClick={handleNameEdit}
                    >
                      <Edit3 size={12} />
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications, Help and Logout Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
          >
            <div className="relative">
              <BellRing size={16} />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-background"></span>
            </div>
            <span className="hidden md:inline">Notifications</span>
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2"
          >
            <MessageCircleQuestionMark size={16} />
            <span className="hidden md:inline">Get help</span>
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Log out</span>
          </Button>
        </div>
      </div>
      {/* Cash Section */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-6">
            <CardDescription>Cash</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle className="mb-2">Add Payment Method</CardTitle>
              <CardDescription className="mb-6 max-w-md mx-auto">
                Add a payment method to start managing your funds and participate in investments
              </CardDescription>
              <Button
                onClick={() => setShowAddCardModal(true)}
                variant="secondary"
                className="flex items-center"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crypto Wallet Section */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-6">
            <CardDescription>Crypto</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button
              variant="secondary"
              className="w-full justify-start h-auto py-4"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                <MetaMaskIcon size={24} />
              </div>
              <div className="text-left">
                <p className="font-medium">{DEMO_WALLET.address.slice(0, 6)}...{DEMO_WALLET.address.slice(-4)}</p>
                <p className="text-sm text-muted-foreground">MetaMask</p>
              </div>
              <div className="flex items-center ml-auto space-x-2">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(DEMO_WALLET.address);
                    }}
                    className="rounded-full"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Tooltip show={showCopiedTooltip} message="Address copied" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="rounded-full text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Add Card Modal */}
      <AnimatePresence>
        {showAddCardModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-lg z-40"
              onClick={() => setShowAddCardModal(false)}
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <Card className="w-full max-w-md rounded-3xl relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddCardModal(false)}
                  className="absolute right-4 top-4 h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardContent className="!p-0 pt-6 px-12 pb-12 sm:!p-0 sm:pt-6 sm:px-12 sm:pb-12">
                  <Heading2 className="mb-6">Add Payment Method</Heading2>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Card Number
                        </Label>
                        <Input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Expiry Date
                          </Label>
                          <Input
                            type="text"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            CVC
                          </Label>
                          <Input
                            type="text"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={() => navigate('/wallet')}
                      className="w-full"
                      size="lg"
                    >
                      Save Card
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}