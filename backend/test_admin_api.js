const http = require('http');

function postJSON(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: '127.0.0.1',
      port: 5000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function testAdmin() {
  console.log('Testing Admin Product Creation API...');
  const res = await postJSON('/api/products', {
    name: 'Amul Fresh Butter 500g',
    category: 'dairy',
    categoryName: 'Dairy & Cheese',
    price: 275,
    unit: '500 g',
    tag: 'BESTSELLER',
    color: 'yellow',
    image: 'frontend/images/salted_butter.svg',
    desc: 'Pure pasteurized creamery salted table butter block'
  });
  console.log('Admin Product Add Result:', JSON.stringify(res, null, 2));
}

testAdmin().catch(console.error);
