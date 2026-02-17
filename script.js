//STATES
let catalog_products = null
let cart_products = []
let total_items = 0
let total_price = 0
let loading_products = false
let error = null


//DOM ELEMENTS
const catalog_product_container = document.getElementsByClassName('catalog-section__product-wrapper__product-container')[0]
const cart_product_container = document.getElementsByClassName('cart-section__resume-wrapper__product-container')[0]
const spinner = document.getElementById('spinner')
const error_HTML = document.getElementById('error')
const add_to_cart_buttons= document.getElementsByClassName('add-to-cart-btn')
const total_items_span = document.getElementsByClassName('cart-section__resume-wrapper__resume__totals-container__total-items')[0]
const total_price_span = document.getElementsByClassName('cart-section__resume-wrapper__resume__totals-container__total-price')[0]
const remove_all_btn = document.getElementById('remove-all-btn')
const buy_btn = document.getElementById('buy-btn')

//RENDERS
function renderCatalogProducts() {
    if(!catalog_products){
        return null
    }

    let html = ''
    for(let product of catalog_products ){
        const product_in_cart = cart_products.find(
            cart_product => cart_product.id === product.id
        )
        html = html + `
            <div id="${`product-${product.id}`}" class="catalog-section__product-wrapper__product-container__product">
                <h2 class="catalog-section__product-wrapper__product-container__product__title">
                    ${product.title}
                </h2>
                <div class="catalog-section__product-wrapper__product-container__product__image-container">
                    <img src="${product.images[0]}" alt="${product.title}">
                </div>
                <div class="catalog-section__product-wrapper__product-container__product__description">
                    ${product.description}
                </div>
                <span class="catalog-section__product-wrapper__product-container__product__price">
                    $ ${product.price}
                </span>
                <button 
                    class="primary-btn ${product_in_cart ? 'remove-from-cart-btn' : ''}"
                    onClick="${
                        product_in_cart 
                        ? `handleRemoveProductFromCart(${product.id})`
                        : `handleAddToCart(${product.id})`
                    }"
                >
                    ${product_in_cart ? 'Remove from cart' : 'Add to cart'}
                </button>
            </div>
        `
    }

    catalog_product_container.innerHTML = html
}
function renderCartProducts(){
    if(!cart_products || cart_products.length === 0){
        remove_all_btn.classList.add('hidden')
        cart_product_container.innerHTML = `
        <span class="cart-section__resume-wrapper__products-container__empty-message">
            Your cart is empty
        </span>
        `
        return null;
    }
    remove_all_btn.classList.remove('hidden')

    let html = ''
    
    for(let product of cart_products ){
        html = html + `
            <div id="${`product-${product.id}`}" class="cart-section__resume-wrapper__products-container__product">
                <div class="cart-section__product-wrapper__products-container__product__left-section">
                    <div class="cart-section__resume-wrapper__products-container__product__image-container">
                        <img src="${product.images[0]}" alt="${product.title}">
                    </div>
                    <h2 class="cart-section__resume-wrapper__products-container__product__title">
                        ${product.title}
                    </h2>
                </div>
                <div class="cart-section__product-wrapper__products-container__product__right-section">
                    <div class="cart-section__product-wrapper__product-container__product__buttons-container">
                        <button 
                            class="cart-btn"
                            onClick="handlePopFromCart(${product.id})"
                        >
                            -
                        </button>    
                        <button 
                            class="cart-btn"
                            onClick="handleRemoveProductFromCart(${product.id})"
                        >
                            <i class="bi bi-trash3"></i>
                        </button>
                        <button 
                            class="cart-btn"
                            onClick="handleAddToCart(${product.id})"
                        >
                            +
                        </button>
                    </div>
                    <span class="cart-section__product-wrapper__products-container__product__quantity">
                            ${product.quantity}
                    </span>
                    <span class="cart-section__resume-wrapper__products-container__product__price">
                        $ <span>${roundToTwoDecimals(product.price*product.quantity)}</span>
                    </span>
                </div>
            </div>
        `
    }

    cart_product_container.innerHTML = html
}
function renderLoadingSpinner(){
    if(loading_products){
        spinner.classList.remove('hidden')
    }else{
        spinner.classList.add('hidden')
    }
}
function renderError(){
    if(!error){
        return null;
    }
    else{
        error_HTML.innerText = error
        alert(error)
    }
}
function renderTotalItems(){
    total_items_span.innerHTML = `Items: <span>${total_items}</span>`
}
function renderTotalPrice(){
    total_price_span.innerHTML = `Total: <span>$ ${roundToTwoDecimals(total_price)}</span>`
}

//SETTERS
function setCatalogProducts (new_value){
    catalog_products = new_value
    renderCatalogProducts()
}
function setLoading(new_loading_state){
    loading_products = new_loading_state
    renderLoadingSpinner()
}
function setError(new_error_state){
    error = new_error_state
    renderError()
}
function setCartProducts(new_value){
    cart_products = new_value
    renderCartProducts()
    renderCatalogProducts()
    setTotalItems(cart_products.reduce((total, product) => total + product.quantity, 0))
    setTotalPrice(cart_products.reduce((total, product) => total + product.price*product.quantity, 0))
}
function setTotalItems(new_value){
    total_items = new_value
    renderTotalItems()
}
function setTotalPrice(new_value){
    total_price = new_value
    renderTotalPrice()
}


//FIRST RENDER
renderCatalogProducts()
renderCartProducts()
renderTotalItems()
renderTotalPrice()
renderLoadingSpinner()
renderError()


//product-service
async function getAllProducts(){
    let response = await fetch(
        'https://dummyjson.com/products', 
        {
            method: 'GET'
        }
    )
    
    return await response.json()
}

//GENERAL FUNCTIONS
async function loadCatalogProducts(){
    try{
        setLoading(true)
        let response = await getAllProducts()
        //console.log(response);
        setCatalogProducts(response.products)
    }catch(error){
        setError(error)
    }finally{
        setLoading(false)
    }
    
}
function addProductToCart(product){
    const product_in_cart = cart_products.find(cart_product => cart_product.id === product.id)
    if(product_in_cart){
        product_in_cart.quantity++
    }else{
        product.quantity = 1
        cart_products.push(product)
    }
    setCartProducts([...cart_products])
}
function popProductFromCart(product){
    const product_in_cart = cart_products.find(cart_product => cart_product.id === product.id)
    if(product_in_cart){
        if(product_in_cart.quantity > 1){
            product_in_cart.quantity--
        }else{
            cart_products = cart_products.filter(cart_product => cart_product.id !== product.id)
        }
    }
    setCartProducts([...cart_products])
}
function removeProductFromCart(product){
    cart_products = cart_products.filter(cart_product => cart_product.id !== product.id)
    setCartProducts([...cart_products])
}

function checkProductStock(product){
    let cart_product = cart_products.find(cart_product => cart_product.id === product.id)
    if(cart_product){
        return cart_product.quantity < product.stock
    }
    return product.stock > 0
}

//UTILS FUNCTIONS
function roundToTwoDecimals(number){
    return Math.round(number * 100) / 100
}

//HANDLERS
function handleAddToCart(product_id){
    const product = catalog_products.find(product => product.id === product_id)
    if(!product){
        setError('Error finding the product')
    }
    if(!checkProductStock(product)){
        setError(`Product ${product.title} out of stock`)
        return null
    }
    addProductToCart(product)
}

function handlePopFromCart(product_id){
    const product = cart_products.find(product => product.id === product_id)
    if(!product){
        setError('Error finding the product')
    }
    popProductFromCart(product)
}

function handleRemoveProductFromCart(product_id){
    const product = cart_products.find(product => product.id === product_id)
    if(!product){
        setError('Error finding the product')
    }
    removeProductFromCart(product)
}

function handleRemoveAllProductsFromCart(){
    if (!cart_products || cart_products.length === 0){
        return null
    }
    setCartProducts([])
}
function handleBuy(){
    if(!cart_products || cart_products.length === 0){
        alert('Your cart is empty')
        return null
    }
    let buyMessage = `The total amount to be paid is $${roundToTwoDecimals(total_price)}`
    alert(buyMessage)

    setCartProducts([])
}

//EVENT LISTENERS
remove_all_btn.addEventListener('click', () => handleRemoveAllProductsFromCart())
buy_btn.addEventListener('click', () => handleBuy())

//MAIN PROCESS
loadCatalogProducts()
