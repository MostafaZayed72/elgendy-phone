import type { Category, Product, StoreConfig } from '~/types/store'

export const elgendyStore: StoreConfig = {
  slug: 'elgendy-phone',
  name: {
    ar: 'متجر الجندي للموبايلات',
    en: 'EL-GENDY Mobile Store'
  },
  shortName: 'EL-GENDY',
  since: '1999',
  logo: '/images/logo.png',
  logoDark: '/images/logo-dark.png',
  whatsappNumber: '201276677717',
  contacts: [
    {
      id: 'c-whatsapp',
      number: '01276677717',
      whatsappFormatted: '201276677717',
      type: 'whatsapp',
      isPrimary: true
    },
    {
      id: 'c-vodafone',
      number: '01066698598',
      type: 'mobile'
    },
    {
      id: 'c-etisalat',
      number: '01156052001',
      type: 'mobile'
    },
    {
      id: 'c-landline',
      number: '0235822857',
      type: 'landline'
    }
  ],
  theme: {
    primary: '#1e6bb8',
    secondary: '#0f172a',
    accent: '#0ea5e9'
  }
}

export const storeCategories: Category[] = [
  {
    id: 'cat-smartphones',
    slug: 'smartphones',
    name: { ar: 'هواتف ذكية', en: 'Smartphones' },
    icon: 'smartphone',
    image: '/images/categories/smartphones.svg'
  },
  {
    id: 'cat-audio',
    slug: 'audio-wearables',
    name: { ar: 'سماعات وساعات ذكية', en: 'Audio & Smartwatches' },
    icon: 'headphones',
    image: '/images/categories/audio-wearables.svg'
  },
  {
    id: 'cat-chargers',
    slug: 'chargers-power',
    name: { ar: 'شواحن وباور بانك', en: 'Chargers & Power Banks' },
    icon: 'zap',
    image: '/images/categories/chargers-power.svg'
  },
  {
    id: 'cat-protection',
    slug: 'cases-protection',
    name: { ar: 'جرابات وحماية الشاشة', en: 'Cases & Protection' },
    icon: 'shield',
    image: '/images/categories/cases-protection.svg'
  }
]

export const storeProducts: Product[] = [
  {
    id: 'eg-iphone-18-pro-max',
    name: {
      ar: 'آيفون 18 برو ماكس — عنابي (Burgundy)',
      en: 'iPhone 18 Pro Max — Burgundy'
    },
    description: {
      ar: 'إصدار استثنائي بلون عنابي فاخر مع نظام كاميرات ثلاثي احترافي وشاشة فائقة السطوع.\n• أداء فائق السرعة ومعالج من الجيل الأحدث\n• كاميرا احترافية للتصوير الليلي والفيديو بدقة سينمائية\n• بطارية تدوم طوال اليوم مع شحن سريع ومضمون من متجر الجندي',
      en: 'Exclusive Burgundy edition featuring a pro triple-camera array and ultra-bright display.\n• Next-generation flagship performance and efficiency\n• Pro-grade low-light photography and cinematic video\n• All-day battery life with official EL-GENDY warranty'
    },
    price: 79500,
    originalPrice: 83000,
    unit: { ar: 'جهاز', en: 'device' },
    image: '/images/products/iphone-18-pro-max.jpg',
    categorySlug: 'smartphones',
    badge: { ar: 'إصدار حصري', en: 'Exclusive' },
    colors: ['عنابي (Burgundy)', 'أسود تيتانيوم'],
    options: ['256GB', '512GB', '1TB'],
    featured: true
  },
  {
    id: 'eg-iphone-17-max',
    name: {
      ar: 'آيفون 17 ماكس — فضي (Silver)',
      en: 'iPhone 17 Max — Silver'
    },
    description: {
      ar: 'تصميم أنيق باللون الفضي الكلاسيكي مع شاشة كبيرة ونظام كاميرات ثلاثي متطور.\n• شاشة Super Retina XDR بمعدل تحديث سلس 120Hz\n• نظام تصوير احترافي بدقة عالية وتثبيت بصري متقدم\n• ضمان رسمي معتمد من متجر الجندي منذ 1999',
      en: 'Sleek Silver finish with an expansive display and advanced triple-camera system.\n• 120Hz ProMotion Super Retina XDR display\n• High-resolution camera system with advanced stabilization\n• Official certified warranty from EL-GENDY Store'
    },
    price: 72000,
    originalPrice: 75500,
    unit: { ar: 'جهاز', en: 'device' },
    image: '/images/products/iphone-17-max.jpg',
    categorySlug: 'smartphones',
    badge: { ar: 'الأكثر طلباً', en: 'Best Seller' },
    colors: ['فضي (Silver)', 'رمادي فلكي'],
    options: ['256GB', '512GB', '1TB'],
    featured: true
  },
  {
    id: 'eg-galaxy-s26-ultra',
    name: {
      ar: 'سامسونج جالاكسي S26 الترا 5G',
      en: 'Samsung Galaxy S26 Ultra 5G'
    },
    description: {
      ar: 'قمة هواتف سامسونج الرائدة مع قلم S Pen المدمج وتقنيات الذكاء الاصطناعي المتطورة.\n• كاميرا احترافية رباعية العدسات مع تقريب فائق الدقة\n• شاشة Dynamic AMOLED 2X فائقة الوضوح\n• بطارية ضخمة 5000mAh وشحن فائق السرعة',
      en: 'Samsung’s ultimate flagship with built-in S Pen and next-gen Galaxy AI.\n• Pro quad-camera setup with ultra-clear zoom\n• Brilliant Dynamic AMOLED 2X edge-to-edge display\n• 5000mAh battery with Super Fast Charging'
    },
    price: 62500,
    originalPrice: 66000,
    unit: { ar: 'جهاز', en: 'device' },
    image: '/images/products/galaxy-s26-ultra.jpg',
    categorySlug: 'smartphones',
    badge: { ar: 'فلاجشيب', en: 'Flagship' },
    colors: ['أسود تيتانيوم', 'رمادي تيتانيوم', 'أزرق'],
    options: ['256GB / 12GB RAM', '512GB / 12GB RAM', '1TB / 16GB RAM'],
    featured: true
  },
  {
    id: 'eg-iphone-13',
    name: {
      ar: 'آيفون 13 — أبيض ستارلايت أصلي',
      en: 'iPhone 13 — Starlight'
    },
    description: {
      ar: 'الهاتف المحبوب بتصميمه الأنيق وأدائه المستقر مع شريحة A15 Bionic القوية.\n• شاشة OLED مقاس 6.1 بوصة بألوان دقيقة وسطوع ممتاز\n• كاميرا مزدوجة 12 ميجابيكسل مع الوضع السينمائي\n• قيمة ممتازة وضمان متجر الجندي للموبايلات',
      en: 'Beloved compact flagship powered by the fast A15 Bionic chip.\n• 6.1-inch Super Retina XDR OLED display\n• Dual 12MP camera system with Cinematic mode\n• Great value with official EL-GENDY Store warranty'
    },
    price: 27500,
    originalPrice: 29900,
    unit: { ar: 'جهاز', en: 'device' },
    image: '/images/products/iphone-13.jpg',
    categorySlug: 'smartphones',
    badge: { ar: 'عرض خاص', en: 'Special Offer' },
    colors: ['أبيض ستارلايت', 'أسود ميدنايت', 'أزرق'],
    options: ['128GB', '256GB']
  },
  {
    id: 'eg-redmi-15c',
    name: {
      ar: 'شاومي ريدمي 15C — بطارية 6000mAh',
      en: 'Xiaomi Redmi 15C — 6000mAh Battery'
    },
    description: {
      ar: 'هاتف عملي بتصميم نحيف وأنيق وشاشة عملاقة 6.9 بوصة مع بطارية جبارة.\n• بطارية ضخمة 6000 مللي أمبير تدوم لأيام\n• شحن سريع بقوة 33 وات\n• شاشة غامرة مقاس 6.9 بوصة وتصميم فائق النحافة',
      en: 'Sleek everyday smartphone with a massive 6.9" display and long-lasting battery.\n• Huge 6000mAh (typ) battery for multi-day use\n• 33W FastCharge support\n• Ultra-slim modern design with 6.9" immersive screen'
    },
    price: 6950,
    originalPrice: 7600,
    unit: { ar: 'جهاز', en: 'device' },
    image: '/images/products/redmi-15c.jpg',
    categorySlug: 'smartphones',
    badge: { ar: 'بطارية عملاقة', en: '6000mAh' },
    colors: ['أسود مطفي', 'أزرق سماوي'],
    options: ['128GB / 6GB RAM', '256GB / 8GB RAM']
  },
  {
    id: 'eg-honor-x6c',
    name: {
      ar: 'هونر X6c — تصميم رخامي أنيق',
      en: 'HONOR X6c — Pearl White'
    },
    description: {
      ar: 'تصميم عصري جذاب بظهر رخامي أنيق وأداء سلس للاستخدام اليومي والتطبيقات.\n• شاشة كاملة عالية السطوع ومريحة للعين\n• كاميرا ذكية لالتقاط صور واضحة في مختلف الإضاءات\n• بطارية قوية تدوم طوال اليوم مع ضمان الوكيل',
      en: 'Stylish pearl-textured design with smooth performance for daily tasks and social apps.\n• Eye-comfort full-view bright display\n• AI smart camera for crisp everyday shots\n• Long-lasting battery with official warranty'
    },
    price: 6450,
    originalPrice: 7100,
    unit: { ar: 'جهاز', en: 'device' },
    image: '/images/products/honor-x6c.jpg',
    categorySlug: 'smartphones',
    badge: { ar: 'وصل حديثاً', en: 'New Arrival' },
    colors: ['أبيض لؤلؤي', 'أسود'],
    options: ['128GB / 4GB RAM', '256GB / 6GB RAM']
  },
  {
    id: 'eg-galaxy-a07',
    name: {
      ar: 'سامسونج جالاكسي A07 — عملي واقتصادي',
      en: 'Samsung Galaxy A07'
    },
    description: {
      ar: 'الخيار الاقتصادي الأمثل من سامسونج بجودة تصنيع موثوقة وشاشة كبيرة.\n• كاميرا خلفية مزدوجة لصور واضحة ومكالمات فيديو نقية\n• واجهة One UI السلسة وسهلة الاستخدام\n• بطارية 5000mAh تدوم طوال اليوم',
      en: 'Samsung’s reliable everyday budget smartphone with a large, clear display.\n• Dual rear camera for crisp photos and video calls\n• Smooth and intuitive Samsung One UI experience\n• 5000mAh all-day battery life'
    },
    price: 5850,
    originalPrice: 6400,
    unit: { ar: 'جهاز', en: 'device' },
    image: '/images/products/galaxy-a07.jpg',
    categorySlug: 'smartphones',
    badge: { ar: 'أفضل سعر', en: 'Best Value' },
    colors: ['فضي جليدي', 'أسود'],
    options: ['64GB / 4GB RAM', '128GB / 4GB RAM']
  },
  {
    id: 'eg-iphone-16-pro',
    name: {
      ar: 'آيفون 16 برو ماكس — تيتانيوم أصلي',
      en: 'iPhone 16 Pro Max — Titanium'
    },
    description: {
      ar: 'أحدث إصدار من آبل بتصميم تيتانيوم فائق المتانة وشاشة Super Retina XDR مقاس 6.9 بوصة.\n• معالج A18 Pro للأداء الفائق والألعاب\n• كاميرا احترافية بدقة 48 ميجابيكسل مع تقريب بصري 5x\n• ضمان رسمي معتمد من متجر الجندي',
      en: 'Apple flagship in aerospace-grade Titanium with a 6.9-inch Super Retina XDR display.\n• A18 Pro chip for pro performance and gaming\n• 48MP Fusion camera with 5x optical zoom\n• Official certified warranty from EL-GENDY Store'
    },
    price: 68500,
    originalPrice: 72000,
    unit: { ar: 'جهاز', en: 'device' },
    image: '/images/products/iphone-pro.svg',
    categorySlug: 'smartphones',
    badge: { ar: 'الأكثر طلباً', en: 'Best Seller' },
    colors: ['تيتانيوم صحراوي', 'تيتانيوم أسود', 'تيتانيوم طبيعي'],
    options: ['256GB', '512GB', '1TB'],
    featured: true
  },
  {
    id: 'eg-samsung-s25-ultra',
    name: {
      ar: 'سامسونج جالاكسي S25 الترا 5G',
      en: 'Samsung Galaxy S25 Ultra 5G'
    },
    description: {
      ar: 'تجربة الذكاء الاصطناعي المتكاملة مع قلم S Pen المدمج وشاشة Dynamic AMOLED 2X.\n• كاميرا 200 ميجابيكسل للتصوير الليلي الاحترافي\n• بطارية 5000 مللي أمبير تدعم الشحن السريع 45 وات\n• ضمان محلي وسريع الاستبدال',
      en: 'Next-gen Galaxy AI experience with built-in S Pen and Dynamic AMOLED 2X display.\n• 200MP pro-grade camera for stunning nightography\n• 5000mAh battery with 45W super fast charging\n• Official local warranty included'
    },
    price: 56900,
    originalPrice: 60500,
    unit: { ar: 'جهاز', en: 'device' },
    image: '/images/products/galaxy-ultra.svg',
    categorySlug: 'smartphones',
    badge: { ar: 'وصل حديثاً', en: 'New Arrival' },
    colors: ['أسود تيتانيوم', 'رمادي تيتانيوم', 'أزرق سماوي'],
    options: ['256GB / 12GB RAM', '512GB / 12GB RAM'],
    featured: true
  },
  {
    id: 'eg-airpods-pro-2',
    name: {
      ar: 'سماعة آبل إيربودز برو 2 — USB-C',
      en: 'Apple AirPods Pro 2 — USB-C'
    },
    description: {
      ar: 'عزل ضوضاء نشط مضاعف وصوت مكاني غامر بتقنية شريحة H2.\n• علبة شحن MagSafe بمنفذ USB-C ومكبر صوت مدمج للتتبع\n• مقاومة للغبار والماء بمعيار IP54\n• بطارية تدوم حتى 30 ساعة مع العلبة',
      en: '2x Active Noise Cancellation and Spatial Audio powered by the H2 chip.\n• MagSafe USB-C charging case with Precision Finding\n• IP54 dust, sweat, and water resistance\n• Up to 30 hours total listening time'
    },
    price: 11400,
    originalPrice: 12800,
    unit: { ar: 'قطعة', en: 'piece' },
    image: '/images/products/earbuds-pro.svg',
    categorySlug: 'audio-wearables',
    badge: { ar: 'أصلي 100%', en: '100% Genuine' },
    colors: ['أبيض'],
    featured: true
  },
  {
    id: 'eg-smartwatch-ultra',
    name: {
      ar: 'ساعة ذكية AMOLED الترا للمكالمات والرياضة',
      en: 'Ultra AMOLED Smartwatch — BT Calling'
    },
    description: {
      ar: 'شاشة AMOLED عالية السطوع مع هيكل معدني مقاوم للصدمات ودعم كامل للغة العربية.\n• استقبال وإجراء المكالمات عبر البلوتوث\n• قياس نبضات القلب والأكسجين وتتبع الأنشطة الرياضية\n• بطارية تدوم حتى 7 أيام مع شاحن مغناطيسي',
      en: 'High-brightness AMOLED display with rugged alloy body and full Arabic/English UI.\n• Bluetooth calling & instant notifications\n• Heart rate, SpO2 & multi-sport fitness tracking\n• Up to 7-day battery with magnetic charger'
    },
    price: 1850,
    originalPrice: 2300,
    unit: { ar: 'قطعة', en: 'piece' },
    image: '/images/products/smartwatch.svg',
    categorySlug: 'audio-wearables',
    badge: { ar: 'عرض خاص', en: 'Special Offer' },
    colors: ['أسود', 'برتقالي', 'فضي'],
    options: ['49mm']
  },
  {
    id: 'eg-gan-charger-65w',
    name: {
      ar: 'شاحن جداري فائق السرعة 65W GaN + كابل أصلي',
      en: '65W GaN Super Fast Charger + Braided Cable'
    },
    description: {
      ar: 'رأس شاحن بتقنية GaN المتطورة للشحن السريع والآمن لجميع الهواتف واللاب توب.\n• منفذين USB-C ومنفذ USB-A للشحن المتعدد في وقت واحد\n• حماية ذكية ضد ارتفاع الحرارة وتذبذب التيار\n• يشمل كابل قماشي مجدول بطول 1.5 متر',
      en: 'Advanced GaN 65W charger for ultra-fast, cool, and safe charging across phones and laptops.\n• Dual USB-C PD + USB-A ports for multi-device charging\n• Smart thermal & over-voltage protection\n• Includes 1.5m heavy-duty braided USB-C cable'
    },
    price: 780,
    originalPrice: 950,
    unit: { ar: 'طقم', en: 'set' },
    image: '/images/products/gan-charger.svg',
    categorySlug: 'chargers-power',
    badge: { ar: 'شحن سريع', en: 'Fast Charge' },
    colors: ['أسود', 'أبيض']
  },
  {
    id: 'eg-magsafe-powerbank',
    name: {
      ar: 'باور بانك ماج سيف مغناطيسي 10000mAh',
      en: 'MagSafe Magnetic Power Bank 10000mAh'
    },
    description: {
      ar: 'تصميم نحيف يلتصق مغناطيسياً بظهر الهاتف مع شاشة رقمية لعرض نسبة الشحن.\n• شحن لاسلكي سريع 15W + منفذ USB-C بقوة 20W\n• سعة حقيقية 10000 مللي أمبير خفيف الوزن في الجيب\n• متوافق مع الآيفون وجميع الهواتف الداعمة للشحن اللاسلكي',
      en: 'Slim magnetic wireless power bank with digital LED battery indicator.\n• 15W wireless MagSafe + 20W USB-C PD fast output\n• True 10000mAh capacity in a pocket-sized body\n• Compatible with iPhone & Qi-enabled devices'
    },
    price: 1250,
    originalPrice: 1550,
    unit: { ar: 'قطعة', en: 'piece' },
    image: '/images/products/powerbank.svg',
    categorySlug: 'chargers-power',
    colors: ['أسود مطفي', 'أزرق داكن', 'فضي']
  },
  {
    id: 'eg-magsafe-protection-kit',
    name: {
      ar: 'باكدج حماية متكامل: جراب ماج سيف + اسكرينة 9H',
      en: 'Complete Protection Kit: MagSafe Case + 9H Glass'
    },
    description: {
      ar: 'حماية شاملة لهاتفك ضد الصدمات والخدوش مع الحفاظ على المظهر الأنيق.\n• جراب شفاف مضاد للاصفرار بحلقة ماج سيف مغناطيسية قوية\n• حواف بارزة لحماية عدسات الكاميرا والشاشة\n• اسكرينة زجاجية مقواة 9H مضادة للبصمات',
      en: '360-degree protection against drops and scratches while keeping your phone sleek.\n• Anti-yellowing clear case with strong MagSafe ring\n• Raised camera & screen shock-absorbing edges\n• 9H oleophobic tempered glass screen protector'
    },
    price: 350,
    originalPrice: 480,
    unit: { ar: 'باكدج', en: 'bundle' },
    image: '/images/products/protection-kit.svg',
    categorySlug: 'cases-protection',
    badge: { ar: 'باكدج التوفير', en: 'Value Pack' },
    options: ['iPhone 16 Pro Max', 'iPhone 15 Pro Max', 'Samsung S25 Ultra']
  },
  {
    id: 'eg-privacy-glass',
    name: {
      ar: 'اسكرينة خصوصية زجاجية Anti-Spy 9H أصلية',
      en: 'Original Anti-Spy Privacy 9H Tempered Glass'
    },
    description: {
      ar: 'حماية للشاشة وخصوصية كاملة من الجوانب في الأماكن العامة والمواصلات.\n• وضوح عالي للرؤية الأمامية وإعتام كامل من الزوايا الجانبية\n• طبقة مقاومة لبصمات الأصابع وسهلة التركيب بدون فقاعات\n• متوفرة لجميع موديلات الآيفون والسامسونج',
      en: 'Keep your screen private in public while protecting it from impacts.\n• Crystal-clear front view with side-angle privacy filter\n• Anti-fingerprint coating & bubble-free installation\n• Available for all iPhone & Samsung models'
    },
    price: 180,
    originalPrice: 250,
    unit: { ar: 'قطعة', en: 'piece' },
    image: '/images/products/privacy-glass.svg',
    categorySlug: 'cases-protection',
    options: ['iPhone Series', 'Samsung Series']
  }
]
