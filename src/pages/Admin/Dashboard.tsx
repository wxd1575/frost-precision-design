import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Users, Clock, CheckCircle } from "lucide-react";

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
  new: "bg-blue-500 hover:bg-blue-600",
  contacted: "bg-yellow-500 hover:bg-yellow-600",
  quoted: "bg-purple-500 hover:bg-purple-600",
  closed: "bg-green-500 hover:bg-green-600",
};

const Dashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        title: "Error fetching leads",
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
    const previousLeads = [...leads];
    
    // Optimistic update
    setLeads(leads.map(lead => lead.id === leadId ? { ...lead, status: newStatus as any } : lead));

    const { error } = await supabase
      .from("contact_submissions")
      .update({ status: newStatus })
      .eq("id", leadId);

    if (error) {
      // Revert optimism
      setLeads(previousLeads);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Status Updated",
        description: `Lead status changed to ${newStatus}.`,
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const newLeadsCount = leads.filter(l => l.status === "new").length;
  const contactedCount = leads.filter(l => l.status === "contacted").length;
  const closedCount = leads.filter(l => l.status === "closed").length;

  return (
    <div className="min-h-screen bg-muted/40 font-body">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
        <div className="flex w-full items-center justify-between">
          <Link to="/" className="font-display font-900 text-2xl tracking-tight text-secondary group flex items-center gap-2">
            FROST <span className="text-primary font-300">/</span> ICE
            <Badge variant="outline" className="ml-2 font-body font-normal tracking-normal text-xs uppercase text-primary border-primary">Admin</Badge>
          </Link>
          <Button variant="ghost" className="gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="grid flex-1 items-start gap-6 p-6 sm:px-10 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display">{leads.length}</div>
              <p className="text-xs text-muted-foreground">Lifetime volume</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Leads</CardTitle>
              <Badge variant="default" className="bg-blue-500">Action Required</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display">{newLeadsCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting follow-up</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Pipeline</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display">{contactedCount}</div>
              <p className="text-xs text-muted-foreground">Contacted & pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Closed Won</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display">{closedCount}</div>
              <p className="text-xs text-muted-foreground">Successfully closed</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="px-7">
            <CardTitle className="font-display text-xl uppercase tracking-wider text-secondary">Incoming Quote Requests</CardTitle>
            <CardDescription>
              Manage your leads, update statuses, and view customer requirements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                  <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  <p className="text-muted-foreground">Loading leads...</p>
                </div>
              </div>
            ) : leads.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
                <LayoutDashboard className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="font-display text-lg uppercase tracking-wider">No Leads Yet</h3>
                <p className="text-muted-foreground max-w-sm text-center">When customers submit quote requests via the contact form, they will appear here.</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Date</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Service Required</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead className="w-[200px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id} className="group">
                        <TableCell className="font-medium">
                          {new Intl.DateTimeFormat("en-ZA", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }).format(new Date(lead.created_at))}
                        </TableCell>
                        <TableCell>
                          <p className="font-semibold">{lead.first_name} {lead.last_name}</p>
                          <Badge variant="secondary" className="mt-1 text-[10px] uppercase font-display bg-teal-100 text-teal-800 hover:bg-teal-100">
                            {lead.client_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{lead.email}</p>
                          <p className="text-sm text-muted-foreground">{lead.phone}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-sm">{lead.service_required}</p>
                          {lead.address && <p className="text-xs text-muted-foreground max-w-[200px] truncate" title={lead.address}>{lead.address}</p>}
                        </TableCell>
                        <TableCell>
                          {lead.urgency ? (
                            <Badge variant={lead.urgency === "Emergency" ? "destructive" : "outline"} className="text-xs">
                              {lead.urgency}
                            </Badge>
                          ) : <span className="text-muted-foreground text-sm">-</span>}
                        </TableCell>
                        <TableCell>
                          <Select 
                            defaultValue={lead.status} 
                            onValueChange={(val) => handleStatusChange(lead.id, val)}
                          >
                            <SelectTrigger className={`h-8 font-medium text-white border-0 ${statusColors[lead.status]}`}>
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="quoted">Quoted</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
