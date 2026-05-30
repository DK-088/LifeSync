# 💻 LifeSync AI — Web Dashboard

> **LifeSync Web** is a responsive desktop-focused dashboard interface built using **React 19**, **TypeScript**, and **Vite 8**. It integrates with the central REST API to visualize personal finance metrics, monthly budgets, EMI allocations, saving goal milestones, and transaction categories.

---

## 🚀 Key Features

* **Financial Analytics Visualization**:
  Leverages `recharts` to render responsive category spending charts, monthly income-to-savings ratios, and predictive line charts forecasting future savings.
* **Smart Bill & Invoice History**:
  Displays bills scanned via the backend OCR scanning engine, allowing users to cross-reference transactions with uploaded receipts.
* **Modern UI & Responsive Layouts**:
  Styled using the latest **Tailwind CSS v4** utility directives. Layout adapts fluidly from wide monitor screens down to mobile browsers.
* **Realtime Socket Notifications**:
  Subscribes to live backend transaction pushes to flash instant budget alert warnings in the header.

---

## 🛠️ Project Structure

```
lifesync-web/
├── src/
│   ├── assets/               # Local images and branding icons
│   ├── components/           # Reusable UI elements (cards, headers, charts)
│   ├── pages/                # Main view pages (Dashboard, Spending, Goals)
│   ├── services/             # API request integrations
│   ├── App.tsx               # Main application wrapper with Router provider
│   └── main.tsx              # React mounting root
├── public/                   # Public assets
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## ⚡ Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
*The web dashboard is served locally at `http://localhost:5173`.*

### 3. Build Production Bundle
To create a optimized production build of the static files:
```bash
npm run build
```
The compiled output is saved to the `dist/` directory, ready to be served by static hosts.
