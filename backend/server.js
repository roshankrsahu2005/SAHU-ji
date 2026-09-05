const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase Cloud Configuration with fallback
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://fsdodhxdjytwvfdxskkd.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzZG9kaHhkanl0d3ZmZHhza2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MzMxNzUsImV4cCI6MjEwNDEwOTE3NX0.5iGtgHc3Z4lpPuCDC1H7NXJGDtDZxg8tNAz-qB-H0fU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../')));

// Local JSON Database Helper functions
const DB_PATH = path.join(__dirname, 'data/db.json');

function getDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to read local db.json:', err.message);
  }
  return {};
}

function saveDB(dbData) {
  try {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save local db.json:', err.message);
  }
}

// In-Memory Catalog Master Products Database (81 items)
const products = [
  // Snacks & Biscuits
  { id: 'p1', name: 'Parle-G Biscuits', category: 'biscuits', categoryName: 'Biscuits & Cookies', price: 55, unit: '800 g', desc: 'Classic glucose biscuits', tag: 'BESTSELLER', color: 'blue', image: 'frontend/images/parle_g.png', visual: { type: 'biscuit', brand: 'PARLE', title: 'G', sub: 'GLUCO BISCUITS' } },
  { id: 'p2', name: "Lay's Classic Salted", category: 'chips', categoryName: 'Chips & Snacks', price: 20, unit: '50 g', desc: 'Crispy salted potato chips', tag: '', color: 'red', image: 'frontend/images/lays.png', visual: { type: 'chip', brand: "LAY'S", title: 'Classic<br>Salted' } },
  { id: 'p3', name: 'Fanta Orange', category: 'drinks', categoryName: 'Beverages & Soda', price: 45, unit: '750 ml', desc: 'Sparkling orange drink', tag: 'NEW IN', color: 'orange', image: 'frontend/images/fanta.png', visual: { type: 'drink', title: 'FANTA', sub: 'ORANGE' } },
  { id: 'p4', name: 'Cadbury 5 Star', category: 'chocolates', categoryName: 'Chocolates & Sweets', price: 25, unit: '40 g', desc: 'Chewy caramel chocolate bar', tag: '', color: 'brown', image: 'frontend/images/5star.png', visual: { type: 'chocolate', title: '5 STAR', sub: 'CRISP. CHEWY. CHOCOLATEY.' } },
  { id: 'p5', name: 'Britannia Good Day', category: 'biscuits', categoryName: 'Biscuits & Cookies', price: 40, unit: '200 g', desc: 'Rich cashew cookies', tag: 'POPULAR', color: 'yellow', image: 'frontend/images/goodday.png', visual: { type: 'biscuit', brand: 'BRITANNIA', title: 'Good Day', sub: 'CASHEW COOKIES' } },
  { id: 'p6', name: 'Coca-Cola', category: 'drinks', categoryName: 'Beverages & Soda', price: 45, unit: '750 ml', desc: 'Refreshing soft drink', tag: '', color: 'green', image: 'frontend/images/coke.png', visual: { type: 'drink', title: 'COCA-COLA', sub: 'ORIGINAL TASTE · 750 ML' } },
  { id: 'p7', name: 'Kurkure Masala Munch', category: 'chips', categoryName: 'Chips & Snacks', price: 30, unit: '90 g', desc: 'Crunchy masala snack', tag: 'BESTSELLER', color: 'orange', image: 'frontend/images/kurkure.png', visual: { type: 'chip', brand: 'KURKURE', title: 'Masala<br>Munch' } },
  { id: 'p8', name: 'Cadbury Dairy Milk', category: 'chocolates', categoryName: 'Chocolates & Sweets', price: 100, unit: '110 g', desc: 'Fruit & nut milk chocolate', tag: '', color: 'brown', image: 'frontend/images/dairymilk.png', visual: { type: 'chocolate', title: 'DAIRY MILK', sub: 'FRUIT & NUT · 110 G' } },
  { id: 'p9', name: 'Oreo Original', category: 'biscuits', categoryName: 'Biscuits & Cookies', price: 35, unit: '120 g', desc: 'Vanilla creme chocolate cookies', tag: '', color: 'blue', image: 'frontend/images/oreo.png', visual: { type: 'biscuit', brand: 'OREO', title: 'Original', sub: 'VANILLA CREME COOKIES' } },
  { id: 'p10', name: 'Sprite Lemon-Lime', category: 'drinks', categoryName: 'Beverages & Soda', price: 45, unit: '750 ml', desc: 'Clear sparkling soda', tag: 'POPULAR', color: 'green', image: 'frontend/images/sprite.png', visual: { type: 'drink', title: 'SPRITE', sub: 'LEMON-LIME · 750 ML' } },
  { id: 'p11', name: 'Bingo Mad Angles', category: 'chips', categoryName: 'Chips & Snacks', price: 25, unit: '65 g', desc: 'Achaari Masti triangle chips', tag: '', color: 'red', image: 'frontend/images/bingo.png', visual: { type: 'chip', brand: 'BINGO!', title: 'Mad<br>Angles' } },
  { id: 'p12', name: 'KitKat 4-Finger', category: 'chocolates', categoryName: 'Chocolates & Sweets', price: 40, unit: '38.5 g', desc: 'Crispy wafer fingers in chocolate', tag: 'BESTSELLER', color: 'red', image: 'frontend/images/kitkat.png', visual: { type: 'chocolate', title: 'KITKAT', sub: 'HAVE A BREAK' } },

  // Dairy & Cheese
  { id: 'p13', name: 'Toned Milk Pouch', category: 'dairy', categoryName: 'Dairy & Cheese', price: 28, unit: '500 ml', desc: 'Pasteurized fresh toned milk pouch', tag: 'FRESH', color: 'blue', image: 'frontend/images/toned_milk.svg', visual: { type: 'drink', title: 'TONED MILK', sub: 'FRESH 500 ML' } },
  { id: 'p14', name: 'Full Cream Milk Pouch', category: 'dairy', categoryName: 'Dairy & Cheese', price: 34, unit: '500 ml', desc: 'Rich & creamy full cream milk', tag: 'BESTSELLER', color: 'orange', image: 'frontend/images/full_cream_milk.svg', visual: { type: 'drink', title: 'FULL CREAM', sub: 'MILK 500 ML' } },
  { id: 'p15', name: 'Plain Dahi (Curd)', category: 'dairy', categoryName: 'Dairy & Cheese', price: 35, unit: '400 g', desc: 'Thick & natural plain dahi curd', tag: 'FRESH', color: 'blue', image: 'frontend/images/plain_dahi.svg', visual: { type: 'biscuit', title: 'PLAIN DAHI', sub: 'CURD 400 G' } },
  { id: 'p16', name: 'Salted Table Butter', category: 'dairy', categoryName: 'Dairy & Cheese', price: 58, unit: '100 g', desc: 'Delicious creamery salted butter', tag: 'POPULAR', color: 'yellow', image: 'frontend/images/salted_butter.svg', visual: { type: 'biscuit', title: 'AMUL BUTTER', sub: 'SALTED 100 G' } },
  { id: 'p17', name: 'Fresh Paneer Block', category: 'dairy', categoryName: 'Dairy & Cheese', price: 95, unit: '200 g', desc: 'Soft & fresh cottage cheese block', tag: 'FRESH', color: 'green', image: 'frontend/images/fresh_paneer.svg', visual: { type: 'biscuit', title: 'FRESH PANEER', sub: '200 G BLOCK' } },
  { id: 'p18', name: 'Processed Cheese Slices', category: 'dairy', categoryName: 'Dairy & Cheese', price: 145, unit: '200 g · 10 Slices', desc: 'Creamy cheese slices for sandwiches', tag: '', color: 'yellow', image: 'frontend/images/cheese_slices.svg', visual: { type: 'biscuit', title: 'CHEESE SLICES', sub: '10 SLICES 200 G' } },
  { id: 'p19', name: 'Mozzarella Shredded Cheese', category: 'dairy', categoryName: 'Dairy & Cheese', price: 195, unit: '200 g', desc: 'Shredded mozzarella for pizza', tag: 'NEW', color: 'orange', image: 'frontend/images/mozzarella_cheese.svg', visual: { type: 'biscuit', title: 'MOZZARELLA', sub: 'SHREDDED CHEESE' } },
  { id: 'p20', name: 'Chaas (Buttermilk)', category: 'dairy', categoryName: 'Dairy & Cheese', price: 15, unit: '250 ml', desc: 'Refreshing spiced masala chaas', tag: 'COOL', color: 'green', image: 'frontend/images/chaas.svg', visual: { type: 'drink', title: 'MASALA CHAAS', sub: 'BUTTERMILK' } },
  { id: 'p21', name: 'Sweet Lassi', category: 'dairy', categoryName: 'Dairy & Cheese', price: 25, unit: '200 ml', desc: 'Thick & sweet traditional lassi', tag: 'COOL', color: 'orange', image: 'frontend/images/sweet_lassi.svg', visual: { type: 'drink', title: 'SWEET LASSI', sub: '200 ML POUCH' } },

  // Bakery & Bread
  { id: 'p22', name: 'White Sandwich Bread', category: 'bakery', categoryName: 'Bakery & Bread', price: 40, unit: '400 g', desc: 'Soft white sandwich bread loaf', tag: 'DAILY FRESH', color: 'blue', image: 'frontend/images/white_bread.svg', visual: { type: 'biscuit', title: 'WHITE BREAD', sub: '400 G LOAF' } },
  { id: 'p23', name: 'Brown Wheat Bread', category: 'bakery', categoryName: 'Bakery & Bread', price: 45, unit: '400 g', desc: '100% whole wheat brown bread', tag: 'HEALTHY', color: 'brown', image: 'frontend/images/brown_bread.svg', visual: { type: 'biscuit', title: 'BROWN BREAD', sub: 'WHOLE WHEAT' } },
  { id: 'p24', name: 'Pav Buns', category: 'bakery', categoryName: 'Bakery & Bread', price: 25, unit: '6 Pcs · 250 g', desc: 'Soft & fluffy bakery pav buns', tag: 'FRESH', color: 'yellow', image: 'frontend/images/pav_buns.svg', visual: { type: 'biscuit', title: 'PAV BUNS', sub: 'PACK OF 6' } },
  { id: 'p25', name: 'Burger Buns', category: 'bakery', categoryName: 'Bakery & Bread', price: 30, unit: '4 Pcs · 200 g', desc: 'Sesame burger buns pack', tag: '', color: 'orange', image: 'frontend/images/burger_buns.svg', visual: { type: 'biscuit', title: 'BURGER BUNS', sub: 'PACK OF 4' } },
  { id: 'p26', name: 'Pizza Base', category: 'bakery', categoryName: 'Bakery & Bread', price: 35, unit: '2 Pcs · 200 g', desc: 'Ready-to-bake pizza crust bases', tag: '', color: 'yellow', image: 'frontend/images/pizza_base.svg', visual: { type: 'biscuit', title: 'PIZZA BASE', sub: 'PACK OF 2' } },
  { id: 'p27', name: 'Wheat Toast (Rusk)', category: 'bakery', categoryName: 'Bakery & Bread', price: 45, unit: '300 g', desc: 'Crispy teatime wheat rusk toast', tag: 'TEA TIME', color: 'brown', image: 'frontend/images/wheat_rusk.svg', visual: { type: 'biscuit', title: 'WHEAT RUSK', sub: 'CRUNCHY TOAST' } },
  { id: 'p28', name: 'Fruit Tea Cake', category: 'bakery', categoryName: 'Bakery & Bread', price: 55, unit: '150 g', desc: 'Tutti frutti soft slice cake', tag: 'SWEET', color: 'red', image: 'frontend/images/fruit_cake.svg', visual: { type: 'biscuit', title: 'FRUIT CAKE', sub: 'TEA CAKE SLICE' } },

  // Fruits & Veggies
  { id: 'p29', name: 'Red Onions', category: 'produce', categoryName: 'Fruits & Veggies', price: 35, unit: '1 kg', desc: 'Fresh farm-picked red onions', tag: 'STAPLE', color: 'red', image: 'frontend/images/red_onions.svg', visual: { type: 'biscuit', title: 'RED ONIONS', sub: '1 KG FRESH' } },
  { id: 'p30', name: 'Hybrid Tomatoes', category: 'produce', categoryName: 'Fruits & Veggies', price: 28, unit: '1 kg', desc: 'Juicy red hybrid tomatoes', tag: 'FRESH', color: 'red', image: 'frontend/images/hybrid_tomatoes.svg', visual: { type: 'biscuit', title: 'TOMATOES', sub: '1 KG HYBRID' } },
  { id: 'p31', name: 'Jyoti Potatoes', category: 'produce', categoryName: 'Fruits & Veggies', price: 30, unit: '1 kg', desc: 'Premium fresh Jyoti potatoes', tag: 'STAPLE', color: 'brown', image: 'frontend/images/jyoti_potatoes.svg', visual: { type: 'biscuit', title: 'POTATOES', sub: '1 KG JYOTI' } },
  { id: 'p32', name: 'Fresh Green Peas', category: 'produce', categoryName: 'Fruits & Veggies', price: 60, unit: '500 g', desc: 'Sweet fresh green matar peas', tag: 'SEASONAL', color: 'green', image: 'frontend/images/green_peas.svg', visual: { type: 'biscuit', title: 'GREEN PEAS', sub: '500 G MATAR' } },
  { id: 'p33', name: 'Green Bell Pepper (Capsicum)', category: 'produce', categoryName: 'Fruits & Veggies', price: 40, unit: '250 g', desc: 'Crisp green capsicum bell pepper', tag: 'FRESH', color: 'green', image: 'frontend/images/green_capsicum.svg', visual: { type: 'biscuit', title: 'CAPSICUM', sub: '250 G GREEN' } },
  { id: 'p34', name: 'Cauliflower', category: 'produce', categoryName: 'Fruits & Veggies', price: 35, unit: '1 Pc · 500 g', desc: 'Fresh white cauliflower head', tag: 'FARM FRESH', color: 'green', image: 'frontend/images/cauliflower.svg', visual: { type: 'biscuit', title: 'CAULIFLOWER', sub: '1 PC FRESH' } },
  { id: 'p35', name: 'Ladyfinger (Bhindi)', category: 'produce', categoryName: 'Fruits & Veggies', price: 38, unit: '500 g', desc: 'Tender green ladyfinger bhindi', tag: 'FRESH', color: 'green', image: 'frontend/images/ladyfinger.svg', visual: { type: 'biscuit', title: 'BHINDI', sub: '500 G FRESH' } },
  { id: 'p36', name: 'Bananas (Robusta)', category: 'produce', categoryName: 'Fruits & Veggies', price: 45, unit: '1 Dozen · 12 Pcs', desc: 'Sweet ripe yellow bananas', tag: 'HIGH ENERGY', color: 'yellow', image: 'frontend/images/bananas.svg', visual: { type: 'biscuit', title: 'BANANAS', sub: '1 DOZEN 12 PCS' } },
  { id: 'p37', name: 'Apples (Royal Gala)', category: 'produce', categoryName: 'Fruits & Veggies', price: 160, unit: '4 Pcs · 500 g', desc: 'Crisp sweet imported Royal Gala apples', tag: 'PREMIUM', color: 'red', image: 'frontend/images/apples.svg', visual: { type: 'biscuit', title: 'APPLES', sub: 'ROYAL GALA' } },

  // Chips & Snacks
  { id: 'p38', name: 'Cream and Onion Chips', category: 'chips', categoryName: 'Chips & Snacks', price: 20, unit: '50 g', desc: "Lay's American style cream & onion", tag: 'POPULAR', color: 'green', image: 'frontend/images/cream_onion_chips.svg', visual: { type: 'chip', brand: "LAY'S", title: 'Cream &<br>Onion' } },
  { id: 'p39', name: 'Aloo Bhujia Sev', category: 'chips', categoryName: 'Chips & Snacks', price: 55, unit: '200 g', desc: "Haldiram's spicy potato bhujia", tag: 'BESTSELLER', color: 'yellow', image: 'frontend/images/aloo_bhujia.svg', visual: { type: 'chip', brand: 'HALDIRAM', title: 'Aloo<br>Bhujia' } },
  { id: 'p40', name: 'Khatta Meetha Namkeen', category: 'chips', categoryName: 'Chips & Snacks', price: 50, unit: '200 g', desc: 'Sweet and tangy crisp mixture', tag: '', color: 'orange', image: 'frontend/images/khatta_meetha.svg', visual: { type: 'chip', brand: 'NAMKEEN', title: 'Khatta<br>Meetha' } },
  { id: 'p41', name: 'Roasted Salted Peanuts', category: 'chips', categoryName: 'Chips & Snacks', price: 40, unit: '150 g', desc: 'Crunchy salted roasted peanuts', tag: 'PROTEIN', color: 'brown', image: 'frontend/images/salted_peanuts.svg', visual: { type: 'chip', title: 'ROASTED PEANUTS', sub: 'SALTED 150 G' } },

  // Biscuits & Cookies
  { id: 'p42', name: 'Marie Biscuits', category: 'biscuits', categoryName: 'Biscuits & Cookies', price: 35, unit: '250 g', desc: 'Light & crisp tea biscuits', tag: 'STAPLE', color: 'yellow', image: 'frontend/images/marie_biscuits.svg', visual: { type: 'biscuit', brand: 'BRITANNIA', title: 'Marie Gold', sub: 'TEA BISCUITS' } },
  { id: 'p43', name: 'Chocolate Bourbon Biscuits', category: 'biscuits', categoryName: 'Biscuits & Cookies', price: 40, unit: '150 g', desc: 'Rich chocolate creme sandwich biscuits', tag: 'POPULAR', color: 'brown', image: 'frontend/images/bourbon_biscuits.svg', visual: { type: 'biscuit', brand: 'BOURBON', title: 'Chocolate', sub: 'CREME BISCUITS' } },

  // Instant Food & Pasta
  { id: 'p44', name: 'Instant Masala Noodles', category: 'instant', categoryName: 'Noodles & Pasta', price: 55, unit: '4 Pack · 280 g', desc: 'Maggi 2-Minute masala noodles', tag: 'BESTSELLER', color: 'yellow', image: 'frontend/images/masala_noodles.svg', visual: { type: 'biscuit', brand: 'MAGGI', title: 'Masala', sub: '2-MIN NOODLES' } },
  { id: 'p45', name: 'Atta Noodles', category: 'instant', categoryName: 'Noodles & Pasta', price: 68, unit: '4 Pack · 290 g', desc: 'Whole wheat healthy masala noodles', tag: 'HEALTHY', color: 'green', image: 'frontend/images/atta_noodles.svg', visual: { type: 'biscuit', brand: 'MAGGI', title: 'Atta Noodles', sub: 'WHOLE WHEAT' } },
  { id: 'p46', name: 'Macaroni Elbow Pasta', category: 'instant', categoryName: 'Noodles & Pasta', price: 45, unit: '500 g', desc: '100% durum wheat macaroni elbow pasta', tag: '', color: 'yellow', image: 'frontend/images/macaroni_pasta.svg', visual: { type: 'biscuit', title: 'MACARONI', sub: 'ELBOW PASTA' } },
  { id: 'p47', name: 'Tomato Ketchup', category: 'instant', categoryName: 'Noodles & Pasta', price: 110, unit: '950 g', desc: 'Kissan fresh tomato ketchup squeezy', tag: 'STAPLE', color: 'red', image: 'frontend/images/tomato_ketchup.svg', visual: { type: 'drink', title: 'TOMATO KETCHUP', sub: '950 G BOTTLE' } },
  { id: 'p48', name: 'Schezwan Chutney Paste', category: 'instant', categoryName: 'Noodles & Pasta', price: 85, unit: '250 g', desc: "Ching's spicy schezwan chutney dip", tag: 'SPICY', color: 'red', image: 'frontend/images/schezwan_chutney.svg', visual: { type: 'drink', title: 'SCHEZWAN', sub: 'CHUTNEY PASTE' } },
  { id: 'p49', name: 'Mixed Fruit Jam', category: 'instant', categoryName: 'Noodles & Pasta', price: 80, unit: '500 g', desc: 'Kissan real mixed fruit jam jar', tag: 'SWEET', color: 'red', image: 'frontend/images/mixed_fruit_jam.svg', visual: { type: 'drink', title: 'FRUIT JAM', sub: 'MIXED FRUIT 500 G' } },

  // Breakfast & Oats
  { id: 'p50', name: 'Classic Corn Flakes', category: 'breakfast', categoryName: 'Breakfast & Oats', price: 175, unit: '475 g', desc: "Kellogg's crispy golden corn flakes", tag: 'HEALTHY', color: 'yellow', image: 'frontend/images/corn_flakes.svg', visual: { type: 'biscuit', brand: 'KELLOGG', title: 'Corn Flakes', sub: 'CLASSIC BREAKFAST' } },
  { id: 'p51', name: 'Instant Masala Oats', category: 'breakfast', categoryName: 'Breakfast & Oats', price: 165, unit: '500 g', desc: 'Saffola veggie masala instant oats', tag: 'FITNESS', color: 'green', image: 'frontend/images/masala_oats.svg', visual: { type: 'biscuit', brand: 'SAFFOLA', title: 'Masala Oats', sub: 'INSTANT 500 G' } },
  { id: 'p52', name: 'Creamy Peanut Butter', category: 'breakfast', categoryName: 'Breakfast & Oats', price: 185, unit: '350 g', desc: 'High protein creamy roasted peanut butter', tag: 'HIGH PROTEIN', color: 'brown', image: 'frontend/images/peanut_butter.svg', visual: { type: 'biscuit', title: 'PEANUT BUTTER', sub: 'CREAMY 350 G' } },

  // Beverages & Drinks
  { id: 'p53', name: 'CTC Black Leaf Tea', category: 'drinks', categoryName: 'Beverages & Soda', price: 140, unit: '500 g', desc: 'Strong & aromatic CTC black tea leaves', tag: 'STAPLE', color: 'red', image: 'frontend/images/black_tea.svg', visual: { type: 'drink', brand: 'RED LABEL', title: 'Black Tea', sub: '500 G CTC' } },
  { id: 'p54', name: 'Pure Instant Coffee Powder', category: 'drinks', categoryName: 'Beverages & Soda', price: 195, unit: '100 g', desc: 'Nescafé pure instant coffee jar', tag: 'BESTSELLER', color: 'brown', image: 'frontend/images/instant_coffee.svg', visual: { type: 'drink', brand: 'NESCAFE', title: 'Instant Coffee', sub: '100 G GLASS JAR' } },
  { id: 'p55', name: 'Green Tea Bags', category: 'drinks', categoryName: 'Beverages & Soda', price: 160, unit: '25 Tea Bags', desc: 'Lipton pure green tea bags box', tag: 'HEALTHY', color: 'green', image: 'frontend/images/green_tea.svg', visual: { type: 'drink', brand: 'LIPTON', title: 'Green Tea', sub: '25 TEA BAGS' } },
  { id: 'p56', name: 'Packaged Mango Fruit Drink', category: 'drinks', categoryName: 'Beverages & Soda', price: 75, unit: '1.2 L', desc: 'Frooti juicy mango fruit drink bottle', tag: 'POPULAR', color: 'yellow', image: 'frontend/images/mango_drink.svg', visual: { type: 'drink', brand: 'FROOTI', title: 'Mango Drink', sub: '1.2 L BOTTLE' } },

  // Atta & Flours
  { id: 'p57', name: 'Whole Wheat Chakki Atta', category: 'atta', categoryName: 'Atta & Flours', price: 240, unit: '5 kg', desc: 'Aashirvaad 100% pure whole wheat chakki atta', tag: 'STAPLE', color: 'yellow', image: 'frontend/images/chakki_atta.svg', visual: { type: 'biscuit', title: 'CHAKKI ATTA', sub: '5 KG WHOLE WHEAT' } },
  { id: 'p58', name: 'Fine Maida (All-Purpose Flour)', category: 'atta', categoryName: 'Atta & Flours', price: 45, unit: '1 kg', desc: 'Refined fine white maida flour', tag: '', color: 'blue', image: 'frontend/images/fine_maida.svg', visual: { type: 'biscuit', title: 'FINE MAIDA', sub: '1 KG PACK' } },
  { id: 'p59', name: 'Chana Besan (Gram Flour)', category: 'atta', categoryName: 'Atta & Flours', price: 75, unit: '500 g', desc: 'Pure chana dal besan gram flour', tag: 'STAPLE', color: 'yellow', image: 'frontend/images/chana_besan.svg', visual: { type: 'biscuit', title: 'CHANA BESAN', sub: '500 G GRAM FLOUR' } },
  { id: 'p60', name: 'Roasted Sooji (Semolina)', category: 'atta', categoryName: 'Atta & Flours', price: 40, unit: '500 g', desc: 'Clean roasted rava sooji for halwa/upma', tag: '', color: 'yellow', image: 'frontend/images/roasted_sooji.svg', visual: { type: 'biscuit', title: 'ROASTED SOOJI', sub: '500 G RAVA' } },
  { id: 'p61', name: 'Rice Flour', category: 'atta', categoryName: 'Atta & Flours', price: 42, unit: '500 g', desc: 'Fine white rice flour for dosa & snacks', tag: '', color: 'blue', image: 'frontend/images/rice_flour.svg', visual: { type: 'biscuit', title: 'RICE FLOUR', sub: '500 G PACK' } },

  // Rice & Grains
  { id: 'p62', name: 'Long Grain Basmati Rice', category: 'rice', categoryName: 'Rice & Grains', price: 145, unit: '1 kg', desc: 'Daawat Rozana aromatic long grain basmati', tag: 'PREMIUM', color: 'blue', image: 'frontend/images/basmati_rice.svg', visual: { type: 'biscuit', brand: 'DAAWAT', title: 'Basmati Rice', sub: 'LONG GRAIN 1 KG' } },
  { id: 'p63', name: 'Everyday Rozana Rice', category: 'rice', categoryName: 'Rice & Grains', price: 65, unit: '1 kg', desc: 'Clean everyday rozana rice', tag: 'STAPLE', color: 'yellow', image: 'frontend/images/everyday_rice.svg', visual: { type: 'biscuit', title: 'ROZANA RICE', sub: '1 KG EVERYDAY' } },
  { id: 'p64', name: 'Sona Masoori Rice', category: 'rice', categoryName: 'Rice & Grains', price: 78, unit: '1 kg', desc: 'Lightweight Sona Masoori raw rice', tag: 'STAPLE', color: 'green', image: 'frontend/images/sona_masoori.svg', visual: { type: 'biscuit', title: 'SONA MASOORI', sub: '1 KG RICE' } },
  { id: 'p65', name: 'Thick Poha (Flattened Rice)', category: 'rice', categoryName: 'Rice & Grains', price: 42, unit: '500 g', desc: 'Thick clean poha for breakfast', tag: 'POPULAR', color: 'yellow', image: 'frontend/images/thick_poha.svg', visual: { type: 'biscuit', title: 'THICK POHA', sub: '500 G PACK' } },
  { id: 'p66', name: 'Puffed Rice (Murmura)', category: 'rice', categoryName: 'Rice & Grains', price: 30, unit: '250 g', desc: 'Crispy white puffed rice murmura', tag: 'LIGHT SNACK', color: 'blue', image: 'frontend/images/puffed_rice.svg', visual: { type: 'biscuit', title: 'MURMURA', sub: '250 G PUFFED RICE' } },

  // Dals & Pulses
  { id: 'p67', name: 'Polished Toor Dal (Arhar)', category: 'pulses', categoryName: 'Dals & Pulses', price: 140, unit: '1 kg', desc: 'Yellow split arhar toor dal', tag: 'STAPLE', color: 'yellow', image: 'frontend/images/toor_dal.svg', visual: { type: 'biscuit', title: 'TOOR DAL', sub: '1 KG ARHAR' } },
  { id: 'p68', name: 'Yellow Moong Dal Split', category: 'pulses', categoryName: 'Dals & Pulses', price: 125, unit: '1 kg', desc: 'Split washed yellow moong dal', tag: 'EASY DIGEST', color: 'yellow', image: 'frontend/images/moong_dal.svg', visual: { type: 'biscuit', title: 'MOONG DAL', sub: '1 KG SPLIT' } },
  { id: 'p69', name: 'Chana Dal', category: 'pulses', categoryName: 'Dals & Pulses', price: 85, unit: '1 kg', desc: 'Split Bengal gram chana dal', tag: 'HIGH PROTEIN', color: 'yellow', image: 'frontend/images/chana_dal.svg', visual: { type: 'biscuit', title: 'CHANA DAL', sub: '1 KG PACK' } },
  { id: 'p70', name: 'Whole Urad Dal Black', category: 'pulses', categoryName: 'Dals & Pulses', price: 135, unit: '1 kg', desc: 'Whole black urad dal for dal makhani', tag: '', color: 'brown', image: 'frontend/images/urad_dal.svg', visual: { type: 'biscuit', title: 'URAD DAL', sub: '1 KG BLACK WHOLE' } },
  { id: 'p71', name: 'Red Masoor Dal Split', category: 'pulses', categoryName: 'Dals & Pulses', price: 95, unit: '1 kg', desc: 'Split red masoor lentil dal', tag: '', color: 'red', image: 'frontend/images/masoor_dal.svg', visual: { type: 'biscuit', title: 'MASOOR DAL', sub: '1 KG RED SPLIT' } },
  { id: 'p72', name: 'White Kabuli Chana (Chickpeas)', category: 'pulses', categoryName: 'Dals & Pulses', price: 130, unit: '1 kg', desc: 'Large white chickpeas for chole', tag: 'POPULAR', color: 'yellow', image: 'frontend/images/kabuli_chana.svg', visual: { type: 'biscuit', title: 'KABULI CHANA', sub: '1 KG CHICKPEAS' } },
  { id: 'p73', name: 'Brown Kala Chana', category: 'pulses', categoryName: 'Dals & Pulses', price: 80, unit: '1 kg', desc: 'Small nutrient-rich brown kala chana', tag: 'HEALTHY', color: 'brown', image: 'frontend/images/kala_chana.svg', visual: { type: 'biscuit', title: 'KALA CHANA', sub: '1 KG BROWN' } },
  { id: 'p74', name: 'Kashmiri Rajma Beans', category: 'pulses', categoryName: 'Dals & Pulses', price: 150, unit: '1 kg', desc: 'Dark red Kashmiri rajma kidney beans', tag: 'BESTSELLER', color: 'red', image: 'frontend/images/kashmiri_rajma.svg', visual: { type: 'biscuit', title: 'KASHMIRI RAJMA', sub: '1 KG RED BEANS' } },
  { id: 'p75', name: 'Soya Bean Chunks', category: 'pulses', categoryName: 'Dals & Pulses', price: 45, unit: '200 g', desc: 'Nutrela 50% protein soya chunks', tag: '50% PROTEIN', color: 'brown', image: 'frontend/images/soya_chunks.svg', visual: { type: 'biscuit', brand: 'NUTRELA', title: 'Soya Chunks', sub: '200 G HIGH PROTEIN' } },

  // Oils & Ghee
  { id: 'p76', name: 'Refined Sunflower Oil', category: 'oils', categoryName: 'Oils & Ghee', price: 135, unit: '1 L', desc: 'Fortune Sunlite refined sunflower oil pouch', tag: 'STAPLE', color: 'yellow', image: 'frontend/images/sunflower_oil.svg', visual: { type: 'drink', brand: 'FORTUNE', title: 'Sunflower Oil', sub: '1 LITER POUCH' } },
  { id: 'p77', name: 'Pure Mustard Oil (Kachi Ghani)', category: 'oils', categoryName: 'Oils & Ghee', price: 155, unit: '1 L', desc: 'Fortune Kachi Ghani cold pressed mustard oil', tag: 'PURE', color: 'orange', image: 'frontend/images/mustard_oil.svg', visual: { type: 'drink', brand: 'FORTUNE', title: 'Mustard Oil', sub: '1 LITER BOTTLE' } },
  { id: 'p78', name: 'Cow Desi Ghee', category: 'oils', categoryName: 'Oils & Ghee', price: 340, unit: '500 ml', desc: 'Amul 100% pure cow desi ghee jar', tag: 'PURE GHEE', color: 'yellow', image: 'frontend/images/cow_ghee.svg', visual: { type: 'drink', brand: 'AMUL', title: 'Cow Ghee', sub: '500 ML JAR' } },

  // Spices & Salt
  { id: 'p79', name: 'Refined Iodized Table Salt', category: 'staples', categoryName: 'Spices & Salt', price: 28, unit: '1 kg', desc: 'Tata Salt vacuum evaporated iodized salt', tag: 'STAPLE', color: 'blue', image: 'frontend/images/iodized_salt.svg', visual: { type: 'biscuit', brand: 'TATA SALT', title: 'Table Salt', sub: '1 KG IODIZED' } },
  { id: 'p80', name: 'White Crystal Sugar', category: 'staples', categoryName: 'Spices & Salt', price: 48, unit: '1 kg', desc: 'Clean white crystal sugar', tag: 'STAPLE', color: 'blue', image: 'frontend/images/white_sugar.svg', visual: { type: 'biscuit', title: 'CRYSTAL SUGAR', sub: '1 KG PACK' } },
  { id: 'p81', name: 'Whole Turmeric Powder (Haldi)', category: 'staples', categoryName: 'Spices & Salt', price: 55, unit: '200 g', desc: 'Everest pure haldi turmeric powder', tag: 'PURE SPICE', color: 'orange', image: 'frontend/images/turmeric_powder.svg', visual: { type: 'biscuit', brand: 'EVEREST', title: 'Haldi Powder', sub: '200 G TURMERIC' } }
];

// Categories Master List
const categories = [
  { id: 'all', name: 'All Products', icon: '🛒', key: '' },
  { id: 'dairy', name: 'Dairy & Cheese', icon: '🥛', key: 'dairy' },
  { id: 'bakery', name: 'Bakery & Bread', icon: '🍞', key: 'bakery' },
  { id: 'produce', name: 'Fruits & Veggies', icon: '🥦', key: 'produce' },
  { id: 'chips', name: 'Chips & Snacks', icon: '🍿', key: 'chips' },
  { id: 'biscuits', name: 'Biscuits & Cookies', icon: '🍪', key: 'biscuits' },
  { id: 'instant', name: 'Noodles & Pasta', icon: '🍝', key: 'instant' },
  { id: 'breakfast', name: 'Breakfast & Oats', icon: '🥣', key: 'breakfast' },
  { id: 'drinks', name: 'Beverages & Soda', icon: '🥤', key: 'drinks' },
  { id: 'chocolates', name: 'Chocolates & Sweets', icon: '🍫', key: 'chocolates' },
  { id: 'atta', name: 'Atta & Flours', icon: '🌾', key: 'atta' },
  { id: 'rice', name: 'Rice & Grains', icon: '🍚', key: 'rice' },
  { id: 'pulses', name: 'Dals & Pulses', icon: '🫘', key: 'pulses' },
  { id: 'oils', name: 'Oils & Ghee', icon: '🛢️', key: 'oils' },
  { id: 'staples', name: 'Spices & Salt', icon: '🧂', key: 'staples' }
];

// Active Special Combo Deals Database
const deals = [
  {
    id: 'deal_1',
    title: 'Mega Party Feast Combo',
    badge: 'SAVE ₹76 (24% OFF)',
    originalPrice: 315,
    comboPrice: 239,
    savings: 76,
    itemsText: '2x Parle-G + 1x Coca-Cola (750ml) + 4x Cadbury 5 Star + 2x Kurkure Masala',
    items: [
      { id: 'p1', quantity: 2 },
      { id: 'p6', quantity: 1 },
      { id: 'p4', quantity: 4 },
      { id: 'p7', quantity: 2 }
    ],
    image: 'frontend/images/kurkure.png',
    color: 'red'
  },
  {
    id: 'deal_2',
    title: 'Ultimate Evening Snack Combo',
    badge: 'SAVE ₹76 (23% OFF)',
    originalPrice: 325,
    comboPrice: 249,
    savings: 76,
    itemsText: "2x Good Day + 1x Sprite + 4x KitKat 4-Finger + 2x Lay's Salted",
    items: [
      { id: 'p5', quantity: 2 },
      { id: 'p10', quantity: 1 },
      { id: 'p12', quantity: 4 },
      { id: 'p2', quantity: 2 }
    ],
    image: 'frontend/images/goodday.png',
    color: 'yellow'
  },
  {
    id: 'deal_3',
    title: 'Weekend Binge Monster Combo',
    badge: 'SAVE ₹136 (24% OFF)',
    originalPrice: 565,
    comboPrice: 429,
    savings: 136,
    itemsText: '2x Oreo + 1x Fanta Orange + 4x Dairy Milk + 2x Bingo Mad Angles',
    items: [
      { id: 'p9', quantity: 2 },
      { id: 'p3', quantity: 1 },
      { id: 'p8', quantity: 4 },
      { id: 'p11', quantity: 2 }
    ],
    image: 'frontend/images/dairymilk.png',
    color: 'brown'
  },
  {
    id: 'deal_4',
    title: 'Family Celebration Mega Pack',
    badge: 'SAVE ₹101 (25% OFF)',
    originalPrice: 400,
    comboPrice: 299,
    savings: 101,
    itemsText: '3x Good Day + 2x Coca-Cola + 4x Cadbury 5 Star + 3x Kurkure Masala',
    items: [
      { id: 'p5', quantity: 3 },
      { id: 'p6', quantity: 2 },
      { id: 'p4', quantity: 4 },
      { id: 'p7', quantity: 3 }
    ],
    image: 'frontend/images/coke.png',
    color: 'green'
  },
  {
    id: 'deal_5',
    title: 'Midnight Craving Special',
    badge: 'SAVE ₹80 (24% OFF)',
    originalPrice: 335,
    comboPrice: 255,
    savings: 80,
    itemsText: '2x Oreo + 1x Coca-Cola + 4x KitKat 4-Finger + 2x Kurkure Masala',
    items: [
      { id: 'p9', quantity: 2 },
      { id: 'p6', quantity: 1 },
      { id: 'p12', quantity: 4 },
      { id: 'p7', quantity: 2 }
    ],
    image: 'frontend/images/kitkat.png',
    color: 'red'
  },
  {
    id: 'deal_6',
    title: 'Chilled Soda & Crunchy Munch',
    badge: 'SAVE ₹81 (23% OFF)',
    originalPrice: 350,
    comboPrice: 269,
    savings: 81,
    itemsText: '2x Parle-G + 2x Fanta Orange + 4x 5 Star + 2x Bingo Mad Angles',
    items: [
      { id: 'p1', quantity: 2 },
      { id: 'p3', quantity: 2 },
      { id: 'p4', quantity: 4 },
      { id: 'p11', quantity: 2 }
    ],
    image: 'frontend/images/fanta.png',
    color: 'orange'
  },
  {
    id: 'deal_7',
    title: 'Supreme Chocolate & Snack Delight',
    badge: 'SAVE ₹140 (25% OFF)',
    originalPrice: 565,
    comboPrice: 425,
    savings: 140,
    itemsText: "2x Good Day + 1x Sprite + 4x Dairy Milk + 2x Lay's Salted",
    items: [
      { id: 'p5', quantity: 2 },
      { id: 'p10', quantity: 1 },
      { id: 'p8', quantity: 4 },
      { id: 'p2', quantity: 2 }
    ],
    image: 'frontend/images/sprite.png',
    color: 'green'
  },
  {
    id: 'deal_8',
    title: "Gamer's Energy Reload Combo",
    badge: 'SAVE ₹101 (24% OFF)',
    originalPrice: 420,
    comboPrice: 319,
    savings: 101,
    itemsText: '2x Parle-G + 2x Coca-Cola + 4x KitKat + 2x Kurkure Masala',
    items: [
      { id: 'p1', quantity: 2 },
      { id: 'p6', quantity: 2 },
      { id: 'p12', quantity: 4 },
      { id: 'p7', quantity: 2 }
    ],
    image: 'frontend/images/lays.png',
    color: 'red'
  },
  {
    id: 'deal_9',
    title: 'Movie Marathon Mega Pack',
    badge: 'SAVE ₹91 (25% OFF)',
    originalPrice: 370,
    comboPrice: 279,
    savings: 91,
    itemsText: '3x Oreo + 2x Sprite + 4x Cadbury 5 Star + 3x Bingo Mad Angles',
    items: [
      { id: 'p9', quantity: 3 },
      { id: 'p10', quantity: 2 },
      { id: 'p4', quantity: 4 },
      { id: 'p11', quantity: 3 }
    ],
    image: 'frontend/images/oreo.png',
    color: 'blue'
  },
  {
    id: 'deal_10',
    title: 'Sweet & Salty Super Saver',
    badge: 'SAVE ₹70 (25% OFF)',
    originalPrice: 285,
    comboPrice: 215,
    savings: 70,
    itemsText: '2x Good Day + 1x Fanta + 4x Cadbury 5 Star + 2x Kurkure Masala',
    items: [
      { id: 'p5', quantity: 2 },
      { id: 'p3', quantity: 1 },
      { id: 'p4', quantity: 4 },
      { id: 'p7', quantity: 2 }
    ],
    image: 'frontend/images/5star.png',
    color: 'yellow'
  }
];

// Active Orders database
const orders = [];

// Default User Profile
let userProfile = {
  id: 'u101',
  name: 'Guest User',
  email: 'Sign in to create your profile',
  phone: '-',
  joinedDate: 'September 2026',
  memberTier: 'GUEST',
  cashbackBalance: 0,
  addresses: []
};

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// High-Performance In-Memory Cache
// -------------------------------------------------------------
let catalogCache = {
  data: null,
  lastFetched: 0,
  ttl: 60000 // 60s cache TTL
};

async function getCachedProducts() {
  const now = Date.now();
  if (catalogCache.data && (now - catalogCache.lastFetched < catalogCache.ttl)) {
    return catalogCache.data;
  }

  try {
    const supabasePromise = supabase.from('products').select('*');
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Supabase fetch timeout')), 800)
    );

    const { data, error } = await Promise.race([supabasePromise, timeoutPromise]);

    if (!error && data && data.length > 0) {
      let mapped = data.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        categoryName: p.category_name || p.category,
        price: Number(p.price),
        unit: p.unit,
        desc: p.description,
        tag: p.tag || '',
        color: p.color || 'blue',
        image: p.image,
        visual: { title: p.name, sub: p.unit }
      }));
      catalogCache.data = mapped;
      catalogCache.lastFetched = now;
      return mapped;
    }
  } catch (err) {
    console.warn('Fast fallback to local memory catalog:', err.message);
  }

  if (!catalogCache.data) {
    catalogCache.data = [...products];
  }
  return catalogCache.data;
}

function invalidateCatalogCache() {
  catalogCache.data = null;
  catalogCache.lastFetched = 0;
}

// -------------------------------------------------------------
// REST API ENDPOINTS (High Speed)
// -------------------------------------------------------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    app: 'The Daily Mart Express Backend API',
    version: '1.0.0',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// GET /api/products - High-performance cached product search & filter
app.get('/api/products', async (req, res) => {
  const { category, q, sortBy } = req.query;
  res.setHeader('Cache-Control', 'public, max-age=10');

  const allProducts = await getCachedProducts();
  let filtered = [...allProducts];

  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
  }

  if (q) {
    const queryStr = q.toLowerCase();
    filtered = filtered.filter(p =>
      (p.name && p.name.toLowerCase().includes(queryStr)) ||
      (p.desc && p.desc.toLowerCase().includes(queryStr)) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(queryStr))
    );
  }

  if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
  else if (sortBy === 'name-az') filtered.sort((a, b) => a.name.localeCompare(b.name));

  res.json({
    success: true,
    total: filtered.length,
    products: filtered
  });
});

// GET /api/products/:id - Single product lookup
app.get('/api/products/:id', async (req, res) => {
  const allProducts = await getCachedProducts();
  const prod = allProducts.find(p => p.id === req.params.id);
  if (!prod) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product: prod });
});

// POST /api/products - Create a new product (Non-blocking response)
app.post('/api/products', (req, res) => {
  const { name, category, categoryName, price, unit, desc, tag, color, image } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({ success: false, message: 'Product name, category, and price are required.' });
  }

  const newProd = {
    id: 'p_' + Date.now(),
    name,
    category: category.toLowerCase(),
    categoryName: categoryName || category,
    price: Number(price),
    unit: unit || '1 pc',
    desc: desc || '',
    tag: tag || '',
    color: color || 'blue',
    image: image || 'frontend/images/parle_g.png',
    visual: { title: name, sub: unit || '1 pc' }
  };

  products.push(newProd);
  if (catalogCache.data) {
    catalogCache.data.unshift(newProd);
  }

  // Non-blocking background Supabase sync
  supabase.from('products').insert([{
    id: newProd.id,
    name: newProd.name,
    category: newProd.category,
    category_name: newProd.categoryName,
    price: newProd.price,
    unit: newProd.unit,
    description: newProd.desc,
    tag: newProd.tag,
    color: newProd.color,
    image: newProd.image
  }]).then(() => {
    console.log(`[Background Sync] Added product ${newProd.id} to Supabase.`);
  }).catch(err => {
    console.warn(`[Background Sync] Supabase insert warning:`, err.message);
  });

  const db = getDB();
  if (!db.products) db.products = [];
  db.products.push(newProd);
  saveDB(db);

  res.status(201).json({
    success: true,
    message: 'Product added successfully!',
    product: newProd
  });
});

// PUT /api/products/:id - Update product (Non-blocking response)
app.put('/api/products/:id', (req, res) => {
  const prodIndex = products.findIndex(p => p.id === req.params.id);
  if (prodIndex === -1) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  const existing = products[prodIndex];
  const updated = {
    ...existing,
    ...req.body,
    price: req.body.price ? Number(req.body.price) : existing.price
  };

  products[prodIndex] = updated;
  if (catalogCache.data) {
    const cacheIdx = catalogCache.data.findIndex(p => p.id === req.params.id);
    if (cacheIdx !== -1) catalogCache.data[cacheIdx] = updated;
  }

  // Non-blocking background Supabase sync
  supabase.from('products').upsert({
    id: updated.id,
    name: updated.name,
    category: updated.category,
    category_name: updated.categoryName,
    price: updated.price,
    unit: updated.unit,
    description: updated.desc,
    tag: updated.tag,
    color: updated.color,
    image: updated.image
  }).catch(e => console.warn('[Background Sync] Supabase update warning:', e.message));

  const db = getDB();
  if (db.products) {
    const idx = db.products.findIndex(p => p.id === req.params.id);
    if (idx !== -1) db.products[idx] = updated;
  }
  saveDB(db);

  res.json({
    success: true,
    message: 'Product updated successfully!',
    product: updated
  });
});

// DELETE /api/products/:id - Delete product (Non-blocking response)
app.delete('/api/products/:id', (req, res) => {
  const prodIndex = products.findIndex(p => p.id === req.params.id);
  if (prodIndex === -1) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  const deleted = products.splice(prodIndex, 1)[0];
  if (catalogCache.data) {
    catalogCache.data = catalogCache.data.filter(p => p.id !== req.params.id);
  }

  // Non-blocking background Supabase sync
  supabase.from('products').delete().eq('id', req.params.id)
    .catch(e => console.warn('[Background Sync] Supabase delete warning:', e.message));

  const db = getDB();
  if (db.products) {
    db.products = db.products.filter(p => p.id !== req.params.id);
  }
  saveDB(db);

  res.json({
    success: true,
    message: `Product ${deleted.name} deleted successfully!`,
    product: deleted
  });
});

// GET /api/categories - Ultra fast categories lookup with item count
app.get('/api/categories', async (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=30');
  const allProds = await getCachedProducts();

  const categoriesWithCounts = categories.map(cat => {
    let count = allProds.length;
    if (cat.id !== 'all') {
      count = allProds.filter(p => p.category === cat.id).length;
    }
    return { ...cat, count };
  });

  res.json({
    success: true,
    categories: categoriesWithCounts
  });
});

// POST /api/categories - Create a new category
app.post('/api/categories', (req, res) => {
  const { id, name, icon } = req.body;
  if (!id || !name) {
    return res.status(400).json({ success: false, message: 'Category ID and Name are required.' });
  }

  const newCat = {
    id: id.toLowerCase(),
    name,
    icon: icon || '🛒',
    key: id.toLowerCase()
  };

  categories.push(newCat);

  res.status(201).json({
    success: true,
    message: 'Category created successfully!',
    category: newCat
  });
});

// GET /api/deals - List current active deals
app.get('/api/deals', (req, res) => {
  res.json({
    success: true,
    total: deals.length,
    deals
  });
});

// GET /api/deals/:id - Fetch single deal
app.get('/api/deals/:id', (req, res) => {
  const deal = deals.find(d => d.id === req.params.id);
  if (!deal) {
    return res.status(404).json({ success: false, message: 'Deal combo not found.' });
  }
  res.json({ success: true, deal });
});

// POST /api/orders - Place a new order
app.post('/api/orders', async (req, res) => {
  const { customer, items, paymentMethod } = req.body;

  if (!customer || !customer.name || !customer.phone || !customer.address) {
    return res.status(400).json({
      success: false,
      message: 'Please provide full customer details (name, phone, address).'
    });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Basket is empty. Please add items to your basket.'
    });
  }

  let subtotal = 0;
  const processedItems = items.map(item => {
    const prod = products.find(p => p.id === item.id);
    const price = prod ? prod.price : (item.price || item.unitPrice || 0);
    const itemTotal = price * item.quantity;
    subtotal += itemTotal;
    return {
      id: item.id,
      name: prod ? prod.name : item.name,
      unitPrice: price,
      quantity: item.quantity,
      totalPrice: itemTotal
    };
  });

  const deliveryFee = subtotal >= 499 ? 0 : 40;

  // Calculate discount if applicable (e.g. 3 or more items get 10% discount)
  const totalItemsCount = processedItems.reduce((acc, i) => acc + i.quantity, 0);
  let discount = 0;
  if (totalItemsCount >= 3) {
    discount = Math.round(subtotal * 0.10);
  }

  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const orderId = 'DM-' + Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    orderId,
    date: new Date().toISOString(),
    customer,
    items: processedItems,
    subtotal,
    discount,
    deliveryFee,
    grandTotal,
    paymentMethod: paymentMethod || 'Cash on Delivery',
    status: 'Confirmed',
    estimatedDelivery: '25-35 mins'
  };

  orders.unshift(newOrder);

  // Sync to Supabase Database
  try {
    await supabase.from('orders').insert([{
      id: newOrder.orderId,
      order_id: newOrder.orderId,
      customer: newOrder.customer,
      items: newOrder.items,
      subtotal: newOrder.subtotal,
      discount: newOrder.discount,
      delivery_fee: newOrder.deliveryFee,
      grand_total: newOrder.grandTotal,
      payment_method: newOrder.paymentMethod,
      status: newOrder.status,
      estimated_delivery: newOrder.estimatedDelivery
    }]);
  } catch (supabaseErr) {
    console.warn('Supabase order insert warning:', supabaseErr.message);
  }

  const db = getDB();
  if (!db.orders) db.orders = [];
  db.orders.unshift(newOrder);
  saveDB(db);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully!',
    order: newOrder
  });
});

// GET /api/orders - List all orders
app.get('/api/orders', async (req, res) => {
  try {
    const { data: dbOrders, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error && dbOrders && dbOrders.length > 0) {
      const mapped = dbOrders.map(o => ({
        orderId: o.order_id,
        date: o.created_at,
        customer: o.customer,
        items: o.items,
        subtotal: Number(o.subtotal),
        discount: Number(o.discount),
        deliveryFee: Number(o.delivery_fee),
        grandTotal: Number(o.grand_total),
        paymentMethod: o.payment_method,
        status: o.status,
        estimatedDelivery: o.estimated_delivery
      }));
      return res.json({ success: true, source: 'supabase_database', total: mapped.length, orders: mapped });
    }
  } catch (e) {
    console.warn('Supabase orders fetch error:', e.message);
  }

  const db = getDB();
  const allOrders = [...orders, ...(db.orders || [])];
  const uniqueOrders = Array.from(new Map(allOrders.map(o => [o.orderId, o])).values());
  res.json({ success: true, total: uniqueOrders.length, orders: uniqueOrders });
});

// GET /api/orders/:id - Fetch order details by ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { data: dbOrder, error } = await supabase.from('orders').select('*').eq('order_id', req.params.id).single();
    if (!error && dbOrder) {
      return res.json({
        success: true,
        source: 'supabase_database',
        order: {
          orderId: dbOrder.order_id,
          date: dbOrder.created_at,
          customer: dbOrder.customer,
          items: dbOrder.items,
          subtotal: Number(dbOrder.subtotal),
          discount: Number(dbOrder.discount),
          deliveryFee: Number(dbOrder.delivery_fee),
          grandTotal: Number(dbOrder.grand_total),
          paymentMethod: dbOrder.payment_method,
          status: dbOrder.status,
          estimatedDelivery: dbOrder.estimated_delivery
        }
      });
    }
  } catch (e) {}

  const db = getDB();
  const allOrders = [...orders, ...(db.orders || [])];
  const order = allOrders.find(o => o.orderId === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, order });
});

// PATCH /api/orders/:id/status - Update status of an order
app.patch('/api/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, message: 'Status string is required.' });
  }

  const db = getDB();
  const allOrders = [...orders, ...(db.orders || [])];
  const order = allOrders.find(o => o.orderId === req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  order.status = status;
  saveDB(db);

  // Sync update to Supabase
  try {
    await supabase.from('orders').update({ status }).eq('order_id', req.params.id);
  } catch (e) {
    console.warn('Supabase order status update error:', e.message);
  }

  res.json({
    success: true,
    message: `Order #${order.orderId} status updated to ${status}!`,
    order
  });
});

// DELETE /api/orders/:id - Cancel/Delete order
app.delete('/api/orders/:id', async (req, res) => {
  const db = getDB();
  const idxInMemory = orders.findIndex(o => o.orderId === req.params.id);
  if (idxInMemory !== -1) orders.splice(idxInMemory, 1);

  if (db.orders) {
    db.orders = db.orders.filter(o => o.orderId !== req.params.id);
    saveDB(db);
  }

  // Delete from Supabase
  try {
    await supabase.from('orders').delete().eq('order_id', req.params.id);
  } catch (e) {
    console.warn('Supabase order delete error:', e.message);
  }

  res.json({
    success: true,
    message: `Order #${req.params.id} cancelled successfully!`
  });
});

// GET /api/user/profile - Fetch user profile details and past orders
app.get('/api/user/profile', async (req, res) => {
  let profile = userProfile;
  let fetchedOrders = [];

  try {
    const { data: profData } = await supabase.from('user_profile').select('*').eq('id', 'default_user').single();
    const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });

    if (profData) {
      profile = {
        id: profData.id,
        name: profData.name,
        email: profData.email,
        phone: profData.phone,
        joinedDate: profData.joined_date || 'January 2025',
        memberTier: profData.member_tier || 'DM Gold Member',
        cashbackBalance: Number(profData.cashback_balance || 250),
        addresses: profData.address ? [{ id: 'a1', label: 'Home', address: profData.address, isDefault: true }] : []
      };
    }
    if (ordersData) {
      fetchedOrders = ordersData.map(o => ({
        orderId: o.order_id,
        date: o.created_at,
        customer: o.customer,
        items: o.items,
        subtotal: Number(o.subtotal),
        discount: Number(o.discount),
        deliveryFee: Number(o.delivery_fee),
        grandTotal: Number(o.grand_total),
        paymentMethod: o.payment_method,
        status: o.status,
        estimatedDelivery: o.estimated_delivery
      }));
    }
  } catch (e) {
    console.warn('Supabase profile fetch error:', e.message);
  }

  const db = getDB();
  const dbOrders = db.orders || [];
  const allOrders = [...fetchedOrders, ...orders, ...dbOrders];
  const uniqueOrders = Array.from(new Map(allOrders.map(o => [o.orderId, o])).values());

  res.json({
    success: true,
    source: 'supabase_database',
    profile: db.userProfile || profile,
    orders: uniqueOrders
  });
});

// POST /api/user/login - Login user with name, phone, email, address
app.post('/api/user/login', async (req, res) => {
  const { name, phone, email, address } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({
      success: false,
      message: 'Name, phone number, and email address are required.'
    });
  }

  userProfile.name = name.trim();
  userProfile.phone = phone.trim();
  userProfile.email = email.trim();
  const cleanAddr = address ? address.trim() : '123 Park Street, Sector 4, City';
  userProfile.addresses = [{ id: 'a1', label: 'Home', address: cleanAddr, isDefault: true }];

  try {
    await supabase.from('user_profile').upsert({
      id: 'default_user',
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      address: cleanAddr,
      joined_date: 'January 2025',
      member_tier: 'DM Gold Member',
      cashback_balance: userProfile.cashbackBalance || 250
    });
  } catch (e) {
    console.warn('Supabase user login upsert warning:', e.message);
  }

  const db = getDB();
  db.userProfile = userProfile;
  saveDB(db);

  res.json({
    success: true,
    message: 'Welcome back, ' + userProfile.name + '!',
    profile: userProfile
  });
});

// PUT /api/user/profile - Update user profile details
app.put('/api/user/profile', async (req, res) => {
  const { name, email, phone, address } = req.body;
  if (name) userProfile.name = name;
  if (email) userProfile.email = email;
  if (phone) userProfile.phone = phone;
  if (address && userProfile.addresses && userProfile.addresses.length > 0) {
    userProfile.addresses[0].address = address;
  }

  try {
    await supabase.from('user_profile').upsert({
      id: 'default_user',
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      address: address || (userProfile.addresses && userProfile.addresses[0] ? userProfile.addresses[0].address : '')
    });
  } catch (e) {
    console.warn('Supabase profile update warning:', e.message);
  }

  const db = getDB();
  db.userProfile = userProfile;
  saveDB(db);

  res.json({
    success: true,
    message: 'Profile updated successfully!',
    profile: userProfile
  });
});

// POST /api/user/logout - Sign out user session
app.post('/api/user/logout', (req, res) => {
  userProfile = {
    id: 'u101',
    name: 'Guest User',
    email: 'Sign in to create your profile',
    phone: '-',
    joinedDate: 'Guest Session',
    memberTier: 'GUEST',
    cashbackBalance: 0,
    addresses: []
  };

  const db = getDB();
  db.userProfile = userProfile;
  saveDB(db);

  res.json({
    success: true,
    message: 'Signed out successfully.',
    profile: userProfile
  });
});

// GET /api/promos - List available promo codes
app.get('/api/promos', (req, res) => {
  const db = getDB();
  const promos = db.promos || [
    { code: 'DAILY10', type: 'percentage', value: 10, minSpend: 200, description: '10% Off on orders over ₹200' },
    { code: 'WELCOME50', type: 'flat', value: 50, minSpend: 300, description: 'Flat ₹50 Off on your order' },
    { code: 'FREEDEL', type: 'delivery', value: 40, minSpend: 0, description: 'Free Express Delivery' }
  ];
  res.json({ success: true, promos });
});

// POST /api/promo/validate - Validate promo coupon code
app.post('/api/promo/validate', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Promo code is required.' });
  }

  const db = getDB();
  const promos = db.promos || [
    { code: 'DAILY10', type: 'percentage', value: 10, minSpend: 200 },
    { code: 'WELCOME50', type: 'flat', value: 50, minSpend: 300 },
    { code: 'FREEDEL', type: 'delivery', value: 40, minSpend: 0 }
  ];

  const matched = promos.find(p => p.code.toUpperCase() === code.trim().toUpperCase());
  if (!matched) {
    return res.status(404).json({ success: false, message: 'Invalid promo code.' });
  }

  const currentSubtotal = subtotal || 0;
  if (matched.minSpend && currentSubtotal < matched.minSpend) {
    return res.status(400).json({
      success: false,
      message: `Minimum order amount of ₹${matched.minSpend} required for promo code ${matched.code}.`
    });
  }

  let discount = 0;
  if (matched.type === 'percentage') {
    discount = Math.round((currentSubtotal * matched.value) / 100);
  } else if (matched.type === 'flat') {
    discount = matched.value;
  } else if (matched.type === 'delivery') {
    discount = matched.value;
  }

  res.json({
    success: true,
    message: `Promo code ${matched.code} applied successfully!`,
    promo: matched,
    discount
  });
});

// GET /api/user/wallet - Get wallet balance and transactions
app.get('/api/user/wallet', (req, res) => {
  const db = getDB();
  const wallet = db.wallet || { balance: 250, transactions: [] };
  res.json({ success: true, wallet });
});

// POST /api/user/wallet/topup - Top up wallet or claim daily cashback
app.post('/api/user/wallet/topup', async (req, res) => {
  const { amount, description } = req.body;
  const topupAmount = parseInt(amount, 10);

  if (isNaN(topupAmount) || topupAmount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid topup amount.' });
  }

  const db = getDB();
  if (!db.wallet) db.wallet = { balance: 250, transactions: [] };

  db.wallet.balance += topupAmount;
  const txItem = {
    id: 'w_' + Date.now(),
    type: 'credit',
    amount: topupAmount,
    description: description || 'Wallet Top-Up',
    date: new Date().toISOString()
  };
  db.wallet.transactions.unshift(txItem);

  saveDB(db);

  // Sync to Supabase
  try {
    await supabase.from('wallet_transactions').insert([{
      user_id: 'default_user',
      type: 'credit',
      amount: topupAmount,
      description: description || 'Wallet Top-Up'
    }]);

    await supabase.from('user_profile').update({
      cashback_balance: db.wallet.balance
    }).eq('id', 'default_user');
  } catch (e) {
    console.warn('Supabase wallet transaction sync error:', e.message);
  }

  res.json({
    success: true,
    message: `Successfully added ₹${topupAmount} to DM Wallet!`,
    wallet: db.wallet
  });
});

// -------------------------------------------------------------
// UNMATCHED ROUTE & ERROR HANDLING MIDDLEWARE
// -------------------------------------------------------------

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found on this server.`
  });
});

// Serve index.html for general page routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Global 500 Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 The Daily Mart Backend API listening at http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
