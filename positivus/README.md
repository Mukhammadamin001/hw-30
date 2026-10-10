# Positivus — landing page

HTML/CSS/JS version of the Positivus "Home" mockup from Figma. Open `index.html` in a browser,
no build step needed.

```
positivus/
├── index.html        page markup (semantic sections, SVG icon sprite)
├── css/style.css     styles + responsive breakpoints (1200 / 1100 / 900 / 640 px)
├── js/main.js        mobile menu, accordion, testimonials slider, form validation
└── img/              illustrations, team avatars, favicon (SVG)
```

- Colors and fonts come from the mockup's "Style" frame: `#B9FF66`, `#191A23`, `#F3F3F3`,
  Space Grotesk (Google Fonts). Font sizes are 60/40/30/20/18 px on desktop and 43/36/26/18/16 px on mobile.
- **Working Process** is built from `<details>`, so only one step is open at a time.
- **Testimonials** is an infinite slider. It has arrows, star dots, keyboard arrow keys and swipe.
- The forms check their fields and show a message. Nothing is sent to a server.
- The illustrations, client logos and avatars are drawn in SVG/CSS to match the style of the mockup.
  They aren't the original Figma assets, so swap in exports from Figma if you need exact artwork.
