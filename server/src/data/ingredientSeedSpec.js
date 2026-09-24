// ข้อมูลเสริมสำหรับ seed วัตถุดิบจาก data-source/nutrients.xlsx
// (ในชีตไม่มีชื่ออังกฤษ / หมวดตาม enum ของระบบ / หน่วยสต็อก จึงกำหนดไว้ที่นี่ แก้ไขได้)
//
// key = ชื่อวัตถุดิบหลังรวมชื่อซ้ำ (ชื่อสั้นก่อนวงเล็บหรือ "/" ถ้ามีหลายแบบ)
// en       ชื่ออังกฤษ (nameEn — บังคับใน model)
// cat      หมวดตาม INGREDIENT_CATEGORIES (มีผลกับสูตรคำนวณธาตุของเมนู: herb_spice ×3, seasoning ×2)
// unit     หน่วยสต็อก g / ml / piece (ไม่ระบุ = g)
// gpp      กรัมต่อชิ้น (เฉพาะ unit = piece)
// tier     ระดับสต็อก: "spice" = เครื่องเทศแห้ง/ผง (ใช้น้อย) — ไม่ระบุ = ปกติ

export const INGREDIENT_SPEC = {
  // ---------- ขนมหวาน ----------
  "ไข่แดง (ไส้ไข่หวาน)": { en: "Egg yolk", cat: "egg" },
  "มะม่วงสุก": { en: "Ripe mango", cat: "vegetable" },
  "แห้วต้มสุก": { en: "Boiled water chestnut", cat: "vegetable" },
  "เนื้อมะพร้าวอ่อน": { en: "Young coconut meat", cat: "vegetable" },
  "น้ำแตงโมคั้น": { en: "Fresh watermelon juice", cat: "vegetable", unit: "ml" },
  "ใบเตย / น้ำใบเตยเข้มข้น": { en: "Pandan leaf / pandan extract", cat: "vegetable", unit: "ml" },
  "แป้งข้าวเจ้า": { en: "Rice flour", cat: "carb" },
  "แป้งท้าวยายม่อม": { en: "Arrowroot flour", cat: "carb" },
  "แป้งสาคูต้น": { en: "Sago starch", cat: "carb" },
  "แป้งมันสำปะหลัง": { en: "Tapioca starch", cat: "carb" },
  "ข้าวเหนียว / ข้าวเหนียวเขี้ยวงู": { en: "Glutinous rice", cat: "carb" },
  "งาดำคั่ว": { en: "Roasted black sesame", cat: "plantprotein", tier: "spice" },
  "น้ำตาลทรายขาว": { en: "White sugar", cat: "seasoning" },
  "น้ำตาลทรายแดง": { en: "Brown sugar", cat: "seasoning" },
  "น้ำตาลมะพร้าว": { en: "Coconut sugar", cat: "seasoning" },
  "น้ำหวานสีแดง": { en: "Red syrup", cat: "seasoning", unit: "ml" },
  "น้ำลอยดอกไม้": { en: "Jasmine-scented water", cat: "seasoning", unit: "ml" },
  "เกลือ": { en: "Salt", cat: "seasoning" },
  "กะทิ": { en: "Coconut milk", cat: "other", unit: "ml" },

  // ---------- ภาคกลาง ----------
  "เนื้อวัว": { en: "Beef", cat: "meat" },
  "หมู": { en: "Pork", cat: "meat" },
  "ไก่": { en: "Chicken", cat: "poultry" },
  "ไข่จะละเม็ด (ไข่เต่าตนุ / ไข่ปลา)": { en: "Jalamed egg (fish roe)", cat: "egg" },
  "ใบมะกรูด": { en: "Kaffir lime leaf", cat: "herb_spice" },
  "ใบโหระพา": { en: "Thai basil", cat: "vegetable" },
  "ข่า": { en: "Galangal", cat: "herb_spice" },
  "ตะไคร้": { en: "Lemongrass", cat: "herb_spice" },
  "หอมแดง": { en: "Shallot", cat: "vegetable" },
  "หอมหัวใหญ่": { en: "Onion", cat: "vegetable" },
  "กระเทียม": { en: "Garlic", cat: "vegetable" },
  "ผักบุ้งไทย": { en: "Thai morning glory", cat: "vegetable" },
  "ใบชะมวง": { en: "Chamuang leaf", cat: "vegetable" },
  "มันฝรั่ง": { en: "Potato", cat: "vegetable" },
  "มังคุดดิบ/ห่าม": { en: "Unripe mangosteen", cat: "vegetable" },
  "ส้มซ่า": { en: "Som sa (bitter orange)", cat: "vegetable" },
  "พริก (ขี้หนูสวน/ชี้ฟ้า/หยวก/แห้ง)": { en: "Chili (mixed varieties)", cat: "herb_spice" },
  "เครื่องเทศเครื่องแกง": { en: "Curry spices", cat: "herb_spice", tier: "spice" },
  "เม็ดมะม่วงหิมพานต์": { en: "Cashew nut", cat: "plantprotein" },
  "น้ำมันพืช": { en: "Vegetable oil", cat: "other", unit: "ml" },
  "กะปิ": { en: "Shrimp paste", cat: "seasoning" },
  "น้ำปลา": { en: "Fish sauce", cat: "seasoning", unit: "ml" },
  "ซีอิ๊วดำ": { en: "Dark soy sauce", cat: "seasoning", unit: "ml" },
  "น้ำตาลปี๊บ": { en: "Palm sugar", cat: "seasoning" },
  "น้ำมะนาว": { en: "Lime juice", cat: "seasoning", unit: "ml" },
  "น้ำมะขามเปียก": { en: "Tamarind juice", cat: "seasoning", unit: "ml" },

  // ---------- ภาคเหนือ ----------
  "เลือดหมู": { en: "Pork blood", cat: "meat", unit: "ml" },
  "เนื้อไก่": { en: "Chicken meat", cat: "poultry" },
  "มะเขือเทศ (เชอร์รี่ / ลูกเล็ก)": { en: "Cherry tomato", cat: "vegetable" },
  "กระเทียมสด": { en: "Fresh garlic", cat: "vegetable" },
  "ผักชี": { en: "Coriander", cat: "vegetable" },
  "ต้นหอม": { en: "Spring onion", cat: "vegetable" },
  "ขิงอ่อน": { en: "Young ginger", cat: "herb_spice" },
  "ผักไผ่ (ผักแพว)": { en: "Vietnamese coriander", cat: "vegetable" },
  "ขนุนอ่อน": { en: "Young jackfruit", cat: "vegetable" },
  "ชะอม": { en: "Cha-om (acacia leaves)", cat: "vegetable" },
  "ชะพลู": { en: "Wild betel leaf", cat: "vegetable" },
  "พริกแห้ง": { en: "Dried chili", cat: "herb_spice", tier: "spice" },
  "ดีปลี": { en: "Long pepper", cat: "herb_spice", tier: "spice" },
  "มะแขว่น": { en: "Makhwaen (Zanthoxylum seed)", cat: "herb_spice", tier: "spice" },
  "กำจัด": { en: "Kamjad (Zanthoxylum limonella)", cat: "herb_spice", tier: "spice" },
  "พริกแกงเผ็ด": { en: "Red curry paste", cat: "herb_spice" },
  "พริกป่น": { en: "Chili flakes", cat: "herb_spice", tier: "spice" },
  "ผงขมิ้น": { en: "Turmeric powder", cat: "herb_spice", tier: "spice" },
  "ผงฮังเล": { en: "Hang le curry powder", cat: "herb_spice", tier: "spice" },
  "ผงกะหรี่": { en: "Curry powder", cat: "herb_spice", tier: "spice" },
  "ลูกผักชี": { en: "Coriander seed", cat: "herb_spice", tier: "spice" },
  "ยี่หร่า": { en: "Cumin", cat: "herb_spice", tier: "spice" },
  "กานพลู": { en: "Clove", cat: "herb_spice", tier: "spice" },
  "ซีอิ๊วขาว": { en: "Light soy sauce", cat: "seasoning", unit: "ml" },
  "น้ำตาลทราย": { en: "Granulated sugar", cat: "seasoning" },
  "มะนาวสด": { en: "Fresh lime", cat: "vegetable" },
  "ผักกาดดอง": { en: "Pickled mustard greens", cat: "vegetable" },
  "เส้นบะหมี่ (ต้ม & ทอด)": { en: "Egg noodles", cat: "carb" },

  // ---------- ภาคใต้ ----------
  "กุ้งสด / กุ้งแห้งแช่น้ำ": { en: "Fresh shrimp", cat: "seafood" },
  "ปลาทูย่าง": { en: "Grilled mackerel", cat: "seafood" },
  "ไตปลาอย่างดี": { en: "Fermented fish entrails", cat: "seafood" },
  "ขมิ้นสด": { en: "Fresh turmeric", cat: "herb_spice" },
  "สะตอ (สะตอผ่าซีก)": { en: "Stink bean (sataw)", cat: "vegetable" },
  "หน่อไม้หวานลวก": { en: "Blanched sweet bamboo shoot", cat: "vegetable" },
  "ขิง": { en: "Ginger", cat: "herb_spice" },
  "พริกไทย": { en: "Pepper", cat: "herb_spice", tier: "spice" },
  "พริกขี้หนู": { en: "Bird's eye chili", cat: "herb_spice" },
  "พริกแกง / เครื่องเทศ (ลูกผักชี, ยี่หร่า, อบเชย)": { en: "Curry paste / spice mix", cat: "herb_spice", tier: "spice" },
  "ซอสน้ำมันหอย": { en: "Oyster sauce", cat: "seasoning", unit: "ml" },

  // ---------- ภาคอีสาน ----------
  "กระดูกหมูอ่อน / เนื้อหมูสามชั้น": { en: "Pork soft bone / pork belly", cat: "meat" },
  "กุ้งแห้ง": { en: "Dried shrimp", cat: "seafood" },
  "มะละกอดิบ": { en: "Green papaya", cat: "vegetable" },
  "ถั่วฝักยาว": { en: "Yardlong bean", cat: "vegetable" },
  "มะเขือเทศสีดา": { en: "Sida tomato", cat: "vegetable" },
  "กระเทียมไทย": { en: "Thai garlic", cat: "vegetable" },
  "เมล็ดกระถิน": { en: "Lead tree seed", cat: "vegetable" },
  "ผักชีฝรั่ง": { en: "Sawtooth coriander", cat: "vegetable" },
  "ใบสะระแหน่": { en: "Mint leaf", cat: "vegetable" },
  "ใบแมงลัก": { en: "Hairy basil leaf", cat: "vegetable" },
  "ผักชีลาว": { en: "Dill", cat: "vegetable" },
  "หน่อไม้สด": { en: "Fresh bamboo shoot", cat: "vegetable" },
  "น้ำใบย่านาง": { en: "Yanang leaf juice", cat: "vegetable", unit: "ml" },
  "เห็ดฟาง": { en: "Straw mushroom", cat: "vegetable" },
  "บวบ": { en: "Luffa", cat: "vegetable" },
  "ฟักทอง": { en: "Pumpkin", cat: "vegetable" },
  "ผักกวางตุ้ง": { en: "Choy sum", cat: "vegetable" },
  "พริกแดง": { en: "Red chili", cat: "herb_spice" },
  "ข้าวคั่ว": { en: "Toasted rice powder", cat: "carb", tier: "spice" },
  "ถั่วลิสงคั่ว": { en: "Roasted peanut", cat: "plantprotein" },
  "ข้าวเบือ (ข้าวเหนียวแช่น้ำ)": { en: "Soaked glutinous rice", cat: "carb" },
  "ขนมจีน": { en: "Rice vermicelli (khanom jeen)", cat: "carb" },
  "น้ำปลาร้า": { en: "Fermented fish sauce (pla ra)", cat: "seasoning", unit: "ml" },

  // ---------- ไทยฟิวชั่น ----------
  "เส้นสปาเกตตี / มักกะโรนี (ดิบ)": { en: "Spaghetti / macaroni (dry)", cat: "carb" },
  "เส้นชาโคล (ถ่านดูดซับ) (ดิบ)": { en: "Charcoal noodles (dry)", cat: "carb" },
  "ข้าว (ดิบ)": { en: "Rice (uncooked)", cat: "carb" },
  "แผ่นเปาะเปี๊ยะสด": { en: "Fresh spring roll wrapper", cat: "carb", unit: "piece", gpp: 12 },
  "แป้งอเนกประสงค์": { en: "All-purpose flour", cat: "carb" },
  "เกล็ดขนมปัง": { en: "Breadcrumbs", cat: "carb" },
  "แป้งข้าวโพด": { en: "Cornstarch", cat: "carb" },
  "หอยลาย": { en: "Undulated surf clam", cat: "seafood" },
  "กุ้ง (แช่บ๊วย, แม่น้ำ, กุ้งแห้ง)": { en: "Shrimp (assorted)", cat: "seafood" },
  "น้ำสต็อกหมู / น้ำซุปกระดูกหมู": { en: "Pork stock", cat: "other", unit: "ml" },
  "เกี๊ยวซ่าไส้หมู": { en: "Pork gyoza", cat: "meat", unit: "piece", gpp: 20 },
  "ไข่ไก่": { en: "Chicken egg", cat: "egg", unit: "piece", gpp: 60 },
  "เต้าหู้เหลือง": { en: "Yellow tofu", cat: "plantprotein" },
  "พาร์เมซานชีส": { en: "Parmesan cheese", cat: "dairy" },
  "รากผักชี": { en: "Coriander root", cat: "herb_spice" },
  "ผักชีไทย": { en: "Thai coriander", cat: "vegetable" },
  "ต้นหอมญี่ปุ่น": { en: "Japanese leek", cat: "vegetable" },
  "ต้นกุยช่าย": { en: "Garlic chives", cat: "vegetable" },
  "ถั่วงอก": { en: "Bean sprouts", cat: "vegetable" },
  "แครอท": { en: "Carrot", cat: "vegetable" },
  "กะหล่ำปลี": { en: "Cabbage", cat: "vegetable" },
  "ฟัก": { en: "Winter melon", cat: "vegetable" },
  "แตงกวา": { en: "Cucumber", cat: "vegetable" },
  "เห็ดหอม": { en: "Shiitake mushroom", cat: "vegetable" },
  "เห็ดชิเมจิ": { en: "Shimeji mushroom", cat: "vegetable" },
  "ถั่วลิสงบด": { en: "Ground peanut", cat: "plantprotein" },
  "งาขาว": { en: "White sesame", cat: "plantprotein", tier: "spice" },
  "พริกชี้ฟ้าแดง": { en: "Red spur chili", cat: "herb_spice" },
  "น้ำพริกเผา": { en: "Thai chili jam (nam prik pao)", cat: "seasoning" },
  "ผงปรุงรสส้มตำ": { en: "Som tam seasoning powder", cat: "seasoning", tier: "spice" },
  "ซอสหอยนางรม": { en: "Oyster sauce (premium)", cat: "seasoning", unit: "ml" },
  "โชยุ": { en: "Shoyu (Japanese soy sauce)", cat: "seasoning", unit: "ml" },
  "ไชโป๊สับ": { en: "Chopped preserved radish", cat: "seasoning" },
  "เต้าเจี้ยว": { en: "Fermented soybean paste", cat: "seasoning" },
  "น้ำผัดไทยพร้อมปรุง": { en: "Pad thai sauce", cat: "seasoning", unit: "ml" },
  "ซีอิ๊วหวาน": { en: "Sweet soy sauce", cat: "seasoning", unit: "ml" },
  "มิริน": { en: "Mirin", cat: "seasoning", unit: "ml" },
  "ลูกชิ้นนารูโตะ": { en: "Naruto fish cake", cat: "seafood" },
  "น้ำมันงา": { en: "Sesame oil", cat: "other", unit: "ml" },
};

// หมวดในชีต → หมวดของระบบ (ใช้เมื่อชีตมีวัตถุดิบใหม่ที่ยังไม่อยู่ใน INGREDIENT_SPEC)
export const SHEET_CATEGORY_FALLBACK = {
  "เนื้อสัตว์ & โปรตีน": "meat",
  "เนื้อสัตว์ & อาหารทะเล": "seafood",
  "ผัก & พืชสมุนไพร": "vegetable",
  "ผักพื้นบ้าน & สมุนไพรต้ม": "vegetable",
  "พริก & เครื่องแกง": "herb_spice",
  "พริก & เครื่องปรุงรสจัด": "herb_spice",
  "เครื่องเทศ & ผงปรุงรส": "herb_spice",
  "ถั่ว & เมล็ดพืช": "plantprotein",
  "แป้ง": "carb",
  "แป้ง & เส้น": "carb",
  "แป้ง & คาร์โบไฮเดรต": "carb",
  "เครื่องปรุง & ไขมัน": "seasoning",
  "เครื่องปรุง & ซอส": "seasoning",
  "เครื่องปรุง & น้ำปลาร้า": "seasoning",
};

// ชีต → ภาคของสต็อก (อาหารภาคไหนใช้วัตถุดิบภาคนั้น)
// ไทยฟิวชั่น/ขนมหวาน ใช้สต็อกภาคกลาง ตาม PRODUCT_TO_INGREDIENT_REGION (fusion → central)
export const SHEET_TO_REGION = {
  "ภาคเหนือ": "north",
  "ภาคอีสาน": "northeast",
  "ภาคกลาง": "central",
  "ภาคใต้": "south",
  "ไทยฟิวชั่น": "central",
  "ขนมหวาน": "central",
};

// สต็อกต่อภาค (หน่วยตาม unit ของวัตถุดิบ) — ทุกวัตถุดิบ 50,000 หน่วย ในทุกภาคที่วัตถุดิบนั้นอยู่
export const STOCK_PER_REGION = {
  default: 50000, // 50,000 g หรือ 50,000 ml
  spice: 50000, // เครื่องเทศแห้ง / ผง 50,000 g
  piece: 50000, // 50,000 ชิ้น/ฟอง
};

// ชื่อในสูตรเมนูเดิม → ชื่อวัตถุดิบใหม่ (สะกดต่าง / ชื่อย่อ)
export const RECIPE_NAME_ALIASES = {
  "แป้งเท้ายายม่อม": "แป้งท้าวยายม่อม",
  "น้ำใบเตย": "ใบเตย / น้ำใบเตยเข้มข้น",
  "ใบเตย": "ใบเตย / น้ำใบเตยเข้มข้น",
  "ไข่แดง": "ไข่แดง (ไส้ไข่หวาน)",
  "เกลือป่น": "เกลือ",
  "กะทิสด": "กะทิ",
  "หัวกะทิ": "กะทิ",
  "หางกะทิ": "กะทิ",
  "ข้าวเหนียว": "ข้าวเหนียว / ข้าวเหนียวเขี้ยวงู",
  "ข้าวสาร": "ข้าว (ดิบ)",
};
