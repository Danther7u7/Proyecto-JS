let carro = {}

const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarro = document.getElementById('template-carro').content
const fragment = document.createDocumentFragment()

document.addEventListener('DOMContentLoaded', e => { 
    fetchData()
    if (localStorage.getItem('carro')) {
        carro = JSON.parse(localStorage.getItem('carro'))
        paintCarro();
    }
});

cards.addEventListener('click', e => { 
    addCarro(e) 
});

const fetchData = async () => {
    const res = await fetch('productos.json');
    const data = await res.json()
    paintCards(data)
}

const paintCards = data => {
    data.forEach(item => {
        templateCard.querySelector('h5').textContent = item.nombre
        templateCard.querySelector('p').textContent = item.precio
        templateCard.querySelector('img').setAttribute('src', item.picture)
        templateCard.querySelector('button').dataset.id = item.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarro = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCarro(e.target.parentElement)
    }
    e.stopPropagation();
}

const setCarro = objeto => {
    const producto = {
        nombre: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        id: objeto.querySelector('button').dataset.id,
        cantidad: 1
    }

    if (carro.hasOwnProperty(producto.id)) {
        producto.cantidad = carro[producto.id].cantidad + 1
    }

    carro[producto.id] = { ...producto }

    paintCarro();
}

const paintCarro = () => {
    items.innerHTML = ''
    
    Object.values(carro).forEach(producto => {
        templateCarro.querySelector('th').textContent = producto.id
        templateCarro.querySelectorAll('td')[0].textContent = producto.nombre
        templateCarro.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarro.querySelectorAll('td')[2].textContent = producto.precio * producto.cantidad

        const clone = templateCarro.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    paintFooter();

    localStorage.setItem('carro', JSON.stringify(carro));
}

const paintFooter = () => {
    footer.innerHTML = ''

    const nCantidad = Object.values(carro).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carro).reduce((acc, {cantidad, precio}) => acc + cantidad * precio , 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const pagarTotal = () => {
        const nPrecio = Object.values(carro).reduce((acc, {cantidad, precio}) => acc + cantidad * precio , 0)
        if (nPrecio > 0){
            Swal.fire({icon : 'success', title: 'Pago Exitoso!', text : (`Total: $${nPrecio}`)})
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Tu carrito se encuentra vacío!'
              })
        }
    }

    const botonPagar = document.getElementById("btnPagar");
    botonPagar.addEventListener("click", pagarTotal);

    const botonVaciar = document.getElementById("btnVaciar");
    botonVaciar.addEventListener("click", () => {
        carro = {}
        paintCarro();
    });
}



