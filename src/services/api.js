const API_BASE_URL = "http://localhost:5000/api";

class APIService {
  // Auth endpoints
  async register(name, email, password, phone) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone }),
    });
    return response.json();
  }

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }

  async getCurrentUser() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  }

  async updateProfile(name, phone, profilePicture, currency) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, phone, profilePicture, currency }),
    });
    return response.json();
  }

  // Group endpoints
  async createGroup(name, description, members, currency) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, members, currency }),
    });
    return response.json();
  }

  async getUserGroups() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/groups`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  }

  async getGroupDetails(groupId) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  }

  async updateGroup(groupId, name, description, currency) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, currency }),
    });
    return response.json();
  }

  async addMemberToGroup(groupId, memberId) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ memberId }),
    });
    return response.json();
  }

  // Expense endpoints
  async addExpense(groupId, description, amount, category, splits) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ groupId, description, amount, category, splits }),
    });
    return response.json();
  }

  async getGroupExpenses(groupId) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/expenses/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  }

  async updateExpense(expenseId, description, amount, category) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description, amount, category }),
    });
    return response.json();
  }

  async deleteExpense(expenseId) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  }

  async calculateDebts(groupId) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/expenses/${groupId}/debts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  }

  // Settlement endpoints
  async createSettlement(groupId, from, to, amount, method, notes) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/settlements`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ groupId, from, to, amount, method, notes }),
    });
    return response.json();
  }

  async getGroupSettlements(groupId) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/settlements/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  }

  async completeSettlement(settlementId) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/settlements/${settlementId}/complete`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  }
}

export default new APIService();
