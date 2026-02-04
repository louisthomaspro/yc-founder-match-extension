<p align="center">
  <img src="assets/icons/icon-128.png" width="80" alt="YC Founder Match Logo"/>
</p>

<h1 align="center">YC Founder Match</h1>

<p align="center">
  <strong>AI-powered co-founder matching for YC Startup School</strong>
</p>

<p align="center">
  Automatically analyze YC Startup School co-founder candidates against your ideal profile criteria using OpenAI.
</p>

<p align="center">
  <a href="https://chromewebstore.google.com/detail/ekoopdeclojaanidpfbcgackhbebflnj/">
    <strong>Install from Chrome Web Store →</strong>
  </a>
</p>

---

## ✨ Features

- **Automatic Analysis** — Analyzes candidate profiles instantly when you browse [YC Startup School Co-founder Matching](https://www.startupschool.org/cofounder-matching)
- **AI-Powered Scoring** — Uses GPT-4o-mini to evaluate candidates against your criteria
- **Visual Match Badge** — Displays match score (0-100) with color-coded indicators
- **Green & Red Flags** — Highlights specific traits that align or conflict with your preferences
- **Privacy First** — Your API key and criteria are stored locally, never sent to external servers

## 🚀 Quick Start

### Installation

**Option 1: Install from Chrome Web Store (Recommended)**

1. [Install the extension](https://chromewebstore.google.com/detail/ekoopdeclojaanidpfbcgackhbebflnj/) from the Chrome Web Store
2. Skip to [Configuration](#configuration) below

**Option 2: Build from Source**

1. Clone this repository
   ```bash
   git clone https://github.com/your-username/yc-founder-match-extension.git
   cd yc-founder-match-extension
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Build the extension
   ```bash
   pnpm build
   ```

4. Load in Chrome
   - Navigate to `chrome://extensions/`
   - Enable **Developer mode** (top right)
   - Click **Load unpacked**
   - Select the `dist` folder

### Configuration

1. Click the extension icon in your browser toolbar
2. Enter your [OpenAI API key](https://platform.openai.com/api-keys)
3. Describe your ideal co-founder profile (skills, experience, location, commitment, etc.)
4. Save and start browsing candidates!

## 📖 How It Works

1. **Browse Candidates** — Navigate to any candidate profile on YC Startup School
2. **Automatic Extraction** — The extension extracts the candidate's profile information
3. **AI Analysis** — OpenAI evaluates the candidate against your criteria
4. **Results Badge** — A floating badge appears with:
   - Match score percentage
   - Green flags (positive indicators)
   - Red flags (potential concerns)
   - Summary assessment

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 |
| **Language** | TypeScript |
| **Build Tool** | Vite 7 + CRXJS |
| **Styling** | TailwindCSS |
| **UI Components** | Radix UI / shadcn/ui |
| **AI Integration** | Vercel AI SDK + OpenAI |
| **Routing** | TanStack Router |
| **Extension** | Chrome Manifest V3 |

## 📁 Project Structure

```
src/
├── background/       # Service worker for extension lifecycle
├── common/           # Shared utilities, types, and API clients
│   ├── openai.ts     # OpenAI integration for candidate analysis
│   ├── storage.ts    # Chrome storage wrapper
│   └── types/        # TypeScript type definitions
├── components/       # Reusable UI components
├── content/          # Content script (runs on candidate pages)
│   ├── domParser.ts  # Extracts candidate info from page
│   └── highlighter.ts # Renders the match badge
└── popup/            # Extension popup UI
    ├── routes/       # TanStack Router pages
    └── modules/      # Feature modules
```

## 🧑‍💻 Development

### Prerequisites

- Node.js >= 18
- pnpm

### Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Build with watch mode for development |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm check-types` | TypeScript type checking |
| `pnpm format` | Format code with Prettier |

### Development Workflow

1. Run `pnpm dev` to start the build watcher
2. Load the `dist` folder as an unpacked extension
3. Make changes — the extension rebuilds automatically
4. Click the refresh icon on `chrome://extensions/` to reload

## 🔒 Privacy & Security

- **Local Storage Only** — Your OpenAI API key and profile criteria are stored in Chrome's local storage
- **Direct API Calls** — All OpenAI requests go directly from your browser to OpenAI's API
- **No Telemetry** — The extension doesn't collect or transmit any analytics
- **Open Source** — Full source code available for audit

---

<p align="center">
  <sub>Built for founders, by founders 🚀</sub>
</p>
