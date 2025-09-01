import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, X, HelpCircle } from 'lucide-react';
import { Card } from '../components/Card';
import { useAuth } from '../contexts/AuthContext';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              onClick={() => navigate(-1)}
            >
              <HelpCircle size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-headline text-center flex-1">Welcome!</h1>
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              onClick={() => navigate(-1)}
            >
              <X size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Email Input */}
          <form onSubmit={handleEmailLogin} className="mb-6">
            <div className="flex items-center space-x-3 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Mail size={20} className="text-gray-500 dark:text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                className="bg-transparent w-full focus:outline-none text-gray-900 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!email || isLoading}
              className={`w-full mt-4 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors ${(!email || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Signing in...' : 'Continue with Email'}
            </button>
          </form>

          {/* Google Login */}
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className={`w-full flex items-center justify-center space-x-3 px-4 py-3 mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            <span className="font-medium">Continue with Google</span>
          </button>

          {/* Social Logins */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            <button
              onClick={() => handleSocialLogin('twitter')}
              disabled={isLoading}
              className={`flex items-center justify-center p-3 bg-black rounded-full hover:opacity-90 transition-opacity ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            <button
              onClick={() => handleSocialLogin('discord')}
              className="flex items-center justify-center p-3 bg-[#5865F2] rounded-full hover:opacity-90 transition-opacity"
            >
              <img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_white_RGB.png" alt="Discord" className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleSocialLogin('apple')}
              className="flex items-center justify-center p-3 bg-black rounded-full hover:opacity-90 transition-opacity"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
            </button>
            <button
              className="flex items-center justify-center p-3 bg-gray-800 dark:bg-gray-700 rounded-full hover:opacity-90 transition-opacity"
            >
              <span className="text-white text-xl">•••</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
            <span className="text-gray-500 dark:text-gray-400">or</span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          {/* Wallet Options */}
          <div className="space-y-3">
            <button
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
              className={`w-full flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <img src="https://explorer-api.walletconnect.com/v3/logo/lg" alt="WalletConnect" className="w-8 h-8 rounded-lg" />
                <span className="font-medium">WalletConnect</span>
              </div>
              <span className="text-sm text-brand px-3 py-1 bg-brand/10 rounded-md">QR CODE</span>
            </button>

            <button
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
              className={`w-full flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-8 h-8" />
                <span className="font-medium">MetaMask</span>
              </div>
            </button>

            <button
              onClick={() => navigate('/wallets')}
              disabled={isLoading}
              className={`w-full flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-brand fill-current">
                    <path d="M4 4h16v16H4V4zm2 4h12v3H6V8zm0 5h12v3H6v-3z" />
                  </svg>
                </div>
                <span className="font-medium">All Wallets</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">480+</span>
            </button>
          </div>

          {/* Footer */}
         
        </Card>
      </motion.div>
    </div>
  );
}