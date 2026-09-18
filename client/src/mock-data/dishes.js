// Mock dishes แบบ key-value โดยใช้ _id เป็น key
const dishes = {
  dish_001: {
    _id: "dish_001",
    nameTh: "น้ำพริกอ่อง",
    nameEn: "Northern Thai Tomato Chili Dip",
    region: "northern",
    regionNameTh: "ภาคเหนือ",
    type: "cooking_kit",
    dishType: "dip",
    description: "น้ำพริกมะเขือเทศเคี่ยวกับหมูสับจนเข้มข้น รสเปรี้ยวหวานอมเผ็ด หอมเครื่องแกงแบบล้านนา กินคู่ผักสดกรอบและแคบหมูได้อย่างลงตัว",
    history: "อาหารพื้นเมืองล้านนาที่ใช้มะเขือเทศและหมูสับเป็นตัวชูรส",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/northern/ID001_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_pork_mince",
                "nameTh": "หมูสับอนามัย",
                "nameEn": "Minced Pork",
                "category": "meat",
                "quantity": 180,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 263,
                      "protein": 17,
                      "carbs": 0,
                      "fat": 21,
                      "fiber": 0,
                      "sodium": 65
                }
          },
          {
                "ingredientId": "ing_tomato_cherry",
                "nameTh": "มะเขือเทศสีดา",
                "nameEn": "Cherry Tomatoes",
                "category": "vegetable",
                "quantity": 150,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 18,
                      "protein": 0.9,
                      "carbs": 3.9,
                      "fat": 0.2,
                      "fiber": 1.2,
                      "sodium": 5
                }
          },
          {
                "ingredientId": "ing_garlic_thai",
                "nameTh": "กระเทียมไทยแกะกลีบ",
                "nameEn": "Thai Garlic Cloves",
                "category": "herb_spice",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 149,
                      "protein": 6.4,
                      "carbs": 33.1,
                      "fat": 0.5,
                      "fiber": 2.1,
                      "sodium": 17
                }
          },
          {
                "ingredientId": "ing_shallot",
                "nameTh": "หอมแดงซอย",
                "nameEn": "Sliced Shallots",
                "category": "herb_spice",
                "quantity": 30,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 72,
                      "protein": 2.5,
                      "carbs": 16.8,
                      "fat": 0.1,
                      "fiber": 3.2,
                      "sodium": 12
                }
          },
          {
                "ingredientId": "ing_chili_jinda",
                "nameTh": "พริกขี้หนูจินดา",
                "nameEn": "Bird's Eye Red Chili",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 40,
                      "protein": 1.9,
                      "carbs": 8.8,
                      "fat": 0.4,
                      "fiber": 1.5,
                      "sodium": 9
                }
          },
          {
                "ingredientId": "ing_fish_sauce",
                "nameTh": "น้ำปลาแท้เกรดพรีเมียม",
                "nameEn": "Premium Fish Sauce",
                "category": "seasoning",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 35,
                      "protein": 6,
                      "carbs": 2.5,
                      "fat": 0,
                      "fiber": 0,
                      "sodium": 7200
                }
          },
          {
                "ingredientId": "ing_palm_sugar",
                "nameTh": "น้ำตาลมะพร้าวอัมพวา",
                "nameEn": "Pure Coconut Palm Sugar",
                "category": "seasoning",
                "quantity": 10,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 380,
                      "protein": 0.2,
                      "carbs": 95,
                      "fat": 0.1,
                      "fiber": 0,
                      "sodium": 40
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 601,
                "protein": 35.2,
                "carbs": 28.7,
                "fat": 38.3,
                "fiber": 3.4,
                "sodium": 1217
          },
          "perServing": {
                "calories": 301,
                "protein": 17.6,
                "carbs": 14.4,
                "fat": 19.2,
                "fiber": 1.7,
                "sodium": 608
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_002: {
    _id: "dish_002",
    nameTh: "ข้าวซอยไก่",
    nameEn: "Northern Thai Chicken Khao Soi",
    region: "northern",
    regionNameTh: "ภาคเหนือ",
    type: "cooking_kit",
    dishType: "noodle",
    description: "บะหมี่เหนียวนุ่มในน้ำแกงกะทิสีทองเข้มข้น หอมเครื่องเทศและพริกแกง เสิร์ฟพร้อมน่องไก่นุ่ม เส้นกรอบ และเครื่องเคียงตัดรส",
    history: "เมนูเส้นล้านนาที่สะท้อนอิทธิพลการค้าระหว่างจีนฮ่อและพม่า",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/northern/ID002_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1562607635-4608ff48a859?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_chicken_drumstick",
                "nameTh": "น่องไก่สด",
                "nameEn": "Chicken Drumstick",
                "category": "poultry",
                "quantity": 250,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 172,
                      "protein": 28.3,
                      "carbs": 0,
                      "fat": 5.7,
                      "fiber": 0,
                      "sodium": 86
                }
          },
          {
                "ingredientId": "ing_egg_noodle",
                "nameTh": "บะหมี่ไข่เส้นแบน",
                "nameEn": "Flat Egg Noodles",
                "category": "carb",
                "quantity": 150,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 280,
                      "protein": 10.2,
                      "carbs": 54.8,
                      "fat": 2.5,
                      "fiber": 2,
                      "sodium": 180
                }
          },
          {
                "ingredientId": "ing_coconut_milk",
                "nameTh": "หัวกะทิคั้นสด 100%",
                "nameEn": "Fresh Coconut Milk",
                "category": "coconut",
                "quantity": 250,
                "unit": "ml",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 230,
                      "protein": 2.3,
                      "carbs": 5.5,
                      "fat": 23.8,
                      "fiber": 2.2,
                      "sodium": 15
                }
          },
          {
                "ingredientId": "ing_curry_paste_khao_soi",
                "nameTh": "พริกแกงข้าวซอยสูตรเมืองเหนือ",
                "nameEn": "Northern Khao Soi Curry Paste",
                "category": "seasoning",
                "quantity": 50,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 118,
                      "protein": 3.5,
                      "carbs": 16.2,
                      "fat": 4.3,
                      "fiber": 5.2,
                      "sodium": 1650
                }
          },
          {
                "ingredientId": "ing_shallot",
                "nameTh": "หอมแดงซอย",
                "nameEn": "Sliced Shallots",
                "category": "herb_spice",
                "quantity": 25,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 72,
                      "protein": 2.5,
                      "carbs": 16.8,
                      "fat": 0.1,
                      "fiber": 3.2,
                      "sodium": 12
                }
          },
          {
                "ingredientId": "ing_lime_juice",
                "nameTh": "น้ำมะนาวแท้คั้นสด",
                "nameEn": "Fresh Squeezed Lime Juice",
                "category": "seasoning",
                "quantity": 15,
                "unit": "ml",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 25,
                      "protein": 0.4,
                      "carbs": 8.4,
                      "fat": 0.1,
                      "fiber": 0.4,
                      "sodium": 2
                }
          },
          {
                "ingredientId": "ing_palm_sugar",
                "nameTh": "น้ำตาลมะพร้าวอัมพวา",
                "nameEn": "Pure Coconut Palm Sugar",
                "category": "seasoning",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 380,
                      "protein": 0.2,
                      "carbs": 95,
                      "fat": 0.1,
                      "fiber": 0,
                      "sodium": 40
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 1563,
                "protein": 94.3,
                "carbs": 123.8,
                "fat": 79.7,
                "fiber": 12,
                "sodium": 1357
          },
          "perServing": {
                "calories": 781,
                "protein": 47.1,
                "carbs": 61.9,
                "fat": 39.9,
                "fiber": 6,
                "sodium": 678
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_003: {
    _id: "dish_003",
    nameTh: "ลาบคั่วเมือง",
    nameEn: "Northern Spiced Larb",
    region: "northern",
    regionNameTh: "ภาคเหนือ",
    type: "cooking_kit",
    dishType: "salad",
    description: "ลาบสุกแบบเมืองเหนือคลุกพริกลาบและเครื่องเทศคั่ว หอมมะแขว่นโดดเด่น รสเค็มเผ็ดซับซ้อน พร้อมกลิ่นสมุนไพรสดในทุกคำ",
    history: "ลาบเหนือแตกต่างจากลาบอีสานด้วยพริกลาบและการคั่วจนหอม",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/northern/ID003_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_pork_mince",
                "nameTh": "หมูสับอนามัย",
                "nameEn": "Minced Pork",
                "category": "meat",
                "quantity": 220,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 263,
                      "protein": 17,
                      "carbs": 0,
                      "fat": 21,
                      "fiber": 0,
                      "sodium": 65
                }
          },
          {
                "ingredientId": "ing_shallot",
                "nameTh": "หอมแดงซอย",
                "nameEn": "Sliced Shallots",
                "category": "herb_spice",
                "quantity": 25,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 72,
                      "protein": 2.5,
                      "carbs": 16.8,
                      "fat": 0.1,
                      "fiber": 3.2,
                      "sodium": 12
                }
          },
          {
                "ingredientId": "ing_garlic_thai",
                "nameTh": "กระเทียมไทยแกะกลีบ",
                "nameEn": "Thai Garlic Cloves",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 149,
                      "protein": 6.4,
                      "carbs": 33.1,
                      "fat": 0.5,
                      "fiber": 2.1,
                      "sodium": 17
                }
          },
          {
                "ingredientId": "ing_culantro",
                "nameTh": "ผักชีฝรั่ง",
                "nameEn": "Sawtooth Coriander / Culantro",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 25,
                      "protein": 2,
                      "carbs": 4,
                      "fat": 0.5,
                      "fiber": 2.5,
                      "sodium": 15
                }
          },
          {
                "ingredientId": "ing_mint",
                "nameTh": "ใบสะระแหน่",
                "nameEn": "Fresh Mint Leaves",
                "category": "herb_spice",
                "quantity": 10,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 44,
                      "protein": 3.3,
                      "carbs": 8.4,
                      "fat": 0.7,
                      "fiber": 6.8,
                      "sodium": 31
                }
          },
          {
                "ingredientId": "ing_fish_sauce",
                "nameTh": "น้ำปลาแท้เกรดพรีเมียม",
                "nameEn": "Premium Fish Sauce",
                "category": "seasoning",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 35,
                      "protein": 6,
                      "carbs": 2.5,
                      "fat": 0,
                      "fiber": 0,
                      "sodium": 7200
                }
          },
          {
                "ingredientId": "ing_roasted_rice_powder",
                "nameTh": "ข้าวคั่วหอมกลิ่นใบมะกรูด",
                "nameEn": "Toasted Rice Powder",
                "category": "seasoning",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 360,
                      "protein": 7.5,
                      "carbs": 78,
                      "fat": 1.5,
                      "fiber": 3.2,
                      "sodium": 5
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 686,
                "protein": 41.6,
                "carbs": 22.7,
                "fat": 46.7,
                "fiber": 2.7,
                "sodium": 1235
          },
          "perServing": {
                "calories": 343,
                "protein": 20.8,
                "carbs": 11.3,
                "fat": 23.3,
                "fiber": 1.3,
                "sodium": 617
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_004: {
    _id: "dish_004",
    nameTh: "แกงฮังเล",
    nameEn: "Northern Hang Lay Curry",
    region: "northern",
    regionNameTh: "ภาคเหนือ",
    type: "cooking_kit",
    dishType: "curry",
    description: "หมูเนื้อนุ่มเคี่ยวช้าในน้ำแกงเข้มข้นจนเครื่องซึมเข้าเนื้อ รสเค็ม เปรี้ยว และหวานกลมกล่อม หอมขิง กระเทียม และเครื่องเทศแบบล้านนา",
    history: "อาหารล้านนาที่ได้รับอิทธิพลจากพม่าและนิยมทำในงานบุญ",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/northern/ID004_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1603099541178-958866380649?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_pork_belly",
                "nameTh": "หมูสามชั้น",
                "nameEn": "Pork Belly",
                "category": "meat",
                "quantity": 250,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 518,
                      "protein": 9.3,
                      "carbs": 0,
                      "fat": 53,
                      "fiber": 0,
                      "sodium": 32
                }
          },
          {
                "ingredientId": "ing_curry_paste_hung_lay",
                "nameTh": "พริกแกงฮังเลและผงฮังเล",
                "nameEn": "Hung Lay Curry Paste & Masala Spice",
                "category": "seasoning",
                "quantity": 50,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 135,
                      "protein": 4.1,
                      "carbs": 18,
                      "fat": 5.2,
                      "fiber": 6,
                      "sodium": 1720
                }
          },
          {
                "ingredientId": "ing_shallot",
                "nameTh": "หอมแดงซอย",
                "nameEn": "Sliced Shallots",
                "category": "herb_spice",
                "quantity": 30,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 72,
                      "protein": 2.5,
                      "carbs": 16.8,
                      "fat": 0.1,
                      "fiber": 3.2,
                      "sodium": 12
                }
          },
          {
                "ingredientId": "ing_garlic_thai",
                "nameTh": "กระเทียมไทยแกะกลีบ",
                "nameEn": "Thai Garlic Cloves",
                "category": "herb_spice",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 149,
                      "protein": 6.4,
                      "carbs": 33.1,
                      "fat": 0.5,
                      "fiber": 2.1,
                      "sodium": 17
                }
          },
          {
                "ingredientId": "ing_tamarind_paste",
                "nameTh": "น้ำมะขามเปียกคั้นเข้มข้น",
                "nameEn": "Concentrated Tamarind Paste",
                "category": "seasoning",
                "quantity": 30,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 239,
                      "protein": 2.8,
                      "carbs": 62.5,
                      "fat": 0.6,
                      "fiber": 5.1,
                      "sodium": 28
                }
          },
          {
                "ingredientId": "ing_palm_sugar",
                "nameTh": "น้ำตาลมะพร้าวอัมพวา",
                "nameEn": "Pure Coconut Palm Sugar",
                "category": "seasoning",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 380,
                      "protein": 0.2,
                      "carbs": 95,
                      "fat": 0.1,
                      "fiber": 0,
                      "sodium": 40
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 1562,
                "protein": 28.2,
                "carbs": 58.4,
                "fat": 135.4,
                "fiber": 5.9,
                "sodium": 963
          },
          "perServing": {
                "calories": 781,
                "protein": 14.1,
                "carbs": 29.2,
                "fat": 67.7,
                "fiber": 3,
                "sodium": 482
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_005: {
    _id: "dish_005",
    nameTh: "แกงขนุน",
    nameEn: "Young Jackfruit Curry",
    region: "northern",
    regionNameTh: "ภาคเหนือ",
    type: "cooking_kit",
    dishType: "curry",
    description: "ขนุนอ่อนต้มจนนุ่มแล้วแกงกับพริกแกงพื้นเมือง รสเผ็ดเค็มกำลังดี หอมชะอม ใบชะพลู และสมุนไพรที่ให้รสบ้าน ๆ อบอุ่น",
    history: "เมนูมงคลของชาวเหนือ เชื่อว่าชื่อขนุนช่วยหนุนนำสิ่งดี",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/northern/ID005_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_pork_mince",
                "nameTh": "หมูสับอนามัย",
                "nameEn": "Minced Pork",
                "category": "meat",
                "quantity": 150,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 263,
                      "protein": 17,
                      "carbs": 0,
                      "fat": 21,
                      "fiber": 0,
                      "sodium": 65
                }
          },
          {
                "ingredientId": "ing_tomato_cherry",
                "nameTh": "มะเขือเทศสีดา",
                "nameEn": "Cherry Tomatoes",
                "category": "vegetable",
                "quantity": 100,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 18,
                      "protein": 0.9,
                      "carbs": 3.9,
                      "fat": 0.2,
                      "fiber": 1.2,
                      "sodium": 5
                }
          },
          {
                "ingredientId": "ing_shallot",
                "nameTh": "หอมแดงซอย",
                "nameEn": "Sliced Shallots",
                "category": "herb_spice",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 72,
                      "protein": 2.5,
                      "carbs": 16.8,
                      "fat": 0.1,
                      "fiber": 3.2,
                      "sodium": 12
                }
          },
          {
                "ingredientId": "ing_garlic_thai",
                "nameTh": "กระเทียมไทยแกะกลีบ",
                "nameEn": "Thai Garlic Cloves",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 149,
                      "protein": 6.4,
                      "carbs": 33.1,
                      "fat": 0.5,
                      "fiber": 2.1,
                      "sodium": 17
                }
          },
          {
                "ingredientId": "ing_fish_sauce",
                "nameTh": "น้ำปลาแท้เกรดพรีเมียม",
                "nameEn": "Premium Fish Sauce",
                "category": "seasoning",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 35,
                      "protein": 6,
                      "carbs": 2.5,
                      "fat": 0,
                      "fiber": 0,
                      "sodium": 7200
                }
          },
          {
                "ingredientId": "ing_chili_jinda",
                "nameTh": "พริกขี้หนูจินดา",
                "nameEn": "Bird's Eye Red Chili",
                "category": "herb_spice",
                "quantity": 10,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 40,
                      "protein": 1.9,
                      "carbs": 8.8,
                      "fat": 0.4,
                      "fiber": 1.5,
                      "sodium": 9
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 459,
                "protein": 29,
                "carbs": 13.5,
                "fat": 31.8,
                "fiber": 2.3,
                "sodium": 1188
          },
          "perServing": {
                "calories": 229,
                "protein": 14.5,
                "carbs": 6.7,
                "fat": 15.9,
                "fiber": 1.2,
                "sodium": 594
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_006: {
    _id: "dish_006",
    nameTh: "ข้าวแต๋น",
    nameEn: "Northern Crispy Rice Cracker",
    region: "northern",
    regionNameTh: "ภาคเหนือ",
    type: "dessert",
    dishType: "dessert",
    description: "ข้าวเหนียวนึ่งตากแห้งทอดจนพองกรอบ ราดน้ำอ้อยหอมหวานเป็นเส้นบาง ๆ เนื้อสัมผัสเบา กรอบเพลิน เหมาะกับชาและกาแฟ",
    history: "ภูมิปัญญาถนอมข้าวเหนียวนึ่งที่เหลือของชุมชนภาคเหนือ",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "พร้อมรับประทาน แนะนำให้เสิร์ฟเย็น",
    imageUrl: [
      new URL("./assets/northern/ID006_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1562607635-4608ff48a859?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 129,
    recipe: [
          {
                "ingredientId": "ing_rice_noodle",
                "nameTh": "เส้นก๋วยเตี๋ยว / ขนมจีน",
                "nameEn": "Rice Noodles",
                "category": "carb",
                "quantity": 150,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 109,
                      "protein": 1.9,
                      "carbs": 24.9,
                      "fat": 0.2,
                      "fiber": 0.8,
                      "sodium": 12
                }
          },
          {
                "ingredientId": "ing_palm_sugar",
                "nameTh": "น้ำตาลมะพร้าวอัมพวา",
                "nameEn": "Pure Coconut Palm Sugar",
                "category": "seasoning",
                "quantity": 40,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 380,
                      "protein": 0.2,
                      "carbs": 95,
                      "fat": 0.1,
                      "fiber": 0,
                      "sodium": 40
                }
          },
          {
                "ingredientId": "ing_coconut_milk",
                "nameTh": "หัวกะทิคั้นสด 100%",
                "nameEn": "Fresh Coconut Milk",
                "category": "coconut",
                "quantity": 50,
                "unit": "ml",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 230,
                      "protein": 2.3,
                      "carbs": 5.5,
                      "fat": 23.8,
                      "fiber": 2.2,
                      "sodium": 15
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 431,
                "protein": 4.1,
                "carbs": 78.1,
                "fat": 12.2,
                "fiber": 2.3,
                "sodium": 42
          },
          "perServing": {
                "calories": 215,
                "protein": 2,
                "carbs": 39.1,
                "fat": 6.1,
                "fiber": 1.2,
                "sodium": 21
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_007: {
    _id: "dish_007",
    nameTh: "ข้าวปุ้นซาวน้ำปลาร้า",
    nameEn: "Isan Rice Noodles with Fermented Fish",
    region: "northeastern",
    regionNameTh: "ภาคอีสาน",
    type: "cooking_kit",
    dishType: "noodle",
    description: "เส้นขนมจีนเหนียวนุ่มคลุกน้ำปลาร้าปรุงรสนัว หอมพริกและสมุนไพร เสิร์ฟกับผักสดหลากชนิด ให้รสเค็มเผ็ดและสดชื่นในจานเดียว",
    history: "อาหารกินง่ายของชาวอีสานที่เรียกเส้นขนมจีนว่าข้าวปุ้น",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/northeastern/ID007_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_rice_noodle",
                "nameTh": "เส้นก๋วยเตี๋ยว / ขนมจีน",
                "nameEn": "Rice Noodles",
                "category": "carb",
                "quantity": 200,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 109,
                      "protein": 1.9,
                      "carbs": 24.9,
                      "fat": 0.2,
                      "fiber": 0.8,
                      "sodium": 12
                }
          },
          {
                "ingredientId": "ing_pla_ra",
                "nameTh": "น้ำปลาร้าต้มสุกปรุงรส",
                "nameEn": "Cooked Fermented Fish Sauce",
                "category": "seasoning",
                "quantity": 40,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 45,
                      "protein": 7.5,
                      "carbs": 3,
                      "fat": 0.3,
                      "fiber": 0,
                      "sodium": 5800
                }
          },
          {
                "ingredientId": "ing_chili_jinda",
                "nameTh": "พริกขี้หนูจินดา",
                "nameEn": "Bird's Eye Red Chili",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 40,
                      "protein": 1.9,
                      "carbs": 8.8,
                      "fat": 0.4,
                      "fiber": 1.5,
                      "sodium": 9
                }
          },
          {
                "ingredientId": "ing_string_bean",
                "nameTh": "ถั่วฝักยาว",
                "nameEn": "Yardlong Beans",
                "category": "vegetable",
                "quantity": 50,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 47,
                      "protein": 2.8,
                      "carbs": 8.4,
                      "fat": 0.4,
                      "fiber": 3.6,
                      "sodium": 4
                }
          },
          {
                "ingredientId": "ing_lime_juice",
                "nameTh": "น้ำมะนาวแท้คั้นสด",
                "nameEn": "Fresh Squeezed Lime Juice",
                "category": "seasoning",
                "quantity": 20,
                "unit": "ml",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 25,
                      "protein": 0.4,
                      "carbs": 8.4,
                      "fat": 0.1,
                      "fiber": 0.4,
                      "sodium": 2
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 271,
                "protein": 8.6,
                "carbs": 58.2,
                "fat": 0.8,
                "fiber": 3.7,
                "sodium": 2348
          },
          "perServing": {
                "calories": 135,
                "protein": 4.3,
                "carbs": 29.1,
                "fat": 0.4,
                "fiber": 1.9,
                "sodium": 1174
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_008: {
    _id: "dish_008",
    nameTh: "แกงอ่อม",
    nameEn: "Isan Herb Curry",
    region: "northeastern",
    regionNameTh: "ภาคอีสาน",
    type: "cooking_kit",
    dishType: "curry",
    description: "แกงน้ำขลุกขลิกที่รวมเนื้อและผักตามฤดูกาลไว้เต็มหม้อ รสเค็มเผ็ดนัวจากปลาร้า หอมผักชีลาว ต้นหอม และสมุนไพรอีสาน",
    history: "แกงพื้นบ้านอีสานที่รวมผักตามฤดูกาลไว้ในหม้อเดียว",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/northeastern/ID008_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1603099541178-958866380649?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_beef_shank",
                "nameTh": "เนื้อวัวน่องลาย",
                "nameEn": "Beef Shank",
                "category": "meat",
                "quantity": 200,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 201,
                      "protein": 34,
                      "carbs": 0,
                      "fat": 6.2,
                      "fiber": 0,
                      "sodium": 55
                }
          },
          {
                "ingredientId": "ing_culantro",
                "nameTh": "ผักชีฝรั่ง",
                "nameEn": "Sawtooth Coriander / Culantro",
                "category": "herb_spice",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 25,
                      "protein": 2,
                      "carbs": 4,
                      "fat": 0.5,
                      "fiber": 2.5,
                      "sodium": 15
                }
          },
          {
                "ingredientId": "ing_string_bean",
                "nameTh": "ถั่วฝักยาว",
                "nameEn": "Yardlong Beans",
                "category": "vegetable",
                "quantity": 40,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 47,
                      "protein": 2.8,
                      "carbs": 8.4,
                      "fat": 0.4,
                      "fiber": 3.6,
                      "sodium": 4
                }
          },
          {
                "ingredientId": "ing_shallot",
                "nameTh": "หอมแดงซอย",
                "nameEn": "Sliced Shallots",
                "category": "herb_spice",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 72,
                      "protein": 2.5,
                      "carbs": 16.8,
                      "fat": 0.1,
                      "fiber": 3.2,
                      "sodium": 12
                }
          },
          {
                "ingredientId": "ing_pla_ra",
                "nameTh": "น้ำปลาร้าต้มสุกปรุงรส",
                "nameEn": "Cooked Fermented Fish Sauce",
                "category": "seasoning",
                "quantity": 25,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 45,
                      "protein": 7.5,
                      "carbs": 3,
                      "fat": 0.3,
                      "fiber": 0,
                      "sodium": 5800
                }
          },
          {
                "ingredientId": "ing_roasted_rice_powder",
                "nameTh": "ข้าวคั่วหอมกลิ่นใบมะกรูด",
                "nameEn": "Toasted Rice Powder",
                "category": "seasoning",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 360,
                      "protein": 7.5,
                      "carbs": 78,
                      "fat": 1.5,
                      "fiber": 3.2,
                      "sodium": 5
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 505,
                "protein": 73,
                "carbs": 20,
                "fat": 13,
                "fiber": 3.1,
                "sodium": 1568
          },
          "perServing": {
                "calories": 253,
                "protein": 36.5,
                "carbs": 10,
                "fat": 6.5,
                "fiber": 1.5,
                "sodium": 784
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_009: {
    _id: "dish_009",
    nameTh: "แกงหน่อไม้ใบย่านาง",
    nameEn: "Bamboo Shoot Curry with Yanang",
    region: "northeastern",
    regionNameTh: "ภาคอีสาน",
    type: "cooking_kit",
    dishType: "curry",
    description: "หน่อไม้ต้มจนหมดรสขื่นในน้ำใบย่านางสีเขียวเข้ม ปรุงรสนัวด้วยปลาร้า เติมเห็ดและผักพื้นบ้าน ได้แกงหอมสมุนไพรที่กินกับข้าวเหนียวพอดี",
    history: "ภูมิปัญญาอีสานใช้ใบย่านางลดรสขื่นของหน่อไม้",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/northeastern/ID009_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_bamboo_shoot",
                "nameTh": "หน่อไม้ต้ม",
                "nameEn": "Boiled Bamboo Shoot",
                "category": "vegetable",
                "quantity": 180,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 27,
                      "protein": 2.6,
                      "carbs": 5.2,
                      "fat": 0.3,
                      "fiber": 2.2,
                      "sodium": 4
                }
          },
          {
                "ingredientId": "ing_pla_ra",
                "nameTh": "น้ำปลาร้าต้มสุกปรุงรส",
                "nameEn": "Cooked Fermented Fish Sauce",
                "category": "seasoning",
                "quantity": 30,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 45,
                      "protein": 7.5,
                      "carbs": 3,
                      "fat": 0.3,
                      "fiber": 0,
                      "sodium": 5800
                }
          },
          {
                "ingredientId": "ing_chili_jinda",
                "nameTh": "พริกขี้หนูจินดา",
                "nameEn": "Bird's Eye Red Chili",
                "category": "herb_spice",
                "quantity": 10,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 40,
                      "protein": 1.9,
                      "carbs": 8.8,
                      "fat": 0.4,
                      "fiber": 1.5,
                      "sodium": 9
                }
          },
          {
                "ingredientId": "ing_shallot",
                "nameTh": "หอมแดงซอย",
                "nameEn": "Sliced Shallots",
                "category": "herb_spice",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 72,
                      "protein": 2.5,
                      "carbs": 16.8,
                      "fat": 0.1,
                      "fiber": 3.2,
                      "sodium": 12
                }
          },
          {
                "ingredientId": "ing_roasted_rice_powder",
                "nameTh": "ข้าวคั่วหอมกลิ่นใบมะกรูด",
                "nameEn": "Toasted Rice Powder",
                "category": "seasoning",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 360,
                      "protein": 7.5,
                      "carbs": 78,
                      "fat": 1.5,
                      "fiber": 3.2,
                      "sodium": 5
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 135,
                "protein": 8.7,
                "carbs": 26.2,
                "fat": 0.9,
                "fiber": 5.2,
                "sodium": 1751
          },
          "perServing": {
                "calories": 67,
                "protein": 4.4,
                "carbs": 13.1,
                "fat": 0.5,
                "fiber": 2.6,
                "sodium": 876
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_010: {
    _id: "dish_010",
    nameTh: "ส้มตำไทย",
    nameEn: "Thai Green Papaya Salad",
    region: "northeastern",
    regionNameTh: "ภาคอีสาน",
    type: "cooking_kit",
    dishType: "salad",
    description: "มะละกอดิบเส้นกรอบตำกับมะเขือเทศ ถั่วฝักยาว และถั่วลิสง ปรุงรสเปรี้ยวหวานเค็มอย่างสมดุล เผ็ดกำลังดีและหอมมะนาวสด",
    history: "เมนูตำมะละกอที่แพร่หลายและปรับรสให้กลมกล่อมแบบไทยกลาง",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/northeastern/ID010_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1562607635-4608ff48a859?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_green_papaya",
                "nameTh": "มะละกอดิบสับเส้น",
                "nameEn": "Shredded Green Papaya",
                "category": "vegetable",
                "quantity": 180,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 39,
                      "protein": 0.6,
                      "carbs": 9.8,
                      "fat": 0.1,
                      "fiber": 1.8,
                      "sodium": 3
                }
          },
          {
                "ingredientId": "ing_string_bean",
                "nameTh": "ถั่วฝักยาว",
                "nameEn": "Yardlong Beans",
                "category": "vegetable",
                "quantity": 30,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 47,
                      "protein": 2.8,
                      "carbs": 8.4,
                      "fat": 0.4,
                      "fiber": 3.6,
                      "sodium": 4
                }
          },
          {
                "ingredientId": "ing_tomato_cherry",
                "nameTh": "มะเขือเทศสีดา",
                "nameEn": "Cherry Tomatoes",
                "category": "vegetable",
                "quantity": 40,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 18,
                      "protein": 0.9,
                      "carbs": 3.9,
                      "fat": 0.2,
                      "fiber": 1.2,
                      "sodium": 5
                }
          },
          {
                "ingredientId": "ing_garlic_thai",
                "nameTh": "กระเทียมไทยแกะกลีบ",
                "nameEn": "Thai Garlic Cloves",
                "category": "herb_spice",
                "quantity": 10,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 149,
                      "protein": 6.4,
                      "carbs": 33.1,
                      "fat": 0.5,
                      "fiber": 2.1,
                      "sodium": 17
                }
          },
          {
                "ingredientId": "ing_chili_jinda",
                "nameTh": "พริกขี้หนูจินดา",
                "nameEn": "Bird's Eye Red Chili",
                "category": "herb_spice",
                "quantity": 10,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 40,
                      "protein": 1.9,
                      "carbs": 8.8,
                      "fat": 0.4,
                      "fiber": 1.5,
                      "sodium": 9
                }
          },
          {
                "ingredientId": "ing_palm_sugar",
                "nameTh": "น้ำตาลมะพร้าวอัมพวา",
                "nameEn": "Pure Coconut Palm Sugar",
                "category": "seasoning",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 380,
                      "protein": 0.2,
                      "carbs": 95,
                      "fat": 0.1,
                      "fiber": 0,
                      "sodium": 40
                }
          },
          {
                "ingredientId": "ing_fish_sauce",
                "nameTh": "น้ำปลาแท้เกรดพรีเมียม",
                "nameEn": "Premium Fish Sauce",
                "category": "seasoning",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 35,
                      "protein": 6,
                      "carbs": 2.5,
                      "fat": 0,
                      "fiber": 0,
                      "sodium": 7200
                }
          },
          {
                "ingredientId": "ing_lime_juice",
                "nameTh": "น้ำมะนาวแท้คั้นสด",
                "nameEn": "Fresh Squeezed Lime Juice",
                "category": "seasoning",
                "quantity": 25,
                "unit": "ml",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 25,
                      "protein": 0.4,
                      "carbs": 8.4,
                      "fat": 0.1,
                      "fiber": 0.4,
                      "sodium": 2
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 200,
                "protein": 4.4,
                "carbs": 47.5,
                "fat": 0.5,
                "fiber": 5.3,
                "sodium": 1460
          },
          "perServing": {
                "calories": 100,
                "protein": 2.2,
                "carbs": 23.8,
                "fat": 0.3,
                "fiber": 2.6,
                "sodium": 730
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_011: {
    _id: "dish_011",
    nameTh: "ต้มแซ่บกระดูกหมู",
    nameEn: "Spicy Isan Pork Rib Soup",
    region: "northeastern",
    regionNameTh: "ภาคอีสาน",
    type: "cooking_kit",
    dishType: "soup",
    description: "กระดูกหมูเคี่ยวจนเนื้อนุ่มในน้ำซุปร้อนรสเปรี้ยวเผ็ดจัดจ้าน หอมข้าวคั่ว พริกแห้ง และสมุนไพรสด ซดคล่องคอและอุ่นท้อง",
    history: "ต้มพื้นบ้านอีสานที่เคี่ยวกระดูกหมูจนนุ่มแล้วปรุงรสจัดท้ายสุด",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/northeastern/ID011_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_pork_mince",
                "nameTh": "หมูสับอนามัย",
                "nameEn": "Minced Pork",
                "category": "meat",
                "quantity": 200,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 263,
                      "protein": 17,
                      "carbs": 0,
                      "fat": 21,
                      "fiber": 0,
                      "sodium": 65
                }
          },
          {
                "ingredientId": "ing_lemongrass",
                "nameTh": "ตะไคร้ซอย",
                "nameEn": "Lemongrass Stalks",
                "category": "herb_spice",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 99,
                      "protein": 1.8,
                      "carbs": 25.3,
                      "fat": 0.5,
                      "fiber": 4.2,
                      "sodium": 6
                }
          },
          {
                "ingredientId": "ing_galangal",
                "nameTh": "ข่าแก่หั่นแว่น",
                "nameEn": "Sliced Galangal",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 71,
                      "protein": 1,
                      "carbs": 15,
                      "fat": 1,
                      "fiber": 2,
                      "sodium": 5
                }
          },
          {
                "ingredientId": "ing_kaffir_leaf",
                "nameTh": "ใบมะกรูดฉีก",
                "nameEn": "Kaffir Lime Leaves",
                "category": "herb_spice",
                "quantity": 5,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 45,
                      "protein": 2.8,
                      "carbs": 7.5,
                      "fat": 0.5,
                      "fiber": 3,
                      "sodium": 10
                }
          },
          {
                "ingredientId": "ing_culantro",
                "nameTh": "ผักชีฝรั่ง",
                "nameEn": "Sawtooth Coriander / Culantro",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 25,
                      "protein": 2,
                      "carbs": 4,
                      "fat": 0.5,
                      "fiber": 2.5,
                      "sodium": 15
                }
          },
          {
                "ingredientId": "ing_chili_jinda",
                "nameTh": "พริกขี้หนูจินดา",
                "nameEn": "Bird's Eye Red Chili",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 40,
                      "protein": 1.9,
                      "carbs": 8.8,
                      "fat": 0.4,
                      "fiber": 1.5,
                      "sodium": 9
                }
          },
          {
                "ingredientId": "ing_fish_sauce",
                "nameTh": "น้ำปลาแท้เกรดพรีเมียม",
                "nameEn": "Premium Fish Sauce",
                "category": "seasoning",
                "quantity": 25,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 35,
                      "protein": 6,
                      "carbs": 2.5,
                      "fat": 0,
                      "fiber": 0,
                      "sodium": 7200
                }
          },
          {
                "ingredientId": "ing_lime_juice",
                "nameTh": "น้ำมะนาวแท้คั้นสด",
                "nameEn": "Fresh Squeezed Lime Juice",
                "category": "seasoning",
                "quantity": 25,
                "unit": "ml",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 25,
                      "protein": 0.4,
                      "carbs": 8.4,
                      "fat": 0.1,
                      "fiber": 0.4,
                      "sodium": 2
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 583,
                "protein": 36.8,
                "carbs": 12.3,
                "fat": 42.4,
                "fiber": 2,
                "sodium": 1937
          },
          "perServing": {
                "calories": 292,
                "protein": 18.4,
                "carbs": 6.2,
                "fat": 21.2,
                "fiber": 1,
                "sodium": 968
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_012: {
    _id: "dish_012",
    nameTh: "ทับทิมกรอบ",
    nameEn: "Red Rubies in Coconut Milk",
    region: "northeastern",
    regionNameTh: "ภาคอีสาน",
    type: "dessert",
    dishType: "dessert",
    description: "แห้วเนื้อกรอบหั่นเต๋าเคลือบแป้งสีทับทิมเนื้อนุ่มหนึบ เสิร์ฟในน้ำกะทิหอมหวานมัน พร้อมน้ำแข็งบดเย็นชื่นใจ",
    history: "ขนมไทยคลายร้อนที่ได้ชื่อจากสีแดงคล้ายอัญมณีทับทิม",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "พร้อมรับประทาน แนะนำให้เสิร์ฟเย็น",
    imageUrl: [
      new URL("./assets/northeastern/ID012_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1603099541178-958866380649?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 129,
    recipe: [
          {
                "ingredientId": "ing_coconut_milk",
                "nameTh": "หัวกะทิคั้นสด 100%",
                "nameEn": "Fresh Coconut Milk",
                "category": "coconut",
                "quantity": 200,
                "unit": "ml",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 230,
                      "protein": 2.3,
                      "carbs": 5.5,
                      "fat": 23.8,
                      "fiber": 2.2,
                      "sodium": 15
                }
          },
          {
                "ingredientId": "ing_palm_sugar",
                "nameTh": "น้ำตาลมะพร้าวอัมพวา",
                "nameEn": "Pure Coconut Palm Sugar",
                "category": "seasoning",
                "quantity": 50,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 380,
                      "protein": 0.2,
                      "carbs": 95,
                      "fat": 0.1,
                      "fiber": 0,
                      "sodium": 40
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 650,
                "protein": 4.7,
                "carbs": 58.5,
                "fat": 47.7,
                "fiber": 4.4,
                "sodium": 50
          },
          "perServing": {
                "calories": 325,
                "protein": 2.3,
                "carbs": 29.3,
                "fat": 23.8,
                "fiber": 2.2,
                "sodium": 25
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_013: {
    _id: "dish_013",
    nameTh: "แกงรัญจวน",
    nameEn: "Royal Thai Ranjuan Curry",
    region: "central",
    regionNameTh: "ภาคกลาง",
    type: "cooking_kit",
    dishType: "curry",
    description: "เนื้อนุ่มในน้ำแกงใสที่หอมเอกลักษณ์จากน้ำพริกกะปิ ตะไคร้ และโหระพา รสเปรี้ยวเค็มกลมกล่อม มีความเผ็ดอ่อน ๆ ช่วยเรียกน้ำย่อย",
    history: "อาหารชาววังสมัยรัชกาลที่ 5 ที่นำของเหลือมาปรุงเป็นแกงใหม่",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/central/ID013_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_beef_shank",
                "nameTh": "เนื้อวัวน่องลาย",
                "nameEn": "Beef Shank",
                "category": "meat",
                "quantity": 200,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 201,
                      "protein": 34,
                      "carbs": 0,
                      "fat": 6.2,
                      "fiber": 0,
                      "sodium": 55
                }
          },
          {
                "ingredientId": "ing_lemongrass",
                "nameTh": "ตะไคร้ซอย",
                "nameEn": "Lemongrass Stalks",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 99,
                      "protein": 1.8,
                      "carbs": 25.3,
                      "fat": 0.5,
                      "fiber": 4.2,
                      "sodium": 6
                }
          },
          {
                "ingredientId": "ing_shallot",
                "nameTh": "หอมแดงซอย",
                "nameEn": "Sliced Shallots",
                "category": "herb_spice",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 72,
                      "protein": 2.5,
                      "carbs": 16.8,
                      "fat": 0.1,
                      "fiber": 3.2,
                      "sodium": 12
                }
          },
          {
                "ingredientId": "ing_garlic_thai",
                "nameTh": "กระเทียมไทยแกะกลีบ",
                "nameEn": "Thai Garlic Cloves",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 149,
                      "protein": 6.4,
                      "carbs": 33.1,
                      "fat": 0.5,
                      "fiber": 2.1,
                      "sodium": 17
                }
          },
          {
                "ingredientId": "ing_sweet_basil",
                "nameTh": "ใบโหระพา",
                "nameEn": "Sweet Basil",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 23,
                      "protein": 3.2,
                      "carbs": 2.7,
                      "fat": 0.6,
                      "fiber": 1.6,
                      "sodium": 4
                }
          },
          {
                "ingredientId": "ing_chili_jinda",
                "nameTh": "พริกขี้หนูจินดา",
                "nameEn": "Bird's Eye Red Chili",
                "category": "herb_spice",
                "quantity": 10,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 40,
                      "protein": 1.9,
                      "carbs": 8.8,
                      "fat": 0.4,
                      "fiber": 1.5,
                      "sodium": 9
                }
          },
          {
                "ingredientId": "ing_lime_juice",
                "nameTh": "น้ำมะนาวแท้คั้นสด",
                "nameEn": "Fresh Squeezed Lime Juice",
                "category": "seasoning",
                "quantity": 20,
                "unit": "ml",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 25,
                      "protein": 0.4,
                      "carbs": 8.4,
                      "fat": 0.1,
                      "fiber": 0.4,
                      "sodium": 2
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 466,
                "protein": 70.5,
                "carbs": 15.1,
                "fat": 12.7,
                "fiber": 2.1,
                "sodium": 118
          },
          "perServing": {
                "calories": 233,
                "protein": 35.2,
                "carbs": 7.5,
                "fat": 6.4,
                "fiber": 1,
                "sodium": 59
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_014: {
    _id: "dish_014",
    nameTh: "แกงเทโพหมูสามชั้น",
    nameEn: "Pork Belly Kang Thepho",
    region: "central",
    regionNameTh: "ภาคกลาง",
    type: "cooking_kit",
    dishType: "curry",
    description: "หมูสามชั้นนุ่มมันพอดีเคี่ยวในแกงกะทิข้นกับผักบุ้งไทย รสเปรี้ยวหวานเค็มครบรส หอมใบมะกรูดและเครื่องแกงแบบไทยกลาง",
    history: "เดิมใช้ปลาเทโพ ก่อนปรับมาใช้หมูสามชั้นเมื่อปลาหายากขึ้น",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/central/ID014_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1562607635-4608ff48a859?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_pork_belly",
                "nameTh": "หมูสามชั้น",
                "nameEn": "Pork Belly",
                "category": "meat",
                "quantity": 200,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 518,
                      "protein": 9.3,
                      "carbs": 0,
                      "fat": 53,
                      "fiber": 0,
                      "sodium": 32
                }
          },
          {
                "ingredientId": "ing_morning_glory",
                "nameTh": "ผักบุ้งจีน",
                "nameEn": "Morning Glory / Water Spinach",
                "category": "vegetable",
                "quantity": 120,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 19,
                      "protein": 2.6,
                      "carbs": 3.1,
                      "fat": 0.2,
                      "fiber": 2.1,
                      "sodium": 113
                }
          },
          {
                "ingredientId": "ing_coconut_milk",
                "nameTh": "หัวกะทิคั้นสด 100%",
                "nameEn": "Fresh Coconut Milk",
                "category": "coconut",
                "quantity": 250,
                "unit": "ml",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 230,
                      "protein": 2.3,
                      "carbs": 5.5,
                      "fat": 23.8,
                      "fiber": 2.2,
                      "sodium": 15
                }
          },
          {
                "ingredientId": "ing_curry_paste_green",
                "nameTh": "พริกแกงเขียวหวานตำสด",
                "nameEn": "Fresh Green Curry Paste",
                "category": "seasoning",
                "quantity": 45,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 112,
                      "protein": 3.2,
                      "carbs": 14.8,
                      "fat": 4.1,
                      "fiber": 5.5,
                      "sodium": 1850
                }
          },
          {
                "ingredientId": "ing_kaffir_leaf",
                "nameTh": "ใบมะกรูดฉีก",
                "nameEn": "Kaffir Lime Leaves",
                "category": "herb_spice",
                "quantity": 5,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 45,
                      "protein": 2.8,
                      "carbs": 7.5,
                      "fat": 0.5,
                      "fiber": 3,
                      "sodium": 10
                }
          },
          {
                "ingredientId": "ing_tamarind_paste",
                "nameTh": "น้ำมะขามเปียกคั้นเข้มข้น",
                "nameEn": "Concentrated Tamarind Paste",
                "category": "seasoning",
                "quantity": 25,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 239,
                      "protein": 2.8,
                      "carbs": 62.5,
                      "fat": 0.6,
                      "fiber": 5.1,
                      "sodium": 28
                }
          },
          {
                "ingredientId": "ing_palm_sugar",
                "nameTh": "น้ำตาลมะพร้าวอัมพวา",
                "nameEn": "Pure Coconut Palm Sugar",
                "category": "seasoning",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 380,
                      "protein": 0.2,
                      "carbs": 95,
                      "fat": 0.1,
                      "fiber": 0,
                      "sodium": 40
                }
          },
          {
                "ingredientId": "ing_fish_sauce",
                "nameTh": "น้ำปลาแท้เกรดพรีเมียม",
                "nameEn": "Premium Fish Sauce",
                "category": "seasoning",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 35,
                      "protein": 6,
                      "carbs": 2.5,
                      "fat": 0,
                      "fiber": 0,
                      "sodium": 7200
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 1829,
                "protein": 31,
                "carbs": 59.6,
                "fat": 167.8,
                "fiber": 11.9,
                "sodium": 2525
          },
          "perServing": {
                "calories": 915,
                "protein": 15.5,
                "carbs": 29.8,
                "fat": 83.9,
                "fiber": 6,
                "sodium": 1263
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_015: {
    _id: "dish_015",
    nameTh: "มัสมั่นไก่",
    nameEn: "Chicken Massaman Curry",
    region: "central",
    regionNameTh: "ภาคกลาง",
    type: "cooking_kit",
    dishType: "curry",
    description: "น่องไก่เคี่ยวจนเปื่อยนุ่มในแกงกะทิเนื้อข้น รสหวานเค็มละมุน หอมอบเชย ลูกกระวาน และเครื่องเทศ เสริมสัมผัสมันกรุบด้วยถั่วลิสง",
    history: "แกงไทยที่รับอิทธิพลอาหารมลายูและเครื่องเทศจากต่างแดน",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/central/ID015_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_chicken_drumstick",
                "nameTh": "น่องไก่สด",
                "nameEn": "Chicken Drumstick",
                "category": "poultry",
                "quantity": 260,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 172,
                      "protein": 28.3,
                      "carbs": 0,
                      "fat": 5.7,
                      "fiber": 0,
                      "sodium": 86
                }
          },
          {
                "ingredientId": "ing_coconut_milk",
                "nameTh": "หัวกะทิคั้นสด 100%",
                "nameEn": "Fresh Coconut Milk",
                "category": "coconut",
                "quantity": 250,
                "unit": "ml",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 230,
                      "protein": 2.3,
                      "carbs": 5.5,
                      "fat": 23.8,
                      "fiber": 2.2,
                      "sodium": 15
                }
          },
          {
                "ingredientId": "ing_curry_paste_massaman",
                "nameTh": "พริกแกงมัสมั่นเครื่องเทศเทศ",
                "nameEn": "Massaman Curry Paste",
                "category": "seasoning",
                "quantity": 50,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 142,
                      "protein": 3.8,
                      "carbs": 17.5,
                      "fat": 6.3,
                      "fiber": 5.8,
                      "sodium": 1680
                }
          },
          {
                "ingredientId": "ing_shallot",
                "nameTh": "หอมแดงซอย",
                "nameEn": "Sliced Shallots",
                "category": "herb_spice",
                "quantity": 30,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 72,
                      "protein": 2.5,
                      "carbs": 16.8,
                      "fat": 0.1,
                      "fiber": 3.2,
                      "sodium": 12
                }
          },
          {
                "ingredientId": "ing_palm_sugar",
                "nameTh": "น้ำตาลมะพร้าวอัมพวา",
                "nameEn": "Pure Coconut Palm Sugar",
                "category": "seasoning",
                "quantity": 25,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 380,
                      "protein": 0.2,
                      "carbs": 95,
                      "fat": 0.1,
                      "fiber": 0,
                      "sodium": 40
                }
          },
          {
                "ingredientId": "ing_tamarind_paste",
                "nameTh": "น้ำมะขามเปียกคั้นเข้มข้น",
                "nameEn": "Concentrated Tamarind Paste",
                "category": "seasoning",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 239,
                      "protein": 2.8,
                      "carbs": 62.5,
                      "fat": 0.6,
                      "fiber": 5.1,
                      "sodium": 28
                }
          },
          {
                "ingredientId": "ing_fish_sauce",
                "nameTh": "น้ำปลาแท้เกรดพรีเมียม",
                "nameEn": "Premium Fish Sauce",
                "category": "seasoning",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 35,
                      "protein": 6,
                      "carbs": 2.5,
                      "fat": 0,
                      "fiber": 0,
                      "sodium": 7200
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 1265,
                "protein": 83.8,
                "carbs": 64.3,
                "fat": 77.6,
                "fiber": 10.4,
                "sodium": 2560
          },
          "perServing": {
                "calories": 632,
                "protein": 41.9,
                "carbs": 32.1,
                "fat": 38.8,
                "fiber": 5.2,
                "sodium": 1280
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_016: {
    _id: "dish_016",
    nameTh: "แกงสิบหก",
    nameEn: "Sixteen-Ingredient Heritage Curry",
    region: "central",
    regionNameTh: "ภาคกลาง",
    type: "cooking_kit",
    dishType: "curry",
    description: "แกงไทยโบราณที่อัดแน่นด้วยเครื่องเคราหลากชนิด รสเข้มข้นเป็นชั้น ๆ หอมพริกแกง สมุนไพร และเครื่องเทศที่เคี่ยวรวมกันอย่างพิถีพิถัน",
    history: "ตั้งชื่อตามจำนวนองค์ประกอบสำคัญในตำรับโบราณ",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/central/ID016_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1603099541178-958866380649?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_chicken_breast",
                "nameTh": "เนื้ออกไก่ลอกหนัง",
                "nameEn": "Chicken Breast Fillet",
                "category": "poultry",
                "quantity": 200,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 165,
                      "protein": 31,
                      "carbs": 0,
                      "fat": 3.6,
                      "fiber": 0,
                      "sodium": 74
                }
          },
          {
                "ingredientId": "ing_coconut_milk",
                "nameTh": "หัวกะทิคั้นสด 100%",
                "nameEn": "Fresh Coconut Milk",
                "category": "coconut",
                "quantity": 200,
                "unit": "ml",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 230,
                      "protein": 2.3,
                      "carbs": 5.5,
                      "fat": 23.8,
                      "fiber": 2.2,
                      "sodium": 15
                }
          },
          {
                "ingredientId": "ing_thai_eggplant",
                "nameTh": "มะเขือเปราะ",
                "nameEn": "Thai Round Eggplant",
                "category": "vegetable",
                "quantity": 80,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 25,
                      "protein": 1,
                      "carbs": 5.8,
                      "fat": 0.2,
                      "fiber": 3,
                      "sodium": 2
                }
          },
          {
                "ingredientId": "ing_curry_paste_green",
                "nameTh": "พริกแกงเขียวหวานตำสด",
                "nameEn": "Fresh Green Curry Paste",
                "category": "seasoning",
                "quantity": 40,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 112,
                      "protein": 3.2,
                      "carbs": 14.8,
                      "fat": 4.1,
                      "fiber": 5.5,
                      "sodium": 1850
                }
          },
          {
                "ingredientId": "ing_sweet_basil",
                "nameTh": "ใบโหระพา",
                "nameEn": "Sweet Basil",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 23,
                      "protein": 3.2,
                      "carbs": 2.7,
                      "fat": 0.6,
                      "fiber": 1.6,
                      "sodium": 4
                }
          },
          {
                "ingredientId": "ing_fish_sauce",
                "nameTh": "น้ำปลาแท้เกรดพรีเมียม",
                "nameEn": "Premium Fish Sauce",
                "category": "seasoning",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 35,
                      "protein": 6,
                      "carbs": 2.5,
                      "fat": 0,
                      "fiber": 0,
                      "sodium": 7200
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 864,
                "protein": 70.1,
                "carbs": 22.3,
                "fat": 56.7,
                "fiber": 9.2,
                "sodium": 2000
          },
          "perServing": {
                "calories": 432,
                "protein": 35,
                "carbs": 11.2,
                "fat": 28.3,
                "fiber": 4.6,
                "sodium": 1000
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_017: {
    _id: "dish_017",
    nameTh: "หมูชะมวง",
    nameEn: "Chanthaburi Pork with Cowa Leaves",
    region: "central",
    regionNameTh: "ภาคกลาง",
    type: "cooking_kit",
    dishType: "curry",
    description: "หมูชิ้นโตเคี่ยวกับใบชะมวงจนเนื้อนุ่มและน้ำแกงงวดเข้าเนื้อ รสเปรี้ยวธรรมชาติผสานหวานเค็มอย่างกลมกล่อม หอมเครื่องแกงคั่ว",
    history: "อาหารท้องถิ่นขึ้นชื่อของจันทบุรีที่ใช้ใบชะมวงให้รสเปรี้ยว",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/central/ID017_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_pork_belly",
                "nameTh": "หมูสามชั้น",
                "nameEn": "Pork Belly",
                "category": "meat",
                "quantity": 220,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 518,
                      "protein": 9.3,
                      "carbs": 0,
                      "fat": 53,
                      "fiber": 0,
                      "sodium": 32
                }
          },
          {
                "ingredientId": "ing_shallot",
                "nameTh": "หอมแดงซอย",
                "nameEn": "Sliced Shallots",
                "category": "herb_spice",
                "quantity": 25,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 72,
                      "protein": 2.5,
                      "carbs": 16.8,
                      "fat": 0.1,
                      "fiber": 3.2,
                      "sodium": 12
                }
          },
          {
                "ingredientId": "ing_garlic_thai",
                "nameTh": "กระเทียมไทยแกะกลีบ",
                "nameEn": "Thai Garlic Cloves",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 149,
                      "protein": 6.4,
                      "carbs": 33.1,
                      "fat": 0.5,
                      "fiber": 2.1,
                      "sodium": 17
                }
          },
          {
                "ingredientId": "ing_palm_sugar",
                "nameTh": "น้ำตาลมะพร้าวอัมพวา",
                "nameEn": "Pure Coconut Palm Sugar",
                "category": "seasoning",
                "quantity": 25,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 380,
                      "protein": 0.2,
                      "carbs": 95,
                      "fat": 0.1,
                      "fiber": 0,
                      "sodium": 40
                }
          },
          {
                "ingredientId": "ing_fish_sauce",
                "nameTh": "น้ำปลาแท้เกรดพรีเมียม",
                "nameEn": "Premium Fish Sauce",
                "category": "seasoning",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 35,
                      "protein": 6,
                      "carbs": 2.5,
                      "fat": 0,
                      "fiber": 0,
                      "sodium": 7200
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 1282,
                "protein": 23.3,
                "carbs": 33.4,
                "fat": 116.7,
                "fiber": 1.1,
                "sodium": 1526
          },
          "perServing": {
                "calories": 641,
                "protein": 11.6,
                "carbs": 16.7,
                "fat": 58.4,
                "fiber": 0.6,
                "sodium": 763
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_018: {
    _id: "dish_018",
    nameTh: "ข้าวเหนียวมะม่วง",
    nameEn: "Mango Sticky Rice",
    region: "central",
    regionNameTh: "ภาคกลาง",
    type: "dessert",
    dishType: "dessert",
    description: "ข้าวเหนียวมูนเมล็ดสวยนุ่มหนึบ ซึมซับกะทิหอมมันกำลังดี เสิร์ฟกับมะม่วงสุกสีทองรสหวานฉ่ำและราดหัวกะทิเค็มอ่อน",
    history: "ขนมไทยที่จับคู่ผลไม้ฤดูร้อนกับภูมิปัญญาการมูนข้าวเหนียว",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "พร้อมรับประทาน แนะนำให้เสิร์ฟเย็น",
    imageUrl: [
      new URL("./assets/central/ID018_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1562607635-4608ff48a859?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 129,
    recipe: [
          {
                "ingredientId": "ing_coconut_milk",
                "nameTh": "หัวกะทิคั้นสด 100%",
                "nameEn": "Fresh Coconut Milk",
                "category": "coconut",
                "quantity": 200,
                "unit": "ml",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 230,
                      "protein": 2.3,
                      "carbs": 5.5,
                      "fat": 23.8,
                      "fiber": 2.2,
                      "sodium": 15
                }
          },
          {
                "ingredientId": "ing_palm_sugar",
                "nameTh": "น้ำตาลมะพร้าวอัมพวา",
                "nameEn": "Pure Coconut Palm Sugar",
                "category": "seasoning",
                "quantity": 50,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 380,
                      "protein": 0.2,
                      "carbs": 95,
                      "fat": 0.1,
                      "fiber": 0,
                      "sodium": 40
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 650,
                "protein": 4.7,
                "carbs": 58.5,
                "fat": 47.7,
                "fiber": 4.4,
                "sodium": 50
          },
          "perServing": {
                "calories": 325,
                "protein": 2.3,
                "carbs": 29.3,
                "fat": 23.8,
                "fiber": 2.2,
                "sodium": 25
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_019: {
    _id: "dish_019",
    nameTh: "หน่อไม้หวานต้มกะทิ",
    nameEn: "Sweet Bamboo Shoot in Coconut Milk",
    region: "southern",
    regionNameTh: "ภาคใต้",
    type: "cooking_kit",
    dishType: "curry",
    description: "หน่อไม้หวานเนื้อนุ่มต้มในน้ำกะทิสดรสหวานมันเค็มอ่อน เติมสะตอและชะอมให้กลิ่นพื้นถิ่นโดดเด่น เป็นแกงใต้รสนุ่มที่กินง่าย",
    history: "อาหารพื้นบ้านใต้ที่ใช้หน่อไม้ตามฤดูกาลจากสวน",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/southern/ID019_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_bamboo_shoot",
                "nameTh": "หน่อไม้ต้ม",
                "nameEn": "Boiled Bamboo Shoot",
                "category": "vegetable",
                "quantity": 180,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 27,
                      "protein": 2.6,
                      "carbs": 5.2,
                      "fat": 0.3,
                      "fiber": 2.2,
                      "sodium": 4
                }
          },
          {
                "ingredientId": "ing_shrimp",
                "nameTh": "กุ้งสดแกะเปลือก",
                "nameEn": "Fresh Shrimp",
                "category": "seafood",
                "quantity": 120,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 99,
                      "protein": 24,
                      "carbs": 0.2,
                      "fat": 0.3,
                      "fiber": 0,
                      "sodium": 111
                }
          },
          {
                "ingredientId": "ing_coconut_milk",
                "nameTh": "หัวกะทิคั้นสด 100%",
                "nameEn": "Fresh Coconut Milk",
                "category": "coconut",
                "quantity": 250,
                "unit": "ml",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 230,
                      "protein": 2.3,
                      "carbs": 5.5,
                      "fat": 23.8,
                      "fiber": 2.2,
                      "sodium": 15
                }
          },
          {
                "ingredientId": "ing_shallot",
                "nameTh": "หอมแดงซอย",
                "nameEn": "Sliced Shallots",
                "category": "herb_spice",
                "quantity": 25,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 72,
                      "protein": 2.5,
                      "carbs": 16.8,
                      "fat": 0.1,
                      "fiber": 3.2,
                      "sodium": 12
                }
          },
          {
                "ingredientId": "ing_fish_sauce",
                "nameTh": "น้ำปลาแท้เกรดพรีเมียม",
                "nameEn": "Premium Fish Sauce",
                "category": "seasoning",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 35,
                      "protein": 6,
                      "carbs": 2.5,
                      "fat": 0,
                      "fiber": 0,
                      "sodium": 7200
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 766,
                "protein": 40.8,
                "carbs": 27.9,
                "fat": 60.4,
                "fiber": 10.3,
                "sodium": 1261
          },
          "perServing": {
                "calories": 383,
                "protein": 20.4,
                "carbs": 14,
                "fat": 30.2,
                "fiber": 5.1,
                "sodium": 630
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_020: {
    _id: "dish_020",
    nameTh: "แกงระแวงเนื้อ",
    nameEn: "Beef Rawang Curry",
    region: "southern",
    regionNameTh: "ภาคใต้",
    type: "cooking_kit",
    dishType: "curry",
    description: "เนื้อวัวเคี่ยวในแกงกะทิขลุกขลิกจนเครื่องเกาะชิ้นเนื้อ รสเข้มข้นคล้ายพะแนง แต่โดดเด่นด้วยกลิ่นขมิ้น ตะไคร้ และสมุนไพรสด",
    history: "แกงไทยโบราณที่มีเรื่องเล่าเชื่อมโยงกับอาหารชวา",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/southern/ID020_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1603099541178-958866380649?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_beef_shank",
                "nameTh": "เนื้อวัวน่องลาย",
                "nameEn": "Beef Shank",
                "category": "meat",
                "quantity": 220,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 201,
                      "protein": 34,
                      "carbs": 0,
                      "fat": 6.2,
                      "fiber": 0,
                      "sodium": 55
                }
          },
          {
                "ingredientId": "ing_coconut_milk",
                "nameTh": "หัวกะทิคั้นสด 100%",
                "nameEn": "Fresh Coconut Milk",
                "category": "coconut",
                "quantity": 220,
                "unit": "ml",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 230,
                      "protein": 2.3,
                      "carbs": 5.5,
                      "fat": 23.8,
                      "fiber": 2.2,
                      "sodium": 15
                }
          },
          {
                "ingredientId": "ing_curry_paste_southern_sour",
                "nameTh": "พริกแกงส้มใต้ขมิ้นสด",
                "nameEn": "Southern Sour Turmeric Curry Paste",
                "category": "seasoning",
                "quantity": 45,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 95,
                      "protein": 2.8,
                      "carbs": 15.5,
                      "fat": 2.1,
                      "fiber": 4.8,
                      "sodium": 1950
                }
          },
          {
                "ingredientId": "ing_lemongrass",
                "nameTh": "ตะไคร้ซอย",
                "nameEn": "Lemongrass Stalks",
                "category": "herb_spice",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 99,
                      "protein": 1.8,
                      "carbs": 25.3,
                      "fat": 0.5,
                      "fiber": 4.2,
                      "sodium": 6
                }
          },
          {
                "ingredientId": "ing_kaffir_leaf",
                "nameTh": "ใบมะกรูดฉีก",
                "nameEn": "Kaffir Lime Leaves",
                "category": "herb_spice",
                "quantity": 5,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 45,
                      "protein": 2.8,
                      "carbs": 7.5,
                      "fat": 0.5,
                      "fiber": 3,
                      "sodium": 10
                }
          },
          {
                "ingredientId": "ing_fish_sauce",
                "nameTh": "น้ำปลาแท้เกรดพรีเมียม",
                "nameEn": "Premium Fish Sauce",
                "category": "seasoning",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 35,
                      "protein": 6,
                      "carbs": 2.5,
                      "fat": 0,
                      "fiber": 0,
                      "sodium": 7200
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 1018,
                "protein": 82.5,
                "carbs": 24.9,
                "fat": 67.1,
                "fiber": 8,
                "sodium": 2113
          },
          "perServing": {
                "calories": 509,
                "protein": 41.3,
                "carbs": 12.4,
                "fat": 33.5,
                "fiber": 4,
                "sodium": 1057
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_021: {
    _id: "dish_021",
    nameTh: "ผัดสะตอกะปิกุ้ง",
    nameEn: "Stir-fried Stink Beans with Shrimp",
    region: "southern",
    regionNameTh: "ภาคใต้",
    type: "cooking_kit",
    dishType: "stir_fry",
    description: "สะตอเม็ดกรอบผัดไฟแรงกับกุ้งเนื้อเด้งและซอสกะปิเข้มข้น รสเค็มหวานเผ็ดถึงเครื่อง หอมพริกและกะปิแบบอาหารใต้แท้",
    history: "เมนูใต้ที่นำวัตถุดิบประจำถิ่นอย่างสะตอมาปรุงกับกะปิ",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/southern/ID021_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_shrimp",
                "nameTh": "กุ้งสดแกะเปลือก",
                "nameEn": "Fresh Shrimp",
                "category": "seafood",
                "quantity": 180,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 99,
                      "protein": 24,
                      "carbs": 0.2,
                      "fat": 0.3,
                      "fiber": 0,
                      "sodium": 111
                }
          },
          {
                "ingredientId": "ing_pork_mince",
                "nameTh": "หมูสับอนามัย",
                "nameEn": "Minced Pork",
                "category": "meat",
                "quantity": 80,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 263,
                      "protein": 17,
                      "carbs": 0,
                      "fat": 21,
                      "fiber": 0,
                      "sodium": 65
                }
          },
          {
                "ingredientId": "ing_garlic_thai",
                "nameTh": "กระเทียมไทยแกะกลีบ",
                "nameEn": "Thai Garlic Cloves",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 149,
                      "protein": 6.4,
                      "carbs": 33.1,
                      "fat": 0.5,
                      "fiber": 2.1,
                      "sodium": 17
                }
          },
          {
                "ingredientId": "ing_shallot",
                "nameTh": "หอมแดงซอย",
                "nameEn": "Sliced Shallots",
                "category": "herb_spice",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 72,
                      "protein": 2.5,
                      "carbs": 16.8,
                      "fat": 0.1,
                      "fiber": 3.2,
                      "sodium": 12
                }
          },
          {
                "ingredientId": "ing_chili_jinda",
                "nameTh": "พริกขี้หนูจินดา",
                "nameEn": "Bird's Eye Red Chili",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 40,
                      "protein": 1.9,
                      "carbs": 8.8,
                      "fat": 0.4,
                      "fiber": 1.5,
                      "sodium": 9
                }
          },
          {
                "ingredientId": "ing_palm_sugar",
                "nameTh": "น้ำตาลมะพร้าวอัมพวา",
                "nameEn": "Pure Coconut Palm Sugar",
                "category": "seasoning",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 380,
                      "protein": 0.2,
                      "carbs": 95,
                      "fat": 0.1,
                      "fiber": 0,
                      "sodium": 40
                }
          },
          {
                "ingredientId": "ing_fish_sauce",
                "nameTh": "น้ำปลาแท้เกรดพรีเมียม",
                "nameEn": "Premium Fish Sauce",
                "category": "seasoning",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 35,
                      "protein": 6,
                      "carbs": 2.5,
                      "fat": 0,
                      "fiber": 0,
                      "sodium": 7200
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 494,
                "protein": 59.5,
                "carbs": 24.6,
                "fat": 17.5,
                "fiber": 1.2,
                "sodium": 1344
          },
          "perServing": {
                "calories": 247,
                "protein": 29.7,
                "carbs": 12.3,
                "fat": 8.8,
                "fiber": 0.6,
                "sodium": 672
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_022: {
    _id: "dish_022",
    nameTh: "ยำไตปลา",
    nameEn: "Spicy Fermented Fish Innards Salad",
    region: "southern",
    regionNameTh: "ภาคใต้",
    type: "cooking_kit",
    dishType: "salad",
    description: "ไตปลารสเข้มคลุกกับเนื้อปลาทูย่างและสมุนไพรซอยนานาชนิด ปรุงรสเผ็ดเค็มเปรี้ยวจัดจ้าน หอมตะไคร้ ใบมะกรูด และพริกสด",
    history: "การประยุกต์ไตปลาหมักซึ่งเป็นภูมิปัญญาถนอมอาหารของภาคใต้",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/southern/ID022_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1562607635-4608ff48a859?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_sea_bass",
                "nameTh": "เนื้อปลากะพงขาว",
                "nameEn": "Sea Bass Fillet",
                "category": "seafood",
                "quantity": 180,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 97,
                      "protein": 18.4,
                      "carbs": 0,
                      "fat": 2,
                      "fiber": 0,
                      "sodium": 68
                }
          },
          {
                "ingredientId": "ing_lemongrass",
                "nameTh": "ตะไคร้ซอย",
                "nameEn": "Lemongrass Stalks",
                "category": "herb_spice",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 99,
                      "protein": 1.8,
                      "carbs": 25.3,
                      "fat": 0.5,
                      "fiber": 4.2,
                      "sodium": 6
                }
          },
          {
                "ingredientId": "ing_shallot",
                "nameTh": "หอมแดงซอย",
                "nameEn": "Sliced Shallots",
                "category": "herb_spice",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 72,
                      "protein": 2.5,
                      "carbs": 16.8,
                      "fat": 0.1,
                      "fiber": 3.2,
                      "sodium": 12
                }
          },
          {
                "ingredientId": "ing_chili_jinda",
                "nameTh": "พริกขี้หนูจินดา",
                "nameEn": "Bird's Eye Red Chili",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 40,
                      "protein": 1.9,
                      "carbs": 8.8,
                      "fat": 0.4,
                      "fiber": 1.5,
                      "sodium": 9
                }
          },
          {
                "ingredientId": "ing_kaffir_leaf",
                "nameTh": "ใบมะกรูดฉีก",
                "nameEn": "Kaffir Lime Leaves",
                "category": "herb_spice",
                "quantity": 5,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 45,
                      "protein": 2.8,
                      "carbs": 7.5,
                      "fat": 0.5,
                      "fiber": 3,
                      "sodium": 10
                }
          },
          {
                "ingredientId": "ing_lime_juice",
                "nameTh": "น้ำมะนาวแท้คั้นสด",
                "nameEn": "Fresh Squeezed Lime Juice",
                "category": "seasoning",
                "quantity": 25,
                "unit": "ml",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 25,
                      "protein": 0.4,
                      "carbs": 8.4,
                      "fat": 0.1,
                      "fiber": 0.4,
                      "sodium": 2
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 223,
                "protein": 34.5,
                "carbs": 12.2,
                "fat": 3.8,
                "fiber": 2,
                "sodium": 128
          },
          "perServing": {
                "calories": 112,
                "protein": 17.3,
                "carbs": 6.1,
                "fat": 1.9,
                "fiber": 1,
                "sodium": 64
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_023: {
    _id: "dish_023",
    nameTh: "ไก่กอและ",
    nameEn: "Southern Golek Chicken",
    region: "southern",
    regionNameTh: "ภาคใต้",
    type: "cooking_kit",
    dishType: "grill",
    description: "ไก่หมักเนื้อนุ่มย่างพร้อมทาเครื่องแกงกะทิสีส้มแดงซ้ำหลายชั้น รสหวานเค็มเผ็ดอ่อน ๆ หอมเครื่องเทศและกลิ่นควันจากเตา",
    history: "อาหารมลายูปักษ์ใต้ที่นิยมในพื้นที่ชายแดนใต้",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/southern/ID023_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_chicken_drumstick",
                "nameTh": "น่องไก่สด",
                "nameEn": "Chicken Drumstick",
                "category": "poultry",
                "quantity": 280,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 172,
                      "protein": 28.3,
                      "carbs": 0,
                      "fat": 5.7,
                      "fiber": 0,
                      "sodium": 86
                }
          },
          {
                "ingredientId": "ing_coconut_milk",
                "nameTh": "หัวกะทิคั้นสด 100%",
                "nameEn": "Fresh Coconut Milk",
                "category": "coconut",
                "quantity": 150,
                "unit": "ml",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 230,
                      "protein": 2.3,
                      "carbs": 5.5,
                      "fat": 23.8,
                      "fiber": 2.2,
                      "sodium": 15
                }
          },
          {
                "ingredientId": "ing_shallot",
                "nameTh": "หอมแดงซอย",
                "nameEn": "Sliced Shallots",
                "category": "herb_spice",
                "quantity": 25,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 72,
                      "protein": 2.5,
                      "carbs": 16.8,
                      "fat": 0.1,
                      "fiber": 3.2,
                      "sodium": 12
                }
          },
          {
                "ingredientId": "ing_garlic_thai",
                "nameTh": "กระเทียมไทยแกะกลีบ",
                "nameEn": "Thai Garlic Cloves",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 149,
                      "protein": 6.4,
                      "carbs": 33.1,
                      "fat": 0.5,
                      "fiber": 2.1,
                      "sodium": 17
                }
          },
          {
                "ingredientId": "ing_tamarind_paste",
                "nameTh": "น้ำมะขามเปียกคั้นเข้มข้น",
                "nameEn": "Concentrated Tamarind Paste",
                "category": "seasoning",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 239,
                      "protein": 2.8,
                      "carbs": 62.5,
                      "fat": 0.6,
                      "fiber": 5.1,
                      "sodium": 28
                }
          },
          {
                "ingredientId": "ing_palm_sugar",
                "nameTh": "น้ำตาลมะพร้าวอัมพวา",
                "nameEn": "Pure Coconut Palm Sugar",
                "category": "seasoning",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 380,
                      "protein": 0.2,
                      "carbs": 95,
                      "fat": 0.1,
                      "fiber": 0,
                      "sodium": 40
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 991,
                "protein": 84.9,
                "carbs": 48.9,
                "fat": 51.9,
                "fiber": 5.4,
                "sodium": 282
          },
          "perServing": {
                "calories": 495,
                "protein": 42.4,
                "carbs": 24.5,
                "fat": 26,
                "fiber": 2.7,
                "sodium": 141
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_024: {
    _id: "dish_024",
    nameTh: "สาคูต้นราดกะทิ",
    nameEn: "Palm Sago with Coconut Milk",
    region: "southern",
    regionNameTh: "ภาคใต้",
    type: "dessert",
    dishType: "dessert",
    description: "เม็ดสาคูต้นแท้ต้มจนใสและนุ่มหนึบเป็นธรรมชาติ ราดด้วยกะทิสดรสหวานมันตัดเค็มเล็กน้อย ให้รสละมุนและกลิ่นหอมแบบขนมพื้นบ้านใต้",
    history: "ขนมจากแป้งสาคูต้นแท้ซึ่งเป็นวัตถุดิบพื้นถิ่นภาคใต้",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "พร้อมรับประทาน แนะนำให้เสิร์ฟเย็น",
    imageUrl: [
      new URL("./assets/southern/ID024_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1603099541178-958866380649?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 129,
    recipe: [
          {
                "ingredientId": "ing_coconut_milk",
                "nameTh": "หัวกะทิคั้นสด 100%",
                "nameEn": "Fresh Coconut Milk",
                "category": "coconut",
                "quantity": 200,
                "unit": "ml",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 230,
                      "protein": 2.3,
                      "carbs": 5.5,
                      "fat": 23.8,
                      "fiber": 2.2,
                      "sodium": 15
                }
          },
          {
                "ingredientId": "ing_palm_sugar",
                "nameTh": "น้ำตาลมะพร้าวอัมพวา",
                "nameEn": "Pure Coconut Palm Sugar",
                "category": "seasoning",
                "quantity": 45,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 380,
                      "protein": 0.2,
                      "carbs": 95,
                      "fat": 0.1,
                      "fiber": 0,
                      "sodium": 40
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 631,
                "protein": 4.7,
                "carbs": 53.8,
                "fat": 47.6,
                "fiber": 4.4,
                "sodium": 48
          },
          "perServing": {
                "calories": 316,
                "protein": 2.3,
                "carbs": 26.9,
                "fat": 23.8,
                "fiber": 2.2,
                "sodium": 24
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_025: {
    _id: "dish_025",
    nameTh: "สปาเกตตีผัดหอยลายน้ำพริกเผา",
    nameEn: "Spaghetti with Clams and Chili Jam",
    region: "fusion",
    regionNameTh: "ไทยฟิวชั่น",
    type: "cooking_kit",
    dishType: "noodle",
    description: "เส้นสปาเกตตีเหนียวนุ่มผัดกับหอยลายเนื้อหวานและน้ำพริกเผา รสหวานเผ็ดเค็มกลมกล่อม หอมกระเทียมและใบโหระพาแบบไทย",
    history: "เมนูคาเฟ่ยุคใหม่ที่ผสานเส้นอิตาเลียนกับรสผัดไทย",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/fusion/ID025_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_egg_noodle",
                "nameTh": "บะหมี่ไข่เส้นแบน",
                "nameEn": "Flat Egg Noodles",
                "category": "carb",
                "quantity": 180,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 280,
                      "protein": 10.2,
                      "carbs": 54.8,
                      "fat": 2.5,
                      "fiber": 2,
                      "sodium": 180
                }
          },
          {
                "ingredientId": "ing_squid",
                "nameTh": "ปลาหมึกกล้วย",
                "nameEn": "Squid Rings",
                "category": "seafood",
                "quantity": 100,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 92,
                      "protein": 15.6,
                      "carbs": 3.1,
                      "fat": 1.4,
                      "fiber": 0,
                      "sodium": 44
                }
          },
          {
                "ingredientId": "ing_sweet_basil",
                "nameTh": "ใบโหระพา",
                "nameEn": "Sweet Basil",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 23,
                      "protein": 3.2,
                      "carbs": 2.7,
                      "fat": 0.6,
                      "fiber": 1.6,
                      "sodium": 4
                }
          },
          {
                "ingredientId": "ing_chili_jinda",
                "nameTh": "พริกขี้หนูจินดา",
                "nameEn": "Bird's Eye Red Chili",
                "category": "herb_spice",
                "quantity": 10,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 40,
                      "protein": 1.9,
                      "carbs": 8.8,
                      "fat": 0.4,
                      "fiber": 1.5,
                      "sodium": 9
                }
          },
          {
                "ingredientId": "ing_garlic_thai",
                "nameTh": "กระเทียมไทยแกะกลีบ",
                "nameEn": "Thai Garlic Cloves",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 149,
                      "protein": 6.4,
                      "carbs": 33.1,
                      "fat": 0.5,
                      "fiber": 2.1,
                      "sodium": 17
                }
          },
          {
                "ingredientId": "ing_fish_sauce",
                "nameTh": "น้ำปลาแท้เกรดพรีเมียม",
                "nameEn": "Premium Fish Sauce",
                "category": "seasoning",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 35,
                      "protein": 6,
                      "carbs": 2.5,
                      "fat": 0,
                      "fiber": 0,
                      "sodium": 7200
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 631,
                "protein": 36.5,
                "carbs": 108.4,
                "fat": 6.1,
                "fiber": 4.3,
                "sodium": 1452
          },
          "perServing": {
                "calories": 316,
                "protein": 18.2,
                "carbs": 54.2,
                "fat": 3.1,
                "fiber": 2.2,
                "sodium": 726
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_026: {
    _id: "dish_026",
    nameTh: "เปาะเปี๊ยะสดผัดไทยเส้นชาร์โคล",
    nameEn: "Charcoal Pad Thai Fresh Rolls",
    region: "fusion",
    regionNameTh: "ไทยฟิวชั่น",
    type: "cooking_kit",
    dishType: "fusion",
    description: "ผัดไทยเส้นชาร์โคลสีดำรสเข้มข้น ห่อในแผ่นเปาะเปี๊ยะสดพร้อมผักกรอบ จับกินสะดวกและได้ทั้งความนุ่ม หนึบ และสดชื่นในคำเดียว",
    history: "การรวมสตรีตฟู้ดสองเมนูให้ร่วมสมัยและมีสีสัน",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/fusion/ID026_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1562607635-4608ff48a859?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_tofu_firm",
                "nameTh": "เต้าหู้ขาวแข็ง",
                "nameEn": "Firm Tofu",
                "category": "protein",
                "quantity": 100,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 83,
                      "protein": 10,
                      "carbs": 1.9,
                      "fat": 5.3,
                      "fiber": 1,
                      "sodium": 12
                }
          },
          {
                "ingredientId": "ing_shrimp",
                "nameTh": "กุ้งสดแกะเปลือก",
                "nameEn": "Fresh Shrimp",
                "category": "seafood",
                "quantity": 100,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 99,
                      "protein": 24,
                      "carbs": 0.2,
                      "fat": 0.3,
                      "fiber": 0,
                      "sodium": 111
                }
          },
          {
                "ingredientId": "ing_egg",
                "nameTh": "ไข่ไก่สด",
                "nameEn": "Fresh Chicken Egg",
                "category": "dairy_egg",
                "quantity": 60,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 143,
                      "protein": 12.6,
                      "carbs": 0.7,
                      "fat": 9.5,
                      "fiber": 0,
                      "sodium": 142
                }
          },
          {
                "ingredientId": "ing_tamarind_paste",
                "nameTh": "น้ำมะขามเปียกคั้นเข้มข้น",
                "nameEn": "Concentrated Tamarind Paste",
                "category": "seasoning",
                "quantity": 25,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 239,
                      "protein": 2.8,
                      "carbs": 62.5,
                      "fat": 0.6,
                      "fiber": 5.1,
                      "sodium": 28
                }
          },
          {
                "ingredientId": "ing_palm_sugar",
                "nameTh": "น้ำตาลมะพร้าวอัมพวา",
                "nameEn": "Pure Coconut Palm Sugar",
                "category": "seasoning",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 380,
                      "protein": 0.2,
                      "carbs": 95,
                      "fat": 0.1,
                      "fiber": 0,
                      "sodium": 40
                }
          },
          {
                "ingredientId": "ing_fish_sauce",
                "nameTh": "น้ำปลาแท้เกรดพรีเมียม",
                "nameEn": "Premium Fish Sauce",
                "category": "seasoning",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 35,
                      "protein": 6,
                      "carbs": 2.5,
                      "fat": 0,
                      "fiber": 0,
                      "sodium": 7200
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 409,
                "protein": 43.2,
                "carbs": 37.5,
                "fat": 11.5,
                "fiber": 2.3,
                "sodium": 1303
          },
          "perServing": {
                "calories": 204,
                "protein": 21.6,
                "carbs": 18.8,
                "fat": 5.7,
                "fiber": 1.1,
                "sodium": 652
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_027: {
    _id: "dish_027",
    nameTh: "มักกะโรนีต้มยำไข่ชีสทอดกรอบ",
    nameEn: "Tom Yum Macaroni with Crispy Cheese Egg",
    region: "fusion",
    regionNameTh: "ไทยฟิวชั่น",
    type: "cooking_kit",
    dishType: "fusion",
    description: "มักกะโรนีคลุกซอสต้มยำรสเปรี้ยวเผ็ดหอมสมุนไพร เสิร์ฟกับไข่และชีสทอดจนด้านนอกกรอบ ด้านในนุ่มเยิ้ม เพิ่มความมันให้รสจัดลงตัว",
    history: "เมนูโมเดิร์นฟิวชั่นจากคาเฟ่และคอนเทนต์อาหารร่วมสมัย",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/fusion/ID027_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_shrimp",
                "nameTh": "กุ้งสดแกะเปลือก",
                "nameEn": "Fresh Shrimp",
                "category": "seafood",
                "quantity": 120,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 99,
                      "protein": 24,
                      "carbs": 0.2,
                      "fat": 0.3,
                      "fiber": 0,
                      "sodium": 111
                }
          },
          {
                "ingredientId": "ing_squid",
                "nameTh": "ปลาหมึกกล้วย",
                "nameEn": "Squid Rings",
                "category": "seafood",
                "quantity": 80,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 92,
                      "protein": 15.6,
                      "carbs": 3.1,
                      "fat": 1.4,
                      "fiber": 0,
                      "sodium": 44
                }
          },
          {
                "ingredientId": "ing_lemongrass",
                "nameTh": "ตะไคร้ซอย",
                "nameEn": "Lemongrass Stalks",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 99,
                      "protein": 1.8,
                      "carbs": 25.3,
                      "fat": 0.5,
                      "fiber": 4.2,
                      "sodium": 6
                }
          },
          {
                "ingredientId": "ing_galangal",
                "nameTh": "ข่าแก่หั่นแว่น",
                "nameEn": "Sliced Galangal",
                "category": "herb_spice",
                "quantity": 10,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 71,
                      "protein": 1,
                      "carbs": 15,
                      "fat": 1,
                      "fiber": 2,
                      "sodium": 5
                }
          },
          {
                "ingredientId": "ing_kaffir_leaf",
                "nameTh": "ใบมะกรูดฉีก",
                "nameEn": "Kaffir Lime Leaves",
                "category": "herb_spice",
                "quantity": 5,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 45,
                      "protein": 2.8,
                      "carbs": 7.5,
                      "fat": 0.5,
                      "fiber": 3,
                      "sodium": 10
                }
          },
          {
                "ingredientId": "ing_chili_jinda",
                "nameTh": "พริกขี้หนูจินดา",
                "nameEn": "Bird's Eye Red Chili",
                "category": "herb_spice",
                "quantity": 10,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 40,
                      "protein": 1.9,
                      "carbs": 8.8,
                      "fat": 0.4,
                      "fiber": 1.5,
                      "sodium": 9
                }
          },
          {
                "ingredientId": "ing_lime_juice",
                "nameTh": "น้ำมะนาวแท้คั้นสด",
                "nameEn": "Fresh Squeezed Lime Juice",
                "category": "seasoning",
                "quantity": 20,
                "unit": "ml",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 25,
                      "protein": 0.4,
                      "carbs": 8.4,
                      "fat": 0.1,
                      "fiber": 0.4,
                      "sodium": 2
                }
          },
          {
                "ingredientId": "ing_egg",
                "nameTh": "ไข่ไก่สด",
                "nameEn": "Fresh Chicken Egg",
                "category": "dairy_egg",
                "quantity": 60,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 143,
                      "protein": 12.6,
                      "carbs": 0.7,
                      "fat": 9.5,
                      "fiber": 0,
                      "sodium": 142
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 311,
                "protein": 49.6,
                "carbs": 11.4,
                "fat": 7.4,
                "fiber": 1.2,
                "sodium": 257
          },
          "perServing": {
                "calories": 156,
                "protein": 24.8,
                "carbs": 5.7,
                "fat": 3.7,
                "fiber": 0.6,
                "sodium": 128
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_028: {
    _id: "dish_028",
    nameTh: "เกี๊ยวซ่าราดหน้า",
    nameEn: "Gyoza with Thai Gravy",
    region: "fusion",
    regionNameTh: "ไทยฟิวชั่น",
    type: "cooking_kit",
    dishType: "fusion",
    description: "เกี๊ยวซ่าทอดฐานกรอบไส้แน่น ราดน้ำราดหน้าหอมเต้าเจี้ยวเนื้อข้น พร้อมคะน้าและผักกรอบ เป็นการผสมรสไทยจีนที่ทั้งนุ่มและกรุบ",
    history: "ต่อยอดจากราดหน้าหมี่กรอบโดยใช้เกี๊ยวซ่าแทนเส้น",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/fusion/ID028_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1603099541178-958866380649?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_pork_mince",
                "nameTh": "หมูสับอนามัย",
                "nameEn": "Minced Pork",
                "category": "meat",
                "quantity": 160,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 263,
                      "protein": 17,
                      "carbs": 0,
                      "fat": 21,
                      "fiber": 0,
                      "sodium": 65
                }
          },
          {
                "ingredientId": "ing_morning_glory",
                "nameTh": "ผักบุ้งจีน",
                "nameEn": "Morning Glory / Water Spinach",
                "category": "vegetable",
                "quantity": 80,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 19,
                      "protein": 2.6,
                      "carbs": 3.1,
                      "fat": 0.2,
                      "fiber": 2.1,
                      "sodium": 113
                }
          },
          {
                "ingredientId": "ing_garlic_thai",
                "nameTh": "กระเทียมไทยแกะกลีบ",
                "nameEn": "Thai Garlic Cloves",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 149,
                      "protein": 6.4,
                      "carbs": 33.1,
                      "fat": 0.5,
                      "fiber": 2.1,
                      "sodium": 17
                }
          },
          {
                "ingredientId": "ing_fish_sauce",
                "nameTh": "น้ำปลาแท้เกรดพรีเมียม",
                "nameEn": "Premium Fish Sauce",
                "category": "seasoning",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 35,
                      "protein": 6,
                      "carbs": 2.5,
                      "fat": 0,
                      "fiber": 0,
                      "sodium": 7200
                }
          },
          {
                "ingredientId": "ing_palm_sugar",
                "nameTh": "น้ำตาลมะพร้าวอัมพวา",
                "nameEn": "Pure Coconut Palm Sugar",
                "category": "seasoning",
                "quantity": 10,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 380,
                      "protein": 0.2,
                      "carbs": 95,
                      "fat": 0.1,
                      "fiber": 0,
                      "sodium": 40
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 502,
                "protein": 31.2,
                "carbs": 17.3,
                "fat": 33.8,
                "fiber": 2,
                "sodium": 1281
          },
          "perServing": {
                "calories": 251,
                "protein": 15.6,
                "carbs": 8.7,
                "fat": 16.9,
                "fiber": 1,
                "sodium": 640
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_029: {
    _id: "dish_029",
    nameTh: "ข้าวมันไก่",
    nameEn: "Hainanese Chicken Rice",
    region: "fusion",
    regionNameTh: "ไทยฟิวชั่น",
    type: "cooking_kit",
    dishType: "rice",
    description: "ไก่ต้มเนื้อนุ่มฉ่ำเสิร์ฟบนข้าวหุงน้ำซุปที่หอมมันทุกเมล็ด กินคู่กับน้ำจิ้มเต้าเจี้ยวรสเปรี้ยวเผ็ดและซุปร้อนกลมกล่อม",
    history: "เมนูจากชาวไหหลำที่ถูกปรับรสจนเป็นอาหารยอดนิยมของไทย",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "อุ่นด้วยไฟกลางจนร้อนทั่วก่อนรับประทาน",
    imageUrl: [
      new URL("./assets/fusion/ID029_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 189,
    recipe: [
          {
                "ingredientId": "ing_chicken_breast",
                "nameTh": "เนื้ออกไก่ลอกหนัง",
                "nameEn": "Chicken Breast Fillet",
                "category": "poultry",
                "quantity": 220,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 165,
                      "protein": 31,
                      "carbs": 0,
                      "fat": 3.6,
                      "fiber": 0,
                      "sodium": 74
                }
          },
          {
                "ingredientId": "ing_garlic_thai",
                "nameTh": "กระเทียมไทยแกะกลีบ",
                "nameEn": "Thai Garlic Cloves",
                "category": "herb_spice",
                "quantity": 20,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 149,
                      "protein": 6.4,
                      "carbs": 33.1,
                      "fat": 0.5,
                      "fiber": 2.1,
                      "sodium": 17
                }
          },
          {
                "ingredientId": "ing_galangal",
                "nameTh": "ข่าแก่หั่นแว่น",
                "nameEn": "Sliced Galangal",
                "category": "herb_spice",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 71,
                      "protein": 1,
                      "carbs": 15,
                      "fat": 1,
                      "fiber": 2,
                      "sodium": 5
                }
          },
          {
                "ingredientId": "ing_chili_jinda",
                "nameTh": "พริกขี้หนูจินดา",
                "nameEn": "Bird's Eye Red Chili",
                "category": "herb_spice",
                "quantity": 10,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 40,
                      "protein": 1.9,
                      "carbs": 8.8,
                      "fat": 0.4,
                      "fiber": 1.5,
                      "sodium": 9
                }
          },
          {
                "ingredientId": "ing_fish_sauce",
                "nameTh": "น้ำปลาแท้เกรดพรีเมียม",
                "nameEn": "Premium Fish Sauce",
                "category": "seasoning",
                "quantity": 15,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 35,
                      "protein": 6,
                      "carbs": 2.5,
                      "fat": 0,
                      "fiber": 0,
                      "sodium": 7200
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 413,
                "protein": 70.7,
                "carbs": 10.1,
                "fat": 8.2,
                "fiber": 0.9,
                "sodium": 1248
          },
          "perServing": {
                "calories": 206,
                "protein": 35.4,
                "carbs": 5.1,
                "fat": 4.1,
                "fiber": 0.4,
                "sodium": 624
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  dish_030: {
    _id: "dish_030",
    nameTh: "ขนมถ้วยใบเตยไข่หวาน",
    nameEn: "Pandan Coconut Cup with Sweet Egg",
    region: "fusion",
    regionNameTh: "ไทยฟิวชั่น",
    type: "dessert",
    dishType: "dessert",
    description: "ขนมถ้วยใบเตยเนื้อนุ่มละมุน หอมกะทิและใบเตยสด รสหวานมันตัดเค็มเล็กน้อย เสิร์ฟกับไข่หวานเนื้อนุ่มเพื่อเพิ่มรสและสัมผัสที่น่าสนใจ",
    history: "ขนมฟิวชั่นที่ต่อยอดขนมถ้วยไทยด้วยองค์ประกอบไข่หวาน",
    storageInstruction:
      "เก็บวัตถุดิบในตู้เย็นที่อุณหภูมิ 0–4°C และปรุงภายใน 2 วันหลังได้รับสินค้า",
    reheatingInstruction: "พร้อมรับประทาน แนะนำให้เสิร์ฟเย็น",
    imageUrl: [
      new URL("./assets/fusion/ID030_001.jpg", import.meta.url).href,
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1562607635-4608ff48a859?auto=format&fit=crop&w=1200&q=80",
    ],
    price: 129,
    recipe: [
          {
                "ingredientId": "ing_coconut_milk",
                "nameTh": "หัวกะทิคั้นสด 100%",
                "nameEn": "Fresh Coconut Milk",
                "category": "coconut",
                "quantity": 220,
                "unit": "ml",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 230,
                      "protein": 2.3,
                      "carbs": 5.5,
                      "fat": 23.8,
                      "fiber": 2.2,
                      "sodium": 15
                }
          },
          {
                "ingredientId": "ing_palm_sugar",
                "nameTh": "น้ำตาลมะพร้าวอัมพวา",
                "nameEn": "Pure Coconut Palm Sugar",
                "category": "seasoning",
                "quantity": 45,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 380,
                      "protein": 0.2,
                      "carbs": 95,
                      "fat": 0.1,
                      "fiber": 0,
                      "sodium": 40
                }
          },
          {
                "ingredientId": "ing_egg",
                "nameTh": "ไข่ไก่สด",
                "nameEn": "Fresh Chicken Egg",
                "category": "dairy_egg",
                "quantity": 60,
                "unit": "g",
                "basisWeightG": 100,
                "nutrientsPer100g": {
                      "calories": 143,
                      "protein": 12.6,
                      "carbs": 0.7,
                      "fat": 9.5,
                      "fiber": 0,
                      "sodium": 142
                }
          }
    ],
    cookingSteps: [],
    nutritionCache: {
          "basisWeightUnit": "100g_ingredients",
          "servings": 2,
          "totals": {
                "calories": 763,
                "protein": 12.7,
                "carbs": 55.3,
                "fat": 58.1,
                "fiber": 4.8,
                "sodium": 136
          },
          "perServing": {
                "calories": 381,
                "protein": 6.4,
                "carbs": 27.6,
                "fat": 29.1,
                "fiber": 2.4,
                "sodium": 68
          }
    },
    servings: 2,
    version: 1,
    isActive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
};

export default dishes;
