# Mator Life - Avtomobil Xizmatlari Boshqaruv Tizimi

Full-stack web dastur avtomobil xizmatlari, shogirdlar va qarzlarni boshqarish uchun.

## Texnologiyalar

### Frontend
- React + TypeScript + Vite
- Tailwind CSS
- React Query (TanStack Query)
- React Router DOM

### Backend
- Node.js + Express + TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- Telegram Bot API
- Groq AI Integration

## Ishga Tushirish

### Bitta buyruq bilan (Tavsiya etiladi)
```bash
npm run dev
```

Bu buyruq frontend va backend ni bir vaqtda ishga tushiradi:
- Frontend: http://localhost:5177
- Backend: http://localhost:4000

### Alohida ishga tushirish
```bash
# Backend
npm run dev:backend

# Frontend  
npm run dev:frontend
```

### Barcha paketlarni o'rnatish
```bash
npm run install:all
```

## Portlar

- **Frontend**: 5177
- **Backend**: 4000
- **MongoDB**: Cloud (MongoDB Atlas)

## Konfiguratsiya

### Backend (.env)
```
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
TELEGRAM_BOT_TOKEN_CAR=your_car_bot_token
TELEGRAM_BOT_TOKEN_DEBT=your_debt_bot_token
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:4000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## Asosiy Funksiyalar

- ✅ Avtomobillar CRUD
- ✅ Xizmatlar boshqaruvi
- ✅ Shogirdlar tizimi (Master/Apprentice)
- ✅ Qarzlar nazorati
- ✅ AI Chat Widget
- ✅ Telegram Bot integratsiyasi
- ✅ PWA qo'llab-quvvatlash
- ✅ Responsive dizayn

## Foydalanish

1. Loyihani clone qiling
2. `npm run install:all` - barcha paketlarni o'rnating
3. Backend va frontend .env fayllarini sozlang
4. `npm run dev` - dasturni ishga tushiring
5. http://localhost:5177 ga o'ting

## Build va Deploy

```bash
# Build
npm run build

# Production start
npm start
```

## Muallif

Mator Life Development Team