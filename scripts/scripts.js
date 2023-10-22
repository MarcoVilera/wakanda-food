// Obtener todos los elementos con la clase "item"
const items = document.querySelectorAll(".item")

// Obtener el elemento del contador general
const elementCounter = document.getElementById("element-counter")
updateElementCounter()
document.addEventListener("DOMContentLoaded", () => {
    loadItems()
    loadCart()
    if (elementCounter.innerText != "0") {
        elementCounter.style.opacity = "1"
    }
    //updateElementCounter()
})
// Recorrer cada elemento y agregar el evento de clic a los botones de incremento y decremento
items.forEach((item) => {
    const incrementButton = item.querySelector(".btn-increment")
    const decrementButton = item.querySelector(".btn-decrement")
    const counterSpan = item.querySelector(".item-buttons span")

    // Obtener el valor guardado en el localStorage para este item
    const savedValue = localStorage.getItem(item.id)

    // Verificar si hay un valor guardado en el localStorage
    if (savedValue !== null) {
        // Restaurar el valor del contador desde el localStorage
        counterSpan.innerText = savedValue
    }

    incrementButton.addEventListener("click", () => {
        // Obtener el valor actual del contador y convertirlo a número
        let counterValue = parseInt(counterSpan.innerText)

        // Aumentar el valor del contador
        counterValue++

        // Actualizar el valor del contador en el span
        counterSpan.innerText = counterValue.toString()

        // Guardar el valor en el localStorage para este item
        localStorage.setItem(item.id, counterValue.toString())

        // Actualizar el contador general
        updateElementCounter()
    })

    decrementButton.addEventListener("click", () => {
        // Obtener el valor actual del contador y convertirlo a número
        let counterValue = parseInt(counterSpan.innerText)

        // Verificar que el valor del contador sea mayor que cero antes de decrementar
        if (counterValue > 0) {
            // Decrementar el valor del contador
            counterValue--

            // Actualizar el valor del contador en el span
            counterSpan.innerText = counterValue.toString()

            // Guardar el valor en el localStorage para este item
            localStorage.setItem(item.id, counterValue.toString())

            // Actualizar el contador general
            updateElementCounter()
        }
    })
})

// Función para actualizar el contador general
function updateElementCounter() {
    let total = 0

    // Obtener el valor de cada contador individual y sumarlo al total
    items.forEach((item) => {
        const counterSpan = item.querySelector(".item-buttons span")
        const counterValue = parseInt(counterSpan.innerText)
        total += counterValue

        // Guardar el valor en el localStorage para este item
        localStorage.setItem(item.id, counterValue.toString())
    })

    // Actualizar el valor del contador general
    if (total > 9) {
        elementCounter.innerText = "+9"
    } else {
        elementCounter.innerText = total.toString()
    }

    // Actualizar la opacidad del span
    if (total === 0) {
        elementCounter.style.opacity = "0"
    } else {
        elementCounter.style.opacity = "1"
    }
}
try {
    facturaElement = document.getElementById("factura-div")
    const cantidadElementos = {}
    const ordenIngreso = []
    facturaElement.innerHTML = localStorage.getItem("facturaText")
    items.forEach((item) => {
        const btnIncrement = item.querySelector(".btn-increment")
        const btnDecrement = item.querySelector(".btn-decrement")

        const itemName = item.querySelector(".item-content span").innerText
        const itemPrecio = parseFloat(item.querySelector(".item-price").innerText.replace("$", ""))

        // Inicializar la cantidad del elemento en 0
        cantidadElementos[itemName] = 0
        // Agregar el nombre del elemento al array de orden de ingreso
        ordenIngreso.push(itemName)

        btnIncrement.addEventListener("click", () => {
            cantidadElementos[itemName]++
            const facturaText = generarFacturaText()

            facturaElement.innerHTML = facturaText

            // Guardar el contenido de factura-div en el localStorage
            localStorage.setItem("facturaText", facturaText)

            console.log(facturaText)
        })

        btnDecrement.addEventListener("click", () => {
            cantidadElementos[itemName] = Math.max(0, cantidadElementos[itemName] - 1)
            const facturaText = generarFacturaText()
            facturaElement.innerHTML = facturaText

            // Guardar el contenido de factura-div en el localStorage
            localStorage.setItem("facturaText", facturaText)

            console.log(facturaText)
        })
    })
    // FIXME Arreglar problemas con las facturas al refrescar
    function generarFacturaText() {
        let facturaText = ""
        let total = 0
        // Recorrer el array de orden de ingreso
        for (const itemName of ordenIngreso) {
            const count = cantidadElementos[itemName]
            if (count > 0) {
                let itemPrecio
                for (const item of items) {
                    if (item.querySelector(".item-content span").innerText === itemName) {
                        itemPrecio = parseFloat(
                            item.querySelector(".item-price").innerText.replace("$", "")
                        ).toFixed(2)

                        break
                    }
                }

                const subtotal = (count * itemPrecio).toFixed(2)
                total += parseFloat(subtotal)
                facturaText += `<li>${itemName}: ${count} x ${itemPrecio + "$"} = ${subtotal}</li>`
            }
        }
        facturaText += `<li>Total: ${total}</li>`
        saveItems()
        return facturaText ? `<ul>${facturaText}</ul>` : ""
    }
} catch (error) {
    console.log(error)
}

function saveItems() {
    const valores = []
    // Obtener el valor de cada contador individual y sumarlo al total
    items.forEach((item) => {
        const counterSpan = item.querySelector(".item-buttons span")
        valores.push(counterSpan.innerText)
    })
    localStorage.setItem("cart", elementCounter.innerText)
    localStorage.removeItem("items")
    localStorage.setItem("items", JSON.stringify(valores))
    console.log(valores)
}

function loadItems() {
    const storedItems = JSON.parse(localStorage.getItem("items")) || []

    items.forEach((item, index) => {
        const counterSpan = item.querySelector(".item-buttons span")
        counterSpan.innerText = storedItems[index] || "0"
    })
}
function loadCart() {
    elementCounter.innerText = localStorage.getItem("cart")
    console.log(elementCounter.innerText)
}
