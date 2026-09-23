# Local Hosting Guide

## Requirements

- **PHP** (available in Termux: `pkg install php`)
- That's it. No database, no npm, no build tools.

## Start the Server

```bash
cd "/data/data/com.termux/files/home/ICON Studios 2026/ICON QuickTools"
php -S 0.0.0.0:8000
```

- `0.0.0.0` makes it accessible from any network interface (not just localhost).
- Port `8000` is the default. Change it if needed: `php -S 0.0.0.0:8080`.

## Access from Your Phone

1. Make sure your phone is on Wi-Fi (or use mobile data — localhost works regardless).
2. Open your mobile browser.
3. Go to **http://localhost:8000** (same device) or **http://127.0.0.1:8000**.

## Access from Another Device (LAN)

### Find Your Phone's Local IP

On Android/Termux:
```bash
ifconfig
```
Look for `wlan0` or `wifi0` — the `inet` address is your local IP (e.g., `192.168.1.42`).

Alternatively:
```bash
ip addr show wlan0
```

### Connect from Another Device

Make sure the other device is on the **same Wi-Fi network**. Then open:
```
http://192.168.1.42:8000
```
(Replace with your actual phone IP.)

### Firewall Note

Android may block incoming connections. If LAN access doesn't work:
- Check that Termux has **Wi-Fi lockdown** disabled in Android settings.
- Try `termux-setup-storage` if permissions seem off.
- On some ROMs, you may need to run the server on a higher port (>1024).

## Termux Wake Lock

To keep the server running when the screen turns off:
```bash
termux-wake-lock
```

Or just keep Termux in the foreground / recent apps.

## Stop the Server

- Press **Ctrl+C** in the Termux session where it's running.
- Or close the Termux session.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `php: command not found` | Run `pkg install php` in Termux |
| `Address already in use` | Another process is on port 8000. Use `php -S 0.0.0.0:8080` instead |
| Page not loading | Check the URL, ensure server is running, no typos in path |
| LAN device can't connect | Verify same Wi-Fi, correct IP, firewall allows port |
| Slow first load | Google Fonts require internet. After first load, everything else works offline |

## Offline Usage

Once the page loads (with internet for fonts), all 10 tools work **completely offline**. You can:
- Turn off Wi-Fi after initial load
- Use airplane mode
- The QR code library is vendored — no CDN dependency at runtime

The only thing that requires internet is loading Poppins font from Google Fonts on first visit.
