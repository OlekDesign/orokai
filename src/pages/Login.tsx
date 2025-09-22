import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, X, HelpCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '../contexts/AuthContext';
import { cn } from "@/lib/utils";
import { Heading1, Heading2, BodyText, Caption, Overline } from "@/components/ui/typography";

export function Login() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithWallet } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, 'password');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      // Simulate social login
      await new Promise(resolve => setTimeout(resolve, 1000));
      await login(provider + '@example.com', 'password');
      navigate('/dashboard');
    } catch (error) {
      console.error('Social login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="space-y-16">
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground mb-4">Orokai</h1>
            <Heading1 className="text-center">Passive Income<br></br> Made Simple</Heading1>
          </div>

          <div className="space-y-6">
            {/* Email Input */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="flex items-center space-x-3 px-4 py-3 bg-muted rounded-lg">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                disabled={!email || isLoading}
                className="w-full"
              >
                {isLoading ? 'Signing in...' : 'Continue with Email'}
              </Button>
            </form>

            {/* Google Login */}
            <Button
              variant="secondary"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="w-full"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-3" />
              Continue with Google
            </Button>

            {/* Social Logins */}
            <div className="grid grid-cols-5 gap-3">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => handleSocialLogin('twitter')}
                disabled={isLoading}
                className="rounded-full bg-black hover:bg-black/90 text-white"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Button>
              
              <Button
                variant="secondary"
                size="icon"
                onClick={() => handleSocialLogin('apple')}
                className="rounded-full bg-black hover:bg-black/90 text-white"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                </svg>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-muted hover:bg-muted/90"
              >
                <BodyText>•••</BodyText>
              </Button>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center space-x-4">
              <div className="flex-1 border-t border-border"></div>
              <span className="text-muted-foreground">or</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            {/* Wallet Options */}
            <div className="space-y-3">
              <Button
                variant="secondary"
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    await loginWithWallet('walletconnect');
                    navigate('/dashboard');
                  } catch (error) {
                    console.error('WalletConnect login error:', error);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
                className="w-full justify-between h-auto py-3"
              >
                <div className="flex items-center space-x-3">
                  <img src="https://explorer-api.walletconnect.com/v3/logo/lg" alt="WalletConnect" className="w-8 h-8 rounded-lg" />
                  <span>WalletConnect</span>
                </div>
                <Overline className="text-primary bg-primary/10 px-3 py-1 rounded-md">QR CODE</Overline>
              </Button>

              <Button
                variant="secondary"
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    await loginWithWallet('metamask');
                    navigate('/dashboard');
                  } catch (error) {
                    console.error('MetaMask login error:', error);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
                className="w-full justify-between h-auto py-3"
              >
                <div className="flex items-center space-x-3">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-8 h-8" />
                  <span>MetaMask</span>
                </div>
              </Button>

              <Button
                variant="secondary"
                onClick={() => navigate('/wallets')}
                disabled={isLoading}
                className="w-full justify-between h-auto py-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary fill-current">
                      <path d="M4 4h16v16H4V4zm2 4h12v3H6V8zm0 5h12v3H6v-3z" />
                    </svg>
                  </div>
                  <span>All Wallets</span>
                </div>
                <span className="text-caption">480+</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}