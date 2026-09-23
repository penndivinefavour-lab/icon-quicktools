# Android App Documentation

## Overview

ICON QuickTools is available as an installable Android APK in addition to the web version. The APK wraps the existing web application in a native Android WebView shell using [Capacitor](https://capacitorjs.com/).

**Key principle**: The Android app bundles the same web assets that power the GitHub Pages site. All 17 tools run locally in the APK — no internet connection is required for core functionality.

## Distribution

| Platform | URL | Status |
|----------|-----|--------|
| Web (GitHub Pages) | https://penndivinefavour-lab.github.io/icon-quicktools/ | ✅ Live |
| PWA (Installable) | Same URL — "Add to Home Screen" | ✅ Live |
| Android APK | GitHub Release asset (see below) | 🔵 Build via GitHub Actions |

## Download APK

The latest APK is attached to the most recent `android-v*` GitHub Release:

**Latest release**: https://github.com/penndivinefavour-lab/icon-quicktools/releases

Look for files named:
- `app-debug.apk` — Debug build (unsigned, for testing)
- `app-release.apk` — Release build (if signed)

## Installation

### Method 1: Direct Download
1. Open the GitHub release page on your Android phone
2. Tap the APK file to download
3. When download completes, tap the notification
4. If prompted about installing unknown apps, allow it for your browser/file manager
5. Tap "Install"

### Method 2: ADB
```bash
adb install app-debug.apk
```

### First Launch
The app loads with a splash screen, then shows the home screen with all 17 tools. No internet required — everything works offline.

## Application Information

| Property | Value |
|----------|-------|
| App Name | ICON QuickTools |
| Package ID | `com.iconstudios.quicktools` |
| Version | 1.1.0 |
| Min Android | API 23 (Android 6.0 Marshmallow) |
| Target Android | API 34 (Android 14) |
| Orientation | Portrait (landscape supported) |
| Size | ~5-8 MB (debug) |

## Architecture

### WebView Configuration
The app uses Android's WebView with these settings enabled:
- JavaScript (required for all tools)
- DOM Storage (required for some tools)
- File Access (required for image compression)
- Database (for local caching)
- Hardware acceleration

### Back Button Behavior
- Inside a tool → Goes back to previous tool/screen
- On home screen → Exits the app

### External Links
External URLs (if any) open in the device's default browser, not inside the app.

## Android Compatibility of Tools

| Tool | Status | Notes |
|------|--------|-------|
| Text Cleaner | ✅ Full | Works offline |
| Word Counter | ✅ Full | Works offline |
| Markdown Preview | ✅ Full | Safe HTML rendering |
| JSON Formatter | ✅ Full | Works offline |
| URL Encoder | ✅ Full | Works offline |
| Base64 | ✅ Full | Works offline |
| Regex Tester | ✅ Full | Works offline |
| Text Diff | ✅ Full | Works offline |
| CSV ↔ JSON | ✅ Full | Works offline |
| Timestamp | ✅ Full | Works offline |
| Password Gen | ✅ Full | Uses crypto.getRandomValues |
| UUID Generator | ✅ Full | Uses crypto.randomUUID |
| Hash Generator | ✅ Full | Uses Web Crypto API |
| JWT Decoder | ✅ Full | Works offline |
| Image Compress | ✅ Full | Uses canvas.toBlob |
| QR Code | ✅ Full | Works offline |
| Color Converter | ✅ Full | Works offline |

### WebView-Specific Notes
- `crypto.getRandomValues` — Available in all modern Android WebViews
- `crypto.subtle` (Hash Generator) — Available in Android 6.0+ WebView
- `canvas.toBlob` (Image Compress) — Available in Android 5.0+ WebView
- `navigator.clipboard` (Copy) — Available in Android 6.0+ WebView
- `navigator.share` (Share) — Available in Android 6.0+ Chrome Custom Tabs/WebView

## Permissions

The app requests minimal permissions:

| Permission | Reason |
|------------|--------|
| INTERNET | Required by WebView (even for local content) |
| ACCESS_NETWORK_STATE | Used to detect connectivity |

**No permissions requested for:**
- Camera
- Location
- Contacts
- Storage (file operations use sandboxed app storage)
- Microphone
- Phone

## Privacy

- All data processing happens locally in the WebView
- No analytics, tracking, or telemetry
- No login or account system
- No data uploaded to any server
- File operations (QR download, image export) use app sandbox

## Building the APK

### Prerequisites (for local build)
- Node.js 18+
- Java 17
- Android SDK (API 34)
- Gradle

### Build Steps
```bash
cd android-apk
npm install
bash sync-assets.sh
npx cap add android
cd android
./gradlew assembleDebug
```

### GitHub Actions Build (Recommended)
The project is configured with GitHub Actions to build the APK remotely:

1. Push a tag: `git tag android-v1.1.0 && git push origin android-v1.1.0`
2. GitHub Actions automatically builds the APK
3. APK is uploaded as a workflow artifact
4. APK is attached to a GitHub Release

### Signing
The default build produces an unsigned debug APK. For a signed release:

1. Generate a keystore (do NOT commit to repo)
2. Add keystore credentials as GitHub Actions secrets
3. Update `android.yml` to use the secrets for signing

**Never commit keystore files or passwords to the repository.**

## Troubleshooting

### App won't install
- Make sure "Unknown sources" is enabled in Settings → Security
- Check that the APK downloaded completely (verify file size)
- Try downloading again if corrupted

### Tools not working
- Ensure the app was fully installed (not just extracted)
- Restart the app
- Clear app cache: Settings → Apps → ICON QuickTools → Clear cache

### Hash Generator fails
- Requires Android 6.0+ for Web Crypto API
- Update Android System WebView via Play Store

### Image Compress fails
- Requires Android 5.0+ for canvas.toBlob
- Check available storage space

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | Sep 23, 2026 | Initial Android release, 17 tools |
