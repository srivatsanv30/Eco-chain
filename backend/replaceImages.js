import fs from 'fs';

const files = ['./utils/seedData.js', './utils/moreProducts.js'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/name:\s*['"]([^'"]+)['"],[\s\S]*?image:\s*['"]([^'"]+)['"]/g, (match, p1, p2) => {
    // Generate pollinations URL
    const prompt = `Product photography of ${p1}, studio lighting, white background, high quality, 4k`;
    const newImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=400&height=400&nologo=true`;
    return match.replace(p2, newImageUrl);
  });
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
});
