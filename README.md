# teak-furniture-app

Employee + supervisor **mobile app** for the teak furniture production system — bare React
Native (CLI), TypeScript. Talks to the central API (`teak-furniture-api`) over HTTP + JWT.

Worker flow: open app → see my work → open a task → start/stop timer → complete step → the task
advances to the next stage. Supervisor/admin: production overview, board, orders, assignment,
employees. Themed with the Empty Chair design system (forest/gold/sand + Bai Jamjuree).

Remaining/future work: see [`../teak-furniture-api/ROADMAP.md`](../teak-furniture-api/ROADMAP.md)
(FCM push, admin web, reports).

## Prerequisites

- Node 18+
- **Android:** Android Studio + SDK + a JDK (for `run-android`). **iOS (macOS only):** Xcode + CocoaPods.
- The API running: in `../teak-furniture-api`, `npm run start:dev` (listens on `:4000`).

## Setup

```bash
npm install
npx react-native-asset      # links the Bai Jamjuree fonts (assets/fonts) into android/ios
```

## Run

```bash
# terminal 1 — Metro
npx react-native start

# terminal 2 — build & launch (with an emulator running or a device connected)
npx react-native run-android      # or: run-ios
```

**API host:** `src/api/client.ts` uses `http://10.0.2.2:4000` on the Android emulator and
`http://localhost:4000` on iOS. For a **physical device**, change `API_ORIGIN` to your machine's
LAN IP (e.g. `http://192.168.1.20:4000`). Uploaded images resolve via `imageUri()` against the
same origin.

## Login (from the API seed — all password `password`)

| phone | who | lands on |
|---|---|---|
| `0810000005` | worker · ทำสี | My Work (own-station tasks, urgent/overdue) |
| `0810000001` | supervisor | Overview (KPI) + Board + Orders + assign |
| `0810000000` | admin | Overview + Employees |

## Screens

Role-based bottom tabs:
- **Worker:** หน้าหลัก (My Work) · งาน (Tasks, filterable) · แจ้งเตือน (persisted Inbox) · โปรไฟล์
- **Supervisor/Admin:** ภาพรวม (Overview KPI + alert bell) · งาน · บอร์ด (kanban) · ออเดอร์ · โปรไฟล์

Stack screens: **Task Detail** (image, info, live timer, complete-stage, workflow timeline,
assign) · **History** (audit) · **Order Detail / Create Order / Add Product** (image upload →
auto-creates the Task) · **Notifications** (computed alerts) · **Employees / Create Employee**.

## Structure

```
src/
├── api/         axios client (+ imageUri), tasks, orders, meta (users/overview/inbox/assign), uploads
├── store/       AuthProvider (JWT in AsyncStorage)
├── theme/       design tokens (colors, fonts, spacing)
├── components/  T, Card, Badge, PrimaryButton, TaskCard, Field/Choice
├── navigation/  RootNavigator (auth gate) + role-based Tabs
└── screens/     Login · Home · Tasks · TaskDetail · History · Board · Overview · Orders ·
                 OrderDetail · CreateOrder · AddProduct · Employees · CreateEmployee ·
                 Inbox · Notifications · Profile
```

Server state via React Query; the running timer ticks client-side from the session start time.
Image picking uses `react-native-image-picker` → uploads to the API `/uploads` and attaches via
`/images`.

## Notes

- If fonts/image-picker don't work, re-run `npx react-native-asset` and rebuild — bare RN needs
  the native link + build step.
- OS push notifications (FCM) are planned; the app currently shows in-app + persisted inbox
  notifications. See the ROADMAP.
