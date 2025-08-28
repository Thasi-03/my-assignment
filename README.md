Assignment 1 — Accessible Tabs Generator (Next.js)

Name: Thasigaran Sagadevan

Student No: 21969946

A small Next.js app that generates a single-file HTML tabs component with inline CSS/JS only (no classes).
Includes: Header (student no., nav, hamburger + transform, theme toggle), Breadcrumbs, Footer, and a minimal About page (name, student no., how-to video).

Requirements

Node.js 18+ (recommended: 20)

npm

Install & Run (local)
# clone
git clone https://github.com/Thasi-03/my-assignment.git
cd my-assignment

# install
npm ci   # or: npm install

# dev
npm run dev           # http://localhost:3000

# production (local)
npm run build
npm run start         # http://localhost:3000

How to use

Open Home (/).

Set the ARIA label, add/remove/reorder tabs, edit titles and content (up to 15 tabs).

In Export, choose All tabs or Tab N.

Click Generate, then Copy or Download.

Open the exported HTML directly in a browser.

Arrow Left/Right switches tabs.

Selected tab persists (cookie).

Exported file uses only inline CSS/JS (no classes).

About page (/about): shows your name, student number, and a how-to video.

Theme: toggle Light/Dark in the header. Choice is saved in a cookie and applied server-side (no hydration issues).

Project structure (key files)
app/
  layout.tsx         # sets <html data-theme> from cookie
  page.tsx           # Tabs generator (export all or single tab)
  about/page.tsx     # Minimal about page (name, student no., video)
components/
  Header.tsx         # nav + hamburger (CSS transform) + theme toggle
  Breadcrumbs.tsx
  Footer.tsx
app/globals.css      # theme variables for light/dark

Scripts
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
}

Quick deploy (Azure VM, optional)
# on Ubuntu VM
sudo apt update -y
sudo apt install -y ca-certificates curl git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm i -g pm2

sudo mkdir -p /var/www && sudo chown "$USER":"$USER" /var/www
cd /var/www
git clone https://github.com/Thasi-03/my-assignment.git
cd my-assignment
npm ci || npm install
npm run build
pm2 start npm --name my-assignment -- start -- -H 0.0.0.0 -p 3000
pm2 save


(Optional Nginx reverse proxy to serve on port 80.)

Troubleshooting

Nothing at /: make sure you ran npm run dev (dev) or npm run build && npm run start (prod).

Theme not changing: confirm globals.css defines colors for html[data-theme="light|dark"].

Export looks wrong: click Generate before Copy/Download.
