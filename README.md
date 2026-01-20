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

A modern, high-performance IPTV streaming application built with Nuxt 3, featuring support for multiple providers (Stalker Portal & Xtream Codes), virtual scrolling for optimal memory usage, and a Netflix-inspired UI.

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

### 🎬 Multi-Provider Support

- **Stalker Portal API** - Full support for Stalker middleware
- **Xtream Codes API** - Compatible with Xtream-based services
- Seamless switching between providers

### 📺 Content Management

- **Live TV Channels** - Browse and stream live television
- **Movies (VOD)** - On-demand movie library
- **TV Series** - Episode-based content with season management
- Category-based organization
- Advanced search functionality

### 🚀 Performance Optimized

- **Virtual Scrolling** - Handle thousands of channels with minimal memory usage (~100-200MB vs 2GB+)
- **Lazy Image Loading** - Images load only when visible
- **Memory Leak Prevention** - Proper cleanup on component unmount
- **Responsive Design** - Optimized for all screen sizes

### 🎨 Modern UI/UX

- Netflix-inspired card design with hover effects
- Smooth animations and transitions
- Dark mode support
- Play icon overlays on hover
- Visual feedback for playing/selected items
- Shimmer loading animations
- Interactive card scaling

### 🎥 Video Player

- **Plyr Integration** - Feature-rich HTML5 video player
- HLS streaming support (m3u8)
- Quality selection (1080p, 720p, 480p, 360p)
- Playback speed control
- Picture-in-Picture mode
- Fullscreen support
- Error handling with automatic retry mechanism
- Loading states and progress indicators
- Comprehensive error messages

## 📋 Prerequisites

- Node.js 18.x or higher
- pnpm 8.x or higher (recommended) or npm/yarn
- Modern web browser with HLS support
- PHP server for proxy (Apache/Nginx with PHP support)
- **Legal access to content services**

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/nuxt-iptv-player.git
cd nuxt-iptv-player

# Install dependencies
pnpm install
```

### Backend Setup

1. **Create Backend Proxy**

Create a `backend/proxy.php` file in your project root:

```php
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$url = $_GET['url'] ?? '';

if (empty($url)) {
    http_response_code(400);
    echo json_encode(['error' => 'URL parameter is required']);
    exit;
}

// Validate URL
if (!filter_var($url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid URL']);
    exit;
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(500);
    echo json_encode(['error' => 'Proxy error: ' . $curlError]);
    exit;
}

http_response_code($httpCode);
header('Content-Type: ' . $contentType);
echo $response;
?>
```

2. **Configure Web Server**

For Apache, create `.htaccess` in `backend/` directory:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /backend/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^(.*)$ proxy.php [QSA,L]
</IfModule>
```

3. **Update Proxy URLs**

Update the proxy URL in your components to match your setup:

```typescript
// In VideoPlayer.vue and other components
const proxyUrl = computed(() => {
  if (!sourceUrl.value) return "";
  return (
    "http://your-domain.com/backend/proxy.php?url=" +
    encodeURIComponent(sourceUrl.value)
  );
});
```

### Environment Configuration

Create a `.env` file in the project root:

```bash
# API Configuration (Optional)
NUXT_PUBLIC_API_BASE=http://your-backend-url

# Proxy Configuration
NUXT_PUBLIC_PROXY_URL=http://your-domain.com/backend/proxy.php
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

Open your browser and navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
nuxt-iptv-player/
├── components/
│   ├── Card.vue                    # Reusable card component with Netflix-style design
│   ├── VideoPlayer.vue             # Video player with Plyr and error handling
│   ├── live/
│   │   └── index.vue              # Live channels grid with virtual scrolling
│   ├── movies/
│   │   └── index.vue              # Movies grid with virtual scrolling
│   └── series/
│       └── index.vue              # TV series grid
├── stores/
│   ├── stalker.ts                 # Pinia store for Stalker Portal API
│   └── xtream.ts                  # Pinia store for Xtream Codes API
├── backend/
│   ├── proxy.php                  # PHP proxy for CORS and streaming
│   └── .htaccess                  # Apache configuration
├── pages/
│   └── index.vue                  # Main application page
├── layouts/
│   └── default.vue                # Default layout
├── public/
│   └── favicon.ico                # App favicon
├── nuxt.config.ts                 # Nuxt configuration
├── tailwind.config.ts             # Tailwind CSS configuration
└── package.json                   # Dependencies and scripts
```

## 🎯 Usage

> **Reminder**: Only use this application with services you have legal access to and proper subscriptions for.

### 1. Authentication

#### Stalker Portal

```typescript
const stalker = useStalkerStore();

await stalker.authenticate({
  portalUrl: "http://your-portal.com",
  macAddress: "00:1A:79:XX:XX:XX",
});

// Load categories
await stalker.loadGenres("itv"); // For live TV
await stalker.loadGenres("vod"); // For movies
await stalker.loadGenres("series"); // For series
```

#### Xtream Codes

```typescript
const xtream = useXtreamStore();

await xtream.authenticate({
  serverUrl: "http://your-server.com:port",
  username: "your-username",
  password: "your-password",
});

// Categories are loaded automatically after authentication
```

### 2. Browsing Content

- Select a category from the sidebar
- Browse channels/movies in the grid
- Use the search bar to find specific content
- Click on any card to start playback

### 3. Playing Content

The application automatically handles playback:

- Click on any channel/movie card
- Video player modal opens automatically
- Stream starts playing with automatic quality selection
- Use player controls for playback management

### 4. Switching Providers

The app automatically detects which provider is authenticated and displays the appropriate content.

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
- **[vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)** - Blazing fast scrolling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Pinia](https://pinia.vuejs.org/)** - The Vue Store

## 📧 Support

For development and educational inquiries only:

- 🐛 Issues: [GitHub Issues](https://github.com/your-username/nuxt-iptv-player/issues)
- 📖 Documentation: [Wiki](https://github.com/your-username/nuxt-iptv-player/wiki)

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

**Made with ❤️ using Nuxt and Vue.js for Educational Purposes**

_Last updated: January 2026_