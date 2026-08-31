# teak-furniture-app

Employee **mobile app** for the teak furniture production system — bare React Native (CLI),
TypeScript. Talks to the central API (`teak-furniture-api`) over HTTP + JWT.

Flow: open app → see my work → open a task → start/stop timer → complete step → the task
advances to the next stage. Themed with the Empty Chair design system (forest/gold/sand +
Bai Jamjuree).

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

**API host:** `src/api/client.ts` uses `http://10.0.2.2:4000/api` on the Android emulator and
`http://localhost:4000/api` on iOS. For a **physical device**, change it to your machine's LAN
IP (e.g. `http://192.168.1.20:4000/api`).

## Login (from the API seed — all password `password`)

| phone | who |
|---|---|
| `0810000005` | worker · ทำสี (has urgent + overdue tasks) |
| `0810000001` | supervisor (sees all tasks + Board tab) |
| `0810000000` | admin |

## Structure

```
src/
├── api/         axios client + task endpoints
├── store/       AuthProvider (JWT in AsyncStorage)
├── theme/       design tokens (colors, fonts, spacing)
├── components/  T, Card, Badge, PrimaryButton, TaskCard
├── navigation/  RootNavigator (auth gate) + bottom Tabs
└── screens/     Login · Home(My Work) · Tasks · TaskDetail(+timer) · History · Board · Profile
```

Server state via React Query; the running timer ticks client-side from the session start time.
Workers see only their station's tasks; supervisors/admins also get the Board tab.

## Notes

- If fonts look like the system default, re-run `npx react-native-asset` and rebuild — bare RN
  needs the native link step.
- Image uploads are Phase 2; task images come from the API (seed uses picsum URLs).
