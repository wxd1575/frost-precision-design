import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Welcome back, Admin.",
    });
    
    navigate("/admin");
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center p-4 overflow-hidden">
      {/* Background with fluid gradient */}
      <div className="absolute inset-0 -z-10 bg-hero-gradient" />
      <div className="absolute inset-0 -z-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ice/10 rounded-full blur-3xl animate-pulse" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex justify-center mb-12 group">
          <span className="font-display font-900 text-4xl tracking-tighter text-white uppercase italic">
            FROST <span className="text-ice not-italic">/</span> ICE
          </span>
        </Link>
        
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-ice/50 to-transparent" />
          
          <CardHeader className="space-y-2 pb-8 pt-10 px-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-ice/10 border border-ice/20 flex items-center justify-center mb-6 shadow-lg shadow-ice/5">
              <Lock className="text-ice h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-900 uppercase tracking-tight text-white leading-none">
              Admin <span className="text-ice">Portal</span>
            </CardTitle>
            <CardDescription className="text-frost/60 text-sm font-medium">
              Secure access for the Precision Design team.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-frost/80 text-xs font-bold uppercase tracking-widest pl-1">Email Terminal</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@frosticeaircon.co.za"
                  className="bg-white/5 border-white/10 text-white placeholder:text-frost/30 h-14 rounded-xl focus:border-ice/50 focus:ring-ice/20 transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-frost/80 text-xs font-bold uppercase tracking-widest pl-1">Access Protocol</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:border-ice/50 focus:ring-ice/20 transition-all duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" variant="hero" className="w-full h-14 text-sm font-900 uppercase tracking-widest shadow-xl shadow-ice/10" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin text-ice" />
                    Bypassing Security...
                  </>
                ) : (
                  "Initialize Session"
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="bg-black/20 border-t border-white/5 flex justify-center py-5 px-8">
            <p className="text-[10px] uppercase tracking-[0.4em] text-frost/40 font-bold">
              Protected by Frost Precision Security
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center text-frost/40 text-xs">
          <Link to="/" className="hover:text-ice transition-colors duration-300">
            Return to Public Mission Board
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
