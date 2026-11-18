/**
 * api.js — Single source of truth for all backend URLs.
 *
 * Reads VITE_API_URL from the environment:
 *   • npm run dev   → uses frontend/.env          → http://localhost:3000
 *   • npm run build → uses frontend/.env.production → https://your-api.com
 *
 * Never hardcode "localhost:3000" anywhere else — always import from here.
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_BASE = BASE;

export const API = {
  // ── Auth ────────────────────────────────────────────────────────────────────
  auth: {
    login:         `${BASE}/auth/login`,
    register:      `${BASE}/auth/register`,
    forgotPassword:`${BASE}/auth/forgot-password`,
    resetPassword: `${BASE}/auth/reset-password`,
  },

  // ── Properties ──────────────────────────────────────────────────────────────
  properties: {
    list:   `${BASE}/api/v1/listall-properties`,
    filter: `${BASE}/api/v1/filter-property`,
    create: `${BASE}/api/v1/create-property`,
    detail: (id) => `${BASE}/api/v1/getuserbyid/${id}`,
    update: (id) => `${BASE}/api/v1/update-property/${id}`,
    delete: (id) => `${BASE}/api/v1/delete-property/${id}`,
    search: `${BASE}/api/v1/search-properties`,
  },

  // ── Leads & Engagement ──────────────────────────────────────────────────────
  leads: {
    inquiry:  `${BASE}/api/v1/inquiry`,
    visit:    `${BASE}/api/v1/visit`,
    favorite: (id) => `${BASE}/api/v1/property/${id}/favorite`,
  },

  // ── Admin ───────────────────────────────────────────────────────────────────
  admin: {
    analytics: `${BASE}/api/v1/admin/analytics`,
    users:     `${BASE}/api/v1/admin/users`,
    updateUser: (id) => `${BASE}/api/v1/admin/users/${id}`,
    deleteUser: (id) => `${BASE}/api/v1/admin/users/${id}`,
    properties: `${BASE}/api/v1/admin/properties`,
    updatePropertyStatus: (id) => `${BASE}/api/v1/admin/properties/${id}/status`,
    updatePropertyGeneral: (id) => `${BASE}/api/v1/admin/properties/${id}`,
    deleteProperty: (id) => `${BASE}/api/v1/admin/properties/${id}`,
    inquiries: `${BASE}/api/v1/admin/inquiries`,
    updateInquiry: (id) => `${BASE}/api/v1/admin/inquiries/${id}`,
    visits: `${BASE}/api/v1/admin/visits`,
    updateVisit: (id) => `${BASE}/api/v1/admin/visits/${id}`,
  },
};

export default API;
