# Auto Proxy

Một ứng dụng Electron hiện đại được xây dựng với TypeScript, React, và Vite, tuân theo kiến trúc Main–Preload–Renderer an toàn.

## ✨ Tính năng

- 🔧 **Cấu hình Proxy**: Quản lý và kiểm tra kết nối proxy
- 📁 **Quản lý File**: Đọc, chỉnh sửa và lưu file văn bản
- ⚙️ **Cài đặt**: Giao diện người dùng tùy chỉnh với theme switching
- 🔒 **Bảo mật**: Kiến trúc an toàn với contextBridge và sandbox
- 🎨 **UI hiện đại**: Giao diện responsive với dark/light theme
- 📦 **Đóng gói**: Hỗ trợ build cho Windows, macOS, và Linux

## 🏗️ Kiến trúc

Dự án tuân theo kiến trúc Electron hiện đại với sự tách biệt rõ ràng:

```
src/
├── main/           # Main process (Node.js context)
│   ├── app.ts      # Bootstrap và khởi tạo ứng dụng
│   ├── main.ts     # Tạo BrowserWindow và menu
│   ├── security.ts # Chính sách bảo mật
│   ├── logger.ts   # Winston logging
│   ├── ipc/        # IPC handlers
│   └── services/   # Business logic services
├── preload/        # Context bridge (sandboxed)
│   ├── index.ts    # Expose API an toàn
│   └── api-schema.ts # Type definitions
└── renderer/       # UI (React + Vite)
    ├── components/ # React components
    ├── hooks/      # Custom hooks
    └── styles/     # CSS styles
```

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống

- Node.js 18+ 
- npm, yarn, hoặc pnpm

### Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### Chạy trong môi trường development

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

### Build cho production

```bash
# Build chỉ source code
npm run build:only

# Build và đóng gói ứng dụng
npm run build

# Chỉ đóng gói (sau khi đã build)
npm run pack
```

### Chạy tests

```bash
# Unit tests
npm run test

# E2E tests
npm run e2e

# Linting
npm run lint
```

## 🔧 Cấu hình

### Environment Variables

Tạo file `.env` trong thư mục gốc:

```env
NODE_ENV=development
VITE_APP_NAME=Auto Proxy
VITE_APP_VERSION=0.1.0
```

### Build Configuration

Cấu hình build được định nghĩa trong `package.json`:

```json
{
  "build": {
    "appId": "com.autoproxy.app",
    "productName": "Auto Proxy",
    "mac": { "target": "dmg" },
    "win": { "target": "nsis" },
    "linux": { "target": "AppImage" }
  }
}
```

## 🛡️ Bảo mật

Dự án tuân theo các best practices bảo mật:

- ✅ **Context Isolation**: Bật để ngăn chặn truy cập trực tiếp vào Node.js APIs
- ✅ **Sandbox**: Bật để hạn chế quyền của renderer process
- ✅ **Node Integration**: Tắt để ngăn chặn truy cập trực tiếp vào Node.js
- ✅ **Content Security Policy**: CSP được áp dụng để hạn chế script execution
- ✅ **IPC Validation**: Tất cả IPC messages được validate với Zod schemas
- ✅ **Secure Preload**: Chỉ expose API cần thiết qua contextBridge

## 📝 API Reference

### Main Process APIs

#### File Operations
- `fs:readFileText` - Đọc nội dung file văn bản
- `fs:writeFileText` - Ghi nội dung vào file
- `dialog:selectFile` - Hiển thị dialog chọn file
- `dialog:selectFolder` - Hiển thị dialog chọn thư mục

#### Settings Management
- `settings:get` - Lấy cài đặt ứng dụng
- `settings:save` - Lưu cài đặt ứng dụng
- `settings:reset` - Reset về cài đặt mặc định

#### Proxy Configuration
- `proxy:getConfig` - Lấy cấu hình proxy
- `proxy:saveConfig` - Lưu cấu hình proxy
- `proxy:testConnection` - Kiểm tra kết nối proxy

#### Window Operations
- `window:minimize` - Thu nhỏ cửa sổ
- `window:maximize` - Phóng to/khôi phục cửa sổ
- `window:close` - Đóng cửa sổ

### Renderer APIs

Tất cả APIs được expose qua `window.api`:

```typescript
// Lấy thông tin ứng dụng
const appInfo = await window.api.getAppInfo();

// Đọc file
const content = await window.api.readFileText('/path/to/file.txt');

// Lưu cài đặt
await window.api.saveSettings({ theme: 'dark' });

// Kiểm tra proxy
const isConnected = await window.api.testProxyConnection(config);
```

## 🧪 Testing

### Unit Tests

Sử dụng Vitest cho unit testing:

```bash
npm run test
```

### E2E Tests

Sử dụng Playwright cho end-to-end testing:

```bash
npm run e2e
```

## 📦 Packaging

Ứng dụng được đóng gói với electron-builder:

- **Windows**: NSIS installer
- **macOS**: DMG package
- **Linux**: AppImage

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 🙏 Acknowledgments

- [Electron](https://electronjs.org/) - Framework để xây dựng desktop apps
- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Winston](https://github.com/winstonjs/winston) - Logging
- [Zod](https://zod.dev/) - Schema validation