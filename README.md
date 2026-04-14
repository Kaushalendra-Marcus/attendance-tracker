# MyAttendance-Take Control of Your Attendance

MyAttendance is a modern attendance management web application built with Next.js that helps students track subject-wise attendance, calculate 75% eligibility, share timetables with batchmates, and more. Installable as a PWA on any device.
Used by more than 1300 users.

Live: [myattendance-eta.vercel.app](https://myattendance-eta.vercel.app/)

## Screenshots
<img width="1919" height="978" alt="image" src="https://github.com/user-attachments/assets/3ba3142b-e53c-4a00-bace-6582d5ba12c6" />
<img width="1919" height="971" alt="image" src="https://github.com/user-attachments/assets/fe0e55e2-b7fb-444e-9d5e-98c2499b8d3d" />
<img width="1919" height="967" alt="image" src="https://github.com/user-attachments/assets/953c848e-a107-49ef-b676-0f30aedee5e0" />
<img width="1919" height="956" alt="image" src="https://github.com/user-attachments/assets/13cac016-ab31-48ff-925d-fe200c326fe6" />
<img width="1919" height="976" alt="image" src="https://github.com/user-attachments/assets/713ae8ed-d44e-44ec-a0cc-97fda3bf64db" />
<img width="1067" height="745" alt="image" src="https://github.com/user-attachments/assets/0d382b22-0f3d-4eea-8811-4f5003ba084e" />






---

## Key Highlights

- Subject-wise attendance tracking with daily calendar view
- 75% attendance calculator - know exactly how many classes to skip or attend
- Timetable sharing - copy a batchmate's timetable with one click
- Live Quiz Battle - create rooms, add custom questions, play with batchmates
- Appreciate system - like batchmates, see who liked you, leaderboard
- Fully installable PWA - works offline, no app store needed
- Fast, responsive UI with smooth animations
- Secure backend with MongoDB

---

## Features

### Attendance
- Mark present/absent per subject and lab every day
- Calendar-based date selection with outside-click close
- Attendance fetched and pre-filled from existing records
- IST timezone-aware date handling

### Dashboard
- Auto-loads all subjects from your timetable
- Shows live percentage per subject with animated progress bars
- Click any subject card to expand - see Present, Absent, Total
- "Can skip X classes" or "Attend X more to reach 75%" calculator
- Custom start date filter - select any date range, resets to year start

### Timetable
- Create manually day by day, or copy from a batchmate
- Browse branch timetables - top 7 most complete shown
- Share your timetable via link - public, no login needed to view
- Edit existing timetable with day chips for quick navigation

### Quiz Battle (Game)
- Open lobby - all active rooms visible, join without any code
- Create a named room, anyone can join anytime
- Players add their own questions - set question, options, correct answer, optional tags
- Like/dislike questions - auto-removes low-rated ones (3+ dislikes, majority dislike)
- Room owner or question creator can delete any question
- 20 seconds per question, speed bonus: faster answer = more points (15/10/5)
- Live score bar updates in real time during the game
- Final leaderboard shown at the end

### Appreciate
- Like any batchmate once - toggle on/off
- See total likes received and who liked you (with date)
- Leaderboard - top appreciated students with gold/silver/bronze medals
- Search by name or roll number

### Timetable Sharing
- `/timetable/view?rollNo=xxx` - public page, no login required
- Share link from timetable page with one click

### PWA
- Installable on Android, iOS (Safari), and Desktop
- Offline support via service workers
- Install prompt with "Not now" dismiss option

### Other
- Feedback page with file attachment support, success/error states
- Privacy Policy and Terms of Service pages
- About Us, Contact Us pages

---

## Project Structure

```
attendance-tracker/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (root)/
│   │   ├── about-us/
│   │   ├── appreciate/
│   │   ├── attendance/
│   │   ├── contact-us/
│   │   ├── dashboard/
│   │   ├── feedback/
│   │   ├── game/
│   │   │   └── [roomId]/
│   │   ├── privacy-policy/
│   │   ├── terms-of-service/
│   │   └── timetable/
│   │       ├── create/
│   │       ├── edit/
│   │       └── view/
│   ├── api/
│   │   ├── attendance/
│   │   ├── feedback/
│   │   ├── game/
│   │   │   ├── answer/
│   │   │   ├── leaderboard/
│   │   │   └── room/
│   │   ├── likes/
│   │   │   └── top/
│   │   ├── percentage/
│   │   ├── signin/
│   │   ├── signup/
│   │   └── timetable/
│   │       ├── branch/
│   │       └── public/
│   ├── context/
│   │   ├── provider.tsx
│   │   └── useContext.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── InstallPrompt.tsx
│   ├── PageShared.tsx
│   ├── UserMobile.tsx
│   ├── footer.tsx
│   ├── hero.tsx
│   ├── navigation.tsx
│   └── user.tsx
├── lib/
│   ├── model/
│   │   ├── attendance.model.ts
│   │   ├── gameroom.model.ts
│   │   ├── like.model.ts
│   │   ├── timetable.model.ts
│   │   └── user.model.ts
│   ├── mongoose.ts
│   └── questions.ts
├── public/
│   ├── icon.png
│   ├── floss_loading.gif
│   ├── manifest.json
│   └── sw.js
├── .env.local
├── next.config.ts
├── package.json
└── README.md
```

---

## Tech Stack

**Frontend**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- React Calendar
- React Icons
- React Toastify

**Backend**
- Next.js API Routes
- MongoDB + Mongoose
- Nodemailer

**PWA**
- @ducanh2912/next-pwa
- Service Workers

---

## Installation & Setup

### Clone
```bash
git clone https://github.com/Kaushalendra-Marcus/attendance-tracker.git
cd attendance-tracker
```

### Install Dependencies
```bash
npm install
```

### Environment Variables
Create `.env.local`:
```env
MONGODB_URL=your_mongodb_direct_connection_string
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

> Note: Use a direct connection string (not SRV) if your network blocks DNS SRV queries.

### Run Locally
```bash
npm run dev
```

Runs on [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

---

## Deployment

Recommended: **Vercel** (optimized for Next.js)

Make sure:
- HTTPS is enabled
- All environment variables are set in Vercel dashboard
- MongoDB IP whitelist includes `0.0.0.0/0` for Vercel's dynamic IPs

---

## Author

**Kaushalendra Singh**
- GitHub: [Kaushalendra-Marcus](https://github.com/Kaushalendra-Marcus)
- Twitter: [@Kaushal__marcus](https://x.com/Kaushal__marcus)
