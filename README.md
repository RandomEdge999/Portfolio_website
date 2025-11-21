```
┌─────────────────────────────────────────────────────────────────────┐
│                      ALEEM.OS :: SYSTEM README                      │
└─────────────────────────────────────────────────────────────────────┘
```

## ▓ SYSTEM LOG
```
> uname -n
ALEEM-OS
> whoami
Muhammad Aleem Azhar // CS @ Rhodes College
> mission
Craft a deployable, cyberpunk desktop experience showcasing AI + Data work.
```

## ▓ FILESYSTEM MAP
```
.
├── index.html        # Main desktop shell (boot/login/windows)
├── css/
│   └── styles.css    # CRT scanlines, window manager, responsive tweaks
├── js/
│   ├── main.js       # Boot sequence, terminal engine, window manager
│   └── tailwind-config.js # CDN Tailwind overrides (fonts, neon palette)
├── assets/           # Images, PDFs, and binary payloads only
│   ├── *.png / *.jpg
│   └── *.pdf
└── README.md         # This briefing
```

## ▓ BOOT INSTRUCTIONS
```
> git clone https://github.com/RandomEdge999/Portfolio_website.git
> cd Portfolio_website
> (optional) python -m http.server 8080
> open http://localhost:8080
```
No build step required; Tailwind loads via CDN and picks up the injected config.

## ▓ OPERATION NOTES
- Boot screen auto-advances; click to skip POST if impatient.
- Login modal simulates passkey entry, then spawns the desktop + taskbar.
- Terminal understands commands: `help`, `ls`, `cat about.txt`, `projects`, `lab`, `open <window>`, `repo <id>`.
- Windows (Terminal, Projects, File Viewer, Lab) support drag, minimize, maximize, and taskbar toggling.
- Project data lives inside `js/main.js` (`projectsData` array). Update entries there to refresh cards + file viewer output.
- Tailwind tweaks live in `js/tailwind-config.js`; adjust palette/animations there when extending the UI.

## ▓ DEPLOYMENT CHECKLIST
```
[ ] Serve over HTTPS (fonts/icons require secure origin in PROD).
[ ] Verify asset paths after hosting (relative refs: css/, js/, assets/).
[ ] Run Lighthouse for perf/accessibility delta after content edits.
```

## ▓ SIGNAL
Need enhancements (new windows, data feeds, theming)? Open an issue or ping @RandomEdge999.
```
> logout
SESSION TERMINATED
```
