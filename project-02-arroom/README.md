# Project 02 — RoomGallery

> **🛠️ Stack for this lesson** — Expo SDK 57 / React Native 0.86 + native platform APIs · runs in a development build on a real phone (native modules do not run in Expo Go).
> 📥 Template: [/learn/m2/template/project-02-arroom](/learn/m2/template/project-02-arroom)

A 3D room companion for a gallery: a live camera backdrop, a virtual floor, and sculptures you place, move, resize and turn. It is a 3D scene over a camera, not augmented reality. The starter is a working app: a catalogue screen, a room screen with the gestures wired up, and `sculpture.glb` already bundled. Seven TODOs mark the Quest 2 skills you add.

**Time:** one to two weeks (see the suggested time split in the project lesson) · **Concept:** Capstone — Camera Backdrop, 3D Placement and Gestures

---

## What You'll Build

| # | TODO | File | Required item |
|---|------|------|---------------|
| 1 | The sculpture catalogue: a card for each of the 5 pieces with a thumbnail, name and real-world size | `screens/CatalogueScreen.js` | 1 |
| 2 | The point on the virtual floor under a finger, so the reticle follows it | `lib/floor.js` | 2 |
| 3 | Each model loaded once and reused | `lib/modelCache.js` | 3 |
| 4 | A sculpture stood on the floor at its real size, as a copy | `lib/placement.js` | 4 |
| 5 | The new size and turn from a pinch and a twist, with limits of 0.2 and 3.0 | `lib/transform.js` | 5 |
| 6 | The room captured and sent to the share sheet | `lib/share.js` | 6 |
| 7 | The five most recent placements kept between launches | `lib/roomStore.js` | 7 |

There are no commented-out solutions in the code. Each TODO states an outcome, a way to check it and a question to answer in your Notes doc. Read what is already there, work out what each TODO asks for, and write it.

**Already in the starter:** `App.js` (catalogue to room, and the Android back button); `screens/RoomScreen.js` (camera and 3D layers, the place and select modes, drag, pinch, twist and the restore on open); `lib/catalogue.js` (the five pieces and their sizes); `lib/setupScene.js`, `lib/reticle.js` and `components/CameraGate.js` (from Activity 06); `assets/sculpture.glb` (from Activity 07) and `metro.config.js` (so the bundler accepts `.glb`).

## Run It

```bash
npm install --legacy-peer-deps
npx expo start --dev-client
```

Open your **development build** (the app from Activity 19) on a phone that is on the same Wi-Fi as your computer. It finds the running server and loads your code. Native modules do not run in Expo Go.

Real device only: the camera and the 3D layer need one. To use your own model, put a `.glb` you have the right to use in `assets/` and point `model` in `lib/catalogue.js` at it.

## Verify

Your project is done when, on a real device:

- [ ] The catalogue shows 5 sculptures with a thumbnail, name and real size each.
- [ ] Opening one shows your camera with a green ring that follows your finger over the floor.
- [ ] Tapping places the sculpture at the ring, at its real size, standing on the floor. Placing it twice makes two separate sculptures.
- [ ] In select mode a tap selects one (it is outlined), a drag moves it, a pinch resizes it between 0.2 and 3.0 times, and a twist turns it.
- [ ] Share opens the share sheet with a picture of your room.
- [ ] Close the app from the app switcher and reopen the room: the most recent five placements are back.

## Stretch

Optional. Pick one and say in your Notes doc what you tried:

- **Wall-mount mode** — add a virtual wall plane and render the sculpture as if hung on it.
- **Light presets** — let the visitor switch between warm, cool and dim lighting so the shading matches their room.
- **Multi-sculpture scene** — build a curated room with three or more different sculptures.
- **Buy now CTA** — link a sculpture's catalogue entry to a payment or contact form.

## 🪞 Reflect on Your Work

Answer in 2-3 sentences each, in your Notes doc. Your tutor reads these as part of grading.

1. **What did you learn that you didn't know before?** Name the most surprising thing — a permission quirk, a platform difference, a debugging story.
2. **How did you collaborate with AI?** If you used Claude / ChatGPT / Cursor / Copilot, what part of the work did *you* contribute — the prompt, the verification, the design decision, the bug-fix? If you didn't use AI, what was the hardest thing to figure out alone?
3. **How do you know your code works?** Describe one specific thing you did to confirm — the device test you ran, the screenshot you took, the behavior you watched.

> AI is a great collaborator. Owning your thinking, verifying the output, and explaining your design choices is what *learning* looks like in this course.

## 📱 Device Evidence (required, 25% of grade)

Full marks need a real device, not a simulator or Expo's web preview. Link these in your project Notes doc, under a heading **Device Notes**:

1. **`screenshot-portrait.png`** — one full-screen portrait screenshot from your device showing a placed sculpture over the live camera view, with the status bar visible (the clock and battery prove it is a real device).
2. **`recording.mp4`** — a 1 to 2 minute screen recording of your real device: choose a sculpture, open the room, place it, move it, pinch and twist it, then take a screenshot and share.
3. **Device Notes** (80–150 words): the phone model and OS, what worked first try, the exact text of anything that broke, and what only the real phone showed you.

"I tested in Expo Go web" is not device evidence.

## Submit

Put your GitHub repo link, your `screenshot-portrait.png` and `recording.mp4` links and a **Device Notes** section in your project Notes doc. When the Verify checklist is green, submit the link to that Notes doc and press **Mark as Complete**.

<!-- claude-template-fix: readme-v3 -->

<!-- claude-template-fix: notes-migration-v1 -->
