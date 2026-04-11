# ⏱ Pontaj App — Time Tracker

A full-featured time tracking web application built with React, designed for managing employee work hours with role-based access control.

## 🌐 Live Demo

🔗 [View Live App](https://time-tracker-react-opal.vercel.app)

## 🔑 Demo Credentials

| Role     | Email            | Password |
| -------- | ---------------- | -------- |
| 👑 Admin | admin@pontaj.ro  | admin123 |
| 👤 User  | malina@pontaj.ro | user123  |

## ✨ Features

- 🔐 **Authentication** — Login system with Admin and User roles
- ➕ **Log Hours** — Add worked hours with date, project and description
- 📊 **Interactive Charts** — Bar, Pie and Line charts powered by Recharts
- 📋 **History & Filtering** — View and filter entries by project and status
- 👑 **Admin Dashboard** — Approve/reject entries, manage all users
- 📄 **PDF Export** — Export reports as downloadable PDF files
- 🌐 **Bilingual** — Full Romanian / English language support
- 📱 **Fully Responsive** — Optimized for all screen sizes from 320px

## 🎨 UI & Design

- 🌙 **Dark / Light mode** — toggle with preference saved in localStorage
- ✨ **Smooth animations** — fade, scale and slide transitions on page load
- 🎯 **Micro-interactions** — hover effects on buttons and inputs
- 📱 **Mobile-first** — bottom navigation bar on mobile devices

## 🛠️ Tech Stack

| Technology          | Purpose                         |
| ------------------- | ------------------------------- |
| React 18 + Vite     | Frontend framework & build tool |
| Recharts            | Interactive data visualization  |
| jsPDF + html2canvas | PDF generation & export         |
| localStorage        | Client-side data persistence    |
| Custom i18n         | Bilingual support (RO/EN)       |

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/balanmalina/time-tracker-react.git

# Navigate to project folder
cd time-tracker-react

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Architecture Notes

This application currently uses **localStorage** for data persistence as a frontend demo. The architecture is intentionally structured to support a full backend integration:

- API calls can be centralized in a `/services` folder
- Authentication logic is isolated and ready for JWT token support
- Data models match a typical REST API response structure

**Planned backend stack:** Node.js + Express + MongoDB

## 🔮 Future Improvements

- [ ] Node.js + Express REST API
- [ ] MongoDB database integration
- [ ] JWT authentication
- [ ] Email notifications
- [ ] Excel export
- [ ] Team management

## 👩‍💻 Author

**Malina Balan** — Junior Frontend Developer
