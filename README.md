# MyAttendance - Take Control of Your Attendance
MyAttendance is a modern attendance management web application built with Next.js that helps students, teachers, and individuals track attendance effortlessly. It works seamlessly across devices and supports Progressive Web App installation, meaning users can install it like a native app on mobile and desktop.

Currently used by 1300+ users with a focus on speed, simplicity, and reliability.
## Screenshots of Application
<img width="1752" height="968" alt="image" src="https://github.com/user-attachments/assets/b93e59f2-5297-4619-80a9-4f0455dcb142" />
<img width="1272" height="873" alt="image" src="https://github.com/user-attachments/assets/317c9956-8d40-49c2-8446-cdca423a1596" />
<img width="1223" height="822" alt="image" src="https://github.com/user-attachments/assets/af48de95-039b-4898-b64a-080704c5281a" />
<img width="1222" height="866" alt="image" src="https://github.com/user-attachments/assets/33e742c8-e214-494c-a024-839b4df59cda" />

## Key Highlights

* Calendar-based attendance tracking
* Fully installable Progressive Web App (PWA)
* Fast, responsive UI with smooth animations
* Works across mobile, tablet, and desktop
* Secure backend with MongoDB
* Production-ready scalable architecture
* Feedback System

## Project Structure

```
attendance/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (root)/
│   │   ├── about-us/
│   │   ├── attendance/
│   │   ├── contact-us/
│   │   ├── dashboard/
│   │   ├── feedback/
│   │   ├── game/
│   │   ├── privacy-policy/
│   │   ├── terms-of-service/
│   │   └── timetable/
│   ├── api/
│   │   ├── attendance/
│   │   ├── feedback/
│   │   ├── percentage/
│   │   ├── signin/
│   │   ├── signup/
│   │   └── timetable/
│   ├── context/
│   │   ├── provider.tsx
│   │   └── useContext.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── UserMobile.tsx
│   ├── feedback.tsx
│   ├── feedbackpopup.tsx
│   ├── footer.tsx
│   ├── hero.tsx
│   ├── install.tsx
│   ├── navigation.tsx
│   ├── oneko.tsx
│   └── user.tsx
├── constants/
│   └── index.js
├── lib/
│   └── model/
│       └── mongoose.ts
├── public/
│   ├── assets/
│   │   └── icons/
│   ├── Kaushalendra-Logo.png
│   ├── file.svg
│   ├── floss_loading.gif
│   ├── globe.svg
│   ├── icon.png
│   ├── loadingbar.gif
│   ├── manifest.json
│   ├── next.svg
│   ├── oneko.gif
│   ├── oneko.js
│   ├── sw.js
│   ├── swe-worker-5c72df51bb1f6ee0.js
│   ├── vercel.svg
│   └── window.svg
├── .gitignore
├── README.md
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
└── postcss.config.mjs
```

## Features Breakdown

### Attendance Management
* Mark attendance daily with an intuitive calendar UI
* Visual representation of present/absent days
* Easy navigation between months

### Calendar Integration
* Built using react-calendar
* Clean UX for date-based attendance selection
* Instant UI updates

### Progressive Web App (PWA)
* Installable on Android, iOS (Safari), and Desktop
* Offline support using service workers
* App-like experience with standalone mode

### Animations & User Experience
* Smooth transitions powered by Framer Motion
* Toast notifications for instant feedback
* Modern responsive UI with Tailwind CSS

### Analytics
* Integrated Vercel Analytics
* Tracks real-world usage and performance insights

## Tech Stack

### Frontend
* Next.js 15 (App Router)
* React 19
* TypeScript
* Tailwind CSS
* Framer Motion
* React Calendar
* React Icons

### Backend
* Next.js API Routes
* MongoDB
* Mongoose

### PWA & Performance
* @ducanh2912/next-pwa
* Service Workers
* Offline Caching

### Utilities
* Nodemailer for email notifications
* React Toastify for alerts and feedback
* Webpack 5

## Installation & Setup

### Clone the Repository
```bash
git clone https://github.com/your-username/myattendance.git
cd myattendance
```

### Install Dependencies
```bash
npm install
```

### Environment Variables
Create a `.env.local` file:
```env
MONGODB_URI=your_mongodb_connection_string
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Run Locally
```bash
npm run dev
```
Application runs on http://localhost:3000

## Build for Production
```bash
npm run build
npm run start
```

## PWA Implementation
The application meets all PWA installability criteria using manifest.json for metadata and service workers for caching and offline access. The install prompt appears automatically on supported browsers.

Users can:
* Add to Home Screen (Mobile)
* Install on Desktop (Chrome/Edge)

## Deployment
Recommended platforms:
* Vercel (optimized for Next.js)
* Render
* AWS or DigitalOcean (advanced setups)

Ensure HTTPS is enabled and PWA manifest paths are correctly configured.

## Performance
* 90+ Lighthouse score
* 1300+ registered users
* Fast load times
* Mobile-first optimized design
* Efficient re-rendering

## Author
**Kaushalendra Singh**
