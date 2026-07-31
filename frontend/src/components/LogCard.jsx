import React from "react";

export default function LogCard({ item }) {
  if (!item) return null;

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
            Last Contact: {new Date(item.last_contact_date).toLocaleDateString()}
          </span>
        )}
      </div>

      {(item.hiring_manager_name || item.hiring_manager_email) && (
                <div className="log-contact">
                    {/* name (email). if no email, no () also */}
          <strong>Contact:</strong> {item.hiring_manager_name}
          {item.hiring_manager_email && ` (${item.hiring_manager_email})`}
        </div>
      )}

      {item.tech_stack && (
        <div className="log-tech">
          <strong>Tech Stack:</strong> {item.tech_stack}
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

      {item.notes && (
        <div className="log-notes">
          <strong>Notes:</strong>
          <p>{item.notes}</p>
        </div>
      )}
    </div>
  );
}
