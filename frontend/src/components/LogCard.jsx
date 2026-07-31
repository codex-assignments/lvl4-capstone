import React, { useState } from "react";
import ApplicationForm from "./ApplicationForm";

export default function LogCard({ item, isLoggedIn, onUpdate, onDelete }) {
  const [showNotes, setShowNotes] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if (!item) return null;

  // copy email to clipboard, visually indicate copied for 2 secs
  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    };
    
    const handleEditSubmit = async (payload) => {
      if (onUpdate) {
        await onUpdate(item.id, payload);
      }
      setIsEditing(false);
    };

    // confirm window for delete
    const handleDelete = async () => {
      if (window.confirm(`Delete application for ${item.company_name}?`)) {
        if (onDelete) {
          await onDelete(item.id);
        }
      }
    };

    // inline editing available to logged in users
    if (isEditing) {
      return (
        <div className="log-card editing-card">
          <ApplicationForm
            initialData={item}
            onSubmit={handleEditSubmit}
                  onCancel={() => setIsEditing(false)}
                //   pass parent button label
            buttonLabel="Update Application"
          />
        </div>
      );
    }

  return (
    <div className="log-card">
      <div className="log-card-header">
        <div>
          <h3 className="log-company">{item.company_name}</h3>
          <span className="log-title">{item.job_title}</span>
        </div>
        {item.stage && (
          <span
            // change status to lowercase and replace every space with -
            className={`status-badge ${item.stage.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {item.stage}
          </span>
        )}
      </div>

      <div className="log-card-meta">
        {/* if value exists, render */}
        {item.location && <span> {item.location}</span>}
        {item.salary_range && <span> {item.salary_range}</span>}
        {item.date_applied && (
          <span>
            Applied: {new Date(item.date_applied).toLocaleDateString()}
          </span>
        )}
        {item.last_contact_date && (
          <span>
            Last Contact:{" "}
            {new Date(item.last_contact_date).toLocaleDateString()}
          </span>
        )}
      </div>

      {(item.hiring_manager_name || item.hiring_manager_email) && (
        <div className="log-contact">
          <strong>Contact:</strong> {item.hiring_manager_name}{" "}
          {item.hiring_manager_email && (
            <button
              type="button"
              className="copy-email-btn"
              onClick={() => handleCopyEmail(item.hiring_manager_email)}
              title="Click to copy email"
            >
              {item.hiring_manager_email}{" "}
              {copied ? (
                <span className="copied-text">✓ Copied</span>
              ) : (
                <svg
                  className="copy-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          )}
        </div>
      )}

      {item.tech_stack && (
        <div className="log-tech">
          <strong>Tech Stack:</strong>{" "}
          {Array.isArray(item.tech_stack)
            ? item.tech_stack.join(", ")
            : item.tech_stack}
        </div>
      )}

      {item.resume_version_used && (
        <div className="log-resume">
          <strong>Resume Version:</strong> {item.resume_version_used}
        </div>
      )}

      {item.job_url && (
        <a
          href={item.job_url}
          target="_blank"
          rel="noopener noreferrer"
          className="log-link"
        >
          View Job Posting ↗
        </a>
      )}
      {/* expandable notes */}
      {item.notes && (
        <div className="log-notes-container">
          <button
            type="button"
            className="notes-toggle-btn"
            onClick={() => setShowNotes(!showNotes)}
          >
            {showNotes ? "− Hide Notes" : "+ Notes"}
          </button>
          {showNotes && (
            <div className="log-notes">
              <p>{item.notes}</p>
            </div>
          )}
        </div>
      )}

      {isLoggedIn && (
        <div className="card-manage-bar">
          <button
            type="button"
            className="edit-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <button type="button" className="delete-btn" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
