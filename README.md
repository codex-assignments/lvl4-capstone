# lvl4-capstone
# AppTrack -- a software job application tracker
This is an app that will help track SW dev applications, particularly information such as stage/status, date applied/last contact, hiring manager info including email, the tech stack used in the job description, and job role/title. 

* One page allows management of the board -- create, update, delete -- based on the user. Only logged in users can edit and delete entries. This way visitors/graders can get the visualizations and filters. 

* The status board/log can be filtered based on stack tags, stage/status of application, user, and a global search bar where you can search for strings such as company name, hiring manager, job role/title.

* Then there is a management page accessible on login which manages adding entries, edits, status changes, and deletes. If a user is not signed in, this would show as a sign up/log in auth component. 

* The logout is handled in the navbar which appears next to the username(email) if they are logged in.
---
# Set Up steps: 
To set up this repo, python3, node.js, and npm are required. This repo uses supabase. 
You can insert your own supabase variables in a .env file within the backend folder, and the SQL to set up a table is supplied at the end of this README.
---
## Backend Setup
# Bash CLI: 
cd backend
python -m venv .venv
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
source .venv\Scripts\activate
---
pip install -r requirements.txt
(This includes gunicorn required for backend deployment to Render, Flask, Flask-CORS, and Supabase)
--- 
# Start local dev server with CLI:
python app.py
* Alternatively, host the backend to render.com using Web Service, selecting Python3, and setting root directory to backend. Set start command as gunicorn app:app and insert your supabase environmental variables.
---
## Frontend Setup
Open new Bash terminal
# Bash CLI
cd frontend
npm install
# for MUI
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
# for the sankey diagram on the dashboard
npm install @nivo/core @nivo/sankey
# update the BACKEND variable line in src/context/ResourceContext.jsx
--> const BACKEND = "http://localhost:5000/api";
* Alternatively, replace "http://localhost:500" with your deployed backend render url.
# start vite development server
npm run dev
* Alternatively, deploy the frontend to a host such as Netlify using the following settings:
 - build command: npm run build
 - publish directory: dist
 - base directory: frontend

* Monorepo: https://github.com/codex-assignments/lvl4-capstone.git
* Backend: https://lvl4-capstone.onrender.com
* Frontend: 



## Wireframe of homepage:
+-----------------------------------------------------------------------------------+
|  [AppTrack]               Status Log      Manage      [ Jane@email.com ]  Logout  |  <-- Navbar
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  METRIC SUMMARY CARDS                                                             |
|  +------------------+  +------------------+  +------------------+  +--------------+  |
|  | Total Applied    |  | Active Pipeline  |  | Interviews       |  | Offers       |  |
|  |     24           |  |     8            |  |     3            |  |     1        |  |
|  +------------------+  +------------------+  +------------------+  +--------------+  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  APPLICATION FLOW (SANKEY DIAGRAM)                                                |
|  +-----------------------------------------------------------------------------+  |
|  |                                                                             |  |
|  |                     /---> [ Screened (6) ] ----> [ Interview (3) ]          |  |
|  |  [ Applied (24) ] -                                       \                 |  |
|  |                     \---> [ No Reply (13) ]                ---> [ Offer (1)]|  |
|  |                      \--> [ Rejected (5) ]                                  |  |
|  |                                                                             |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  RECENT ACTIVITY                                            [ View Status Log -> ]|
|  +-----------------------------------------------------------------------------+  |
|  | Company         | Role                | Tech Stack       | Stage     | Date  |  |
|  |-----------------|---------------------|------------------|-----------|-------|  |
|  | Acme Corp       | Frontend Developer  | React, Vite      | Interview | Jul 28|  |
|  | Nexus Labs      | Full Stack Engineer | Python, Flask    | Applied   | Jul 25|  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
+-----------------------------------------------------------------------------------+


# SQL for setting up the database schema:

CREATE TABLE applications (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL DEFAULT auth.uid(),
  
  -- Core Application Details
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  location TEXT,
  salary_range TEXT,
  tech_stack TEXT,
  notes TEXT,
  
  -- Tracking & Contact Details
  resume_version TEXT,
  hiring_manager_name TEXT,
  hiring_manager_email TEXT,
  date_applied DATE DEFAULT CURRENT_DATE,
  last_contact DATE,

  -- Pipeline Stage Booleans
  has_screening BOOLEAN DEFAULT FALSE,
  has_technical BOOLEAN DEFAULT FALSE,
  has_interview BOOLEAN DEFAULT FALSE,
  has_offer BOOLEAN DEFAULT FALSE,
  has_rejected BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & Add Public Read Policy
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
ON applications
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to manage (INSERT, UPDATE, DELETE) their own applications
CREATE POLICY "Allow users to insert their own applications"
ON applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own applications"
ON applications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own applications"
ON applications FOR DELETE TO authenticated USING (auth.uid() = user_id);