// Edit this list to change the products shown on the page.
const products = [
    {
        id: 1,
        brand: 'SAGE & SOUL',
        name: 'The Sunday Linen Shirt',
        category: 'Women',
        price: 1499,
        old: 2499,
        badge: 'BESTSELLER',
        image: 'product-shirt.svg'
    },
    {
        id: 2,
        brand: 'FORM & FABLE',
        name: 'Everyday Knit Polo',
        category: 'Men',
        price: 1199,
        old: 1899,
        badge: 'TRENDING',
        image: 'product-polo.svg'
    },
    {
        id: 3,
        brand: 'MELLOW SKIN',
        name: 'Cloud Nine Glow Set',
        category: 'Beauty',
        price: 899,
        old: 1299,
        badge: 'GLOW PICK',
        image: 'product-beauty.svg'
    },
    {
        id: 4,
        brand: 'CASA GOOD',
        name: 'Sunday Morning Cushion',
        category: 'Home',
        price: 799,
        old: 1199,
        badge: 'JUST IN',
        image: 'product-cushion.svg'
    },
    {
        id: 5,
        brand: 'SAGE & SOUL',
        name: 'The Easy Days Midi Dress',
        category: 'Women',
        price: 1899,
        old: 2999,
        badge: 'JUST IN',
        image: 'product-dress.svg'
    },
    {
        id: 6,
        brand: 'FORM & FABLE',
        name: 'The Weekend Overshirt',
        category: 'Men',
        price: 1699,
        old: 2499,
        badge: 'GOOD FIND',
        image: 'product-overshirt.svg'
    },
    {
        id: 7,
        brand: 'MELLOW SKIN',
        name: 'Dew Drop Lip & Cheek Tint',
        category: 'Beauty',
        price: 599,
        old: 899,
        badge: 'LOVED',
        image: 'product-tint.svg'
    },
    {
        id: 8,
        brand: 'CASA GOOD',
        name: 'Little Sunday Table Lamp',
        category: 'Home',
        price: 1399,
        old: 2199,
        badge: 'DESIGN PICK',
        image: 'product-lamp.svg'
    }
];

let category = 'All';
let query = '';
let cart = 0;
const liked = new Set();
const grid = document.getElementById('grid');
const toast = document.getElementById('toast');
let timer;

const money = amount => '₹' + amount.toLocaleString('en-IN');

function say(text) {
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 2000);
}

function render() {
    const list = products.filter(product =>
        (category === 'All' || product.category === category)
        && (product.name + ' ' + product.brand + ' ' + product.category)
            .toLowerCase()
            .includes(query)
    );

    grid.innerHTML = list.map(product => `
        <article class="card">
            <div class="pic">
                <img src="images/${product.image}" alt="${product.name}" loading="lazy">
                <span class="badge">${product.badge}</span>
                <button
                    class="heart ${liked.has(product.id) ? 'liked' : ''}"
                    data-like="${product.id}"
                    aria-label="Toggle wishlist"
                >${liked.has(product.id) ? '♥' : '♡'}</button>
            </div>
            <div class="info">
                <p class="brand">${product.brand}</p>
                <p class="name">${product.name}</p>
                <div class="bottom">
                    <div>
                        <span class="price">${money(product.price)}</span>
                        <span class="old">${money(product.old)}</span>
                        <span class="off">${Math.round((1 - product.price / product.old) * 100)}% OFF</span>
                    </div>
                    <button class="add" data-add="${product.id}">+ BAG</button>
                </div>
            </div>
        </article>
    `).join('');

    grid.hidden = !list.length;
    document.getElementById('empty').hidden = !!list.length;
    document.getElementById('results').textContent = query
        ? `${list.length} styles found for “${query}”.`
        : category === 'All'
            ? "A few things we think you'll love."
            : `A little edit for ${category.toLowerCase()}.`;
}

function setCategory(nextCategory) {
    category = nextCategory;
    document.querySelectorAll('[data-filter]').forEach(button => {
        button.classList.toggle('active', button.dataset.filter === category);
    });
    render();
}

grid.addEventListener('click', event => {
    if (!(event.target instanceof Element)) {
        return;
    }

    const heart = event.target.closest('[data-like]');
    if (heart) {
        const id = Number(heart.dataset.like);
        if (liked.has(id)) {
            liked.delete(id);
            say('Removed from your wishlist');
        } else {
            liked.add(id);
            say('Saved to your wishlist ♡');
        }
        render();
        return;
    }

    const add = event.target.closest('[data-add]');
    if (add) {
        const product = products.find(item => item.id === Number(add.dataset.add));
        if (product) {
            cart += 1;
            document.getElementById('count').textContent = cart;
            say(product.name + ' added to your bag');
        }
    }
});

document.getElementById('search').addEventListener('input', event => {
    query = event.target.value.trim().toLowerCase();
    render();
});

document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => setCategory(button.dataset.filter));
});

document.querySelectorAll('[data-category]').forEach(button => {
    button.addEventListener('click', () => {
        setCategory(button.dataset.category);
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
});

document.querySelectorAll('[data-nav]').forEach(button => {
    button.addEventListener('click', () => {
        setCategory(button.dataset.nav);
        document.getElementById('nav').classList.remove('open');
    });
});

document.getElementById('menu').addEventListener('click', () => {
    document.getElementById('nav').classList.toggle('open');
});

document.getElementById('clear').addEventListener('click', () => {
    query = '';
    document.getElementById('search').value = '';
    setCategory('All');
});

document.getElementById('wishShort').addEventListener('click', () => {
    say(liked.size
        ? `${liked.size} styles saved to your wishlist`
        : 'Tap a heart to save a style you love ♡');
});

document.getElementById('bagShort').addEventListener('click', () => {
    say(cart ? `Your bag has ${cart} items` : 'Your bag is waiting for something good');
});

document.getElementById('profile').addEventListener('click', () => {
    say('Your style story starts here ✨');
});

document.getElementById('signup').addEventListener('submit', event => {
    event.preventDefault();
    document.getElementById('message').textContent =
        'You’re on the list! Keep an eye on your inbox ✨';
    event.target.reset();
});

render();
