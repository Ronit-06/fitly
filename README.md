# 💪 Fitness Tracker App

A full-stack fitness tracking web application built with the **MERN stack** and **Next.js**. This app helps users stay on top of their health and fitness goals by logging workouts, tracking nutrition and calories, monitoring body measurements, and visualizing progress over time.

---

## 🚀 Features

-  **Authentication** with NextAuth.js (Email + Password)
-  **Workout Logger** to record exercise sessions
-  **Nutrition Tracker** with calorie and macro breakdown
-  **Body Measurement Progress Tracking** (Weight, Neck, Waist, Hips, etc.)
-  **Charts** to visualize fitness progress
-  **User Profile & Goals** (Height, Weight, Goal, Calorie Target)
-  **Settings Page** to manage account and personal data
-  RESTful **API integration** using MongoDB for persistent data storage

---

## 🖼️ Screenshots

### 🏠 Dashboard

<img width="1918" height="910" alt="image" src="https://github.com/user-attachments/assets/41ac68cf-9f3f-4546-9464-7282d9efc956" />

---

### 🏋️ Workout Logger

<img width="1902" height="910" alt="image" src="https://github.com/user-attachments/assets/3aaa6091-20d0-4352-b73a-ee28942b0609" />

---

### 🍽️ Nutrition Tracker

<img width="1903" height="909" alt="image" src="https://github.com/user-attachments/assets/f9c12742-b871-4ad2-85ed-8712709739c3" />

---

### 📈 Progress Tracker

<img width="1903" height="912" alt="image" src="https://github.com/user-attachments/assets/0d9c6953-99c3-4ab4-8ed1-ce1826a471b1" />

---

### 👤 Settings Page

<img width="1917" height="905" alt="image" src="https://github.com/user-attachments/assets/08ec37ea-aba0-4642-b6fc-637837003e95" />

---

## 🛠️ Tech Stack

| Tech             | Description                                  |
|------------------|----------------------------------------------|
| **Next.js**      | React framework for SSR/CSR hybrid rendering |
| **MongoDB**      | NoSQL database for data storage              |
| **Mongoose**     | MongoDB ODM for schema modeling              |
| **NextAuth.js**  | Authentication and session handling          |
| **React**        | Frontend UI framework                        |
| **Recharts**     | Data visualization with responsive charts    |
| **CSS Modules**  | Scoped styling across pages/components       |

---

## 📂 Project Structure

-  /app
-  /dashboard - User dashboard and sidebar
-  /login - Login form
-  /signup - Registration form
-  /api - API routes (user, register, progress, workout, nutrition)
-  /progress - Body measurement logger & chart
-  /workout - Workout logging UI
-  /nutrition - Nutrition log form & results
-  /settings - Account and profile management
-  /public - Static assets
-  /styles - Global styles (globals.css)


## 💡 What I Learned:

This project was a major learning experience, especially as it was my first time working with Next.js, and it helped me understand how full-stack applications can be built efficiently with modern tooling. Some key takeaways:

🔄 Next.js App Router vs Pages Router

I started by exploring Pages Router, which uses file-based routing in the /pages directory and follows a more traditional structure.

However, I soon transitioned to the App Router, which is more powerful and flexible, supporting server components, layouts, and nested routing out of the box.

I learned how to:

Create shared layouts (layout.tsx)

Use use client directive for client-side interactivity

Organize routes and UI using directories like /dashboard, /login, /progress, etc.

Differentiating when to use server-side rendering (SSR), static generation, or client-side rendering was eye-opening and allowed me to optimize performance and structure the code better.

---

📊 Recharts for Data Visualization

I had never worked with data visualization libraries before, so learning Recharts was a big step.
I used Recharts to display body measurements over time in the progress tracking page.

I learned how to:

Use <LineChart>, <XAxis>, <YAxis>, and <Tooltip> components
Dynamically update charts based on user data
Customize graph appearance for a better UX

This gave me confidence in integrating third-party libraries and building clean, interactive UI components.

---

🔐 Authentication with NextAuth

Integrating NextAuth was a new concept to me. I learned to:

Set up credential-based authentication
Use useSession to access and protect pages
Implement signOut and handle edge cases like redirecting after logout
Understanding how authentication flows work under the hood gave me insight into securing routes and user data.

---

🧠 Other Key Learnings

Handling forms, controlled components, and API POST/DELETE requests in Next.js
Creating user-specific routes and protecting them via session-based logic
Structuring MongoDB data with Mongoose, including schemas for workouts, nutrition logs, and body measurements
Styling pages cleanly with regular CSS and scoped styles
Managing app state effectively without using global state libraries

---

## 🧱 Difficulties I Faced & How I Overcame Them:
1. Redirect After Logout Not Working
Issue: After logging out using signOut(), the app didn't redirect as expected.

Fix: I enforced redirection manually with router.push("/login") when session status was unauthenticated in protected pages.

2. Understanding App Router vs Pages Router
Issue: Initially confused between the two Next.js routing systems.

Fix: After reading the official documentation, I committed to the App Router and embraced its new structure with layout.tsx, page.tsx, and nested folders.

3. Global CSS Not Applying
Issue: globals.css wasn’t affecting components as expected.

Fix: I realized it must be imported in layout.tsx at the root of the App Router for styles to propagate properly.

4. Recharts Integration
Issue: Recharts required specific data formatting, and it wasn’t clear how to dynamically update charts from MongoDB data.

Fix: I transformed MongoDB documents into an array of date/value pairs and used state hooks to update the chart components.

5. API Route Errors
Issue: Inconsistent database connections across API routes led to fetch failures.

Fix: I created a connectDB utility that ensured the MongoDB connection was initialized only once across the app.
