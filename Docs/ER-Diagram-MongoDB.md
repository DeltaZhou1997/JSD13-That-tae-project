# MongoDB Data Model — Healthy Food & Cooking Kit

เอกสารนี้เป็นแบบจำลองข้อมูล MongoDB ที่แยกจาก ER Diagram แบบ relational เดิม โดยออกแบบให้ข้อมูลที่อ่านพร้อมกันถูกฝังเป็น subdocument และข้อมูล catalog ที่ถูกใช้ร่วมกันถูกอ้างอิงด้วย `ObjectId`

- แผนภาพ MongoDB: [`er-diagram-mongodb.excalidraw`](./er-diagram-mongodb.excalidraw)
- แผนภาพเดิม: [`er-diagram.excalidraw`](./er-diagram.excalidraw)

## หลักการออกแบบ

1. ใช้ `restrictions` เป็น collection กลางเพียงชุดเดียวสำหรับข้อจำกัดการกิน อาการแพ้ และเงื่อนไขสุขภาพ
2. ข้อจำกัดหนึ่งรายการผูกได้ทั้งวัตถุดิบรายตัวและกลุ่มวัตถุดิบ เช่น ถั่วทั้งหมด อาหารทะเล เนื้อหมู หรือผลิตภัณฑ์นม
3. ฝังสูตรและขั้นตอนทำอาหารไว้ใน `dishes` เพราะมี lifecycle เดียวกับเมนูและมักอ่านพร้อมกัน
4. ฝังรายการสินค้าไว้ใน `orders` และใช้ discriminator `itemType` แยก `ala_carte` กับ `package`
5. เก็บ snapshot ของชื่อ ราคา แพ็กเกจ และที่อยู่ ณ เวลาสั่งซื้อ เพื่อไม่ให้ประวัติคำสั่งซื้อเปลี่ยนตาม catalog ภายหลัง
6. ใช้ `Decimal128` สำหรับราคา ปริมาณ และค่าสารอาหารที่ต้องการความแม่นยำมาก

### Notation ในแผนภาพ NoSQL

แผนภาพใช้แนวคิด MongoDB schema diagram ซึ่งต่างจาก ERD แบบ relational ตรงที่ต้องแสดง “ขอบเขตของ document” และตัดสินใจให้ชัดว่าความสัมพันธ์ใดเป็น embedded data หรือ reference:

- `[EMBED 1]` คือ object ที่อยู่ภายใน parent document และมีหนึ่งชุด
- `[EMBED N]` คือ array ของ subdocuments ที่ parent เป็นเจ้าของ
- `[REF]` คือ field `ObjectId` ที่ชี้ไป document ใน collection อื่น
- เส้นระหว่าง collection ใช้เฉพาะ reference พร้อม cardinality `1:1`, `1:N` หรือ `N:N`
- embedded document ไม่ลากเส้นออกมาเป็น entity/table แยก แต่แสดงซ้อนอยู่ในกล่อง collection เดียวกัน
- snapshot เป็น embedded data แม้มี reference ไป catalog ด้วย เพราะ snapshot มีหน้าที่เก็บข้อเท็จจริง ณ เวลาทำรายการ

## ภาพรวม Collections

| Collection | หน้าที่ |
|---|---|
| `users` | บัญชี โปรไฟล์ ที่อยู่ สถานะสมาชิก และข้อจำกัดของผู้ใช้ |
| `restrictions` | นิยามข้อจำกัดอาหาร อาการแพ้ และเงื่อนไขสุขภาพแบบรวมศูนย์ |
| `ingredient_groups` | กลุ่มวัตถุดิบสำหรับ rule เช่น dairy, shellfish, pork |
| `ingredients` | วัตถุดิบ ส่วนประกอบย่อย และค่าสารอาหาร |
| `nutrients` | นิยามสารอาหารและหน่วยมาตรฐาน |
| `dishes` | เมนู สูตร ขั้นตอนทำ และ nutrition cache |
| `packages` | นิยามแพ็กเกจ จำนวนสัปดาห์ จำนวนชุด และกติกาการเลือกเมนู |
| `orders` | คำสั่งซื้อ รายการ a la carte/package ตารางส่ง และ snapshot |
| `reward_transactions` | ledger คะแนนและแสตมป์ |

## 1. `users`

```javascript
{
  _id: ObjectId,
  email: String,
  passwordHash: String,
  profile: { name: String, phone: String, birthDate: Date, gender: String },
  addresses: [{ _id: ObjectId, label: String, address: String, isDefault: Boolean }],
  restrictionAssignments: [{
    restrictionId: ObjectId,
    severity: "avoid" | "warning" | "medical",
    note: String,
    active: Boolean
  }],
  membership: { tier: String, points: Number, stamps: Number },
  createdAt: Date,
  updatedAt: Date
}
```

`restrictionAssignments` เป็นข้อมูลเฉพาะบุคคล จึงฝังใน user ส่วนรายละเอียดกฎที่ใช้ร่วมกันให้อ้างไปยัง `restrictions`

## 2. `restrictions` — รวมข้อจำกัดทั้งหมด

```javascript
{
  _id: ObjectId,
  code: String,
  nameTh: String,
  nameEn: String,
  type: "dietary_restriction" | "allergy" | "health_condition",
  effect: "exclude" | "limit" | "warn",
  ingredientIds: [ObjectId],
  ingredientGroupIds: [ObjectId],
  rule: {
    operator: "contains_any" | "contains_all" | "nutrient_gt" | "nutrient_gte",
    nutrientId: ObjectId,
    threshold: Decimal128,
    unit: String
  },
  description: String,
  isActive: Boolean
}
```

ตัวอย่าง:

- เจ/มังสวิรัติ/วีแกน/ฮาลาล ใช้ `type: dietary_restriction` และชี้ไปยังกลุ่มวัตถุดิบที่ห้าม
- แพ้ถั่วลิสง ใช้ `type: allergy` และชี้ได้ทั้งวัตถุดิบ “ถั่วลิสง” หรือกลุ่ม “nuts”
- โรคไตหรือความดันสูง ใช้ `type: health_condition` และอาจใช้ rule จำกัด sodium/potassium แทนการห้ามวัตถุดิบโดยตรง

ข้อควรระวัง: ข้อมูลทางสุขภาพเป็นข้อมูลอ่อนไหว ควรจำกัดสิทธิ์เข้าถึง เข้ารหัส และมี consent/audit ตามข้อกำหนดที่ใช้กับระบบจริง ผลการตรวจใช้เพื่อเตือนหรือกรอง ไม่ควรแทนคำแนะนำจากแพทย์

## 3. `ingredient_groups`

```javascript
{
  _id: ObjectId,
  code: String,
  nameTh: String,
  nameEn: String,
  ingredientIds: [ObjectId],
  parentGroupId: ObjectId | null
}
```

รองรับกลุ่มซ้อน เช่น `seafood > shellfish` และช่วยไม่ให้ต้องบันทึกวัตถุดิบทุกชนิดซ้ำใน restriction แต่ละรายการ

## 4. `ingredients` และ `nutrients`

```javascript
// ingredients
{
  _id: ObjectId,
  nameTh: String,
  nameEn: String,
  category: String,
  aliases: [String],
  components: [{ ingredientId: ObjectId, ratio: Decimal128 }],
  nutrients: [{
    nutrientId: ObjectId,
    amount: Decimal128,
    unit: String,
    basisWeightG: Decimal128
  }],
  isActive: Boolean
}

// nutrients
{
  _id: ObjectId,
  name: String,
  category: "macro" | "vitamin" | "mineral" | "other",
  defaultUnit: String,
  description: String
}
```

`components` ใช้ตรวจวัตถุดิบผสม เช่น ซอสที่มีถั่วเหลือง โดยระบบต้องไล่ component แบบมี cycle protection

## 5. `dishes`

```javascript
{
  _id: ObjectId,
  nameTh: String,
  nameEn: String,
  type: "cooking_kit" | "ready_to_eat" | "drink" | "dessert",
  description: String,
  recipe: [{ ingredientId: ObjectId, quantity: Decimal128, unit: String }],
  cookingSteps: [{
    no: Number,
    title: String,
    instruction: String,
    subSteps: [{ no: Number, instruction: String }]
  }],
  nutritionCache: [{ nutrientId: ObjectId, amount: Decimal128, unit: String }],
  price: Decimal128,
  imageUrl: String,
  isActive: Boolean
}
```

`nutritionCache` เป็นค่าที่คำนวณซ้ำได้จากสูตร ต้องมีเวลาคำนวณล่าสุดหรือ recipe version หากนำไปใช้จริง

## 6. `orders`: รายการสองชนิด

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  status: "pending" | "paid" | "preparing" | "partially_fulfilled" | "completed" | "cancelled",
  currency: "THB",
  items: [ /* ala_carte หรือ package */ ],
  totals: { subtotal: Decimal128, discount: Decimal128, shipping: Decimal128, grandTotal: Decimal128 },
  paymentSnapshot: { method: String, transactionRef: String, status: String },
  placedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 6.1 A la carte

สินค้า/เมนูหนึ่งชนิดต่อหนึ่ง line item เก็บจำนวน ราคาต่อหน่วย และยอดของบรรทัดนั้น

```javascript
{
  itemType: "ala_carte",
  dishId: ObjectId,
  dishSnapshot: { nameTh: String, sku: String, imageUrl: String },
  quantity: Number,
  unitPrice: Decimal128,
  lineTotal: Decimal128
}
```

เงื่อนไข: `quantity > 0` และ `lineTotal = quantity × unitPrice`

### 6.2 Package item

รายการแพ็กเกจต้องรองรับหลายสัปดาห์ หลายเมนู และหลายรอบจัดส่ง จึงเก็บโครงสร้าง `weeks → selections → deliveries`

```javascript
{
  itemType: "package",
  packageId: ObjectId,
  packageSnapshot: {
    name: String,
    durationWeeks: Number,
    kitsPerWeek: Number,
    deliveriesPerWeek: Number
  },
  weeks: [{
    weekNo: Number,
    startsAt: Date,
    selectionStatus: "open" | "locked",
    selections: [{
      dishId: ObjectId,
      dishSnapshot: { nameTh: String, sku: String },
      quantity: Number
    }],
    deliveries: [{
      deliveryNo: Number,
      scheduledAt: Date,
      addressSnapshot: { recipient: String, phone: String, address: String },
      selectionRefs: [{ dishId: ObjectId, quantity: Number }],
      status: "scheduled" | "packing" | "shipped" | "delivered" | "failed",
      trackingNo: String
    }]
  }],
  packagePrice: Decimal128
}
```

หากจำนวนสัปดาห์/การส่งมีขนาดใหญ่มากจนเสี่ยงชนเพดานเอกสาร MongoDB 16 MB ควรแยก `package_fulfillments` เป็น collection ต่างหาก แต่แพ็กเกจทั่วไปไม่กี่สัปดาห์เหมาะกับการ embed เพราะอ่านสถานะทั้งแพ็กพร้อมกัน

## 7. ขั้นตอนตรวจ restriction

1. อ่าน `restrictionAssignments` ที่ active ของผู้ใช้
2. โหลดนิยามจาก `restrictions`
3. แตกวัตถุดิบของเมนู รวม `ingredients.components` แบบ recursive
4. ตรวจทั้ง `ingredientIds`, `ingredientGroupIds` และ nutrient rule
5. รวมผลตาม `effect` และ `severity` เป็น `block`, `warn` หรือ `limit`
6. แสดงเหตุผลที่ตรวจพบ เช่น “มีถั่วเหลืองผ่านส่วนประกอบของซอส” เพื่อให้ตรวจสอบย้อนกลับได้

การตรวจเดียวนี้ใช้กับทั้ง a la carte และเมนูทุกจานใน package จึงไม่ต้องสร้าง logic ตรวจแพ้/อาหารต้องห้ามแยกกันหลายชุด

## 8. Index ที่แนะนำ

```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.restrictions.createIndex({ code: 1 }, { unique: true })
db.ingredients.createIndex({ nameTh: 1 })
db.ingredient_groups.createIndex({ code: 1 }, { unique: true })
db.dishes.createIndex({ isActive: 1, type: 1 })
db.orders.createIndex({ userId: 1, placedAt: -1 })
db.orders.createIndex({ status: 1, "items.weeks.deliveries.scheduledAt": 1 })
db.reward_transactions.createIndex({ userId: 1, createdAt: -1 })
```

## 9. Validation สำคัญ

- ใช้ MongoDB schema validation บังคับ `itemType` และโครงสร้างของแต่ละชนิดด้วย `oneOf`
- `ala_carte` ต้องไม่มี `weeks`; `package` ต้องมี `packageSnapshot` และ `weeks`
- `weekNo`, `deliveryNo`, `quantity` และราคา ต้องไม่ติดลบ และลำดับต้องไม่ซ้ำใน parent เดียวกัน
- จำนวนเมนูต่อสัปดาห์ต้องไม่เกิน `kitsPerWeek` ตาม snapshot
- หลังพ้น cut-off ให้ล็อก selection หรือบันทึก revision เพื่อไม่ให้ข้อมูล fulfillment เปลี่ยนโดยไร้ประวัติ
- คำสั่งซื้อที่ชำระแล้วต้องแก้ไขผ่าน command/transaction ที่ควบคุม ไม่ควรแก้ array โดยตรงจาก client

## สรุป

แบบ MongoDB นี้ลดความซ้ำซ้อนด้วย `restrictions` collection เดียว รองรับการผูกข้อจำกัดกับวัตถุดิบหรือกลุ่มวัตถุดิบ และทำให้คำสั่งซื้อชัดเจนด้วยรายการสองชนิด: a la carte สำหรับการคำนวณรายชิ้น และ package สำหรับหลายสัปดาห์ หลายจาน และหลายรอบส่ง โดยยังเก็บประวัติทางการค้าอย่างถูกต้องผ่าน snapshot

## 10. `subscriptions` — ประวัติและสถานะสมาชิกแพ็กเกจ

`subscriptions` ไม่ควรถูกยุบเข้ากับ `users` เพราะต้องเก็บประวัติการเปลี่ยนแผน การพัก และการยกเลิก รวมถึงอาจมี billing lifecycle แยกจากบัญชีผู้ใช้

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  packageId: ObjectId,
  packageSnapshot: {
    name: String,
    durationWeeks: Number,
    kitsPerWeek: Number,
    deliveriesPerWeek: Number,
    price: Decimal128
  },
  billingCycle: "weekly" | "monthly" | "annual",
  startDate: Date,
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  endDate: Date | null,
  status: "pending" | "active" | "paused" | "cancelled" | "expired",
  pauseHistory: [{ pausedAt: Date, resumedAt: Date | null, reason: String }],
  nextBillingAt: Date | null,
  createdAt: Date,
  updatedAt: Date
}
```

การสมัครหรือการต่อรอบหนึ่งครั้งสามารถสร้าง `order` ชนิด package ได้ โดย `orders.subscriptionId` ใช้อ้างกลับมายัง subscription ต้นทาง แต่ข้อมูลราคาและเงื่อนไขที่ขายจริงต้องเก็บ snapshot ใน order เสมอ

## 11. `packages` — Catalog ของแพ็กเกจ

```javascript
{
  _id: ObjectId,
  code: String,
  nameTh: String,
  nameEn: String,
  description: String,
  durationWeeks: Number,
  kitsPerWeek: Number,
  deliveriesPerWeek: Number,
  price: Decimal128,
  selectionRules: {
    minSelectionsPerWeek: Number,
    maxSelectionsPerWeek: Number,
    allowDuplicateDish: Boolean,
    cutoffHoursBeforeDelivery: Number
  },
  availableDishIds: [ObjectId],
  isActive: Boolean,
  validFrom: Date,
  validUntil: Date | null,
  createdAt: Date,
  updatedAt: Date
}
```

`packages` เป็นแม่แบบสำหรับขาย ส่วน `orders.items.packageSnapshot` คือหลักฐานว่าในเวลาซื้อลูกค้าได้รับสิทธิ์อะไร จึงห้ามใช้ catalog ปัจจุบันคำนวณ order เก่าย้อนหลัง

## 12. Weekly meal selection และ delivery fulfillment

ตารางเดิม `WEEKLY_MEAL_SELECTION` ถูกยุบเป็น `orders.items[type=package].weeks[].selections[]` เพราะรายการเลือกมีเจ้าของเป็น package item เดียวและมักถูกอ่านพร้อมรายละเอียดคำสั่งซื้อ

| ข้อมูลเดิม | ตำแหน่งใหม่ |
|---|---|
| `subscription_id` | `orders.subscriptionId` |
| `week_start_date` | `items.weeks.startsAt` |
| `dish_id` | `items.weeks.selections.dishId` |
| `quantity` | `items.weeks.selections.quantity` |
| รอบจัดส่ง | `items.weeks.deliveries[]` |
| ที่อยู่ตอนส่ง | `deliveries.addressSnapshot` |
| Tracking | `deliveries.trackingNo` |

แต่ละ delivery มี `selectionRefs` เพื่อบอกว่ารอบนั้นส่งจานใดจำนวนเท่าไร จึงรองรับทั้งกรณีส่งทุกเมนูพร้อมกันและแบ่งส่งหลายครั้งในสัปดาห์เดียว

หาก fulfillment โตจนมีการแก้สถานะถี่มาก มี event จำนวนมาก หรือต้องให้ทีมคลังสินค้า query แยกจาก order เป็นหลัก ให้แยกเป็น collection ดังนี้:

```javascript
{
  // package_fulfillments (ทางเลือกเมื่อระบบโต)
  _id: ObjectId,
  orderId: ObjectId,
  orderItemId: ObjectId,
  weekNo: Number,
  deliveryNo: Number,
  scheduledAt: Date,
  items: [{ dishId: ObjectId, dishSnapshot: Object, quantity: Number }],
  addressSnapshot: Object,
  status: String,
  trackingNo: String,
  statusHistory: [{ status: String, at: Date, note: String }]
}
```

## 13. `reward_transactions` — Stamp และ Point ledger

แทน `STAMP_TRANSACTION` เดิมและรองรับทั้ง stamp กับ point โดยไม่ต้องสร้าง ledger ซ้ำ

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  orderId: ObjectId | null,
  type: "earn" | "redeem" | "adjust" | "expire",
  pointsDelta: Number,
  stampsDelta: Number,
  reason: String,
  idempotencyKey: String,
  expiresAt: Date | null,
  createdAt: Date,
  createdBy: ObjectId | "system"
}
```

ยอดใน `users.membership` เป็น cache สำหรับแสดงผลเร็ว ส่วนยอดที่ตรวจสอบบัญชีได้ต้องคำนวณจาก ledger การอัปเดต ledger และ cache ควรอยู่ใน transaction เดียวกัน และ `idempotencyKey` ต้อง unique เพื่อป้องกันให้รางวัลซ้ำ

## 14. Payment และสถานะคำสั่งซื้อ

สำหรับระบบเริ่มต้นสามารถเก็บ `paymentSnapshot` ใน order ได้ หากหนึ่ง order มีการชำระหลายครั้ง คืนเงินบางส่วน หรือรับ webhook หลาย event ควรแยก `payment_transactions`

```javascript
{
  _id: ObjectId,
  orderId: ObjectId,
  provider: String,
  providerReference: String,
  type: "charge" | "refund" | "void",
  amount: Decimal128,
  currency: String,
  status: "pending" | "succeeded" | "failed",
  createdAt: Date,
  updatedAt: Date
}
```

สถานะการชำระเงินและสถานะ fulfillment เป็นคนละ state machine ไม่ควรใช้ field เดียวกัน เช่น order อาจ `paid` แต่ delivery ยัง `scheduled`

## 15. Mapping จากโมเดลเดิมให้ครบ

| ตารางเดิม | MongoDB ใหม่ | วิธีจัดเก็บ |
|---|---|---|
| `USER` | `users` | collection หลัก |
| `HEALTH_PROFILE` | `users.profile` + `restrictionAssignments` | embed ข้อมูลส่วนตัวและ reference กฎกลาง |
| `USER_ALLERGY` | `users.restrictionAssignments` + `restrictions` | รวมกับข้อจำกัดชนิดอื่น |
| `SUBSCRIPTION` | `subscriptions` | collection แยกเพื่อเก็บ lifecycle |
| `STAMP_TRANSACTION` | `reward_transactions` | ledger รวม stamp/point |
| `DISH` | `dishes` | collection หลัก |
| `INGREDIENT` | `ingredients` | collection หลัก |
| `NUTRIENT` | `nutrients` | collection lookup |
| `INGREDIENT_NUTRIENT` | `ingredients.nutrients[]` | embed เพราะอ่านพร้อมวัตถุดิบ |
| `RECIPE_INGREDIENT` | `dishes.recipe[]` | embed เพราะเป็นส่วนของสูตร |
| `COOKING_STEP` | `dishes.cookingSteps[]` | embed และรักษาลำดับด้วย `no` |
| `COOKING_SUB_STEP` | `dishes.cookingSteps[].subSteps[]` | embed ซ้อนในขั้นตอนหลัก |
| `ORDER` | `orders` | collection หลัก |
| `ORDER_ITEM` | `orders.items[]` | discriminated subdocument สองชนิด |
| `WEEKLY_MEAL_SELECTION` | `orders.items.weeks.selections[]` | embed ใน package item |
| `SUBSCRIPTION_PLAN` (อนาคต) | `packages` | ทำเป็น catalog จริงในโมเดลใหม่ |
| `ADDRESS` (อนาคต) | `users.addresses[]` | embed; order/delivery เก็บ snapshot |
| `PAYMENT_TRANSACTION` (อนาคต) | `payment_transactions` | แยกเมื่อรองรับหลายธุรกรรม |
| `DELIVERY` (อนาคต) | `items.weeks.deliveries[]` | embed หรือแยก fulfillment เมื่อโต |
| `NUTRIENT_SOURCE` (อนาคต) | `ingredients.nutrients[].source` | embed citation/source ต่อค่า |
| `RECIPE_VERSION` (อนาคต) | `dishes.version` + archive/event | เพิ่ม version และเก็บ revision เมื่อจำเป็น |

## 16. ความสัมพันธ์และ cardinality

| ต้นทาง | ปลายทาง | ความสัมพันธ์ |
|---|---|---|
| `users` | `restrictions` | ผู้ใช้หนึ่งคนอ้างข้อจำกัดได้หลายรายการ และกฎหนึ่งรายการใช้กับหลายคน |
| `restrictions` | `ingredient_groups` | กฎหนึ่งรายการกำหนดกลุ่มที่ห้าม/จำกัดได้หลายกลุ่ม |
| `restrictions` | `ingredients` | กฎผูกวัตถุดิบเฉพาะรายตัวได้หลายตัว |
| `ingredient_groups` | `ingredients` | กลุ่มมีวัตถุดิบหลายตัว; วัตถุดิบอาจอยู่หลายกลุ่ม |
| `ingredients` | `nutrients` | วัตถุดิบฝังค่าสารอาหารหลายค่าและอ้างนิยามสารอาหาร |
| `dishes` | `ingredients` | เมนูฝัง recipe lines หลายรายการและอ้างวัตถุดิบ |
| `dishes` | `nutrients` | nutrition cache อ้างนิยามสารอาหาร |
| `users` | `subscriptions` | ผู้ใช้มีประวัติ subscription หลายรายการ |
| `subscriptions` | `packages` | subscription อ้าง package catalog และเก็บ snapshot |
| `users` | `orders` | ผู้ใช้มี order หลายรายการ |
| `orders` | `dishes` | a la carte และ selections อ้างเมนู พร้อม snapshot |
| `orders` | `packages` | package item อ้าง catalog พร้อม snapshot |
| `orders` | `reward_transactions` | order หนึ่งรายการก่อ ledger ได้หลาย event |

## 17. การคำนวณสารอาหาร

ค่าสารอาหารต่อ recipe line:

```text
line nutrient = ingredient nutrient amount × (used weight g / basis weight g)
```

ค่าสารอาหารรวมต่อ serving:

```text
nutrient per serving = SUM(line nutrient) / recipe servings
```

- ต้องแปลงหน่วย recipe เป็นกรัมก่อนคำนวณ หากใช้ช้อน ถ้วย หรือชิ้น ควรมี conversion ที่จำเพาะต่อวัตถุดิบ
- ค่า `null` หมายถึงไม่มีข้อมูล ห้ามตีความเป็นศูนย์
- เมื่อสูตร ปริมาณ ส่วนประกอบย่อย หรือข้อมูลสารอาหารเปลี่ยน ต้อง invalidate `nutritionCache`
- การคำนวณจากวัตถุดิบผสมต้องระวังการนับซ้ำและวงวนของ `components`

## 18. Access patterns ที่โมเดลรองรับ

1. หน้าเมนู: อ่าน `dishes` document เดียวเพื่อได้คำอธิบาย สูตร ขั้นตอน และ cache สารอาหาร
2. ตรวจข้อจำกัด: โหลด restriction ของ user แล้วเทียบ ingredient closure ของเมนู
3. ตะกร้า a la carte: คำนวณแต่ละ line จาก quantity และ unit price
4. หน้าจัดแพ็กเกจ: อ่าน weeks, selections และ deliveries จาก package item เดียว
5. ประวัติคำสั่งซื้อ: ใช้ snapshot แสดงผลโดยไม่ขึ้นกับ catalog ปัจจุบัน
6. งานจัดส่งประจำวัน: query multikey index ของ `items.weeks.deliveries.scheduledAt` หรือ `package_fulfillments` เมื่อระบบโต
7. คะแนนสมาชิก: แสดง cache จาก user และใช้ ledger สำหรับ audit/reconciliation

## 19. ข้อกำหนดเพิ่มเติมสำหรับ Production

- ทุก collection หลักมี `createdAt`, `updatedAt` และ `isActive` หรือสถานะที่เหมาะสม
- ใช้ soft delete กับ catalog ที่เคยถูกสั่งซื้อ และห้ามลบ reference ที่ยังจำเป็นต่อการคำนวณ
- unique index: `users.email`, `restrictions.code`, `ingredient_groups.code`, `packages.code`, `reward_transactions.idempotencyKey`
- ใช้ optimistic concurrency เช่น `version` กับ order/package selection เพื่อป้องกันการแก้ array ทับกัน
- transaction ครอบคลุมการยืนยัน order, payment state, inventory reservation และ reward เมื่อจำเป็น
- จำกัดการอ่านข้อมูลสุขภาพและบันทึก audit log โดยแยกสิทธิ์จากข้อมูล profile ทั่วไป
- เก็บ timezone ของรอบส่งหรือแปลงเวลาเป็น UTC พร้อม timezone ของพื้นที่จัดส่ง เพื่อคำนวณ cut-off ให้ถูกต้อง
- ตรวจ document size และ array growth โดยเฉพาะ order package ระยะยาว
