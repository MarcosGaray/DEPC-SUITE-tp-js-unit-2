//STATES
let catalog_products = null
let cart_products = []
let loading_products = false
let error = null


//DOM ELEMENTS
const catalog_product_container = document.getElementsByClassName('catalog-section__product-wrapper__product-container')[0]
const cart_product_container = document.getElementsByClassName('cart-section__resume-wrapper__product-container')[0]
const spinner = document.getElementById('spinner')
const error_HTML = document.getElementById('error')
const add_to_cart_buttons= document.getElementsByClassName('add-to-cart-btn')


//RENDERS
function renderCatalogProducts() {
    if(!catalog_products){
        return null
    }

    let html = ''
    for(let product of catalog_products ){
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
                    class="primary-btn add-to-cart-btn"
                    onClick="handleAddToCart(${product.id})"
                >
                    Add to cart
                </button>
            </div>
        `
    }

    catalog_product_container.innerHTML = html
}

function renderCartProducts(){
    if(cart_products.length === 0 || !cart_products){
        return null
    }

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
                            onClick="handleAddToCart(${product.id})"
                        >
                            +
                        </button>
                        <button class="cart-btn">
                            Delete
                        </button>
                        <button class="cart-btn">
                            -
                        </button>
                    </div>
                    <span class="cart-section__product-wrapper__products-container__product__quantity">
                            ${product.quantity}
                    </span>
                    <span class="cart-section__resume-wrapper__products-container__product__total-price">
                        $ ${product.price*product.quantity}
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
    }
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


//FIRST RENDER
renderCatalogProducts()
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

function add_product_to_cart(product){
    const product_in_cart = cart_products.find(cart_product => cart_product.id === product.id)
    if(product_in_cart){
        product_in_cart.quantity++
    }else{
        product.quantity = 1
        cart_products.push(product)
    }
    renderCartProducts()
}

//HANDLERS
function handleAddToCart(product_id){
    const product = catalog_products.find(product => product.id === product_id)
    if(!product){
        setError('Error finding the product')
    }
    add_product_to_cart(product)
}

function handlePopFromCart(product_id){
    const product = cart_products.find(product => product.id === product_id)
    if(!product){
        setError('Error finding the product')
    }
    
}

//MAIN ACTIONS
loadCatalogProducts()
