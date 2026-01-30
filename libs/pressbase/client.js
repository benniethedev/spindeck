/**
 * PressBase Browser Client
 * Drop-in replacement for Supabase client that uses PressBase API
 * 
 * Usage:
 *   import { createClient } from "@/libs/pressbase/client";
 *   const pb = createClient();
 *   const { data: { user } } = await pb.auth.getUser();
 */

const API_BASE = process.env.NEXT_PUBLIC_PRESSBASE_URL || "https://backend.benbond.dev/wp-json/app/v1";

// Token management (browser-side uses localStorage)
const TOKEN_KEY = "pb_access_token";
const REFRESH_KEY = "pb_refresh_token";
const USER_KEY = "pb_user";

function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function getStoredRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

function setStoredTokens(accessToken, refreshToken) {
  if (typeof window === "undefined") return;
  if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

function clearStoredTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

function getStoredUser() {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

function setStoredUser(user) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

async function fetchAPI(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    return { data: null, error: { message: data.message || "Request failed", status: response.status } };
  }

  return { data, error: null };
}

class PressBaseAuth {
  /**
   * Get current authenticated user
   * @returns {Promise<{data: {user: Object|null}, error: Object|null}>}
   */
  async getUser() {
    const token = getStoredToken();
    if (!token) {
      return { data: { user: null }, error: null };
    }

    const { data, error } = await fetchAPI("/auth/me");
    if (error) {
      // Token might be expired, try to refresh
      const refreshed = await this.refreshSession();
      if (refreshed.error) {
        clearStoredTokens();
        return { data: { user: null }, error };
      }
      // Retry with new token
      const retry = await fetchAPI("/auth/me");
      if (retry.error) {
        clearStoredTokens();
        return { data: { user: null }, error: retry.error };
      }
      setStoredUser(retry.data);
      return { data: { user: retry.data }, error: null };
    }

    setStoredUser(data);
    return { data: { user: data }, error: null };
  }

  /**
   * Get current session
   * @returns {Promise<{data: {session: Object|null}, error: Object|null}>}
   */
  async getSession() {
    const token = getStoredToken();
    if (!token) {
      return { data: { session: null }, error: null };
    }
    const user = getStoredUser();
    return {
      data: {
        session: {
          access_token: token,
          refresh_token: getStoredRefreshToken(),
          user,
        },
      },
      error: null,
    };
  }

  /**
   * Sign in with OAuth provider (redirects to provider)
   * @param {Object} options - { provider: string, options: { redirectTo: string } }
   */
  async signInWithOAuth({ provider, options = {} }) {
    const redirectTo = options.redirectTo || window.location.origin + "/api/auth/callback";
    // Redirect to PressBase OAuth endpoint
    window.location.href = `${API_BASE}/auth/oauth/${provider}?redirect_uri=${encodeURIComponent(redirectTo)}`;
    return { data: null, error: null };
  }

  /**
   * Sign in with magic link (OTP)
   * @param {Object} options - { email: string, options: { emailRedirectTo: string, data: Object } }
   */
  async signInWithOtp({ email, options = {} }) {
    const { data, error } = await fetchAPI("/auth/magic-link", {
      method: "POST",
      body: JSON.stringify({
        email,
        redirect_uri: options.emailRedirectTo,
        metadata: options.data,
      }),
    });

    return { data, error };
  }

  /**
   * Sign in with email and password
   * @param {Object} credentials - { email: string, password: string }
   */
  async signInWithPassword({ email, password }) {
    const { data, error } = await fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (data && !error) {
      setStoredTokens(data.access_token, data.refresh_token);
      if (data.user) setStoredUser(data.user);
    }

    return { data, error };
  }

  /**
   * Sign up with email and password
   * @param {Object} credentials - { email: string, password: string, options: { data: Object } }
   */
  async signUp({ email, password, options = {} }) {
    const { data, error } = await fetchAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        metadata: options.data,
      }),
    });

    if (data && !error) {
      setStoredTokens(data.access_token, data.refresh_token);
      if (data.user) setStoredUser(data.user);
    }

    return { data, error };
  }

  /**
   * Exchange OAuth code for session (called from callback)
   * @param {string} code - OAuth authorization code
   */
  async exchangeCodeForSession(code) {
    const { data, error } = await fetchAPI("/auth/callback", {
      method: "POST",
      body: JSON.stringify({ code }),
    });

    if (data && !error) {
      setStoredTokens(data.access_token, data.refresh_token);
      if (data.user) setStoredUser(data.user);
    }

    return { data, error };
  }

  /**
   * Refresh the session using refresh token
   */
  async refreshSession() {
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) {
      return { data: null, error: { message: "No refresh token" } };
    }

    const { data, error } = await fetchAPI("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (data && !error) {
      setStoredTokens(data.access_token, data.refresh_token);
    }

    return { data, error };
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    const token = getStoredToken();
    if (token) {
      await fetchAPI("/auth/logout", { method: "POST" });
    }
    clearStoredTokens();
    return { error: null };
  }

  /**
   * Update current user profile
   * @param {Object} updates - Profile updates
   */
  async updateUser(updates) {
    const { data, error } = await fetchAPI("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });

    if (data && !error) {
      setStoredUser(data);
    }

    return { data: { user: data }, error };
  }

  /**
   * Listen to auth state changes
   * @param {Function} callback - (event, session) => void
   * @returns {{ data: { subscription: { unsubscribe: Function } } }}
   */
  onAuthStateChange(callback) {
    // Simple polling-based implementation for browser
    // In production, consider using WebSocket or Server-Sent Events
    let lastUser = getStoredUser();
    
    const checkAuth = async () => {
      const { data: { user } } = await this.getUser();
      const currentUserStr = JSON.stringify(user);
      const lastUserStr = JSON.stringify(lastUser);
      
      if (currentUserStr !== lastUserStr) {
        const event = user ? (lastUser ? "TOKEN_REFRESHED" : "SIGNED_IN") : "SIGNED_OUT";
        const session = user ? { user, access_token: getStoredToken() } : null;
        callback(event, session);
        lastUser = user;
      }
    };

    // Check periodically
    const interval = setInterval(checkAuth, 60000);

    // Initial check
    checkAuth();

    return {
      data: {
        subscription: {
          unsubscribe: () => clearInterval(interval),
        },
      },
    };
  }

  // Admin namespace for service-key operations (browser client - limited)
  admin = {
    createUser: async () => {
      throw new Error("admin.createUser requires server-side client with service key");
    },
  };
}

class PressBaseQueryBuilder {
  constructor(table) {
    this.table = table;
    this._select = "*";
    this._where = {};
    this._order = null;
    this._limit = null;
    this._offset = null;
    this._single = false;
  }

  select(columns = "*") {
    this._select = columns;
    return this;
  }

  eq(column, value) {
    this._where[column] = value;
    return this;
  }

  neq(column, value) {
    this._where[`${column}[neq]`] = value;
    return this;
  }

  gt(column, value) {
    this._where[`${column}[gt]`] = value;
    return this;
  }

  gte(column, value) {
    this._where[`${column}[gte]`] = value;
    return this;
  }

  lt(column, value) {
    this._where[`${column}[lt]`] = value;
    return this;
  }

  lte(column, value) {
    this._where[`${column}[lte]`] = value;
    return this;
  }

  like(column, value) {
    this._where[`${column}[like]`] = value;
    return this;
  }

  in(column, values) {
    this._where[`${column}[in]`] = values.join(",");
    return this;
  }

  order(column, { ascending = true } = {}) {
    this._order = ascending ? column : `-${column}`;
    return this;
  }

  limit(count) {
    this._limit = count;
    return this;
  }

  range(from, to) {
    this._offset = from;
    this._limit = to - from + 1;
    return this;
  }

  single() {
    this._single = true;
    this._limit = 1;
    return this;
  }

  maybeSingle() {
    this._single = true;
    this._limit = 1;
    return this;
  }

  async insert(data) {
    const records = Array.isArray(data) ? data : [data];
    const results = [];
    
    for (const record of records) {
      const { data: result, error } = await fetchAPI(`/db/${this.table}`, {
        method: "POST",
        body: JSON.stringify(record),
      });
      
      if (error) return { data: null, error };
      results.push(result);
    }

    return { data: Array.isArray(data) ? results : results[0], error: null };
  }

  async upsert(data, { onConflict } = {}) {
    const records = Array.isArray(data) ? data : [data];
    const results = [];
    
    for (const record of records) {
      const { data: result, error } = await fetchAPI(`/db/${this.table}`, {
        method: "POST",
        body: JSON.stringify({ ...record, _upsert: true, _conflict: onConflict }),
      });
      
      if (error) return { data: null, error };
      results.push(result);
    }

    return { data: Array.isArray(data) ? results : results[0], error: null };
  }

  async update(data) {
    // Build query string for filtering
    const params = new URLSearchParams();
    Object.entries(this._where).forEach(([key, value]) => {
      params.append(`where[${key}]`, value);
    });

    const { data: result, error } = await fetchAPI(`/db/${this.table}?${params}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    return { data: result, error };
  }

  async delete() {
    const params = new URLSearchParams();
    Object.entries(this._where).forEach(([key, value]) => {
      params.append(`where[${key}]`, value);
    });

    const { data: result, error } = await fetchAPI(`/db/${this.table}?${params}`, {
      method: "DELETE",
    });

    return { data: result, error };
  }

  // Execute SELECT query
  async then(resolve, reject) {
    try {
      const params = new URLSearchParams();
      
      if (this._select !== "*") params.append("select", this._select);
      Object.entries(this._where).forEach(([key, value]) => {
        params.append(`where[${key}]`, value);
      });
      if (this._order) params.append("order", this._order);
      if (this._limit) params.append("limit", this._limit);
      if (this._offset) params.append("offset", this._offset);

      const queryString = params.toString();
      const { data, error } = await fetchAPI(`/db/${this.table}${queryString ? `?${queryString}` : ""}`);

      if (error) {
        resolve({ data: null, error });
        return;
      }

      const result = this._single ? (data[0] || null) : data;
      resolve({ data: result, error: null });
    } catch (err) {
      if (reject) reject(err);
      else resolve({ data: null, error: { message: err.message } });
    }
  }
}

class PressBaseStorageBucket {
  constructor(bucket) {
    this.bucket = bucket;
  }

  async upload(path, file, options = {}) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);
    formData.append("bucket", this.bucket);
    if (options.contentType) formData.append("contentType", options.contentType);

    const token = getStoredToken();
    const response = await fetch(`${API_BASE}/files/upload`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: { message: data.message || "Upload failed" } };
    }

    return { data: { path: data.path, id: data.id }, error: null };
  }

  getPublicUrl(path) {
    // Return the public URL structure
    return {
      data: {
        publicUrl: `${API_BASE}/files/public/${this.bucket}/${path}`,
      },
    };
  }

  async createSignedUrl(path, expiresIn = 3600) {
    const { data, error } = await fetchAPI(`/files/signed-url`, {
      method: "POST",
      body: JSON.stringify({ bucket: this.bucket, path, expires_in: expiresIn }),
    });

    return { data: data ? { signedUrl: data.signed_url } : null, error };
  }

  async remove(paths) {
    const pathList = Array.isArray(paths) ? paths : [paths];
    const errors = [];

    for (const path of pathList) {
      const { error } = await fetchAPI(`/files/${this.bucket}/${encodeURIComponent(path)}`, {
        method: "DELETE",
      });
      if (error) errors.push(error);
    }

    return { data: null, error: errors.length ? errors[0] : null };
  }

  async list(path = "", options = {}) {
    const params = new URLSearchParams();
    if (path) params.append("prefix", path);
    if (options.limit) params.append("limit", options.limit);
    if (options.offset) params.append("offset", options.offset);

    const { data, error } = await fetchAPI(`/files/list/${this.bucket}?${params}`);
    return { data, error };
  }
}

class PressBaseStorage {
  from(bucket) {
    return new PressBaseStorageBucket(bucket);
  }
}

class PressBaseClient {
  constructor() {
    this.auth = new PressBaseAuth();
    this.storage = new PressBaseStorage();
  }

  from(table) {
    return new PressBaseQueryBuilder(table);
  }

  // RPC-style function calls
  async rpc(functionName, params = {}) {
    const { data, error } = await fetchAPI(`/rpc/${functionName}`, {
      method: "POST",
      body: JSON.stringify(params),
    });
    return { data, error };
  }
}

export function createClient() {
  return new PressBaseClient();
}

export default createClient;
