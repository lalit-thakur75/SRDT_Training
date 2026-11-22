/**
 * TRENDORA — ONLINE FASHION STORE
 * Pure Vanilla JavaScript (Clean, simple, modular & beginner-friendly)
 */

// ==========================================================================
// 1. PRODUCT DATABASE (100% ACCURATE IMAGE FILENAMES & FASHION CATALOG)
// All image filenames strictly match their visual content in image/ folder
// ==========================================================================
const PRODUCTS = [
    {
        id: 1,
        brand: 'ROADSTER',
        name: 'Men Pure Cotton Casual Checked Oxford Shirt',
        category: 'Men',
        price: 799,
        oldPrice: 1999,
        rating: 4.2,
        ratingCount: '2.4k',
        badge: 'BESTSELLER',
        image: 'p1-men-shirt.jpg',
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 2,
        brand: 'KALINI',
        name: 'Royal Peacock Blue & Gold Zari Silk Saree',
        category: 'Women',
        price: 1499,
        oldPrice: 3999,
        rating: 4.6,
        ratingCount: '2.1k',
        badge: 'FESTIVE EDIT',
        image: 'p1-women-saree.jpg',
        sizes: ['Free Size']
    },
    {
        id: 3,
        brand: 'DRESSBERRY',
        name: 'Blush Pink Floral Tiered A-Line Midi Dress',
        category: 'Women',
        price: 1199,
        oldPrice: 2499,
        rating: 4.5,
        ratingCount: '2.4k',
        badge: 'TRENDING',
        image: 'p2-women-dress.jpg',
        sizes: ['XS', 'S', 'M', 'L']
    },
    {
        id: 4,
        brand: 'HRX BY HRITHIK',
        name: 'Men Chunky Lifestyle Running Sneakers',
        category: 'Men',
        price: 1499,
        oldPrice: 3499,
        rating: 4.3,
        ratingCount: '3.1k',
        badge: 'HOT DEAL',
        image: 'p3-men-sneakers.jpg',
        sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10']
    },
    {
        id: 5,
        brand: 'ANOUK',
        name: 'Pastel Mint Green Embroidered Kurta Set',
        category: 'Women',
        price: 1399,
        oldPrice: 3299,
        rating: 4.5,
        ratingCount: '980',
        badge: 'BESTSELLER',
        image: 'p4-women-kurta.jpg',
        sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
        id: 6,
        brand: 'HIGHLANDER',
        name: 'Men Washed Classic Denim Trucker Jacket',
        category: 'Men',
        price: 1699,
        oldPrice: 3999,
        rating: 4.4,
        ratingCount: '1.2k',
        badge: 'HOT TREND',
        image: 'p5-men-jacket.jpg',
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 7,
        brand: 'ROADSTER JEANS',
        name: 'Men Washed Slim Fit Casual Denim Jeans',
        category: 'Men',
        price: 1299,
        oldPrice: 2799,
        rating: 4.2,
        ratingCount: '850',
        badge: 'SUPER SAVER',
        image: 'p5-men-jeans.jpg',
        sizes: ['30', '32', '34', '36']
    },
    {
        id: 8,
        brand: 'ROADSTER WOMAN',
        name: 'Women Cropped Light-Wash Denim Trucker Jacket',
        category: 'Women',
        price: 1599,
        oldPrice: 3499,
        rating: 4.4,
        ratingCount: '1.1k',
        badge: 'TRENDING',
        image: 'p5-women-jacket.jpg',
        sizes: ['XS', 'S', 'M', 'L']
    },
    {
        id: 9,
        brand: 'DERMA GLOW',
        name: '10% Vitamin C Radiant Face Glow Serum (30ml)',
        category: 'Beauty',
        price: 549,
        oldPrice: 999,
        rating: 4.7,
        ratingCount: '4.5k',
        badge: 'TOP RATED',
        image: 'p6-beauty-serum.jpg',
        sizes: ['30 ml']
    },
    {
        id: 10,
        brand: 'BOBBI GLOW',
        name: 'Professional Nude Eyeshadow & Cheek Makeup Palette',
        category: 'Beauty',
        price: 899,
        oldPrice: 1899,
        rating: 4.6,
        ratingCount: '1.7k',
        badge: 'BESTSELLER',
        image: 'p6-beauty-makeup.jpg',
        sizes: ['Universal']
    },
    {
        id: 11,
        brand: 'MANGO',
        name: 'Structured Cognac Tan Faux-Leather Shoulder Tote',
        category: 'Women',
        price: 1899,
        oldPrice: 3899,
        rating: 4.5,
        ratingCount: '820',
        badge: 'LUXE EDIT',
        image: 'p7-women-handbag.jpg',
        sizes: ['Regular']
    },
    {
        id: 12,
        brand: 'FOSSIL',
        name: 'Men Chronograph Brown Leather Strap Analog Watch',
        category: 'Men',
        price: 2499,
        oldPrice: 5995,
        rating: 4.8,
        ratingCount: '2.8k',
        badge: 'PREMIUM',
        image: 'p8-men-watch.jpg',
        sizes: ['Free Size']
    },
    {
        id: 13,
        brand: 'AURELIE',
        name: 'Women Minimalist Rose-Gold Mesh Strap Watch',
        category: 'Women',
        price: 1999,
        oldPrice: 4599,
        rating: 4.7,
        ratingCount: '1.6k',
        badge: 'ELEGANCE',
        image: 'p8-women-watch.jpg',
        sizes: ['Free Size']
    },
    {
        id: 14,
        brand: 'CARLTON LONDON',
        name: 'Rose Gold Strappy Block Heel Evening Sandals',
        category: 'Women',
        price: 1299,
        oldPrice: 2990,
        rating: 4.3,
        ratingCount: '640',
        badge: 'STYLISH',
        image: 'p9-women-heels.jpg',
        sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7']
    },
    {
        id: 15,
        brand: 'MAST & HARBOUR',
        name: 'Men Heavyweight Cotton Graphic Streetwear Tee',
        category: 'Men',
        price: 649,
        oldPrice: 1499,
        rating: 4.3,
        ratingCount: '1.9k',
        badge: 'NEW ARRIVAL',
        image: 'p10-men-tshirt.jpg',
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 16,
        brand: 'ONLY',
        name: 'Terracotta Rust Ribbed Knit Square Neck Crop Top',
        category: 'Women',
        price: 649,
        oldPrice: 1399,
        rating: 4.3,
        ratingCount: '1.1k',
        badge: 'TRENDING',
        image: 'p11-women-top.jpg',
        sizes: ['XS', 'S', 'M', 'L']
    },
    {
        id: 17,
        brand: 'DRESSBERRY',
        name: 'Women Pastel Chunky Lifestyle White & Blush Sneakers',
        category: 'Women',
        price: 1399,
        oldPrice: 2999,
        rating: 4.4,
        ratingCount: '780',
        badge: 'TRENDING',
        image: 'p13-women-sneakers.jpg',
        sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7']
    },
    {
        id: 18,
        brand: 'VINCENZO',
        name: 'Polarized Retro Round Metal Frame Sunglasses',
        category: 'Accessories',
        price: 849,
        oldPrice: 2199,
        rating: 4.5,
        ratingCount: '1.4k',
        badge: 'HOT',
        image: 'p12-sunglasses.jpg',
        sizes: ['Universal']
    }
];

// ==========================================================================
// 2. STATE MANAGEMENT & LOCAL STORAGE
// ==========================================================================
let cart = JSON.parse(localStorage.getItem('trendora_cart')) || [];
let wishlist = new Set(JSON.parse(localStorage.getItem('trendora_wishlist')) || []);
let activeCategory = 'All';
let searchQuery = '';
let currentSort = 'recommended';
let appliedCoupon = null;
let toastTimeout = null;

// Currency & discount helpers
const formatPrice = (amount) => 'Rs. ' + amount.toLocaleString('en-IN');
const calculateDiscount = (price, oldPrice) => Math.round(((oldPrice - price) / oldPrice) * 100);

// Save persistent cart & wishlist to LocalStorage
function saveState() {
    localStorage.setItem('trendora_cart', JSON.stringify(cart));
    localStorage.setItem('trendora_wishlist', JSON.stringify(Array.from(wishlist)));
}

// ==========================================================================
// 3. TOAST NOTIFICATION UTILITY
// ==========================================================================
function showToast(message) {
    const toast = document.getElementById('toastSnackbar');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2400);
}

// Copy Coupon Code Helper
function copyCouponCode(code) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
            showToast(`Coupon code ${code} copied!`);
        }).catch(() => {
            showToast(`Coupon code is: ${code}`);
        });
    } else {
        showToast(`Coupon code is: ${code}`);
    }
}

// ==========================================================================
// 4. PRODUCT CATALOG RENDERING & FILTERING
// ==========================================================================
function getFilteredAndSortedProducts() {
    let list = PRODUCTS.filter(product => {
        let matchesCategory = false;
        if (activeCategory === 'All') {
            matchesCategory = true;
        } else if (activeCategory === 'Men') {
            matchesCategory = product.category === 'Men';
        } else if (activeCategory === 'Women') {
            matchesCategory = product.category === 'Women';
        } else if (activeCategory === 'Footwear') {
            matchesCategory = product.image.includes('sneakers') || product.image.includes('heels');
        } else if (activeCategory === 'Accessories') {
            matchesCategory = product.category === 'Accessories' || product.image.includes('watch') || product.image.includes('handbag') || product.image.includes('sunglasses');
        } else if (activeCategory === 'Beauty') {
            matchesCategory = product.category === 'Beauty';
        } else {
            matchesCategory = product.category === activeCategory;
        }

        const matchesSearch = (product.name + ' ' + product.brand + ' ' + product.category)
            .toLowerCase()
            .includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    if (currentSort === 'price-low') {
        list.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
        list.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'discount') {
        list.sort((a, b) => calculateDiscount(b.price, b.oldPrice) - calculateDiscount(a.price, a.oldPrice));
    } else if (currentSort === 'rating') {
        list.sort((a, b) => b.rating - a.rating);
    }

    return list;
}

function renderProducts() {
    const grid = document.getElementById('productGrid');
    const emptyState = document.getElementById('emptyState');
    const countBadge = document.getElementById('productCountBadge');
    const sectionTitle = document.getElementById('productsSectionTitle');

    if (!grid) return;

    const filtered = getFilteredAndSortedProducts();

    // Update section title & count badge
    if (sectionTitle) {
        if (activeCategory === 'All') {
            sectionTitle.textContent = 'TRENDING NOW';
        } else if (activeCategory === 'Men') {
            sectionTitle.textContent = "MEN'S COLLECTION";
        } else if (activeCategory === 'Women') {
            sectionTitle.textContent = "WOMEN'S COLLECTION";
        } else {
            sectionTitle.textContent = `${activeCategory.toUpperCase()} COLLECTION`;
        }
    }
    if (countBadge) {
        countBadge.textContent = `${filtered.length} Styles Available`;
    }

    if (filtered.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.hidden = false;
        return;
    }

    if (emptyState) emptyState.hidden = true;

    // Render cards using modern CSS Flexbox inside each CSS Grid cell
    grid.innerHTML = filtered.map(product => {
        const isWishlisted = wishlist.has(product.id);
        const discountPct = calculateDiscount(product.price, product.oldPrice);

        return `
            <article class="product-card" data-product-id="${product.id}">
                <!-- Card Media Container with Quick View Trigger -->
                <div class="card-media" onclick="openQuickView(${product.id})">
                    <img src="image/${product.image}" alt="${product.name}" loading="lazy">
                    
                    <span class="tag-badge">${product.badge}</span>
                    
                    <!-- [CSS FLEXBOX] Rating Badge on bottom-left of image -->
                    <div class="rating-pill">
                        <span>${product.rating}</span>
                        <span class="rating-star">★</span>
                        <span class="rating-count">${product.ratingCount}</span>
                    </div>

                    <!-- Top-Right Wishlist Heart Button -->
                    <button 
                        class="wishlist-icon-btn ${isWishlisted ? 'active' : ''}" 
                        data-wishlist="${product.id}"
                        aria-label="Wishlist item"
                        onclick="event.stopPropagation(); toggleWishlist(${product.id});"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>

                <!-- [CSS FLEXBOX] Card Details -->
                <div class="card-details">
                    <h3 class="card-brand">${product.brand}</h3>
                    <p class="card-title" title="${product.name}">${product.name}</p>
                    
                    <!-- [CSS FLEXBOX] Pricing Row -->
                    <div class="card-price-row">
                        <span class="current-price">${formatPrice(product.price)}</span>
                        <span class="original-price">${formatPrice(product.oldPrice)}</span>
                        <span class="discount-percent">(${discountPct}% OFF)</span>
                    </div>

                    <!-- [CSS FLEXBOX] Hover Action Row -->
                    <div class="card-hover-actions">
                        <div class="sizes-row">
                            <span>Sizes:</span>
                            ${product.sizes.map(s => `<span class="size-pill">${s}</span>`).join('')}
                        </div>
                        <button class="btn-add-bag" onclick="handleQuickAdd(${product.id})">
                            + ADD TO BAG
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

// Category filter switcher
function setCategory(categoryName) {
    activeCategory = categoryName;

    // Update Header Navigation Active State
    document.querySelectorAll('#mainNav .nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.category === activeCategory);
    });

    // Update Category Chips Active State
    document.querySelectorAll('#filterChips .chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.filter === activeCategory);
    });

    renderProducts();
}

// ==========================================================================
// 5. WISHLIST MANAGEMENT
// ==========================================================================
function toggleWishlist(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    if (wishlist.has(productId)) {
        wishlist.delete(productId);
        showToast(`Removed "${product.name.slice(0, 24)}..." from Wishlist`);
    } else {
        wishlist.add(productId);
        showToast(`Added "${product.name.slice(0, 24)}..." to Wishlist ♡`);
    }

    saveState();
    updateWishlistUI();
    renderProducts();
}

function updateWishlistUI() {
    const badge = document.getElementById('wishlistCount');
    const drawerCount = document.getElementById('drawerWishlistCount');
    const listContainer = document.getElementById('wishlistItemsList');

    if (badge) badge.textContent = wishlist.size;
    if (drawerCount) drawerCount.textContent = `(${wishlist.size} items)`;

    if (!listContainer) return;

    if (wishlist.size === 0) {
        listContainer.innerHTML = `
            <div class="drawer-empty">
                <div class="drawer-empty-icon">♡</div>
                <h4>Your Wishlist is Empty</h4>
                <p>Explore items and tap the heart icon to save what you love.</p>
            </div>
        `;
        return;
    }

    const items = PRODUCTS.filter(p => wishlist.has(p.id));
    listContainer.innerHTML = items.map(product => `
        <div class="cart-item">
            <div class="cart-item-img">
                <img src="image/${product.image}" alt="${product.name}">
            </div>
            <div class="cart-item-info">
                <div>
                    <div class="cart-item-brand">${product.brand}</div>
                    <div class="cart-item-name">${product.name}</div>
                    <div class="cart-item-price">
                        <strong>${formatPrice(product.price)}</strong>
                        <span class="original-price">${formatPrice(product.oldPrice)}</span>
                    </div>
                </div>
                <div style="margin-top: 10px; display: flex; gap: 8px;">
                    <button class="btn-primary-sm" onclick="moveWishlistToBag(${product.id})">MOVE TO BAG</button>
                    <button class="store-badge" onclick="toggleWishlist(${product.id})">REMOVE</button>
                </div>
            </div>
        </div>
    `).join('');
}

function moveWishlistToBag(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    addToCart(productId, product.sizes[0]);
    toggleWishlist(productId);
    openCartDrawer();
}

// ==========================================================================
// 6. CART / BAG MANAGEMENT
// ==========================================================================
function addToCart(productId, size = null) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const chosenSize = size || product.sizes[0];
    const existingIndex = cart.findIndex(item => item.id === productId && item.size === chosenSize);

    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push({
            id: productId,
            size: chosenSize,
            qty: 1
        });
    }

    saveState();
    updateCartUI();
    showToast(`Added ${product.brand} (${chosenSize}) to your bag 🛍️`);
}

function handleQuickAdd(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    addToCart(productId, product.sizes[0]);
    openCartDrawer();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveState();
    updateCartUI();
    showToast('Item removed from your bag');
}

function updateCartQty(index, change) {
    if (!cart[index]) return;
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        removeFromCart(index);
        return;
    }
    saveState();
    updateCartUI();
}

function updateCartUI() {
    const countBadge = document.getElementById('cartCount');
    const drawerCount = document.getElementById('drawerCartCount');
    const itemsList = document.getElementById('cartItemsList');
    const cartFooter = document.getElementById('cartFooter');

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (countBadge) countBadge.textContent = totalQty;
    if (drawerCount) drawerCount.textContent = `(${totalQty} items)`;

    if (!itemsList) return;

    if (cart.length === 0) {
        itemsList.innerHTML = `
            <div class="drawer-empty">
                <div class="drawer-empty-icon">🛍️</div>
                <h4>Your Bag is Empty</h4>
                <p>There is nothing in your bag. Let's add some items!</p>
            </div>
        `;
        if (cartFooter) cartFooter.hidden = true;
        return;
    }

    if (cartFooter) cartFooter.hidden = false;

    // Render Items
    itemsList.innerHTML = cart.map((item, index) => {
        const product = PRODUCTS.find(p => p.id === item.id);
        if (!product) return '';

        return `
            <div class="cart-item">
                <div class="cart-item-img">
                    <img src="image/${product.image}" alt="${product.name}">
                </div>
                <div class="cart-item-info">
                    <div>
                        <div class="cart-item-brand">${product.brand}</div>
                        <div class="cart-item-name">${product.name}</div>
                        <div class="cart-item-meta">Size: <b>${item.size}</b></div>
                        <div class="cart-item-price">
                            <strong>${formatPrice(product.price)}</strong>
                            <span class="original-price">${formatPrice(product.oldPrice)}</span>
                        </div>
                    </div>
                    <div class="cart-qty-row">
                        <div class="qty-control">
                            <button class="qty-btn" onclick="updateCartQty(${index}, -1)">-</button>
                            <span class="qty-val">${item.qty}</span>
                            <button class="qty-btn" onclick="updateCartQty(${index}, 1)">+</button>
                        </div>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})" title="Remove item">✕</button>
            </div>
        `;
    }).join('');

    // Calculate Price Breakdown
    let totalMrp = 0;
    let sellingTotal = 0;

    cart.forEach(item => {
        const product = PRODUCTS.find(p => p.id === item.id);
        if (product) {
            totalMrp += product.oldPrice * item.qty;
            sellingTotal += product.price * item.qty;
        }
    });

    const discountOnMrp = totalMrp - sellingTotal;
    let couponDiscount = 0;

    if (appliedCoupon && sellingTotal >= 1999) {
        couponDiscount = appliedCoupon.discount;
        document.getElementById('billCouponRow').hidden = false;
        document.getElementById('billCoupon').textContent = `- ${formatPrice(couponDiscount)}`;
    } else {
        document.getElementById('billCouponRow').hidden = true;
    }

    const finalPayable = Math.max(0, sellingTotal - couponDiscount);

    document.getElementById('billTotalMrp').textContent = formatPrice(totalMrp);
    document.getElementById('billDiscount').textContent = `- ${formatPrice(discountOnMrp)}`;
    document.getElementById('billFinalTotal').textContent = formatPrice(finalPayable);
}

// Coupon Logic
function applyCoupon() {
    const input = document.getElementById('couponInput');
    const code = input.value.trim().toUpperCase();

    if (!code) {
        showToast('Please enter a coupon code');
        return;
    }

    let sellingTotal = 0;
    cart.forEach(item => {
        const product = PRODUCTS.find(p => p.id === item.id);
        if (product) sellingTotal += product.price * item.qty;
    });

    if (code === 'TREND500') {
        if (sellingTotal < 1999) {
            showToast('Minimum order value for TREND500 is Rs. 1,999');
            return;
        }
        appliedCoupon = { code: 'TREND500', discount: 500 };
        document.getElementById('appliedCouponTag').hidden = false;
        input.value = '';
        updateCartUI();
        showToast('Coupon TREND500 applied successfully! Saved Rs. 500 🎉');
    } else {
        showToast('Invalid coupon code. Try TREND500');
    }
}

function removeCoupon() {
    appliedCoupon = null;
    document.getElementById('appliedCouponTag').hidden = true;
    updateCartUI();
    showToast('Coupon removed');
}

// Checkout simulation
function handleCheckout() {
    if (cart.length === 0) {
        showToast('Your bag is empty!');
        return;
    }

    closeCartDrawer();

    const orderId = 'TRN' + Math.floor(100000 + Math.random() * 900000);
    const totalAmount = document.getElementById('billFinalTotal').textContent;
    const itemsCount = cart.reduce((sum, i) => sum + i.qty, 0);

    const detailsBox = document.getElementById('successOrderDetails');
    if (detailsBox) {
        detailsBox.innerHTML = `
            <div><b>Order ID:</b> #${orderId}</div>
            <div><b>Total Paid:</b> ${totalAmount}</div>
            <div><b>Items Count:</b> ${itemsCount} items</div>
            <div><b>Payment:</b> Cash on Delivery / Prepaid Verified</div>
            <div><b>Delivery Address:</b> Standard Express Shipping (2-3 Days)</div>
        `;
    }

    document.getElementById('orderSuccessBackdrop').classList.add('active');
    document.getElementById('orderSuccessModal').classList.add('active');

    // Reset Cart
    cart = [];
    appliedCoupon = null;
    document.getElementById('appliedCouponTag').hidden = true;
    saveState();
    updateCartUI();
}

// ==========================================================================
// 7. QUICK VIEW MODAL
// ==========================================================================
function openQuickView(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    let selectedSize = product.sizes[0];
    const discountPct = calculateDiscount(product.price, product.oldPrice);

    const container = document.getElementById('quickViewContent');
    if (!container) return;

    container.innerHTML = `
        <div class="quickview-body">
            <div class="qv-media">
                <img src="image/${product.image}" alt="${product.name}">
            </div>
            <div class="qv-info">
                <span class="tag-badge" style="position: static; display: inline-block; width: fit-content; margin-bottom: 8px;">${product.badge}</span>
                <h3 class="qv-brand">${product.brand}</h3>
                <p class="qv-name">${product.name}</p>

                <div class="qv-price-box">
                    <span class="qv-price">${formatPrice(product.price)}</span>
                    <span class="qv-old">${formatPrice(product.oldPrice)}</span>
                    <span class="qv-off">${discountPct}% OFF</span>
                </div>

                <div class="qv-sizes-title">SELECT SIZE</div>
                <div class="qv-size-selector" id="qvSizeSelector">
                    ${product.sizes.map((s, idx) => `
                        <button class="qv-size-btn ${idx === 0 ? 'selected' : ''}" data-size="${s}">${s}</button>
                    `).join('')}
                </div>

                <div class="qv-pincode-box">
                    <span>📍 <b>Check Delivery:</b> Enter 6-digit Pincode</span>
                    <div style="display: flex; gap: 8px; margin-top: 6px;">
                        <input type="text" maxlength="6" placeholder="e.g. 110001" style="padding: 6px 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; width: 120px;" id="pincodeInput">
                        <button class="store-badge" onclick="checkPincode()">CHECK</button>
                    </div>
                    <small id="pincodeMsg" style="color: #03a685; display: block; margin-top: 4px;"></small>
                </div>

                <div style="display: flex; gap: 12px; margin-top: auto;">
                    <button class="btn-primary" style="flex: 1; justify-content: center;" id="qvAddBagBtn">
                        🛍️ ADD TO BAG
                    </button>
                    <button class="btn-secondary" style="color: var(--dark); border-color: var(--border-color);" onclick="toggleWishlist(${product.id})">
                        ♡ WISHLIST
                    </button>
                </div>
            </div>
        </div>
    `;

    // Size Selection Handler
    const sizeBtns = container.querySelectorAll('.qv-size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedSize = btn.dataset.size;
        });
    });

    // Add to bag from quick view
    document.getElementById('qvAddBagBtn').addEventListener('click', () => {
        addToCart(product.id, selectedSize);
        closeQuickView();
        openCartDrawer();
    });

    document.getElementById('quickViewBackdrop').classList.add('active');
    document.getElementById('quickViewModal').classList.add('active');
}

function checkPincode() {
    const input = document.getElementById('pincodeInput');
    const msg = document.getElementById('pincodeMsg');
    if (input.value.length === 6 && /^\d+$/.test(input.value)) {
        msg.textContent = '✓ Express delivery available within 48 hours!';
        msg.style.color = '#03a685';
    } else {
        msg.textContent = 'Please enter a valid 6-digit postal code';
        msg.style.color = '#ff3f6c';
    }
}

function closeQuickView() {
    document.getElementById('quickViewBackdrop').classList.remove('active');
    document.getElementById('quickViewModal').classList.remove('active');
}

// ==========================================================================
// 8. DRAWER CONTROLS (CART & WISHLIST)
// ==========================================================================
function openCartDrawer() {
    document.getElementById('cartBackdrop').classList.add('active');
    document.getElementById('cartDrawer').classList.add('active');
    updateCartUI();
}

function closeCartDrawer() {
    document.getElementById('cartBackdrop').classList.remove('active');
    document.getElementById('cartDrawer').classList.remove('active');
}

function openWishlistDrawer() {
    document.getElementById('wishlistBackdrop').classList.add('active');
    document.getElementById('wishlistDrawer').classList.add('active');
    updateWishlistUI();
}

function closeWishlistDrawer() {
    document.getElementById('wishlistBackdrop').classList.remove('active');
    document.getElementById('wishlistDrawer').classList.remove('active');
}

// ==========================================================================
// 9. HERO CAROUSEL CONTROLLER
// ==========================================================================
let currentHeroSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.slider-dots .dot');

function showHeroSlide(index) {
    if (!slides.length) return;
    slides.forEach((s, idx) => s.classList.toggle('active', idx === index));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === index));
    currentHeroSlide = index;
}

function nextHeroSlide() {
    if (!slides.length) return;
    const next = (currentHeroSlide + 1) % slides.length;
    showHeroSlide(next);
}

function prevHeroSlide() {
    if (!slides.length) return;
    const prev = (currentHeroSlide - 1 + slides.length) % slides.length;
    showHeroSlide(prev);
}

// Auto slide every 6 seconds
let heroInterval = setInterval(nextHeroSlide, 6000);

// ==========================================================================
// 10. EVENT LISTENERS SETUP
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Initial Render
    renderProducts();
    updateCartUI();
    updateWishlistUI();

    // Search Input
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClearBtn');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            if (searchClear) searchClear.classList.toggle('visible', searchQuery.length > 0);
            renderProducts();
        });
    }

    if (searchClear) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchQuery = '';
            searchClear.classList.remove('visible');
            renderProducts();
            searchInput.focus();
        });
    }

    // Keyboard shortcut Ctrl+K / Cmd+K for search
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (searchInput) searchInput.focus();
        }
        if (e.key === 'Escape') {
            closeCartDrawer();
            closeWishlistDrawer();
            closeQuickView();
            document.getElementById('orderSuccessBackdrop').classList.remove('active');
            document.getElementById('orderSuccessModal').classList.remove('active');
        }
    });

    // Sort Dropdown
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderProducts();
        });
    }

    // Navigation Category Clicks
    document.querySelectorAll('#mainNav .nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (item.dataset.category) {
                setCategory(item.dataset.category);
            }
            document.getElementById('mainNav').classList.remove('open');
        });
    });

    // Mobile Hamburger
    const mobileBtn = document.getElementById('mobileMenuBtn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            document.getElementById('mainNav').classList.toggle('open');
        });
    }

    // Filter Chips
    document.querySelectorAll('#filterChips .chip').forEach(chip => {
        chip.addEventListener('click', () => {
            setCategory(chip.dataset.filter);
        });
    });

    // Category Card Clicks
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            setCategory(card.dataset.category);
            const prodEl = document.getElementById('products');
            if (prodEl) prodEl.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Cart Drawer Triggers
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartBackdrop = document.getElementById('cartBackdrop');
    if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
    if (cartBackdrop) cartBackdrop.addEventListener('click', closeCartDrawer);

    // Wishlist Drawer Triggers
    const wishlistBtn = document.getElementById('wishlistBtn');
    const closeWishlistBtn = document.getElementById('closeWishlistBtn');
    const wishlistBackdrop = document.getElementById('wishlistBackdrop');
    const openWishlistFromMenu = document.getElementById('openWishlistFromMenu');
    if (wishlistBtn) wishlistBtn.addEventListener('click', openWishlistDrawer);
    if (closeWishlistBtn) closeWishlistBtn.addEventListener('click', closeWishlistDrawer);
    if (wishlistBackdrop) wishlistBackdrop.addEventListener('click', closeWishlistDrawer);
    if (openWishlistFromMenu) openWishlistFromMenu.addEventListener('click', openWishlistDrawer);

    // Quick View Triggers
    const closeQuickViewBtn = document.getElementById('closeQuickViewBtn');
    const quickViewBackdrop = document.getElementById('quickViewBackdrop');
    if (closeQuickViewBtn) closeQuickViewBtn.addEventListener('click', closeQuickView);
    if (quickViewBackdrop) quickViewBackdrop.addEventListener('click', closeQuickView);

    // Coupon Triggers
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    const removeCouponBtn = document.getElementById('removeCouponBtn');
    if (applyCouponBtn) applyCouponBtn.addEventListener('click', applyCoupon);
    if (removeCouponBtn) removeCouponBtn.addEventListener('click', removeCoupon);

    // Checkout Trigger
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);

    // Order Success Continue Shopping
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', () => {
            document.getElementById('orderSuccessBackdrop').classList.remove('active');
            document.getElementById('orderSuccessModal').classList.remove('active');
        });
    }

    // Reset Filter Button
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            searchQuery = '';
            if (searchClear) searchClear.classList.remove('visible');
            setCategory('All');
        });
    }

    // Hero Slider Controls
    const sliderNext = document.getElementById('sliderNext');
    const sliderPrev = document.getElementById('sliderPrev');
    if (sliderNext) {
        sliderNext.addEventListener('click', () => {
            clearInterval(heroInterval);
            nextHeroSlide();
            heroInterval = setInterval(nextHeroSlide, 6000);
        });
    }
    if (sliderPrev) {
        sliderPrev.addEventListener('click', () => {
            clearInterval(heroInterval);
            prevHeroSlide();
            heroInterval = setInterval(nextHeroSlide, 6000);
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            clearInterval(heroInterval);
            showHeroSlide(Number(dot.dataset.slide));
            heroInterval = setInterval(nextHeroSlide, 6000);
        });
    });
});
