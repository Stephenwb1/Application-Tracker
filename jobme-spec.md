# JobMe — Full Project Spec

## Overview

JobMe is a Chrome/Firefox browser extension for managing job applications and generating tailored resumes. It consists of two tabs within the same extension popup:

- **Tab 1 — JobMe**: The existing job application tracker (unchanged)
- **Tab 2 — Resume**: A new resume tailoring tool that selects and assembles resume content based on a pasted job description

The two features share the same extension, the same backend, and the same database.

---

## Tab 1: JobMe (Existing)

The current job application tracker. No changes to existing functionality.

**Current features:**
- Add a job with Company, Title (optional), and Link (optional)
- Search through saved jobs
- View list of all jobs applied to with a running total
- User authentication (login/logout)

---

## Tab 2: Resume Tailor

A tool that generates a tailored, ATS-optimized resume PDF by intelligently selecting from a personal content library. **It never generates new content — it only selects from what you've already written.**

---

### Core Concept

You maintain a library of your own resume content: projects, bullet points per project, and skills. When you paste a job description and hit generate, Claude reads both the job description and your library, picks the best-matching content, and the backend assembles + renders it into a downloadable PDF using your HTML resume template.

---

### User Flow

1. Open extension, click the **Resume** tab
2. Paste a job description into the text box
3. Hit **Generate**
4. A loading state while the backend processes
5. Skills gap warning appears if any job requirements don't match your library
6. PDF auto-downloads
7. Optionally, the tailored resume is saved to your database linked to that job application

---

### Claude's Role (Matching Logic)

Claude is called once per generation with the full job description and your entire content library. It returns **structured JSON only** — no prose. The JSON contains:

- Which 3–4 projects to include, ranked by relevance
- Which 2–3 bullet points to use per selected project (chosen from that project's bullet pool)
- Which 10 skills to include, with job-description matches prioritized first
- A skills gap list: requirements from the job description that don't exist anywhere in your library

Claude does **not** write, rephrase, or invent anything.

---

### Resume Output

- HTML/CSS template stored in your database, with defined slots for projects and skills
- Backend fills the template with Claude's selections
- Rendered to PDF server-side (e.g. Puppeteer)
- Auto-downloads to the user's machine on completion
- Optionally saved to the database linked to the relevant job application

---

### ATS Optimization

- Claude is explicitly prompted to prioritize exact keyword matches from the job description
- Skills section orders exact job-description matches first
- No keyword stuffing — only content from your real library is ever used

---

### Skills Gap Warning

After generation, a small UI notice displays any skills or keywords from the job description that had no match in your library. Example:

> *These were requested but not in your library: Kubernetes, Terraform, Go*

This helps you decide whether to add something to your library or flag the role as a stretch before applying.

---

## Content Library

Stored in your existing database. Managed through a simple UI panel within the Resume tab.

### Projects
Each project has:
- Name
- Date range
- A pool of 4–6 pre-written bullet point options

### Skills
- A flat list of all your skills
- Each skill tagged with a category (e.g. Languages, Frameworks, Tools, Platforms)

### Resume Template
- A single HTML/CSS template stored in the database
- Has defined slots: projects section, skills section, header info
- Editable from within the extension UI

---

## Navigation

The extension popup gains a **tab bar at the top** with two tabs:

```
[ JobMe ]  [ Resume ]
```

- Switching tabs preserves state within the session
- Both tabs share the same header (logo + email + logout button)

---

## Data & Backend

| Concern | Approach |
|---|---|
| Auth | Existing auth system, shared across both tabs |
| Job application data | Existing database schema, unchanged |
| Content library (projects, skills, template) | New tables/collections in existing database |
| Resume generation | New backend endpoint: receives job description, fetches library, calls Claude, fills template, renders PDF, returns download |
| Saved resumes | Optional: store generated PDF or selection JSON linked to job application record |

---

## Tech Stack

| Piece | Technology |
|---|---|
| Extension | Existing Chrome/Firefox extension |
| Database | Existing DB (new tables for library + resumes) |
| Backend | Existing backend (new `/generate-resume` endpoint) |
| AI matching | Claude API — returns JSON selection |
| PDF rendering | Puppeteer (server-side) |
| Resume template | HTML/CSS |

---

## Out of Scope

- Claude writing or rephrasing any resume content
- Multiple resume templates
- Cover letter generation *(potential future addition)*
- Auto-applying to jobs
- Any changes to the existing JobMe tab behavior

---

## New Database Tables Needed

**projects**
- id, user_id, name, date_range, description

**project_bullets**
- id, project_id, text

**skills**
- id, user_id, name, category

**resume_template**
- id, user_id, html_content

**generated_resumes** *(optional)*
- id, user_id, job_application_id, selection_json, created_at
