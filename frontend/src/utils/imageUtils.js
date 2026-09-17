export const getProductImage = (category) => {
  const images = {
    Smartphones: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=450&fit=crop',
    Laptops: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=450&fit=crop',
    Tablets: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&h=450&fit=crop',
    TVs: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=450&fit=crop',
    'Washing Machines': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&h=450&fit=crop',
    Refrigerators: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&h=450&fit=crop',
    'Air Conditioners': 'https://images.unsplash.com/photo-1631545806609-3c9b4ff50e5e?w=600&h=450&fit=crop',
    Audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=450&fit=crop',
    Smartwatches: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=450&fit=crop',
    Cameras: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=450&fit=crop',
    Monitors: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=450&fit=crop',
    Accessories: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=450&fit=crop',
    Appliances: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=450&fit=crop',
    Clothing: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=450&fit=crop',
  };
  
  return images[category] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=450&fit=crop';
};
