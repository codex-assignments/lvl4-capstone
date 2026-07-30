import React, { createContext, useContext, useState, useEffect } from "react";

const ResourceContext = createContext(null);

export function ResourceProvider({ children }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const BACKEND = "https://lvl4-capstone.onrender.com/api";

  // build auth headers for protected actions, use token saved from login response
  const getAuthHeaders = () => {
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  // login: get token, save user info and token to local storage
  async function login(email, password) {
    const res = await fetch(`${BACKEND}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error("Login failed.");
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  }

  // sign up
  async function signup(email, password) {
    const res = await fetch(`${BACKEND}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error("Sign-up failed.");
    return data;
  }

  // logout: clear local storage info, reset user and token
  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // read -- for all users
  async function loadResources() {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/applications`);
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to load.");
      setResources(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // create -- token saved from login required
  async function addResource(newItem) {
    const res = await fetch(`${BACKEND}/applications`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(newItem),
    });
    const createdItem = await res.json();
    if (!res.ok) throw new Error("Failed to add item.");
    setResources((prev) => [...prev, createdItem]);
    return createdItem;
  }

  // update -- token saved from login required
  async function updateResource(id, updatedData) {
    const res = await fetch(`${BACKEND}/applications/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedData),
    });
    const updatedItem = await res.json();
    if (!res.ok) throw new Error("Failed to update item.");
    setResources((prev) =>
      prev.map((item) => (item.id === id ? updatedItem : item)),
    );
    return updatedItem;
  }

  // delete -- token saved from login required
  async function deleteResource(id) {
    const res = await fetch(`${BACKEND}/applications/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error("Failed to delete item.");
    setResources((prev) => prev.filter((item) => item.id !== id));
  }

  useEffect(() => {
    loadResources();
  }, []);

  return (
    <ResourceContext.Provider
      value={{
        resources,
        loading,
        token,
        user,
        login,
        signup,
        logout,
        loadResources,
        addResource,
        updateResource,
        deleteResource,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
}

// react references as a hook when starting with "use"
export function useResources() {
  return useContext(ResourceContext);
}
