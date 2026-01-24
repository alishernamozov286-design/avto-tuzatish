# Zapchastlar Tizimi

## Qo'shilgan Yangi Funksionallik

Ustoz paneliga to'liq funksional zapchastlar (spare parts) boshqaruv tizimi qo'shildi.

## Backend

### Model: `SparePart`
**Fayl:** `backend/src/models/SparePart.ts`

Quyidagi maydonlar:
- `name` - Zapchast nomi (majburiy)
- `partNumber` - Artikul raqami (unique)
- `category` - Kategoriya (majburiy)
- `brand` - Brend
- `description` - Tavsif
- `purchasePrice` - Sotib olish narxi (majburiy)
- `sellingPrice` - Sotish narxi (majburiy)
- `quantity` - Miqdor (majburiy)
- `minQuantity` - Minimal miqdor (default: 5)
- `unit` - O'lchov birligi (majburiy, default: 'dona')
- `supplier` - Yetkazib beruvchi
- `location` - Joylashuv
- `images` - Rasmlar array
- `createdBy` - Kim qo'shgan (User reference)

### Controller: `sparePartController`
**Fayl:** `backend/src/controllers/sparePartController.ts`

API endpoints:
- `POST /api/spare-parts` - Yangi zapchast qo'shish
- `GET /api/spare-parts` - Barcha zapchastlar (filter: category, search, lowStock)
- `GET /api/spare-parts/categories` - Kategoriyalar ro'yxati
- `GET /api/spare-parts/low-stock` - Kam qolgan zapchastlar
- `GET /api/spare-parts/:id` - Bitta zapchast
- `PUT /api/spare-parts/:id` - Zapchastni yangilash
- `DELETE /api/spare-parts/:id` - Zapchastni o'chirish
- `PATCH /api/spare-parts/:id/quantity` - Miqdorni yangilash (add/subtract)

### Routes
**Fayl:** `backend/src/routes/spareParts.ts`

Barcha routelar autentifikatsiya talab qiladi.

## Frontend

### Sahifa: `SpareParts`
**Fayl:** `frontend/src/pages/master/SpareParts.tsx`

Xususiyatlar:
- Zapchastlar ro'yxati (table view)
- Qidirish funksiyasi (nom, artikul, brend bo'yicha)
- Kategoriya bo'yicha filter
- Kam qolgan zapchastlarni ko'rsatish
- Statistika (jami zapchastlar, kam qolganlar, umumiy qiymat)
- CRUD operatsiyalar (Create, Read, Update, Delete)

### Modal Komponentlar

1. **CreateSparePartModal** - Yangi zapchast qo'shish
   - To'liq forma barcha maydonlar bilan
   - Validatsiya
   
2. **EditSparePartModal** - Zapchastni tahrirlash
   - Mavjud ma'lumotlarni ko'rsatish
   - Yangilash funksiyasi

3. **ViewSparePartModal** - Zapchast ma'lumotlarini ko'rish
   - Batafsil ma'lumot
   - Statistika (foyda, jami qiymat)
   - Kam qolgan ogohlantirish

4. **DeleteSparePartModal** - Zapchastni o'chirish
   - Tasdiqlash dialogi
   - Xavfsizlik ogohlantirishi

## Layout va Routing

### Layout
**Fayl:** `frontend/src/components/Layout.tsx`

Ustoz navigatsiyasiga "Zapchastlar" bo'limi qo'shildi:
- Icon: Package
- Route: `/app/master/spare-parts`

### Routing
**Fayl:** `frontend/src/App.tsx`

Yangi route qo'shildi:
```tsx
<Route path="master/spare-parts" element={
  <MasterRoute>
    <MasterSpareParts />
  </MasterRoute>
} />
```

## Xususiyatlar

### Qidirish va Filter
- Real-time qidirish (nom, artikul, brend)
- Kategoriya bo'yicha filter
- Kam qolgan zapchastlarni ko'rsatish

### Statistika
- Jami zapchastlar soni
- Kam qolgan zapchastlar soni
- Umumiy qiymat (so'mda)

### Vizual Ko'rsatkichlar
- Kam qolgan zapchastlar uchun orange rang
- Hover effektlar
- Responsive dizayn
- Loading states

### Hisob-kitoblar
- Foyda (sellingPrice - purchasePrice)
- Foyda foizi
- Jami qiymat (sellingPrice × quantity)

## Foydalanish

1. Ustoz panelga kiring
2. "Zapchastlar" bo'limini tanlang
3. "Yangi zapchast" tugmasini bosing
4. Forma to'ldiring va saqlang
5. Zapchastlarni qidiring, tahrirlang yoki o'chiring

## Texnik Ma'lumotlar

- Backend: Node.js + Express + TypeScript + MongoDB
- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- Icons: Lucide React
- State Management: React Hooks
- API: RESTful

## Xavfsizlik

- Barcha API endpointlar autentifikatsiya talab qiladi
- Faqat master rollari kirish huquqiga ega
- Input validatsiya (frontend va backend)
- Error handling

## Kelajakdagi Yaxshilanishlar

- Rasm yuklash funksiyasi
- Zapchastlar tarixi (history)
- Barcode/QR kod generatsiya
- Excel export/import
- Zapchastlar statistikasi (eng ko'p sotilgan, etc.)
- Avtomatik buyurtma (kam qolganda)
