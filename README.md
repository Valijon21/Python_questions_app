# 🧠 Python Backend Mock Interviewer

> An AI-powered technical interview simulator built with Django & Vanilla JavaScript.  
> Practice real Python backend interview questions and get instant AI feedback on your answers.

![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.2-green?logo=django&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.5_Pro-orange?logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## ✨ Features

- 🎯 **AI Evaluation** — Google Gemini AI evaluates your answers with real-time feedback
- 📂 **Mavzular (Technical Domains)** — Focus your interview on specific areas: `Python Core`, `Django & Web`, `Databases`, `Async`, and more
- 💡 **Ideal Answers** — See the `IDEAL JAVOB (NAMUNA)` for every question to learn from your mistakes
- 📈 **Interviewer Analysis** — Get professional `INTERVYUER TAHLILI` for each response
- 📊 **Smart Scoring** — Get graded as `Trainee`, `Junior`, `Middle`, or `Senior`
- 📈 **Answer Statistics** — See how many answers were ✅ correct vs ❌ wrong with a progress bar
- 🌐 **3 Languages** — Full support for Uzbek 🇺🇿, Russian 🇷🇺, and English 🇬🇧
- 💾 **SQLite Database** — 1000+ curated questions stored locally
- 🔧 **Admin Panel** — Add, edit, or remove questions directly from Django Admin
- ⏹️ **Cancel & Review** — Stop anytime and still see feedback on answered questions
- 📱 **Responsive UI** — Modern dark-themed design built with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer     | Technology                            |
|-----------|---------------------------------------|
| Backend   | Python 3.11+, Django 5.2, Django REST Framework |
| AI        | Google Gemini AI (`gemini-flash-latest`) |
| Frontend  | Vanilla JavaScript, HTML, Tailwind CSS, Lucide Icons |
| Database  | SQLite (built-in, no setup required)  |

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Valijon21/Python_questions.git
cd Python_questions/django_project
```

### 2. Create a Virtual Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install django djangorestframework google-generativeai python-dotenv
```

### 4. Set Up Environment Variables

Create a `.env` file in the `django_project/` directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

> 💡 Get your free API key at [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### 5. Run Migrations

```bash
python manage.py migrate
```

### 6. Create Admin User (Optional)

```bash
python manage.py createsuperuser
```

### 7. Start the Server

```bash
python manage.py runserver
```

Open your browser at **http://127.0.0.1:8000** 🎉

---

## 🗂️ Project Structure

```
django_project/
├── api/
│   ├── static/api/
│   │   ├── css/main.css      # Professional styles & animations
│   │   └── js/
│   │       ├── api.js        # Server communication (Fetch)
│   │       ├── main.js       # App entry point
│   │       ├── state.js      # Global state management
│   │       ├── translations.js # Dictionary management
│   │       └── ui.js         # Rendering engine
│   ├── serializers.py        # DRF Serializers (Enterprise Grade)
│   ├── services.py           # Gemini AI Service Layer
│   ├── models.py             # Question model
│   ├── urls.py               # API routing
│   └── views.py              # Clean/Thin Request handlers
├── templates/
│   └── index.html            # Clean entry point (SPA)
├── db.sqlite3                # 1000+ questions
└── manage.py                 # Django utility
```

---

## 🛠️ Core Codebase Overview

### 1. Backend: Service Layer & Serializers
We use a **Service Layer** (`api/services.py`) to decouple business logic (AI prompt engineering) from the views. **Serializers** (`api/serializers.py`) ensure that API data is validated and formatted according to industry standards.

### 2. Frontend: Modular ES Modules
Instead of a monolithic script, we use **ES Modules** to split the frontend logic into specialized parts. This ensures the application is scalable, maintainable, and utilizes browser caching effectively.

### 3. Navigation Engine
The logic in `ui.js` handles complex state transitions (Landing ↔ Topics ↔ Interview ↔ Results) with smart "Back" button functionality that remembers user paths.

---

## 🔑 Admin Panel

Access the admin panel at **http://127.0.0.1:8000/admin**

From the admin panel you can:
- ➕ Add new interview questions in Uzbek, Russian, and English
- ✏️ Edit or translate existing questions
- 🗑️ Delete outdated questions
- 🔍 Search questions by keyword

---

## 📡 API Endpoints

| Method | Endpoint        | Description                                      |
|--------|-----------------|--------------------------------------------------|
| GET    | `/api/questions?count=25&category=Slug` | Returns random questions, optionally filtered by category |
| GET    | `/api/categories` | Returns all available technical domains and question counts |
| POST   | `/api/evaluate`           | Submits answers to be evaluated by Gemini AI |

### Example POST `/api/evaluate`

```json
{
  "language": "uz",
  "questions": [
    { "id": 1, "text": "Django ORM qanday ishlaydi?" }
  ],
  "answers": {
    "1": "Django ORM Python klasslari orqali SQL so'rovlarini yaratadi..."
  }
}
```

**Response:**

```json
{
  "level": "Middle",
  "summary": "Yaxshi tushuncha, ammo ba'zi chuqur jihatlar yetishmaydi.",
  "feedback": [
    {
      "questionId": 1,
      "isCorrect": true,
      "aiFeedback": "To'g'ri, lekin lazy evaluation haqida ham eslatish kerak edi.",
      "correctAnswer": "Django ORM lazy evaluation usulida ishlaydi, ya'ni so'rov faqat ma'lumot kerak bo'lganda bazaga yuboriladi."
    }
  ]
}
```

---

## 🌍 Environment Variables

| Variable        | Required | Description                        |
|-----------------|----------|------------------------------------|
| `GEMINI_API_KEY` | ✅ Yes  | Your Google Gemini API key         |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Developer

<table>
  <tr>
    <td align="center">
      <b>Valijon Ergashev</b><br/>
      <i>Python Backend Developer</i><br/><br/>
      <a href="https://github.com/Valijon21">🐙 GitHub</a>
    </td>
  </tr>
</table>

> 💡 This project was built as a personal tool to help Python backend developers practice and prepare for real technical interviews.

---

<p align="center">Built with ❤️ by <strong>Valijon Ergashev</strong> — for Python backend developers everywhere</p>
