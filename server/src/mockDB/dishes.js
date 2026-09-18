// Mock dishes แบบ key-value โดยใช้ _id เป็น key
// สร้างจากฐานข้อมูลสูตรอาหาร วัตถุดิบแยกย่อย สารอาหารต่อ 100g และธาตุเจ้าเรือน (ER Diagram Spec)

const dishes = {
  dish_001: {
    _id: "dish_001",
    nameTh: "น้ำพริกอ่อง",
    nameEn: "Northern Thai Tomato Chili Dip",
    region: "northern",
    regionNameTh: "ภาคเหนือ",
    type: "cooking_kit",
    dishType: "dip",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","น้ำ","ลม"],
    description: "น้ำพริกมะเขือเทศเคี่ยวกับหมูสับจนเข้มข้น รสเปรี้ยวหวานอมเผ็ด หอมเครื่องแกงแบบล้านนา กินคู่ผักสดกรอบและแคบหมูได้อย่างลงตัว",
    history: "อาหารพื้นเมืองล้านนาที่ใช้มะเขือเทศและหมูสับเป็นตัวชูรส",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/northern/ID001_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_021",
            "nameTh": "หมูสดบด",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 330,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 16,
                  "fat": 30,
                  "sodium": 50
            }
      },
      {
            "ingredientId": "ing_052",
            "nameTh": "มะเขือเทศเชอร์รี่",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 80,
            "unit": "g",
            "medicinalTaste": "รสเปรี้ยว",
            "elements": [
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 18,
                  "carbs": 3.9,
                  "sugar": 2.6,
                  "fiber": 1.2,
                  "protein": 0.9,
                  "fat": 0.2,
                  "sodium": 5
            }
      },
      {
            "ingredientId": "ing_053",
            "nameTh": "กระเทียมสด",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 149,
                  "carbs": 33,
                  "sugar": 1,
                  "fiber": 2.1,
                  "protein": 6.4,
                  "fat": 0.5,
                  "sodium": 17
            }
      },
      {
            "ingredientId": "ing_055",
            "nameTh": "หอมแดง (สด / เจียว / ซอย)",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 72,
                  "carbs": 16.8,
                  "sugar": 7.9,
                  "fiber": 3.2,
                  "protein": 2.5,
                  "fat": 0.1,
                  "sodium": 12
            }
      },
      {
            "ingredientId": "ing_056",
            "nameTh": "ผักชี",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 23,
                  "carbs": 3.7,
                  "sugar": 0.9,
                  "fiber": 2.8,
                  "protein": 2.1,
                  "fat": 0.5,
                  "sodium": 46
            }
      },
      {
            "ingredientId": "ing_057",
            "nameTh": "ต้นหอม",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 32,
                  "carbs": 7.3,
                  "sugar": 2.3,
                  "fiber": 2.6,
                  "protein": 1.8,
                  "fat": 0.2,
                  "sodium": 16
            }
      },
      {
            "ingredientId": "ing_145",
            "nameTh": "พริกแห้งเม็ดใหญ่",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 300,
                  "carbs": 50,
                  "sugar": 7,
                  "fiber": 28,
                  "protein": 12,
                  "fat": 8,
                  "sodium": 30
            }
      },
      {
            "ingredientId": "ing_041",
            "nameTh": "กะปิ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 25,
            "unit": "g",
            "medicinalTaste": "รสเค็ม / มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 100,
                  "carbs": 3,
                  "sugar": 0.5,
                  "fiber": 0,
                  "protein": 15,
                  "fat": 2,
                  "sodium": 8000
            }
      },
      {
            "ingredientId": "ing_044",
            "nameTh": "เกลือ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 5,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 38758
            }
      },
      {
            "ingredientId": "ing_083",
            "nameTh": "น้ำตาลทราย",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 387,
                  "carbs": 100,
                  "sugar": 100,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 1
            }
      },
      {
            "ingredientId": "ing_040",
            "nameTh": "น้ำมันพืช",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "ml",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 884,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 100,
                  "sodium": 0
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 1045,
            "carbs": 50.7,
            "sugar": 23.1,
            "fiber": 9.4,
            "protein": 43.4,
            "fat": 77.4,
            "sodium": 4083
      },
      "perServing": {
            "calories": 523,
            "carbs": 25.3,
            "sugar": 11.5,
            "fiber": 4.7,
            "protein": 21.7,
            "fat": 38.7,
            "sodium": 2041
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.095Z",
  },
  dish_002: {
    _id: "dish_002",
    nameTh: "ข้าวซอยไก่",
    nameEn: "Northern Thai Chicken Khao Soi",
    region: "northern",
    regionNameTh: "ภาคเหนือ",
    type: "cooking_kit",
    dishType: "noodle",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","น้ำ","ลม"],
    description: "บะหมี่เหนียวนุ่มในน้ำแกงกะทิสีทองเข้มข้น หอมเครื่องเทศและพริกแกง เสิร์ฟพร้อมน่องไก่นุ่ม เส้นกรอบ และเครื่องเคียงตัดรส",
    history: "เมนูเส้นล้านนาที่สะท้อนอิทธิพลการค้าระหว่างจีนฮ่อและพม่า",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/northern/ID002_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1562607635-4608ff48a859?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_051",
            "nameTh": "เนื้อไก่ (สับ/น่อง)",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 215,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 18.5,
                  "fat": 15,
                  "sodium": 85
            }
      },
      {
            "ingredientId": "ing_071",
            "nameTh": "ผงขมิ้น",
            "category": "other",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 20,
            "unit": "g",
            "medicinalTaste": "รสฝาด เผ็ดร้อน",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 312,
                  "carbs": 65,
                  "sugar": 3,
                  "fiber": 21,
                  "protein": 8,
                  "fat": 3,
                  "sodium": 38
            }
      },
      {
            "ingredientId": "ing_073",
            "nameTh": "ผงกะหรี่",
            "category": "other",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 20,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 325,
                  "carbs": 55,
                  "sugar": 2.5,
                  "fiber": 33,
                  "protein": 14,
                  "fat": 14,
                  "sodium": 50
            }
      },
      {
            "ingredientId": "ing_074",
            "nameTh": "ลูกผักชี",
            "category": "other",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 20,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 298,
                  "carbs": 55,
                  "sugar": 0,
                  "fiber": 42,
                  "protein": 12,
                  "fat": 18,
                  "sodium": 35
            }
      },
      {
            "ingredientId": "ing_086",
            "nameTh": "มะนาวสด",
            "category": "seasoning",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเปรี้ยว",
            "elements": [
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 25,
                  "carbs": 8.4,
                  "sugar": 1.7,
                  "fiber": 0.4,
                  "protein": 0.4,
                  "fat": 0.1,
                  "sodium": 2
            }
      },
      {
            "ingredientId": "ing_055",
            "nameTh": "หอมแดง (สด / เจียว / ซอย)",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 72,
                  "carbs": 16.8,
                  "sugar": 7.9,
                  "fiber": 3.2,
                  "protein": 2.5,
                  "fat": 0.1,
                  "sodium": 12
            }
      },
      {
            "ingredientId": "ing_056",
            "nameTh": "ผักชี",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 23,
                  "carbs": 3.7,
                  "sugar": 0.9,
                  "fiber": 2.8,
                  "protein": 2.1,
                  "fat": 0.5,
                  "sodium": 46
            }
      },
      {
            "ingredientId": "ing_057",
            "nameTh": "ต้นหอม",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 32,
                  "carbs": 7.3,
                  "sugar": 2.3,
                  "fiber": 2.6,
                  "protein": 1.8,
                  "fat": 0.2,
                  "sodium": 16
            }
      },
      {
            "ingredientId": "ing_065",
            "nameTh": "พริกแห้ง / พริกขี้หนูแห้งทอด",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 300,
                  "carbs": 50,
                  "sugar": 7,
                  "fiber": 28,
                  "protein": 12,
                  "fat": 8,
                  "sodium": 30
            }
      },
      {
            "ingredientId": "ing_069",
            "nameTh": "พริกแกงเผ็ด",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 10,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 120,
                  "carbs": 18,
                  "sugar": 4,
                  "fiber": 6,
                  "protein": 3,
                  "fat": 4,
                  "sodium": 1500
            }
      },
      {
            "ingredientId": "ing_070",
            "nameTh": "พริกป่น",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 10,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 282,
                  "carbs": 50,
                  "sugar": 7,
                  "fiber": 27,
                  "protein": 13,
                  "fat": 14,
                  "sodium": 35
            }
      },
      {
            "ingredientId": "ing_044",
            "nameTh": "เกลือ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 5,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 38758
            }
      },
      {
            "ingredientId": "ing_042",
            "nameTh": "น้ำปลา",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 35,
                  "carbs": 3.6,
                  "sugar": 3.6,
                  "fiber": 0,
                  "protein": 5.1,
                  "fat": 0,
                  "sodium": 7800
            }
      },
      {
            "ingredientId": "ing_080",
            "nameTh": "ซีอิ๊วขาว",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 60,
                  "carbs": 8,
                  "sugar": 4,
                  "fiber": 0,
                  "protein": 7,
                  "fat": 0,
                  "sodium": 5600
            }
      },
      {
            "ingredientId": "ing_088",
            "nameTh": "ผักกาดดอง",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเค็ม /เปรี้ยว",
            "elements": [
                  "ดิน",
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 20,
                  "carbs": 3.5,
                  "sugar": 1,
                  "fiber": 2,
                  "protein": 1.2,
                  "fat": 0.2,
                  "sodium": 1200
            }
      },
      {
            "ingredientId": "ing_040",
            "nameTh": "น้ำมันพืช",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "ml",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 884,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 100,
                  "sodium": 0
            }
      },
      {
            "ingredientId": "ing_085",
            "nameTh": "กะทิ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 200,
            "unit": "ml",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 230,
                  "carbs": 5.5,
                  "sugar": 3.3,
                  "fiber": 2.2,
                  "protein": 2.3,
                  "fat": 24,
                  "sodium": 15
            }
      },
      {
            "ingredientId": "ing_015",
            "nameTh": "น้ำตาลมะพร้าว",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 380,
                  "carbs": 95,
                  "sugar": 85,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 125
            }
      },
      {
            "ingredientId": "ing_089",
            "nameTh": "เส้นบะหมี่ (ต้ม & ทอด)",
            "category": "carb",
            "categoryTh": "แป้ง & เส้น",
            "quantity": 150,
            "unit": "g",
            "medicinalTaste": "รสหวาน / มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 280,
                  "carbs": 45,
                  "sugar": 1.5,
                  "fiber": 2,
                  "protein": 8,
                  "fat": 8,
                  "sodium": 180
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 1845,
            "carbs": 156.9,
            "sugar": 31,
            "fiber": 37.9,
            "protein": 68.7,
            "fat": 115.4,
            "sodium": 5219
      },
      "perServing": {
            "calories": 923,
            "carbs": 78.4,
            "sugar": 15.5,
            "fiber": 19,
            "protein": 34.3,
            "fat": 57.7,
            "sodium": 2610
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.107Z",
  },
  dish_003: {
    _id: "dish_003",
    nameTh: "ลาบคั่วเมือง",
    nameEn: "Northern Spiced Larb",
    region: "northern",
    regionNameTh: "ภาคเหนือ",
    type: "cooking_kit",
    dishType: "salad",
    dominantElement: "ลม",
    elementSuitability: ["ดิน","น้ำ","ลม"],
    description: "ลาบสุกแบบเมืองเหนือคลุกพริกลาบและเครื่องเทศคั่ว หอมมะแขว่นโดดเด่น รสเค็มเผ็ดซับซ้อน พร้อมกลิ่นสมุนไพรสดในทุกคำ",
    history: "ลาบเหนือแตกต่างจากลาบอีสานด้วยพริกลาบและการคั่วจนหอม",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/northern/ID003_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_021",
            "nameTh": "เนื้อหมูสันใน",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 330,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 16,
                  "fat": 30,
                  "sodium": 50
            }
      },
      {
            "ingredientId": "ing_021",
            "nameTh": "เครื่องในหมู",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 330,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 16,
                  "fat": 30,
                  "sodium": 50
            }
      },
      {
            "ingredientId": "ing_050",
            "nameTh": "เลือดหมู",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสเค็ม / มัน",
            "elements": [
                  "ดิน",
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 55,
                  "carbs": 0.2,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 10.6,
                  "fat": 1.2,
                  "sodium": 120
            }
      },
      {
            "ingredientId": "ing_061",
            "nameTh": "ผักไผ่ (ผักแพว)",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 35,
                  "carbs": 6,
                  "sugar": 1,
                  "fiber": 3,
                  "protein": 2.5,
                  "fat": 0.6,
                  "sodium": 15
            }
      },
      {
            "ingredientId": "ing_030",
            "nameTh": "กระเทียมเจียว",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน (จะดรอปลงมาเหลืออุ่น)",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 149,
                  "carbs": 33,
                  "sugar": 1,
                  "fiber": 2.1,
                  "protein": 6.4,
                  "fat": 0.5,
                  "sodium": 17
            }
      },
      {
            "ingredientId": "ing_066",
            "nameTh": "ดีปลี",
            "category": "herb_spice",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 10,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 280,
                  "carbs": 55,
                  "sugar": 2,
                  "fiber": 20,
                  "protein": 10,
                  "fat": 3,
                  "sodium": 20
            }
      },
      {
            "ingredientId": "ing_067",
            "nameTh": "มะแขว่น",
            "category": "herb_spice",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 10,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 260,
                  "carbs": 50,
                  "sugar": 2,
                  "fiber": 18,
                  "protein": 9,
                  "fat": 4,
                  "sodium": 15
            }
      },
      {
            "ingredientId": "ing_068",
            "nameTh": "กำจัด",
            "category": "herb_spice",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 10,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 260,
                  "carbs": 50,
                  "sugar": 2,
                  "fiber": 18,
                  "protein": 9,
                  "fat": 4,
                  "sodium": 15
            }
      },
      {
            "ingredientId": "ing_065",
            "nameTh": "พริกขี้หนูแห้งทอด",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 300,
                  "carbs": 50,
                  "sugar": 7,
                  "fiber": 28,
                  "protein": 12,
                  "fat": 8,
                  "sodium": 30
            }
      },
      {
            "ingredientId": "ing_145",
            "nameTh": "พริกแห้งทอด",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 300,
                  "carbs": 50,
                  "sugar": 7,
                  "fiber": 28,
                  "protein": 12,
                  "fat": 8,
                  "sodium": 30
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 1674,
            "carbs": 46.5,
            "sugar": 3.5,
            "fiber": 16,
            "protein": 95.2,
            "fat": 126.3,
            "sodium": 467
      },
      "perServing": {
            "calories": 837,
            "carbs": 23.3,
            "sugar": 1.8,
            "fiber": 8,
            "protein": 47.6,
            "fat": 63.2,
            "sodium": 233
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.113Z",
  },
  dish_004: {
    _id: "dish_004",
    nameTh: "แกงฮังเล",
    nameEn: "Northern Hang Lay Curry",
    region: "northern",
    regionNameTh: "ภาคเหนือ",
    type: "cooking_kit",
    dishType: "curry",
    dominantElement: "ลม",
    elementSuitability: ["ดิน","น้ำ","ลม","ไฟ"],
    description: "หมูเนื้อนุ่มเคี่ยวช้าในน้ำแกงเข้มข้นจนเครื่องซึมเข้าเนื้อ รสเค็ม เปรี้ยว และหวานกลมกล่อม หอมขิง กระเทียม และเครื่องเทศแบบล้านนา",
    history: "อาหารล้านนาที่ได้รับอิทธิพลจากพม่าและนิยมทำในงานบุญ",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/northern/ID004_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1603099541178-958866380649?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_021",
            "nameTh": "หมูสันนอก",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 330,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 16,
                  "fat": 30,
                  "sodium": 50
            }
      },
      {
            "ingredientId": "ing_021",
            "nameTh": "หมูสามชั้น",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 330,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 16,
                  "fat": 30,
                  "sodium": 50
            }
      },
      {
            "ingredientId": "ing_058",
            "nameTh": "ขิงอ่อน",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน /หวาน /ขม",
            "elements": [
                  "ดิน",
                  "น้ำ",
                  "ลม",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 80,
                  "carbs": 17.8,
                  "sugar": 1.7,
                  "fiber": 2,
                  "protein": 1.8,
                  "fat": 0.8,
                  "sodium": 13
            }
      },
      {
            "ingredientId": "ing_053",
            "nameTh": "กระเทียมสด",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 149,
                  "carbs": 33,
                  "sugar": 1,
                  "fiber": 2.1,
                  "protein": 6.4,
                  "fat": 0.5,
                  "sodium": 17
            }
      },
      {
            "ingredientId": "ing_055",
            "nameTh": "หอมแดง (สด / เจียว / ซอย)",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 72,
                  "carbs": 16.8,
                  "sugar": 7.9,
                  "fiber": 3.2,
                  "protein": 2.5,
                  "fat": 0.1,
                  "sodium": 12
            }
      },
      {
            "ingredientId": "ing_026",
            "nameTh": "ข่า",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน / ขม",
            "elements": [
                  "ลม",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 71,
                  "carbs": 15,
                  "sugar": 0,
                  "fiber": 2,
                  "protein": 1,
                  "fat": 1,
                  "sodium": 15
            }
      },
      {
            "ingredientId": "ing_027",
            "nameTh": "ตะไคร้",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 99,
                  "carbs": 25,
                  "sugar": 0,
                  "fiber": 4,
                  "protein": 1.8,
                  "fat": 0.5,
                  "sodium": 6
            }
      },
      {
            "ingredientId": "ing_072",
            "nameTh": "ผงฮังเล",
            "category": "other",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 20,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน / หอมเย็น",
            "elements": [
                  "ลม",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 290,
                  "carbs": 58,
                  "sugar": 4,
                  "fiber": 18,
                  "protein": 7.5,
                  "fat": 5,
                  "sodium": 120
            }
      },
      {
            "ingredientId": "ing_073",
            "nameTh": "ผงกะหรี่",
            "category": "other",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 20,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 325,
                  "carbs": 55,
                  "sugar": 2.5,
                  "fiber": 33,
                  "protein": 14,
                  "fat": 14,
                  "sodium": 50
            }
      },
      {
            "ingredientId": "ing_048",
            "nameTh": "น้ำมะขามเปียก",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเปรี้ยว",
            "elements": [
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 120,
                  "carbs": 30,
                  "sugar": 20,
                  "fiber": 2.5,
                  "protein": 1.2,
                  "fat": 0.2,
                  "sodium": 25
            }
      },
      {
            "ingredientId": "ing_043",
            "nameTh": "ซีอิ๊วดำ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 180,
                  "carbs": 40,
                  "sugar": 35,
                  "fiber": 0,
                  "protein": 4,
                  "fat": 0,
                  "sodium": 4500
            }
      },
      {
            "ingredientId": "ing_041",
            "nameTh": "กะปิ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 25,
            "unit": "g",
            "medicinalTaste": "รสเค็ม / มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 100,
                  "carbs": 3,
                  "sugar": 0.5,
                  "fiber": 0,
                  "protein": 15,
                  "fat": 2,
                  "sodium": 8000
            }
      },
      {
            "ingredientId": "ing_044",
            "nameTh": "เกลือ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 5,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 38758
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 1707,
            "carbs": 78.4,
            "sugar": 14.9,
            "fiber": 16,
            "protein": 78.3,
            "fat": 125.5,
            "sodium": 4877
      },
      "perServing": {
            "calories": 854,
            "carbs": 39.2,
            "sugar": 7.5,
            "fiber": 8,
            "protein": 39.1,
            "fat": 62.8,
            "sodium": 2439
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.124Z",
  },
  dish_005: {
    _id: "dish_005",
    nameTh: "แกงขนุน",
    nameEn: "Young Jackfruit Curry",
    region: "northern",
    regionNameTh: "ภาคเหนือ",
    type: "cooking_kit",
    dishType: "curry",
    dominantElement: "ลม",
    elementSuitability: ["ดิน","น้ำ","ลม"],
    description: "ขนุนอ่อนต้มจนนุ่มแล้วแกงกับพริกแกงพื้นเมือง รสเผ็ดเค็มกำลังดี หอมชะอม ใบชะพลู และสมุนไพรที่ให้รสบ้าน ๆ อบอุ่น",
    history: "เมนูมงคลของชาวเหนือ เชื่อว่าชื่อขนุนช่วยหนุนนำสิ่งดี",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/northern/ID005_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_021",
            "nameTh": "ซี่โครงหมูสับ",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 330,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 16,
                  "fat": 30,
                  "sodium": 50
            }
      },
      {
            "ingredientId": "ing_062",
            "nameTh": "ขนุนอ่อน",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสฝาด /มัน",
            "elements": [
                  "ดิน",
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 9,
                  "sugar": 1.5,
                  "fiber": 3.6,
                  "protein": 1.2,
                  "fat": 0.3,
                  "sodium": 10
            }
      },
      {
            "ingredientId": "ing_052",
            "nameTh": "มะเขือเทศลูกเล็ก",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 80,
            "unit": "g",
            "medicinalTaste": "รสเปรี้ยว",
            "elements": [
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 18,
                  "carbs": 3.9,
                  "sugar": 2.6,
                  "fiber": 1.2,
                  "protein": 0.9,
                  "fat": 0.2,
                  "sodium": 5
            }
      },
      {
            "ingredientId": "ing_063",
            "nameTh": "ชะอม",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 93,
                  "carbs": 5,
                  "sugar": 1,
                  "fiber": 5.7,
                  "protein": 9.5,
                  "fat": 3,
                  "sodium": 20
            }
      },
      {
            "ingredientId": "ing_064",
            "nameTh": "ชะพลู",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน /หอมเย็น",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 41,
                  "carbs": 5.5,
                  "sugar": 0.5,
                  "fiber": 4.4,
                  "protein": 3.9,
                  "fat": 0.4,
                  "sodium": 18
            }
      },
      {
            "ingredientId": "ing_053",
            "nameTh": "กระเทียมสด",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 149,
                  "carbs": 33,
                  "sugar": 1,
                  "fiber": 2.1,
                  "protein": 6.4,
                  "fat": 0.5,
                  "sodium": 17
            }
      },
      {
            "ingredientId": "ing_055",
            "nameTh": "หอมแดง (สด / เจียว / ซอย)",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 72,
                  "carbs": 16.8,
                  "sugar": 7.9,
                  "fiber": 3.2,
                  "protein": 2.5,
                  "fat": 0.1,
                  "sodium": 12
            }
      },
      {
            "ingredientId": "ing_145",
            "nameTh": "พริกแห้ง",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 300,
                  "carbs": 50,
                  "sugar": 7,
                  "fiber": 28,
                  "protein": 12,
                  "fat": 8,
                  "sodium": 30
            }
      },
      {
            "ingredientId": "ing_041",
            "nameTh": "กะปิ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 25,
            "unit": "g",
            "medicinalTaste": "รสเค็ม / มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 100,
                  "carbs": 3,
                  "sugar": 0.5,
                  "fiber": 0,
                  "protein": 15,
                  "fat": 2,
                  "sodium": 8000
            }
      },
      {
            "ingredientId": "ing_044",
            "nameTh": "เกลือ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 5,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 38758
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 902,
            "carbs": 39.1,
            "sugar": 8,
            "fiber": 12.8,
            "protein": 47.7,
            "fat": 63.6,
            "sodium": 4077
      },
      "perServing": {
            "calories": 451,
            "carbs": 19.5,
            "sugar": 4,
            "fiber": 6.4,
            "protein": 23.8,
            "fat": 31.8,
            "sodium": 2039
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.138Z",
  },
  dish_006: {
    _id: "dish_006",
    nameTh: "ข้าวแต๋น",
    nameEn: "Northern Crispy Rice Cracker",
    region: "northern",
    regionNameTh: "ภาคเหนือ",
    type: "dessert",
    dishType: "dessert",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","ไฟ"],
    description: "ข้าวเหนียวนึ่งตากแห้งทอดจนพองกรอบ ราดน้ำอ้อยหอมหวานเป็นเส้นบาง ๆ เนื้อสัมผัสเบา กรอบเพลิน เหมาะกับชาและกาแฟ",
    history: "ภูมิปัญญาถนอมข้าวเหนียวนึ่งที่เหลือของชุมชนภาคเหนือ",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "พร้อมรับประทาน แนะนำให้เสิร์ฟเย็น",
    imageUrl: [
      new URL("./assets/northern/ID006_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1562607635-4608ff48a859?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 129,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_011",
            "nameTh": "ข้าวเหนียว / ข้าวเหนียวเขี้ยวงู",
            "category": "carb",
            "categoryTh": "แป้ง",
            "quantity": 150,
            "unit": "g",
            "medicinalTaste": "รสหวาน/มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 340,
                  "carbs": 78,
                  "sugar": 0.1,
                  "fiber": 1,
                  "protein": 6.5,
                  "fat": 0.6,
                  "sodium": 5
            }
      },
      {
            "ingredientId": "ing_005",
            "nameTh": "น้ำแตงโมคั้น",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสหวาน/จืด",
            "elements": [
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 30,
                  "carbs": 7.5,
                  "sugar": 6.2,
                  "fiber": 0.2,
                  "protein": 0.6,
                  "fat": 0.15,
                  "sodium": 1
            }
      },
      {
            "ingredientId": "ing_012",
            "nameTh": "งาดำคั่ว",
            "category": "other",
            "categoryTh": "ถั่ว & เมล็ดพืช",
            "quantity": 20,
            "unit": "g",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 565,
                  "carbs": 23,
                  "sugar": 0.3,
                  "fiber": 12,
                  "protein": 17,
                  "fat": 48,
                  "sodium": 11
            }
      },
      {
            "ingredientId": "ing_015",
            "nameTh": "น้ำตาลมะพร้าว",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน/มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 380,
                  "carbs": 95,
                  "sugar": 85,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 125
            }
      },
      {
            "ingredientId": "ing_013",
            "nameTh": "น้ำตาลทรายขาว/แดง",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 387,
                  "carbs": 100,
                  "sugar": 100,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 1
            }
      },
      {
            "ingredientId": "ing_044",
            "nameTh": "เกลือป่น (ผสมข้าว/น้ำเชื่อม)",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 5,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 38758
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 750,
            "carbs": 153.9,
            "sugar": 30.4,
            "fiber": 4,
            "protein": 13.4,
            "fat": 10.6,
            "sodium": 1967
      },
      "perServing": {
            "calories": 375,
            "carbs": 76.9,
            "sugar": 15.2,
            "fiber": 2,
            "protein": 6.7,
            "fat": 5.3,
            "sodium": 983
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.144Z",
  },
  dish_007: {
    _id: "dish_007",
    nameTh: "ข้าวปุ้นซาวน้ำปลาร้า",
    nameEn: "Isan Rice Noodles with Fermented Fish",
    region: "northeastern",
    regionNameTh: "ภาคอีสาน",
    type: "cooking_kit",
    dishType: "noodle",
    dominantElement: "ลม",
    elementSuitability: ["ดิน","ลม","ไฟ"],
    description: "เส้นขนมจีนเหนียวนุ่มคลุกน้ำปลาร้าปรุงรสนัว หอมพริกและสมุนไพร เสิร์ฟกับผักสดหลากชนิด ให้รสเค็มเผ็ดและสดชื่นในจานเดียว",
    history: "อาหารกินง่ายของชาวอีสานที่เรียกเส้นขนมจีนว่าข้าวปุ้น",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/northeastern/ID007_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_123",
            "nameTh": "ถั่วฝักยาว",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสมัน/หวาน / ฝาด",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 47,
                  "carbs": 8.3,
                  "sugar": 2.2,
                  "fiber": 3.6,
                  "protein": 2.8,
                  "fat": 0.4,
                  "sodium": 5
            }
      },
      {
            "ingredientId": "ing_028",
            "nameTh": "หอมแดง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 72,
                  "carbs": 16.8,
                  "sugar": 7.9,
                  "fiber": 3.2,
                  "protein": 2.5,
                  "fat": 0.1,
                  "sodium": 12
            }
      },
      {
            "ingredientId": "ing_127",
            "nameTh": "เมล็ดกระถิน",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสมัน/ฝาด /",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 120,
                  "carbs": 15,
                  "sugar": 2,
                  "fiber": 5,
                  "protein": 8,
                  "fat": 2,
                  "sodium": 10
            }
      },
      {
            "ingredientId": "ing_056",
            "nameTh": "ผักชี",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 23,
                  "carbs": 3.7,
                  "sugar": 0.9,
                  "fiber": 2.8,
                  "protein": 2.1,
                  "fat": 0.5,
                  "sodium": 46
            }
      },
      {
            "ingredientId": "ing_129",
            "nameTh": "ผักชีฝรั่ง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 35,
                  "carbs": 4.5,
                  "sugar": 0.8,
                  "fiber": 3,
                  "protein": 2.5,
                  "fat": 0.6,
                  "sodium": 30
            }
      },
      {
            "ingredientId": "ing_131",
            "nameTh": "ใบสะระแหน่",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 44,
                  "carbs": 8.4,
                  "sugar": 0.5,
                  "fiber": 6.8,
                  "protein": 3.3,
                  "fat": 0.9,
                  "sodium": 30
            }
      },
      {
            "ingredientId": "ing_143",
            "nameTh": "พริกแดง",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 10,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8.8,
                  "sugar": 5.3,
                  "fiber": 1.5,
                  "protein": 1.9,
                  "fat": 0.4,
                  "sodium": 9
            }
      },
      {
            "ingredientId": "ing_150",
            "nameTh": "ขนมจีน",
            "category": "carb",
            "categoryTh": "แป้ง & เส้น",
            "quantity": 100,
            "unit": "g",
            "medicinalTaste": "รสจืด",
            "elements": [
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 80,
                  "carbs": 18,
                  "sugar": 0,
                  "fiber": 0.4,
                  "protein": 1.2,
                  "fat": 0.2,
                  "sodium": 150
            }
      },
      {
            "ingredientId": "ing_041",
            "nameTh": "กะปิ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 25,
            "unit": "g",
            "medicinalTaste": "รสเค็ม/มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 100,
                  "carbs": 3,
                  "sugar": 0.5,
                  "fiber": 0,
                  "protein": 15,
                  "fat": 2,
                  "sodium": 8000
            }
      },
      {
            "ingredientId": "ing_151",
            "nameTh": "น้ำปลาร้า",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 45,
                  "carbs": 2,
                  "sugar": 0.5,
                  "fiber": 0,
                  "protein": 8,
                  "fat": 0.5,
                  "sodium": 6500
            }
      },
      {
            "ingredientId": "ing_083",
            "nameTh": "น้ำตาลทราย",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 387,
                  "carbs": 100,
                  "sugar": 100,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 1
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 312,
            "carbs": 57.7,
            "sugar": 21.5,
            "fiber": 10.3,
            "protein": 15.2,
            "fat": 2.6,
            "sodium": 3504
      },
      "perServing": {
            "calories": 156,
            "carbs": 28.9,
            "sugar": 10.7,
            "fiber": 5.2,
            "protein": 7.6,
            "fat": 1.3,
            "sodium": 1752
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.150Z",
  },
  dish_008: {
    _id: "dish_008",
    nameTh: "แกงอ่อม",
    nameEn: "Isan Herb Curry",
    region: "northeastern",
    regionNameTh: "ภาคอีสาน",
    type: "cooking_kit",
    dishType: "curry",
    dominantElement: "ลม",
    elementSuitability: ["ดิน","ลม","ไฟ"],
    description: "แกงน้ำขลุกขลิกที่รวมเนื้อและผักตามฤดูกาลไว้เต็มหม้อ รสเค็มเผ็ดนัวจากปลาร้า หอมผักชีลาว ต้นหอม และสมุนไพรอีสาน",
    history: "แกงพื้นบ้านอีสานที่รวมผักตามฤดูกาลไว้ในหม้อเดียว",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/northeastern/ID008_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1603099541178-958866380649?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_120",
            "nameTh": "เนื้อหมูสามชั้น",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 330,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 15,
                  "fat": 30,
                  "sodium": 65
            }
      },
      {
            "ingredientId": "ing_139",
            "nameTh": "ผักกวางตุ้ง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสหวาน / จืด",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 16,
                  "carbs": 2.2,
                  "sugar": 1.2,
                  "fiber": 1,
                  "protein": 1.5,
                  "fat": 0.2,
                  "sodium": 65
            }
      },
      {
            "ingredientId": "ing_132",
            "nameTh": "ใบแมงลัก",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 23,
                  "carbs": 2.7,
                  "sugar": 0.3,
                  "fiber": 1.6,
                  "protein": 3.1,
                  "fat": 0.6,
                  "sodium": 4
            }
      },
      {
            "ingredientId": "ing_133",
            "nameTh": "ผักชีลาว",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 43,
                  "carbs": 7,
                  "sugar": 1,
                  "fiber": 2.1,
                  "protein": 3.5,
                  "fat": 1.1,
                  "sodium": 60
            }
      },
      {
            "ingredientId": "ing_057",
            "nameTh": "ต้นหอม",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 32,
                  "carbs": 7.3,
                  "sugar": 2.3,
                  "fiber": 2.6,
                  "protein": 1.8,
                  "fat": 0.2,
                  "sodium": 16
            }
      },
      {
            "ingredientId": "ing_027",
            "nameTh": "ตะไคร้",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 99,
                  "carbs": 25,
                  "sugar": 0,
                  "fiber": 4,
                  "protein": 1.8,
                  "fat": 0.5,
                  "sodium": 6
            }
      },
      {
            "ingredientId": "ing_028",
            "nameTh": "หอมแดง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 72,
                  "carbs": 16.8,
                  "sugar": 7.9,
                  "fiber": 3.2,
                  "protein": 2.5,
                  "fat": 0.1,
                  "sodium": 12
            }
      },
      {
            "ingredientId": "ing_030",
            "nameTh": "กระเทียม",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 149,
                  "carbs": 33,
                  "sugar": 1,
                  "fiber": 2.1,
                  "protein": 6.4,
                  "fat": 0.5,
                  "sodium": 17
            }
      },
      {
            "ingredientId": "ing_143",
            "nameTh": "พริกแดง",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 10,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8.8,
                  "sugar": 5.3,
                  "fiber": 1.5,
                  "protein": 1.9,
                  "fat": 0.4,
                  "sodium": 9
            }
      },
      {
            "ingredientId": "ing_145",
            "nameTh": "พริกแห้ง",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 300,
                  "carbs": 50,
                  "sugar": 7,
                  "fiber": 28,
                  "protein": 12,
                  "fat": 8,
                  "sodium": 30
            }
      },
      {
            "ingredientId": "ing_151",
            "nameTh": "น้ำปลาร้า",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 45,
                  "carbs": 2,
                  "sugar": 0.5,
                  "fiber": 0,
                  "protein": 8,
                  "fat": 0.5,
                  "sodium": 6500
            }
      },
      {
            "ingredientId": "ing_042",
            "nameTh": "น้ำปลา",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 35,
                  "carbs": 3.6,
                  "sugar": 3.6,
                  "fiber": 0,
                  "protein": 5.1,
                  "fat": 0,
                  "sodium": 7800
            }
      },
      {
            "ingredientId": "ing_044",
            "nameTh": "เกลือ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 5,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 38758
            }
      },
      {
            "ingredientId": "ing_147",
            "nameTh": "ข้าวคั่ว",
            "category": "other",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "g",
            "medicinalTaste": "รสจืด/มัน",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 360,
                  "carbs": 80,
                  "sugar": 0.1,
                  "fiber": 2,
                  "protein": 7,
                  "fat": 1,
                  "sodium": 5
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 971,
            "carbs": 63.1,
            "sugar": 7.9,
            "fiber": 11.4,
            "protein": 44.3,
            "fat": 62.8,
            "sodium": 5006
      },
      "perServing": {
            "calories": 485,
            "carbs": 31.6,
            "sugar": 4,
            "fiber": 5.7,
            "protein": 22.1,
            "fat": 31.4,
            "sodium": 2503
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.157Z",
  },
  dish_009: {
    _id: "dish_009",
    nameTh: "แกงหน่อไม้ใบย่านาง",
    nameEn: "Bamboo Shoot Curry with Yanang",
    region: "northeastern",
    regionNameTh: "ภาคอีสาน",
    type: "cooking_kit",
    dishType: "curry",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","น้ำ","ลม","ไฟ"],
    description: "หน่อไม้ต้มจนหมดรสขื่นในน้ำใบย่านางสีเขียวเข้ม ปรุงรสนัวด้วยปลาร้า เติมเห็ดและผักพื้นบ้าน ได้แกงหอมสมุนไพรที่กินกับข้าวเหนียวพอดี",
    history: "ภูมิปัญญาอีสานใช้ใบย่านางลดรสขื่นของหน่อไม้",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/northeastern/ID009_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_134",
            "nameTh": "หน่อไม้สด",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 150,
            "unit": "g",
            "medicinalTaste": "รสมัน/ฝาด / ขม",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 27,
                  "carbs": 5.2,
                  "sugar": 2.5,
                  "fiber": 2.2,
                  "protein": 2.6,
                  "fat": 0.3,
                  "sodium": 8
            }
      },
      {
            "ingredientId": "ing_136",
            "nameTh": "เห็ดฟาง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสจืด/หวาน",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 35,
                  "carbs": 4.6,
                  "sugar": 1.2,
                  "fiber": 2.5,
                  "protein": 3.8,
                  "fat": 0.7,
                  "sodium": 10
            }
      },
      {
            "ingredientId": "ing_135",
            "nameTh": "น้ำใบย่านาง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสจืด/ขม",
            "elements": [
                  "น้ำ",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 10,
                  "carbs": 1.5,
                  "sugar": 0.2,
                  "fiber": 0.5,
                  "protein": 0.8,
                  "fat": 0.1,
                  "sodium": 15
            }
      },
      {
            "ingredientId": "ing_137",
            "nameTh": "บวบ",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสหวาน / รสจืด",
            "elements": [
                  "น้ำ",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 20,
                  "carbs": 4.3,
                  "sugar": 2.1,
                  "fiber": 1.1,
                  "protein": 0.7,
                  "fat": 0.2,
                  "sodium": 3
            }
      },
      {
            "ingredientId": "ing_138",
            "nameTh": "ฟักทอง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสหวาน/มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 26,
                  "carbs": 6.5,
                  "sugar": 1.4,
                  "fiber": 0.5,
                  "protein": 1,
                  "fat": 0.1,
                  "sodium": 1
            }
      },
      {
            "ingredientId": "ing_027",
            "nameTh": "ตะไคร้",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 99,
                  "carbs": 25,
                  "sugar": 0,
                  "fiber": 4,
                  "protein": 1.8,
                  "fat": 0.5,
                  "sodium": 6
            }
      },
      {
            "ingredientId": "ing_028",
            "nameTh": "หอมแดง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 72,
                  "carbs": 16.8,
                  "sugar": 7.9,
                  "fiber": 3.2,
                  "protein": 2.5,
                  "fat": 0.1,
                  "sodium": 12
            }
      },
      {
            "ingredientId": "ing_132",
            "nameTh": "ใบแมงลัก",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 23,
                  "carbs": 2.7,
                  "sugar": 0.3,
                  "fiber": 1.6,
                  "protein": 3.1,
                  "fat": 0.6,
                  "sodium": 4
            }
      },
      {
            "ingredientId": "ing_024",
            "nameTh": "ใบมะกรูด",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8,
                  "sugar": 1,
                  "fiber": 5,
                  "protein": 3,
                  "fat": 0.5,
                  "sodium": 10
            }
      },
      {
            "ingredientId": "ing_063",
            "nameTh": "ชะอม",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสจืด / ฝาด",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 93,
                  "carbs": 5,
                  "sugar": 1,
                  "fiber": 5.7,
                  "protein": 9.5,
                  "fat": 3,
                  "sodium": 20
            }
      },
      {
            "ingredientId": "ing_143",
            "nameTh": "พริกแดง",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 10,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8.8,
                  "sugar": 5.3,
                  "fiber": 1.5,
                  "protein": 1.9,
                  "fat": 0.4,
                  "sodium": 9
            }
      },
      {
            "ingredientId": "ing_151",
            "nameTh": "น้ำปลาร้า",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 45,
                  "carbs": 2,
                  "sugar": 0.5,
                  "fiber": 0,
                  "protein": 8,
                  "fat": 0.5,
                  "sodium": 6500
            }
      },
      {
            "ingredientId": "ing_042",
            "nameTh": "น้ำปลา",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 35,
                  "carbs": 3.6,
                  "sugar": 3.6,
                  "fiber": 0,
                  "protein": 5.1,
                  "fat": 0,
                  "sodium": 7800
            }
      },
      {
            "ingredientId": "ing_149",
            "nameTh": "ข้าวเบือ (ข้าวเหนียวแช่น้ำ)",
            "category": "other",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "g",
            "medicinalTaste": "รสจืด/มัน",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 180,
                  "carbs": 40,
                  "sugar": 0.1,
                  "fiber": 0.8,
                  "protein": 3.5,
                  "fat": 0.3,
                  "sodium": 3
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 264,
            "carbs": 47.6,
            "sugar": 11.2,
            "fiber": 13.3,
            "protein": 17.9,
            "fat": 3,
            "sodium": 2906
      },
      "perServing": {
            "calories": 132,
            "carbs": 23.8,
            "sugar": 5.6,
            "fiber": 6.6,
            "protein": 8.9,
            "fat": 1.5,
            "sodium": 1453
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.161Z",
  },
  dish_010: {
    _id: "dish_010",
    nameTh: "ส้มตำไทย",
    nameEn: "Thai Green Papaya Salad",
    region: "northeastern",
    regionNameTh: "ภาคอีสาน",
    type: "cooking_kit",
    dishType: "salad",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","น้ำ","ลม","ไฟ"],
    description: "มะละกอดิบเส้นกรอบตำกับมะเขือเทศ ถั่วฝักยาว และถั่วลิสง ปรุงรสเปรี้ยวหวานเค็มอย่างสมดุล เผ็ดกำลังดีและหอมมะนาวสด",
    history: "เมนูตำมะละกอที่แพร่หลายและปรับรสให้กลมกล่อมแบบไทยกลาง",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/northeastern/ID010_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1562607635-4608ff48a859?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_121",
            "nameTh": "กุ้งแห้ง",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน/ รสเค็ม / หวาน",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 250,
                  "carbs": 1.5,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 50,
                  "fat": 4.5,
                  "sodium": 3500
            }
      },
      {
            "ingredientId": "ing_122",
            "nameTh": "มะละกอดิบ",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 150,
            "unit": "g",
            "medicinalTaste": "รสจืด/ฝาด",
            "elements": [
                  "ดิน",
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 32,
                  "carbs": 7.2,
                  "sugar": 2.5,
                  "fiber": 1.8,
                  "protein": 0.6,
                  "fat": 0.1,
                  "sodium": 3
            }
      },
      {
            "ingredientId": "ing_123",
            "nameTh": "ถั่วฝักยาว",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสมัน/หวาน / ฝาด",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 47,
                  "carbs": 8.3,
                  "sugar": 2.2,
                  "fiber": 3.6,
                  "protein": 2.8,
                  "fat": 0.4,
                  "sodium": 5
            }
      },
      {
            "ingredientId": "ing_124",
            "nameTh": "มะเขือเทศสีดา",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 80,
            "unit": "g",
            "medicinalTaste": "รสเปรี้ยว /หวาน / จืด",
            "elements": [
                  "น้ำ",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 18,
                  "carbs": 3.9,
                  "sugar": 2.6,
                  "fiber": 1.2,
                  "protein": 0.9,
                  "fat": 0.2,
                  "sodium": 5
            }
      },
      {
            "ingredientId": "ing_126",
            "nameTh": "กระเทียมไทย",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 149,
                  "carbs": 33,
                  "sugar": 1,
                  "fiber": 2.1,
                  "protein": 6.4,
                  "fat": 0.5,
                  "sodium": 17
            }
      },
      {
            "ingredientId": "ing_143",
            "nameTh": "พริกแดง",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 10,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8.8,
                  "sugar": 5.3,
                  "fiber": 1.5,
                  "protein": 1.9,
                  "fat": 0.4,
                  "sodium": 9
            }
      },
      {
            "ingredientId": "ing_148",
            "nameTh": "ถั่วลิสงคั่ว",
            "category": "other",
            "categoryTh": "ถั่ว & เมล็ดพืช",
            "quantity": 20,
            "unit": "g",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 567,
                  "carbs": 16,
                  "sugar": 4,
                  "fiber": 8.5,
                  "protein": 25,
                  "fat": 49,
                  "sodium": 18
            }
      },
      {
            "ingredientId": "ing_045",
            "nameTh": "น้ำตาลปี๊บ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 380,
                  "carbs": 95,
                  "sugar": 85,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 125
            }
      },
      {
            "ingredientId": "ing_042",
            "nameTh": "น้ำปลา",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 35,
                  "carbs": 3.6,
                  "sugar": 3.6,
                  "fiber": 0,
                  "protein": 5.1,
                  "fat": 0,
                  "sodium": 7800
            }
      },
      {
            "ingredientId": "ing_047",
            "nameTh": "น้ำมะนาว",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเปรี้ยว",
            "elements": [
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 25,
                  "carbs": 8.4,
                  "sugar": 1.7,
                  "fiber": 0.4,
                  "protein": 0.4,
                  "fat": 0.1,
                  "sodium": 2
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 827,
            "carbs": 54.2,
            "sugar": 22.3,
            "fiber": 7.9,
            "protein": 111.6,
            "fat": 19.5,
            "sodium": 8601
      },
      "perServing": {
            "calories": 414,
            "carbs": 27.1,
            "sugar": 11.1,
            "fiber": 3.9,
            "protein": 55.8,
            "fat": 9.8,
            "sodium": 4300
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.166Z",
  },
  dish_011: {
    _id: "dish_011",
    nameTh: "ต้มแซ่บกระดูกหมู",
    nameEn: "Spicy Isan Pork Rib Soup",
    region: "northeastern",
    regionNameTh: "ภาคอีสาน",
    type: "cooking_kit",
    dishType: "soup",
    dominantElement: "ลม",
    elementSuitability: ["ดิน","น้ำ","ลม","ไฟ"],
    description: "กระดูกหมูเคี่ยวจนเนื้อนุ่มในน้ำซุปร้อนรสเปรี้ยวเผ็ดจัดจ้าน หอมข้าวคั่ว พริกแห้ง และสมุนไพรสด ซดคล่องคอและอุ่นท้อง",
    history: "ต้มพื้นบ้านอีสานที่เคี่ยวกระดูกหมูจนนุ่มแล้วปรุงรสจัดท้ายสุด",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/northeastern/ID011_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_120",
            "nameTh": "กระดูกหมูอ่อน",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 330,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 15,
                  "fat": 30,
                  "sodium": 65
            }
      },
      {
            "ingredientId": "ing_026",
            "nameTh": "ข่า",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน / ขม",
            "elements": [
                  "น้ำ",
                  "ลม",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 71,
                  "carbs": 15,
                  "sugar": 0,
                  "fiber": 2,
                  "protein": 1,
                  "fat": 1,
                  "sodium": 15
            }
      },
      {
            "ingredientId": "ing_027",
            "nameTh": "ตะไคร้",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 99,
                  "carbs": 25,
                  "sugar": 0,
                  "fiber": 4,
                  "protein": 1.8,
                  "fat": 0.5,
                  "sodium": 6
            }
      },
      {
            "ingredientId": "ing_024",
            "nameTh": "ใบมะกรูด",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8,
                  "sugar": 1,
                  "fiber": 5,
                  "protein": 3,
                  "fat": 0.5,
                  "sodium": 10
            }
      },
      {
            "ingredientId": "ing_028",
            "nameTh": "หอมแดง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 72,
                  "carbs": 16.8,
                  "sugar": 7.9,
                  "fiber": 3.2,
                  "protein": 2.5,
                  "fat": 0.1,
                  "sodium": 12
            }
      },
      {
            "ingredientId": "ing_129",
            "nameTh": "ผักชีฝรั่ง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 35,
                  "carbs": 4.5,
                  "sugar": 0.8,
                  "fiber": 3,
                  "protein": 2.5,
                  "fat": 0.6,
                  "sodium": 30
            }
      },
      {
            "ingredientId": "ing_057",
            "nameTh": "ต้นหอม",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 32,
                  "carbs": 7.3,
                  "sugar": 2.3,
                  "fiber": 2.6,
                  "protein": 1.8,
                  "fat": 0.2,
                  "sodium": 16
            }
      },
      {
            "ingredientId": "ing_144",
            "nameTh": "พริกขี้หนู",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8.8,
                  "sugar": 5.3,
                  "fiber": 1.5,
                  "protein": 1.9,
                  "fat": 0.4,
                  "sodium": 9
            }
      },
      {
            "ingredientId": "ing_145",
            "nameTh": "พริกแห้งคั่ว",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 300,
                  "carbs": 50,
                  "sugar": 7,
                  "fiber": 28,
                  "protein": 12,
                  "fat": 8,
                  "sodium": 30
            }
      },
      {
            "ingredientId": "ing_070",
            "nameTh": "พริกป่น",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 10,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 282,
                  "carbs": 50,
                  "sugar": 7,
                  "fiber": 27,
                  "protein": 13,
                  "fat": 14,
                  "sodium": 35
            }
      },
      {
            "ingredientId": "ing_048",
            "nameTh": "น้ำมะขามเปียก",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเปรี้ยว",
            "elements": [
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 120,
                  "carbs": 30,
                  "sugar": 20,
                  "fiber": 2.5,
                  "protein": 1.2,
                  "fat": 0.2,
                  "sodium": 25
            }
      },
      {
            "ingredientId": "ing_047",
            "nameTh": "น้ำมะนาว",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเปรี้ยว",
            "elements": [
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 25,
                  "carbs": 8.4,
                  "sugar": 1.7,
                  "fiber": 0.4,
                  "protein": 0.4,
                  "fat": 0.1,
                  "sodium": 2
            }
      },
      {
            "ingredientId": "ing_147",
            "nameTh": "ข้าวคั่ว",
            "category": "other",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "g",
            "medicinalTaste": "รสจืด/มัน",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 360,
                  "carbs": 80,
                  "sugar": 0.1,
                  "fiber": 2,
                  "protein": 7,
                  "fat": 1,
                  "sodium": 5
            }
      },
      {
            "ingredientId": "ing_042",
            "nameTh": "น้ำปลา",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 35,
                  "carbs": 3.6,
                  "sugar": 3.6,
                  "fiber": 0,
                  "protein": 5.1,
                  "fat": 0,
                  "sodium": 7800
            }
      },
      {
            "ingredientId": "ing_044",
            "nameTh": "เกลือ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 5,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 38758
            }
      },
      {
            "ingredientId": "ing_083",
            "nameTh": "น้ำตาลทราย",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 387,
                  "carbs": 100,
                  "sugar": 100,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 1
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 1045,
            "carbs": 83.9,
            "sugar": 27.4,
            "fiber": 16,
            "protein": 41.2,
            "fat": 64.1,
            "sodium": 3679
      },
      "perServing": {
            "calories": 522,
            "carbs": 41.9,
            "sugar": 13.7,
            "fiber": 8,
            "protein": 20.6,
            "fat": 32,
            "sodium": 1840
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.170Z",
  },
  dish_012: {
    _id: "dish_012",
    nameTh: "ทับทิมกรอบ",
    nameEn: "Red Rubies in Coconut Milk",
    region: "northeastern",
    regionNameTh: "ภาคอีสาน",
    type: "dessert",
    dishType: "dessert",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","น้ำ","ลม","ไฟ"],
    description: "แห้วเนื้อกรอบหั่นเต๋าเคลือบแป้งสีทับทิมเนื้อนุ่มหนึบ เสิร์ฟในน้ำกะทิหอมหวานมัน พร้อมน้ำแข็งบดเย็นชื่นใจ",
    history: "ขนมไทยคลายร้อนที่ได้ชื่อจากสีแดงคล้ายอัญมณีทับทิม",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "พร้อมรับประทาน แนะนำให้เสิร์ฟเย็น",
    imageUrl: [
      new URL("./assets/northeastern/ID012_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1603099541178-958866380649?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 129,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_010",
            "nameTh": "แป้งมันสำปะหลัง",
            "category": "carb",
            "categoryTh": "แป้ง",
            "quantity": 100,
            "unit": "g",
            "medicinalTaste": "รสหวาน/จืด",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 358,
                  "carbs": 88,
                  "sugar": 0,
                  "fiber": 0.9,
                  "protein": 0.2,
                  "fat": 0.1,
                  "sodium": 1
            }
      },
      {
            "ingredientId": "ing_003",
            "nameTh": "แห้วต้มสุก",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสหวาน/มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 97,
                  "carbs": 24,
                  "sugar": 3,
                  "fiber": 3,
                  "protein": 1.4,
                  "fat": 0.1,
                  "sodium": 14
            }
      },
      {
            "ingredientId": "ing_006",
            "nameTh": "ใบเตย",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสหอมเย็น",
            "elements": [
                  "ลม",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 3,
                  "carbs": 0.5,
                  "sugar": 0,
                  "fiber": 0.2,
                  "protein": 0.1,
                  "fat": 0,
                  "sodium": 2
            }
      },
      {
            "ingredientId": "ing_004",
            "nameTh": "เนื้อมะพร้าวอ่อน",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสหวาน/มัน",
            "elements": [
                  "ดิน",
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 165,
                  "carbs": 8,
                  "sugar": 3.5,
                  "fiber": 2.5,
                  "protein": 1.5,
                  "fat": 15,
                  "sodium": 15
            }
      },
      {
            "ingredientId": "ing_017",
            "nameTh": "น้ำลอยดอกไม้",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหอมเย็น",
            "elements": [
                  "ลม",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 0
            }
      },
      {
            "ingredientId": "ing_013",
            "nameTh": "น้ำตาลทรายขาว",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 387,
                  "carbs": 100,
                  "sugar": 100,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 1
            }
      },
      {
            "ingredientId": "ing_016",
            "nameTh": "น้ำหวานสีแดง",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 260,
                  "carbs": 65,
                  "sugar": 65,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 10
            }
      },
      {
            "ingredientId": "ing_044",
            "nameTh": "เกลือ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 5,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 38758
            }
      },
      {
            "ingredientId": "ing_085",
            "nameTh": "กะทิ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 200,
            "unit": "ml",
            "medicinalTaste": "รสมัน/หวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 230,
                  "carbs": 5.5,
                  "sugar": 3.3,
                  "fiber": 2.2,
                  "protein": 2.3,
                  "fat": 24,
                  "sodium": 15
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 1021,
            "carbs": 136.8,
            "sugar": 34,
            "fiber": 7.6,
            "protein": 6,
            "fat": 54.1,
            "sodium": 1983
      },
      "perServing": {
            "calories": 511,
            "carbs": 68.4,
            "sugar": 17,
            "fiber": 3.8,
            "protein": 3,
            "fat": 27.1,
            "sodium": 991
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.173Z",
  },
  dish_013: {
    _id: "dish_013",
    nameTh: "แกงรัญจวน",
    nameEn: "Royal Thai Ranjuan Curry",
    region: "central",
    regionNameTh: "ภาคกลาง",
    type: "cooking_kit",
    dishType: "curry",
    dominantElement: "ลม",
    elementSuitability: ["ดิน","น้ำ","ลม","ไฟ"],
    description: "เนื้อนุ่มในน้ำแกงใสที่หอมเอกลักษณ์จากน้ำพริกกะปิ ตะไคร้ และโหระพา รสเปรี้ยวเค็มกลมกล่อม มีความเผ็ดอ่อน ๆ ช่วยเรียกน้ำย่อย",
    history: "อาหารชาววังสมัยรัชกาลที่ 5 ที่นำของเหลือมาปรุงเป็นแกงใหม่",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/central/ID013_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_020",
            "nameTh": "เนื้อวัว",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 250,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 26,
                  "fat": 15,
                  "sodium": 60
            }
      },
      {
            "ingredientId": "ing_025",
            "nameTh": "ใบโหระพา",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 23,
                  "carbs": 2.7,
                  "sugar": 0.3,
                  "fiber": 1.6,
                  "protein": 3.1,
                  "fat": 0.6,
                  "sodium": 4
            }
      },
      {
            "ingredientId": "ing_027",
            "nameTh": "ตะไคร้",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 99,
                  "carbs": 25,
                  "sugar": 0,
                  "fiber": 4,
                  "protein": 1.8,
                  "fat": 0.5,
                  "sodium": 6
            }
      },
      {
            "ingredientId": "ing_028",
            "nameTh": "หอมแดง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 72,
                  "carbs": 16.8,
                  "sugar": 7.9,
                  "fiber": 3.2,
                  "protein": 2.5,
                  "fat": 0.1,
                  "sodium": 12
            }
      },
      {
            "ingredientId": "ing_030",
            "nameTh": "กระเทียม",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 149,
                  "carbs": 33,
                  "sugar": 1,
                  "fiber": 2.1,
                  "protein": 6.4,
                  "fat": 0.5,
                  "sodium": 17
            }
      },
      {
            "ingredientId": "ing_024",
            "nameTh": "ใบมะกรูด",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8,
                  "sugar": 1,
                  "fiber": 5,
                  "protein": 3,
                  "fat": 0.5,
                  "sodium": 10
            }
      },
      {
            "ingredientId": "ing_026",
            "nameTh": "ข่า",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน / ขม",
            "elements": [
                  "ลม",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 71,
                  "carbs": 15,
                  "sugar": 0,
                  "fiber": 2,
                  "protein": 1,
                  "fat": 1,
                  "sodium": 15
            }
      },
      {
            "ingredientId": "ing_144",
            "nameTh": "พริกขี้หนูสวน (ในแกง/น้ำพริก)",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8.8,
                  "sugar": 5.3,
                  "fiber": 1.5,
                  "protein": 1.9,
                  "fat": 0.4,
                  "sodium": 9
            }
      },
      {
            "ingredientId": "ing_042",
            "nameTh": "น้ำปลา",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 35,
                  "carbs": 3.6,
                  "sugar": 3.6,
                  "fiber": 0,
                  "protein": 5.1,
                  "fat": 0,
                  "sodium": 7800
            }
      },
      {
            "ingredientId": "ing_044",
            "nameTh": "เกลือ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 5,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 38758
            }
      },
      {
            "ingredientId": "ing_047",
            "nameTh": "น้ำมะนาว",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเปรี้ยว",
            "elements": [
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 25,
                  "carbs": 8.4,
                  "sugar": 1.7,
                  "fiber": 0.4,
                  "protein": 0.4,
                  "fat": 0.1,
                  "sodium": 2
            }
      },
      {
            "ingredientId": "ing_041",
            "nameTh": "กะปิ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 25,
            "unit": "g",
            "medicinalTaste": "รสเค็ม/มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 100,
                  "carbs": 3,
                  "sugar": 0.5,
                  "fiber": 0,
                  "protein": 15,
                  "fat": 2,
                  "sodium": 8000
            }
      },
      {
            "ingredientId": "ing_045",
            "nameTh": "น้ำตาลปี๊บ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 380,
                  "carbs": 95,
                  "sugar": 85,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 125
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 782,
            "carbs": 58.9,
            "sugar": 18.8,
            "fiber": 7.5,
            "protein": 64.3,
            "fat": 31.9,
            "sodium": 5664
      },
      "perServing": {
            "calories": 391,
            "carbs": 29.5,
            "sugar": 9.4,
            "fiber": 3.7,
            "protein": 32.1,
            "fat": 15.9,
            "sodium": 2832
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.177Z",
  },
  dish_014: {
    _id: "dish_014",
    nameTh: "แกงเทโพหมูสามชั้น",
    nameEn: "Pork Belly Kang Thepho",
    region: "central",
    regionNameTh: "ภาคกลาง",
    type: "cooking_kit",
    dishType: "curry",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","น้ำ","ลม","ไฟ"],
    description: "หมูสามชั้นนุ่มมันพอดีเคี่ยวในแกงกะทิข้นกับผักบุ้งไทย รสเปรี้ยวหวานเค็มครบรส หอมใบมะกรูดและเครื่องแกงแบบไทยกลาง",
    history: "เดิมใช้ปลาเทโพ ก่อนปรับมาใช้หมูสามชั้นเมื่อปลาหายากขึ้น",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/central/ID014_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1562607635-4608ff48a859?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_021",
            "nameTh": "หมูสามชั้น",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 330,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 16,
                  "fat": 30,
                  "sodium": 50
            }
      },
      {
            "ingredientId": "ing_031",
            "nameTh": "ผักบุ้งไทย",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 150,
            "unit": "g",
            "medicinalTaste": "รสจืด",
            "elements": [
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 19,
                  "carbs": 3.1,
                  "sugar": 0.5,
                  "fiber": 2.1,
                  "protein": 2.6,
                  "fat": 0.2,
                  "sodium": 55
            }
      },
      {
            "ingredientId": "ing_024",
            "nameTh": "ใบมะกรูด",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8,
                  "sugar": 1,
                  "fiber": 5,
                  "protein": 3,
                  "fat": 0.5,
                  "sodium": 10
            }
      },
      {
            "ingredientId": "ing_026",
            "nameTh": "พริกแกงแดง (หอม, กระเทียม, ข่า, ตะไคร้, ผิวมะกรูด, พริกแห้ง)",
            "category": "vegetable",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน/ฝาด",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 71,
                  "carbs": 15,
                  "sugar": 0,
                  "fiber": 2,
                  "protein": 1,
                  "fat": 1,
                  "sodium": 15
            }
      },
      {
            "ingredientId": "ing_042",
            "nameTh": "น้ำปลา",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 35,
                  "carbs": 3.6,
                  "sugar": 3.6,
                  "fiber": 0,
                  "protein": 5.1,
                  "fat": 0,
                  "sodium": 7800
            }
      },
      {
            "ingredientId": "ing_045",
            "nameTh": "น้ำตาลปี๊บ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 380,
                  "carbs": 95,
                  "sugar": 85,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 125
            }
      },
      {
            "ingredientId": "ing_048",
            "nameTh": "น้ำมะมะขามเปียก",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเปรี้ยว",
            "elements": [
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 120,
                  "carbs": 30,
                  "sugar": 20,
                  "fiber": 2.5,
                  "protein": 1.2,
                  "fat": 0.2,
                  "sodium": 25
            }
      },
      {
            "ingredientId": "ing_085",
            "nameTh": "กะทิ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 200,
            "unit": "ml",
            "medicinalTaste": "รสมัน/หวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 230,
                  "carbs": 5.5,
                  "sugar": 3.3,
                  "fiber": 2.2,
                  "protein": 2.3,
                  "fat": 24,
                  "sodium": 15
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 1281,
            "carbs": 45.8,
            "sugar": 25.2,
            "fiber": 10.9,
            "protein": 43.4,
            "fat": 108.9,
            "sodium": 1806
      },
      "perServing": {
            "calories": 640,
            "carbs": 22.9,
            "sugar": 12.6,
            "fiber": 5.4,
            "protein": 21.7,
            "fat": 54.5,
            "sodium": 903
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.183Z",
  },
  dish_015: {
    _id: "dish_015",
    nameTh: "มัสมั่นไก่",
    nameEn: "Chicken Massaman Curry",
    region: "central",
    regionNameTh: "ภาคกลาง",
    type: "cooking_kit",
    dishType: "curry",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","น้ำ","ลม","ไฟ"],
    description: "น่องไก่เคี่ยวจนเปื่อยนุ่มในแกงกะทิเนื้อข้น รสหวานเค็มละมุน หอมอบเชย ลูกกระวาน และเครื่องเทศ เสริมสัมผัสมันกรุบด้วยถั่วลิสง",
    history: "แกงไทยที่รับอิทธิพลอาหารมลายูและเครื่องเทศจากต่างแดน",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/central/ID015_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_022",
            "nameTh": "น่องไก่ใหญ่",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน/หวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 220,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 18,
                  "fat": 16,
                  "sodium": 80
            }
      },
      {
            "ingredientId": "ing_029",
            "nameTh": "หอมหัวใหญ่",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 9.3,
                  "sugar": 4.2,
                  "fiber": 1.7,
                  "protein": 1.1,
                  "fat": 0.1,
                  "sodium": 4
            }
      },
      {
            "ingredientId": "ing_033",
            "nameTh": "มันฝรั่ง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสหวาน/มัน /จืด",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 77,
                  "carbs": 17.5,
                  "sugar": 0.8,
                  "fiber": 2.2,
                  "protein": 2,
                  "fat": 0.1,
                  "sodium": 6
            }
      },
      {
            "ingredientId": "ing_026",
            "nameTh": "พริกแกงมัสมั่น (ดอกจันทน์, ลูกกระวาน, กานพลู, อบเชย, ยี่หร่า, เม็ดผักชี, พริกแห้ง, ข่า, ตะไคร้)",
            "category": "vegetable",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน/ฝาด",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 71,
                  "carbs": 15,
                  "sugar": 0,
                  "fiber": 2,
                  "protein": 1,
                  "fat": 1,
                  "sodium": 15
            }
      },
      {
            "ingredientId": "ing_038",
            "nameTh": "เม็ดมะม่วงหิมพานต์",
            "category": "other",
            "categoryTh": "ถั่ว & เมล็ดพืช",
            "quantity": 20,
            "unit": "g",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 553,
                  "carbs": 30,
                  "sugar": 5.9,
                  "fiber": 3.3,
                  "protein": 18,
                  "fat": 44,
                  "sodium": 12
            }
      },
      {
            "ingredientId": "ing_015",
            "nameTh": "น้ำตาลมะพร้าว",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 380,
                  "carbs": 95,
                  "sugar": 85,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 125
            }
      },
      {
            "ingredientId": "ing_048",
            "nameTh": "น้ำมะขามเปียก",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเปรี้ยว",
            "elements": [
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 120,
                  "carbs": 30,
                  "sugar": 20,
                  "fiber": 2.5,
                  "protein": 1.2,
                  "fat": 0.2,
                  "sodium": 25
            }
      },
      {
            "ingredientId": "ing_042",
            "nameTh": "น้ำปลา",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 35,
                  "carbs": 3.6,
                  "sugar": 3.6,
                  "fiber": 0,
                  "protein": 5.1,
                  "fat": 0,
                  "sodium": 7800
            }
      },
      {
            "ingredientId": "ing_044",
            "nameTh": "เกลือ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 5,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 38758
            }
      },
      {
            "ingredientId": "ing_085",
            "nameTh": "หัวกะทิ & หางกะทิ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 200,
            "unit": "ml",
            "medicinalTaste": "รสมัน/หวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 230,
                  "carbs": 5.5,
                  "sugar": 3.3,
                  "fiber": 2.2,
                  "protein": 2.3,
                  "fat": 24,
                  "sodium": 15
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 1174,
            "carbs": 54.7,
            "sugar": 27.3,
            "fiber": 7.9,
            "protein": 47.1,
            "fat": 89.3,
            "sodium": 3724
      },
      "perServing": {
            "calories": 587,
            "carbs": 27.3,
            "sugar": 13.6,
            "fiber": 4,
            "protein": 23.6,
            "fat": 44.7,
            "sodium": 1862
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.189Z",
  },
  dish_016: {
    _id: "dish_016",
    nameTh: "แกงสิบหก",
    nameEn: "Sixteen-Ingredient Heritage Curry",
    region: "central",
    regionNameTh: "ภาคกลาง",
    type: "cooking_kit",
    dishType: "curry",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","น้ำ","ลม","ไฟ"],
    description: "แกงไทยโบราณที่อัดแน่นด้วยเครื่องเคราหลากชนิด รสเข้มข้นเป็นชั้น ๆ หอมพริกแกง สมุนไพร และเครื่องเทศที่เคี่ยวรวมกันอย่างพิถีพิถัน",
    history: "ตั้งชื่อตามจำนวนองค์ประกอบสำคัญในตำรับโบราณ",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/central/ID016_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1603099541178-958866380649?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_022",
            "nameTh": "ไก่ตอน",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน/หวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 220,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 18,
                  "fat": 16,
                  "sodium": 80
            }
      },
      {
            "ingredientId": "ing_001",
            "nameTh": "ไข่จะละเม็ด (ไข่เต่าตะนุ / ไข่ปลา)",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน/หวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 322,
                  "carbs": 3.6,
                  "sugar": 0.6,
                  "fiber": 0,
                  "protein": 16,
                  "fat": 27,
                  "sodium": 50
            }
      },
      {
            "ingredientId": "ing_034",
            "nameTh": "มังคุดดิบ/ห่าม",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเปรี้ยว/ฝาด /หวาน",
            "elements": [
                  "ดิน",
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 60,
                  "carbs": 15.6,
                  "sugar": 10,
                  "fiber": 1.8,
                  "protein": 0.5,
                  "fat": 0.4,
                  "sodium": 7
            }
      },
      {
            "ingredientId": "ing_035",
            "nameTh": "ส้มซ่า",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเปรี้ยว/ฝาด",
            "elements": [
                  "ดิน",
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 37,
                  "carbs": 9.3,
                  "sugar": 2.5,
                  "fiber": 0.4,
                  "protein": 0.7,
                  "fat": 0.1,
                  "sodium": 2
            }
      },
      {
            "ingredientId": "ing_025",
            "nameTh": "ใบโหระพา",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 23,
                  "carbs": 2.7,
                  "sugar": 0.3,
                  "fiber": 1.6,
                  "protein": 3.1,
                  "fat": 0.6,
                  "sodium": 4
            }
      },
      {
            "ingredientId": "ing_027",
            "nameTh": "ตะไคร้",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 99,
                  "carbs": 25,
                  "sugar": 0,
                  "fiber": 4,
                  "protein": 1.8,
                  "fat": 0.5,
                  "sodium": 6
            }
      },
      {
            "ingredientId": "ing_026",
            "nameTh": "ข่า",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน / ขม",
            "elements": [
                  "ลม",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 71,
                  "carbs": 15,
                  "sugar": 0,
                  "fiber": 2,
                  "protein": 1,
                  "fat": 1,
                  "sodium": 15
            }
      },
      {
            "ingredientId": "ing_028",
            "nameTh": "หอมแดง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 72,
                  "carbs": 16.8,
                  "sugar": 7.9,
                  "fiber": 3.2,
                  "protein": 2.5,
                  "fat": 0.1,
                  "sodium": 12
            }
      },
      {
            "ingredientId": "ing_030",
            "nameTh": "กระเทียม",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 149,
                  "carbs": 33,
                  "sugar": 1,
                  "fiber": 2.1,
                  "protein": 6.4,
                  "fat": 0.5,
                  "sodium": 17
            }
      },
      {
            "ingredientId": "ing_145",
            "nameTh": "พริกหยวก & พริกแห้ง",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 300,
                  "carbs": 50,
                  "sugar": 7,
                  "fiber": 28,
                  "protein": 12,
                  "fat": 8,
                  "sodium": 30
            }
      },
      {
            "ingredientId": "ing_056",
            "nameTh": "เครื่องเทศ (เม็ดผักชี, ยี่หร่า ฯลฯ)",
            "category": "vegetable",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน/ฝาด",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 23,
                  "carbs": 3.7,
                  "sugar": 0.9,
                  "fiber": 2.8,
                  "protein": 2.1,
                  "fat": 0.5,
                  "sodium": 46
            }
      },
      {
            "ingredientId": "ing_041",
            "nameTh": "กะปิ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 25,
            "unit": "g",
            "medicinalTaste": "รสเค็ม/มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 100,
                  "carbs": 3,
                  "sugar": 0.5,
                  "fiber": 0,
                  "protein": 15,
                  "fat": 2,
                  "sodium": 8000
            }
      },
      {
            "ingredientId": "ing_042",
            "nameTh": "น้ำปลา",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 35,
                  "carbs": 3.6,
                  "sugar": 3.6,
                  "fiber": 0,
                  "protein": 5.1,
                  "fat": 0,
                  "sodium": 7800
            }
      },
      {
            "ingredientId": "ing_013",
            "nameTh": "น้ำตาล",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 387,
                  "carbs": 100,
                  "sugar": 100,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 1
            }
      },
      {
            "ingredientId": "ing_085",
            "nameTh": "กะทิ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 200,
            "unit": "ml",
            "medicinalTaste": "รสมัน/หวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 230,
                  "carbs": 5.5,
                  "sugar": 3.3,
                  "fiber": 2.2,
                  "protein": 2.3,
                  "fat": 24,
                  "sodium": 15
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 1893,
            "carbs": 90.6,
            "sugar": 33.7,
            "fiber": 15.8,
            "protein": 86.4,
            "fat": 137.2,
            "sodium": 3898
      },
      "perServing": {
            "calories": 946,
            "carbs": 45.3,
            "sugar": 16.9,
            "fiber": 7.9,
            "protein": 43.2,
            "fat": 68.6,
            "sodium": 1949
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.193Z",
  },
  dish_017: {
    _id: "dish_017",
    nameTh: "หมูชะมวง",
    nameEn: "Chanthaburi Pork with Cowa Leaves",
    region: "central",
    regionNameTh: "ภาคกลาง",
    type: "cooking_kit",
    dishType: "curry",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","น้ำ","ลม","ไฟ"],
    description: "หมูชิ้นโตเคี่ยวกับใบชะมวงจนเนื้อนุ่มและน้ำแกงงวดเข้าเนื้อ รสเปรี้ยวธรรมชาติผสานหวานเค็มอย่างกลมกล่อม หอมเครื่องแกงคั่ว",
    history: "อาหารท้องถิ่นขึ้นชื่อของจันทบุรีที่ใช้ใบชะมวงให้รสเปรี้ยว",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/central/ID017_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_021",
            "nameTh": "หมูสันคอ",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 330,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 16,
                  "fat": 30,
                  "sodium": 50
            }
      },
      {
            "ingredientId": "ing_032",
            "nameTh": "ใบชะมวง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเปรี้ยว/ฝาด",
            "elements": [
                  "ดิน",
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 45,
                  "carbs": 8,
                  "sugar": 1.5,
                  "fiber": 3.5,
                  "protein": 2,
                  "fat": 0.5,
                  "sodium": 10
            }
      },
      {
            "ingredientId": "ing_028",
            "nameTh": "หอมแดง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 72,
                  "carbs": 16.8,
                  "sugar": 7.9,
                  "fiber": 3.2,
                  "protein": 2.5,
                  "fat": 0.1,
                  "sodium": 12
            }
      },
      {
            "ingredientId": "ing_030",
            "nameTh": "กระเทียม",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 149,
                  "carbs": 33,
                  "sugar": 1,
                  "fiber": 2.1,
                  "protein": 6.4,
                  "fat": 0.5,
                  "sodium": 17
            }
      },
      {
            "ingredientId": "ing_026",
            "nameTh": "ข่า",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน / ขม",
            "elements": [
                  "ลม",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 71,
                  "carbs": 15,
                  "sugar": 0,
                  "fiber": 2,
                  "protein": 1,
                  "fat": 1,
                  "sodium": 15
            }
      },
      {
            "ingredientId": "ing_027",
            "nameTh": "ตะไคร้",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 99,
                  "carbs": 25,
                  "sugar": 0,
                  "fiber": 4,
                  "protein": 1.8,
                  "fat": 0.5,
                  "sodium": 6
            }
      },
      {
            "ingredientId": "ing_145",
            "nameTh": "พริกแห้ง (แกะเมล็ดออก)",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 300,
                  "carbs": 50,
                  "sugar": 7,
                  "fiber": 28,
                  "protein": 12,
                  "fat": 8,
                  "sodium": 30
            }
      },
      {
            "ingredientId": "ing_196",
            "nameTh": "พริกชี้ฟ้าแดง",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 10,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8.8,
                  "sugar": 5.3,
                  "fiber": 1.5,
                  "protein": 1.9,
                  "fat": 0.4,
                  "sodium": 9
            }
      },
      {
            "ingredientId": "ing_041",
            "nameTh": "กะปิ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 25,
            "unit": "g",
            "medicinalTaste": "รสเค็ม/มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 100,
                  "carbs": 3,
                  "sugar": 0.5,
                  "fiber": 0,
                  "protein": 15,
                  "fat": 2,
                  "sodium": 8000
            }
      },
      {
            "ingredientId": "ing_045",
            "nameTh": "น้ำตาลปี๊บ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 380,
                  "carbs": 95,
                  "sugar": 85,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 125
            }
      },
      {
            "ingredientId": "ing_043",
            "nameTh": "ซีอิ๊วดำ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 180,
                  "carbs": 40,
                  "sugar": 35,
                  "fiber": 0,
                  "protein": 4,
                  "fat": 0,
                  "sodium": 4500
            }
      },
      {
            "ingredientId": "ing_044",
            "nameTh": "เกลือ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 5,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 38758
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 992,
            "carbs": 68.5,
            "sugar": 23.9,
            "fiber": 10.3,
            "protein": 43.8,
            "fat": 62.8,
            "sodium": 4761
      },
      "perServing": {
            "calories": 496,
            "carbs": 34.3,
            "sugar": 11.9,
            "fiber": 5.1,
            "protein": 21.9,
            "fat": 31.4,
            "sodium": 2381
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.197Z",
  },
  dish_018: {
    _id: "dish_018",
    nameTh: "ข้าวเหนียวมะม่วง",
    nameEn: "Mango Sticky Rice",
    region: "central",
    regionNameTh: "ภาคกลาง",
    type: "dessert",
    dishType: "dessert",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","น้ำ","ลม","ไฟ"],
    description: "ข้าวเหนียวมูนเมล็ดสวยนุ่มหนึบ ซึมซับกะทิหอมมันกำลังดี เสิร์ฟกับมะม่วงสุกสีทองรสหวานฉ่ำและราดหัวกะทิเค็มอ่อน",
    history: "ขนมไทยที่จับคู่ผลไม้ฤดูร้อนกับภูมิปัญญาการมูนข้าวเหนียว",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "พร้อมรับประทาน แนะนำให้เสิร์ฟเย็น",
    imageUrl: [
      new URL("./assets/central/ID018_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1562607635-4608ff48a859?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 129,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_011",
            "nameTh": "ข้าวเหนียว / ข้าวเหนียวเขี้ยวงู",
            "category": "carb",
            "categoryTh": "แป้ง",
            "quantity": 150,
            "unit": "g",
            "medicinalTaste": "รสหวาน/มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 340,
                  "carbs": 78,
                  "sugar": 0.1,
                  "fiber": 1,
                  "protein": 6.5,
                  "fat": 0.6,
                  "sodium": 5
            }
      },
      {
            "ingredientId": "ing_007",
            "nameTh": "แป้งข้าวเจ้า",
            "category": "carb",
            "categoryTh": "แป้ง",
            "quantity": 150,
            "unit": "g",
            "medicinalTaste": "รสหวาน / จืด",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 366,
                  "carbs": 80,
                  "sugar": 0.1,
                  "fiber": 2.4,
                  "protein": 6,
                  "fat": 1,
                  "sodium": 0
            }
      },
      {
            "ingredientId": "ing_006",
            "nameTh": "ใบเตย",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสหอมเย็น",
            "elements": [
                  "ลม",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 3,
                  "carbs": 0.5,
                  "sugar": 0,
                  "fiber": 0.2,
                  "protein": 0.1,
                  "fat": 0,
                  "sodium": 2
            }
      },
      {
            "ingredientId": "ing_002",
            "nameTh": "มะม่วงสุก",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสหวาน/เปรี้ยว",
            "elements": [
                  "ดิน",
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 60,
                  "carbs": 15,
                  "sugar": 13.7,
                  "fiber": 1.6,
                  "protein": 0.8,
                  "fat": 0.4,
                  "sodium": 1
            }
      },
      {
            "ingredientId": "ing_085",
            "nameTh": "กะทิ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 200,
            "unit": "ml",
            "medicinalTaste": "รสมัน/หวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 230,
                  "carbs": 5.5,
                  "sugar": 3.3,
                  "fiber": 2.2,
                  "protein": 2.3,
                  "fat": 24,
                  "sodium": 15
            }
      },
      {
            "ingredientId": "ing_013",
            "nameTh": "น้ำตาลทรายขาว",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 387,
                  "carbs": 100,
                  "sugar": 100,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 1
            }
      },
      {
            "ingredientId": "ing_044",
            "nameTh": "เกลือ (มูน/ราดหน้า)",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 5,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 38758
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 1602,
            "carbs": 269.2,
            "sugar": 27.4,
            "fiber": 10.2,
            "protein": 23.7,
            "fat": 50.6,
            "sodium": 1977
      },
      "perServing": {
            "calories": 801,
            "carbs": 134.6,
            "sugar": 13.7,
            "fiber": 5.1,
            "protein": 11.9,
            "fat": 25.3,
            "sodium": 988
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.202Z",
  },
  dish_019: {
    _id: "dish_019",
    nameTh: "หน่อไม้หวานต้มกะทิ",
    nameEn: "Sweet Bamboo Shoot in Coconut Milk",
    region: "southern",
    regionNameTh: "ภาคใต้",
    type: "cooking_kit",
    dishType: "curry",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","น้ำ","ลม","ไฟ"],
    description: "หน่อไม้หวานเนื้อนุ่มต้มในน้ำกะทิสดรสหวานมันเค็มอ่อน เติมสะตอและชะอมให้กลิ่นพื้นถิ่นโดดเด่น เป็นแกงใต้รสนุ่มที่กินง่าย",
    history: "อาหารพื้นบ้านใต้ที่ใช้หน่อไม้ตามฤดูกาลจากสวน",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/southern/ID019_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_093",
            "nameTh": "กุ้งแห้งแช่น้ำ",
            "category": "seafood",
            "categoryTh": "เนื้อสัตว์ & อาหารทะเล",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน/ รสเค็ม / หวาน",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 106,
                  "carbs": 0.9,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 20,
                  "fat": 1.7,
                  "sodium": 150
            }
      },
      {
            "ingredientId": "ing_099",
            "nameTh": "หน่อไม้หวานลวก",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 150,
            "unit": "g",
            "medicinalTaste": "รสขม/หวาน",
            "elements": [
                  "น้ำ",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 27,
                  "carbs": 5.2,
                  "sugar": 2.5,
                  "fiber": 2.2,
                  "protein": 2.6,
                  "fat": 0.3,
                  "sodium": 8
            }
      },
      {
            "ingredientId": "ing_098",
            "nameTh": "สะตอ",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสมัน /เผ็ดร้อน",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 130,
                  "carbs": 15.5,
                  "sugar": 2,
                  "fiber": 7,
                  "protein": 8,
                  "fat": 4,
                  "sodium": 10
            }
      },
      {
            "ingredientId": "ing_063",
            "nameTh": "ชะอม",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสจืด / ฝาด",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 93,
                  "carbs": 5,
                  "sugar": 1,
                  "fiber": 5.7,
                  "protein": 9.5,
                  "fat": 3,
                  "sodium": 20
            }
      },
      {
            "ingredientId": "ing_028",
            "nameTh": "หอมแดง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 72,
                  "carbs": 16.8,
                  "sugar": 7.9,
                  "fiber": 3.2,
                  "protein": 2.5,
                  "fat": 0.1,
                  "sodium": 12
            }
      },
      {
            "ingredientId": "ing_197",
            "nameTh": "พริกไทย",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 10,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 250,
                  "carbs": 64,
                  "sugar": 0.6,
                  "fiber": 25,
                  "protein": 10,
                  "fat": 3.3,
                  "sodium": 20
            }
      },
      {
            "ingredientId": "ing_041",
            "nameTh": "กะปิ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 25,
            "unit": "g",
            "medicinalTaste": "รสเค็ม/มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 100,
                  "carbs": 3,
                  "sugar": 0.5,
                  "fiber": 0,
                  "protein": 15,
                  "fat": 2,
                  "sodium": 8000
            }
      },
      {
            "ingredientId": "ing_044",
            "nameTh": "เกลือ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 5,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 38758
            }
      },
      {
            "ingredientId": "ing_083",
            "nameTh": "น้ำตาลทราย",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 387,
                  "carbs": 100,
                  "sugar": 100,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 1
            }
      },
      {
            "ingredientId": "ing_085",
            "nameTh": "กะทิ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 200,
            "unit": "ml",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 230,
                  "carbs": 5.5,
                  "sugar": 3.3,
                  "fiber": 2.2,
                  "protein": 2.3,
                  "fat": 24,
                  "sodium": 15
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 939,
            "carbs": 57.7,
            "sugar": 29.9,
            "fiber": 16.6,
            "protein": 61.3,
            "fat": 55.5,
            "sodium": 4299
      },
      "perServing": {
            "calories": 469,
            "carbs": 28.8,
            "sugar": 14.9,
            "fiber": 8.3,
            "protein": 30.6,
            "fat": 27.8,
            "sodium": 2149
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.208Z",
  },
  dish_020: {
    _id: "dish_020",
    nameTh: "แกงระแวงเนื้อ",
    nameEn: "Beef Rawang Curry",
    region: "southern",
    regionNameTh: "ภาคใต้",
    type: "cooking_kit",
    dishType: "curry",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","ลม"],
    description: "เนื้อวัวเคี่ยวในแกงกะทิขลุกขลิกจนเครื่องเกาะชิ้นเนื้อ รสเข้มข้นคล้ายพะแนง แต่โดดเด่นด้วยกลิ่นขมิ้น ตะไคร้ และสมุนไพรสด",
    history: "แกงไทยโบราณที่มีเรื่องเล่าเชื่อมโยงกับอาหารชวา",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/southern/ID020_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1603099541178-958866380649?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_090",
            "nameTh": "เนื้อวัวร่องซี่โครง",
            "category": "seafood",
            "categoryTh": "เนื้อสัตว์ & อาหารทะเล",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 280,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 24,
                  "fat": 20,
                  "sodium": 60
            }
      },
      {
            "ingredientId": "ing_097",
            "nameTh": "ขมิ้นสด",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสฝาด/เผ็ดร้อน",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 90,
                  "carbs": 20,
                  "sugar": 0.3,
                  "fiber": 6.8,
                  "protein": 1.8,
                  "fat": 1,
                  "sodium": 20
            }
      },
      {
            "ingredientId": "ing_027",
            "nameTh": "ตะไคร้",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 99,
                  "carbs": 25,
                  "sugar": 0,
                  "fiber": 4,
                  "protein": 1.8,
                  "fat": 0.5,
                  "sodium": 6
            }
      },
      {
            "ingredientId": "ing_026",
            "nameTh": "พริกแกงเขียวหวาน (พริกขี้หนูเขียว, หอม, กระเทียม, ข่า, ผิวมะกรูด, เครื่องเทศ)",
            "category": "vegetable",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 71,
                  "carbs": 15,
                  "sugar": 0,
                  "fiber": 2,
                  "protein": 1,
                  "fat": 1,
                  "sodium": 15
            }
      },
      {
            "ingredientId": "ing_107",
            "nameTh": "พริกไทยป่น",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 10,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 250,
                  "carbs": 64,
                  "sugar": 0.6,
                  "fiber": 25,
                  "protein": 10,
                  "fat": 3.3,
                  "sodium": 20
            }
      },
      {
            "ingredientId": "ing_144",
            "nameTh": "พริกขี้หนูเขียวและแดง",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8.8,
                  "sugar": 5.3,
                  "fiber": 1.5,
                  "protein": 1.9,
                  "fat": 0.4,
                  "sodium": 9
            }
      },
      {
            "ingredientId": "ing_045",
            "nameTh": "น้ำตาลปี๊บ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 380,
                  "carbs": 95,
                  "sugar": 85,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 125
            }
      },
      {
            "ingredientId": "ing_042",
            "nameTh": "น้ำปลา",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 35,
                  "carbs": 3.6,
                  "sugar": 3.6,
                  "fiber": 0,
                  "protein": 5.1,
                  "fat": 0,
                  "sodium": 7800
            }
      },
      {
            "ingredientId": "ing_044",
            "nameTh": "เกลือ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 5,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 38758
            }
      },
      {
            "ingredientId": "ing_040",
            "nameTh": "น้ำมันพืช",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "ml",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 884,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 100,
                  "sodium": 0
            }
      },
      {
            "ingredientId": "ing_085",
            "nameTh": "กะทิ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 200,
            "unit": "ml",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 230,
                  "carbs": 5.5,
                  "sugar": 3.3,
                  "fiber": 2.2,
                  "protein": 2.3,
                  "fat": 24,
                  "sodium": 15
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 1352,
            "carbs": 57.7,
            "sugar": 21,
            "fiber": 12.2,
            "protein": 56.7,
            "fat": 104.4,
            "sodium": 3686
      },
      "perServing": {
            "calories": 676,
            "carbs": 28.8,
            "sugar": 10.5,
            "fiber": 6.1,
            "protein": 28.4,
            "fat": 52.2,
            "sodium": 1843
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.213Z",
  },
  dish_021: {
    _id: "dish_021",
    nameTh: "ผัดสะตอกะปิกุ้ง",
    nameEn: "Stir-fried Stink Beans with Shrimp",
    region: "southern",
    regionNameTh: "ภาคใต้",
    type: "cooking_kit",
    dishType: "stir_fry",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","น้ำ","ลม"],
    description: "สะตอเม็ดกรอบผัดไฟแรงกับกุ้งเนื้อเด้งและซอสกะปิเข้มข้น รสเค็มหวานเผ็ดถึงเครื่อง หอมพริกและกะปิแบบอาหารใต้แท้",
    history: "เมนูใต้ที่นำวัตถุดิบประจำถิ่นอย่างสะตอมาปรุงกับกะปิ",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/southern/ID021_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_093",
            "nameTh": "กุ้งสด",
            "category": "seafood",
            "categoryTh": "เนื้อสัตว์ & อาหารทะเล",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน/ รสเค็ม / หวาน",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 106,
                  "carbs": 0.9,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 20,
                  "fat": 1.7,
                  "sodium": 150
            }
      },
      {
            "ingredientId": "ing_091",
            "nameTh": "หมูสันใน",
            "category": "seafood",
            "categoryTh": "เนื้อสัตว์ & อาหารทะเล",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 143,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 26,
                  "fat": 3.5,
                  "sodium": 55
            }
      },
      {
            "ingredientId": "ing_098",
            "nameTh": "สะตอ",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสมัน /เผ็ดร้อน",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 130,
                  "carbs": 15.5,
                  "sugar": 2,
                  "fiber": 7,
                  "protein": 8,
                  "fat": 4,
                  "sodium": 10
            }
      },
      {
            "ingredientId": "ing_028",
            "nameTh": "หอมแดง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 72,
                  "carbs": 16.8,
                  "sugar": 7.9,
                  "fiber": 3.2,
                  "protein": 2.5,
                  "fat": 0.1,
                  "sodium": 12
            }
      },
      {
            "ingredientId": "ing_030",
            "nameTh": "กระเทียม",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 149,
                  "carbs": 33,
                  "sugar": 1,
                  "fiber": 2.1,
                  "protein": 6.4,
                  "fat": 0.5,
                  "sodium": 17
            }
      },
      {
            "ingredientId": "ing_144",
            "nameTh": "พริกขี้หนู",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8.8,
                  "sugar": 5.3,
                  "fiber": 1.5,
                  "protein": 1.9,
                  "fat": 0.4,
                  "sodium": 9
            }
      },
      {
            "ingredientId": "ing_041",
            "nameTh": "กะปิ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 25,
            "unit": "g",
            "medicinalTaste": "รสเค็ม/มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 100,
                  "carbs": 3,
                  "sugar": 0.5,
                  "fiber": 0,
                  "protein": 15,
                  "fat": 2,
                  "sodium": 8000
            }
      },
      {
            "ingredientId": "ing_044",
            "nameTh": "เกลือ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 5,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 38758
            }
      },
      {
            "ingredientId": "ing_047",
            "nameTh": "น้ำมะนาว",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเปรี้ยว",
            "elements": [
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 25,
                  "carbs": 8.4,
                  "sugar": 1.7,
                  "fiber": 0.4,
                  "protein": 0.4,
                  "fat": 0.1,
                  "sodium": 2
            }
      },
      {
            "ingredientId": "ing_115",
            "nameTh": "ซอสน้ำมันหอย",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "ml",
            "medicinalTaste": "รสเค็ม / หวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 51,
                  "carbs": 10.9,
                  "sugar": 8.5,
                  "fiber": 0,
                  "protein": 1.4,
                  "fat": 0.2,
                  "sodium": 3600
            }
      },
      {
            "ingredientId": "ing_083",
            "nameTh": "น้ำตาลทราย",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 387,
                  "carbs": 100,
                  "sugar": 100,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 1
            }
      },
      {
            "ingredientId": "ing_040",
            "nameTh": "น้ำมันพืช",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "ml",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 884,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 100,
                  "sodium": 0
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 873,
            "carbs": 48.3,
            "sugar": 21.9,
            "fiber": 5.2,
            "protein": 103.1,
            "fat": 27.9,
            "sodium": 4905
      },
      "perServing": {
            "calories": 436,
            "carbs": 24.2,
            "sugar": 10.9,
            "fiber": 2.6,
            "protein": 51.5,
            "fat": 13.9,
            "sodium": 2453
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.224Z",
  },
  dish_022: {
    _id: "dish_022",
    nameTh: "ยำไตปลา",
    nameEn: "Spicy Fermented Fish Innards Salad",
    region: "southern",
    regionNameTh: "ภาคใต้",
    type: "cooking_kit",
    dishType: "salad",
    dominantElement: "ลม",
    elementSuitability: ["ดิน","น้ำ","ลม","ไฟ"],
    description: "ไตปลารสเข้มคลุกกับเนื้อปลาทูย่างและสมุนไพรซอยนานาชนิด ปรุงรสเผ็ดเค็มเปรี้ยวจัดจ้าน หอมตะไคร้ ใบมะกรูด และพริกสด",
    history: "การประยุกต์ไตปลาหมักซึ่งเป็นภูมิปัญญาถนอมอาหารของภาคใต้",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/southern/ID022_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1562607635-4608ff48a859?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_095",
            "nameTh": "ไตปลาอย่างดี",
            "category": "seafood",
            "categoryTh": "เนื้อสัตว์ & อาหารทะเล",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน / เค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 85,
                  "carbs": 2,
                  "sugar": 0.5,
                  "fiber": 0,
                  "protein": 14,
                  "fat": 2,
                  "sodium": 5500
            }
      },
      {
            "ingredientId": "ing_094",
            "nameTh": "ปลาทูย่าง",
            "category": "seafood",
            "categoryTh": "เนื้อสัตว์ & อาหารทะเล",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสเค็ม/มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 160,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 25,
                  "fat": 6.5,
                  "sodium": 180
            }
      },
      {
            "ingredientId": "ing_027",
            "nameTh": "ตะไคร้",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 99,
                  "carbs": 25,
                  "sugar": 0,
                  "fiber": 4,
                  "protein": 1.8,
                  "fat": 0.5,
                  "sodium": 6
            }
      },
      {
            "ingredientId": "ing_102",
            "nameTh": "ขิง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 80,
                  "carbs": 17.8,
                  "sugar": 1.7,
                  "fiber": 2,
                  "protein": 1.8,
                  "fat": 0.8,
                  "sodium": 13
            }
      },
      {
            "ingredientId": "ing_028",
            "nameTh": "หอมแดง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 72,
                  "carbs": 16.8,
                  "sugar": 7.9,
                  "fiber": 3.2,
                  "protein": 2.5,
                  "fat": 0.1,
                  "sodium": 12
            }
      },
      {
            "ingredientId": "ing_024",
            "nameTh": "ใบมะกรูด",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8,
                  "sugar": 1,
                  "fiber": 5,
                  "protein": 3,
                  "fat": 0.5,
                  "sodium": 10
            }
      },
      {
            "ingredientId": "ing_144",
            "nameTh": "พริกขี้หนูซอย",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8.8,
                  "sugar": 5.3,
                  "fiber": 1.5,
                  "protein": 1.9,
                  "fat": 0.4,
                  "sodium": 9
            }
      },
      {
            "ingredientId": "ing_047",
            "nameTh": "น้ำมะนาว",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเปรี้ยว",
            "elements": [
                  "น้ำ",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 25,
                  "carbs": 8.4,
                  "sugar": 1.7,
                  "fiber": 0.4,
                  "protein": 0.4,
                  "fat": 0.1,
                  "sodium": 2
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 617,
            "carbs": 34,
            "sugar": 6.4,
            "fiber": 6,
            "protein": 82,
            "fat": 17.8,
            "sodium": 11378
      },
      "perServing": {
            "calories": 309,
            "carbs": 17,
            "sugar": 3.2,
            "fiber": 3,
            "protein": 41,
            "fat": 8.9,
            "sodium": 5689
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.229Z",
  },
  dish_023: {
    _id: "dish_023",
    nameTh: "ไก่กอและ",
    nameEn: "Southern Golek Chicken",
    region: "southern",
    regionNameTh: "ภาคใต้",
    type: "cooking_kit",
    dishType: "grill",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","น้ำ","ลม"],
    description: "ไก่หมักเนื้อนุ่มย่างพร้อมทาเครื่องแกงกะทิสีส้มแดงซ้ำหลายชั้น รสหวานเค็มเผ็ดอ่อน ๆ หอมเครื่องเทศและกลิ่นควันจากเตา",
    history: "อาหารมลายูปักษ์ใต้ที่นิยมในพื้นที่ชายแดนใต้",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/southern/ID023_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_092",
            "nameTh": "สะโพกไก่",
            "category": "seafood",
            "categoryTh": "เนื้อสัตว์ & อาหารทะเล",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 210,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 23,
                  "fat": 13,
                  "sodium": 85
            }
      },
      {
            "ingredientId": "ing_053",
            "nameTh": "กระเทียมสด",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 149,
                  "carbs": 33,
                  "sugar": 1,
                  "fiber": 2.1,
                  "protein": 6.4,
                  "fat": 0.5,
                  "sodium": 17
            }
      },
      {
            "ingredientId": "ing_071",
            "nameTh": "ผงขมิ้น",
            "category": "other",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 20,
            "unit": "g",
            "medicinalTaste": "รสฝาด/เผ็ดร้อน",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 312,
                  "carbs": 65,
                  "sugar": 3,
                  "fiber": 21,
                  "protein": 8,
                  "fat": 3,
                  "sodium": 38
            }
      },
      {
            "ingredientId": "ing_028",
            "nameTh": "หอมแดง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 72,
                  "carbs": 16.8,
                  "sugar": 7.9,
                  "fiber": 3.2,
                  "protein": 2.5,
                  "fat": 0.1,
                  "sodium": 12
            }
      },
      {
            "ingredientId": "ing_075",
            "nameTh": "ยี่หร่าคั่ว",
            "category": "other",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 20,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 375,
                  "carbs": 44,
                  "sugar": 2.2,
                  "fiber": 10.5,
                  "protein": 18,
                  "fat": 22,
                  "sodium": 168
            }
      },
      {
            "ingredientId": "ing_056",
            "nameTh": "ลูกผักชีคั่ว",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 23,
                  "carbs": 3.7,
                  "sugar": 0.9,
                  "fiber": 2.8,
                  "protein": 2.1,
                  "fat": 0.5,
                  "sodium": 46
            }
      },
      {
            "ingredientId": "ing_109",
            "nameTh": "อบเชยป่น",
            "category": "herb_spice",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 10,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 130,
                  "carbs": 20,
                  "sugar": 3.5,
                  "fiber": 8,
                  "protein": 3.5,
                  "fat": 4.5,
                  "sodium": 1600
            }
      },
      {
            "ingredientId": "ing_036",
            "nameTh": "พริกชี้ฟ้าแห้ง",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 10,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8.8,
                  "sugar": 5.3,
                  "fiber": 1.5,
                  "protein": 1.9,
                  "fat": 0.4,
                  "sodium": 9
            }
      },
      {
            "ingredientId": "ing_065",
            "nameTh": "พริกขี้หนูแห้ง",
            "category": "herb_spice",
            "categoryTh": "พริก & เครื่องแกง",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 300,
                  "carbs": 50,
                  "sugar": 7,
                  "fiber": 28,
                  "protein": 12,
                  "fat": 8,
                  "sodium": 30
            }
      },
      {
            "ingredientId": "ing_044",
            "nameTh": "เกลือ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 5,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 38758
            }
      },
      {
            "ingredientId": "ing_041",
            "nameTh": "กะปิ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 25,
            "unit": "g",
            "medicinalTaste": "รสเค็ม/มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 100,
                  "carbs": 3,
                  "sugar": 0.5,
                  "fiber": 0,
                  "protein": 15,
                  "fat": 2,
                  "sodium": 8000
            }
      },
      {
            "ingredientId": "ing_048",
            "nameTh": "น้ำมะขามเปียก",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเปรี้ยว",
            "elements": [
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 120,
                  "carbs": 30,
                  "sugar": 20,
                  "fiber": 2.5,
                  "protein": 1.2,
                  "fat": 0.2,
                  "sodium": 25
            }
      },
      {
            "ingredientId": "ing_045",
            "nameTh": "น้ำตาลปี๊บ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 380,
                  "carbs": 95,
                  "sugar": 85,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 125
            }
      },
      {
            "ingredientId": "ing_042",
            "nameTh": "น้ำปลา",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 35,
                  "carbs": 3.6,
                  "sugar": 3.6,
                  "fiber": 0,
                  "protein": 5.1,
                  "fat": 0,
                  "sodium": 7800
            }
      },
      {
            "ingredientId": "ing_040",
            "nameTh": "น้ำมันพืช",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "ml",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 884,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 100,
                  "sodium": 0
            }
      },
      {
            "ingredientId": "ing_110",
            "nameTh": "กะทิ (คั้นสด / หัวกะทิ / หางกะทิ)",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 200,
            "unit": "ml",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 230,
                  "carbs": 5.5,
                  "sugar": 3.3,
                  "fiber": 2.2,
                  "protein": 2.3,
                  "fat": 24,
                  "sodium": 15
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 1423,
            "carbs": 86.3,
            "sugar": 31.1,
            "fiber": 19.6,
            "protein": 67.6,
            "fat": 96.7,
            "sodium": 5958
      },
      "perServing": {
            "calories": 711,
            "carbs": 43.2,
            "sugar": 15.5,
            "fiber": 9.8,
            "protein": 33.8,
            "fat": 48.3,
            "sodium": 2979
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.236Z",
  },
  dish_024: {
    _id: "dish_024",
    nameTh: "สาคูต้นราดกะทิ",
    nameEn: "Palm Sago with Coconut Milk",
    region: "southern",
    regionNameTh: "ภาคใต้",
    type: "dessert",
    dishType: "dessert",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","ไฟ"],
    description: "เม็ดสาคูต้นแท้ต้มจนใสและนุ่มหนึบเป็นธรรมชาติ ราดด้วยกะทิสดรสหวานมันตัดเค็มเล็กน้อย ให้รสละมุนและกลิ่นหอมแบบขนมพื้นบ้านใต้",
    history: "ขนมจากแป้งสาคูต้นแท้ซึ่งเป็นวัตถุดิบพื้นถิ่นภาคใต้",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "พร้อมรับประทาน แนะนำให้เสิร์ฟเย็น",
    imageUrl: [
      new URL("./assets/southern/ID024_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1603099541178-958866380649?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 129,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_009",
            "nameTh": "แป้งสาคูต้น",
            "category": "carb",
            "categoryTh": "แป้ง",
            "quantity": 100,
            "unit": "g",
            "medicinalTaste": "รสหวาน/จืด",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 350,
                  "carbs": 86,
                  "sugar": 0,
                  "fiber": 0.5,
                  "protein": 0.2,
                  "fat": 0.2,
                  "sodium": 3
            }
      },
      {
            "ingredientId": "ing_013",
            "nameTh": "น้ำตาลทรายขาว",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 387,
                  "carbs": 100,
                  "sugar": 100,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 1
            }
      },
      {
            "ingredientId": "ing_085",
            "nameTh": "กะทิ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 200,
            "unit": "ml",
            "medicinalTaste": "รสมัน/หวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 230,
                  "carbs": 5.5,
                  "sugar": 3.3,
                  "fiber": 2.2,
                  "protein": 2.3,
                  "fat": 24,
                  "sodium": 15
            }
      },
      {
            "ingredientId": "ing_044",
            "nameTh": "เกลือ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 5,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 38758
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 868,
            "carbs": 112,
            "sugar": 21.6,
            "fiber": 4.9,
            "protein": 4.8,
            "fat": 48.2,
            "sodium": 1971
      },
      "perServing": {
            "calories": 434,
            "carbs": 56,
            "sugar": 10.8,
            "fiber": 2.5,
            "protein": 2.4,
            "fat": 24.1,
            "sodium": 986
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.238Z",
  },
  dish_025: {
    _id: "dish_025",
    nameTh: "สปาเกตตีผัดหอยลายน้ำพริกเผา",
    nameEn: "Spaghetti with Clams and Chili Jam",
    region: "fusion",
    regionNameTh: "ไทยฟิวชั่น",
    type: "cooking_kit",
    dishType: "noodle",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","ลม","ไฟ"],
    description: "เส้นสปาเกตตีเหนียวนุ่มผัดกับหอยลายเนื้อหวานและน้ำพริกเผา รสหวานเผ็ดเค็มกลมกล่อม หอมกระเทียมและใบโหระพาแบบไทย",
    history: "เมนูคาเฟ่ยุคใหม่ที่ผสานเส้นอิตาเลียนกับรสผัดไทย",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/fusion/ID025_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_159",
            "nameTh": "เส้นสปาเกตตี",
            "category": "carb",
            "categoryTh": "แป้ง & คาร์โบไฮเดรต",
            "quantity": 150,
            "unit": "g",
            "medicinalTaste": "รสจืด / มัน",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 355,
                  "carbs": 73,
                  "sugar": 2.7,
                  "fiber": 3.2,
                  "protein": 12,
                  "fat": 1.5,
                  "sodium": 6
            }
      },
      {
            "ingredientId": "ing_166",
            "nameTh": "หอยลาย",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสเค็ม /หวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 74,
                  "carbs": 2.6,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 12.7,
                  "fat": 1,
                  "sodium": 300
            }
      },
      {
            "ingredientId": "ing_025",
            "nameTh": "ใบโหระพา",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 23,
                  "carbs": 2.7,
                  "sugar": 0.3,
                  "fiber": 1.6,
                  "protein": 3.1,
                  "fat": 0.6,
                  "sodium": 4
            }
      },
      {
            "ingredientId": "ing_030",
            "nameTh": "กระเทียม",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 149,
                  "carbs": 33,
                  "sugar": 1,
                  "fiber": 2.1,
                  "protein": 6.4,
                  "fat": 0.5,
                  "sodium": 17
            }
      },
      {
            "ingredientId": "ing_198",
            "nameTh": "น้ำพริกเผา",
            "category": "herb_spice",
            "categoryTh": "พริก & พริกแกง",
            "quantity": 10,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน/ เค็ม /มัน/ หวาน",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 420,
                  "carbs": 45,
                  "sugar": 30,
                  "fiber": 3,
                  "protein": 4,
                  "fat": 25,
                  "sodium": 1800
            }
      },
      {
            "ingredientId": "ing_195",
            "nameTh": "พริกขี้หนู (แดง, สวน)",
            "category": "herb_spice",
            "categoryTh": "พริก & พริกแกง",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8.8,
                  "sugar": 5.3,
                  "fiber": 1.5,
                  "protein": 1.9,
                  "fat": 0.4,
                  "sodium": 9
            }
      },
      {
            "ingredientId": "ing_083",
            "nameTh": "น้ำตาลทราย",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 387,
                  "carbs": 100,
                  "sugar": 100,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 1
            }
      },
      {
            "ingredientId": "ing_044",
            "nameTh": "เกลือ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 5,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 38758
            }
      },
      {
            "ingredientId": "ing_040",
            "nameTh": "น้ำมันพืช",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "ml",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 884,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 100,
                  "sodium": 0
            }
      },
      {
            "ingredientId": "ing_042",
            "nameTh": "น้ำปลา",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 35,
                  "carbs": 3.6,
                  "sugar": 3.6,
                  "fiber": 0,
                  "protein": 5.1,
                  "fat": 0,
                  "sodium": 7800
            }
      },
      {
            "ingredientId": "ing_200",
            "nameTh": "ซอสหอยนางรม",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเค็ม/หวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 51,
                  "carbs": 10.9,
                  "sugar": 8.5,
                  "fiber": 0,
                  "protein": 1.4,
                  "fat": 0.2,
                  "sodium": 3600
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 1003,
            "carbs": 152.2,
            "sugar": 25.4,
            "fiber": 6.8,
            "protein": 49.1,
            "fat": 22.3,
            "sodium": 4837
      },
      "perServing": {
            "calories": 501,
            "carbs": 76.1,
            "sugar": 12.7,
            "fiber": 3.4,
            "protein": 24.6,
            "fat": 11.1,
            "sodium": 2418
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.243Z",
  },
  dish_026: {
    _id: "dish_026",
    nameTh: "เปาะเปี๊ยะสดผัดไทยเส้นชาร์โคล",
    nameEn: "Charcoal Pad Thai Fresh Rolls",
    region: "fusion",
    regionNameTh: "ไทยฟิวชั่น",
    type: "cooking_kit",
    dishType: "fusion",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","น้ำ","ลม","ไฟ"],
    description: "ผัดไทยเส้นชาร์โคลสีดำรสเข้มข้น ห่อในแผ่นเปาะเปี๊ยะสดพร้อมผักกรอบ จับกินสะดวกและได้ทั้งความนุ่ม หนึบ และสดชื่นในคำเดียว",
    history: "การรวมสตรีตฟู้ดสองเมนูให้ร่วมสมัยและมีสีสัน",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/fusion/ID026_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1562607635-4608ff48a859?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_162",
            "nameTh": "แผ่นเปาะเปี๊ยะสด",
            "category": "carb",
            "categoryTh": "แป้ง & คาร์โบไฮเดรต",
            "quantity": 100,
            "unit": "g",
            "medicinalTaste": "รสจืด /หวาน",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 290,
                  "carbs": 62,
                  "sugar": 2,
                  "fiber": 1.5,
                  "protein": 7,
                  "fat": 1.2,
                  "sodium": 350
            }
      },
      {
            "ingredientId": "ing_160",
            "nameTh": "เส้นชาร์โคล (ถ่านดูดซับ)",
            "category": "carb",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 150,
            "unit": "g",
            "medicinalTaste": "รสจืด /ฝาด/มัน",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 350,
                  "carbs": 72,
                  "sugar": 2,
                  "fiber": 4,
                  "protein": 11,
                  "fat": 1.5,
                  "sodium": 10
            }
      },
      {
            "ingredientId": "ing_167",
            "nameTh": "กุ้งแชบ๊วย",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน/ รสเค็ม / หวาน",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 106,
                  "carbs": 0.9,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 20,
                  "fat": 1.7,
                  "sodium": 150
            }
      },
      {
            "ingredientId": "ing_171",
            "nameTh": "ไข่ไก่",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสจืด / มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 143,
                  "carbs": 0.7,
                  "sugar": 0.4,
                  "fiber": 0,
                  "protein": 12.6,
                  "fat": 9.5,
                  "sodium": 140
            }
      },
      {
            "ingredientId": "ing_172",
            "nameTh": "เต้าหู้เหลือง",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสจืด /มัน",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 140,
                  "carbs": 3,
                  "sugar": 0.8,
                  "fiber": 1.2,
                  "protein": 14,
                  "fat": 8,
                  "sodium": 15
            }
      },
      {
            "ingredientId": "ing_121",
            "nameTh": "กุ้งแห้ง",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน/ รสเค็ม / หวาน",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 250,
                  "carbs": 1.5,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 50,
                  "fat": 4.5,
                  "sodium": 3500
            }
      },
      {
            "ingredientId": "ing_186",
            "nameTh": "ถั่วงอก",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสจืด",
            "elements": [
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 30,
                  "carbs": 5.9,
                  "sugar": 4.1,
                  "fiber": 1.8,
                  "protein": 3,
                  "fat": 0.2,
                  "sodium": 6
            }
      },
      {
            "ingredientId": "ing_175",
            "nameTh": "ผักชีไทย",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน / จืด",
            "elements": [
                  "ลม",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 23,
                  "carbs": 3.7,
                  "sugar": 0.9,
                  "fiber": 2.8,
                  "protein": 2.1,
                  "fat": 0.5,
                  "sodium": 46
            }
      },
      {
            "ingredientId": "ing_185",
            "nameTh": "ต้นกุยช่าย",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน/มัน",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 30,
                  "carbs": 4.4,
                  "sugar": 1.8,
                  "fiber": 2.5,
                  "protein": 2.4,
                  "fat": 0.5,
                  "sodium": 10
            }
      },
      {
            "ingredientId": "ing_047",
            "nameTh": "มะนาว",
            "category": "seasoning",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเปรี้ยว",
            "elements": [
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 25,
                  "carbs": 8.4,
                  "sugar": 1.7,
                  "fiber": 0.4,
                  "protein": 0.4,
                  "fat": 0.1,
                  "sodium": 2
            }
      },
      {
            "ingredientId": "ing_216",
            "nameTh": "ถั่วลิสงป่น",
            "category": "carb",
            "categoryTh": "ถั่ว & เมล็ดพืช",
            "quantity": 100,
            "unit": "g",
            "medicinalTaste": "รสหวาน / มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 567,
                  "carbs": 16.1,
                  "sugar": 4.7,
                  "fiber": 8.5,
                  "protein": 25.8,
                  "fat": 49.2,
                  "sodium": 18
            }
      },
      {
            "ingredientId": "ing_196",
            "nameTh": "พริกชี้ฟ้าแดง",
            "category": "herb_spice",
            "categoryTh": "พริก & พริกแกง",
            "quantity": 10,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8.8,
                  "sugar": 5.3,
                  "fiber": 1.5,
                  "protein": 1.9,
                  "fat": 0.4,
                  "sodium": 9
            }
      },
      {
            "ingredientId": "ing_202",
            "nameTh": "ไชโป๊สับ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเค็ม/ หวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 180,
                  "carbs": 40,
                  "sugar": 30,
                  "fiber": 4,
                  "protein": 1.5,
                  "fat": 0.2,
                  "sodium": 2800
            }
      },
      {
            "ingredientId": "ing_040",
            "nameTh": "น้ำมันพืช",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "ml",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 884,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 100,
                  "sodium": 0
            }
      },
      {
            "ingredientId": "ing_204",
            "nameTh": "น้ำผัดไทยพร้อมปรุง",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเปรี้ยว /หวาน/ เค็ม",
            "elements": [
                  "ดิน",
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 280,
                  "carbs": 60,
                  "sugar": 50,
                  "fiber": 1,
                  "protein": 1,
                  "fat": 4,
                  "sodium": 2200
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 2904,
            "carbs": 221.5,
            "sugar": 27.7,
            "fiber": 22.2,
            "protein": 246.1,
            "fat": 116.2,
            "sodium": 8769
      },
      "perServing": {
            "calories": 1452,
            "carbs": 110.7,
            "sugar": 13.8,
            "fiber": 11.1,
            "protein": 123.1,
            "fat": 58.1,
            "sodium": 4385
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.248Z",
  },
  dish_027: {
    _id: "dish_027",
    nameTh: "มักกะโรนีต้มยำไข่ชีสทอดกรอบ",
    nameEn: "Tom Yum Macaroni with Crispy Cheese Egg",
    region: "fusion",
    regionNameTh: "ไทยฟิวชั่น",
    type: "cooking_kit",
    dishType: "fusion",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","น้ำ","ลม","ไฟ"],
    description: "มักกะโรนีคลุกซอสต้มยำรสเปรี้ยวเผ็ดหอมสมุนไพร เสิร์ฟกับไข่และชีสทอดจนด้านนอกกรอบ ด้านในนุ่มเยิ้ม เพิ่มความมันให้รสจัดลงตัว",
    history: "เมนูโมเดิร์นฟิวชั่นจากคาเฟ่และคอนเทนต์อาหารร่วมสมัย",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/fusion/ID027_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_163",
            "nameTh": "แป้งอเนกประสงค์",
            "category": "carb",
            "categoryTh": "แป้ง & คาร์โบไฮเดรต",
            "quantity": 100,
            "unit": "g",
            "medicinalTaste": "รสหวาน / รสจืด",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 364,
                  "carbs": 76,
                  "sugar": 0.3,
                  "fiber": 2.7,
                  "protein": 10,
                  "fat": 1,
                  "sodium": 2
            }
      },
      {
            "ingredientId": "ing_164",
            "nameTh": "เกล็ดขนมปัง",
            "category": "carb",
            "categoryTh": "แป้ง & คาร์โบไฮเดรต",
            "quantity": 100,
            "unit": "g",
            "medicinalTaste": "รสหวาน / รสจืด",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 395,
                  "carbs": 72,
                  "sugar": 5,
                  "fiber": 3.5,
                  "protein": 13,
                  "fat": 5,
                  "sodium": 600
            }
      },
      {
            "ingredientId": "ing_089",
            "nameTh": "มักกะโรนีต้มสุก",
            "category": "carb",
            "categoryTh": "แป้ง & คาร์โบไฮเดรต",
            "quantity": 150,
            "unit": "g",
            "medicinalTaste": "รสจืด / มัน",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 280,
                  "carbs": 45,
                  "sugar": 1.5,
                  "fiber": 2,
                  "protein": 8,
                  "fat": 8,
                  "sodium": 180
            }
      },
      {
            "ingredientId": "ing_169",
            "nameTh": "น้ำสต็อกหมู / น้ำซุปกระดูกหมู",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสเค็ม/มันหวาน/",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 35,
                  "carbs": 0.5,
                  "sugar": 0.2,
                  "fiber": 0,
                  "protein": 3,
                  "fat": 2,
                  "sodium": 350
            }
      },
      {
            "ingredientId": "ing_171",
            "nameTh": "ไข่ไก่",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสจืด / มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 143,
                  "carbs": 0.7,
                  "sugar": 0.4,
                  "fiber": 0,
                  "protein": 12.6,
                  "fat": 9.5,
                  "sodium": 140
            }
      },
      {
            "ingredientId": "ing_167",
            "nameTh": "กุ้งแม่น้ำ",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน/ รสเค็ม / หวาน",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 106,
                  "carbs": 0.9,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 20,
                  "fat": 1.7,
                  "sodium": 150
            }
      },
      {
            "ingredientId": "ing_173",
            "nameTh": "พาร์เมซานชีส",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสเค็ม/มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 431,
                  "carbs": 4.1,
                  "sugar": 0.9,
                  "fiber": 0,
                  "protein": 38,
                  "fat": 29,
                  "sodium": 1500
            }
      },
      {
            "ingredientId": "ing_026",
            "nameTh": "ข่า",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน / ขม",
            "elements": [
                  "ลม",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 71,
                  "carbs": 15,
                  "sugar": 0,
                  "fiber": 2,
                  "protein": 1,
                  "fat": 1,
                  "sodium": 15
            }
      },
      {
            "ingredientId": "ing_024",
            "nameTh": "ใบมะกรูด",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8,
                  "sugar": 1,
                  "fiber": 5,
                  "protein": 3,
                  "fat": 0.5,
                  "sodium": 10
            }
      },
      {
            "ingredientId": "ing_027",
            "nameTh": "ตะไคร้",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 99,
                  "carbs": 25,
                  "sugar": 0,
                  "fiber": 4,
                  "protein": 1.8,
                  "fat": 0.5,
                  "sodium": 6
            }
      },
      {
            "ingredientId": "ing_047",
            "nameTh": "มะนาว",
            "category": "seasoning",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเปรี้ยว",
            "elements": [
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 25,
                  "carbs": 8.4,
                  "sugar": 1.7,
                  "fiber": 0.4,
                  "protein": 0.4,
                  "fat": 0.1,
                  "sodium": 2
            }
      },
      {
            "ingredientId": "ing_129",
            "nameTh": "ผักชีฝรั่ง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ด/หอมเย็น",
            "elements": [
                  "ลม",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 35,
                  "carbs": 4.5,
                  "sugar": 0.8,
                  "fiber": 3,
                  "protein": 2.5,
                  "fat": 0.6,
                  "sodium": 30
            }
      },
      {
            "ingredientId": "ing_191",
            "nameTh": "เห็ดหอม",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสจืด /มัน /หวาน",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 34,
                  "carbs": 6.8,
                  "sugar": 2.2,
                  "fiber": 2.5,
                  "protein": 2.2,
                  "fat": 0.5,
                  "sodium": 6
            }
      },
      {
            "ingredientId": "ing_195",
            "nameTh": "พริกขี้หนู (แดง, สวน)",
            "category": "herb_spice",
            "categoryTh": "พริก & พริกแกง",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8.8,
                  "sugar": 5.3,
                  "fiber": 1.5,
                  "protein": 1.9,
                  "fat": 0.4,
                  "sodium": 9
            }
      },
      {
            "ingredientId": "ing_089",
            "nameTh": "ผงปรุงรสต้มยำ",
            "category": "carb",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 150,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน/เปรี้ยว /เค็ม/ มัน/ หวาน",
            "elements": [
                  "ดิน",
                  "น้ำ",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 280,
                  "carbs": 45,
                  "sugar": 1.5,
                  "fiber": 2,
                  "protein": 8,
                  "fat": 8,
                  "sodium": 180
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 3152,
            "carbs": 322.1,
            "sugar": 15.5,
            "fiber": 19.1,
            "protein": 198.8,
            "fat": 115.7,
            "sodium": 5451
      },
      "perServing": {
            "calories": 1576,
            "carbs": 161.1,
            "sugar": 7.8,
            "fiber": 9.6,
            "protein": 99.4,
            "fat": 57.9,
            "sodium": 2725
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.256Z",
  },
  dish_028: {
    _id: "dish_028",
    nameTh: "เกี๊ยวซ่าราดหน้า",
    nameEn: "Gyoza with Thai Gravy",
    region: "fusion",
    regionNameTh: "ไทยฟิวชั่น",
    type: "cooking_kit",
    dishType: "fusion",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","น้ำ","ลม","ไฟ"],
    description: "เกี๊ยวซ่าทอดฐานกรอบไส้แน่น ราดน้ำราดหน้าหอมเต้าเจี้ยวเนื้อข้น พร้อมคะน้าและผักกรอบ เป็นการผสมรสไทยจีนที่ทั้งนุ่มและกรุบ",
    history: "ต่อยอดจากราดหน้าหมี่กรอบโดยใช้เกี๊ยวซ่าแทนเส้น",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/fusion/ID028_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1603099541178-958866380649?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_165",
            "nameTh": "แป้งข้าวโพด",
            "category": "carb",
            "categoryTh": "แป้ง & คาร์โบไฮเดรต",
            "quantity": 150,
            "unit": "g",
            "medicinalTaste": "รสหวาน / รสจืด",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 381,
                  "carbs": 91,
                  "sugar": 0,
                  "fiber": 0.9,
                  "protein": 0.3,
                  "fat": 0.1,
                  "sodium": 9
            }
      },
      {
            "ingredientId": "ing_170",
            "nameTh": "เกี๊ยวซ่าไส้หมู",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสเค็ม/มันหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 210,
                  "carbs": 22,
                  "sugar": 1.5,
                  "fiber": 1.2,
                  "protein": 8.5,
                  "fat": 9.5,
                  "sodium": 480
            }
      },
      {
            "ingredientId": "ing_169",
            "nameTh": "น้ำสต็อกหมู / น้ำซุปกระดูกหมู",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสเค็ม/มันหวาน/",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 35,
                  "carbs": 0.5,
                  "sugar": 0.2,
                  "fiber": 0,
                  "protein": 3,
                  "fat": 2,
                  "sodium": 350
            }
      },
      {
            "ingredientId": "ing_210",
            "nameTh": "ลูกชิ้นนารูโตะ",
            "category": "seasoning",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 110,
                  "carbs": 12,
                  "sugar": 2,
                  "fiber": 0,
                  "protein": 12,
                  "fat": 1,
                  "sodium": 850
            }
      },
      {
            "ingredientId": "ing_187",
            "nameTh": "แครอท",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 41,
                  "carbs": 9.6,
                  "sugar": 4.7,
                  "fiber": 2.8,
                  "protein": 0.9,
                  "fat": 0.2,
                  "sodium": 69
            }
      },
      {
            "ingredientId": "ing_188",
            "nameTh": "กะหล่ำปลี",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสจืด / รสหวาน",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 25,
                  "carbs": 5.8,
                  "sugar": 3.2,
                  "fiber": 2.5,
                  "protein": 1.3,
                  "fat": 0.1,
                  "sodium": 18
            }
      },
      {
            "ingredientId": "ing_183",
            "nameTh": "ต้นหอมญี่ปุ่น",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน / รสหวาน",
            "elements": [
                  "ดิน",
                  "น้ำ",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 61,
                  "carbs": 14,
                  "sugar": 3.9,
                  "fiber": 1.8,
                  "protein": 1.5,
                  "fat": 0.3,
                  "sodium": 20
            }
      },
      {
            "ingredientId": "ing_192",
            "nameTh": "เห็ดชิเมจิ",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสจืด /มัน / หวาน",
            "elements": [
                  "ดิน",
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 35,
                  "carbs": 7,
                  "sugar": 1.8,
                  "fiber": 2.7,
                  "protein": 2.5,
                  "fat": 0.4,
                  "sodium": 5
            }
      },
      {
            "ingredientId": "ing_029",
            "nameTh": "หอมหัวใหญ่",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 9.3,
                  "sugar": 4.2,
                  "fiber": 1.7,
                  "protein": 1.1,
                  "fat": 0.1,
                  "sodium": 4
            }
      },
      {
            "ingredientId": "ing_102",
            "nameTh": "ขิง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 80,
                  "carbs": 17.8,
                  "sugar": 1.7,
                  "fiber": 2,
                  "protein": 1.8,
                  "fat": 0.8,
                  "sodium": 13
            }
      },
      {
            "ingredientId": "ing_030",
            "nameTh": "กระเทียม",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 149,
                  "carbs": 33,
                  "sugar": 1,
                  "fiber": 2.1,
                  "protein": 6.4,
                  "fat": 0.5,
                  "sodium": 17
            }
      },
      {
            "ingredientId": "ing_194",
            "nameTh": "งาขาว",
            "category": "other",
            "categoryTh": "ถั่ว & เมล็ดพืช",
            "quantity": 20,
            "unit": "g",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 573,
                  "carbs": 23.4,
                  "sugar": 0.3,
                  "fiber": 11.8,
                  "protein": 17.7,
                  "fat": 49.7,
                  "sodium": 11
            }
      },
      {
            "ingredientId": "ing_197",
            "nameTh": "พริกไทย",
            "category": "herb_spice",
            "categoryTh": "พริก & พริกแกง",
            "quantity": 10,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 250,
                  "carbs": 64,
                  "sugar": 0.6,
                  "fiber": 25,
                  "protein": 10,
                  "fat": 3.3,
                  "sodium": 20
            }
      },
      {
            "ingredientId": "ing_215",
            "nameTh": "น้ำมันงา",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "ml",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 884,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 100,
                  "sodium": 0
            }
      },
      {
            "ingredientId": "ing_206",
            "nameTh": "มิริน",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 240,
                  "carbs": 55,
                  "sugar": 45,
                  "fiber": 0,
                  "protein": 0.2,
                  "fat": 0,
                  "sodium": 20
            }
      },
      {
            "ingredientId": "ing_200",
            "nameTh": "ซอสหอยนางรม",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเค็ม/หวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 51,
                  "carbs": 10.9,
                  "sugar": 8.5,
                  "fiber": 0,
                  "protein": 1.4,
                  "fat": 0.2,
                  "sodium": 3600
            }
      },
      {
            "ingredientId": "ing_201",
            "nameTh": "โชยุ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเค็ม /หวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 53,
                  "carbs": 4.9,
                  "sugar": 1.7,
                  "fiber": 0.8,
                  "protein": 8.1,
                  "fat": 0.1,
                  "sodium": 5500
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 1574,
            "carbs": 243.6,
            "sugar": 20.3,
            "fiber": 15,
            "protein": 37.4,
            "fat": 49.6,
            "sodium": 3232
      },
      "perServing": {
            "calories": 787,
            "carbs": 121.8,
            "sugar": 10.2,
            "fiber": 7.5,
            "protein": 18.7,
            "fat": 24.8,
            "sodium": 1616
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.261Z",
  },
  dish_029: {
    _id: "dish_029",
    nameTh: "ข้าวมันไก่",
    nameEn: "Hainanese Chicken Rice",
    region: "fusion",
    regionNameTh: "ไทยฟิวชั่น",
    type: "cooking_kit",
    dishType: "rice",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","น้ำ","ลม","ไฟ"],
    description: "ไก่ต้มเนื้อนุ่มฉ่ำเสิร์ฟบนข้าวหุงน้ำซุปที่หอมมันทุกเมล็ด กินคู่กับน้ำจิ้มเต้าเจี้ยวรสเปรี้ยวเผ็ดและซุปร้อนกลมกล่อม",
    history: "เมนูจากชาวไหหลำที่ถูกปรับรสจนเป็นอาหารยอดนิยมของไทย",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/fusion/ID029_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 189,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_007",
            "nameTh": "ข้าว",
            "category": "carb",
            "categoryTh": "แป้ง & คาร์โบไฮเดรต",
            "quantity": 150,
            "unit": "g",
            "medicinalTaste": "รสหวาน / จืด",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 366,
                  "carbs": 80,
                  "sugar": 0.1,
                  "fiber": 2.4,
                  "protein": 6,
                  "fat": 1,
                  "sodium": 0
            }
      },
      {
            "ingredientId": "ing_022",
            "nameTh": "น่อง/สะโพก/อกไก่",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 220,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 18,
                  "fat": 16,
                  "sodium": 80
            }
      },
      {
            "ingredientId": "ing_190",
            "nameTh": "แตงกวา",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสจืด",
            "elements": [
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 15,
                  "carbs": 3.6,
                  "sugar": 1.7,
                  "fiber": 0.5,
                  "protein": 0.7,
                  "fat": 0.1,
                  "sodium": 2
            }
      },
      {
            "ingredientId": "ing_175",
            "nameTh": "ผักชีไทย",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน / จืด",
            "elements": [
                  "ลม",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 23,
                  "carbs": 3.7,
                  "sugar": 0.9,
                  "fiber": 2.8,
                  "protein": 2.1,
                  "fat": 0.5,
                  "sodium": 46
            }
      },
      {
            "ingredientId": "ing_030",
            "nameTh": "กระเทียม",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 149,
                  "carbs": 33,
                  "sugar": 1,
                  "fiber": 2.1,
                  "protein": 6.4,
                  "fat": 0.5,
                  "sodium": 17
            }
      },
      {
            "ingredientId": "ing_174",
            "nameTh": "รากผักชี",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 30,
                  "carbs": 5,
                  "sugar": 0.8,
                  "fiber": 3,
                  "protein": 2,
                  "fat": 0.5,
                  "sodium": 35
            }
      },
      {
            "ingredientId": "ing_102",
            "nameTh": "ขิง",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 80,
                  "carbs": 17.8,
                  "sugar": 1.7,
                  "fiber": 2,
                  "protein": 1.8,
                  "fat": 0.8,
                  "sodium": 13
            }
      },
      {
            "ingredientId": "ing_047",
            "nameTh": "มะนาว",
            "category": "seasoning",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 20,
            "unit": "ml",
            "medicinalTaste": "รสเปรี้ยว",
            "elements": [
                  "น้ำ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 25,
                  "carbs": 8.4,
                  "sugar": 1.7,
                  "fiber": 0.4,
                  "protein": 0.4,
                  "fat": 0.1,
                  "sodium": 2
            }
      },
      {
            "ingredientId": "ing_189",
            "nameTh": "ฟัก",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสจืด",
            "elements": [
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 13,
                  "carbs": 3,
                  "sugar": 1.5,
                  "fiber": 2.9,
                  "protein": 0.4,
                  "fat": 0.2,
                  "sodium": 11
            }
      },
      {
            "ingredientId": "ing_195",
            "nameTh": "พริกขี้หนู (แดง, สวน)",
            "category": "herb_spice",
            "categoryTh": "พริก & พริกแกง",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 40,
                  "carbs": 8.8,
                  "sugar": 5.3,
                  "fiber": 1.5,
                  "protein": 1.9,
                  "fat": 0.4,
                  "sodium": 9
            }
      },
      {
            "ingredientId": "ing_197",
            "nameTh": "พริกไทย",
            "category": "herb_spice",
            "categoryTh": "พริก & พริกแกง",
            "quantity": 10,
            "unit": "g",
            "medicinalTaste": "รสเผ็ดร้อน",
            "elements": [
                  "ลม"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 250,
                  "carbs": 64,
                  "sugar": 0.6,
                  "fiber": 25,
                  "protein": 10,
                  "fat": 3.3,
                  "sodium": 20
            }
      },
      {
            "ingredientId": "ing_044",
            "nameTh": "เกลือ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 5,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 38758
            }
      },
      {
            "ingredientId": "ing_080",
            "nameTh": "ซีอิ๊วขาว",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 60,
                  "carbs": 8,
                  "sugar": 4,
                  "fiber": 0,
                  "protein": 7,
                  "fat": 0,
                  "sodium": 5600
            }
      },
      {
            "ingredientId": "ing_083",
            "nameTh": "น้ำตาลทราย",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 387,
                  "carbs": 100,
                  "sugar": 100,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 1
            }
      },
      {
            "ingredientId": "ing_040",
            "nameTh": "น้ำมันพืช",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "ml",
            "medicinalTaste": "รสมัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 884,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 100,
                  "sodium": 0
            }
      },
      {
            "ingredientId": "ing_203",
            "nameTh": "เต้าเจี้ยว",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสเค็ม /มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 140,
                  "carbs": 18,
                  "sugar": 8,
                  "fiber": 4.5,
                  "protein": 10,
                  "fat": 3,
                  "sodium": 3800
            }
      },
      {
            "ingredientId": "ing_205",
            "nameTh": "ซีอิ๊วหวาน",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน/ เค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 200,
                  "carbs": 48,
                  "sugar": 45,
                  "fiber": 0,
                  "protein": 2,
                  "fat": 0,
                  "sodium": 3200
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 1400,
            "carbs": 181.9,
            "sugar": 27.9,
            "fiber": 12.4,
            "protein": 54.6,
            "fat": 50.4,
            "sodium": 4041
      },
      "perServing": {
            "calories": 700,
            "carbs": 91,
            "sugar": 14,
            "fiber": 6.2,
            "protein": 27.3,
            "fat": 25.2,
            "sodium": 2021
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.268Z",
  },
  dish_030: {
    _id: "dish_030",
    nameTh: "ขนมถ้วยใบเตยไข่หวาน",
    nameEn: "Pandan Coconut Cup with Sweet Egg",
    region: "fusion",
    regionNameTh: "ไทยฟิวชั่น",
    type: "dessert",
    dishType: "dessert",
    dominantElement: "ดิน",
    elementSuitability: ["ดิน","ลม","ไฟ"],
    description: "ขนมถ้วยใบเตยเนื้อนุ่มละมุน หอมกะทิและใบเตยสด รสหวานมันตัดเค็มเล็กน้อย เสิร์ฟกับไข่หวานเนื้อนุ่มเพื่อเพิ่มรสและสัมผัสที่น่าสนใจ",
    history: "ขนมฟิวชั่นที่ต่อยอดขนมถ้วยไทยด้วยองค์ประกอบไข่หวาน",
    storageInstruction: "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "พร้อมรับประทาน แนะนำให้เสิร์ฟเย็น",
    imageUrl: [
      new URL("./assets/fusion/ID030_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1562607635-4608ff48a859?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 129,
    servings: 2,
    recipe: [
      {
            "ingredientId": "ing_001",
            "nameTh": "ไข่แดง (ไส้ไข่หวาน)",
            "category": "meat",
            "categoryTh": "เนื้อสัตว์ & โปรตีน",
            "quantity": 200,
            "unit": "g",
            "medicinalTaste": "รสมัน/หวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 322,
                  "carbs": 3.6,
                  "sugar": 0.6,
                  "fiber": 0,
                  "protein": 16,
                  "fat": 27,
                  "sodium": 50
            }
      },
      {
            "ingredientId": "ing_007",
            "nameTh": "แป้งข้าวเจ้า",
            "category": "carb",
            "categoryTh": "แป้ง",
            "quantity": 150,
            "unit": "g",
            "medicinalTaste": "รสหวาน / จืด",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 366,
                  "carbs": 80,
                  "sugar": 0.1,
                  "fiber": 2.4,
                  "protein": 6,
                  "fat": 1,
                  "sodium": 0
            }
      },
      {
            "ingredientId": "ing_217",
            "nameTh": "แป้งเท้ายายม่อม",
            "category": "carb",
            "categoryTh": "แป้ง",
            "quantity": 100,
            "unit": "g",
            "medicinalTaste": "รสจืด/ฝาด",
            "elements": [
                  "ดิน",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 350,
                  "carbs": 87,
                  "sugar": 0,
                  "fiber": 0.5,
                  "protein": 0.2,
                  "fat": 0.1,
                  "sodium": 5
            }
      },
      {
            "ingredientId": "ing_006",
            "nameTh": "น้ำใบเตยเข้มข้น / กลิ่นใบเตย",
            "category": "vegetable",
            "categoryTh": "ผัก & พืชสมุนไพร",
            "quantity": 40,
            "unit": "g",
            "medicinalTaste": "รสหอมเย็น",
            "elements": [
                  "ลม",
                  "ไฟ"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 3,
                  "carbs": 0.5,
                  "sugar": 0,
                  "fiber": 0.2,
                  "protein": 0.1,
                  "fat": 0,
                  "sodium": 2
            }
      },
      {
            "ingredientId": "ing_013",
            "nameTh": "น้ำตาลทรายขาว",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 387,
                  "carbs": 100,
                  "sugar": 100,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 1
            }
      },
      {
            "ingredientId": "ing_085",
            "nameTh": "กะทิ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 200,
            "unit": "ml",
            "medicinalTaste": "รสมัน/หวาน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 230,
                  "carbs": 5.5,
                  "sugar": 3.3,
                  "fiber": 2.2,
                  "protein": 2.3,
                  "fat": 24,
                  "sodium": 15
            }
      },
      {
            "ingredientId": "ing_044",
            "nameTh": "เกลือ",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 5,
            "unit": "g",
            "medicinalTaste": "รสเค็ม",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 0,
                  "carbs": 0,
                  "sugar": 0,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 38758
            }
      },
      {
            "ingredientId": "ing_015",
            "nameTh": "น้ำตาลมะพร้าว",
            "category": "seasoning",
            "categoryTh": "เครื่องปรุง & ไขมัน",
            "quantity": 15,
            "unit": "g",
            "medicinalTaste": "รสหวาน/มัน",
            "elements": [
                  "ดิน"
            ],
            "basisWeightG": 100,
            "nutrientsPer100g": {
                  "calories": 380,
                  "carbs": 95,
                  "sugar": 85,
                  "fiber": 0,
                  "protein": 0,
                  "fat": 0,
                  "sodium": 125
            }
      }
],
    nutritionCache: {
      "basisWeightUnit": "100g_ingredients",
      "servings": 2,
      "totals": {
            "calories": 2119,
            "carbs": 254.7,
            "sugar": 35.7,
            "fiber": 8.6,
            "protein": 45.8,
            "fat": 103.6,
            "sodium": 2093
      },
      "perServing": {
            "calories": 1060,
            "carbs": 127.3,
            "sugar": 17.9,
            "fiber": 4.3,
            "protein": 22.9,
            "fat": 51.8,
            "sodium": 1046
      }
},
    cookingSteps: [],
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-09-18T07:56:08.273Z",
  },
};

export default dishes;
