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
  Loader2,
  Zap
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
  new: "bg-blue-50 text-blue-700 border-blue-100",
  contacted: "bg-amber-50 text-amber-700 border-amber-100",
  quoted: "bg-cyan-50 text-cyan-700 border-cyan-100",
  closed: "bg-emerald-50 text-emerald-700 border-emerald-100",
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
    { label: "Total Leads", value: leads.length, icon: Users, color: "text-secondary", trend: "+12%", spark: "M0 20 Q10 5, 20 15 T40 10", color_class: "secondary" },
    { label: "Active Leads", value: leads.filter(l => l.status !== "closed").length, icon: Clock, color: "text-blue-600", trend: "+5%", spark: "M0 15 Q15 20, 30 10 T40 18", color_class: "blue-500" },
    { label: "Success Rate", value: leads.length ? Math.round((leads.filter(l => l.status === "closed").length / leads.length) * 100) + "%" : "0%", icon: CheckCircle, color: "text-emerald-600", trend: "Excelent", spark: "M0 20 Q10 10, 20 20 T40 5", color_class: "emerald-500" },
    { label: "Critical Needs", value: leads.filter(l => l.urgency === "Emergency").length, icon: Calendar, color: "text-rose-600", trend: "Immediate", spark: "M0 10 Q10 20, 20 5 T40 15", color_class: "rose-500" },
  ];

  return (
    <div className="min-h-screen bg-frost font-body text-primary relative overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-ice/20 blur-[150px] rounded-full animate-float" style={{ animationDelay: '1s' }} />
      </div>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-primary shadow-md border-b border-white/10">
        <div className="container mx-auto px-6 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center group transition-all hover:opacity-90 active:scale-95">
              <img 
                src="/frostice-logo-white.png" 
                alt="Frost & Ice Aircon" 
                className="h-12 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" 
              />
            </Link>
            <div className="h-8 w-px bg-white/10 mx-2 hidden md:block" />
            <span className="text-[11px] uppercase tracking-[0.4em] font-800 text-ice select-none hidden md:block">
              Admin <span className="text-frost opacity-70 italic">Management Portal</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-frost border-frost/20 hover:bg-frost/10 hover:text-white uppercase tracking-widest font-bold text-[10px]" 
              onClick={handleLogout}
            >
              <LogOut className="h-3 w-3 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="text-secondary font-display text-xs uppercase tracking-[0.3em] mb-2 block">Management Dashboard</span>
            <h1 className="font-display text-4xl md:text-5xl font-800 uppercase text-primary leading-tight tracking-wider">Leads <span className="text-secondary">Overview</span></h1>
            <p className="text-muted-foreground text-sm mt-4 max-w-xl leading-relaxed">
              Real-time monitoring and management of all service inquiries across South Africa.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-secondary group-focus-within:scale-110 transition-all" />
              <input 
                type="text" 
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/80 backdrop-blur-md border border-white/40 rounded-xl pl-10 pr-4 py-3 text-sm w-full md:w-80 focus:outline-none focus:border-secondary focus:ring-[6px] focus:ring-secondary/5 transition-all placeholder:text-muted-foreground shadow-sm"
              />
            </div>
            <Button 
              variant="outline" 
              className="border-white/40 bg-white/80 backdrop-blur-md hover:bg-slate-50 shadow-sm h-12 w-12 p-0 rounded-xl group" 
              onClick={exportToCSV}
              title="Export to CSV"
            >
              <Download className="h-5 w-5 text-primary group-hover:text-secondary transition-colors" />
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
              className="h-full"
            >
              <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 h-full flex flex-col justify-between overflow-hidden group rounded-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-muted-foreground font-display text-[10px] uppercase tracking-[0.3em] font-800">{stat.label}</CardDescription>
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                      <stat.icon size={18} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-6 relative">
                  <div className="flex items-end justify-between relative z-10">
                    <div className="text-4xl font-800 font-display text-primary leading-none tracking-tight">{stat.value}</div>
                    <div className={`text-[9px] font-900 px-2 py-0.5 rounded-full ${stat.color === 'text-rose-600' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'} uppercase tracking-tight`}>
                      {stat.trend}
                    </div>
                  </div>
                  {/* Subtle Sparkline */}
                  <div className="absolute bottom-4 left-6 right-6 h-8 opacity-20 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 40 25" preserveAspectRatio="none">
                      <path d={stat.spark} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`text-${stat.color_class}`} />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Table Section */}
        <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-xl overflow-hidden mb-12 rounded-2xl">
          <CardHeader className="border-b border-white/20 py-8 px-10 flex flex-row items-center justify-between space-y-0 bg-slate-50/30">
            <div>
              <CardTitle className="font-display text-xl uppercase tracking-[0.3em] text-primary font-800">Service Inquiries</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1.5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live coordination of incoming service requests
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[11px] uppercase font-800 tracking-[0.25em] text-primary border-primary/20 px-4 py-1.5 bg-white shadow-sm">
              {filteredLeads.length} Total Records
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="h-96 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-secondary animate-spin" />
                <p className="text-muted-foreground font-display text-[10px] uppercase tracking-[0.2em] font-800">Synchronizing Data...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="h-96 flex flex-col items-center justify-center text-center p-8">
                <div className="h-20 w-20 rounded-2xl bg-frost flex items-center justify-center mb-6">
                  <Search className="h-10 w-10 text-secondary" />
                </div>
                <h3 className="font-display text-xl font-800 uppercase text-primary mb-3">No Results Found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto text-sm">We couldn't find any leads matching your current search parameters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-100/30">
                    <TableRow className="border-white/20 hover:bg-transparent">
                      <TableHead className="text-primary/70 font-800 uppercase text-[10px] tracking-[0.2em] py-6 px-10">Submission Date</TableHead>
                      <TableHead className="text-primary/70 font-800 uppercase text-[10px] tracking-[0.2em] py-6">Client Identity</TableHead>
                      <TableHead className="text-primary/70 font-800 uppercase text-[10px] tracking-[0.2em] py-6">Service Type</TableHead>
                      <TableHead className="text-primary/70 font-800 uppercase text-[10px] tracking-[0.2em] py-6">Urgency</TableHead>
                      <TableHead className="text-primary/70 font-800 uppercase text-[10px] tracking-[0.2em] py-6 w-[200px]">Status</TableHead>
                      <TableHead className="text-primary/70 font-800 uppercase text-[10px] tracking-[0.2em] py-6 px-10 text-right">Utility</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredLeads.map((lead, index) => (
                        <motion.tr 
                          key={lead.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="border-border hover:bg-frost/40 transition-colors group cursor-default"
                        >
                          <TableCell className="px-10 py-6">
                            <div className="flex items-center gap-3">
                              <Calendar className="h-3.5 w-3.5 text-secondary" />
                              <span className="text-xs font-bold text-primary/80">
                                {new Date(lead.created_at).toLocaleDateString("en-ZA", { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-6">
                            <div>
                              <p className="font-800 text-sm tracking-tight text-primary uppercase font-display">{lead.first_name} {lead.last_name}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[9px] font-900 bg-secondary/10 text-secondary px-2 rounded-sm uppercase tracking-tighter">{lead.client_type}</span>
                                <span className="text-[10px] text-muted-foreground/80 font-medium truncate max-w-[150px]">{lead.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-6">
                            <div className="flex items-center gap-2.5">
                              <div className="h-2 w-2 rounded-full bg-ice shadow-[0_0_8px_rgba(165,243,252,0.8)]" />
                              <p className="text-xs font-bold text-primary/80 uppercase tracking-tight">{lead.service_required}</p>
                            </div>
                          </TableCell>
                          <TableCell className="py-6">
                            {lead.urgency === "Emergency" ? (
                              <Badge className="bg-red-600 text-white border-none text-[9px] uppercase font-900 px-3 h-6 flex items-center gap-1.5 shadow-lg shadow-red-200 animate-pulse">
                                <Zap className="h-2.5 w-2.5 fill-current" /> Emergency
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground/60 border-white/40 text-[9px] uppercase font-800 font-display px-3 h-6">Normal Priority</Badge>
                            )}
                          </TableCell>
                          <TableCell className="py-6">
                            <Select 
                              defaultValue={lead.status} 
                              onValueChange={(val) => handleStatusChange(lead.id, val)}
                            >
                              <SelectTrigger className={`h-9 font-800 text-[9px] uppercase tracking-[0.2em] border-white/40 rounded-lg shadow-sm focus:ring-4 focus:ring-secondary/10 transition-all ${statusColors[lead.status]}`}>
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent className="bg-white/95 backdrop-blur-xl border-white/40 text-primary font-display shadow-2xl rounded-xl">
                                <SelectItem value="new" className="text-[10px] uppercase tracking-widest font-800 focus:bg-frost/40 py-2.5">New Inquiry</SelectItem>
                                <SelectItem value="contacted" className="text-[10px] uppercase tracking-widest font-800 focus:bg-frost/40 py-2.5">Contact Established</SelectItem>
                                <SelectItem value="quoted" className="text-[10px] uppercase tracking-widest font-800 focus:bg-frost/40 py-2.5">Quotation Issued</SelectItem>
                                <SelectItem value="closed" className="text-[10px] uppercase tracking-widest font-800 focus:bg-frost/40 py-2.5">Service Finalised</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="py-6 px-10 text-right">
                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-9 px-4 border-white/40 bg-white text-primary text-[10px] font-800 uppercase tracking-[0.2em] hover:bg-secondary hover:text-white hover:border-secondary transition-all shadow-sm"
                                onClick={() => setSelectedLead(lead)}
                              >
                                Review
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-9 w-9 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                onClick={() => handleDelete(lead.id)}
                              >
                                <Trash2 className="h-4.5 w-4.5" />
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
            <DialogContent className="max-w-2xl bg-white border-border text-primary shadow-2xl p-0 overflow-hidden font-body rounded-2xl">
              <DialogHeader className="p-10 pb-6 relative bg-primary text-white border-b border-white/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-secondary font-display text-[10px] uppercase tracking-[0.3em] font-800 mb-2 block">Service Inquiry Detail</span>
                    <DialogTitle className="text-3xl font-800 uppercase tracking-tight font-display">
                      Client <span className="text-secondary">Inquiry</span>
                    </DialogTitle>
                    <DialogDescription className="text-frost/60 font-bold uppercase text-[10px] tracking-widest mt-1 font-body">
                      Reference ID: {selectedLead.id.split("-")[0].toUpperCase()}
                    </DialogDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`border-none px-3 py-1 font-800 uppercase text-[9px] tracking-widest ${statusColors[selectedLead.status]}`}>
                      {selectedLead.status === "closed" ? "Completed" : selectedLead.status.replace("_", " ")}
                    </Badge>
                    {selectedLead.urgency === "Emergency" && (
                      <Badge className="bg-red-600 text-white font-800 uppercase text-[9px] tracking-widest px-3 py-1 animate-pulse">
                        High Priority
                      </Badge>
                    )}
                  </div>
                </div>
              </DialogHeader>
              
              <div className="px-10 py-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Info Block Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-800 text-secondary tracking-[0.2em] font-display">Client Name</p>
                      <p className="font-800 text-xl text-primary font-display uppercase">{selectedLead.first_name} {selectedLead.last_name}</p>
                      <Badge variant="secondary" className="bg-frost text-primary border-none text-[9px] font-800 uppercase px-2">{selectedLead.client_type}</Badge>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] uppercase font-800 text-secondary tracking-[0.2em] font-display">Contact Channels</p>
                      <div className="flex flex-col gap-1.5">
                        <p className="text-sm font-bold text-primary/80">{selectedLead.email}</p>
                        <p className="text-sm font-medium text-muted-foreground">{selectedLead.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-800 text-secondary tracking-[0.2em] font-display">Service Requested</p>
                      <p className="font-800 text-xl text-primary font-display uppercase leading-tight">{selectedLead.service_required}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-800 text-secondary tracking-[0.2em] font-display">Service Location</p>
                      <div className="flex items-start gap-2.5">
                        <MapPin className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                        <p className="text-sm font-medium text-primary/80 leading-relaxed italic border-l-2 border-frost pl-3">
                          {selectedLead.address || "Location not provided."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Narrative / Message */}
                <div className="bg-frost/40 border border-frost rounded-xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Type size={120} className="text-primary rotate-12" />
                  </div>
                  <p className="text-[10px] uppercase font-800 text-primary/40 tracking-[0.2em] font-display mb-6">Detailed Description</p>
                  <p className="text-base text-primary/90 leading-relaxed font-medium relative z-10">
                    {selectedLead.message ? `"${selectedLead.message}"` : "No description provided with this submission."}
                  </p>
                </div>

                {/* Administrative Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-border">
                  <Button asChild className="w-full sm:flex-1 bg-secondary hover:bg-secondary/90 text-white font-800 uppercase tracking-widest py-7 rounded-xl shadow-lg shadow-secondary/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                    <a href={`mailto:${selectedLead.email}`}>
                      <ExternalLink className="h-4 w-4 mr-2" /> Respond via Email
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200 font-800 uppercase tracking-widest py-7 px-8 rounded-xl" 
                    onClick={() => handleDelete(selectedLead.id)}
                  >
                    Delete Record
                  </Button>
                </div>
              </div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }
      `}} />
    </div>
  );
};

export default Dashboard;
