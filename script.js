// The Daily Mart Frontend Application Script

const API_BASE_URL = 'http://localhost:5000/api';

// Initial state
let state = {
  products: [],
  categories: [],
  cart: JSON.parse(localStorage.getItem('dm_cart')) || [],
  currentCategory: 'all',
  searchQuery: '',
  sortBy: 'default',
  dealApplied: false
};

// DOM Elements container (populated dynamically on DOMContentLoaded)
let elements = {};

function initElements() {
  elements = {
    headerCartCount: document.getElementById('header-cart-count'),
    mobileCartCount: document.getElementById('mobile-cart-count'),
    categoriesContainer: document.getElementById('categories-container'),
    productGrid: document.getElementById('product-grid'),
    productSectionTitle: document.getElementById('product-section-title'),
    productSectionTag: document.getElementById('product-section-tag'),
    filterStatus: document.getElementById('filter-status'),
    
    shopPageSearch: document.getElementById('shop-page-search'),
    sortSelect: document.getElementById('sort-select'),

    basketItemCountText: document.getElementById('basket-item-count-text'),
    basketGrandTotal: document.getElementById('basket-grand-total'),
    basketItemsList: document.getElementById('basket-items-list'),
    basketSummaryRows: document.getElementById('basket-summary-rows'),
    basketSubtotal: document.getElementById('basket-subtotal'),
    basketDiscount: document.getElementById('basket-discount'),
    discountRow: document.getElementById('discount-row'),
    basketDeliveryFee: document.getElementById('basket-delivery-fee'),
    deliveryProgressBar: document.getElementById('delivery-progress-bar'),
    deliveryProgressFill: document.getElementById('delivery-progress-fill'),
    deliveryProgressText: document.getElementById('delivery-progress-text'),
    openCheckoutBtn: document.getElementById('open-checkout'),
    applyDealBtn: document.getElementById('apply-deal-btn'),

    openSearchBtn: document.getElementById('open-search'),
    closeSearchBtn: document.getElementById('close-search'),
    searchModal: document.getElementById('search-modal'),
    searchInput: document.getElementById('search-input'),
    searchResults: document.getElementById('search-results'),

    checkoutModal: document.getElementById('checkout-modal'),
    closeCheckoutBtn: document.getElementById('close-checkout'),
    checkoutForm: document.getElementById('checkout-form'),
    modalGrandTotal: document.getElementById('modal-grand-total'),

    receiptModal: document.getElementById('receipt-modal'),
    closeReceiptBtn: document.getElementById('close-receipt'),
    receiptOrderId: document.getElementById('receipt-order-id'),
    receiptDeliveryTime: document.getElementById('receipt-delivery-time'),
    receiptCustomerName: document.getElementById('receipt-customer-name'),
    receiptCustomerPhone: document.getElementById('receipt-customer-phone'),
    receiptCustomerAddress: document.getElementById('receipt-customer-address'),
    receiptItemsList: document.getElementById('receipt-items-list'),
    receiptSubtotal: document.getElementById('receipt-subtotal'),
    receiptDiscount: document.getElementById('receipt-discount'),
    receiptDelivery: document.getElementById('receipt-delivery'),
    receiptGrandTotal: document.getElementById('receipt-grand-total'),

    toastContainer: document.getElementById('toast-container')
  };
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initElements();
  initApp();
  setupEventListeners();
});

// 81 Catalog Products Fallback Dataset
const fallbackProducts = [
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

  // Dairy & Eggs (dairy)
  { id: 'p13', name: 'Toned Milk Pouch', category: 'dairy', categoryName: 'Dairy & Cheese', price: 28, unit: '500 ml', desc: 'Pasteurized fresh toned milk pouch', tag: 'FRESH', color: 'blue', image: 'frontend/images/toned_milk.png', visual: { type: 'drink', title: 'TONED MILK', sub: 'FRESH 500 ML' } },
  { id: 'p14', name: 'Full Cream Milk Pouch', category: 'dairy', categoryName: 'Dairy & Cheese', price: 34, unit: '500 ml', desc: 'Rich & creamy full cream milk', tag: 'BESTSELLER', color: 'orange', image: 'frontend/images/toned_milk.png', visual: { type: 'drink', title: 'FULL CREAM', sub: 'MILK 500 ML' } },
  { id: 'p15', name: 'Plain Dahi (Curd)', category: 'dairy', categoryName: 'Dairy & Cheese', price: 35, unit: '400 g', desc: 'Thick & natural plain dahi curd', tag: 'FRESH', color: 'blue', image: 'frontend/images/plain_dahi.svg', visual: { type: 'biscuit', title: 'PLAIN DAHI', sub: 'CURD 400 G' } },
  { id: 'p16', name: 'Salted Table Butter', category: 'dairy', categoryName: 'Dairy & Cheese', price: 58, unit: '100 g', desc: 'Delicious creamery salted butter', tag: 'POPULAR', color: 'yellow', image: 'frontend/images/salted_butter.svg', visual: { type: 'biscuit', title: 'AMUL BUTTER', sub: 'SALTED 100 G' } },
  { id: 'p17', name: 'Fresh Paneer Block', category: 'dairy', categoryName: 'Dairy & Cheese', price: 95, unit: '200 g', desc: 'Soft & fresh cottage cheese block', tag: 'FRESH', color: 'green', image: 'frontend/images/fresh_paneer.png', visual: { type: 'biscuit', title: 'FRESH PANEER', sub: '200 G BLOCK' } },
  { id: 'p18', name: 'Processed Cheese Slices', category: 'dairy', categoryName: 'Dairy & Cheese', price: 145, unit: '200 g · 10 Slices', desc: 'Creamy cheese slices for sandwiches', tag: '', color: 'yellow', image: 'frontend/images/cheese_slices.svg', visual: { type: 'biscuit', title: 'CHEESE SLICES', sub: '10 SLICES 200 G' } },
  { id: 'p19', name: 'Mozzarella Shredded Cheese', category: 'dairy', categoryName: 'Dairy & Cheese', price: 195, unit: '200 g', desc: 'Shredded mozzarella for pizza', tag: 'NEW', color: 'orange', image: 'frontend/images/mozzarella_cheese.svg', visual: { type: 'biscuit', title: 'MOZZARELLA', sub: 'SHREDDED CHEESE' } },
  { id: 'p20', name: 'Chaas (Buttermilk)', category: 'dairy', categoryName: 'Dairy & Cheese', price: 15, unit: '250 ml', desc: 'Refreshing spiced masala chaas', tag: 'COOL', color: 'green', image: 'frontend/images/chaas.svg', visual: { type: 'drink', title: 'MASALA CHAAS', sub: 'BUTTERMILK' } },
  { id: 'p21', name: 'Sweet Lassi', category: 'dairy', categoryName: 'Dairy & Cheese', price: 25, unit: '200 ml', desc: 'Thick & sweet traditional lassi', tag: 'COOL', color: 'orange', image: 'frontend/images/sweet_lassi.svg', visual: { type: 'drink', title: 'SWEET LASSI', sub: '200 ML POUCH' } },

  // Bakery & Breads (bakery)
  { id: 'p22', name: 'White Sandwich Bread', category: 'bakery', categoryName: 'Bakery & Bread', price: 40, unit: '400 g', desc: 'Soft white sandwich bread loaf', tag: 'DAILY FRESH', color: 'blue', image: 'frontend/images/white_bread.svg', visual: { type: 'biscuit', title: 'WHITE BREAD', sub: '400 G LOAF' } },
  { id: 'p23', name: 'Brown Wheat Bread', category: 'bakery', categoryName: 'Bakery & Bread', price: 45, unit: '400 g', desc: '100% whole wheat brown bread', tag: 'HEALTHY', color: 'brown', image: 'frontend/images/brown_bread.svg', visual: { type: 'biscuit', title: 'BROWN BREAD', sub: 'WHOLE WHEAT' } },
  { id: 'p24', name: 'Pav Buns', category: 'bakery', categoryName: 'Bakery & Bread', price: 25, unit: '6 Pcs · 250 g', desc: 'Soft & fluffy bakery pav buns', tag: 'FRESH', color: 'yellow', image: 'frontend/images/pav_buns.svg', visual: { type: 'biscuit', title: 'PAV BUNS', sub: 'PACK OF 6' } },
  { id: 'p25', name: 'Burger Buns', category: 'bakery', categoryName: 'Bakery & Bread', price: 30, unit: '4 Pcs · 200 g', desc: 'Sesame burger buns pack', tag: '', color: 'orange', image: 'frontend/images/burger_buns.svg', visual: { type: 'biscuit', title: 'BURGER BUNS', sub: 'PACK OF 4' } },
  { id: 'p26', name: 'Pizza Base', category: 'bakery', categoryName: 'Bakery & Bread', price: 35, unit: '2 Pcs · 200 g', desc: 'Ready-to-bake pizza crust bases', tag: '', color: 'yellow', image: 'frontend/images/pizza_base.svg', visual: { type: 'biscuit', title: 'PIZZA BASE', sub: 'PACK OF 2' } },
  { id: 'p27', name: 'Wheat Toast (Rusk)', category: 'bakery', categoryName: 'Bakery & Bread', price: 45, unit: '300 g', desc: 'Crispy teatime wheat rusk toast', tag: 'TEA TIME', color: 'brown', image: 'frontend/images/wheat_rusk.svg', visual: { type: 'biscuit', title: 'WHEAT RUSK', sub: 'CRUNCHY TOAST' } },
  { id: 'p28', name: 'Fruit Tea Cake', category: 'bakery', categoryName: 'Bakery & Bread', price: 55, unit: '150 g', desc: 'Tutti frutti soft slice cake', tag: 'SWEET', color: 'red', image: 'frontend/images/fruit_cake.svg', visual: { type: 'biscuit', title: 'FRUIT CAKE', sub: 'TEA CAKE SLICE' } },

  // Fresh Fruits & Vegetables (produce)
  { id: 'p29', name: 'Red Onions', category: 'produce', categoryName: 'Fruits & Veggies', price: 35, unit: '1 kg', desc: 'Fresh farm-picked red onions', tag: 'STAPLE', color: 'red', image: 'frontend/images/red_onions.svg', visual: { type: 'biscuit', title: 'RED ONIONS', sub: '1 KG FRESH' } },
  { id: 'p30', name: 'Hybrid Tomatoes', category: 'produce', categoryName: 'Fruits & Veggies', price: 28, unit: '1 kg', desc: 'Juicy red hybrid tomatoes', tag: 'FRESH', color: 'red', image: 'frontend/images/hybrid_tomatoes.svg', visual: { type: 'biscuit', title: 'TOMATOES', sub: '1 KG HYBRID' } },
  { id: 'p31', name: 'Jyoti Potatoes', category: 'produce', categoryName: 'Fruits & Veggies', price: 30, unit: '1 kg', desc: 'Premium fresh Jyoti potatoes', tag: 'STAPLE', color: 'brown', image: 'frontend/images/jyoti_potatoes.svg', visual: { type: 'biscuit', title: 'POTATOES', sub: '1 KG JYOTI' } },
  { id: 'p32', name: 'Fresh Green Peas', category: 'produce', categoryName: 'Fruits & Veggies', price: 60, unit: '500 g', desc: 'Sweet fresh green matar peas', tag: 'SEASONAL', color: 'green', image: 'frontend/images/green_peas.svg', visual: { type: 'biscuit', title: 'GREEN PEAS', sub: '500 G MATAR' } },
  { id: 'p33', name: 'Green Bell Pepper (Capsicum)', category: 'produce', categoryName: 'Fruits & Veggies', price: 40, unit: '250 g', desc: 'Crisp green capsicum bell pepper', tag: 'FRESH', color: 'green', image: 'frontend/images/green_capsicum.svg', visual: { type: 'biscuit', title: 'CAPSICUM', sub: '250 G GREEN' } },
  { id: 'p34', name: 'Cauliflower', category: 'produce', categoryName: 'Fruits & Veggies', price: 35, unit: '1 Pc · 500 g', desc: 'Fresh white cauliflower head', tag: 'FARM FRESH', color: 'green', image: 'frontend/images/cauliflower.svg', visual: { type: 'biscuit', title: 'CAULIFLOWER', sub: '1 PC FRESH' } },
  { id: 'p35', name: 'Ladyfinger (Bhindi)', category: 'produce', categoryName: 'Fruits & Veggies', price: 38, unit: '500 g', desc: 'Tender green ladyfinger bhindi', tag: 'FRESH', color: 'green', image: 'frontend/images/ladyfinger.svg', visual: { type: 'biscuit', title: 'BHINDI', sub: '500 G FRESH' } },
  { id: 'p36', name: 'Bananas (Robusta)', category: 'produce', categoryName: 'Fruits & Veggies', price: 45, unit: '1 Dozen · 12 Pcs', desc: 'Sweet ripe yellow bananas', tag: 'HIGH ENERGY', color: 'yellow', image: 'frontend/images/bananas.svg', visual: { type: 'biscuit', title: 'BANANAS', sub: '1 DOZEN 12 PCS' } },
  { id: 'p37', name: 'Apples (Royal Gala)', category: 'produce', categoryName: 'Fruits & Veggies', price: 160, unit: '4 Pcs · 500 g', desc: 'Crisp sweet imported Royal Gala apples', tag: 'PREMIUM', color: 'red', image: 'frontend/images/apples.svg', visual: { type: 'biscuit', title: 'APPLES', sub: 'ROYAL GALA' } },

  // Chips, Snacks & Namkeen (chips)
  { id: 'p38', name: 'Cream and Onion Chips', category: 'chips', categoryName: 'Chips & Snacks', price: 20, unit: '50 g', desc: "Lay's American style cream & onion", tag: 'POPULAR', color: 'green', image: 'frontend/images/cream_onion_chips.svg', visual: { type: 'chip', brand: "LAY'S", title: 'Cream &<br>Onion' } },
  { id: 'p39', name: 'Aloo Bhujia Sev', category: 'chips', categoryName: 'Chips & Snacks', price: 55, unit: '200 g', desc: "Haldiram's spicy potato bhujia", tag: 'BESTSELLER', color: 'yellow', image: 'frontend/images/aloo_bhujia.svg', visual: { type: 'chip', brand: 'HALDIRAM', title: 'Aloo<br>Bhujia' } },
  { id: 'p40', name: 'Khatta Meetha Namkeen', category: 'chips', categoryName: 'Chips & Snacks', price: 50, unit: '200 g', desc: 'Sweet and tangy crisp mixture', tag: '', color: 'orange', image: 'frontend/images/khatta_meetha.svg', visual: { type: 'chip', brand: 'NAMKEEN', title: 'Khatta<br>Meetha' } },
  { id: 'p41', name: 'Roasted Salted Peanuts', category: 'chips', categoryName: 'Chips & Snacks', price: 40, unit: '150 g', desc: 'Crunchy salted roasted peanuts', tag: 'PROTEIN', color: 'brown', image: 'frontend/images/salted_peanuts.svg', visual: { type: 'chip', title: 'ROASTED PEANUTS', sub: 'SALTED 150 G' } },

  // Biscuits & Cookies (biscuits)
  { id: 'p42', name: 'Marie Biscuits', category: 'biscuits', categoryName: 'Biscuits & Cookies', price: 35, unit: '250 g', desc: 'Light & crisp tea biscuits', tag: 'STAPLE', color: 'yellow', image: 'frontend/images/marie_biscuits.svg', visual: { type: 'biscuit', brand: 'BRITANNIA', title: 'Marie Gold', sub: 'TEA BISCUITS' } },
  { id: 'p43', name: 'Chocolate Bourbon Biscuits', category: 'biscuits', categoryName: 'Biscuits & Cookies', price: 40, unit: '150 g', desc: 'Rich chocolate creme sandwich biscuits', tag: 'POPULAR', color: 'brown', image: 'frontend/images/bourbon_biscuits.svg', visual: { type: 'biscuit', brand: 'BOURBON', title: 'Chocolate', sub: 'CREME BISCUITS' } },

  // Instant Food & Pasta (instant)
  { id: 'p44', name: 'Instant Masala Noodles', category: 'instant', categoryName: 'Noodles & Pasta', price: 55, unit: '4 Pack · 280 g', desc: 'Maggi 2-Minute masala noodles', tag: 'BESTSELLER', color: 'yellow', image: 'frontend/images/masala_noodles.svg', visual: { type: 'biscuit', brand: 'MAGGI', title: 'Masala', sub: '2-MIN NOODLES' } },
  { id: 'p45', name: 'Atta Noodles', category: 'instant', categoryName: 'Noodles & Pasta', price: 68, unit: '4 Pack · 290 g', desc: 'Whole wheat healthy masala noodles', tag: 'HEALTHY', color: 'green', image: 'frontend/images/atta_noodles.svg', visual: { type: 'biscuit', brand: 'MAGGI', title: 'Atta Noodles', sub: 'WHOLE WHEAT' } },
  { id: 'p46', name: 'Macaroni Elbow Pasta', category: 'instant', categoryName: 'Noodles & Pasta', price: 45, unit: '500 g', desc: '100% durum wheat macaroni elbow pasta', tag: '', color: 'yellow', image: 'frontend/images/macaroni_pasta.svg', visual: { type: 'biscuit', title: 'MACARONI', sub: 'ELBOW PASTA' } },
  { id: 'p47', name: 'Tomato Ketchup', category: 'instant', categoryName: 'Noodles & Pasta', price: 110, unit: '950 g', desc: 'Kissan fresh tomato ketchup squeezy', tag: 'STAPLE', color: 'red', image: 'frontend/images/tomato_ketchup.svg', visual: { type: 'drink', title: 'TOMATO KETCHUP', sub: '950 G BOTTLE' } },
  { id: 'p48', name: 'Schezwan Chutney Paste', category: 'instant', categoryName: 'Noodles & Pasta', price: 85, unit: '250 g', desc: "Ching's spicy schezwan chutney dip", tag: 'SPICY', color: 'red', image: 'frontend/images/schezwan_chutney.svg', visual: { type: 'drink', title: 'SCHEZWAN', sub: 'CHUTNEY PASTE' } },
  { id: 'p49', name: 'Mixed Fruit Jam', category: 'instant', categoryName: 'Noodles & Pasta', price: 80, unit: '500 g', desc: 'Kissan real mixed fruit jam jar', tag: 'SWEET', color: 'red', image: 'frontend/images/mixed_fruit_jam.svg', visual: { type: 'drink', title: 'FRUIT JAM', sub: 'MIXED FRUIT 500 G' } },

  // Breakfast & Spreads (breakfast)
  { id: 'p50', name: 'Classic Corn Flakes', category: 'breakfast', categoryName: 'Breakfast & Oats', price: 175, unit: '475 g', desc: "Kellogg's crispy golden corn flakes", tag: 'HEALTHY', color: 'yellow', image: 'frontend/images/corn_flakes.svg', visual: { type: 'biscuit', brand: 'KELLOGG', title: 'Corn Flakes', sub: 'CLASSIC BREAKFAST' } },
  { id: 'p51', name: 'Instant Masala Oats', category: 'breakfast', categoryName: 'Breakfast & Oats', price: 165, unit: '500 g', desc: 'Saffola veggie masala instant oats', tag: 'FITNESS', color: 'green', image: 'frontend/images/masala_oats.svg', visual: { type: 'biscuit', brand: 'SAFFOLA', title: 'Masala Oats', sub: 'INSTANT 500 G' } },
  { id: 'p52', name: 'Creamy Peanut Butter', category: 'breakfast', categoryName: 'Breakfast & Oats', price: 185, unit: '350 g', desc: 'High protein creamy roasted peanut butter', tag: 'HIGH PROTEIN', color: 'brown', image: 'frontend/images/peanut_butter.svg', visual: { type: 'biscuit', title: 'PEANUT BUTTER', sub: 'CREAMY 350 G' } },

  // Beverages & Drinks (drinks)
  { id: 'p53', name: 'CTC Black Leaf Tea', category: 'drinks', categoryName: 'Beverages & Soda', price: 140, unit: '500 g', desc: 'Strong & automatic CTC black tea leaves', tag: 'STAPLE', color: 'red', image: 'frontend/images/black_tea.svg', visual: { type: 'drink', brand: 'RED LABEL', title: 'Black Tea', sub: '500 G CTC' } },
  { id: 'p54', name: 'Pure Instant Coffee Powder', category: 'drinks', categoryName: 'Beverages & Soda', price: 195, unit: '100 g', desc: 'Nescafé pure instant coffee jar', tag: 'BESTSELLER', color: 'brown', image: 'frontend/images/instant_coffee.svg', visual: { type: 'drink', brand: 'NESCAFE', title: 'Instant Coffee', sub: '100 G GLASS JAR' } },
  { id: 'p55', name: 'Green Tea Bags', category: 'drinks', categoryName: 'Beverages & Soda', price: 160, unit: '25 Tea Bags', desc: 'Lipton pure green tea bags box', tag: 'HEALTHY', color: 'green', image: 'frontend/images/green_tea.svg', visual: { type: 'drink', brand: 'LIPTON', title: 'Green Tea', sub: '25 TEA BAGS' } },
  { id: 'p56', name: 'Packaged Mango Fruit Drink', category: 'drinks', categoryName: 'Beverages & Soda', price: 75, unit: '1.2 L', desc: 'Frooti juicy mango fruit drink bottle', tag: 'POPULAR', color: 'yellow', image: 'frontend/images/mango_drink.svg', visual: { type: 'drink', brand: 'FROOTI', title: 'Mango Drink', sub: '1.2 L BOTTLE' } },

  // Atta, Flours & Sooji (atta)
  { id: 'p57', name: 'Whole Wheat Chakki Atta', category: 'atta', categoryName: 'Atta & Flours', price: 240, unit: '5 kg', desc: 'Aashirvaad 100% pure whole wheat chakki atta', tag: 'STAPLE', color: 'yellow', image: 'frontend/images/chakki_atta.png', visual: { type: 'biscuit', title: 'CHAKKI ATTA', sub: '5 KG WHOLE WHEAT' } },
  { id: 'p58', name: 'Fine Maida (All-Purpose Flour)', category: 'atta', categoryName: 'Atta & Flours', price: 45, unit: '1 kg', desc: 'Refined fine white maida flour', tag: '', color: 'blue', image: 'frontend/images/fine_maida.svg', visual: { type: 'biscuit', title: 'FINE MAIDA', sub: '1 KG PACK' } },
  { id: 'p59', name: 'Chana Besan (Gram Flour)', category: 'atta', categoryName: 'Atta & Flours', price: 75, unit: '500 g', desc: 'Pure chana dal besan gram flour', tag: 'STAPLE', color: 'yellow', image: 'frontend/images/chana_besan.svg', visual: { type: 'biscuit', title: 'CHANA BESAN', sub: '500 G GRAM FLOUR' } },
  { id: 'p60', name: 'Roasted Sooji (Semolina)', category: 'atta', categoryName: 'Atta & Flours', price: 40, unit: '500 g', desc: 'Clean roasted rava sooji for halwa/upma', tag: '', color: 'yellow', image: 'frontend/images/roasted_sooji.svg', visual: { type: 'biscuit', title: 'ROASTED SOOJI', sub: '500 G RAVA' } },
  { id: 'p61', name: 'Rice Flour', category: 'atta', categoryName: 'Atta & Flours', price: 42, unit: '500 g', desc: 'Fine white rice flour for dosa & snacks', tag: '', color: 'blue', image: 'frontend/images/rice_flour.svg', visual: { type: 'biscuit', title: 'RICE FLOUR', sub: '500 G PACK' } },

  // Rice & Grains (rice)
  { id: 'p62', name: 'Long Grain Basmati Rice', category: 'rice', categoryName: 'Rice & Grains', price: 145, unit: '1 kg', desc: 'Daawat Rozana automatic long grain basmati', tag: 'PREMIUM', color: 'blue', image: 'frontend/images/basmati_rice.png', visual: { type: 'biscuit', brand: 'DAAWAT', title: 'Basmati Rice', sub: 'LONG GRAIN 1 KG' } },
  { id: 'p63', name: 'Everyday Rozana Rice', category: 'rice', categoryName: 'Rice & Grains', price: 65, unit: '1 kg', desc: 'Clean everyday rozana rice', tag: 'STAPLE', color: 'yellow', image: 'frontend/images/everyday_rice.svg', visual: { type: 'biscuit', title: 'ROZANA RICE', sub: '1 KG EVERYDAY' } },
  { id: 'p64', name: 'Sona Masoori Rice', category: 'rice', categoryName: 'Rice & Grains', price: 78, unit: '1 kg', desc: 'Lightweight Sona Masoori raw rice', tag: 'STAPLE', color: 'green', image: 'frontend/images/sona_masoori.svg', visual: { type: 'biscuit', title: 'SONA MASOORI', sub: '1 KG RICE' } },
  { id: 'p65', name: 'Thick Poha (Flattened Rice)', category: 'rice', categoryName: 'Rice & Grains', price: 42, unit: '500 g', desc: 'Thick clean poha for breakfast', tag: 'POPULAR', color: 'yellow', image: 'frontend/images/thick_poha.svg', visual: { type: 'biscuit', title: 'THICK POHA', sub: '500 G PACK' } },
  { id: 'p66', name: 'Puffed Rice (Murmura)', category: 'rice', categoryName: 'Rice & Grains', price: 30, unit: '250 g', desc: 'Crispy white puffed rice murmura', tag: 'LIGHT SNACK', color: 'blue', image: 'frontend/images/puffed_rice.svg', visual: { type: 'biscuit', title: 'MURMURA', sub: '250 G PUFFED RICE' } },

  // Dals & Pulses (pulses)
  { id: 'p67', name: 'Polished Toor Dal (Arhar)', category: 'pulses', categoryName: 'Dals & Pulses', price: 140, unit: '1 kg', desc: 'Yellow split arhar toor dal', tag: 'STAPLE', color: 'yellow', image: 'frontend/images/toor_dal.svg', visual: { type: 'biscuit', title: 'TOOR DAL', sub: '1 KG ARHAR' } },
  { id: 'p68', name: 'Yellow Moong Dal Split', category: 'pulses', categoryName: 'Dals & Pulses', price: 125, unit: '1 kg', desc: 'Split washed yellow moong dal', tag: 'EASY DIGEST', color: 'yellow', image: 'frontend/images/moong_dal.svg', visual: { type: 'biscuit', title: 'MOONG DAL', sub: '1 KG SPLIT' } },
  { id: 'p69', name: 'Chana Dal', category: 'pulses', categoryName: 'Dals & Pulses', price: 85, unit: '1 kg', desc: 'Split Bengal gram chana dal', tag: 'HIGH PROTEIN', color: 'yellow', image: 'frontend/images/chana_dal.svg', visual: { type: 'biscuit', title: 'CHANA DAL', sub: '1 KG PACK' } },
  { id: 'p70', name: 'Whole Urad Dal Black', category: 'pulses', categoryName: 'Dals & Pulses', price: 135, unit: '1 kg', desc: 'Whole black urad dal for dal makhani', tag: '', color: 'brown', image: 'frontend/images/urad_dal.svg', visual: { type: 'biscuit', title: 'URAD DAL', sub: '1 KG BLACK WHOLE' } },
  { id: 'p71', name: 'Red Masoor Dal Split', category: 'pulses', categoryName: 'Dals & Pulses', price: 95, unit: '1 kg', desc: 'Split red masoor lentil dal', tag: '', color: 'red', image: 'frontend/images/masoor_dal.svg', visual: { type: 'biscuit', title: 'MASOOR DAL', sub: '1 KG RED SPLIT' } },
  { id: 'p72', name: 'White Kabuli Chana (Chickpeas)', category: 'pulses', categoryName: 'Dals & Pulses', price: 130, unit: '1 kg', desc: 'Large white chickpeas for chole', tag: 'POPULAR', color: 'yellow', image: 'frontend/images/kabuli_chana.svg', visual: { type: 'biscuit', title: 'KABULI CHANA', sub: '1 KG CHICKPEAS' } },
  { id: 'p73', name: 'Brown Kala Chana', category: 'pulses', categoryName: 'Dals & Pulses', price: 80, unit: '1 kg', desc: 'Small nutrient-rich brown kala chana', tag: 'HEALTHY', color: 'brown', image: 'frontend/images/kala_chana.svg', visual: { type: 'biscuit', title: 'KALA CHANA', sub: '1 KG BROWN' } },
  { id: 'p74', name: 'Kashmiri Rajma Beans', category: 'pulses', categoryName: 'Dals & Pulses', price: 150, unit: '1 kg', desc: 'Dark red Kashmiri rajma kidney beans', tag: 'BESTSELLER', color: 'red', image: 'frontend/images/kashmiri_rajma.svg', visual: { type: 'biscuit', title: 'KASHMIRI RAJMA', sub: '1 KG RED BEANS' } },
  { id: 'p75', name: 'Soya Bean Chunks', category: 'pulses', categoryName: 'Dals & Pulses', price: 45, unit: '200 g', desc: 'Nutrela 50% protein soya chunks', tag: '50% PROTEIN', color: 'brown', image: 'frontend/images/soya_chunks.svg', visual: { type: 'biscuit', brand: 'NUTRELA', title: 'Soya Chunks', sub: '200 G HIGH PROTEIN' } },

  // Oils & Ghee (oils)
  { id: 'p76', name: 'Refined Sunflower Oil', category: 'oils', categoryName: 'Oils & Ghee', price: 135, unit: '1 L', desc: 'Fortune Sunlite refined sunflower oil pouch', tag: 'STAPLE', color: 'yellow', image: 'frontend/images/sunflower_oil.svg', visual: { type: 'drink', brand: 'FORTUNE', title: 'Sunflower Oil', sub: '1 LITER POUCH' } },
  { id: 'p77', name: 'Pure Mustard Oil (Kachi Ghani)', category: 'oils', categoryName: 'Oils & Ghee', price: 155, unit: '1 L', desc: 'Fortune Kachi Ghani cold pressed mustard oil', tag: 'PURE', color: 'orange', image: 'frontend/images/mustard_oil.svg', visual: { type: 'drink', brand: 'FORTUNE', title: 'Mustard Oil', sub: '1 LITER BOTTLE' } },
  { id: 'p78', name: 'Cow Desi Ghee', category: 'oils', categoryName: 'Oils & Ghee', price: 340, unit: '500 ml', desc: 'Amul 100% pure cow desi ghee jar', tag: 'PURE GHEE', color: 'yellow', image: 'frontend/images/cow_ghee.png', visual: { type: 'drink', brand: 'AMUL', title: 'Cow Ghee', sub: '500 ML JAR' } },

  // Spices & Cooking Staples (staples)
  { id: 'p79', name: 'Refined Iodized Table Salt', category: 'staples', categoryName: 'Spices & Salt', price: 28, unit: '1 kg', desc: 'Tata Salt vacuum evaporated iodized salt', tag: 'STAPLE', color: 'blue', image: 'frontend/images/iodized_salt.svg', visual: { type: 'biscuit', brand: 'TATA SALT', title: 'Table Salt', sub: '1 KG IODIZED' } },
  { id: 'p80', name: 'White Crystal Sugar', category: 'staples', categoryName: 'Spices & Salt', price: 48, unit: '1 kg', desc: 'Clean white crystal sugar', tag: 'STAPLE', color: 'blue', image: 'frontend/images/white_sugar.svg', visual: { type: 'biscuit', title: 'CRYSTAL SUGAR', sub: '1 KG PACK' } },
  { id: 'p81', name: 'Whole Turmeric Powder (Haldi)', category: 'staples', categoryName: 'Spices & Salt', price: 55, unit: '200 g', desc: 'Everest pure haldi turmeric powder', tag: 'PURE SPICE', color: 'orange', image: 'frontend/images/turmeric_powder.svg', visual: { type: 'biscuit', brand: 'EVEREST', title: 'Haldi Powder', sub: '200 G TURMERIC' } }
];

// 10 Special Combo Deals Fallback Dataset (Biscuits + Cold Drinks + Chocolates + Kurkure/Chips)
const fallbackDeals = [
  { id: 'deal_1', title: 'Mega Party Feast Combo', badge: 'SAVE ₹76 (24% OFF)', originalPrice: 315, comboPrice: 239, itemsText: "2x Parle-G + 1x Coca-Cola (750ml) + 4x 5 Star + 2x Kurkure", items: [{ id: 'p1', quantity: 2 }, { id: 'p6', quantity: 1 }, { id: 'p4', quantity: 4 }, { id: 'p7', quantity: 2 }], image: 'frontend/images/kurkure.png' },
  { id: 'deal_2', title: 'Ultimate Evening Snack Combo', badge: 'SAVE ₹76 (23% OFF)', originalPrice: 325, comboPrice: 249, itemsText: '2x Good Day + 1x Sprite + 4x KitKat + 2x Lay\'s Salted', items: [{ id: 'p5', quantity: 2 }, { id: 'p10', quantity: 1 }, { id: 'p12', quantity: 4 }, { id: 'p2', quantity: 2 }], image: 'frontend/images/goodday.png' },
  { id: 'deal_3', title: 'Weekend Binge Monster Combo', badge: 'SAVE ₹136 (24% OFF)', originalPrice: 565, comboPrice: 429, itemsText: '2x Oreo + 1x Fanta + 4x Dairy Milk + 2x Bingo Mad Angles', items: [{ id: 'p9', quantity: 2 }, { id: 'p3', quantity: 1 }, { id: 'p8', quantity: 4 }, { id: 'p11', quantity: 2 }], image: 'frontend/images/dairymilk.png' },
  { id: 'deal_4', title: 'Family Celebration Mega Pack', badge: 'SAVE ₹101 (25% OFF)', originalPrice: 400, comboPrice: 299, itemsText: '3x Good Day + 2x Coca-Cola + 4x 5 Star + 3x Kurkure', items: [{ id: 'p5', quantity: 3 }, { id: 'p6', quantity: 2 }, { id: 'p4', quantity: 4 }, { id: 'p7', quantity: 3 }], image: 'frontend/images/coke.png' },
  { id: 'deal_5', title: 'Midnight Craving Special', badge: 'SAVE ₹80 (24% OFF)', originalPrice: 335, comboPrice: 255, itemsText: '2x Oreo + 1x Coca-Cola + 4x KitKat + 2x Kurkure', items: [{ id: 'p9', quantity: 2 }, { id: 'p6', quantity: 1 }, { id: 'p12', quantity: 4 }, { id: 'p7', quantity: 2 }], image: 'frontend/images/kitkat.png' },
  { id: 'deal_6', title: 'Chilled Soda & Crunchy Munch', badge: 'SAVE ₹81 (23% OFF)', originalPrice: 350, comboPrice: 269, itemsText: '2x Parle-G + 2x Fanta + 4x 5 Star + 2x Bingo Mad Angles', items: [{ id: 'p1', quantity: 2 }, { id: 'p3', quantity: 2 }, { id: 'p4', quantity: 4 }, { id: 'p11', quantity: 2 }], image: 'frontend/images/fanta.png' },
  { id: 'deal_7', title: 'Supreme Chocolate & Snack Delight', badge: 'SAVE ₹140 (25% OFF)', originalPrice: 565, comboPrice: 425, itemsText: '2x Good Day + 1x Sprite + 4x Dairy Milk + 2x Lay\'s', items: [{ id: 'p5', quantity: 2 }, { id: 'p10', quantity: 1 }, { id: 'p8', quantity: 4 }, { id: 'p2', quantity: 2 }], image: 'frontend/images/sprite.png' },
  { id: 'deal_8', title: 'Gamer\'s Energy Reload Combo', badge: 'SAVE ₹101 (24% OFF)', originalPrice: 420, comboPrice: 319, itemsText: '2x Parle-G + 2x Coca-Cola + 4x KitKat + 2x Kurkure', items: [{ id: 'p1', quantity: 2 }, { id: 'p6', quantity: 2 }, { id: 'p12', quantity: 4 }, { id: 'p7', quantity: 2 }], image: 'frontend/images/lays.png' },
  { id: 'deal_9', title: 'Movie Marathon Mega Pack', badge: 'SAVE ₹91 (25% OFF)', originalPrice: 370, comboPrice: 279, itemsText: '3x Oreo + 2x Sprite + 4x 5 Star + 3x Bingo Mad Angles', items: [{ id: 'p9', quantity: 3 }, { id: 'p10', quantity: 2 }, { id: 'p4', quantity: 4 }, { id: 'p11', quantity: 3 }], image: 'frontend/images/oreo.png' },
  { id: 'deal_10', title: 'Sweet & Salty Super Saver', badge: 'SAVE ₹70 (25% OFF)', originalPrice: 285, comboPrice: 215, itemsText: '2x Good Day + 1x Fanta + 4x 5 Star + 2x Kurkure', items: [{ id: 'p5', quantity: 2 }, { id: 'p3', quantity: 1 }, { id: 'p4', quantity: 4 }, { id: 'p7', quantity: 2 }], image: 'frontend/images/5star.png' }
];

async function initApp() {
  // Check URL category query param
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('category');
  if (catParam) {
    state.currentCategory = catParam;
  }

  initElements();

  // Instant optimistic render from local cache if available
  const cachedProds = localStorage.getItem('dm_products_cache');
  if (cachedProds) {
    try {
      state.products = JSON.parse(cachedProds);
      renderProducts();
    } catch (e) {}
  }

  // Concurrent parallel loading for fast response
  await Promise.all([
    loadProducts(),
    loadCategories(),
    loadDeals()
  ]);

  renderCart();
  renderAisleTicker();
  renderHeroBagItems();
  renderHeroBgSlider();
  renderTrendingProducts();

  if (document.getElementById('home-category-shelves')) {
    renderHomeCategoryShelves();
  }
}

// Render Trending Today Best-Sellers Row for index.html
function renderTrendingProducts() {
  const grid = document.getElementById('trending-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const trendingIds = ['p13', 'p14', 'p1', 'p2', 'p5', 'p6'];
  const items = fallbackProducts.filter(p => trendingIds.includes(p.id));

  const salesCounts = [
    '🔥 58 sold in last hour',
    '⚡ Top Seller #1',
    '🔥 42 sold in last hour',
    '⚡ Hot Item',
    '🔥 39 sold today',
    '⚡ 31 sold in last hour'
  ];

  items.forEach((prod, index) => {
    const cardNode = createProductCardNode(prod);

    const salesBadge = document.createElement('span');
    salesBadge.className = 'trending-sales-badge';
    salesBadge.innerHTML = salesCounts[index % salesCounts.length];

    const imageContainer = cardNode.querySelector('.product-image');
    if (imageContainer) {
      imageContainer.insertBefore(salesBadge, imageContainer.firstChild);
    }

    grid.appendChild(cardNode);
  });
}

// Render subtle background sliding product images for hero illustration section
function renderHeroBgSlider() {
  const track = document.getElementById('hero-bg-slider-track');
  if (!track) return;

  track.innerHTML = '';

  const shuffled = [...fallbackProducts].filter(p => p.image).sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 12);

  const displayItems = [...selected, ...selected];

  displayItems.forEach(prod => {
    const img = document.createElement('img');
    img.src = prod.image;
    img.alt = prod.name;
    img.className = 'hero-bg-item';
    img.onerror = function() { this.style.display = 'none'; };
    track.appendChild(img);
  });
}

// Render dynamic grocery bag pop-out product items with discount badges & prices
function renderHeroBagItems() {
  const bagArt = document.getElementById('hero-bag-art');
  if (!bagArt) return;

  bagArt.innerHTML = '';

  // Pick 3 random products from catalog on every refresh
  const shuffled = [...fallbackProducts].sort(() => Math.random() - 0.5);
  const items = shuffled.slice(0, 3);

  const discounts = [20, 15, 25];

  items.forEach((prod, index) => {
    const card = document.createElement('div');
    card.className = `bag-art-item bag-art-item-${index + 1}`;
    
    const discPct = discounts[index % discounts.length];
    const mrp = Math.round(prod.price * (1 + discPct / 100));

    card.title = `Click to add ${prod.name} (₹${prod.price})`;

    const imgHTML = prod.image
      ? `<img src="${prod.image}" alt="${prod.name}" class="bag-art-item-img" onerror="this.style.display='none';" />`
      : `<span style="font-size: 24px;">🛒</span>`;

    card.innerHTML = `
      <span class="bag-art-item-badge">${discPct}% OFF</span>
      ${imgHTML}
      <span class="bag-art-item-name">${prod.name}</span>
      <div class="bag-art-item-prices">
        <small class="bag-art-item-mrp">₹${mrp}</small>
        <span class="bag-art-item-price">₹${prod.price}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      addToCart(prod);
    });

    bagArt.appendChild(card);
  });
}

// Render dynamic sliding aisle product ticker for hero section
function renderAisleTicker() {
  const track = document.getElementById('aisle-ticker-track');
  if (!track) return;

  track.innerHTML = '';

  // Randomize & shuffle catalog items for a fresh selection on every refresh
  const shuffledCatalog = [...fallbackProducts].sort(() => Math.random() - 0.5);
  const selectedItems = shuffledCatalog.slice(0, 14);

  // Duplicate list twice for seamless infinite marquee looping
  const displayItems = [...selectedItems, ...selectedItems];

  const discountTiers = [10, 15, 20, 12, 18, 25];

  displayItems.forEach((prod, index) => {
    const card = document.createElement('div');
    card.className = 'aisle-ticker-card';

    const discountPct = discountTiers[index % discountTiers.length];
    const mrp = Math.round(prod.price * (1 + discountPct / 100));

    card.title = `Save ${discountPct}% on ${prod.name}! Deal price: ₹${prod.price}`;

    const imgHTML = prod.image 
      ? `<img src="${prod.image}" alt="${prod.name}" class="aisle-card-img" onerror="this.style.display='none';" />` 
      : `<span style="font-size: 20px;">🛒</span>`;

    card.innerHTML = `
      <span class="aisle-card-discount-badge">${discountPct}% OFF</span>
      ${imgHTML}
      <div class="aisle-card-info">
        <span class="aisle-card-name">${prod.name}</span>
        <div class="aisle-card-prices">
          <span class="aisle-card-price">₹${prod.price}</span>
          <small class="aisle-card-mrp">₹${mrp}</small>
        </div>
      </div>
      <button type="button" class="aisle-card-add-btn" aria-label="Add ${prod.name}">+</button>
    `;

    card.addEventListener('click', () => {
      addToCart(prod);
    });

    track.appendChild(card);
  });
}

// Fetch 10 combo deals
async function loadDeals() {
  const grid = document.getElementById('deals-grid');
  if (!grid) return;

  try {
    const res = await fetch(`${API_BASE_URL}/deals`);
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    renderDeals(data.deals || fallbackDeals, grid);
  } catch (err) {
    console.warn('Deals API offline, using fallback combos.', err);
    renderDeals(fallbackDeals, grid);
  }
}

function renderDeals(dealsList, container) {
  container.innerHTML = '';
  dealsList.forEach(deal => {
    const card = document.createElement('article');
    card.className = 'deal-combo-card';
    card.innerHTML = `
      <span class="deal-combo-badge">${deal.badge}</span>
      <div class="deal-combo-image-box">
        <img src="${deal.image}" alt="${deal.title}" />
      </div>
      <div class="deal-combo-info">
        <h3>${deal.title}</h3>
        <p class="deal-items-desc">${deal.itemsText}</p>
        <div class="deal-price-row">
          <div class="deal-prices">
            <span class="original-price">₹${deal.originalPrice}</span>
            <span class="combo-price">₹${deal.comboPrice}</span>
          </div>
        </div>
        <button type="button" class="add-combo-btn" data-id="${deal.id}">
          Add Combo <span>+</span>
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  // Delegated click for combo add
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-combo-btn');
    if (!btn) return;

    const dealId = btn.dataset.id;
    const deal = (dealsList || fallbackDeals).find(d => d.id === dealId);
    if (!deal) return;

    deal.items.forEach(comboItem => {
      const prod = fallbackProducts.find(p => p.id === comboItem.id);
      if (prod) {
        for (let i = 0; i < comboItem.quantity; i++) {
          addToCart(prod);
        }
      }
    });
    showToast(`🎉 Added combo "${deal.title}" to basket!`);
  });
}

// Fetch products from backend API
async function loadProducts(category = state.currentCategory, query = state.searchQuery) {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (query) params.append('q', query);

    const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
    if (!res.ok) throw new Error('API fetch failed');
    const data = await res.json();
    state.products = data.products || [];
    if (!category || category === 'all') {
      try {
        localStorage.setItem('dm_products_cache', JSON.stringify(state.products));
      } catch (e) {}
    }
  } catch (err) {
    console.warn('Backend API unavailable, using offline dataset.', err);
    let filtered = [...fallbackProducts];
    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    if (query) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    }
    state.products = filtered;
  }

  // Apply sorting
  if (state.sortBy === 'price-low') {
    state.products.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'price-high') {
    state.products.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === 'name-az') {
    state.products.sort((a, b) => a.name.localeCompare(b.name));
  }

  renderProducts();
}

// Fetch categories from backend API and render category pills
async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (res.ok) {
      const data = await res.json();
      state.categories = data.categories || [];
      renderCategoryPills(state.categories);
    }
  } catch (err) {
    // Fallback category list
    const fallbackCats = [
      { id: 'all', name: 'All Products', icon: '🛒', count: fallbackProducts.length },
      { id: 'dairy', name: 'Dairy & Cheese', icon: '🥛', count: fallbackProducts.filter(p=>p.category==='dairy').length },
      { id: 'bakery', name: 'Bakery & Bread', icon: '🍞', count: fallbackProducts.filter(p=>p.category==='bakery').length },
      { id: 'produce', name: 'Fruits & Veggies', icon: '🥦', count: fallbackProducts.filter(p=>p.category==='produce').length },
      { id: 'chips', name: 'Chips & Snacks', icon: '🍿', count: fallbackProducts.filter(p=>p.category==='chips').length },
      { id: 'biscuits', name: 'Biscuits & Cookies', icon: '🍪', count: fallbackProducts.filter(p=>p.category==='biscuits').length },
      { id: 'instant', name: 'Noodles & Pasta', icon: '🍝', count: fallbackProducts.filter(p=>p.category==='instant').length },
      { id: 'breakfast', name: 'Breakfast & Oats', icon: '🥣', count: fallbackProducts.filter(p=>p.category==='breakfast').length },
      { id: 'drinks', name: 'Beverages & Soda', icon: '🥤', count: fallbackProducts.filter(p=>p.category==='drinks').length },
      { id: 'chocolates', name: 'Chocolates & Sweets', icon: '🍫', count: fallbackProducts.filter(p=>p.category==='chocolates').length },
      { id: 'atta', name: 'Atta & Flours', icon: '🌾', count: fallbackProducts.filter(p=>p.category==='atta').length },
      { id: 'rice', name: 'Rice & Grains', icon: '🍚', count: fallbackProducts.filter(p=>p.category==='rice').length },
      { id: 'pulses', name: 'Dals & Pulses', icon: '🫘', count: fallbackProducts.filter(p=>p.category==='pulses').length },
      { id: 'oils', name: 'Oils & Ghee', icon: '🛢️', count: fallbackProducts.filter(p=>p.category==='oils').length },
      { id: 'staples', name: 'Spices & Salt', icon: '🧂', count: fallbackProducts.filter(p=>p.category==='staples').length }
    ];
    renderCategoryPills(fallbackCats);
  }
}

function renderCategoryPills(cats) {
  if (!elements.categoriesContainer) return;
  elements.categoriesContainer.innerHTML = '';
  cats.forEach(c => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `category ${state.currentCategory === c.id ? 'active' : ''}`;
    btn.dataset.category = c.id;
    btn.innerHTML = `
      <span class="category-icon">${c.icon || '🛒'}</span>
      <div>
        <strong>${c.name}</strong>
        <small id="count-${c.id}">${c.count || 0} product${c.count !== 1 ? 's' : ''}</small>
      </div>
    `;

    btn.addEventListener('click', () => {
      // If on index.html, redirect to shop.html with category query param
      if (!document.getElementById('product-grid') && c.id !== 'all') {
        window.location.href = `shop.html?category=${c.id}`;
        return;
      }
      state.currentCategory = c.id;
      loadProducts(c.id);
      renderCategoryPills(cats);
    });

    elements.categoriesContainer.appendChild(btn);
  });
}

// Create single reusable product card DOM element with attached event listeners
function createProductCardNode(prod) {
  const inCartItem = state.cart.find(item => item.id === prod.id);
  const qty = inCartItem ? inCartItem.quantity : 0;

  const card = document.createElement('article');
  card.className = 'product-card';

  let visualHTML = '';
  const v = prod.visual || { title: prod.name, sub: prod.unit || '', type: 'biscuit' };
  if (prod.image) {
    const svgAlt = prod.image.endsWith('.png') ? prod.image.replace(/\.png$/i, '.svg') : prod.image;
    visualHTML = `<img src="${prod.image}" alt="${prod.name}" class="product-img" onerror="if (!this.dataset.triedSvg && this.src.endsWith('.png')) { this.dataset.triedSvg = 'true'; this.src = '${svgAlt}'; } else { this.style.display='none'; if (this.nextElementSibling) this.nextElementSibling.style.display='flex'; }" /><div class="product-visual fallback-visual" style="display:none;"><strong>${v.title || prod.name}</strong></div>`;
  } else {
    visualHTML = `<div class="product-visual chocolate-pack"><strong>${v.title || prod.name}</strong><small>${v.sub || ''}</small></div>`;
  }

  const tagHTML = prod.tag ? `<span class="tag">${prod.tag}</span>` : '';

  let actionButtonHTML = '';
  if (qty > 0) {
    actionButtonHTML = `
      <div class="card-qty-control">
        <button type="button" class="card-qty-btn decrease-qty" data-id="${prod.id}">-</button>
        <span class="card-qty-num">${qty} in basket</span>
        <button type="button" class="card-qty-btn increase-qty" data-id="${prod.id}">+</button>
      </div>
    `;
  } else {
    actionButtonHTML = `
      <button class="add-button add-to-cart-btn" type="button" data-id="${prod.id}">
        Add to basket <span>+</span>
      </button>
    `;
  }

  card.innerHTML = `
    <div class="product-image ${prod.color || 'blue'}">
      ${tagHTML}
      ${visualHTML}
    </div>
    <div class="product-info">
      <div>
        <h3>${prod.name}</h3>
        <p>${prod.unit || prod.desc}</p>
      </div>
      <strong class="price">₹${prod.price}</strong>
    </div>
    ${actionButtonHTML}
  `;

  // Attach card event listeners
  const addBtn = card.querySelector('.add-to-cart-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => addToCart(prod));
  }

  const decBtn = card.querySelector('.decrease-qty');
  if (decBtn) {
    decBtn.addEventListener('click', () => updateCartQuantity(prod.id, qty - 1));
  }

  const incBtn = card.querySelector('.increase-qty');
  if (incBtn) {
    incBtn.addEventListener('click', () => updateCartQuantity(prod.id, qty + 1));
  }

  return card;
}

// Flipkart Grocery Style Category Shelves Renderer for index.html
function renderHomeCategoryShelves() {
  const homeShelvesContainer = document.getElementById('home-category-shelves');
  if (!homeShelvesContainer) return;

  homeShelvesContainer.innerHTML = '';

  const homeCategories = [
    { id: 'dairy', title: '🥛 Dairy, Milk & Fresh Cheese', eyebrow: 'DAILY FRESH', linkText: 'Explore All Dairy ↗' },
    { id: 'bakery', title: '🍞 Bakery & Breakfast Breads', eyebrow: 'DAILY BAKED', linkText: 'Explore All Bakery ↗' },
    { id: 'produce', title: '🥦 Fresh Farm Veggies & Fruits', eyebrow: 'DIRECT FROM FARM', linkText: 'Explore All Produce ↗' },
    { id: 'chips', title: '🍿 Crispy Chips, Snacks & Namkeen', eyebrow: 'CRUNCH TIME', linkText: 'Explore All Snacks ↗' },
    { id: 'biscuits', title: '🍪 Biscuits, Cookies & Teatime', eyebrow: 'TEA TIME', linkText: 'Explore All Biscuits ↗' },
    { id: 'instant', title: '🍝 Noodles, Pasta & Sauces', eyebrow: '2-MIN DELIGHTS', linkText: 'Explore All Instant Foods ↗' },
    { id: 'atta', title: '🌾 Chakki Atta, Rice & Dals', eyebrow: 'KITCHEN STAPLES', linkText: 'Explore All Staples ↗' },
    { id: 'drinks', title: '🥤 Cold Beverages, Drinks & Soda', eyebrow: 'CHILLED REFRESHMENT', linkText: 'Explore All Drinks ↗' }
  ];

  homeCategories.forEach(cat => {
    const catItems = fallbackProducts.filter(p => p.category === cat.id).slice(0, 4);
    if (catItems.length === 0) return;

    const shelfSection = document.createElement('div');
    shelfSection.className = 'home-shelf-section';
    shelfSection.style.cssText = 'margin-bottom: 50px;';

    shelfSection.innerHTML = `
      <div class="product-top" style="margin-bottom: 20px;">
        <div>
          <p class="eyebrow">${cat.eyebrow}</p>
          <h2 style="font-size: 28px;">${cat.title}</h2>
        </div>
        <a class="text-link" href="shop.html?category=${cat.id}">${cat.linkText}</a>
      </div>
      <div class="product-grid home-shelf-grid"></div>
    `;

    const shelfGrid = shelfSection.querySelector('.home-shelf-grid');
    catItems.forEach(prod => {
      const cardNode = createProductCardNode(prod);
      shelfGrid.appendChild(cardNode);
    });

    homeShelvesContainer.appendChild(shelfSection);
  });
}

// Render Products Grid for shop.html
function renderProducts() {
  // Update home category shelves if on index.html
  if (document.getElementById('home-category-shelves')) {
    renderHomeCategoryShelves();
  }

  if (!elements.productGrid) return;
  elements.productGrid.innerHTML = '';

  if (state.products.length === 0) {
    elements.productGrid.innerHTML = `
      <div style="grid-column: 1/-1; padding: 60px 0; text-align: center; color: var(--muted);">
        <h3>No products found</h3>
        <p>Try clearing your search or picking another category.</p>
      </div>
    `;
    return;
  }

  state.products.forEach(prod => {
    const cardNode = createProductCardNode(prod);
    elements.productGrid.appendChild(cardNode);
  });
}

// Cart Operations
function addToCart(product) {
  const existing = state.cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  renderCart();
  renderProducts();
  showToast(`Added "${product.name}" to basket`);
}

function updateCartQuantity(productId, delta) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter(i => i.id !== productId);
    showToast(`Removed "${item.name}" from basket`);
  }
  saveCart();
  renderCart();
  renderProducts();
}

function saveCart() {
  localStorage.setItem('dm_cart', JSON.stringify(state.cart));
}

// Render Cart & Calculations
function renderCart() {
  const totalItemsCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  if (elements.headerCartCount) elements.headerCartCount.textContent = totalItemsCount;
  if (elements.mobileCartCount) elements.mobileCartCount.textContent = totalItemsCount;
  if (elements.basketItemCountText) elements.basketItemCountText.textContent = `${totalItemsCount} item${totalItemsCount !== 1 ? 's' : ''}`;

  // Dedicated Basket Page elements
  const pageBasketList = document.getElementById('page-basket-items-list');
  const pageSubtotal = document.getElementById('page-basket-subtotal');
  const pageDiscount = document.getElementById('page-basket-discount');
  const pageDiscountRow = document.getElementById('page-discount-row');
  const pageDelivery = document.getElementById('page-basket-delivery');
  const pageTotal = document.getElementById('page-basket-total');

  if (state.cart.length === 0) {
    if (elements.basketItemsList) elements.basketItemsList.innerHTML = `<div class="empty-basket">Your basket is empty. Browse our catalog and add items!</div>`;
    if (pageBasketList) pageBasketList.innerHTML = `<div style="padding: 40px 0; text-align: center; color: var(--muted);">Your basket is empty. <a href="shop.html" style="color: var(--orange); font-weight: 700;">Browse catalog</a></div>`;
    if (elements.basketSummaryRows) elements.basketSummaryRows.classList.add('hidden');
    if (elements.openCheckoutBtn) elements.openCheckoutBtn.disabled = true;
    if (elements.basketGrandTotal) elements.basketGrandTotal.textContent = '₹0';
    if (pageTotal) pageTotal.textContent = '₹0';
    if (pageSubtotal) pageSubtotal.textContent = '₹0';
    updateDeliveryProgress(0);
    return;
  }

  if (elements.basketSummaryRows) elements.basketSummaryRows.classList.remove('hidden');
  if (elements.openCheckoutBtn) elements.openCheckoutBtn.disabled = false;
  if (elements.basketItemsList) elements.basketItemsList.innerHTML = '';
  if (pageBasketList) pageBasketList.innerHTML = '';

  let subtotal = 0;

  state.cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const initial = item.name.charAt(0);
    if (elements.basketItemsList) {
      const itemEl = document.createElement('div');
      itemEl.className = 'basket-item';
      itemEl.innerHTML = `
        <span class="mini-pack ${item.color}">${initial}</span>
        <div>
          <strong>${item.name}</strong>
          <small>${item.quantity} × ₹${item.price}</small>
          <div class="basket-item-qty">
            <button type="button" class="basket-qty-btn decrease-qty" data-id="${item.id}">-</button>
            <span><b>${item.quantity}</b></span>
            <button type="button" class="basket-qty-btn increase-qty" data-id="${item.id}">+</button>
          </div>
        </div>
        <strong style="font-size: 15px;">₹${itemTotal}</strong>
      `;
      elements.basketItemsList.appendChild(itemEl);
    }

    if (pageBasketList) {
      const row = document.createElement('div');
      row.className = 'basket-table-row';
      const svgAlt = item.image ? (item.image.endsWith('.png') ? item.image.replace(/\.png$/i, '.svg') : item.image) : '';
      row.innerHTML = `
        <div class="basket-prod-info">
          <img src="${item.image}" alt="${item.name}" class="basket-prod-img" onerror="if (!this.dataset.triedSvg && this.src.endsWith('.png')) { this.dataset.triedSvg = 'true'; this.src = '${svgAlt}'; } else { this.style.display='none'; }" />
          <div class="basket-prod-details">
            <h4>${item.name}</h4>
            <small>${item.unit || ''}</small>
          </div>
        </div>
        <div>₹${item.price}</div>
        <div class="basket-qty-btn-group">
          <button type="button" class="decrease-qty" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button type="button" class="increase-qty" data-id="${item.id}">+</button>
        </div>
        <strong>₹${itemTotal}</strong>
        <button type="button" class="remove-item-btn decrease-qty" data-id="${item.id}" title="Remove item">&times;</button>
      `;
      pageBasketList.appendChild(row);
    }
  });

  // Delivery calculation
  const deliveryFee = subtotal >= 499 ? 0 : 40;
  updateDeliveryProgress(subtotal);

  // Deal discount (10% if 3+ items, or promo code discount)
  let discountPct = totalItemsCount >= 3 ? 0.10 : 0;
  if (state.promoDiscountPercent) {
    discountPct = Math.max(discountPct, state.promoDiscountPercent / 100);
  }
  let discount = Math.round(subtotal * discountPct);

  if (discount > 0) {
    if (elements.discountRow) elements.discountRow.classList.remove('hidden');
    if (elements.basketDiscount) elements.basketDiscount.textContent = `-₹${discount}`;
    if (pageDiscountRow) pageDiscountRow.classList.remove('hidden');
    if (pageDiscount) pageDiscount.textContent = `-₹${discount}`;
  } else {
    if (elements.discountRow) elements.discountRow.classList.add('hidden');
    if (pageDiscountRow) pageDiscountRow.classList.add('hidden');
  }

  const grandTotal = Math.max(0, subtotal - discount) + (subtotal > 0 ? deliveryFee : 0);

  if (elements.basketSubtotal) elements.basketSubtotal.textContent = `₹${subtotal}`;
  if (elements.basketDeliveryFee) elements.basketDeliveryFee.textContent = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`;
  if (elements.basketGrandTotal) elements.basketGrandTotal.textContent = `₹${grandTotal}`;
  if (elements.modalGrandTotal) elements.modalGrandTotal.textContent = `₹${grandTotal}`;

  if (pageSubtotal) pageSubtotal.textContent = `₹${subtotal}`;
  if (pageDelivery) pageDelivery.textContent = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`;
  if (pageTotal) pageTotal.textContent = `₹${grandTotal}`;
}

// Update free delivery progress bar
function updateDeliveryProgress(subtotal) {
  const target = 499;
  const fillEls = document.querySelectorAll('.delivery-progress-fill, #delivery-progress-fill');
  const textEls = document.querySelectorAll('#delivery-progress-text');

  if (subtotal >= target) {
    fillEls.forEach(el => { el.style.width = '100%'; });
    textEls.forEach(el => { el.textContent = '🎉 YOU UNLOCKED FREE DELIVERY!'; });
  } else {
    const percentage = Math.min(100, (subtotal / target) * 100);
    const remaining = target - subtotal;
    fillEls.forEach(el => { el.style.width = `${percentage}%`; });
    textEls.forEach(el => { el.textContent = `Add ₹${remaining} for FREE delivery`; });
  }
}

// Toast Notifications
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  const container = elements.toastContainer || document.getElementById('toast-container');
  if (container) {
    container.appendChild(toast);
  }
  setTimeout(() => {
    toast.remove();
  }, 2800);
}

// Event Listeners Setup
function setupEventListeners() {
  // Category Selection
  if (elements.categoriesContainer) {
    elements.categoriesContainer.addEventListener('click', (e) => {
      const catBtn = e.target.closest('.category');
      if (!catBtn) return;

      document.querySelectorAll('.category').forEach(b => b.classList.remove('active'));
      catBtn.classList.add('active');

      const categoryKey = catBtn.dataset.category;
      state.currentCategory = categoryKey;
      
      const categoryName = catBtn.querySelector('strong').textContent;
      if (elements.productSectionTitle) elements.productSectionTitle.textContent = categoryName;
      if (elements.filterStatus) elements.filterStatus.textContent = `Filter: ${categoryName}`;

      loadProducts(categoryKey, state.searchQuery);
    });
  }

  // Shop Page Search Input listener
  if (elements.shopPageSearch) {
    elements.shopPageSearch.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      loadProducts(state.currentCategory, state.searchQuery);
    });
  }

  // Sort Select Listener
  if (elements.sortSelect) {
    elements.sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      loadProducts(state.currentCategory, state.searchQuery);
    });
  }

  // Product Grid Delegated Clicks (Add to basket / Qty adjust)
  if (elements.productGrid) {
    elements.productGrid.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.add-to-cart-btn');
      if (addBtn) {
        const prodId = addBtn.dataset.id;
        const product = state.products.find(p => p.id === prodId) || fallbackProducts.find(p => p.id === prodId);
        if (product) addToCart(product);
        return;
      }

      const incBtn = e.target.closest('.increase-qty');
      if (incBtn) {
        updateCartQuantity(incBtn.dataset.id, 1);
        return;
      }

      const decBtn = e.target.closest('.decrease-qty');
      if (decBtn) {
        updateCartQuantity(decBtn.dataset.id, -1);
        return;
      }
    });
  }

  // Basket List Delegated Qty Clicks
  if (elements.basketItemsList) {
    elements.basketItemsList.addEventListener('click', (e) => {
      const incBtn = e.target.closest('.increase-qty');
      if (incBtn) {
        updateCartQuantity(incBtn.dataset.id, 1);
        return;
      }
      const decBtn = e.target.closest('.decrease-qty');
      if (decBtn) {
        updateCartQuantity(decBtn.dataset.id, -1);
        return;
      }
    });
  }

  // Page Basket Table Delegated Qty Clicks
  const pageBasketList = document.getElementById('page-basket-items-list');
  if (pageBasketList) {
    pageBasketList.addEventListener('click', (e) => {
      const incBtn = e.target.closest('.increase-qty');
      if (incBtn) {
        updateCartQuantity(incBtn.dataset.id, 1);
        return;
      }
      const decBtn = e.target.closest('.decrease-qty');
      if (decBtn) {
        updateCartQuantity(decBtn.dataset.id, -1);
        return;
      }
    });
  }

  // Apply Promo Code Button on Basket Page
  const applyPromoBtn = document.getElementById('apply-promo-btn');
  if (applyPromoBtn) {
    applyPromoBtn.addEventListener('click', async () => {
      const input = document.getElementById('promo-input');
      const code = input ? input.value.trim().toUpperCase() : '';
      if (!code) {
        showToast('Please enter a promo code.');
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/promo/validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.valid) {
            state.promoDiscountPercent = data.promo.discountPercent;
            showToast(`🎉 Code '${code}' Applied! ${data.promo.discountPercent}% OFF discount active.`);
            input.value = '';
            calculateCartTotals();
            return;
          } else {
            showToast(`⚠️ ${data.message || 'Invalid promo code'}`);
            return;
          }
        }
      } catch (err) {
        console.warn('Promo API offline, fallback to client rules:', err);
      }

      if (code === 'DAILY10' || code === 'DM10') {
        state.promoDiscountPercent = 10;
        showToast(`🎉 Code '${code}' Applied! 10% OFF discount active.`);
        input.value = '';
        calculateCartTotals();
      } else if (code === 'WELCOME50') {
        state.promoDiscountPercent = 50;
        showToast(`🎉 Code '${code}' Applied! 50% OFF discount active.`);
        input.value = '';
        calculateCartTotals();
      } else {
        showToast(`⚠️ Invalid code '${code}'. Try DAILY10 or WELCOME50.`);
      }
    });
  }

  // Search Modal Listeners
  const openSearchMobile = document.getElementById('mobile-nav-search');
  if (openSearchMobile) {
    openSearchMobile.addEventListener('click', () => {
      if (elements.searchModal) elements.searchModal.classList.remove('hidden');
      if (elements.searchInput) {
        elements.searchInput.value = '';
        elements.searchInput.focus();
      }
      renderSearchResults('');
    });
  }

  if (elements.openSearchBtn) {
    elements.openSearchBtn.addEventListener('click', () => {
      if (elements.searchModal) elements.searchModal.classList.remove('hidden');
      if (elements.searchInput) {
        elements.searchInput.value = '';
        elements.searchInput.focus();
      }
      renderSearchResults('');
    });
  }

  if (elements.closeSearchBtn) {
    elements.closeSearchBtn.addEventListener('click', () => {
      if (elements.searchModal) elements.searchModal.classList.add('hidden');
    });
  }

  if (elements.searchModal) {
    elements.searchModal.addEventListener('click', (e) => {
      if (e.target === elements.searchModal) {
        elements.searchModal.classList.add('hidden');
      }
    });
  }

  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value.trim());
    });
  }

  // Checkout Modal Listeners
  if (elements.openCheckoutBtn) {
    elements.openCheckoutBtn.addEventListener('click', () => {
      if (state.cart.length === 0) return;
      if (elements.checkoutModal) elements.checkoutModal.classList.remove('hidden');
    });
  }

  if (elements.closeCheckoutBtn) {
    elements.closeCheckoutBtn.addEventListener('click', () => {
      if (elements.checkoutModal) elements.checkoutModal.classList.add('hidden');
    });
  }

  if (elements.checkoutModal) {
    elements.checkoutModal.addEventListener('click', (e) => {
      if (e.target === elements.checkoutModal) {
        elements.checkoutModal.classList.add('hidden');
      }
    });
  }

  // Submit Order Form
  if (elements.checkoutForm) {
    elements.checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();

    const customer = {
      name: document.getElementById('cust-name').value.trim(),
      phone: document.getElementById('cust-phone').value.trim(),
      address: document.getElementById('cust-address').value.trim()
    };

    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    const payload = {
      customer,
      items: state.cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      paymentMethod
    };

    const submitBtn = document.getElementById('submit-order-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing Order...';

    let orderData = null;

    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        orderData = data.order;
      } else {
        throw new Error('API server rejected order');
      }
    } catch (err) {
      console.warn('API error, placing fallback client order:', err);
      const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const totalItemsCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
      const discount = totalItemsCount >= 3 ? Math.round(subtotal * 0.10) : 0;
      const deliveryFee = subtotal >= 499 ? 0 : 40;
      orderData = {
        orderId: 'DM-' + Math.floor(100000 + Math.random() * 900000),
        customer,
        items: payload.items,
        subtotal,
        discount,
        deliveryFee,
        grandTotal: subtotal - discount + deliveryFee,
        paymentMethod,
        estimatedDelivery: '25-35 mins'
      };
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Place Order Now ↗';
    elements.checkoutModal.classList.add('hidden');

    // Display receipt
    displayReceipt(orderData);

    // Save order to LocalStorage for Profile order history
    try {
      const storedOrders = JSON.parse(localStorage.getItem('dm_orders')) || [];
      storedOrders.unshift(orderData);
      localStorage.setItem('dm_orders', JSON.stringify(storedOrders));
    } catch (e) {
      console.warn('Failed saving order to localStorage:', e);
    }

    // Clear Cart
    state.cart = [];
    saveCart();
    renderCart();
    renderProducts();
    loadUserProfile();
  });
  }

  // Close Receipt Modal
  if (elements.closeReceiptBtn) {
    elements.closeReceiptBtn.addEventListener('click', () => {
      if (elements.receiptModal) elements.receiptModal.classList.add('hidden');
    });
  }
}

// Live Search Results renderer inside modal
function renderSearchResults(query) {
  elements.searchResults.innerHTML = '';
  if (!query) {
    elements.searchResults.innerHTML = `<div style="color: var(--muted); padding: 15px 0;">Type product name or category to search...</div>`;
    return;
  }

  const queryLower = query.toLowerCase();
  const matches = fallbackProducts.filter(p => 
    p.name.toLowerCase().includes(queryLower) ||
    p.categoryName.toLowerCase().includes(queryLower) ||
    p.unit.toLowerCase().includes(queryLower)
  );

  if (matches.length === 0) {
    elements.searchResults.innerHTML = `<div style="color: var(--muted); padding: 15px 0;">No matching items found for "${query}"</div>`;
    return;
  }

  matches.forEach(prod => {
    const item = document.createElement('div');
    item.className = 'search-item';
    item.innerHTML = `
      <div>
        <strong>${prod.name}</strong>
        <small>${prod.unit} · ₹${prod.price}</small>
      </div>
      <button type="button" class="button button-dark" style="padding: 6px 12px; font-size: 10px;" data-id="${prod.id}">
        Add +
      </button>
    `;
    item.querySelector('button').addEventListener('click', () => {
      addToCart(prod);
      elements.searchModal.classList.add('hidden');
    });
    elements.searchResults.appendChild(item);
  });
}

// Render Receipt Modal
function displayReceipt(order) {
  elements.receiptOrderId.textContent = `Order #${order.orderId}`;
  elements.receiptDeliveryTime.textContent = order.estimatedDelivery || '25-35 mins';
  elements.receiptCustomerName.textContent = `👤 ${order.customer.name}`;
  elements.receiptCustomerPhone.textContent = `📞 ${order.customer.phone}`;
  elements.receiptCustomerAddress.textContent = `📍 ${order.customer.address}`;

  elements.receiptItemsList.innerHTML = '';
  order.items.forEach(i => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex; justify-content:space-between; font-size:13px; margin: 4px 0;';
    row.innerHTML = `<span>${i.name} (${i.quantity}x)</span><span>₹${i.unitPrice * i.quantity}</span>`;
    elements.receiptItemsList.appendChild(row);
  });

  elements.receiptSubtotal.textContent = `₹${order.subtotal}`;
  elements.receiptDiscount.textContent = `-₹${order.discount}`;
  elements.receiptDelivery.textContent = order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`;
  elements.receiptGrandTotal.textContent = `₹${order.grandTotal}`;

  elements.receiptModal.classList.remove('hidden');
}

// User Profile & Order History Logic
// User Profile & Order History Logic
async function loadUserProfile() {
  const container = document.getElementById('orders-list-container');
  const savedProfile = JSON.parse(localStorage.getItem('dm_profile'));
  const isLoggedOut = localStorage.getItem('dm_logged_out') === 'true';

  let localProfile = (!isLoggedOut && savedProfile) ? savedProfile : {
    isGuest: true,
    name: 'Guest User',
    email: 'Sign in to create your profile',
    phone: '-',
    joinedDate: 'Guest Session',
    memberTier: 'GUEST',
    cashbackBalance: 0
  };

  let loadedOrders = [];

  if (!localProfile.isGuest) {
    try {
      const res = await fetch(`${API_BASE_URL}/user/profile`);
      if (res.ok) {
        const data = await res.json();
        if (data.profile && !data.profile.isGuest && localProfile.phone && data.profile.phone === localProfile.phone) {
          localProfile = { ...localProfile, ...data.profile };
        }
        if (data.orders) {
          loadedOrders = data.orders.filter(o => {
            if (!o.customer) return false;
            if (localProfile.phone && o.customer.phone === localProfile.phone) return true;
            if (localProfile.name && o.customer.name && o.customer.name.toLowerCase() === localProfile.name.toLowerCase()) return true;
            return false;
          });
        }
      }
    } catch (err) {
      console.warn('Profile API fallback, using local state:', err);
    }
  }

  // Merge locally stored orders placed in current session
  const localOrders = JSON.parse(localStorage.getItem('dm_orders')) || [];
  const userLocalOrders = localOrders.filter(o => {
    if (localProfile.isGuest) return false;
    if (!o.customer) return false;
    if (localProfile.phone && o.customer.phone === localProfile.phone) return true;
    if (localProfile.name && o.customer.name && o.customer.name.toLowerCase() === localProfile.name.toLowerCase()) return true;
    return false;
  });
  const allOrders = [...userLocalOrders, ...loadedOrders];
  const uniqueOrders = Array.from(new Map(allOrders.map(o => [o.orderId, o])).values());

  updateProfileUI(localProfile);

  const metricOrdersCount = document.getElementById('metric-orders-count');
  if (metricOrdersCount) metricOrdersCount.textContent = uniqueOrders.length;

  if (container) {
    renderOrdersList(uniqueOrders, container);
  }
}

function updateProfileUI(profile) {
  const nameEl = document.getElementById('user-display-name');
  const emailEl = document.getElementById('user-display-email');
  const phoneEl = document.getElementById('user-display-phone');
  const avatarEl = document.querySelector('.profile-avatar');
  const memberBadgeEl = document.getElementById('user-member-badge');
  const logoutBtn = document.getElementById('logout-btn');

  const isGuest = profile.isGuest || !profile || !profile.name || profile.name === 'Guest User';

  if (nameEl) nameEl.textContent = isGuest ? 'Guest User' : profile.name;
  if (emailEl) emailEl.textContent = isGuest ? 'Sign in to create your profile & track orders' : profile.email;
  if (phoneEl) phoneEl.textContent = isGuest ? '-' : profile.phone;
  if (memberBadgeEl) memberBadgeEl.textContent = isGuest ? 'GUEST' : (profile.memberTier || 'DM Member');
  
  if (avatarEl) {
    if (isGuest) {
      avatarEl.textContent = '👤';
    } else {
      const initials = profile.name.split(' ').map(n => n[0]).join('').toUpperCase();
      avatarEl.textContent = initials || '👤';
    }
  }

  if (logoutBtn) {
    if (isGuest) {
      logoutBtn.innerHTML = '<span>🔑 Sign In / Create Account</span>';
      logoutBtn.title = 'Create an account or sign in';
    } else {
      logoutBtn.innerHTML = '<span>🚪 Sign Out</span>';
      logoutBtn.title = 'Sign out of account';
    }
  }

  // Unified Login / Profile header action button update
  const headerProfileLink = document.getElementById('header-profile-link');
  const headerNameEl = document.getElementById('header-user-name');

  if (headerNameEl && headerProfileLink) {
    if (!isGuest && profile && profile.name) {
      const firstName = profile.name.trim().split(' ')[0] || 'Account';
      headerNameEl.textContent = firstName;
      headerProfileLink.href = 'profile.html';
      headerProfileLink.title = 'My Profile (' + profile.name + ')';
    } else {
      headerNameEl.textContent = 'Login';
      headerProfileLink.href = 'login.html';
      headerProfileLink.title = 'Sign In / Register';
      if (window.location.pathname.includes('login.html')) {
        headerProfileLink.classList.add('active-nav');
      }
    }
  }

  // Auto-fill checkout fields if open
  const custName = document.getElementById('cust-name');
  const custPhone = document.getElementById('cust-phone');
  const custAddress = document.getElementById('cust-address');
  if (custName && !custName.value && !isGuest) custName.value = profile.name || '';
  if (custPhone && !custPhone.value && !isGuest) custPhone.value = profile.phone || '';
  if (custAddress && !custAddress.value && !isGuest && profile.address) custAddress.value = profile.address;

  // Sync wallet balance (default initial ₹0)
  const walletBal = isGuest ? 0 : (localStorage.getItem('dm_wallet') || profile.cashbackBalance || 0);
  const balEl = document.getElementById('metric-wallet-balance');
  if (balEl) balEl.textContent = `₹${walletBal}`;
  const wallHeading = document.getElementById('wallet-display-balance');
  if (wallHeading) wallHeading.textContent = `₹${walletBal}`;

  // Settings form input values
  const setForm = document.getElementById('profile-settings-form');
  if (setForm) {
    const inputName = document.getElementById('setting-name');
    const inputEmail = document.getElementById('setting-email');
    const inputPhone = document.getElementById('setting-phone');
    const inputAddress = document.getElementById('setting-address');
    if (inputName) inputName.value = isGuest ? '' : (profile.name || '');
    if (inputEmail) inputEmail.value = isGuest ? '' : (profile.email || '');
    if (inputPhone) inputPhone.value = isGuest ? '' : (profile.phone || '');
    if (inputAddress) inputAddress.value = isGuest ? '' : (profile.address || '');
  }
}

function renderOrdersList(ordersList, container) {
  const metricOrdersCount = document.getElementById('metric-orders-count');
  if (metricOrdersCount) metricOrdersCount.textContent = ordersList.length;

  container.innerHTML = '';
  if (ordersList.length === 0) {
    container.innerHTML = `<div style="padding: 40px 0; text-align: center; color: var(--muted); font-size: 15px;">No past orders found. Start shopping today!</div>`;
    return;
  }

  ordersList.forEach(order => {
    const card = document.createElement('div');
    card.className = 'order-card';

    const formattedDate = new Date(order.date || Date.now()).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });

    const statusClass = (order.status || 'Confirmed').toLowerCase().replace(/\s+/g, '-');

    let itemsRowsHTML = '';
    (order.items || []).forEach(item => {
      itemsRowsHTML += `
        <div class="order-item-row">
          <span>${item.name} (${item.quantity}x)</span>
          <strong>₹${item.totalPrice || item.unitPrice * item.quantity}</strong>
        </div>
      `;
    });

    const isDelivered = statusClass === 'delivered';
    const trackerHTML = isDelivered ? '' : `
      <div class="order-tracker-timeline" style="margin: 12px 0; background: rgba(40, 35, 30, 0.03); padding: 10px 14px; border-radius: 6px; border: 1px solid var(--line);">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-weight: 700; color: var(--green); margin-bottom: 8px;">
          <span>⏱️ Live Delivery Tracker</span>
          <span style="background: rgba(53, 84, 67, 0.1); padding: 2px 8px; border-radius: 10px;">${order.estimatedDelivery || '25-35 mins'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; text-align: center; font-size: 10px; color: var(--muted);">
          <div style="flex:1; color: var(--ink); font-weight: 700;"><span style="display:block; font-size:13px;">✓</span>Order Placed</div>
          <div style="flex:1; color: var(--ink); font-weight: 700;"><span style="display:block; font-size:13px;">📦</span>Packed at Hub</div>
          <div style="flex:1; color: var(--orange); font-weight: 700;"><span style="display:block; font-size:13px;">🚴</span>On the Way</div>
          <div style="flex:1; opacity:0.5;"><span style="display:block; font-size:13px;">🏠</span>Delivered</div>
        </div>
      </div>
    `;

    card.innerHTML = `
      <div class="order-card-header">
        <div>
          <span class="order-id">Order #${order.orderId}</span>
          <small style="display:block; color: var(--muted); margin-top:2px;">Placed on ${formattedDate}</small>
        </div>
        <span class="order-status ${statusClass}">${order.status || 'Confirmed'}</span>
      </div>
      ${trackerHTML}
      <div class="order-items-preview">
        ${itemsRowsHTML}
      </div>
      <div class="order-card-footer">
        <div>
          <small style="color: var(--muted); display:block;">Paid via ${order.paymentMethod || 'Cash'}</small>
          <span class="order-total-price">Total: ₹${order.grandTotal}</span>
        </div>
        <button type="button" class="button button-dark reorder-btn" style="padding: 8px 14px; font-size: 11px;">Reorder All <span>↗</span></button>
      </div>
    `;

    // Reorder event listener
    const reorderBtn = card.querySelector('.reorder-btn');
    if (reorderBtn) {
      reorderBtn.addEventListener('click', () => {
        let count = 0;
        (order.items || []).forEach(item => {
          const matchedProd = fallbackProducts.find(p => p.id === item.id) || {
            id: item.id,
            name: item.name,
            price: item.unitPrice,
            unit: '1 pc'
          };
          for (let i = 0; i < (item.quantity || 1); i++) {
            addToCart(matchedProd);
            count++;
          }
        });
        showToast(`🛒 Added ${count} item(s) from Order #${order.orderId} to your basket!`);
        if (elements.basketDrawer) elements.basketDrawer.classList.add('open');
      });
    }

    container.appendChild(card);
  });
}

// Profile Page Tab Switching and Interactivity
function setupProfileTabs() {
  const tabsNav = document.querySelector('.profile-tabs-nav');
  if (tabsNav) {
    tabsNav.addEventListener('click', (e) => {
      const btn = e.target.closest('.profile-tab-btn');
      if (!btn) return;

      document.querySelectorAll('.profile-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.dataset.tab;
      document.querySelectorAll('.profile-tab-content').forEach(content => {
        if (content.id === `tab-${targetTab}`) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });
    });
  }

  // Logout / Sign In Button Handler
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      const savedProfile = JSON.parse(localStorage.getItem('dm_profile'));
      const isLoggedOut = localStorage.getItem('dm_logged_out') === 'true';

      if (!isLoggedOut && savedProfile && savedProfile.name !== 'Guest User') {
        localStorage.setItem('dm_logged_out', 'true');
        showToast('🚪 Signed out successfully.');
      }
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 500);
    });
  }

  // Account Settings Form Submit
  const setForm = document.getElementById('profile-settings-form');
  if (setForm) {
    setForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('setting-name').value.trim();
      const email = document.getElementById('setting-email').value.trim();
      const phone = document.getElementById('setting-phone').value.trim();
      const addressInput = document.getElementById('setting-address');
      const address = addressInput ? addressInput.value.trim() : '';

      const existing = JSON.parse(localStorage.getItem('dm_profile')) || {};
      const updated = { ...existing, name, email, phone, address, isGuest: false };
      localStorage.removeItem('dm_logged_out');
      localStorage.setItem('dm_profile', JSON.stringify(updated));

      try {
        await fetch(`${API_BASE_URL}/user/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
      } catch (err) {
        console.warn('Backend profile sync skipped.');
      }

      updateProfileUI(updated);
      showToast('🎉 Profile updated successfully!');
    });
  }

  // Wallet Top Up Handler
  const addFundsBtn = document.getElementById('add-funds-btn');
  if (addFundsBtn) {
    addFundsBtn.addEventListener('click', () => {
      const amountStr = prompt('Enter amount to top up DM Wallet (₹):', '200');
      if (amountStr) {
        const amount = parseInt(amountStr, 10);
        if (!isNaN(amount) && amount > 0) {
          const currentBal = parseInt(localStorage.getItem('dm_wallet') || '250', 10);
          const newBal = currentBal + amount;
          localStorage.setItem('dm_wallet', newBal.toString());

          const balEl = document.getElementById('metric-wallet-balance');
          if (balEl) balEl.textContent = `₹${newBal}`;
          const wallHeading = document.getElementById('wallet-display-balance');
          if (wallHeading) wallHeading.textContent = `₹${newBal}`;

          const histList = document.querySelector('.wallet-history-list');
          if (histList) {
            const row = document.createElement('div');
            row.className = 'wallet-row';
            row.innerHTML = `
              <div>
                <strong>₹${amount} Added to DM Wallet</strong>
                <small>Instant Top-Up Balance</small>
              </div>
              <span class="plus-amount">+₹${amount}</span>
            `;
            histList.prepend(row);
          }

          showToast(`💳 Successfully added ₹${amount} to DM Wallet!`);
        }
      }
    });
  }

  // Add Address Handler
  const addAddressBtn = document.getElementById('add-address-btn');
  if (addAddressBtn) {
    addAddressBtn.addEventListener('click', () => {
      const label = prompt('Address Label (e.g., Home, Work, Other):', 'Home');
      if (!label) return;
      const addressText = prompt('Enter Full Delivery Address:', '');
      if (!addressText) return;
      const phoneText = prompt('Contact Phone Number:', '9876543210');

      const grid = document.getElementById('addresses-grid');
      if (grid) {
        const card = document.createElement('div');
        card.className = 'address-card';
        const currentName = document.getElementById('user-display-name')?.textContent || 'Guest User';
        card.innerHTML = `
          <span class="address-tag">${label.toUpperCase()}</span>
          <h4>${currentName}</h4>
          <p>${addressText}</p>
          <p>Phone: ${phoneText}</p>
          <div class="address-actions">
            <button type="button" class="text-btn">Edit</button>
          </div>
        `;
        grid.appendChild(card);

        const addrMetric = document.getElementById('metric-addresses-count');
        if (addrMetric) {
          const count = grid.querySelectorAll('.address-card').length;
          addrMetric.textContent = count;
        }

        showToast('📍 New address saved successfully!');
      }
    });
  }

  // Daily Streak / Reward Claim Handler
  const claimRewardBtn = document.getElementById('claim-reward-btn');
  if (claimRewardBtn) {
    claimRewardBtn.addEventListener('click', () => {
      if (claimRewardBtn.disabled) return;
      const currentBal = parseInt(localStorage.getItem('dm_wallet') || '250', 10);
      const newBal = currentBal + 20;
      localStorage.setItem('dm_wallet', newBal.toString());

      const balEl = document.getElementById('metric-wallet-balance');
      if (balEl) balEl.textContent = `₹${newBal}`;
      const wallHeading = document.getElementById('wallet-display-balance');
      if (wallHeading) wallHeading.textContent = `₹${newBal}`;

      claimRewardBtn.disabled = true;
      claimRewardBtn.textContent = '✓ Claimed Today!';
      claimRewardBtn.style.opacity = '0.7';

      showToast('🎁 Daily ₹20 Cashback credited to your DM Wallet!');
    });
  }
}

// Hook into app initialization
const origInit = initApp;
initApp = async function() {
  await origInit();
  await loadUserProfile();
  setupProfileTabs();
  setupLoginForm();
};

function setupLoginForm() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  const inputName = document.getElementById('login-name');
  const inputPhone = document.getElementById('login-phone');
  const inputEmail = document.getElementById('login-email');
  const inputAddress = document.getElementById('login-address');
  const quickFillBtn = document.getElementById('quick-fill-btn');

  // Load existing profile from storage if user is logged in
  const savedProfile = JSON.parse(localStorage.getItem('dm_profile')) || {};
  const isLoggedOut = localStorage.getItem('dm_logged_out') === 'true';
  if (!isLoggedOut && savedProfile && savedProfile.name && !savedProfile.isGuest) {
    if (inputName) inputName.value = savedProfile.name;
    if (inputPhone) inputPhone.value = savedProfile.phone || '';
    if (inputEmail) inputEmail.value = savedProfile.email || '';
    if (inputAddress) inputAddress.value = savedProfile.address || '';
  }

  // Quick fill button for testing
  if (quickFillBtn) {
    quickFillBtn.addEventListener('click', () => {
      if (inputName) inputName.value = 'Roshan Sahu';
      if (inputPhone) inputPhone.value = '9876543210';
      if (inputEmail) inputEmail.value = 'roshan.sahu@example.com';
      if (inputAddress) inputAddress.value = '123 Park Street, Sector 4, City';
      showToast('⚡ Sample profile details filled!');
    });
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = inputName ? inputName.value.trim() : '';
    const phone = inputPhone ? inputPhone.value.trim() : '';
    const email = inputEmail ? inputEmail.value.trim() : '';
    const address = inputAddress ? inputAddress.value.trim() : '';

    if (!name || !phone || !email || !address) {
      showToast('⚠️ Please fill out all fields (Name, Phone, Email, Address).');
      return;
    }

    const updatedProfile = {
      name,
      phone,
      email,
      address,
      joinedDate: 'September 2026',
      memberTier: 'DM Member',
      cashbackBalance: 0,
      isGuest: false
    };

    localStorage.removeItem('dm_logged_out');
    localStorage.setItem('dm_profile', JSON.stringify(updatedProfile));

    try {
      await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
      });
    } catch (err) {
      console.warn('Backend login endpoint sync skipped:', err);
    }

    updateProfileUI(updatedProfile);
    showToast(`🎉 Account created! Welcome, ${name}.`);

    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 1000);
  });
}

// Update initApp wrapper to include Admin Panel initialization
const prevInit = initApp;
initApp = async function() {
  await prevInit();
  if (document.querySelector('.admin-page') || document.getElementById('admin-products-table')) {
    initAdminPanel();
  }
};

// Admin Panel Logic
let adminState = {
  products: [],
  orders: [],
  categories: []
};

async function initAdminPanel() {
  setupAdminTabs();
  setupAdminForm();
  setupAdminSearch();
  setupEditModal();

  const refreshBtn = document.getElementById('refresh-admin-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      Promise.all([loadAdminProducts(), loadAdminOrders()]);
      showToast('🔄 Realtime admin data refreshed from Supabase!');
    });
  }

  await Promise.all([loadAdminProducts(), loadAdminOrders()]);
}

function setupAdminTabs() {
  const tabsNav = document.querySelector('.admin-tabs-nav');
  if (!tabsNav) return;

  tabsNav.addEventListener('click', (e) => {
    const btn = e.target.closest('.admin-tab-btn');
    if (!btn) return;

    document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const targetTab = btn.dataset.tab;
    document.querySelectorAll('.admin-tab-content').forEach(content => {
      if (content.id === `admin-tab-${targetTab}`) {
        content.classList.remove('hidden');
      } else {
        content.classList.add('hidden');
      }
    });
  });
}

async function loadAdminProducts() {
  const tbody = document.getElementById('admin-products-tbody');
  if (!tbody) return;

  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (res.ok) {
      const data = await res.json();
      adminState.products = data.products || fallbackProducts;
    } else {
      adminState.products = fallbackProducts;
    }
  } catch (err) {
    adminState.products = fallbackProducts;
  }

  updateAdminMetrics();
  renderAdminProductsTable(adminState.products);
  renderAdminCategoriesGrid();
}

function renderAdminProductsTable(prodsList) {
  const tbody = document.getElementById('admin-products-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (prodsList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 30px; color: var(--muted);">No matching products found.</td></tr>`;
    return;
  }

  prodsList.forEach(prod => {
    const tr = document.createElement('tr');
    
    const tagClass = (prod.tag || '').toLowerCase().replace(/\s+/g, '-');
    const badgeHTML = prod.tag ? `<span class="admin-badge-pill ${tagClass}">${prod.tag}</span>` : '<span style="color:var(--muted);">-</span>';

    const imgSrc = prod.image || 'frontend/images/parle_g.png';

    tr.innerHTML = `
      <td><img src="${imgSrc}" alt="${prod.name}" class="admin-prod-thumb" onerror="this.src='frontend/images/parle_g.png';" /></td>
      <td><code>${prod.id}</code></td>
      <td><strong>${prod.name}</strong></td>
      <td><span style="text-transform:capitalize;">${prod.categoryName || prod.category}</span></td>
      <td><strong>₹${prod.price}</strong></td>
      <td>${prod.unit || '-'}</td>
      <td>${badgeHTML}</td>
      <td>
        <div class="admin-actions-cell">
          <button type="button" class="admin-btn-sm admin-btn-edit" data-id="${prod.id}">✏️ Edit</button>
          <button type="button" class="admin-btn-sm admin-btn-delete" data-id="${prod.id}">🗑️ Delete</button>
        </div>
      </td>
    `;

    // Edit button click
    tr.querySelector('.admin-btn-edit').addEventListener('click', () => {
      openEditProductModal(prod);
    });

    // Delete button click
    tr.querySelector('.admin-btn-delete').addEventListener('click', async () => {
      if (confirm(`Are you sure you want to delete "${prod.name}"?`)) {
        await deleteProduct(prod.id);
      }
    });

    tbody.appendChild(tr);
  });
}

function setupAdminSearch() {
  const searchInput = document.getElementById('admin-catalog-search');
  const catFilter = document.getElementById('admin-catalog-category-filter');

  function filterCatalog() {
    const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const cat = catFilter ? catFilter.value : 'all';

    let filtered = [...adminState.products];

    if (cat !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === cat.toLowerCase());
    }

    if (q) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.tag && p.tag.toLowerCase().includes(q)) ||
        p.id.toLowerCase().includes(q)
      );
    }

    renderAdminProductsTable(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', filterCatalog);
  if (catFilter) catFilter.addEventListener('change', filterCatalog);
}

function setupAdminForm() {
  const form = document.getElementById('admin-add-product-form');
  if (!form) return;

  const triggerFileBtn = document.getElementById('trigger-file-btn');
  const fileInput = document.getElementById('prod-file-input');
  const imgUrlInput = document.getElementById('prod-image');
  const previewImg = document.getElementById('add-prod-preview-img');

  if (triggerFileBtn && fileInput) {
    triggerFileBtn.addEventListener('click', () => fileInput.click());
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          if (imgUrlInput) imgUrlInput.value = dataUrl;
          if (previewImg) previewImg.src = dataUrl;
          showToast(`📷 Image "${file.name}" selected & loaded!`);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (imgUrlInput && previewImg) {
    imgUrlInput.addEventListener('input', () => {
      previewImg.src = imgUrlInput.value || 'frontend/images/parle_g.png';
    });
  }

  // Preset chips click listener
  document.querySelectorAll('#admin-tab-add-product .img-preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const path = chip.dataset.img;
      if (imgUrlInput) imgUrlInput.value = path;
      if (previewImg) previewImg.src = path;
      showToast(`✨ Selected image preset: ${chip.textContent}`);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('prod-name').value.trim();
    const category = document.getElementById('prod-category').value;
    const price = parseInt(document.getElementById('prod-price').value, 10);
    const unit = document.getElementById('prod-unit').value.trim();
    const tag = document.getElementById('prod-tag').value;
    const color = document.getElementById('prod-color').value;
    const image = document.getElementById('prod-image').value.trim();
    const desc = document.getElementById('prod-desc').value.trim();

    if (!name || !price || !unit) {
      showToast('⚠️ Please fill out all required fields (Name, Price, Unit).');
      return;
    }

    const catObj = fallbackProducts.find(p => p.category === category);
    const categoryName = catObj ? catObj.categoryName : category;

    const newProdPayload = {
      name,
      category,
      categoryName,
      price,
      unit,
      tag,
      color,
      image: image || 'frontend/images/parle_g.png',
      desc
    };

    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProdPayload)
      });

      if (res.ok) {
        const data = await res.json();
        showToast(`🎉 Product "${name}" added successfully to Supabase & Store!`);
        form.reset();
        if (previewImg) previewImg.src = 'frontend/images/parle_g.png';
        await loadAdminProducts();
      } else {
        throw new Error('API server returned error');
      }
    } catch (err) {
      console.warn('API add product fallback:', err);
      // Offline fallback
      const localNew = { ...newProdPayload, id: 'p_' + Date.now() };
      fallbackProducts.unshift(localNew);
      showToast(`🎉 Product "${name}" added locally!`);
      form.reset();
      if (previewImg) previewImg.src = 'frontend/images/parle_g.png';
      loadAdminProducts();
    }
  });
}

async function deleteProduct(prodId) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${prodId}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      showToast(`🗑️ Product ${prodId} deleted successfully!`);
    }
  } catch (err) {
    console.warn('Backend delete product warning:', err);
  }

  adminState.products = adminState.products.filter(p => p.id !== prodId);
  renderAdminProductsTable(adminState.products);
  updateAdminMetrics();
}

function setupEditModal() {
  const modal = document.getElementById('edit-product-modal');
  const closeBtn = document.getElementById('close-edit-modal');
  const form = document.getElementById('admin-edit-product-form');

  const triggerEditFileBtn = document.getElementById('trigger-edit-file-btn');
  const editFileInput = document.getElementById('edit-prod-file-input');
  const editImgInput = document.getElementById('edit-prod-image');
  const editPreviewImg = document.getElementById('edit-prod-preview-img');

  if (triggerEditFileBtn && editFileInput) {
    triggerEditFileBtn.addEventListener('click', () => editFileInput.click());
  }

  if (editFileInput) {
    editFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          if (editImgInput) editImgInput.value = dataUrl;
          if (editPreviewImg) editPreviewImg.src = dataUrl;
          showToast(`📷 Image "${file.name}" loaded for edit!`);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (editImgInput && editPreviewImg) {
    editImgInput.addEventListener('input', () => {
      editPreviewImg.src = editImgInput.value || 'frontend/images/parle_g.png';
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  if (form && modal) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('edit-prod-id').value;
      const name = document.getElementById('edit-prod-name').value.trim();
      const category = document.getElementById('edit-prod-category').value;
      const price = parseInt(document.getElementById('edit-prod-price').value, 10);
      const unit = document.getElementById('edit-prod-unit').value.trim();
      const tag = document.getElementById('edit-prod-tag').value;
      const image = document.getElementById('edit-prod-image').value.trim();
      const desc = document.getElementById('edit-prod-desc').value.trim();

      const updatedPayload = { name, category, price, unit, tag, image, desc };

      try {
        await fetch(`${API_BASE_URL}/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPayload)
        });
      } catch (err) {
        console.warn('Backend edit product warning:', err);
      }

      modal.classList.add('hidden');
      showToast(`✏️ Product ${name} updated successfully!`);
      await loadAdminProducts();
    });
  }
}

function openEditProductModal(prod) {
  const modal = document.getElementById('edit-product-modal');
  if (!modal) return;

  document.getElementById('edit-prod-id').value = prod.id;
  document.getElementById('edit-prod-name').value = prod.name;
  document.getElementById('edit-prod-category').value = prod.category;
  document.getElementById('edit-prod-price').value = prod.price;
  document.getElementById('edit-prod-unit').value = prod.unit || '';
  document.getElementById('edit-prod-tag').value = prod.tag || '';
  document.getElementById('edit-prod-image').value = prod.image || '';
  document.getElementById('edit-prod-desc').value = prod.desc || '';

  const previewImg = document.getElementById('edit-prod-preview-img');
  if (previewImg) {
    previewImg.src = prod.image || 'frontend/images/parle_g.png';
  }

  modal.classList.remove('hidden');
}

async function loadAdminOrders() {
  const tbody = document.getElementById('admin-orders-tbody');
  if (!tbody) return;

  try {
    const res = await fetch(`${API_BASE_URL}/orders`);
    if (res.ok) {
      const data = await res.json();
      adminState.orders = data.orders || [];
    }
  } catch (err) {
    adminState.orders = JSON.parse(localStorage.getItem('dm_orders')) || [];
  }

  updateAdminMetrics();
  renderAdminOrdersTable(adminState.orders);
}

function renderAdminOrdersTable(ordersList) {
  const tbody = document.getElementById('admin-orders-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (ordersList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 30px; color: var(--muted);">No customer orders found.</td></tr>`;
    return;
  }

  ordersList.forEach(order => {
    const tr = document.createElement('tr');

    const formattedDate = new Date(order.date || Date.now()).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const custName = order.customer ? order.customer.name : 'Customer';
    const custPhone = order.customer ? order.customer.phone : '-';

    let itemsSummary = (order.items || []).map(i => `${i.name} (${i.quantity}x)`).join(', ');

    const statusOptions = ['Confirmed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'];

    let optionsHTML = statusOptions.map(st => 
      `<option value="${st}" ${order.status === st ? 'selected' : ''}>${st}</option>`
    ).join('');

    tr.innerHTML = `
      <td><strong>#${order.orderId}</strong></td>
      <td><small style="color:var(--muted);">${formattedDate}</small></td>
      <td>
        <strong>${custName}</strong>
        <small style="display:block; color:var(--muted);">${custPhone}</small>
      </td>
      <td><small style="display:block; max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${itemsSummary}</small></td>
      <td><small>${order.paymentMethod || 'Cash'}</small></td>
      <td><strong>₹${order.grandTotal}</strong></td>
      <td>
        <select class="admin-order-status-select" data-id="${order.orderId}">
          ${optionsHTML}
        </select>
      </td>
      <td>
        <button type="button" class="admin-btn-sm admin-btn-delete delete-order-btn" data-id="${order.orderId}">🗑️ Cancel</button>
      </td>
    `;

    // Status change listener
    const statusSelect = tr.querySelector('.admin-order-status-select');
    statusSelect.addEventListener('change', async (e) => {
      const newStatus = e.target.value;
      await updateOrderStatus(order.orderId, newStatus);
    });

    // Cancel/delete order listener
    const deleteBtn = tr.querySelector('.delete-order-btn');
    deleteBtn.addEventListener('click', async () => {
      if (confirm(`Cancel order #${order.orderId}?`)) {
        await cancelOrder(order.orderId);
      }
    });

    tbody.appendChild(tr);
  });
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    showToast(`⏱️ Order #${orderId} updated to "${newStatus}"!`);
  } catch (err) {
    console.warn('Backend order status update warning:', err);
  }
}

async function cancelOrder(orderId) {
  try {
    await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'DELETE'
    });
    showToast(`🗑️ Order #${orderId} cancelled.`);
    await loadAdminOrders();
  } catch (err) {
    console.warn('Backend cancel order warning:', err);
  }
}

function renderAdminCategoriesGrid() {
  const grid = document.getElementById('admin-categories-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const catList = [
    { id: 'dairy', name: 'Dairy & Cheese', icon: '🥛' },
    { id: 'bakery', name: 'Bakery & Bread', icon: '🍞' },
    { id: 'produce', name: 'Fruits & Veggies', icon: '🥦' },
    { id: 'chips', name: 'Chips & Snacks', icon: '🍿' },
    { id: 'biscuits', name: 'Biscuits & Cookies', icon: '🍪' },
    { id: 'instant', name: 'Noodles & Pasta', icon: '🍝' },
    { id: 'breakfast', name: 'Breakfast & Oats', icon: '🥣' },
    { id: 'drinks', name: 'Beverages & Soda', icon: '🥤' },
    { id: 'chocolates', name: 'Chocolates & Sweets', icon: '🍫' },
    { id: 'atta', name: 'Atta & Flours', icon: '🌾' },
    { id: 'rice', name: 'Rice & Grains', icon: '🍚' },
    { id: 'pulses', name: 'Dals & Pulses', icon: '🫘' },
    { id: 'oils', name: 'Oils & Ghee', icon: '🛢️' },
    { id: 'staples', name: 'Spices & Salt', icon: '🧂' }
  ];

  catList.forEach(c => {
    const count = adminState.products.filter(p => p.category === c.id).length;
    const card = document.createElement('div');
    card.className = 'admin-cat-card';
    card.innerHTML = `
      <div class="admin-cat-icon">${c.icon}</div>
      <div class="admin-cat-info">
        <strong>${c.name}</strong>
        <span>${count} product${count !== 1 ? 's' : ''}</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

function updateAdminMetrics() {
  const prodMetric = document.getElementById('admin-metric-products');
  const ordMetric = document.getElementById('admin-metric-orders');
  const revMetric = document.getElementById('admin-metric-revenue');

  if (prodMetric) prodMetric.textContent = adminState.products.length;
  if (ordMetric) ordMetric.textContent = adminState.orders.length;

  if (revMetric) {
    const totalRev = adminState.orders.reduce((acc, o) => acc + (o.grandTotal || 0), 0);
    revMetric.textContent = `₹${totalRev}`;
  }
}



