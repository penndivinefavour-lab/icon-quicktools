# ICON QuickTools Android App

This directory contains the Android packaging for ICON QuickTools.
The web assets are bundled into the APK for offline use.

## Build Method

Due to limited Android SDK/Toolchain on the user's Android phone, builds are performed remotely via GitHub Actions. The workflow uses:

- Ubuntu latest runner (pre-installed Android SDK, Java 17, Gradle)
- Capacitor for WebView-based packaging
- No local compilation required

## Project Structure

```
android-apk/
├── package.json          # npm config (Capacitor dependencies)
├── capacitor.config.json # Capacitor configuration
├── www/                  # Synced web assets (copied from project root)
│   ├── index.html
│   ├── css/
│   ├── js/
│   ├── icons/
│   └── ...
└── .github/
    └── workflows/
        └── android.yml   # GitHub Actions build workflow
```

## Building Locally (if Android SDK available)

```bash
npm install
npx cap sync android
cd android
./gradlew assembleDebug
```

## Building via GitHub Actions

Push a tag like `android-v1.1.0` or trigger the workflow manually.
The APK is uploaded as a workflow artifact and attached to a GitHub Release.

## APK Output

- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

## Version

Android v1.1.0 (matching web v1.1)
