# 📱 LifeSync AI — Mobile Application

> **LifeSync Mobile** is a cross-platform mobile client built using **Expo**, **React Native**, and **TypeScript**. It offers a premium, modern user interface featuring glassmorphic components, fluid spring animations, capsule buttons, and custom SnackBar alert integrations.

---

## 🎨 Design & Aesthetic Guidelines

LifeSync Mobile is designed to look modern, clean, and futuristic:
* **Harmonious Palette**: Electric Violet (`#9900ff`) capsule buttons, translucent white glass borders, and deep cosmic backgrounds (`#08080f`).
* **Glassmorphism**: Leverages `expo-blur` to build frosted container cards (`BlurView`) over dark backgrounds.
* **Fixed Dimensions**: Backgrounds are bound to physical screen size dimensions (`Dimensions.get("screen")`) to prevent shifting layouts when soft keyboards appear.
* **Modern Alert System**: Completely replaces default OS alert modals with a slide-down spring-animated [Snackbar](file:///c:/Users/WELCOME/Desktop/LifeSync/LifeSync/lifesync-mobile/src/components/Snackbar.tsx).

---

## 🚀 Key Features

* **Centralized API Client**:
  Integrates [apiClient.ts](file:///c:/Users/WELCOME/Desktop/LifeSync/LifeSync/lifesync-mobile/src/services/apiClient.ts), which auto-resolves server URLs in development (replaces `localhost` with the active host workstation IP for physical phone and emulator networking). Includes automatic Bearer Token attachments.
* **Realtime Form Validation**:
  Email and passwords validate on-the-fly. The input border transitions to dynamic warn states when input requirements are not satisfied.
* **Forgot Password Wizard**:
  A three-stage wizard layout:
  1. *Request OTP*: Submits registered email.
  2. *OTP Code Entry*: Interactive 6-digit grid layout with automated next-input focus and backspace behavior.
  3. *New Password Reset*: Secure input fields validating new credentials before submission.

---

## 🛠️ Project Structure

```
lifesync-mobile/
├── app/                      # Expo Router screens (file-based routing)
│   ├── _layout.tsx           # Global routing entry (safe area provider, status bar)
│   ├── index.tsx             # Root routing gate
│   ├── signin.tsx            # Sign In screen
│   ├── signup.tsx            # Sign Up screen
│   ├── forgot-password.tsx   # Three-step OTP & Password reset screen
│   └── analytics.tsx         # User dashboard overview
├── assets/                   # Static media assets (fonts, images, logo)
├── src/
│   ├── components/           # Custom reusable widgets
│   │   └── Snackbar.tsx      # Animated glassmorphism alert notification
│   └── services/
│       └── apiClient.ts      # API fetch client wrapper
├── package.json
└── tsconfig.json
```

---

## ⚡ Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Metro Bundler
```bash
npm run start
```

### 3. Run on Devices / Emulators
* **Android**: Press `a` in the terminal to launch Android Emulator.
* **iOS**: Press `i` in the terminal to launch iOS Simulator.
* **Physical Device**: Scan the QR code printed in the terminal using the **Expo Go** application.
