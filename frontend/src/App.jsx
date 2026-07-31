import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import NavBar from "./components/NavBar";
import StatusLog from "./pages/StatusLog";
import { ResourceProvider } from "./context/ResourceContext";

export default function App() {
  return (
    <ResourceProvider>
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<div>Dashboard View</div>} />
            <Route path="/log" element={<StatusLog />} />
            <Route path="/manage" element={<div>Manage / Add View</div>} />
          </Routes>
        </main>
    </ResourceProvider>
  );
}
