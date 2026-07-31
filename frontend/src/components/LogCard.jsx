import React, { useState } from "react";

export default function LogCard({ item }) {

const [showNotes, setShowNotes] = useState(false);
const [copied, setCopied] = useState(false);

    if (!item) return null;
    
    // copy email to clipboard, visually indicate copied for 2 secs
    const handleCopyEmail = (email) => {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      //   classnames: log-card, log-card-header, log-company, log-title, status-badge-{stage}, log-contact, log-tech, log-resume, log-link, log-notes
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
            {/* name (email). if no email, no () also */}
            <strong>Contact:</strong> {item.hiring_manager_name}{" "}
            {item.hiring_manager_email && (
              <button
                type="button"
                className="copy-email-btn"
                onClick={() => handleCopyEmail(item.hiring_manager_email)}
                title="Click to copy email"
              >
                {item.hiring_manager_email} {copied ? "✓ Copied!" : "📋"}
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
      </div>
    );
}
