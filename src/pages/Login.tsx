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
    <div className="min-h-screen bg-frost font-body text-primary relative overflow-hidden flex flex-col justify-center items-center p-4">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-ice/20 blur-[150px] rounded-full animate-float" style={{ animationDelay: '1s' }} />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md pb-20 relative z-10"
      >
        <div className="flex justify-center mb-12">
          <Link to="/" className="flex items-center group transition-all hover:opacity-90 active:scale-95">
            <img 
              src="/frostice-logo-white.png" 
              alt="Frost & Ice" 
              className="h-16 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(0,67,139,0.15)]" 
            />
          </Link>
        </div>
        
        <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-2xl rounded-3xl overflow-hidden border-t-8 border-t-secondary/80">
          <CardHeader className="space-y-2 pb-8 pt-12 px-10 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mb-6 text-ice shadow-xl shadow-primary/10 border border-white/20">
              <Lock className="h-7 w-7" />
            </div>
            <CardTitle className="text-3xl font-800 uppercase tracking-[0.3em] text-primary font-display">
              Admin <span className="text-secondary">Portal</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground text-[10px] font-800 uppercase tracking-[0.2em] opacity-60">
              Authorized Personnel Access Only
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-10 pb-10 pt-2">
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-primary font-800 uppercase text-[10px] tracking-[0.3em] pl-1 opacity-60">Identity / Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@frosticeaircon.co.za"
                  className="bg-white/50 border-white/60 text-primary placeholder:text-slate-400 h-14 rounded-xl focus:border-secondary focus:ring-[6px] focus:ring-secondary/5 transition-all shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between pl-1">
                  <Label htmlFor="password" className="text-primary font-800 uppercase text-[10px] tracking-[0.3em] opacity-60">Credential / Pin</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-white/50 border-white/60 text-primary h-14 rounded-xl focus:border-secondary focus:ring-[6px] focus:ring-secondary/5 transition-all shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-14 text-[10px] font-900 uppercase tracking-[0.4em] bg-primary hover:bg-primary/95 shadow-xl shadow-primary/10 text-ice transition-all transform hover:-translate-y-1 active:translate-y-0 rounded-xl" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Validating...
                  </div>
                ) : (
                  "Unlock Portal"
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="bg-slate-50/50 backdrop-blur-md border-t border-white/20 flex justify-center py-6 px-10">
            <p className="text-[9px] uppercase tracking-[0.4em] text-slate-400 font-900">
              Frost & Ice Precision Management
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-12 text-center">
          <Link to="/" className="text-primary/30 hover:text-secondary text-[10px] uppercase tracking-[0.3em] font-900 transition-all hover:tracking-[0.4em]">
            ← Return to Interface
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
