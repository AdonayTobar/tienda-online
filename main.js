const menuEmail = document.querySelector('.navbar-email');
const email = document.querySelector('.email');
const menuHamIcon = document.querySelector('.menu');
const menuCarritoIcon = document.querySelector('.navbar-shopping-cart');
const productDetailCloseIcon = document.querySelector('.product-detail-close')
const desktopMenu = document.querySelector('.desktop-menu');
const mobileMenu = document.querySelector('.mobile-menu');
const shoppingCartContainer = document.querySelector('#shoppingCartContainer');
const productDetailContainer = document.querySelector('#productDetail');
const cardsContainer = document.querySelector('.cards-container');
const cerrarCarrito = document.querySelector(".title-container");
const orden = document.querySelector(".my-order-content");
const totalOrden = document.querySelector(".totalP");
const counterOrden = document.querySelector(".counter");

//recuperando el array de usuarios guardado en el localstorage
const users = JSON.parse(localStorage.getItem('users'));
//Recuperando el usuario
const emailGuardado = localStorage.getItem('email');
menuEmail.textContent = emailGuardado;
email.textContent = emailGuardado;

menuEmail.addEventListener('click', toggleDesktopMenu);
menuHamIcon.addEventListener('click', toggleMobileMenu);
menuCarritoIcon.addEventListener('click', toggleCarritoAside);
cerrarCarrito.addEventListener("click", toggleCarritoAside);




function toggleDesktopMenu() {
  const isAsideClosed = shoppingCartContainer.classList.contains('inactive');

  if (!isAsideClosed) {
    shoppingCartContainer.classList.add('inactive');
  }
  
  desktopMenu.classList.toggle('inactive');
}

function toggleMobileMenu() {
  const isAsideClosed = shoppingCartContainer.classList.contains('inactive');

  if (!isAsideClosed) {
    shoppingCartContainer.classList.add('inactive'); 
  }

  closeProductDetailAside();
  
  mobileMenu.classList.toggle('inactive');
}

function toggleCarritoAside() {
  const isMobileMenuClosed = mobileMenu.classList.contains('inactive');
  
  if (!isMobileMenuClosed) {
    mobileMenu.classList.add('inactive');
  }

 // const isProductDetailClosed = productDetailContainer.classList.contains('inactive');
  
  //if (!isProductDetailClosed) {
  //  productDetailContainer.classList.add('inactive'); 
  //}
  
  shoppingCartContainer.classList.toggle('inactive');
}

async function openProductDetailAside(id) {
  shoppingCartContainer.classList.add('inactive');
  productDetailContainer.classList.remove('inactive');
  productDetailContainer.classList.add('active');
  productDetailContainer.classList.remove('nomostrar');
  console.log("se le dio click"+ id);

  const {data} = await api('/products/' + id);

  const producto = data;
  console.log({data, producto});

productDetailContainer.innerHTML = "";
const productDetailClose = document.createElement('div');
productDetailClose.classList.add('product-detail-close');
productDetailClose.addEventListener('click', () => {
   //productDetailContainer.classList.add('inactive');
   productDetailContainer.classList.remove('active');
   productDetailContainer.classList.add('nomostrar');
   productDetailContainer.innerHTML = "";
});

const closeImg = document.createElement('img');
closeImg.src = './icons/icon_close.png';
closeImg.alt = 'close';

productDetailClose.appendChild(closeImg);

const productImg = document.createElement('img');
productImg.src = producto.images[0];
productImg.alt = producto.title;

const productInfo = document.createElement('div');
productInfo.classList.add('product-info');

const price = document.createElement('p');
price.textContent = '$' + producto.price;

const productName = document.createElement('p');
productName.textContent = producto.title;

const productDescription = document.createElement('p');
productDescription.textContent = producto.description;

const addToCartButton = document.createElement('button');
addToCartButton.classList.add('primary-button', 'add-to-cart-button');
addToCartButton.addEventListener("click", () => {
  agregarAlCarrito(producto.id);
});

const addToCartImg = document.createElement('img');
addToCartImg.src = './icons/bt_add_to_cart.svg';
addToCartImg.alt = 'add to cart';

const addToCartText = document.createTextNode('Add to cart');

addToCartButton.appendChild(addToCartImg);
addToCartButton.appendChild(addToCartText);

productInfo.appendChild(price);
productInfo.appendChild(productName);
productInfo.appendChild(productDescription);
productInfo.appendChild(addToCartButton);

productDetailContainer.appendChild(productDetailClose);
productDetailContainer.appendChild(productImg);
productDetailContainer.appendChild(productInfo);
  
}

function closeProductDetailAside() {
  //productDetailContainer.classList.add('inactive');
  productDetailContainer.classList.remove('active');
  //productDetailContainer.classList.add('nomostrar');
  productDetailContainer.innerHTML = "";
}

const api = axios.create({
  baseURL: 'https://api.escuelajs.co/api/v1',
  Headers: {
    'Content-Type': 'application/json;charset=utf-8',
  }
});

//funciones para que las imagenes cargen solo cuando estan viendo

const observerTargeta = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      console.log('Elemeto visible');
      const url = entry.target.getAttribute('data-img');
      entry.target.src = url;

    } /* else {
      console.log('Elemento NO visible');
      const url = entry.target.getAttribute('data-img');
      entry.target.src = "";
    } */
  });
});

async function products(comple) {

  // Obtener el elemento padre donde se añadirá el nuevo elemento <div>
  const parentElement = document.querySelector('.cards-container');

  console.log(comple);
  const {data} = await api(comple);
parentElement.innerHTML = "";
  const productos = data;
  console.log({data, productos});

  productos.forEach(producto => {

// Crear el elemento div
const productCard = document.createElement('div');

// Agregar la clase "product-card"
productCard.classList.add('product-card');

// Crear la imagen y establecer el atributo src
const img = document.createElement('img');
img.setAttribute("data-img", producto.images[0]);
img.setAttribute('alt', producto.title);
img.addEventListener('click', () => {
  openProductDetailAside(producto.id)
});

observerTargeta.observe(img);

// Crear el elemento div con la clase "product-info"
const productInfo = document.createElement('div');
productInfo.classList.add('product-info');

// Crear el primer div dentro de product-info
const div1 = document.createElement('div');
const p1 = document.createElement('p');
p1.textContent = '$' + producto.price;
const p2 = document.createElement('p');
p2.textContent = producto.title;
div1.appendChild(p1);
div1.appendChild(p2);

// Crear el elemento figure con la imagen del icono y agregar la clase "figure"
const figure = document.createElement('figure');
const iconImg = document.createElement('img');
iconImg.setAttribute('src', './icons/bt_add_to_cart.svg');
iconImg.setAttribute('alt', '');
iconImg.classList.add('agregarCarrito');
figure.appendChild(iconImg);
figure.addEventListener("click", () => {
  console.log("Se le ha dado click");
  agregarAlCarrito(producto.id);
});

// Agregar todos los elementos creados al producto
productInfo.appendChild(div1);
productInfo.appendChild(figure);
productCard.appendChild(img);
productCard.appendChild(productInfo);

// Agregar el producto al contenedor deseado (en este caso, al body)
parentElement.appendChild(productCard);


});
}

//funcion para obtener las categorias

 function categorias(){
  /* const {data} = await api('/categories');

  const productos = data;
  console.log({data, productos}); */

  //Haciendo el escuha de cada categoria
  const all = document.querySelectorAll(".all");
  const clothes = document.querySelectorAll(".clothes");
  const elec = document.querySelectorAll(".elec");
  const fur = document.querySelectorAll(".fur");
  const toys = document.querySelectorAll(".toys");
  const otros = document.querySelectorAll(".otros");

  let comple = "";
  all.forEach(element => {
    element.addEventListener('click', () => {
      mobileMenu.classList.add('inactive');
    comple = '/products';
    products(comple);
  });
  })
  
  clothes.forEach(element => {
    element.addEventListener('click', () => {
      mobileMenu.classList.add('inactive');
    comple = '/categories/1/products';
    products(comple);
  });
  })
  
  elec.forEach(element => {
    element.addEventListener('click', () => {
      mobileMenu.classList.add('inactive');
    comple = '/categories/2/products';
    products(comple);
  });
  })
  
  fur.forEach(element => {
    element.addEventListener('click', () => {
      mobileMenu.classList.add('inactive');
    comple = '/categories/3/products';
    products(comple);
  });})
  
  toys.forEach(element => {
    element.addEventListener('click', () => {
      mobileMenu.classList.add('inactive');
    comple = '/categories/4/products';
    products(comple);
  });
  })
  
  otros.forEach(element => {
    element.addEventListener('click', () => {
      mobileMenu.classList.add('inactive');
    comple = '/categories/5/products';
    products(comple);
  });
  })
  

if(!comple) {
    comple = '/products';
    products(comple);
  }
  
}
let carrito = [];


const eliminar = document.querySelector(".delete");
async function agregarAlCarrito(id) {

  const {data} = await api('/products/' + id);

  const producto = data;
  console.log({data, producto});
  carrito.push(producto);
 mostrarProductos(carrito);
} 

function mostrarProductos(carrito){
  let total = 0;
  let contador = carrito.length;
  counterOrden.textContent = contador;
  orden.innerHTML = '';

  carrito.forEach(producto => {
      // Creamos el elemento shopping-cart
      const shoppingCart = document.createElement('div');
      shoppingCart.classList.add('shopping-cart');

      // Creamos el elemento figure
      const figure = document.createElement('figure');

      // Creamos el elemento img dentro de figure
      const img = document.createElement('img');
      img.src = producto.images[0];
      img.alt = 'bike';
      figure.appendChild(img);

      // Creamos los elementos p
      const pName = document.createElement('p');
      pName.textContent = producto.title;
      const pPrice = document.createElement('p');
      pPrice.textContent = '$' + producto.price;

      // Creamos el elemento img con clase delete
      const deleteIcon = document.createElement('img');
      deleteIcon.classList.add('delete');
      deleteIcon.src = './icons/icon_close.png';
      deleteIcon.alt = 'close';
      deleteIcon.classList.add("delete");
      deleteIcon.addEventListener('click', () => {
        eliminarProducto(producto.id);
      });

      // Agregamos todos los elementos al contenedor shopping-cart
      shoppingCart.appendChild(figure);
      shoppingCart.appendChild(pName);
      shoppingCart.appendChild(pPrice);
      shoppingCart.appendChild(deleteIcon);

      // Agregamos shopping-cart al contenedor principal
      orden.appendChild(shoppingCart);

  });

carrito.forEach(producto => {
  total += producto.price;
})

totalOrden.textContent ="$" + total;

}

function eliminarProducto(id) {
  const index = carrito.findIndex(producto => producto.id === id);
  if (index !== -1) {
    carrito.splice(index, 1);
  }
  mostrarProductos(carrito);
}
categorias();
products();




