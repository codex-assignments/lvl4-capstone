import React from "react";
import { useResources } from "../context/ResourceContext";
import LogCard from "../components/LogCard";

export default function StatusLog() {
  const { resources, loading, error } = useResources();

  if (loading) return <div className="loading">Loading records...</div>;
  if (error) return <div className="error-message">{error}</div>;

    return (
    //   classnames: status-log-page, empty-state, log-list
    <div className="status-log-page">
      <h2>Status Log</h2>

      {!resources || resources.length === 0 ? (
        <p className="empty-state">No status logs recorded yet.</p>
      ) : (
        <div className="log-list">
          {resources.map((item) => (
            <LogCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
