# 🐾 PetPulse — Smart Pet Tracker & Health Companion

[![Expo SDK 52](https://img.shields.io/badge/Expo-SDK%2052-000020?style=flat-square&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.76-61DAFB?style=flat-square&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%205.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Zustand](https://img.shields.io/badge/State-Zustand%205-brown?style=flat-square)](https://github.com/pmndrs/zustand)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

> A complete, production-quality React Native and Expo portfolio application showcasing modern mobile software craftsmanship, centralized design token architecture, offline-first persistence with Zustand & AsyncStorage, interactive SVG analytics, and deterministic GPS walk telemetry.

---

## 🌟 Executive Summary

**PetPulse** was designed and engineered as a showcase of senior-level React Native development. Rather than presenting static wireframes or prototype mockups, PetPulse is a fully working, offline-capable mobile application featuring zero paid cloud dependencies, deterministic GPS simulation for walks, complete CRUD workflows for multi-pet management, comprehensive veterinary and medication tracking, categorized reminders, and responsive SVG activity charts.

---

## 📱 Feature Highlights

### 1. 🐕 Multi-Pet Management (CRUD)
- Register multiple pets across species: Dogs, Cats, Birds, Rabbits, and more.
- Comprehensive pet profiles: breed, age, weight (with automatic unit conversion), microchip hardware IDs, notes, and avatar gallery.
- Instant active pet switcher that dynamically filters telemetry, reminders, and activity charts across the entire application.
- Safe deletion with interactive `ConfirmDialog` modals.

### 2. 📍 Live GPS Walk Telemetry (Simulation & Sensor Modes)
- **Deterministic Live Simulation**: Simulates a live dog walk loop through Central Park / Green Meadow with realistic speeds, distance metrics, and breadcrumb polylines.
- **Pulsating Radar & Direction**: Animated GPS marker indicating current heading, speed in km/h or mph, elapsed duration, and collar battery level.
- **Explicit Sensor Distinction**: Features a dedicated toggle for physical phone sensors with clear user disclosure ("Phone GPS Sensor — Not Actual Pet Collar").
- Full walk session controls: **Start**, **Pause**, **Resume**, **Finish**, and **Reset**. Finishing a walk automatically records the session into the pet's activity history.

### 3. 📊 Activity Analytics & Interactive SVG Charts
- **7-Day Dynamic Bar Charts**: Rendered with `react-native-svg` without external charting bloat, featuring goal baselines and day-by-day highlights.
- Metrics calculated from raw telemetry: total steps, cumulative distance, active minutes, and calories burned.
- Day, Week, and Month time-scale filters with activity category breakdowns (Walking, Play, Rest).

### 4. 🩺 Veterinary & Health Records
- Local CRUD tracking for:
  - **Weight History**: Track weight changes over time to monitor healthy body condition score (BCS).
  - **Vaccination Records**: Vaccine batch, clinic name, administration date, and upcoming booster deadlines with status indicators.
  - **Medications**: Prescriptions, dosages, frequencies, and ongoing treatment tracking.
  - **Vet Visits**: Attending veterinarian name, hospital, diagnosis, and follow-up advice.
  - **Observations**: Daily behavioral or symptom logging.

### 5. ⏰ Reminders & Care Schedule
- Filter by **Upcoming** vs **Completed** tasks.
- Categorized reminders: Walk & Play, Medication, Feeding, Vet Visits, Grooming, and Custom.
- Visual badges for **Due Soon** (within 3 days) and **Overdue** alerts.
- Single-tap completion with timestamp tracking.

### 6. 🎨 Centralized Design System & Dark Theme
- **Forest Green & Warm Meadow Palette**: Calming, premium visual aesthetic suitable for pet-care applications.
- **Semantic Design Tokens**: Unified colors, modular spacing, typography hierarchy, border radii, and soft multi-layer shadows.
- **Dynamic Light/Dark Theme**: Instant switching between daylight and dark night modes, persisted across app launches.
- **Metric Customization**: Seamless toggling between Metric (`km`, `kg`) and Imperial (`mi`, `lbs`) units.
- **Demo Data Restoration**: One-tap reset to restore original mock data for portfolio evaluation.

---

## 🛠️ Technology Stack

| Layer | Library / Tool | Purpose |
|---|---|---|
| **Framework** | Expo SDK 52 | Native cross-platform toolchain |
| **Runtime** | React Native 0.76 | Core mobile primitives |
| **Language** | TypeScript (Strict Mode) | End-to-end type safety |
| **Navigation** | Expo Router (File-based) | Modular, URL-like screen routing |
| **State Management** | Zustand 5 | Lightweight, decoupled global application state |
| **Persistence** | AsyncStorage | Offline-first local JSON persistence |
| **Graphics & Charts** | React Native SVG 15 | Lightweight vector-based weekly charts & map canvas |
| **Icons** | `@expo/vector-icons` | Ionicons & Material Icons |
| **Testing** | Jest & Testing Library | Unit tests for calculations, stores, and validation |
| **Code Style** | ESLint + Prettier | Consistent code formatting and linting rules |

---

## 🏗️ Clean Architecture & Folder Structure

```text
PetPulse/
├── app/                           # Expo Router Route Definitions
│   ├── _layout.tsx                # App root layout, theme provider, and store hydration
│   ├── index.tsx                  # Home dashboard entry point
│   ├── pets/
│   │   ├── index.tsx              # Pet list screen
│   │   ├── add.tsx                # Add new pet screen
│   │   └── [id].tsx               # Pet detail & edit screen
│   ├── tracking.tsx               # Live GPS tracking demo
│   ├── activity.tsx               # Activity analytics & SVG charts
│   ├── health.tsx                 # Health records CRUD
│   ├── reminders/
│   │   ├── index.tsx              # Reminders pending/completed list
│   │   └── add.tsx                # Create reminder screen
│   └── settings.tsx               # Theme, units, reset, and disclosure
│
├── src/
│   ├── theme/                     # Centralized Theme & Design Tokens
│   │   ├── colors.ts              # Forest-green palette & semantic color tokens
│   │   ├── spacing.ts             # 8-point modular spacing scale
│   │   ├── typography.ts          # Font sizes, line heights, and weights
│   │   ├── borderRadius.ts        # Consistent corner rounding tokens
│   │   ├── shadows.ts             # Multi-elevation shadow definitions
│   │   ├── lightTheme.ts          # Light theme token object
│   │   ├── darkTheme.ts           # Dark theme token object
│   │   ├── theme.ts               # Theme getter & interfaces
│   │   └── index.ts
│   │
│   ├── styles/                    # Shared Layout & Form Stylesheets
│   │   ├── commonStyles.ts        # Flexbox rows, centering, badges
│   │   ├── layoutStyles.ts        # Screen layouts, section headers, dividers
│   │   └── formStyles.ts          # Input containers, labels, and error text
│   │
│   ├── components/
│   │   ├── common/                # Reusable Primitive Components
│   │   │   ├── AppButton.tsx      # Variants (primary, secondary, outline, danger), sizes, loading
│   │   │   ├── AppText.tsx        # Typography variants (h1-h3, body, caption, badge)
│   │   │   ├── AppInput.tsx       # Form input with validation, icons, multiline
│   │   │   ├── AppCard.tsx        # Styled card container with elevation
│   │   │   ├── AppHeader.tsx      # Consistent screen header with back action
│   │   │   ├── AppIcon.tsx        # Typed vector icon component
│   │   │   ├── AppLoader.tsx      # Activity indicator with status message
│   │   │   ├── EmptyState.tsx     # Graphic empty state with CTA button
│   │   │   └── ConfirmDialog.tsx  # Destructive action confirmation modal
│   │   ├── layout/
│   │   │   ├── ScreenContainer.tsx# Safe area wrapper with dynamic status bar
│   │   │   └── AppScrollView.tsx  # Pull-to-refresh enabled scroll container
│   │   ├── pet/                   # Pet-specific UI components
│   │   ├── activity/              # SVG weekly bar charts and metric cards
│   │   ├── health/                # Health record cards & badges
│   │   ├── reminders/             # Reminder items with quick checkboxes
│   │   └── tracking/              # Map canvas, radar pings, and telemetry bar
│   │
│   ├── store/                     # Zustand State Stores
│   │   ├── index.ts               # App store: pets, activity, health, reminders, settings
│   │   └── trackingStore.ts       # Telemetry store: simulation interval, coordinates, history
│   │
│   ├── services/
│   │   └── storage/
│   │       ├── storageKeys.ts     # Centralized AsyncStorage key registry
│   │       └── storageService.ts  # Generic JSON serialization & error handlers
│   │
│   ├── hooks/
│   │   └── useTheme.ts            # Reactive theme selector hook
│   ├── types/
│   │   └── index.ts               # TypeScript domain interfaces
│   ├── utils/
│   │   ├── calculations.ts        # Haversine distance, unit conversion, aggregations
│   │   ├── dateUtils.ts           # Date formatting, relative time, overdue checks
│   │   └── validation.ts          # Form validation schemas
│   ├── constants/
│   │   └── mockData.ts            # Realistic starter pets (Bella & Luna), 7-day logs, GPS track
│   └── config/
│       └── appConfig.ts           # App metadata, goals, and defaults
│
├── __tests__/                     # Automated Unit Test Suites
│   ├── calculations.test.ts       # Distance, conversions, and weekly calculations
│   ├── validation.test.ts         # Validation rules for pets, health, and reminders
│   ├── petStore.test.ts           # Zustand store mutations & CRUD
│   └── trackingStore.test.ts      # Tracking lifecycle & interval control
│
├── app.json                       # Expo application manifest
├── tsconfig.json                  # TypeScript compiler options & `@/*` path aliases
├── babel.config.js                # Babel Expo preset configuration
├── jest.config.js                 # Jest unit test configuration
├── package.json                   # Dependency definitions & scripts
└── LICENSE                        # MIT License
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18.0.0 or later (v20+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app installed on your physical iOS or Android device (optional for testing on mobile)

### Installation

1. Navigate to the project directory:
   ```bash
   cd D:\PetPulse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

- **Start Metro Bundler**:
  ```bash
  npm start
  ```
- **Run on Android Emulator / Device**:
  ```bash
  npm run android
  ```
- **Run on iOS Simulator**:
  ```bash
  npm run ios
  ```
- **Run in Web Browser**:
  ```bash
  npm run web
  ```

---

## 🧪 Testing & Quality Checks

Run the automated test suite:
```bash
npm test
```

Run TypeScript compilation check:
```bash
npm run ts:check
```

Run linter:
```bash
npm run lint
```

---

## 🗺️ Realistic Mock Data Breakdown

PetPulse comes preloaded with realistic pet data seeded only on the initial run:
- **Bella**: 3-year-old Golden Retriever (28.5 kg), high-energy profile with 7 days of walks (8,000–12,000 daily steps), Rabies booster due in 2027, monthly Heartgard chewables, and 88% tracker battery.
- **Luna**: 2-year-old Siamese Cat (4.2 kg), moderate explorer with 3,500–5,000 daily steps, FVRCP vaccination record, and weekly grooming reminder.
- **Max**: 4-year-old French Bulldog (12.0 kg), compact companion with 62% tracker battery.
- **Simulated Walk Path**: 20 GPS waypoints around Central Park's North Meadow with realistic dog-walking speeds (3.2–6.2 km/h) and distances calculated via the Haversine formula.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
