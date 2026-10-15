# Destack Solutions

A modern, responsive business portfolio and landing page showcasing software development services with custom interactive visual effects.

## Features
- Hero banner with 3D text parallax and branded visual composition
- Custom fluid magnetic cursor follower with contextual morphing effects on interactive elements
- Services showcase highlighting web, mobile, and custom software development expertise
- Interactive service inquiry dropdown and contact form with EmailJS integration
- Fully responsive layout with sticky blurred navigation bar

## Tech Stack
- HTML5
- CSS3 (Custom properties, Flexbox, Grid, keyframe animations)
- Vanilla JavaScript (ES6+, DOM manipulation, RequestAnimationFrame)
- EmailJS SDK (`@emailjs/browser`)
- Google Fonts (Space Grotesk)

## How to Run
1. Open `index.html` directly in any web browser, or serve using a static web server:
   ```bash
   npx serve .
   ```
   or with Python:
   ```bash
   python -m http.server 8000
   ```
2. Open `http://localhost:8000` in your browser.
3. *Note*: To enable the live email contact form, replace `YOUR_PUBLIC_KEY`, `YOUR_SERVICE_ID`, and `YOUR_TEMPLATE_ID` in `index.html` and `script.js` with your active EmailJS account credentials.

## Status
Complete
