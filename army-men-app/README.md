# Plastic Front: iPhone & iPad app

This folder wraps the game in `../army-men` as a native iOS app using [Capacitor](https://capacitorjs.com) (free, open source).
The whole game ships inside the app, so it plays fully offline. The 3D version is the start screen; the
"Classic 2D" button on the title screen switches to the 2D version.

| | |
|---|---|
| App name | Plastic Front |
| Bundle ID | `com.plasticfront.game` (change it if you like; it must be unique in your developer account) |
| Devices | iPhone and iPad, iOS 15 or later, landscape only |
| Controls | Touch, plus Xbox / PlayStation / MFi controllers |

## What you need

- A Mac with **Xcode 16 or newer** (free from the Mac App Store)
- **Node.js 22** or newer (`brew install node`, or the installer from nodejs.org)
- Your **Apple Developer Program** membership (for installing on devices and publishing)

## 1. Get the code and install

```bash
git clone https://github.com/User7534/myplan.git
cd myplan/army-men-app
npm install
```

## 2. Copy the latest game into the app

Run this every time the game in `../army-men` changes:

```bash
npm run sync
```

It copies the game into `www/` (3D page becomes `index.html`, 2D page becomes `classic.html`) and updates the Xcode project.

## 3. Open in Xcode and sign it

```bash
npm run open
```

In Xcode:
1. Select the **App** project in the left sidebar, then the **App** target.
2. Open **Signing & Capabilities**, tick **Automatically manage signing**, and pick your **Team** (your developer account).
3. If Xcode says the bundle ID is taken, change **Bundle Identifier** to something unique, e.g. `com.yourname.plasticfront`.

## 4. Play it on your iPhone or iPad

1. Plug in the device (or use Wi-Fi debugging) and choose it in the device menu at the top of Xcode.
2. Press **Run** (▶). The first time, the device may ask you to trust the developer:
   **Settings → General → VPN & Device Management → your account → Trust**.
3. On iPhone/iPad you may need to turn on **Developer Mode** (Settings → Privacy & Security).

## 5. Share with testers (TestFlight) or publish on the App Store

1. In Xcode choose **Any iOS Device (arm64)** as the destination, then **Product → Archive**.
2. When the Organizer opens, choose **Distribute App → App Store Connect → Upload**.
3. In [App Store Connect](https://appstoreconnect.apple.com), create the app record (same bundle ID) if you haven't.
   The build appears under **TestFlight** after processing (usually 10–30 minutes); add yourself or friends as testers.
4. To publish publicly, fill in the App Store listing and **Submit for Review**. You'll need:
   - Screenshots for iPhone (6.9" or 6.7") and iPad (13"). Take them in the iOS Simulator with **⌘S**.
   - A short description, keywords, a support URL, and an age rating (cartoon violence).
   - A privacy answer of **Data Not Collected**: the game has no accounts, ads, analytics or network calls.
     Difficulty and settings are saved only on the device.
   - Export compliance is already answered in `Info.plist` (no non-exempt encryption).

## Updating the app later

1. Change the game in `../army-men` (or ask Claude to).
2. `npm run sync`
3. In Xcode, raise **Version** (e.g. 1.1) or **Build** (e.g. 2) under the target's **General** tab, then Archive and upload again.

## Notes

- Tilt-shift blur is off by default on phones and tablets for smoother frame rates.
- Sound starts after the first tap (an iOS rule for web audio).
- The App icon and launch screen are in `ios/App/App/Assets.xcassets`.
