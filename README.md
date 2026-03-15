# 🚗 The Carwash @ Rietvlei — Full Stack App

Complete car wash booking system with a React Native mobile app and an HTML admin dashboard.

---

## 📁 Project Structure

```
CarwashApp/
├── supabase-schema.sql         ← Run this first in Supabase SQL Editor
├── package.json                ← Mobile app dependencies
├── admin/
│   └── index.html              ← Admin dashboard (open in browser / deploy to Netlify)
└── mobile/
    ├── App.js                  ← Entry point (paste into Expo Snack)
    ├── lib/
    │   └── supabase.js         ← Supabase client + all DB helpers
    ├── styles/
    │   └── theme.js            ← Design tokens (colors, spacing, etc.)
    ├── components/
    │   ├── Header.js
    │   ├── ServiceCard.js
    │   ├── BookingCard.js
    │   └── AnimatedButton.js
    └── screens/
        ├── HomeScreen.js
        ├── ServicesScreen.js
        ├── BookingScreen.js
        ├── MyBookingsScreen.js
        └── ContactScreen.js
```

---

## 🗄️ Step 1 — Set Up Supabase

1. Log in to [supabase.com](https://supabase.com) → open your project
2. Go to **SQL Editor**
3. Paste the entire contents of `supabase-schema.sql` and click **Run**
4. This creates the `bookings` and `services` tables, seeds service data, sets up RLS, and enables realtime

---

## 📱 Step 2 — Run the Mobile App (Expo Snack)

### Option A — Expo Snack (easiest, no install needed)

1. Go to [snack.expo.dev](https://snack.expo.dev)
2. Create a new project
3. In the file tree, recreate the folder structure above
4. Paste each file's contents into the corresponding file in Snack
5. Install packages (Snack auto-detects from imports):
   - `@supabase/supabase-js`
   - `@react-navigation/native`
   - `@react-navigation/native-stack`
   - `react-native-screens`
   - `react-native-safe-area-context`
   - `react-native-reanimated`

6. Click **Run** — scan the QR code with Expo Go on your phone

### Option B — Local Development

```bash
npx create-expo-app CarwashApp
cd CarwashApp
# Copy all mobile/ files into the project
npm install
npx expo start
```

---

## 🖥️ Step 3 — Admin Dashboard

The admin panel is a **single HTML file** — no build step needed.

### Local
Open `admin/index.html` directly in any modern browser.

### Deploy to Netlify (free)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `admin/` folder into the deploy area
3. Your dashboard is live in seconds

### Deploy to Vercel
```bash
cd admin
npx vercel
```

---

## ✨ Features

### Mobile App
| Screen | Description |
|--------|-------------|
| **Home** | Animated hero, quick actions, trading hours |
| **Services** | Live list from Supabase with pricing & duration |
| **Booking** | 4-step flow: service → schedule → details → confirm |
| **My Bookings** | Phone number lookup with status filter |
| **Contact** | Call, WhatsApp, Maps, and live open/closed status |

### Admin Dashboard
| Feature | Description |
|---------|-------------|
| **Live Stats** | Today's bookings, pending, in-progress, completed |
| **Realtime** | Bookings update live via Supabase realtime |
| **Full CRUD** | Create, view, edit, delete bookings |
| **Status Flow** | Pending → Confirmed → In Progress → Completed |
| **Services** | Add, edit, enable/disable services |
| **Search & Filter** | Search by name/phone, filter by status/date |
| **Analytics** | Donut chart, bar chart, 14-day line chart |
| **Export** | One-click CSV export of all bookings |

---

## 🔑 Credentials

```
Supabase URL:      https://ifpjtxnqrjdhxnpmdsni.supabase.co
Supabase Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Phone (contact):   072 318 3495
Trading hours:     Mon–Sun 07:30–17:00
```

---

## 🎨 Brand Colors

| Token | Color | Hex |
|-------|-------|-----|
| Primary | Red | `#D7262E` |
| Background | Black | `#111111` |
| Accent | Grey | `#F3F3F3` |
| White | White | `#FFFFFF` |

---

## 🚀 Future Roadmap

- [ ] Loyalty rewards system
- [ ] Online payments (PayFast / Yoco)
- [ ] SMS notifications (Twilio / SMSPortal)
- [ ] Live wash progress tracker
- [ ] Customer ratings
- [ ] Queue management system
- [ ] Push notifications via Expo
- [ ] Admin authentication (Supabase Auth)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | Expo (React Native) |
| Admin | HTML + CSS + Vanilla JS |
| Backend | Supabase (PostgreSQL + Realtime) |
| Charts | Chart.js |
| Icons (web) | Lucide |
| Icons (mobile) | Emoji + custom components |

---

Built for **The Carwash @ Rietvlei** · Car Wash @Rietvlei Zoo Farm, Pretoria