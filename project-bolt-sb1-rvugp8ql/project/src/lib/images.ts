// Curated premium vape/smoking stock photos from Pexels (royalty-free).
// Deterministic selection by key so each product/category gets a stable image.

const VAPE_IMAGES = [
  'https://images.pexels.com/photos/2836486/pexels-photo-2836486.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1634350/pexels-photo-1634350.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8473002/pexels-photo-8473002.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/17142082/pexels-photo-17142082.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4449682/pexels-photo-4449682.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8473003/pexels-photo-8473003.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/5683018/pexels-photo-5683018.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4271934/pexels-photo-4271934.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8108055/pexels-photo-8108055.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/14609776/pexels-photo-14609776.jpeg?auto=compress&cs=tinysrgb&w=800',
];

const HERO_IMAGES = [
  'https://images.pexels.com/photos/1634350/pexels-photo-1634350.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/2836486/pexels-photo-2836486.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/8473002/pexels-photo-8473002.jpeg?auto=compress&cs=tinysrgb&w=1600',
];

const BLOG_IMAGES = [
  'https://images.pexels.com/photos/4449682/pexels-photo-4449682.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/5683018/pexels-photo-5683018.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/4271934/pexels-photo-4271934.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/8108055/pexels-photo-8108055.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/14609776/pexels-photo-14609776.jpeg?auto=compress&cs=tinysrgb&w=1200',
];

function hashKey(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h;
}

export const productImage = (key: string): string => VAPE_IMAGES[hashKey(key) % VAPE_IMAGES.length];
export const heroImage = (n = 0): string => HERO_IMAGES[n % HERO_IMAGES.length];
export const blogImage = (key: string): string => BLOG_IMAGES[hashKey(key) % BLOG_IMAGES.length];
