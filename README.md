# 📺 Nuxt IPTV Player

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)
[![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js&labelColor=2C3E50)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&labelColor=1E3A8A)](https://www.typescriptlang.org/)

> ⚠️ **IMPORTANT LEGAL DISCLAIMER**
>
> This software is provided **FOR EDUCATIONAL AND DEVELOPMENT PURPOSES ONLY**.
>
> - This application is a technical demonstration and learning tool for streaming protocols and modern web development practices
> - Users are **solely responsible** for ensuring they have proper legal rights and licenses for any content they access
> - The developers and contributors of this project **do not condone or support** piracy or unauthorized content distribution
> - This software does **NOT** provide, host, or distribute any content - it is simply a player interface
> - Users must comply with all applicable copyright laws and terms of service in their jurisdiction
> - Commercial use or distribution of this software for accessing unauthorized content is **strictly prohibited**
> - By using this software, you agree to use it only with content you have legal rights to access
>
> **The authors and contributors accept NO liability for misuse of this software.**

A modern, feature-rich IPTV streaming application built with Nuxt 4, featuring support for multiple providers (Stalker Portal & Xtream Codes), multi-account management, advanced channel management, virtual scrolling for optimal performance, and a Netflix-inspired UI.

## ⚖️ Legal Notice

### Terms of Use

By accessing or using this software, you acknowledge and agree to the following:

1. **Educational Purpose**: This software is intended solely for educational, development, and testing purposes to demonstrate modern web technologies and streaming protocols.

2. **Content Responsibility**: You are solely responsible for:
   - Ensuring you have legal rights to access any content through this application
   - Complying with all applicable copyright laws and regulations
   - Respecting intellectual property rights of content creators
   - Adhering to terms of service of any streaming providers you connect to

3. **No Content Provided**: This application does NOT:
   - Provide any streaming content
   - Host any media files
   - Distribute copyrighted material
   - Include or link to unauthorized content sources

4. **No Warranty**: This software is provided "AS IS" without warranty of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.

5. **Limitation of Liability**: In no event shall the authors or copyright holders be liable for any claim, damages, or other liability arising from the use or misuse of this software.

6. **Acceptable Use**: You may use this software only for:
   - Personal development and learning
   - Testing streaming protocols
   - Connecting to services you have legitimate subscriptions to
   - Educational research and demonstration

7. **Prohibited Use**: You may NOT use this software for:
   - Accessing copyrighted content without proper authorization
   - Circumventing digital rights management (DRM) systems
   - Commercial piracy or unauthorized distribution
   - Any illegal activities

### Developer Responsibility Statement

The developers of this project:
- Do not operate, manage, or have any affiliation with IPTV services
- Do not endorse any specific IPTV provider or service
- Provide this software as a technical demonstration only
- Encourage users to support content creators through legal channels
- Reserve the right to refuse support for any usage that violates these terms

### Compliance

Users must ensure their use of this software complies with:
- Local, national, and international copyright laws
- Digital Millennium Copyright Act (DMCA) or equivalent legislation in their jurisdiction
- Terms of service of any streaming providers they connect to
- All applicable intellectual property rights

**If you do not agree with these terms, you must not use this software.**

## ✨ Features

### 🔐 Multi-Account Management

- **Unlimited Accounts** - Save and manage multiple IPTV accounts (up to 10)
- **Quick Account Switching** - Switch between accounts instantly without re-entering credentials
- **Encrypted Storage** - All credentials stored securely using AES-GCM encryption
- **Per-Account Data Isolation** - Each account maintains separate favorites, watch history, and preferences
- **Custom Account Names** - Label accounts for easy identification (e.g., "Home IPTV", "Work Account")
- **Quick Login** - Access saved accounts directly from the login page
- **Account Management UI** - Full account management in settings (add, edit, delete, switch)

### 🎬 Multi-Provider Support

- **Stalker Portal API** - Full support for Stalker middleware
- **Xtream Codes API** - Compatible with Xtream-based services
- **Seamless Provider Switching** - Automatically detect and switch between providers
- **Unified Interface** - Consistent experience across both provider types

### 📺 Content Management

- **Live TV Channels** - Browse and stream live television
- **Movies (VOD)** - On-demand movie library with metadata
- **TV Series** - Episode-based content with season/episode management
- **Category Organization** - Content organized by categories for easy browsing
- **Global Search** - Search across all content types with keyboard shortcuts (Ctrl+K / Cmd+K)
- **Search History** - Quick access to recent searches

### 📋 Channel Management

- **Channel Favorites** - Mark channels as favorites for quick access
- **Hidden Channels** - Hide unwanted channels from channel lists
- **Recently Watched** - Track last 20 watched channels
- **Filter Tabs** - Filter channels by All/Favorites/Recent with live counts
- **Per-Account Settings** - Each account has its own channel preferences
- **Bulk Management** - Manage multiple channels efficiently

### 🗂️ Category Management (Bulk Hiding)

- **Bulk Category Hiding** - Hide entire categories at once instead of individual channels
- **Organized Tabs** - Separate tabs for Live TV, Movies, and Series categories
- **Category Counts** - See how many items are in each category
- **Per-Account Storage** - Hidden categories saved separately for each account
- **Automatic Filtering** - Hidden categories automatically filtered from all views
- **Quick Show/Hide** - Toggle category visibility with one click

### 📖 Watch History & Continue Watching

- **Automatic Progress Tracking** - Track viewing progress for all VOD content
- **Continue Watching** - Resume where you left off (5%-90% progress)
- **Per-Account History** - Each account maintains separate watch history
- **Progress Bars** - Visual progress indicators on content cards
- **Auto-Resume** - Automatically resume playback from last position
- **History Management** - Clear individual items or entire history

### ⭐ Favorites System

- **Multi-Content Favorites** - Favorite channels, movies, and series
- **Per-Account Favorites** - Each account has its own favorites list
- **Quick Access** - Dedicated Favorites tab in dashboard
- **Filter by Type** - View favorites by content type or provider
- **Import/Export** - Backup and restore favorites
- **Visual Indicators** - Heart icons show favorite status

### 🚀 Performance Optimized

- **Virtual Scrolling** - Handle thousands of channels with minimal memory usage (~100-200MB vs 2GB+)
- **Lazy Image Loading** - Images load only when visible
- **Image Proxy** - Reliable image loading using images.weserv.nl with WebP conversion
- **Memory Leak Prevention** - Proper cleanup on component unmount
- **Automatic Memory Management** - Clean up unused data automatically
- **Optimized Rendering** - Efficient DOM updates and re-renders

### 🎨 Modern UI/UX

- **Netflix-Inspired Design** - Professional card design with hover effects
- **Smooth Animations** - Fluid transitions and interactions
- **Dark Mode** - Eye-friendly dark theme throughout
- **Responsive Design** - Optimized for all screen sizes
- **Visual Feedback** - Clear indicators for playing/selected items
- **Loading States** - Shimmer animations and progress indicators
- **Toast Notifications** - Non-intrusive feedback for user actions

### 🎥 Advanced Video Player

- **Plyr Integration** - Feature-rich HTML5 video player
- **Multiple Format Support** - HLS (m3u8), MPEG-TS (.ts), MP4, and more
- **Smart Format Detection** - Automatic MIME type detection and fallback
- **Quality Selection** - Multiple quality options (1080p, 720p, 480p, 360p)
- **Playback Speed Control** - Adjust playback speed (0.5x - 2x)
- **Picture-in-Picture** - Built-in PiP support
- **Fullscreen Support** - True fullscreen experience
- **Error Handling** - Automatic retry with smart fallbacks
- **Resume Playback** - Continue from last watched position
- **Keyboard Shortcuts** - Full keyboard control support

### 🔍 Search Features

- **Global Search Modal** - Keyboard shortcut (Ctrl+K / Cmd+K) to search anywhere
- **Content Type Filters** - Filter by Live TV, Movies, or Series
- **Search History** - Remember last 10 searches for quick access
- **Real-time Results** - Instant search as you type
- **Grouped Results** - Results organized by content type
- **Empty States** - Helpful messages when no results found

### ⚙️ Settings & Preferences

- **Playback Settings** - Auto-play next episode toggle
- **Account Settings** - Manage all saved accounts
- **Channel Management** - View and manage hidden channels
- **Category Management** - Bulk hide/show categories
- **Per-Account Isolation** - All settings saved per account

## 📋 Prerequisites

- Node.js 18.x or higher
- pnpm 8.x or higher (recommended) or npm/yarn
- Modern web browser with HLS support
- **Legal access to content services**

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/robleigh1991/Nuxt4-Stalker-Portal.git
cd Nuxt4-Stalker-Portal

# Install dependencies
pnpm install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🏗️ Project Structure

```
nuxt-iptv-player/
├── app/
│   ├── components/
│   │   ├── Card.vue                    # Netflix-style content card
│   │   ├── VideoPlayer.vue             # Advanced video player
│   │   ├── ChannelsSidebar.vue         # Live TV sidebar with filters
│   │   ├── MovieSidebar.vue            # Movies sidebar
│   │   ├── SeriesSidebar.vue           # Series sidebar with episodes
│   │   ├── SearchModal.vue             # Global search modal
│   │   ├── live/                       # Live TV components
│   │   ├── movies/                     # Movie components
│   │   └── series/                     # Series components
│   ├── composables/
│   │   ├── useAuth.ts                  # Authentication logic
│   │   ├── useImageProxy.ts            # Image proxy utilities
│   │   ├── useFavorites.ts             # Favorites management
│   │   └── useSeriesDetails.ts         # Series metadata
│   ├── stores/
│   │   ├── accounts.ts                 # Multi-account management
│   │   ├── stalker.ts                  # Stalker Portal API
│   │   ├── xtream.ts                   # Xtream Codes API
│   │   ├── favorites.ts                # Favorites store
│   │   ├── watchHistory.ts             # Watch history tracking
│   │   ├── channelManagement.ts        # Channel preferences
│   │   └── settings.ts                 # App settings
│   ├── pages/
│   │   ├── index.vue                   # Login page
│   │   └── dashboard.vue               # Main dashboard
│   └── utils/
│       └── crypto.ts                   # AES-GCM encryption utilities
├── types/
│   ├── app.ts                          # Application types
│   ├── stalker.ts                      # Stalker API types
│   └── xtream.ts                       # Xtream API types
├── nuxt.config.ts                      # Nuxt configuration
├── tailwind.config.ts                  # Tailwind CSS configuration
└── package.json                        # Dependencies and scripts
```

## 🎯 Usage

> **Reminder**: Only use this application with services you have legal access to and proper subscriptions for.

### 1. First Time Login

#### Stalker Portal

1. Navigate to the login page
2. Select "Stalker Portal" as provider type
3. Enter your portal URL and MAC address
4. Check "Remember me" to save credentials
5. Click "Sign In"

#### Xtream Codes

1. Navigate to the login page
2. Select "Xtream Codes" as provider type
3. Enter server URL, username, and password
4. Check "Remember me" to save credentials
5. Click "Sign In"

### 2. Managing Multiple Accounts

#### Adding Accounts

1. Go to **Dashboard** → **Account Settings**
2. Click **"Add Account"**
3. Enter account name and credentials
4. Account is automatically saved with encryption

#### Switching Accounts

- **From Dashboard**: Navigate to Account Settings → Click "Switch" on any saved account
- **From Login Page**: Click on any saved account for instant login

#### Managing Accounts

- **Rename**: Click "Edit" button on any account
- **Delete**: Click "Delete" button (with confirmation)
- **View Active**: Active account shown with green badge

### 3. Browsing Content

- **Tabs**: Switch between Live TV, Movies, Series, and Favorites
- **Categories**: Select categories from the left sidebar
- **Search**: Press `Ctrl+K` (or `Cmd+K` on Mac) to open global search
- **Filters**: Use filter tabs to view All/Favorites/Recent channels

### 4. Managing Channels

#### Favorites

- Click the **heart icon** on any channel to add/remove from favorites
- Access all favorites from the **Favorites** filter tab
- View favorites across all content in the dedicated **Favorites** section

#### Hiding Channels

- Hover over any channel and click the **eye-off icon** to hide
- Hidden channels won't appear in any channel lists
- Manage hidden channels in **Account Settings** → **Hidden Channels**

### 5. Category Management (Bulk Hiding)

1. Go to **Dashboard** → **Account Settings** → **Category Management**
2. Select tab: **Live TV**, **Movies**, or **Series**
3. Click **"Hide"** on any category to hide all channels/items in that category
4. Click **"Show"** to unhide a category
5. Use **"Show All Categories"** to unhide everything at once

### 6. Watch History & Continue Watching

- **Continue Watching** section appears on dashboard when you have in-progress content
- Click any item to resume from where you left off
- Progress bars show completion percentage
- Remove items with the **X** button on hover

### 7. Video Playback

- Click any content card to start playback
- Player opens in fullscreen modal
- Use **sidebar** to browse and switch content while watching
- Press **X** button or **Escape** to close player
- Progress is automatically saved for VOD content

### 8. Keyboard Shortcuts

- `Ctrl+K` / `Cmd+K` - Open global search
- `Escape` - Close modals/player
- `Space` - Play/Pause (when player focused)
- `F` - Fullscreen toggle (when player focused)
- `M` - Mute/Unmute (when player focused)

## 🔒 Security Features

### Credential Encryption

- All account credentials encrypted using **AES-GCM** encryption
- Encryption key derived from browser-specific data
- Credentials never stored in plain text
- Automatic encryption on save, decryption on load

### Per-Account Data Isolation

- Each account has completely isolated data storage
- Favorites, watch history, and preferences stored separately
- Storage keys include account ID: `iptv_{feature}_{accountId}`
- Switching accounts automatically loads correct data

### Local Storage Only

- All data stored locally in browser
- No external servers or databases
- Complete privacy and control over your data
- Export/import capabilities for backups

## 🎨 Customization

### Themes

The app uses Nuxt UI with Tailwind CSS. Customize colors in `app.config.ts`:

```typescript
export default defineAppConfig({
  ui: {
    primary: 'red',
    gray: 'neutral'
  }
})
```

### Player Settings

Configure player defaults in `components/VideoPlayer.vue`:

```typescript
const playerOptions = {
  controls: ['play-large', 'play', 'progress', 'current-time',
             'mute', 'volume', 'settings', 'pip', 'fullscreen'],
  settings: ['quality', 'speed'],
  speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] }
}
```

## 🐛 Troubleshooting

### Video Not Playing

1. Check your internet connection
2. Verify provider credentials are correct
3. Try switching video quality
4. Check browser console for errors
5. Ensure the stream URL is accessible

### Images Not Loading

- The app uses `images.weserv.nl` proxy for reliable image loading
- If images still don't load, check your internet connection
- Some providers may have restrictive CORS policies

### Account Switching Issues

1. Clear browser cache and localStorage
2. Re-add accounts with fresh credentials
3. Check that credentials are valid for each account

### Performance Issues

1. Clear watch history to free up space
2. Reduce number of saved accounts (limit 10)
3. Close other browser tabs
4. Use Chrome/Edge for best performance

## 📄 License

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

**ADDITIONAL TERMS**: This software is intended for educational and development purposes only. Users are solely responsible for ensuring they have proper legal rights to access any content through this application. The authors do not condone piracy or unauthorized content distribution.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Code of Conduct

All contributors must:
- Respect intellectual property rights
- Not promote or facilitate piracy
- Follow ethical development practices
- Comply with all applicable laws

### Reporting Bugs

1. Check if the bug is already reported in Issues
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser and OS information

### Feature Requests

1. Check if feature is already requested
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits (must be legal and ethical)
   - Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request with:
   - Clear description of changes
   - Screenshots/GIFs for UI changes
   - Link to related issues
   - Confirmation that changes comply with project ethics

## 🙏 Acknowledgments

- **[Nuxt](https://nuxt.com/)** - The Intuitive Vue Framework
- **[Nuxt UI](https://ui.nuxt.com/)** - Fully styled and customizable components
- **[Vue.js](https://vuejs.org/)** - The Progressive JavaScript Framework
- **[Plyr](https://plyr.io/)** - A simple, accessible HTML5 media player
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Pinia](https://pinia.vuejs.org/)** - The Vue Store
- **[images.weserv.nl](https://images.weserv.nl/)** - Free image proxy and optimization service

## 📧 Support

For development and educational inquiries only:

- 🐛 Issues: [GitHub Issues](https://github.com/robleigh1991/Nuxt4-Stalker-Portal/issues)
- 📖 Documentation: This README

**Note**: Support is provided for technical/development questions only. We cannot and will not provide support for accessing unauthorized content.

## 🌟 Show Your Support

Give a ⭐️ if this project helped you learn about modern web development and streaming technologies!

## ⚠️ Final Reminder

**This software is a development tool and educational resource.**

- Always respect copyright and intellectual property
- Only access content you have legal rights to
- Support content creators through legitimate channels
- Use responsibly and ethically

**The developers are not responsible for how you choose to use this software.**

---

**Made with ❤️ using Nuxt 4 and Vue.js for Educational Purposes**

_Last updated: February 2026_
