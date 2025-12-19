// ✅ API Configuration
import axios from 'axios';

/**
 * IMPORTANT:
 * - Expo Go / mobile app me "localhost" ❌ kaam nahi karta
 * - Apne PC ka IPv4 address use karo
 * - Example: http://192.168.1.5:3000
 */
const API_BASE_URL = 'http://10.131.20.64:3000/api'; // ⬅️ APNA IP DAALO

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for error handling
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please check your connection.';
    } else if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    } else {
      // Server responded with error status
      const status = error.response?.status;
      if (status === 401) {
        error.message = 'Invalid email or password';
      } else if (status === 400) {
        error.message = error.response?.data?.message || 'Invalid request. Please check your input.';
      } else if (status >= 500) {
        error.message = 'Server error. Please try again later.';
      } else {
        error.message = error.response?.data?.message || 'An error occurred. Please try again.';
      }
    }
    return Promise.reject(error);
  }
);

// ---------------- AUTH ----------------
export const loginUser = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const registerUser = async (data) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

// ---------------- CHAT ----------------
export const chat = async (email, message) => {
  const res = await api.post('/chat', { email, message });
  return res.data;
};

export const fetchChatHistory = async (email) => {
  const res = await api.get(`/chat/history/${email}`);
  return res.data;
};

// ---------------- DIET ----------------
export const generateDiet = async (email) => {
  const res = await api.post('/diet', { email });
  return res.data;
};

export const fetchDietHistory = async (email) => {
  const res = await api.get(`/diet/history/${email}`);
  return res.data;
};

// ---------------- EMERGENCY CARD ----------------
export const getEmergencyCard = async (email) => {
  const res = await api.get(`/emergency/${email}`);
  return res.data;
};

export const createEmergencyCard = async (email, data) => {
  const res = await api.post('/emergency', { email, ...data });
  return res.data;
};

// ---------------- OCR ----------------
export const uploadOCR = async (email, file, type) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('email', email);
  formData.append('type', type);

  const res = await api.post('/ocr/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data;
};

export const getOCRStatus = async (scanId) => {
  const res = await api.get(`/ocr/status/${scanId}`);
  return res.data;
};

export const getOCRHistory = async (email) => {
  const res = await api.get(`/ocr/history/${email}`);
  return res.data;
};

// ---------------- AI INSIGHTS ----------------
export const getAIInsights = async (email) => {
  const res = await api.get(`/insights/${email}`);
  return res.data;
};

export const generateAIInsights = async (email) => {
  const res = await api.post(`/insights/generate/${email}`);
  return res.data;
};

// ---------------- FAMILY ----------------
export const getFamilyMembers = async (email) => {
  const res = await api.get(`/family/${email}`);
  return res.data;
};

export const addFamilyMember = async (email, data) => {
  const res = await api.post('/family', { email, ...data });
  return res.data;
};

export const updateFamilyMember = async (id, data) => {
  const res = await api.put(`/family/${id}`, data);
  return res.data;
};

export const deleteFamilyMember = async (id) => {
  const res = await api.delete(`/family/${id}`);
  return res.data;
};

// ---------------- HEALTH LOGS ----------------
export const getHealthLogs = async (email) => {
  const res = await api.get(`/health/${email}`);
  return res.data;
};

export const addHealthLog = async (email, data) => {
  const res = await api.post('/health', { email, ...data });
  return res.data;
};

export const updateHealthLog = async (id, data) => {
  const res = await api.put(`/health/${id}`, data);
  return res.data;
};

export const deleteHealthLog = async (id) => {
  const res = await api.delete(`/health/${id}`);
  return res.data;
};

export default api;
