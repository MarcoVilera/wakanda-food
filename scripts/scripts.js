// Obtener los elementos del DOM (contenedores clase item y contador de objetos carrito)
const items = document.querySelectorAll(".item")
const elementCounter = document.getElementById("element-counter")
const billElement = document.getElementById("factura-div")
const payBtn = document.getElementById("pay-btn")
//Se espera a cargar el DOM para cargar los archivos
document.addEventListener("DOMContentLoaded", () => {
    updateElementCounter()
    loadItems()
    // Comprobaciones inicial
    try {
        if (elementCounter.innerText != "0") {
            elementCounter.style.opacity = "1"
        }
        if (localStorage.getItem("cart") == null) {
            elementCounter.style.opacity = "0"
        }
    } catch {
        console.log("Cart element not found")
    }
    try {
        //createBill()
        if (localStorage.getItem("billData") == "<hr><li>Total: 0.00$</li>") {
            billElement.innerHTML = ""
        }
    } catch (e) {
        console.log("Cannot create bill")
    }
})
//Se recorre cada item
items.forEach((item) => {
    const incrementButton = item.querySelector(".btn-increment")
    const decrementButton = item.querySelector(".btn-decrement")
    const counterSpan = item.querySelector(".item-buttons span")
    //Evento de incremento
    incrementButton.addEventListener("click", () => {
        let counterValue = parseInt(counterSpan.innerText)
        counterValue++
        counterSpan.innerText = counterValue.toString()
        //Actualiza contador carrito
        updateElementCounter()
        //Refresca la factura
        createBill()
        // Guardar cantidad en cada item el localStorage
        saveItems()
    })
    // Evento de decremento
    decrementButton.addEventListener("click", () => {
        let counterValue = parseInt(counterSpan.innerText)

        if (counterValue > 0) {
            counterValue--
            counterSpan.innerText = counterValue.toString()
        }
        //Actualiza contador carrito
        updateElementCounter()
        //Refresca la factura
        createBill()
        //En caso de que la factura quede vacía
        if (billElement.innerHTML == "<ul><hr><li>Total: 0.00$</li></ul>") {
            billElement.innerHTML = ""
        }
        // Guardar cantidad en cada item el localStorage
        saveItems()
    })
})
try {
    payBtn.addEventListener("click", () => {
        let total = 0
        items.forEach((item) => {
            const counterSpan = parseInt(item.querySelector(".item-buttons span").innerText)
            total += counterSpan
        })
        if (total > 0) {
            window.location.href = "payment.html"
        } else {
            alert("Debe seleccionar al menos un item")
        }
    })
} catch (e) {
    console.log("pay button not found")
}
//FUNCIONES

// Función para actualizar el contador general
function updateElementCounter() {
    let total = 0
    // Obtener la cantidad total de items
    items.forEach((item) => {
        const counterSpan = parseInt(item.querySelector(".item-buttons span").innerText)
        total += counterSpan
    })

    // Valores posibles
    try {
        if (total > 9) {
            elementCounter.innerText = "+9"
        } else {
            elementCounter.innerText = total.toString()
        }

        // Aparecer/Ocultar el contador
        if (total === 0) {
            elementCounter.style.opacity = "0"
        } else {
            elementCounter.style.opacity = "1"
        }
    } catch (e) {
        console.log("Element counter not found")
    }
}
// Función para guardar el contador del carrito y los items en el localStorage
function saveItems() {
    //Array con cada contador de los items
    const values = []
    items.forEach((item) => {
        const counterSpan = item.querySelector(".item-buttons span")
        values.push(counterSpan.innerText)
    })
    localStorage.setItem("cart", elementCounter.innerText)
    localStorage.removeItem("items")
    localStorage.setItem("items", JSON.stringify(values))
    console.log("values saved: " + values)
    localStorage.setItem("billData", billElement.innerHTML)
}
// Función para cargar los items del localStorage en el DOM
function loadItems() {
    //Carrito
    try {
        elementCounter.innerText = localStorage.getItem("cart")
        console.log("cart loaded: " + elementCounter.innerText)
    } catch (e) {
        console.log("Cart element not found")
    }

    //Items individuales
    const storedItems = JSON.parse(localStorage.getItem("items")) || []
    console.log("loaded items: " + storedItems)
    items.forEach((item, index) => {
        const counterSpan = item.querySelector(".item-buttons span")
        counterSpan.innerText = storedItems[index] || "0"
    })
    //Factura
    try {
        billElement.innerHTML = localStorage.getItem("billData")
    } catch (e) {
        console.log("Bill element not found")
    }
}
// Función para crear la factura
function createBill() {
    billElement.innerHTML = ""
    let total = 0
    //Crea la lista desordenada
    let bill = document.createElement("ul")
    //Recorre cada item
    items.forEach((item) => {
        const itemName = item.querySelector(".item-content span").innerText
        const itemPrice = parseFloat(item.querySelector(".item-price").innerText.replace("$", "")).toFixed(2)
        const itemAmount = parseInt(item.querySelector(".item-buttons span").innerText)

        //Si la cantidad del item es mayor a cero
        if (itemAmount > 0) {
            total += itemAmount * itemPrice
            //Agrega el item a la lista
            bill.innerHTML += `<li>${itemName}: ${itemAmount} x ${itemPrice + "$"} = ${(itemAmount * itemPrice).toFixed(2) + "$"}</li>`
        }
    })
    //Agrega el total
    bill.innerHTML += `<hr>`
    bill.innerHTML += `<li>Total: ${total.toFixed(2) + "$"}</li>`

    //Guarda la lista en el localStorage
    localStorage.setItem("billData", bill.innerHTML)
    billElement.appendChild(bill)
}
