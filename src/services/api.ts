// Client API service to communicate with backend Express server
const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('tbe_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  async register(data: {
    email: string;
    password: string;
    confirmPassword?: string;
    name: string;
    location?: string;
    phone?: string;
    boardOrUniversity?: string;
  }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(err.error || 'Registration failed');
    }
    const json = await res.json();
    if (json.token) localStorage.setItem('tbe_auth_token', json.token);
    return json;
  },

  async login(credentials: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(err.error || 'Login failed');
    }
    const json = await res.json();
    if (json.token) localStorage.setItem('tbe_auth_token', json.token);
    return json;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) return null;
    return await res.json();
  },

  async updateProfile(updates: Record<string, any>) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update profile' }));
      throw new Error(err.error || 'Failed to update profile');
    }
    return await res.json();
  },

  async forgotPassword(email: string) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Password recovery request failed' }));
      throw new Error(err.error || 'Password recovery request failed');
    }
    return await res.json();
  },

  async resetPassword(data: { token: string; newPassword: string; confirmPassword?: string }) {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to reset password' }));
      throw new Error(err.error || 'Failed to reset password');
    }
    return await res.json();
  },

  async verifyEmail(token: string) {
    const res = await fetch(`${API_BASE}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Email verification failed' }));
      throw new Error(err.error || 'Email verification failed');
    }
    return await res.json();
  },

  async resendVerification(email?: string) {
    const res = await fetch(`${API_BASE}/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to resend verification' }));
      throw new Error(err.error || 'Failed to resend verification');
    }
    return await res.json();
  },

  async syncSupabaseUser(payload: { email: string; name: string; avatar?: string; supabaseId?: string }) {
    const res = await fetch(`${API_BASE}/auth/supabase-sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'OAuth synchronization failed' }));
      throw new Error(err.error || 'OAuth synchronization failed');
    }
    const json = await res.json();
    if (json.token) localStorage.setItem('tbe_auth_token', json.token);
    return json;
  },

  async changePassword(data: { currentPassword?: string; newPassword: string; confirmPassword?: string; isGoogleAccount?: boolean }) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to change password' }));
      throw new Error(err.error || 'Failed to change password');
    }
    return await res.json();
  },

  async activateRole(role: 'seller' | 'creator' | 'author' | 'teacher', details?: Record<string, any>) {
    const res = await fetch(`${API_BASE}/auth/activate-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ role, details })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to activate role' }));
      throw new Error(err.error || 'Failed to activate role');
    }
    return await res.json();
  },

  async deleteAccount(password: string, reason?: string) {
    const res = await fetch(`${API_BASE}/auth/delete-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ password, reason })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to delete account' }));
      throw new Error(err.error || 'Failed to delete account');
    }
    localStorage.removeItem('tbe_auth_token');
    return await res.json();
  },

  async logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { ...getAuthHeader() }
      });
    } catch {}
    localStorage.removeItem('tbe_auth_token');
  },

  // Books
  async getBooks(params?: Record<string, any>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/books?${query}`);
    if (!res.ok) throw new Error('Failed to fetch books');
    return await res.json();
  },

  async createBook(bookData: Record<string, any>) {
    const res = await fetch(`${API_BASE}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(bookData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create listing' }));
      throw new Error(err.error || 'Failed to create listing');
    }
    return await res.json();
  },

  async updateBook(id: string, updates: Record<string, any>) {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update book');
    return await res.json();
  },

  async deleteBook(id: string) {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to delete book');
    return await res.json();
  },

  // Orders & Escrow
  async createOrder(orderData: { bookId: string; deliveryAddress: string; deliveryPhone: string; shippingOption: string }) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Order creation failed' }));
      throw new Error(err.error || 'Order creation failed');
    }
    return await res.json();
  },

  async getMyPurchases() {
    const res = await fetch(`${API_BASE}/orders/my-purchases`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) return { orders: [] };
    return await res.json();
  },

  async getMySales() {
    const res = await fetch(`${API_BASE}/orders/my-sales`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) return { orders: [] };
    return await res.json();
  },

  async confirmOrderHandover(orderId: string) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/confirm`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to confirm handover');
    return await res.json();
  },

  // Exchanges
  async getExchanges() {
    const res = await fetch(`${API_BASE}/exchanges`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) return { proposals: [] };
    return await res.json();
  },

  async createExchange(data: Record<string, any>) {
    const res = await fetch(`${API_BASE}/exchanges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit exchange proposal');
    return await res.json();
  },

  async updateExchangeStatus(id: string, status: string, counterMessage?: string, confirmed?: boolean) {
    const res = await fetch(`${API_BASE}/exchanges/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status, counterMessage, confirmed })
    });
    if (!res.ok) throw new Error('Failed to update exchange status');
    return await res.json();
  },

  // Study Materials
  async getStudyMaterials() {
    const res = await fetch(`${API_BASE}/study-materials`);
    if (!res.ok) throw new Error('Failed to fetch study materials');
    return await res.json();
  },

  async uploadStudyMaterial(data: Record<string, any>) {
    const res = await fetch(`${API_BASE}/study-materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to upload study material');
    return await res.json();
  },

  async downloadStudyMaterial(id: string) {
    const res = await fetch(`${API_BASE}/study-materials/${id}/download`, {
      method: 'POST'
    });
    return await res.json();
  },

  // Videos
  async getVideos() {
    const res = await fetch(`${API_BASE}/videos`);
    if (!res.ok) throw new Error('Failed to fetch videos');
    return await res.json();
  },

  async uploadVideo(data: Record<string, any>) {
    const res = await fetch(`${API_BASE}/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to upload video');
    return await res.json();
  },

  async likeVideo(id: string) {
    const res = await fetch(`${API_BASE}/videos/${id}/like`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
    return await res.json();
  },

  // Published Works
  async getPublishedWorks() {
    const res = await fetch(`${API_BASE}/published`);
    if (!res.ok) throw new Error('Failed to fetch publications');
    return await res.json();
  },

  async publishWork(data: Record<string, any>) {
    const res = await fetch(`${API_BASE}/published`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to publish work');
    return await res.json();
  },

  // Owner & Admin Control Centre
  async getAdminOverview() {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch admin overview');
    return await res.json();
  },

  async getRevenueAnalytics() {
    const res = await fetch(`${API_BASE}/admin/revenue`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Access denied. Owner privileges required.');
    return await res.json();
  },

  async getAdminSettings() {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch settings');
    return await res.json();
  },

  async updateAdminSetting(key: string, value: string) {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ key, value })
    });
    if (!res.ok) throw new Error('Failed to update setting');
    return await res.json();
  },

  async getAuditLogs() {
    const res = await fetch(`${API_BASE}/admin/audit-logs`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return await res.json();
  },

  async getUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return await res.json();
  },

  async updateUserStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/admin/users/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update user status');
    return await res.json();
  },

  // Aliases & Extended Client Helpers
  async getExchangeProposals() {
    return this.getExchanges();
  },

  async createExchangeProposal(data: Record<string, any>) {
    return this.createExchange(data);
  },

  async updateExchangeProposalStatus(id: string, status: string, counterMessage?: string) {
    return this.updateExchangeStatus(id, status, counterMessage);
  },

  async createStudyMaterial(data: Record<string, any>) {
    return this.uploadStudyMaterial(data);
  },

  async incrementDownload(id: string) {
    return this.downloadStudyMaterial(id);
  },

  async createVideo(data: Record<string, any>) {
    return this.uploadVideo(data);
  },

  async addVideoComment(videoId: string, comment: string) {
    const res = await fetch(`${API_BASE}/videos/${videoId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ comment })
    });
    if (!res.ok) return { success: false };
    return await res.json();
  },

  async updateWorkStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/published/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status })
    });
    if (!res.ok) return { success: false };
    return await res.json();
  },

  async addToWishlist(bookId: string) {
    const res = await fetch(`${API_BASE}/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ bookId })
    });
    if (!res.ok) return { success: false };
    return await res.json();
  },

  async removeFromWishlist(bookId: string) {
    const res = await fetch(`${API_BASE}/wishlist/${bookId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) return { success: false };
    return await res.json();
  },

  async submitFeedback(data: Record<string, any>) {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) return { success: false };
    return await res.json();
  },

  async updateFeedbackStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/feedback/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status })
    });
    if (!res.ok) return { success: false };
    return await res.json();
  }
};
