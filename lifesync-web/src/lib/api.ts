import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Inject access token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, { token: refreshToken });
        localStorage.setItem('accessToken', data.data.accessToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (body: object) => api.post('/auth/register', body),
  login: (body: object) => api.post('/auth/login', body),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  updateProfile: (body: object) => api.put('/auth/profile', body),
};

// ─── Expenses ────────────────────────────────────────────────────────────────
export const expensesAPI = {
  list: (params?: object) => api.get('/expenses', { params }),
  create: (body: object) => api.post('/expenses', body),
  update: (id: string, body: object) => api.put(`/expenses/${id}`, body),
  delete: (id: string) => api.delete(`/expenses/${id}`),
  summary: () => api.get('/expenses/summary'),
};

// ─── Analytics ───────────────────────────────────────────────────────────────
export const analyticsAPI = {
  dashboard: () => api.get('/analytics/dashboard'),
  spending: (params?: object) => api.get('/analytics/spending', { params }),
  savingsPrediction: () => api.get('/analytics/savings-prediction'),
  health: () => api.get('/analytics/health'),
  recalculateHealth: () => api.post('/analytics/health/recalculate'),
  habits: () => api.get('/analytics/habits'),
  checkAffordability: (body: { amount: number; description: string }) => api.post('/analytics/affordability', body),
};

// ─── Debts ───────────────────────────────────────────────────────────────────
export const debtsAPI = {
  list: () => api.get('/debts'),
  create: (body: object) => api.post('/debts', body),
  pay: (id: string, body: object) => api.patch(`/debts/${id}/pay`, body),
};

// ─── Goals ───────────────────────────────────────────────────────────────────
export const goalsAPI = {
  list: () => api.get('/goals'),
  create: (body: object) => api.post('/goals', body),
  contribute: (id: string, body: object) => api.patch(`/goals/${id}/contribute`, body),
};

// ─── Reminders ───────────────────────────────────────────────────────────────
export const remindersAPI = {
  list: () => api.get('/reminders'),
  create: (body: object) => api.post('/reminders', body),
  complete: (id: string) => api.patch(`/reminders/${id}/complete`),
  smartSuggestions: () => api.get('/reminders/smart-suggestions'),
};

// ─── Voice ───────────────────────────────────────────────────────────────────
export const voiceAPI = {
  command: (body: object) => api.post('/voice/command', body),
  history: () => api.get('/voice/history'),
};

// ─── OCR ─────────────────────────────────────────────────────────────────────
export const ocrAPI = {
  scan: (formData: FormData) => api.post('/ocr/scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// ─── Notifications ───────────────────────────────────────────────────────────
export const notificationsAPI = {
  parse: (body: object) => api.post('/notification/parse', body),
  transactions: () => api.get('/notification/transactions'),
};

// ─── Transactions ────────────────────────────────────────────────────────────
export const transactionsAPI = {
  list: (params?: object) => api.get('/transactions', { params }),
};

// ─── Subscriptions ───────────────────────────────────────────────────────────
export const subscriptionsAPI = {
  list: () => api.get('/subscriptions'),
  create: (body: object) => api.post('/subscriptions', body),
  toggle: (id: string) => api.patch(`/subscriptions/${id}/toggle`),
  delete: (id: string) => api.delete(`/subscriptions/${id}`),
};

export default api;
