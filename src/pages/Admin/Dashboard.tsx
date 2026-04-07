import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  Users, 
  Clock, 
  CheckCircle, 
  Search, 
  Download, 
  Eye, 
  Trash2, 
  Calendar, 
  MapPin, 
  Type, 
  ExternalLink,
  Loader2
} from "lucide-react";

type Lead = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  client_type: string;
  service_required: string;
  address: string | null;
  urgency: string | null;
  message: string;
  status: "new" | "contacted" | "quoted" | "closed";
  created_at: string;
};

const statusColors = {
  new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  contacted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  quoted: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  closed: "bg-green-500/20 text-green-400 border-green-500/30",
};

const Dashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchLeads = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Database Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setLeads(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status: newStatus })
      .eq("id", leadId);

    if (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setLeads(leads.map(lead => lead.id === leadId ? { ...lead, status: newStatus as any } : lead));
      toast({
        title: "Status Updated",
        description: `Lead moved to ${newStatus}.`,
      });
    }
  };

  const handleDelete = async (leadId: string) => {
    if (!confirm("Are you sure you want to permanently delete this lead data?")) return;

    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", leadId);

    if (error) {
      toast({ title: "Delete Failed", description: error.message, variant: "destructive" });
    } else {
      setLeads(leads.filter(l => l.id !== leadId));
      if (selectedLead?.id === leadId) setSelectedLead(null);
      toast({ title: "Lead Erased", description: "The lead has been removed from the system." });
    }
  };

  const exportToCSV = () => {
    const headers = ["Date", "Name", "Email", "Phone", "Type", "Service", "Status", "Message"];
    const rows = leads.map(l => [
      new Date(l.created_at).toLocaleDateString(),
      `${l.first_name} ${l.last_name}`,
      l.email,
      l.phone,
      l.client_type,
      l.service_required,
      l.status,
      l.message.replace(/,/g, ";")
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `frost_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const filteredLeads = leads.filter(l => 
    `${l.first_name} ${l.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.service_required.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Leads", value: leads.length, icon: Users, color: "text-ice" },
    { label: "Active Pipeline", value: leads.filter(l => l.status !== "closed").length, icon: Clock, color: "text-yellow-400" },
    { label: "Success Rate", value: leads.length ? Math.round((leads.filter(l => l.status === "closed").length / leads.length) * 100) + "%" : "0%", icon: CheckCircle, color: "text-green-400" },
    { label: "Critical Needs", value: leads.filter(l => l.urgency === "Emergency").length, icon: Calendar, color: "text-red-400" },
  ];

  return (
    <div className="min-h-screen relative font-body text-white selection:bg-ice/30">
      {/* Immersive Background */}
      <div className="fixed inset-0 bg-hero-gradient -z-10" />
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 -z-10" />
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-display font-900 text-2xl tracking-tighter text-white uppercase italic hover:text-ice transition-colors">
              FROST <span className="text-ice not-italic">/</span> ICE
            </Link>
            <div className="h-4 w-px bg-white/10 mx-2" />
            <Badge variant="outline" className="font-bold tracking-[0.2em] text-[10px] uppercase text-ice border-ice/20 bg-ice/5 px-3 py-1">Command Center</Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-frost/60 hover:text-white" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-4xl font-900 uppercase tracking-tight mb-2">Operation <span className="text-ice">Overview</span></h1>
            <p className="text-frost/40 font-bold uppercase tracking-[0.3em] text-[10px]">Managing global precision cooling requests</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-frost/30 group-focus-within:text-ice transition-colors" />
              <input 
                type="text" 
                placeholder="Search database..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm w-full md:w-64 focus:outline-none focus:border-ice/50 focus:ring-4 focus:ring-ice/10 transition-all placeholder:text-frost/20"
              />
            </div>
            <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10" onClick={exportToCSV}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
            >
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1 h-full ${stat.color} opacity-20`} />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-frost/40 font-bold uppercase text-[10px] tracking-widest">{stat.label}</CardDescription>
                    <stat.icon className={`h-4 w-4 ${stat.color} opacity-40 group-hover:scale-110 transition-transform`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-4xl font-900 font-display ${stat.color}`}>{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Table Section */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden">
          <CardHeader className="border-b border-white/5 py-8 px-8">
            <CardTitle className="font-display text-xl uppercase tracking-wider text-ice">Mission Log: Quote Submissions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="h-96 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-ice animate-spin" />
                <p className="text-frost/40 font-bold uppercase text-[10px] tracking-widest">Accessing Subsurface Data...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="h-96 flex flex-col items-center justify-center text-center p-8">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Search className="h-8 w-8 text-frost/20" />
                </div>
                <h3 className="font-display text-lg uppercase tracking-wider text-white mb-2">Log is Empty</h3>
                <p className="text-frost/40 max-w-xs mx-auto text-sm">No submissions match your current search criteria or the database is currently dormant.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-frost/40 font-bold uppercase text-[10px] tracking-widest py-6 px-8">Arrival Date</TableHead>
                      <TableHead className="text-frost/40 font-bold uppercase text-[10px] tracking-widest py-6">Operative</TableHead>
                      <TableHead className="text-frost/40 font-bold uppercase text-[10px] tracking-widest py-6">Objective</TableHead>
                      <TableHead className="text-frost/40 font-bold uppercase text-[10px] tracking-widest py-6">Urgency</TableHead>
                      <TableHead className="text-frost/40 font-bold uppercase text-[10px] tracking-widest py-6 w-[200px]">Phase</TableHead>
                      <TableHead className="text-frost/40 font-bold uppercase text-[10px] tracking-widest py-6 px-8 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredLeads.map((lead) => (
                        <motion.tr 
                          key={lead.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="border-white/5 hover:bg-white/5 transition-colors group"
                        >
                          <TableCell className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <Calendar className="h-3 w-3 text-ice/40" />
                              <span className="text-xs font-bold text-frost/70">
                                {new Date(lead.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-5">
                            <div>
                              <p className="font-900 text-sm tracking-tight text-white">{lead.first_name} {lead.last_name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-[9px] uppercase font-bold py-0 h-4 bg-ice/10 text-ice border-none">{lead.client_type}</Badge>
                                <span className="text-[10px] text-frost/30 truncate max-w-[150px]">{lead.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-5">
                            <div className="flex items-center gap-2">
                              <Type className="h-3 w-3 text-ice/40" />
                              <p className="text-xs font-bold text-frost/80">{lead.service_required}</p>
                            </div>
                          </TableCell>
                          <TableCell className="py-5">
                            {lead.urgency === "Emergency" ? (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[9px] uppercase font-black animate-pulse">Critical</Badge>
                            ) : (
                              <Badge variant="outline" className="text-frost/40 border-white/10 text-[9px] uppercase font-bold">{lead.urgency || "Standard"}</Badge>
                            )}
                          </TableCell>
                          <TableCell className="py-5">
                            <Select 
                              defaultValue={lead.status} 
                              onValueChange={(val) => handleStatusChange(lead.id, val)}
                            >
                              <SelectTrigger className={`h-8 font-black text-[10px] uppercase tracking-widest border-0 rounded-lg ${statusColors[lead.status]}`}>
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent className="bg-secondary border-white/10 text-white">
                                <SelectItem value="new" className="text-[10px] uppercase tracking-widest font-bold focus:bg-white/10">Initial</SelectItem>
                                <SelectItem value="contacted" className="text-[10px] uppercase tracking-widest font-bold focus:bg-white/10">Contacted</SelectItem>
                                <SelectItem value="quoted" className="text-[10px] uppercase tracking-widest font-bold focus:bg-white/10">Proposal Sent</SelectItem>
                                <SelectItem value="closed" className="text-[10px] uppercase tracking-widest font-bold focus:bg-white/10">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="py-5 px-8 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-frost/40 hover:text-ice hover:bg-ice/5 rounded-lg"
                                onClick={() => setSelectedLead(lead)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-frost/40 hover:text-red-400 hover:bg-red-400/5 rounded-lg"
                                onClick={() => handleDelete(lead.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Lead Detail Modal */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <AnimatePresence>
          {selectedLead && (
            <DialogContent className="max-w-2xl bg-secondary/95 backdrop-blur-3xl border-white/10 text-white shadow-2xl p-0 overflow-hidden font-body">
              <DialogHeader className="p-8 pb-4 relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-ice shadow-[0_0_20px_rgba(45,160,255,0.5)]" />
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <DialogTitle className="text-3xl font-900 uppercase tracking-tight mb-2">
                      Request <span className="text-ice">Protocol</span>
                    </DialogTitle>
                    <DialogDescription className="text-frost/40 font-bold uppercase text-[10px] tracking-widest">
                      Lead ID: {selectedLead.id.split('-')[0].toUpperCase()}
                    </DialogDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusColors[selectedLead.status]}>{selectedLead.status.toUpperCase()}</Badge>
                    {selectedLead.urgency === "Emergency" && <Badge className="bg-red-500 text-white font-black animate-pulse">EMERGENCY</Badge>}
                  </div>
                </div>
              </DialogHeader>
              
              <div className="px-8 pb-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black text-ice tracking-tighter">Operative</p>
                      <p className="font-bold text-lg">{selectedLead.first_name} {selectedLead.last_name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black text-ice tracking-tighter">Communications</p>
                      <p className="text-sm font-medium">{selectedLead.email}</p>
                      <p className="text-sm text-frost/40">{selectedLead.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black text-ice tracking-tighter">Objective</p>
                      <p className="font-bold text-lg text-white">{selectedLead.service_required}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black text-ice tracking-tighter">Coordinates</p>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-3 w-3 text-ice mt-1 shrink-0" />
                        <p className="text-sm font-medium leading-relaxed">{selectedLead.address || "No target address provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Type className="h-6 w-6 text-ice" />
                  </div>
                  <p className="text-[10px] uppercase font-black text-frost/40 tracking-widest mb-4">Transmission Content</p>
                  <p className="text-sm text-frost/80 leading-relaxed font-medium">
                    {selectedLead.message || "No specific mission details provided."}
                  </p>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center gap-4 pt-4">
                  <Button asChild className="flex-1 bg-ice/10 text-ice border border-ice/20 hover:bg-ice/20 transition-all">
                    <a href={`mailto:${selectedLead.email}`}>
                      <ExternalLink className="h-4 w-4 mr-2" /> Open Channel
                    </a>
                  </Button>
                  <Button variant="ghost" className="text-red-400 hover:text-red-500 hover:bg-red-400/5" onClick={() => handleDelete(selectedLead.id)}>
                    Erased Lead
                  </Button>
                </div>
              </div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(45, 160, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(45, 160, 255, 0.4);
        }
      `}} />
    </div>
  );
};

export default Dashboard;
