# 🚀 Quick Start Guide

Hướng dẫn nhanh để bắt đầu với Auto Proxy.

## 📋 Yêu cầu

- Node.js 18+ 
- npm, yarn, hoặc pnpm

## ⚡ Bắt đầu nhanh

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Chạy setup script (tùy chọn)

```bash
npm run setup
```

### 3. Khởi chạy development server

```bash
npm run dev
```

Ứng dụng sẽ mở trong cửa sổ Electron với hot reload enabled.

## 🎯 Các lệnh hữu ích

```bash
# Development
npm run dev              # Chạy development server
npm run build:only       # Build source code
npm run preview          # Preview build

# Testing
npm run test             # Chạy unit tests
npm run test:watch       # Chạy tests với watch mode
npm run e2e              # Chạy E2E tests

# Code Quality
npm run lint             # Kiểm tra linting
npm run lint:fix         # Tự động sửa linting errors

# Production
npm run build            # Build và đóng gói ứng dụng
npm run pack             # Chỉ đóng gói (sau khi build)
npm run dist             # Tạo distribution packages
```

## 🏗️ Cấu trúc dự án

```
auto-proxy/
├── src/
│   ├── main/           # Main process
│   ├── preload/        # Context bridge
│   └── renderer/       # React UI
├── test/               # Tests
├── resources/          # Icons và assets
└── build/              # Build output
```

## 🔧 Tính năng chính

- **Proxy Settings**: Cấu hình và kiểm tra proxy
- **File Manager**: Quản lý file văn bản
- **Settings**: Cài đặt ứng dụng và theme
- **Security**: Kiến trúc an toàn với contextBridge

## 🐛 Troubleshooting

### Lỗi thường gặp

1. **Module not found**: Chạy `npm install` lại
2. **Port already in use**: Thay đổi port trong Vite config
3. **Build fails**: Kiểm tra TypeScript errors với `npm run lint`

### Debug mode

Để chạy với debug mode:

```bash
DEBUG=* npm run dev
```

## 📚 Tài liệu

- [README.md](./README.md) - Tài liệu chi tiết
- [API Reference](./README.md#-api-reference) - Danh sách APIs
- [Architecture](./README.md#️-kiến-trúc) - Kiến trúc dự án

## 🤝 Hỗ trợ

Nếu gặp vấn đề, hãy tạo issue trên GitHub hoặc liên hệ qua email.

---

**Chúc bạn coding vui vẻ! 🎉**
