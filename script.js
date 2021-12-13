function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = () => {
  productsList();
};

/* FUNÇÕES CRIADAS 13_12_2021 */
let BASE_URL = 'https://api.mercadolibre.com';
// Retorna os produtos
const getProducts = async (query) => {
  const req = await fetch(`${BASE_URL}/sites/MLB/search?q=${query}`);
  const json = await req.json();
  return json.results;
}

// Percorre o array dos produtos retornados na função getProducts
productsList = async () => {
  let products = await getProducts('Computador');
  let section = document.querySelector('section .items');
  products.forEach(element => {
    let product = { 'sku': element.id, 'name': element.title, 
      'image': element.thumbnail}
    let item = createProductItemElement(product);
    section.appendChild(item);
    addEventsButton(item);
  });
}

// Adicionar eventos ao botão
addEventsButton = (item) => {
  item.querySelector('section .item__add').addEventListener('click', async () => {
    itemID = item.firstChild.innerText;
    result = await cartItemList(itemID);
    let cart = document.querySelector('section .cart__items');
    let product = { 'sku': result.id, 'name': result.title, 
      'salePrice': result.price}
    let cartItem = createCartItemElement(product);
    cart.appendChild(cartItem);
    /*cartItem.addEventListener('click', (e) => {
      console.log(e.target);
    });*/
  });
}

// Retornar os dados do produto selecionado
cartItemList = async (itemID) => {
  const req = await fetch(`${BASE_URL}/items/${itemID}`);
  const json = await req.json();
  return json;
}