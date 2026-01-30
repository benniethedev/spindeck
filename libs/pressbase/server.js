/**
 * PressBase Server Client
 * Drop-in replacement for Supabase server client that uses PressBase API
 * Uses cookies for token storage (Next.js compatible)
 * 
 * Usage:
 *   import { createClient } from "@/libs/pressbase/server";
 *   const pb = createClient();
 *   const { data: { user } } = await pb.auth.getUser();
 */

import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_PRESSBASE_URL || "https://backend.benbond.dev/wp-json/app/v1";
const SERVICE_KEY = process.env.PRESSBASE_SERVICE_KEY || "pb_sk_spinrec_b2b503fc2ccaa5c12d9bcbc17df9920b6d5b003fb0ddacd7";

// Cookie names
const TOKEN_KEY = "pb_access_token";
const REFRESH_KEY = "pb_refresh_token";

async function fetchAPI(endpoint, options = {}, serviceKey = false) {
  const cookieStore = await cookies();
  const token = serviceKey ? SERVICE_KEY : cookieStore.get(TOKEN_KEY)?.value;
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(serviceKey && { "X-Service-Key": SERVICE_KEY }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    cache: "no-store",
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
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_KEY)?.value;
    
    if (!token) {
      return { data: { user: null }, error: null };
    }

    const { data, error } = await fetchAPI("/auth/me");
    
    if (error) {
      // Try refreshing the token
      const refreshed = await this.refreshSession();
      if (refreshed.error) {
        return { data: { user: null }, error };
      }
      // Retry with new token
      const retry = await fetchAPI("/auth/me");
      if (retry.error) {
        return { data: { user: null }, error: retry.error };
      }
      return { data: { user: retry.data }, error: null };
    }

    return { data: { user: data }, error: null };
  }

  /**
   * Get current session
   * @returns {Promise<{data: {session: Object|null}, error: Object|null}>}
   */
  async getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_KEY)?.value;
    
    if (!token) {
      return { data: { session: null }, error: null };
    }
    
    const { data: { user }, error } = await this.getUser();
    
    return {
      data: {
        session: user ? {
          access_token: token,
          refresh_token: cookieStore.get(REFRESH_KEY)?.value,
          user,
        } : null,
      },
      error,
    };
  }

  /**
   * Exchange OAuth code for session (called from callback route)
   * @param {string} code - OAuth authorization code
   */
  async exchangeCodeForSession(code) {
    const { data, error } = await fetchAPI("/auth/callback", {
      method: "POST",
      body: JSON.stringify({ code }),
    });

    if (data && !error) {
      const cookieStore = await cookies();
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      };
      
      try {
        cookieStore.set(TOKEN_KEY, data.access_token, cookieOptions);
        if (data.refresh_token) {
          cookieStore.set(REFRESH_KEY, data.refresh_token, {
            ...cookieOptions,
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });
        }
      } catch {
        // Cookie setting may fail in some contexts
      }
    }

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
      const cookieStore = await cookies();
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      };
      
      try {
        cookieStore.set(TOKEN_KEY, data.access_token, cookieOptions);
        if (data.refresh_token) {
          cookieStore.set(REFRESH_KEY, data.refresh_token, {
            ...cookieOptions,
            maxAge: 60 * 60 * 24 * 30,
          });
        }
      } catch {
        // Cookie setting may fail in some contexts
      }
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
      const cookieStore = await cookies();
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      };
      
      try {
        cookieStore.set(TOKEN_KEY, data.access_token, cookieOptions);
        if (data.refresh_token) {
          cookieStore.set(REFRESH_KEY, data.refresh_token, {
            ...cookieOptions,
            maxAge: 60 * 60 * 24 * 30,
          });
        }
      } catch {
        // Cookie setting may fail in some contexts
      }
    }

    return { data, error };
  }

  /**
   * Refresh the session using refresh token
   */
  async refreshSession() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_KEY)?.value;
    
    if (!refreshToken) {
      return { data: null, error: { message: "No refresh token" } };
    }

    const { data, error } = await fetchAPI("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (data && !error) {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      };
      
      try {
        cookieStore.set(TOKEN_KEY, data.access_token, cookieOptions);
        if (data.refresh_token) {
          cookieStore.set(REFRESH_KEY, data.refresh_token, {
            ...cookieOptions,
            maxAge: 60 * 60 * 24 * 30,
          });
        }
      } catch {
        // Cookie setting may fail in some contexts
      }
    }

    return { data, error };
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_KEY)?.value;
    
    if (token) {
      await fetchAPI("/auth/logout", { method: "POST" });
    }
    
    try {
      cookieStore.delete(TOKEN_KEY);
      cookieStore.delete(REFRESH_KEY);
    } catch {
      // Cookie deletion may fail in some contexts
    }
    
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

    return { data: { user: data }, error };
  }

  // Admin namespace for service-key operations
  admin = {
    /**
     * Create a user with admin privileges (requires service key)
     * @param {Object} userData - { email, password, email_confirm, user_metadata }
     */
    createUser: async (userData) => {
      const { data, error } = await fetchAPI("/auth/admin/users", {
        method: "POST",
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          email_confirm: userData.email_confirm,
          metadata: userData.user_metadata,
        }),
      }, true);

      return { data: { user: data }, error };
    },

    /**
     * Delete a user (requires service key)
     * @param {string} userId - User ID to delete
     */
    deleteUser: async (userId) => {
      const { data, error } = await fetchAPI(`/auth/admin/users/${userId}`, {
        method: "DELETE",
      }, true);

      return { data, error };
    },

    /**
     * List all users (requires service key)
     */
    listUsers: async (options = {}) => {
      const params = new URLSearchParams();
      if (options.page) params.append("page", options.page);
      if (options.perPage) params.append("per_page", options.perPage);

      const { data, error } = await fetchAPI(`/auth/admin/users?${params}`, {}, true);
      return { data: { users: data }, error };
    },

    /**
     * Get a user by ID (requires service key)
     * @param {string} userId - User ID
     */
    getUserById: async (userId) => {
      const { data, error } = await fetchAPI(`/auth/admin/users/${userId}`, {}, true);
      return { data: { user: data }, error };
    },

    /**
     * Update a user (requires service key)
     * @param {string} userId - User ID
     * @param {Object} updates - User updates
     */
    updateUserById: async (userId, updates) => {
      const { data, error } = await fetchAPI(`/auth/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      }, true);

      return { data: { user: data }, error };
    },
  };
}

class PressBaseQueryBuilder {
  constructor(table, serviceKey = false) {
    this.table = table;
    this.serviceKey = serviceKey;
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

  ilike(column, value) {
    this._where[`${column}[ilike]`] = value;
    return this;
  }

  in(column, values) {
    this._where[`${column}[in]`] = values.join(",");
    return this;
  }

  is(column, value) {
    this._where[`${column}[is]`] = value;
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
      }, this.serviceKey);
      
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
      }, this.serviceKey);
      
      if (error) return { data: null, error };
      results.push(result);
    }

    return { data: Array.isArray(data) ? results : results[0], error: null };
  }

  async update(data) {
    const params = new URLSearchParams();
    Object.entries(this._where).forEach(([key, value]) => {
      params.append(`where[${key}]`, value);
    });

    const { data: result, error } = await fetchAPI(`/db/${this.table}?${params}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }, this.serviceKey);

    return { data: result, error };
  }

  async delete() {
    const params = new URLSearchParams();
    Object.entries(this._where).forEach(([key, value]) => {
      params.append(`where[${key}]`, value);
    });

    const { data: result, error } = await fetchAPI(`/db/${this.table}?${params}`, {
      method: "DELETE",
    }, this.serviceKey);

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
      const { data, error } = await fetchAPI(
        `/db/${this.table}${queryString ? `?${queryString}` : ""}`,
        {},
        this.serviceKey
      );

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
  constructor(bucket, serviceKey = false) {
    this.bucket = bucket;
    this.serviceKey = serviceKey;
  }

  async upload(path, file, options = {}) {
    const formData = new FormData();
    
    // Handle Buffer or Blob
    if (Buffer.isBuffer(file)) {
      const blob = new Blob([file], { type: options.contentType || "application/octet-stream" });
      formData.append("file", blob, path.split("/").pop());
    } else {
      formData.append("file", file);
    }
    
    formData.append("path", path);
    formData.append("bucket", this.bucket);
    if (options.contentType) formData.append("contentType", options.contentType);

    const cookieStore = await cookies();
    const token = this.serviceKey ? SERVICE_KEY : cookieStore.get(TOKEN_KEY)?.value;
    
    const response = await fetch(`${API_BASE}/files/upload`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(this.serviceKey && { "X-Service-Key": SERVICE_KEY }),
      },
      body: formData,
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: { message: data.message || "Upload failed" } };
    }

    return { data: { path: data.path, id: data.id }, error: null };
  }

  getPublicUrl(path) {
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
    }, this.serviceKey);

    return { data: data ? { signedUrl: data.signed_url } : null, error };
  }

  async remove(paths) {
    const pathList = Array.isArray(paths) ? paths : [paths];
    const errors = [];

    for (const path of pathList) {
      const { error } = await fetchAPI(`/files/${this.bucket}/${encodeURIComponent(path)}`, {
        method: "DELETE",
      }, this.serviceKey);
      if (error) errors.push(error);
    }

    return { data: null, error: errors.length ? errors[0] : null };
  }

  async list(path = "", options = {}) {
    const params = new URLSearchParams();
    if (path) params.append("prefix", path);
    if (options.limit) params.append("limit", options.limit);
    if (options.offset) params.append("offset", options.offset);

    const { data, error } = await fetchAPI(`/files/list/${this.bucket}?${params}`, {}, this.serviceKey);
    return { data, error };
  }
}

class PressBaseStorage {
  constructor(serviceKey = false) {
    this.serviceKey = serviceKey;
  }

  from(bucket) {
    return new PressBaseStorageBucket(bucket, this.serviceKey);
  }
}

class PressBaseClient {
  constructor(options = {}) {
    this.serviceKey = options.serviceKey || false;
    this.auth = new PressBaseAuth();
    this.storage = new PressBaseStorage(this.serviceKey);
  }

  from(table) {
    return new PressBaseQueryBuilder(table, this.serviceKey);
  }

  // RPC-style function calls
  async rpc(functionName, params = {}) {
    const { data, error } = await fetchAPI(`/rpc/${functionName}`, {
      method: "POST",
      body: JSON.stringify(params),
    }, this.serviceKey);
    return { data, error };
  }
}

/**
 * Create a PressBase server client (uses cookies for auth)
 * @param {Object} options - { serviceKey: boolean }
 */
export function createClient(options = {}) {
  return new PressBaseClient(options);
}

/**
 * Create a PressBase admin client (uses service key)
 */
export function createServiceClient() {
  return new PressBaseClient({ serviceKey: true });
}

export default createClient;
