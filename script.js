//STATES
let catalog_products = null
let loading_products = false
let error = null

//DOM ELEMENTS
const catalog_product_container = document.getElementsByClassName('catalog-section__product-wrapper__product-container')[0]
const spinner = document.getElementById('spinner')
const error_HTML = document.getElementById('error')

//RENDERS
function renderCatalogProducts() {
    if(!catalog_products){
        return null
    }

    let html = ''
    for(let product of catalog_products ){
        html = html + `
            <div id="${`product-${product.id}`}" class="catalog-section__product-wrapper__product-container__product">
                <h2 class="catalog-section__product-wrapper__product-container__product__title">${product.title}</h2>
                <div class="catalog-section__product-wrapper__product-container__product__image-container">
                    <img src="${product.images[0]}" alt="${product.title}">
                </div>
                <p class="catalog-section__product-wrapper__product-container__product__description">${product.description}</p>
                <span class="catalog-section__product-wrapper__product-container__product__price">${product.price}</span>
                <button class="primary-btn add-to-cart-btn">Add to cart</button>
            </div>
        `
    }

    catalog_product_container.innerHTML = html
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

loadCatalogProducts()


/* 
Crear un boton de eliminar sobre cada usuario, al darle eliminar se debera usar la funcion deleteUserByUserId(user_id) y eliminara el elemento del estado de usuarios
*/