# Training Management System (TMS)

Secure, modern, and role-based Training Management System built with **HTML5, CSS3, JavaScript (Frontend)**, **FastAPI (Python Backend)**, and **PostgreSQL Database** (with automatic SQLite fallback).

---

## 🚀 Quick Start

### 1. Start Backend Server
Double-click:
```
start_server.bat
```
*Or run via terminal:*
```bash
python backend/run.py
```
* Backend runs at: `http://localhost:8000`
* Interactive API Documentation (Swagger): `http://localhost:8000/docs`

### 2. Open Frontend
Open `main.html` in any browser (Chrome, Edge, Firefox).

---

## 🔑 Default Credentials & Demo Accounts

### 1. Super Admin (Full Access)
* **Email:** `admin@tms.com`
* **Password:** `admin123`
* *Features:* Schedule sessions (Online Google Meet / Offline Campus Room), Add/Delete Trainers, Whitelist Student Roll Numbers, Reset Batch Data.

### 2. Trainer
* **Email:** `trainer@tms.com`
* **Password:** `trainer123`
* *Features:* Upload Syllabus and Lecture Notes (saved to disk, metadata in DB), View Enrolled Students.

### 3. Student Registration (Security Gatekeeper)
* Any student must possess an authorized Roll Number to register.
* **Pre-whitelisted Roll Numbers for testing:**
  * `FS2026-01` (Full Stack Track)
  * `AI2026-02` (Artificial Intelligence Track)
  * `FS2026-03` (Full Stack Track)
* *Unauthorized roll numbers are automatically blocked with 400 Bad Request.*

---

## 🗄️ Database Setup (PostgreSQL)

By default, the backend connects to your local PostgreSQL server:
* **Host:** `localhost`
* **Port:** `5432`
* **Database:** `training_db`
* **User/Password:** `postgres` / `postgres`

> **Note:** If your PostgreSQL service is stopped or credentials differ, the system **automatically and seamlessly falls back to local SQLite (`training.db`)** so the website works immediately without any crash or setup hassle.
