import axios from 'axios';

/**
 * Service to aggregate product data from various sources (Amazon, Flipkart, etc.)
 * Currently uses mocked data for development, designed to be swapped with RapidAPI or PA-API.
 */
export const fetchTrendingProducts = async () => {
  try {
    // In a real scenario, this would be an axios.get() to an API like Rainforest or Amazon PA-API
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulated Response from a Data Aggregator
    const mockData = [
      {
        externalId: 'B0CHX1WCGZ', // Amazon ASIN or similar
        name: 'Apple iPhone 15 Pro (128 GB) - Natural Titanium',
        brand: 'Apple',
        category: 'Smartphones',
        description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip.',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop', // Simulated high-res image
        basePrice: 134900,
        specs: {
          'Processor': 'A17 Pro chip',
          'RAM': '8GB',
          'Storage': '128GB',
          'Battery': '3274 mAh',
          'Display': '6.1-inch Super Retina XDR',
          'Camera': '48MP Main | 12MP Ultra Wide'
        },
        affiliateLinks: [
          { store: 'Amazon', url: 'https://amazon.in/dp/B0CHX1WCGZ', price: 134900 },
          { store: 'Flipkart', url: 'https://flipkart.com/apple-iphone-15-pro/p/itm', price: 133999 },
          { store: 'Croma', url: 'https://croma.com/iphone-15-pro', price: 134900 }
        ]
      },
      {
        externalId: 'B0C787W22H',
        name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)',
        brand: 'Samsung',
        category: 'Smartphones',
        description: 'The ultimate Galaxy AI experience with a titanium exterior and a 6.8-inch flat display.',
        image: 'https://images.unsplash.com/photo-1707327889104-5f5f401f8d48?q=80&w=600&auto=format&fit=crop',
        basePrice: 129999,
        specs: {
          'Processor': 'Snapdragon 8 Gen 3',
          'RAM': '12GB',
          'Storage': '256GB',
          'Battery': '5000 mAh',
          'Display': '6.8-inch Dynamic AMOLED 2X',
          'Camera': '200MP Main | 50MP Telephoto'
        },
        affiliateLinks: [
          { store: 'Amazon', url: 'https://amazon.in/dp/B0C787W22H', price: 129999 },
          { store: 'Samsung Store', url: 'https://samsung.com/in/s24-ultra', price: 129999 },
          { store: 'Reliance Digital', url: 'https://reliancedigital.in/samsung-s24', price: 128500 }
        ]
      },
      {
        externalId: 'M2_AIR_13',
        name: 'MacBook Air M2 (2022) - Starlight',
        brand: 'Apple',
        category: 'Laptops',
        description: 'Supercharged by M2. Strikingly thin design with all-day battery life.',
        image: 'https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?q=80&w=600&auto=format&fit=crop',
        basePrice: 99900,
        specs: {
          'Processor': 'Apple M2 (8-core CPU, 8-core GPU)',
          'RAM': '8GB Unified Memory',
          'Storage': '256GB SSD',
          'Battery': 'Up to 18 hours',
          'Display': '13.6-inch Liquid Retina',
          'Weight': '1.24 kg'
        },
        affiliateLinks: [
          { store: 'Amazon', url: 'https://amazon.in/dp/M2AIR13', price: 99900 },
          { store: 'Flipkart', url: 'https://flipkart.com/macbook-air-m2', price: 94990 }
        ]
      },
      {
        externalId: 'NOTHING_2A',
        name: 'Nothing Phone (2a) 5G (White, 8GB RAM, 256GB Storage)',
        brand: 'Nothing',
        category: 'Smartphones',
        description: 'Uniquely designed smartphone focusing on what matters most. Features the iconic Glyph Interface.',
        image: 'https://images.unsplash.com/photo-1690204785465-4d37c352723c?q=80&w=600&auto=format&fit=crop', // Placeholder for nothing phone
        basePrice: 25999,
        specs: {
          'Processor': 'MediaTek Dimensity 7200 Pro',
          'RAM': '8GB',
          'Storage': '256GB',
          'Battery': '5000 mAh',
          'Display': '6.7-inch Flexible AMOLED',
          'Camera': '50MP Dual Rear | 32MP Front'
        },
        affiliateLinks: [
          { store: 'Flipkart', url: 'https://flipkart.com/nothing-2a', price: 25999 },
          { store: 'Croma', url: 'https://croma.com/nothing-phone-2a', price: 25999 }
        ]
      },
      {
        externalId: 'PIXEL_8_PRO',
        name: 'Google Pixel 8 Pro (Obsidian, 128 GB)',
        brand: 'Google',
        category: 'Smartphones',
        description: 'The best of Google AI. Powerful processor and pro-level cameras.',
        image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=600&auto=format&fit=crop', 
        basePrice: 106999,
        specs: {
          'Processor': 'Google Tensor G3',
          'RAM': '12GB',
          'Storage': '128GB',
          'Battery': '5050 mAh',
          'Display': '6.7-inch Super Actua OLED',
          'Camera': '50MP Main | 48MP Telephoto'
        },
        affiliateLinks: [
          { store: 'Flipkart', url: 'https://flipkart.com/pixel-8-pro', price: 106999 },
          { store: 'Amazon', url: 'https://amazon.in/pixel-8-pro', price: 105000 }
        ]
      },
      {
        externalId: 'DELL_XPS_15',
        name: 'Dell XPS 15 9530 (2023) - Platinum Silver',
        brand: 'Dell',
        category: 'Laptops',
        description: 'Create with power and performance on this premium 15-inch laptop.',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600&auto=format&fit=crop',
        basePrice: 219000,
        specs: {
          'Processor': 'Intel Core i7-13700H',
          'RAM': '16GB DDR5',
          'Storage': '512GB SSD',
          'Battery': '86Wh',
          'Display': '15.6-inch FHD+',
          'Weight': '1.92 kg'
        },
        affiliateLinks: [
          { store: 'Amazon', url: 'https://amazon.in/dell-xps', price: 219000 },
          { store: 'Dell Store', url: 'https://dell.com/in/xps-15', price: 215000 }
        ]
      }
    ];

    return mockData;
  } catch (error) {
    console.error('Error in aggregatorService:', error);
    throw error;
  }
};
