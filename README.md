# Smart LMS

Smart LMS is a web-based Learning Management System that allows instructors to create courses, upload lessons, assign quizzes, and track student progress. Students can enroll in courses, complete lessons, and take quizzes in a structured way.

---

## 🚀 Features

- 🔐 Authentication system for instructors and students  
- 📚 Course creation and enrollment  
- 🎥 Embedded lesson videos  
- 📊 Instructor and student dashboards  
- 📝 Quiz management and submission tracking  
- 🤖 AI tutor chat support  

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS  
- **Backend**: Django (no DRF)  
- **Database**: SQLite (for development), PostgreSQL (for production)  
- **Authentication**: Django Auth + CSRF-secure Axios calls  


---

## ⚙️ Getting Started

### 📦 Prerequisites

- Node.js
- Python 3.10+
- pip, virtualenv

---

### 🔧 Backend Setup

```bash
cd smart-lms-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

```
### 🔧 Frontend Setup

```bash
cd smart-lms-frontend
npm install
npm run dev

```
## Contact

```bash
Developed by [Sair Ali ](https://github.com/SairAli7037)
Email: gm2789@myamu.ac.in