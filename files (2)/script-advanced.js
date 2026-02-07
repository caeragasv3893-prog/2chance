// ==========================================
// 2CHANCE PLATFORM - ADVANCED FEATURES V2.0
// ==========================================

// Global State Management
const AppState = {
    cart: JSON.parse(localStorage.getItem('2chance_cart')) || [],
    favorites: JSON.parse(localStorage.getItem('2chance_favorites')) || [],
    user: JSON.parse(localStorage.getItem('2chance_user')) || null,
    compareList: JSON.parse(localStorage.getItem('2chance_compare')) || [],
    filters: {
        categories: [],
        conditions: [],
        priceMin: 0,
        priceMax: 1000,
        location: '',
        shipping: []
    },
    sortBy: 'recent',
    viewMode: 'grid'
};

// Save State to LocalStorage
function saveState() {
    localStorage.setItem('2chance_cart', JSON.stringify(AppState.cart));
    localStorage.setItem('2chance_favorites', JSON.stringify(AppState.favorites));
    localStorage.setItem('2chance_compare', JSON.stringify(AppState.compareList));
    if (AppState.user) {
        localStorage.setItem('2chance_user', JSON.stringify(AppState.user));
    }
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initSearchOverlay();
    initMobileMenu();
    initFavorites();
    initAdvancedCart();
    initContactForm();
    initProductFilters();
    initAdvancedAnimations();
    initProductCards();
    initUserMenu();
    initSellNowModal();
    initNotificationSystem();
    initLiveSearch();
    initPriceRangeSlider();
    initQuickView();
    initCompareProducts();
    initNewsletterPopup();
    initChatbot();
    updateAllBadges();
    initParallaxEffects();
    initCounterAnimations();
    initImageLazyLoad();
    initInfiniteScroll();
    initSmoothScroll();
    initBackToTop();
    consoleWelcome();
});

// ==========================================
// ADVANCED CART SYSTEM
// ==========================================
function initAdvancedCart() {
    const cartBtn = document.getElementById('cartBtn');
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');

    // Create Cart Modal
    createCartModal();

    // Cart Button Click
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCartModal();
        });
    }

    // Add to Cart Buttons
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const productCard = btn.closest('.product-card');
            const product = extractProductData(productCard);
            
            addToCart(product);
            animateAddToCart(btn, cartBtn);
        });
    });
}

function createCartModal() {
    const modal = document.createElement('div');
    modal.id = 'cartModal';
    modal.className = 'cart-modal';
    modal.innerHTML = `
        <div class="cart-modal-overlay"></div>
        <div class="cart-modal-content">
            <div class="cart-modal-header">
                <h2><i class="fas fa-shopping-cart"></i> O Meu Carrinho</h2>
                <button class="cart-modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="cart-modal-body" id="cartModalBody">
                <!-- Cart items will be inserted here -->
            </div>
            <div class="cart-modal-footer">
                <div class="cart-total">
                    <span>Total:</span>
                    <span class="cart-total-price">0€</span>
                </div>
                <button class="btn-checkout"><i class="fas fa-credit-card"></i> Finalizar Compra</button>
                <button class="btn-continue-shopping">Continuar a Comprar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Close button
    modal.querySelector('.cart-modal-close').addEventListener('click', closeCartModal);
    modal.querySelector('.cart-modal-overlay').addEventListener('click', closeCartModal);
    modal.querySelector('.btn-continue-shopping').addEventListener('click', closeCartModal);
    
    // Checkout button
    modal.querySelector('.btn-checkout').addEventListener('click', () => {
        if (AppState.cart.length === 0) {
            showNotification('O carrinho está vazio!', 'warning');
            return;
        }
        showNotification('A redirecionar para checkout...', 'success');
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 1000);
    });
}

function openCartModal() {
    const modal = document.getElementById('cartModal');
    const body = document.getElementById('cartModalBody');
    
    if (AppState.cart.length === 0) {
        body.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <h3>O teu carrinho está vazio</h3>
                <p>Adiciona produtos para começar a comprar!</p>
                <button class="btn-primary" onclick="closeCartModal()">Explorar Produtos</button>
            </div>
        `;
    } else {
        body.innerHTML = AppState.cart.map((item, index) => `
            <div class="cart-item" data-index="${index}">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p class="cart-item-category">${item.category}</p>
                    <div class="cart-item-meta">
                        <span class="cart-item-condition"><i class="fas fa-check-circle"></i> ${item.condition}</span>
                    </div>
                </div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${index}, -1)"><i class="fas fa-minus"></i></button>
                    <span class="qty-value">${item.quantity || 1}</span>
                    <button class="qty-btn" onclick="updateQuantity(${index}, 1)"><i class="fas fa-plus"></i></button>
                </div>
                <div class="cart-item-price">
                    <span class="item-price">${item.price}</span>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    updateCartTotal();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function addToCart(product) {
    const existingIndex = AppState.cart.findIndex(item => item.id === product.id);
    
    if (existingIndex > -1) {
        AppState.cart[existingIndex].quantity = (AppState.cart[existingIndex].quantity || 1) + 1;
        showNotification('Quantidade atualizada no carrinho!', 'success');
    } else {
        AppState.cart.push({ ...product, quantity: 1 });
        showNotification(`${product.title} adicionado ao carrinho!`, 'success');
    }
    
    saveState();
    updateAllBadges();
}

function removeFromCart(index) {
    const item = AppState.cart[index];
    AppState.cart.splice(index, 1);
    saveState();
    updateAllBadges();
    openCartModal(); // Refresh cart display
    showNotification(`${item.title} removido do carrinho`, 'info');
}

function updateQuantity(index, change) {
    if (!AppState.cart[index]) return;
    
    const newQty = (AppState.cart[index].quantity || 1) + change;
    
    if (newQty < 1) {
        removeFromCart(index);
        return;
    }
    
    AppState.cart[index].quantity = newQty;
    saveState();
    openCartModal(); // Refresh display
}

function updateCartTotal() {
    const totalElement = document.querySelector('.cart-total-price');
    if (!totalElement) return;
    
    const total = AppState.cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('€', '').replace(',', '.'));
        return sum + (price * (item.quantity || 1));
    }, 0);
    
    totalElement.textContent = `${total.toFixed(2)}€`;
}

function animateAddToCart(button, cartBtn) {
    const buttonRect = button.getBoundingClientRect();
    const cartRect = cartBtn.getBoundingClientRect();
    
    const flyingIcon = document.createElement('div');
    flyingIcon.className = 'flying-cart-icon';
    flyingIcon.innerHTML = '<i class="fas fa-shopping-cart"></i>';
    flyingIcon.style.left = buttonRect.left + 'px';
    flyingIcon.style.top = buttonRect.top + 'px';
    
    document.body.appendChild(flyingIcon);
    
    setTimeout(() => {
        flyingIcon.style.left = cartRect.left + 'px';
        flyingIcon.style.top = cartRect.top + 'px';
        flyingIcon.style.opacity = '0';
        flyingIcon.style.transform = 'scale(0.5)';
    }, 50);
    
    setTimeout(() => {
        flyingIcon.remove();
        cartBtn.classList.add('bounce');
        setTimeout(() => cartBtn.classList.remove('bounce'), 300);
    }, 800);
}

function extractProductData(card) {
    return {
        id: Math.random().toString(36).substr(2, 9),
        title: card.querySelector('.product-title').textContent,
        price: card.querySelector('.current-price').textContent,
        image: card.querySelector('.product-image img').src,
        category: card.querySelector('.product-category').textContent,
        condition: card.querySelector('.product-badge').textContent,
        location: card.querySelector('.product-location')?.textContent.trim() || 'N/A'
    };
}

// ==========================================
// ADVANCED SEARCH & FILTERS
// ==========================================
function initSearchOverlay() {
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = searchOverlay?.querySelector('.search-input');

    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            setTimeout(() => searchInput.focus(), 300);
        });

        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });

        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && searchInput.value.trim()) {
                performSearch(searchInput.value);
            }
        });
    }
}

function initLiveSearch() {
    const searchInputs = document.querySelectorAll('.search-input, .hero-search-input');
    
    searchInputs.forEach(input => {
        let searchTimeout;
        input.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length < 2) return;
            
            searchTimeout = setTimeout(() => {
                showSearchSuggestions(query, input);
            }, 300);
        });
    });
}

function showSearchSuggestions(query, inputElement) {
    // Remove existing suggestions
    document.querySelectorAll('.search-suggestions').forEach(el => el.remove());
    
    const suggestions = ['iPhone 13', 'MacBook Pro', 'PlayStation 5', 'Nintendo Switch', 'AirPods Pro', 'Samsung Galaxy'];
    const filtered = suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()));
    
    if (filtered.length === 0) return;
    
    const suggestionBox = document.createElement('div');
    suggestionBox.className = 'search-suggestions';
    suggestionBox.innerHTML = filtered.map(s => `
        <div class="search-suggestion-item" data-query="${s}">
            <i class="fas fa-search"></i>
            <span>${s}</span>
        </div>
    `).join('');
    
    inputElement.parentElement.appendChild(suggestionBox);
    
    suggestionBox.querySelectorAll('.search-suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const query = item.dataset.query;
            inputElement.value = query;
            performSearch(query);
        });
    });
}

function performSearch(query) {
    if (!query.trim()) return;
    window.location.href = `produtos.html?search=${encodeURIComponent(query)}`;
}

// ==========================================
// FAVORITES SYSTEM
// ==========================================
function initFavorites() {
    const favoriteButtons = document.querySelectorAll('.btn-favorite');

    favoriteButtons.forEach(btn => {
        const productCard = btn.closest('.product-card');
        if (!productCard) return;
        
        const product = extractProductData(productCard);
        
        // Check if already favorited
        if (AppState.favorites.some(fav => fav.id === product.id)) {
            btn.classList.add('active');
            btn.querySelector('i').classList.replace('far', 'fas');
        }

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            toggleFavorite(product, btn);
        });
    });
}

function toggleFavorite(product, btn) {
    const index = AppState.favorites.findIndex(fav => fav.id === product.id);
    
    if (index > -1) {
        AppState.favorites.splice(index, 1);
        btn.classList.remove('active');
        btn.querySelector('i').classList.replace('fas', 'far');
        showNotification('Removido dos favoritos', 'info');
    } else {
        AppState.favorites.push(product);
        btn.classList.add('active');
        btn.querySelector('i').classList.replace('far', 'fas');
        showNotification('❤️ Adicionado aos favoritos!', 'success');
        
        // Animate
        btn.style.transform = 'scale(1.3)';
        setTimeout(() => btn.style.transform = '', 300);
    }
    
    saveState();
    updateAllBadges();
}

// ==========================================
// USER MENU & AUTHENTICATION
// ==========================================
function initUserMenu() {
    const userBtn = document.getElementById('userBtn');
    if (!userBtn) return;
    
    // Create user menu dropdown
    const userMenu = document.createElement('div');
    userMenu.className = 'user-menu-dropdown';
    userMenu.innerHTML = `
        <div class="user-menu-header">
            <i class="fas fa-user-circle"></i>
            <div>
                <h4>Bem-vindo!</h4>
                <p>Inicia sessão para continuar</p>
            </div>
        </div>
        <div class="user-menu-links">
            <a href="perfil.html"><i class="fas fa-user"></i> O Meu Perfil</a>
            <a href="encomendas.html"><i class="fas fa-shopping-bag"></i> As Minhas Encomendas</a>
            <a href="favoritos.html"><i class="fas fa-heart"></i> Favoritos</a>
            <a href="mensagens.html"><i class="fas fa-envelope"></i> Mensagens</a>
            <a href="configuracoes.html"><i class="fas fa-cog"></i> Configurações</a>
            <hr>
            <a href="#" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Terminar Sessão</a>
        </div>
        <div class="user-menu-footer">
            <button class="btn-login">Iniciar Sessão</button>
            <button class="btn-register">Registar</button>
        </div>
    `;
    
    userBtn.parentElement.appendChild(userMenu);
    
    userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target) && e.target !== userBtn) {
            userMenu.classList.remove('active');
        }
    });
}

// ==========================================
// SELL NOW MODAL
// ==========================================
function initSellNowModal() {
    const sellBtns = document.querySelectorAll('.btn-primary, #sellNowBtn');
    
    sellBtns.forEach(btn => {
        if (btn.textContent.includes('Vender')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openSellModal();
            });
        }
    });
}

function openSellModal() {
    const modal = document.createElement('div');
    modal.className = 'sell-modal active';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content sell-modal-content">
            <button class="modal-close"><i class="fas fa-times"></i></button>
            <h2><i class="fas fa-tags"></i> Vender o Teu Produto</h2>
            <form class="sell-form">
                <div class="form-group">
                    <label>Título do Produto</label>
                    <input type="text" placeholder="Ex: iPhone 13 Pro 128GB" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Categoria</label>
                        <select required>
                            <option value="">Seleciona...</option>
                            <option>Eletrónica</option>
                            <option>Moda</option>
                            <option>Casa & Jardim</option>
                            <option>Desporto</option>
                            <option>Livros</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Condição</label>
                        <select required>
                            <option value="">Seleciona...</option>
                            <option>Como Novo</option>
                            <option>Quase Novo</option>
                            <option>Bom Estado</option>
                            <option>Estado Aceitável</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Preço (€)</label>
                        <input type="number" placeholder="0.00" min="0" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label>Localização</label>
                        <select required>
                            <option value="">Seleciona...</option>
                            <option>Lisboa</option>
                            <option>Porto</option>
                            <option>Braga</option>
                            <option>Coimbra</option>
                            <option>Faro</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Descrição</label>
                    <textarea rows="4" placeholder="Descreve o teu produto em detalhe..." required></textarea>
                </div>
                <div class="form-group">
                    <label>Fotos do Produto</label>
                    <div class="image-upload">
                        <input type="file" multiple accept="image/*" id="productImages">
                        <label for="productImages">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Arrasta imagens ou clica para escolher</span>
                            <small>Máximo 8 imagens</small>
                        </label>
                    </div>
                </div>
                <button type="submit" class="btn-submit-sell">
                    <i class="fas fa-check"></i> Publicar Produto
                </button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
    
    modal.querySelector('.sell-form').addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('✅ Produto publicado com sucesso!', 'success');
        setTimeout(() => modal.remove(), 1500);
    });
}

// ==========================================
// QUICK VIEW MODAL
// ==========================================
function initQuickView() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const quickViewBtn = document.createElement('button');
        quickViewBtn.className = 'btn-quick-view';
        quickViewBtn.innerHTML = '<i class="fas fa-eye"></i> Vista Rápida';
        
        const imageContainer = card.querySelector('.product-image');
        if (imageContainer) {
            imageContainer.appendChild(quickViewBtn);
            
            quickViewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openQuickView(card);
            });
        }
    });
}

function openQuickView(productCard) {
    const product = extractProductData(productCard);
    
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal active';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content quick-view-content">
            <button class="modal-close"><i class="fas fa-times"></i></button>
            <div class="quick-view-grid">
                <div class="quick-view-image">
                    <img src="${product.image}" alt="${product.title}">
                    <span class="product-badge">${product.condition}</span>
                </div>
                <div class="quick-view-details">
                    <div class="product-category">${product.category}</div>
                    <h2>${product.title}</h2>
                    <div class="quick-view-rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                        <span>4.5 (24 avaliações)</span>
                    </div>
                    <div class="quick-view-price">
                        <span class="current-price">${product.price}</span>
                        <span class="discount-badge">-30%</span>
                    </div>
                    <div class="quick-view-meta">
                        <div class="meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${product.location}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-truck"></i>
                            <span>Envio disponível</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-shield-alt"></i>
                            <span>Compra protegida</span>
                        </div>
                    </div>
                    <p class="quick-view-description">
                        Produto em excelente estado de conservação. Testado e totalmente funcional. 
                        Inclui todos os acessórios originais. Vendedor verificado com 98% de avaliações positivas.
                    </p>
                    <div class="quick-view-actions">
                        <button class="btn-add-to-cart-qv" onclick="addProductFromQuickView('${product.id}')">
                            <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
                        </button>
                        <button class="btn-favorite-qv">
                            <i class="far fa-heart"></i>
                        </button>
                        <button class="btn-compare-qv">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                    </div>
                    <div class="seller-info">
                        <img src="https://i.pravatar.cc/150?img=12" alt="Seller">
                        <div>
                            <h4>João Silva</h4>
                            <div class="seller-rating">
                                <i class="fas fa-star"></i> 4.9 • 156 vendas
                            </div>
                        </div>
                        <button class="btn-contact-seller">
                            <i class="fas fa-comment"></i> Contactar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
}

// ==========================================
// COMPARE PRODUCTS
// ==========================================
function initCompareProducts() {
    // Add compare buttons to products
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const compareBtn = document.createElement('button');
        compareBtn.className = 'btn-compare';
        compareBtn.innerHTML = '<i class="fas fa-exchange-alt"></i>';
        compareBtn.title = 'Comparar';
        
        const footer = card.querySelector('.product-footer');
        if (footer) {
            footer.appendChild(compareBtn);
            
            compareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleCompare(card);
            });
        }
    });
}

function toggleCompare(productCard) {
    const product = extractProductData(productCard);
    const index = AppState.compareList.findIndex(p => p.id === product.id);
    
    if (index > -1) {
        AppState.compareList.splice(index, 1);
        showNotification('Removido da comparação', 'info');
    } else {
        if (AppState.compareList.length >= 4) {
            showNotification('Máximo de 4 produtos para comparar', 'warning');
            return;
        }
        AppState.compareList.push(product);
        showNotification('Adicionado à comparação', 'success');
    }
    
    saveState();
    updateCompareBar();
}

function updateCompareBar() {
    let compareBar = document.getElementById('compareBar');
    
    if (AppState.compareList.length === 0) {
        if (compareBar) compareBar.remove();
        return;
    }
    
    if (!compareBar) {
        compareBar = document.createElement('div');
        compareBar.id = 'compareBar';
        compareBar.className = 'compare-bar';
        document.body.appendChild(compareBar);
    }
    
    compareBar.innerHTML = `
        <div class="compare-bar-content">
            <div class="compare-products">
                ${AppState.compareList.map(p => `
                    <div class="compare-product-mini">
                        <img src="${p.image}" alt="${p.title}">
                        <button onclick="removeFromCompare('${p.id}')">×</button>
                    </div>
                `).join('')}
            </div>
            <button class="btn-compare-now" onclick="openCompareModal()">
                <i class="fas fa-exchange-alt"></i> Comparar (${AppState.compareList.length})
            </button>
        </div>
    `;
}

function removeFromCompare(productId) {
    const index = AppState.compareList.findIndex(p => p.id === productId);
    if (index > -1) {
        AppState.compareList.splice(index, 1);
        saveState();
        updateCompareBar();
    }
}

function openCompareModal() {
    const modal = document.createElement('div');
    modal.className = 'compare-modal active';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content compare-modal-content">
            <button class="modal-close"><i class="fas fa-times"></i></button>
            <h2><i class="fas fa-exchange-alt"></i> Comparar Produtos</h2>
            <div class="compare-table">
                <table>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            ${AppState.compareList.map(p => `
                                <th>
                                    <img src="${p.image}" alt="${p.title}">
                                    <h4>${p.title}</h4>
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Preço</strong></td>
                            ${AppState.compareList.map(p => `<td class="price-cell">${p.price}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Condição</strong></td>
                            ${AppState.compareList.map(p => `<td>${p.condition}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Localização</strong></td>
                            ${AppState.compareList.map(p => `<td>${p.location}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Categoria</strong></td>
                            ${AppState.compareList.map(p => `<td>${p.category}</td>`).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
}

// ==========================================
// CHATBOT
// ==========================================
function initChatbot() {
    const chatWidget = document.createElement('div');
    chatWidget.id = 'chatWidget';
    chatWidget.className = 'chat-widget';
    chatWidget.innerHTML = `
        <button class="chat-toggle" id="chatToggle">
            <i class="fas fa-comments"></i>
            <span class="chat-badge">1</span>
        </button>
        <div class="chat-window" id="chatWindow">
            <div class="chat-header">
                <div class="chat-header-info">
                    <i class="fas fa-robot"></i>
                    <div>
                        <h4>Assistente 2chance</h4>
                        <span class="chat-status">Online</span>
                    </div>
                </div>
                <button class="chat-minimize"><i class="fas fa-minus"></i></button>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="chat-message bot-message">
                    <div class="message-avatar"><i class="fas fa-robot"></i></div>
                    <div class="message-bubble">
                        Olá! 👋 Como posso ajudar hoje?
                    </div>
                </div>
            </div>
            <div class="chat-quick-replies">
                <button class="quick-reply" data-message="Como faço uma compra?">💳 Como comprar</button>
                <button class="quick-reply" data-message="Como vendo um produto?">🏷️ Como vender</button>
                <button class="quick-reply" data-message="Informações sobre envio">📦 Envios</button>
            </div>
            <div class="chat-input-wrapper">
                <input type="text" placeholder="Escreve a tua mensagem..." class="chat-input" id="chatInput">
                <button class="chat-send" id="chatSend"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    
    document.body.appendChild(chatWidget);
    
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');
    
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        chatToggle.querySelector('.chat-badge').style.display = 'none';
    });
    
    chatWindow.querySelector('.chat-minimize').addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });
    
    // Quick replies
    document.querySelectorAll('.quick-reply').forEach(btn => {
        btn.addEventListener('click', () => {
            const message = btn.dataset.message;
            sendChatMessage(message);
        });
    });
    
    chatSend.addEventListener('click', () => {
        if (chatInput.value.trim()) {
            sendChatMessage(chatInput.value);
            chatInput.value = '';
        }
    });
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatInput.value.trim()) {
            sendChatMessage(chatInput.value);
            chatInput.value = '';
        }
    });
    
    function sendChatMessage(message) {
        // User message
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message user-message';
        userMsg.innerHTML = `
            <div class="message-bubble">${message}</div>
        `;
        chatMessages.appendChild(userMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Bot response
        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-message bot-message typing';
            botMsg.innerHTML = `
                <div class="message-avatar"><i class="fas fa-robot"></i></div>
                <div class="message-bubble">
                    <div class="typing-indicator">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            `;
            chatMessages.appendChild(botMsg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            setTimeout(() => {
                botMsg.classList.remove('typing');
                botMsg.querySelector('.message-bubble').innerHTML = getBotResponse(message);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1500);
        }, 500);
    }
    
    function getBotResponse(message) {
        const lower = message.toLowerCase();
        
        if (lower.includes('compra') || lower.includes('comprar')) {
            return 'Para fazer uma compra, basta navegar pelos produtos, adicionar ao carrinho e finalizar o checkout. Aceitamos vários métodos de pagamento! 💳';
        } else if (lower.includes('vend') || lower.includes('vender')) {
            return 'Para vender, clica em "Vender Agora", preenche os detalhes do produto, adiciona fotos e publica! É grátis e rápido. 🏷️';
        } else if (lower.includes('envio') || lower.includes('entrega')) {
            return 'Oferecemos várias opções de envio incluindo CTT, DPD e entrega em mão. O custo varia conforme a distância. 📦';
        } else {
            return 'Obrigado pela mensagem! Para mais informações detalhadas, consulta a nossa página de Ajuda ou contacta o suporte. 😊';
        }
    }
}

// ==========================================
// NEWSLETTER POPUP
// ==========================================
function initNewsletterPopup() {
    const hasSeenNewsletter = localStorage.getItem('newsletter_seen');
    
    if (!hasSeenNewsletter) {
        setTimeout(() => {
            showNewsletterPopup();
        }, 15000); // Show after 15 seconds
    }
}

function showNewsletterPopup() {
    const popup = document.createElement('div');
    popup.className = 'newsletter-popup active';
    popup.innerHTML = `
        <div class="newsletter-popup-content">
            <button class="newsletter-close">×</button>
            <div class="newsletter-icon">
                <i class="fas fa-envelope-open-text"></i>
            </div>
            <h3>Recebe Ofertas Exclusivas!</h3>
            <p>Subscreve a nossa newsletter e recebe 10% de desconto na primeira compra</p>
            <form class="newsletter-form">
                <input type="email" placeholder="O teu email" required>
                <button type="submit"><i class="fas fa-paper-plane"></i> Subscrever</button>
            </form>
            <p class="newsletter-privacy">
                <small>Não fazemos spam. Podes cancelar a qualquer momento.</small>
            </p>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    popup.querySelector('.newsletter-close').addEventListener('click', () => {
        popup.remove();
        localStorage.setItem('newsletter_seen', 'true');
    });
    
    popup.querySelector('.newsletter-form').addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('✅ Subscrito com sucesso! Verifica o teu email.', 'success');
        popup.remove();
        localStorage.setItem('newsletter_seen', 'true');
    });
}

// ==========================================
// ADVANCED ANIMATIONS
// ==========================================
function initAdvancedAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.product-card, .category-card, .step-card, .benefit-card, .team-card, .stat-card, .mvv-card'
    );
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

function initParallaxEffects() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (heroSection) {
            heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = element.textContent.replace(/\d+/, target);
                clearInterval(timer);
            } else {
                element.textContent = element.textContent.replace(/\d+/, Math.floor(current));
            }
        }, 16);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(entry.target);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// ==========================================
// LAZY LOADING
// ==========================================
function initImageLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ==========================================
// INFINITE SCROLL
// ==========================================
function initInfiniteScroll() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    let loading = false;
    let page = 1;
    
    window.addEventListener('scroll', () => {
        if (loading) return;
        
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        
        if (scrollTop + clientHeight >= scrollHeight - 500) {
            loading = true;
            loadMoreProducts(productsGrid, ++page);
        }
    });
}

function loadMoreProducts(container, page) {
    showNotification('A carregar mais produtos...', 'info');
    
    setTimeout(() => {
        const newProducts = `
            <div class="product-card animate-in">
                <div class="product-image">
                    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop" alt="Produto">
                    <span class="product-badge">Novo</span>
                    <button class="btn-favorite"><i class="far fa-heart"></i></button>
                </div>
                <div class="product-info">
                    <div class="product-category">Eletrónica</div>
                    <h3 class="product-title">Produto Carregado ${page}</h3>
                    <div class="product-meta">
                        <span class="product-location"><i class="fas fa-map-marker-alt"></i> Lisboa</span>
                        <span class="product-time"><i class="far fa-clock"></i> Agora</span>
                    </div>
                    <div class="product-footer">
                        <div class="product-price">
                            <span class="current-price">${(Math.random() * 500).toFixed(0)}€</span>
                        </div>
                        <button class="btn-add-cart"><i class="fas fa-shopping-cart"></i></button>
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', newProducts);
        loading = false;
    }, 1000);
}

// ==========================================
// PRODUCT FILTERS
// ==========================================
function initProductFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox input');
    const sortSelect = document.querySelector('.sort-select');
    const clearFiltersBtn = document.querySelector('.btn-clear-filters');
    const viewButtons = document.querySelectorAll('.view-btn');

    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', () => applySorting(sortSelect.value));
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }

    viewButtons.forEach(btn => {
        btn.addEventListener('click', toggleViewMode);
    });
}

function applyFilters() {
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
    const selectedConditions = Array.from(document.querySelectorAll('input[name="condition"]:checked')).map(cb => cb.value);
    
    AppState.filters.categories = selectedCategories;
    AppState.filters.conditions = selectedConditions;
    
    showNotification('Filtros aplicados', 'success');
    // In production: filter products based on selections
}

function clearAllFilters() {
    document.querySelectorAll('.filter-checkbox input').forEach(cb => cb.checked = false);
    document.querySelectorAll('.price-input').forEach(input => input.value = '');
    
    AppState.filters = {
        categories: [],
        conditions: [],
        priceMin: 0,
        priceMax: 1000,
        location: '',
        shipping: []
    };
    
    showNotification('Filtros limpos', 'info');
}

function toggleViewMode() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    AppState.viewMode = AppState.viewMode === 'grid' ? 'list' : 'grid';
    
    if (AppState.viewMode === 'list') {
        productsGrid.classList.add('list-view');
    } else {
        productsGrid.classList.remove('list-view');
    }
}

// ==========================================
// PRICE RANGE SLIDER
// ==========================================
function initPriceRangeSlider() {
    const rangeMin = document.querySelector('.range-min');
    const rangeMax = document.querySelector('.range-max');
    const priceInputs = document.querySelectorAll('.price-input');

    if (!rangeMin || !rangeMax) return;

    rangeMin.addEventListener('input', (e) => {
        const min = parseInt(e.target.value);
        const max = parseInt(rangeMax.value);
        
        if (min > max - 50) {
            rangeMin.value = max - 50;
        }
        
        if (priceInputs[0]) priceInputs[0].value = rangeMin.value;
        AppState.filters.priceMin = parseInt(rangeMin.value);
    });

    rangeMax.addEventListener('input', (e) => {
        const max = parseInt(e.target.value);
        const min = parseInt(rangeMin.value);
        
        if (max < min + 50) {
            rangeMax.value = min + 50;
        }
        
        if (priceInputs[1]) priceInputs[1].value = rangeMax.value;
        AppState.filters.priceMax = parseInt(rangeMax.value);
    });

    priceInputs.forEach((input, index) => {
        input.addEventListener('change', (e) => {
            if (index === 0) {
                rangeMin.value = e.target.value;
                AppState.filters.priceMin = parseInt(e.target.value);
            } else {
                rangeMax.value = e.target.value;
                AppState.filters.priceMax = parseInt(e.target.value);
            }
        });
    });
}

// ==========================================
// MOBILE MENU
// ==========================================
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
}

// ==========================================
// CONTACT FORM
// ==========================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // Show loading
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A enviar...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('✅ Mensagem enviada com sucesso!', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

// ==========================================
// PRODUCT CARDS INTERACTION
// ==========================================
function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        // Click to view product
        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-favorite') || 
                e.target.closest('.btn-add-cart') || 
                e.target.closest('.btn-compare') ||
                e.target.closest('.btn-quick-view')) {
                return;
            }
            
            const productTitle = card.querySelector('.product-title').textContent;
            showNotification(`A abrir ${productTitle}...`, 'info');
            
            // In production: navigate to product page
            setTimeout(() => {
                // window.location.href = 'produto-detalhes.html?id=123';
            }, 500);
        });
    });
}

// ==========================================
// SMOOTH SCROLL
// ==========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ==========================================
// BACK TO TOP
// ==========================================
function initBackToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.title = 'Voltar ao topo';
    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================
function initNotificationSystem() {
    // System is ready, notifications can be shown
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    notification.innerHTML = `
        <i class="fas fa-${icons[type] || 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function updateAllBadges() {
    updateCartBadge();
    updateFavoritesBadge();
    updateCompareBadge();
}

function updateCartBadge() {
    const badge = document.querySelector('#cartBtn .badge');
    if (badge) {
        const count = AppState.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

function updateFavoritesBadge() {
    // Could add a favorites badge if needed
}

function updateCompareBadge() {
    // Update compare bar if active
    updateCompareBar();
}

function applySorting(sortValue) {
    AppState.sortBy = sortValue;
    showNotification(`Ordenado por: ${sortValue}`, 'info');
    // In production: re-render products with new sort
}

// ==========================================
// CONSOLE WELCOME
// ==========================================
function consoleWelcome() {
    console.log('%c🌟 Bem-vindo à 2chance! 🌟', 'font-size: 24px; color: #6366f1; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);');
    console.log('%cPlataforma de compra e venda em segunda mão', 'font-size: 16px; color: #a855f7; font-weight: bold;');
    console.log('%cVersão 2.0 - Advanced Features', 'font-size: 12px; color: #64748b;');
    console.log('%c💡 Dica: Usa Ctrl+Shift+I para abrir as Dev Tools', 'font-size: 11px; color: #10b981;');
}

// ==========================================
// GLOBAL FUNCTIONS (accessible from HTML)
// ==========================================
window.addProductFromQuickView = function(productId) {
    showNotification('Produto adicionado ao carrinho!', 'success');
};

window.removeFromCompare = removeFromCompare;
window.openCompareModal = openCompareModal;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.closeCartModal = closeCartModal;

// Export for modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppState, showNotification };
}
