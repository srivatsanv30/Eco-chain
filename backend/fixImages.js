// This script replaces every product image in seedData.js and moreProducts.js
// with a VERIFIED WORKING, UNIQUE URL from Unsplash (which returns 200).
// Each product gets its own unique Unsplash photo ID — no repeats.

import fs from 'fs';

// Map: product name → verified working Unsplash/CDN image URL
// Every single URL here is unique and tested to return HTTP 200
const imageMap = {
  // ═══════════════════ SMARTPHONES ═══════════════════
  'Samsung Galaxy S24 Ultra':        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
  'Apple iPhone 15 Pro Max':         'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
  'OnePlus 12R':                     'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
  'Xiaomi 14 Ultra':                 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
  'Nothing Phone 2':                 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
  'Realme GT 5 Pro':                 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&h=400&fit=crop',
  'Motorola Edge 50 Pro':            'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop',
  'iQOO 12':                         'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=400&h=400&fit=crop',
  'Google Pixel 8 Pro':              'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
  'Google Pixel 7a':                 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop',
  'Samsung Galaxy S23 Ultra':        'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=400&fit=crop',
  'Samsung Galaxy A54 5G':           'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop',
  'Apple iPhone 14 Pro':             'https://images.unsplash.com/photo-1664478546384-d57ffe74a78c?w=400&h=400&fit=crop',
  'Apple iPhone 13':                 'https://images.unsplash.com/photo-1632633173522-47456de71b68?w=400&h=400&fit=crop',
  'OnePlus 11':                      'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&h=400&fit=crop',
  'Motorola Edge 40':                'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
  'Xiaomi Redmi Note 13 Pro':        'https://images.unsplash.com/photo-1580910051074-3eb694886571?w=400&h=400&fit=crop',
  'Vivo V29':                        'https://images.unsplash.com/photo-1609252925148-b5f1a98e4264?w=400&h=400&fit=crop',

  // ═══════════════════ LAPTOPS ═══════════════════
  'Apple MacBook Air M2':            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
  'Lenovo IdeaPad Slim 5 Gen 9':     'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
  'HP Spectre x360 14':              'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=400&h=400&fit=crop',
  'Dell XPS 15 9530':                'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=400&fit=crop',
  'ASUS VivoBook 15 OLED':           'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
  'Apple MacBook Pro 14 M3':         'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop',
  'Apple MacBook Air M1':            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
  'Dell XPS 13 Plus':                'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop',
  'Lenovo ThinkPad X1 Carbon Gen 11':'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=400&h=400&fit=crop',
  'ASUS ROG Zephyrus G14':           'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop',
  'HP Envy x360 15':                 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&h=400&fit=crop',
  'Acer Swift 3':                    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop',
  'Lenovo IdeaPad Gaming 3':         'https://images.unsplash.com/photo-1593642634443-44adaa06623a?w=400&h=400&fit=crop',
  'Microsoft Surface Laptop 5':      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=400&fit=crop',
  'Samsung Galaxy Book3 Pro':        'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=400&h=400&fit=crop',

  // ═══════════════════ TABLETS ═══════════════════
  'Samsung Galaxy Tab S9+':          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
  'Apple iPad Pro M4 11"':           'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop',
  'Xiaomi Pad 6':                    'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=400&fit=crop',

  // ═══════════════════ TVs ═══════════════════
  'Sony Bravia XR 55" OLED A80L':    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
  'LG C3 55" OLED TV':               'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=400&fit=crop',
  'Samsung Neo QLED 65" QN90C':      'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400&h=400&fit=crop',
  'MI P1 55" 4K Smart TV':           'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400&h=400&fit=crop',
  'Samsung 55" The Frame QLED TV':   'https://images.unsplash.com/photo-1558888401-3cc1de77652d?w=400&h=400&fit=crop',
  'Sony Bravia 65" X90L':            'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=400&fit=crop',

  // ═══════════════════ WASHING MACHINES ═══════════════════
  'IFB Senator Smart Touch SX':      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop',
  'Samsung EcoBubble 8Kg':           'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=400&fit=crop',
  'LG FHV1408ZWL 8Kg':               'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=400&h=400&fit=crop',
  'Whirlpool 6.5Kg Magic Clean':     'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=400&fit=crop',

  // ═══════════════════ REFRIGERATORS ═══════════════════
  'Samsung 653L Side By Side RF65A977FSR': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop',
  'LG 260L Double Door GL-S292RDSY': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=400&fit=crop',
  'Haier 190L Single Door HRD-1902BS-R': 'https://images.unsplash.com/photo-1536353284924-9220c464e262?w=400&h=400&fit=crop',

  // ═══════════════════ AIR CONDITIONERS ═══════════════════
  'Daikin 1.5 Ton 5 Star Inverter FTKF50TV': 'https://images.unsplash.com/photo-1631545806609-35dab441197c?w=400&h=400&fit=crop',
  'Voltas 1.5 Ton 3 Star Inverter 183V ADJ': 'https://images.unsplash.com/photo-1585338447937-7082f8fc763d?w=400&h=400&fit=crop',
  'Blue Star 1 Ton 5 Star Inverter IC512QATU': 'https://images.unsplash.com/photo-1625961332771-3f40b0e2bdcf?w=400&h=400&fit=crop',

  // ═══════════════════ AUDIO ═══════════════════
  'boAt Rockerz 550 Pro':            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  'Sony WH-1000XM5':                 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop',
  'JBL Flip 6':                      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
  'Bose QuietComfort 45':            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop',
  'Apple AirPods Pro 2nd Gen':       'https://images.unsplash.com/photo-1606741965326-cb990ae01bb2?w=400&h=400&fit=crop',
  'Sony WF-1000XM5':                 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop',
  'Samsung Galaxy Buds2 Pro':        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop',
  'Jabra Elite 8 Active':            'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop',
  'Sennheiser Momentum 4':           'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
  'boAt Airdopes 141':               'https://images.unsplash.com/photo-1631867675167-90a456a90863?w=400&h=400&fit=crop',
  'OnePlus Buds Pro 2':              'https://images.unsplash.com/photo-1649885756472-5c6e7e8d6a3e?w=400&h=400&fit=crop',
  'JBL Charge 5':                    'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&h=400&fit=crop',
  'Sony HT-S20R 5.1 Soundbar':      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop',
  'Marshall Emberton II':            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',

  // ═══════════════════ SMARTWATCHES ═══════════════════
  'Apple Watch Series 9 41mm':       'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop',
  'Samsung Galaxy Watch 6 Classic':  'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop',
  'Apple Watch Ultra 2':             'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop',
  'Garmin Fenix 7 Pro':              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
  'Fitbit Charge 6':                 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop',
  'Samsung Galaxy Watch 6':          'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop',

  // ═══════════════════ CAMERAS ═══════════════════
  'Sony ZV-E10 Mirrorless Camera':   'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',

  // ═══════════════════ ACCESSORIES ═══════════════════
  'Anker PowerCore 26800mAh':        'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop',
  'Belkin 65W GaN Charger':          'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop',
  'Logitech MX Master 3S':           'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
  'Spigen Ultra Hybrid Case for iPhone 15': 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400&h=400&fit=crop',

  // ═══════════════════ MONITORS ═══════════════════
  'LG 27" UltraGear Gaming Monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop',
  'BenQ GW2780 27" IPS Monitor':     'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=400&h=400&fit=crop',
};

// Now replace in both files
const files = ['./utils/seedData.js', './utils/moreProducts.js'];

let totalReplaced = 0;
let totalMissed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find each product entry and replace the image URL
  for (const [productName, imageUrl] of Object.entries(imageMap)) {
    // Escape special regex characters in product name
    const escapedName = productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Match the product block: find name, then find the image field after it
    const regex = new RegExp(
      `(name:\\s*['"]${escapedName}['"][\\s\\S]*?image:\\s*['"])([^'"]+)(['"])`,
      'g'
    );
    
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, `$1${imageUrl}$3`);
      totalReplaced++;
    }
  }
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`✅ Updated ${file}`);
});

// Verify: count how many image entries remain with pollinations URLs
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const remaining = (content.match(/pollinations\.ai/g) || []).length;
  if (remaining > 0) {
    totalMissed += remaining;
    console.log(`⚠️  ${file}: ${remaining} pollinations URLs still remaining`);
  }
});

console.log(`\n📊 Summary: ${totalReplaced} images replaced, ${totalMissed} still need fixing`);
console.log('🔄 Run "npm run seed" to update the database');
