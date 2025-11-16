import { useState, useMemo } from "react";
import { Plus, Users, Activity, PieChart, User as UserIcon, X, TrendingUp, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GroupCard } from "@/components/GroupCard";
import { ExpenseCard } from "@/components/ExpenseCard";
import { toast } from "sonner";

interface Group {
  id: number;
  name: string;
  members: string[];
  createdAt: string;
  currency: string;
}

interface Expense {
  id: number;
  groupId: number;
  description: string;
  amount: number;
  paidBy: string;
  splits: Record<string, number>;
  date: string;
  category: string;
}

interface Settlement {
  id: number;
  groupId: number;
  from: string;
  to: string;
  amount: number;
  status: "pending" | "settled";
  date: string;
}

interface UserDebt {
  person: string;
  owes: Record<string, number>;
  owed: Record<string, number>;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<"groups" | "settle" | "analytics">("groups");
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [showGroupDetailsModal, setShowGroupDetailsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  
  // Current user
  const [currentUser, setCurrentUser] = useState("You");
  const [profileForm, setProfileForm] = useState({ name: "John Doe", email: "john@example.com", phone: "+1 234-567-8900" });
  
  // Form states
  const [groupForm, setGroupForm] = useState({ name: "", description: "", currency: "INR", members: "" });
  const [expenseForm, setExpenseForm] = useState({ 
    description: "", 
    amount: "", 
    category: "Food",
    paidBy: currentUser,
    splitMembers: ""
  });

  // Data state
  const [groups, setGroups] = useState<Group[]>([
    {
      id: 1,
      name: "Weekend Trip",
      members: ["You", "Sarah", "Mike", "Emma"],
      createdAt: "2024-11-10",
      currency: "INR",
    },
    {
      id: 2,
      name: "Roommates",
      members: ["You", "Alex", "Jordan"],
      createdAt: "2024-11-01",
      currency: "INR",
    },
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      groupId: 1,
      description: "Dinner at Mario's",
      amount: 7200,
      paidBy: "Sarah",
      splits: { "You": 1800, "Sarah": 1800, "Mike": 1800, "Emma": 1800 },
      date: "Today, 7:30 PM",
      category: "Food",
    },
    {
      id: 2,
      groupId: 1,
      description: "Uber to Airport",
      amount: 3750,
      paidBy: "You",
      splits: { "You": 0, "Sarah": 1250, "Mike": 1250, "Emma": 1250 },
      date: "Today, 2:15 PM",
      category: "Transport",
    },
  ]);

  const [settlements, setSettlements] = useState<Settlement[]>([
    {
      id: 1,
      groupId: 1,
      from: "You",
      to: "Sarah",
      amount: 1800,
      status: "pending",
      date: "2024-11-15",
    },
  ]);

  // Calculate debts for a group
  const calculateGroupDebts = (groupId: number): UserDebt[] => {
    const groupExpenses = expenses.filter(e => e.groupId === groupId);
    const debts: Record<string, UserDebt> = {};
    
    groupExpenses.forEach(expense => {
      groupExpenses.forEach(expense => {
        Object.entries(expense.splits).forEach(([person, amount]) => {
          if (!debts[person]) {
            debts[person] = { person, owes: {}, owed: {} };
          }
          if (person !== expense.paidBy && amount > 0) {
            debts[person].owes[expense.paidBy] = (debts[person].owes[expense.paidBy] || 0) + amount;
          }
          if (person === expense.paidBy && amount === 0) {
            Object.keys(expense.splits).forEach(other => {
              if (other !== person && expense.splits[other] > 0) {
                debts[person].owed[other] = (debts[person].owed[other] || 0) + expense.splits[other];
              }
            });
          }
        });
      });
    });

    return Object.values(debts);
  };

  // Get group details
  const getGroupDetails = (groupId: number) => {
    return groups.find(g => g.id === groupId);
  };

  // Calculate group totals
  const getGroupTotals = (groupId: number) => {
    const groupExpenses = expenses.filter(e => e.groupId === groupId);
    const totalAmount = groupExpenses.reduce((sum, e) => sum + e.amount, 0);
    const userTotal = groupExpenses.reduce((sum, e) => sum + (e.splits[currentUser] || 0), 0);
    return { totalAmount, userTotal, count: groupExpenses.length };
  };

  // Handlers
  const handleCreateGroup = () => {
    if (!groupForm.name.trim()) {
      toast.error("Error", { description: "Please enter a group name" });
      return;
    }

    const membersList = groupForm.members
      .split(",")
      .map(m => m.trim())
      .filter(m => m);

    if (membersList.length === 0) {
      toast.error("Error", { description: "Please add at least one member" });
      return;
    }

    const newGroup: Group = {
      id: Math.max(0, ...groups.map(g => g.id)) + 1,
      name: groupForm.name,
      members: [currentUser, ...membersList],
      createdAt: new Date().toISOString().split("T")[0],
      currency: groupForm.currency,
    };

    setGroups([...groups, newGroup]);
    setGroupForm({ name: "", description: "", currency: "INR", members: "" });
    setShowCreateGroupModal(false);
    toast.success("Group Created!", {
      description: `"${newGroup.name}" has been created with ${newGroup.members.length} members.`,
    });
  };

  const handleAddExpense = () => {
    if (!expenseForm.description.trim() || !expenseForm.amount || !selectedGroupId) {
      toast.error("Error", { description: "Please fill all required fields" });
      return;
    }

    const group = getGroupDetails(selectedGroupId);
    if (!group) return;

    const amount = Number(expenseForm.amount);
    const splits: Record<string, number> = {};
    const splitCount = group.members.length;
    const splitAmount = amount / splitCount;

    group.members.forEach(member => {
      splits[member] = splitAmount;
    });

    const newExpense: Expense = {
      id: Math.max(0, ...expenses.map(e => e.id)) + 1,
      groupId: selectedGroupId,
      description: expenseForm.description,
      amount,
      paidBy: expenseForm.paidBy,
      splits,
      date: "Today, just now",
      category: expenseForm.category,
    };

    setExpenses([...expenses, newExpense]);
    setExpenseForm({ description: "", amount: "", category: "Food", paidBy: currentUser, splitMembers: "" });
    toast.success("Expense Added!", {
      description: `₹${amount} split equally among ${splitCount} members.`,
    });
  };

  const handleSettleUp = (from: string, to: string, amount: number, groupId: number) => {
    const settlement: Settlement = {
      id: Math.max(0, ...settlements.map(s => s.id)) + 1,
      groupId,
      from,
      to,
      amount,
      status: "settled",
      date: new Date().toISOString().split("T")[0],
    };

    setSettlements([...settlements, settlement]);
    toast.success("Settlement Recorded!", {
      description: `${from} paid ₹${amount} to ${to}.`,
    });
  };

  const handleSaveProfile = () => {
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      toast.error("Error", { description: "Please fill all fields" });
      return;
    }

    setCurrentUser(profileForm.name);
    setShowProfileModal(false);
    toast.success("Profile Updated!", {
      description: "Your profile has been updated successfully.",
    });
  };

  // Memoized calculations for analytics
  const analyticsData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    const monthlyTotals: Record<string, number> = {};

    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
      monthlyTotals["November"] = (monthlyTotals["November"] || 0) + expense.amount;
    });

    return { categoryTotals, monthlyTotals };
  }, [expenses]);

  const groupTotals = useMemo(() => {
    const totals: Record<number, any> = {};
    groups.forEach(group => {
      totals[group.id] = getGroupTotals(group.id);
    });
    return totals;
  }, [groups, expenses]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-40 border-b border-border/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Smart Splitter
            </h1>
          </div>

          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowProfileModal(true)}>
            <UserIcon className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
          <div className="card-glass">
            <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
            <p className="text-3xl font-heading font-bold text-primary">
              ₹{expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
            </p>
          </div>
          <div className="card-glass">
            <p className="text-sm text-muted-foreground mb-1">Your Share</p>
            <p className="text-3xl font-heading font-bold text-success">
              ₹{expenses.reduce((sum, e) => sum + (e.splits[currentUser] || 0), 0).toLocaleString()}
            </p>
          </div>
          <div className="card-glass">
            <p className="text-sm text-muted-foreground mb-1">Active Groups</p>
            <p className="text-3xl font-heading font-bold text-foreground">
              {groups.length}
            </p>
          </div>
          <div className="card-glass">
            <p className="text-sm text-muted-foreground mb-1">Pending Payments</p>
            <p className="text-3xl font-heading font-bold text-destructive">
              {settlements.filter(s => s.status === "pending").length}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button
            variant={activeTab === "groups" ? "default" : "glass"}
            onClick={() => setActiveTab("groups")}
            className="flex-shrink-0"
          >
            <Users className="w-4 h-4 mr-2" />
            Groups
          </Button>
          <Button
            variant={activeTab === "settle" ? "default" : "glass"}
            onClick={() => setActiveTab("settle")}
            className="flex-shrink-0"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Settle
          </Button>
          <Button
            variant={activeTab === "analytics" ? "default" : "glass"}
            onClick={() => setActiveTab("analytics")}
            className="flex-shrink-0"
          >
            <PieChart className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>

        {/* Groups Tab */}
        {activeTab === "groups" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-heading font-bold">Your Groups</h2>
              <Button onClick={() => setShowCreateGroupModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Group
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="card-glass hover-lift cursor-pointer p-6 rounded-lg"
                  onClick={() => {
                    setSelectedGroupId(group.id);
                    setShowGroupDetailsModal(true);
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-heading text-xl font-semibold">{group.name}</h3>
                      <p className="text-sm text-muted-foreground">{group.members.length} members</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      {group.currency}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total Expenses</p>
                      <p className="text-2xl font-bold">₹{groupTotals[group.id]?.totalAmount || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Your Share</p>
                      <p className="text-lg font-semibold text-success">₹{groupTotals[group.id]?.userTotal || 0}</p>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGroupId(group.id);
                      setShowAddExpenseModal(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settle Tab */}
        {activeTab === "settle" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold">Settle Debts</h2>

            {groups.map((group) => {
              const debts = calculateGroupDebts(group.id);
              return (
                <div key={group.id} className="card-glass p-6 rounded-lg">
                  <h3 className="font-heading text-lg font-semibold mb-4">{group.name}</h3>

                  {debts.length === 0 ? (
                    <p className="text-muted-foreground">All settled!</p>
                  ) : (
                    <div className="space-y-3">
                      {debts.map((debt) =>
                        Object.entries(debt.owes).map(([creditor, amount]) => (
                          <div key={`${debt.person}-${creditor}`} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border/50">
                            <div>
                              <p className="font-medium">
                                {debt.person} owes {creditor}
                              </p>
                              <p className="text-sm text-muted-foreground">₹{amount.toFixed(2)}</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                handleSettleUp(debt.person, creditor, amount, group.id);
                              }}
                            >
                              Mark Paid
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold">Spending Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Breakdown */}
              <div className="card-glass p-6 rounded-lg">
                <h3 className="font-heading font-semibold mb-4">Spending by Category</h3>
                <div className="space-y-3">
                  {Object.entries(analyticsData.categoryTotals).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: `${(amount / Object.values(analyticsData.categoryTotals).reduce((a, b) => a + b, 0)) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="font-semibold text-sm min-w-16">₹{amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Summary */}
              <div className="card-glass p-6 rounded-lg">
                <h3 className="font-heading font-semibold mb-4">Monthly Summary</h3>
                <div className="space-y-3">
                  {Object.entries(analyticsData.monthlyTotals).map(([month, amount]) => (
                    <div key={month} className="flex items-center justify-between p-3 bg-card rounded-lg">
                      <span className="font-medium">{month}</span>
                      <span className="text-lg font-bold text-primary">₹{amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button 
        className="fab hover-glow" 
        onClick={() => {
          if (groups.length === 0) {
            toast.error("No groups", { description: "Create a group first" });
            return;
          }
          setSelectedGroupId(groups[0].id);
          setShowAddExpenseModal(true);
        }}
        type="button"
        aria-label="Add expense"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modals */}

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateGroupModal(false)}></div>
          <div className="relative bg-card rounded-lg p-6 w-full max-w-md shadow-xl border border-border/50 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-heading font-bold">Create Group</h2>
              <button onClick={() => setShowCreateGroupModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Group Name</label>
                <Input
                  placeholder="e.g., Weekend Trip"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Currency</label>
                <select
                  value={groupForm.currency}
                  onChange={(e) => setGroupForm({ ...groupForm, currency: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                >
                  <option>INR</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Members (comma-separated)</label>
                <Input
                  placeholder="Sarah, Mike, Emma"
                  value={groupForm.members}
                  onChange={(e) => setGroupForm({ ...groupForm, members: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowCreateGroupModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleCreateGroup}>
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddExpenseModal(false)}></div>
          <div className="relative bg-card rounded-lg p-6 w-full max-w-md shadow-xl border border-border/50 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-heading font-bold">Add Expense</h2>
              <button onClick={() => setShowAddExpenseModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Input
                  placeholder="e.g., Dinner"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Amount</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Paid By</label>
                <select
                  value={expenseForm.paidBy}
                  onChange={(e) => setExpenseForm({ ...expenseForm, paidBy: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                >
                  {selectedGroupId && getGroupDetails(selectedGroupId)?.members.map(member => (
                    <option key={member}>{member}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                >
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Accommodation</option>
                  <option>Entertainment</option>
                  <option>Shopping</option>
                  <option>Utilities</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddExpenseModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleAddExpense}>
                  Add Expense
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowProfileModal(false)}></div>
          <div className="relative bg-card rounded-lg p-6 w-full max-w-md shadow-xl border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-heading font-bold">Profile</h2>
              <button onClick={() => setShowProfileModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Name</label>
                <Input
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Phone</label>
                <Input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowProfileModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSaveProfile}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
