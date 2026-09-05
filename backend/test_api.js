const http = require('http');

function postJSON(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: 'localhost',
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

async function test() {
  console.log('Testing Order Placement via API...');
  const orderRes = await postJSON('/api/orders', {
    customer: { name: 'Roshan Sahu Realtime Test', phone: '9876543210', address: '123 Park Street' },
    items: [{ id: 'p13', quantity: 2 }, { id: 'p1', quantity: 1 }],
    paymentMethod: 'UPI / QR Code'
  });
  console.log('Order Result:', JSON.stringify(orderRes, null, 2));
}

test().catch(console.error);
