# GIF Search App 🔍✨

A modern, responsive, and modular web application built with **Vanilla JavaScript (ES6+)** that connects to the **Giphy API** to search and display GIFs. This project is created as part of **The Odin Project** curriculum ("Working With APIs").

It is structured following software design patterns like the **Single Responsibility Principle (SOLID)** and uses **Webpack** as its build tool and asset bundler, alongside **ESLint** for code quality assurance.

---

## 🚀 Key Features

- **Architecture (Orchestrator Pattern):** Clean separation of concerns. The API fetching logic and DOM rendering are completely decoupled. They communicate exclusively through a central orchestrator (`index.js`).
- **Giphy API Integration:** Implements robust asynchronous data fetching using `async/await` and custom error handling for network or HTTP status failures.
- **Dynamic UI & Component Rendering:** Native DOM building (without innerHTML vulnerability risks where dynamic data is injected), featuring a single-column layout for single GIFs and a clean 3-column responsive grid layout for search results.
- **Webpack Multi-Environment Build:** Divided into `common`, `development` (with a local dev server at port 3000, hot reloading, and source mapping), and `production` (optimized for deployment).
- **Environment Variables Support:** Uses `dotenv-webpack` to securely manage API keys without leaking them into version control.
- **Advanced Linting Layout:** Configured with the modern ESLint flat system (`eslint.config.js`) supporting JavaScript, JSON, CSS, and Markdown linting rules.

---

## 📁 Project Architecture & Directory Layout

```text
SEARCH_APP_ALF/
├── src/
│   ├── modules/
│   │   ├── apiService.js       # Handles API communications with Giphy (Data layer)
│   │   └── domController.js    # Compiles and builds all UI components (Presentation layer)
│   ├── styles/
│   │   └── style.css           # Global layout, typography, grids, and utilities
│   ├── index.js                # Core Orchestrator / Application bootstrap entry point
│   └── template.html           # Base HTML layout template processed by Webpack
├── .gitignore                  # Specifying untracked files to ignore (node_modules, .env, dist)
├── eslint.config.js            # Configuration for linting standards and rule exemptions
├── package.json                # Project dependencies, metadata, and lifecycle scripts
├── webpack.common.js           # Shared Webpack configuration (loaders and baseline plugins)
├── webpack.dev.js              # Development runtime settings (DevServer, eval-source-map)
└── webpack.prod.js             # Production settings for optimal asset compilation
```

---

## 🛠️ Installation & Setup Guide

### 1. Prerequisite Environment

Ensure you have [Node.js](https://nodejs.org/) installed on your computer.

### 2. Clone and Jump In

```bash
git clone https://github.com/alfredo-alt/search_app_alf.git
cd search_app_alf
```

### 3. Install Dependencies

Pull down all loaders, plugins, and development tools declared in `package.json`:

```bash
npm install
```

### 4. Inject Environment Variables

The application queries Giphy using an API key loaded through `process.env.GIPHY_API_KEY`.

1. Create a `.env` file in the root directory.
2. Add your Giphy API key:

```env
GIPHY_API_KEY=dc6zaTOxFJmzC
```

_(Note: The key above is Giphy's public beta testing key, which is excellent for learning environments but rate-limited)._

---

## 📦 Lifecycle Scripts

Manage your runtime and build outputs with these commands:

- **Run Local Development Server:**

  ```bash
  npm run dev
  ```

  Compiles assets in-memory, stands up a server at `http://localhost:3000`, watches files for code changes, and auto-opens your default web browser.

- **Build for Production Compilation:**

  ```bash
  npm run build
  ```

  Aggregates, compiles, and uglifies assets inside a clean, distribution-ready `/dist` folder.

- **Deploy Output:**
  ```bash
  npm run deploy
  ```
  Pushes your built distribution folder to the `gh-pages` branch for hosting.

---

## 🧩 Structural Architectural Walkthrough

### 🛰️ Data Engine (`src/modules/apiService.js`)

Strictly isolated from the visual layer. It exposes two core actions: `fetchRandomGif()` and `searchGifs(query)`. If an HTTP error occurs (e.g., status 404 or 500), it explicitly intercepts the response state and throws a verbose error instance so that handlers upper-stream can properly process the anomaly.

### 🎨 Graphic UI Builder (`src/modules/domController.js`)

Operates under Dependency Inversion; it does not import the API layers. It takes raw incoming properties and callback arrays to render layout blocks seamlessly. Contains distinct layout mechanisms to draw full-scale static highlights or multiple collection nodes inside a dynamic `3-column CSS Grid`.

### 🧠 App Conductor (`src/index.js`)

Imports both structural nodes. Hooks the functional visual callbacks up to async data streams. Manages sequential user triggers like executing a random preview lookup when the page first instances.
