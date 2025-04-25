import { menuArray } from "./data.js";

// Render menu items with updated structure
document.getElementById("foods-menu").innerHTML = menuArray.map((item, index) => {
    return `
    <div class="menu-item">
        <div class="menu-item-content">
            <div class="menu-item-emoji">${item.emoji}</div>
            <div class="menu-item-details">
                <h3>${item.name}</h3>
                <p class="ingredients">${item.ingredients.join(", ")}</p>
                <p class="price">$${item.price}</p>
            </div>
        </div>
        <button class="add-btn" data-index="${index}">+</button>
    </div>
    `;
}).join("");

let selectedItems = []

// Function to render selected items
function renderOrder() {
    const orderContainer = document.getElementById("order-list");
    
    if (selectedItems.length === 0) {
        orderContainer.innerHTML = "";
        return;
    }
    
    // Create order section structure
    orderContainer.innerHTML = `
        <div class="order-section">
            <h2 class="order-title">Your order</h2>
            <div class="order-items"></div>
            <hr class="order-divider">
            <div class="order-total">
                <h3>Total price:</h3>
                <h3 class="total-amount">$0</h3>
            </div>
            <button class="complete-order-btn">Complete order</button>
        </div>
    `;
    
    // Add order items
    const orderItemsContainer = document.querySelector(".order-items");
    selectedItems.forEach((item, index) => {
        const orderItemDiv = document.createElement("div");
        orderItemDiv.className = "order-item";
        
        // Create item HTML structure
        orderItemDiv.innerHTML = `
            <div class="item-name-section">
                <h3>${item.name}</h3>
                <button class="remove-btn" data-index="${index}">remove</button>
            </div>
            <span class="item-price">$${item.price}</span>
        `;
        
        // Add to container
        orderItemsContainer.appendChild(orderItemDiv);
    });
    
    // Calculate and set the total price
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);
    document.querySelector(".total-amount").textContent = `$${totalPrice}`;
    
    // Add event listeners to remove buttons
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            const indexToRemove = event.target.getAttribute("data-index");
            selectedItems.splice(indexToRemove, 1);
            
            // If we removed all items, clear the entire order section
            if (selectedItems.length === 0) {
                orderContainer.innerHTML = "";
            } else {
                // Otherwise just re-render
                renderOrder();
            }
        });
    });
    
    // Add event listener to the complete order button
    document.querySelector(".complete-order-btn").addEventListener("click", () => {
        showPaymentModal();
    });
}

// Add event listeners to the + buttons
document.querySelectorAll(".add-btn").forEach(button => {
    button.addEventListener("click", (event) => {
        const index = event.target.getAttribute("data-index");
        selectedItems.push(menuArray[index]);
        renderOrder();
    });
});

// Function to show payment modal
function showPaymentModal() {
    const paymentModal = document.getElementById("payment-modal");
    paymentModal.innerHTML = `
        <div class="modal-content">
            <h2>Enter card details</h2>
            <form id="payment-form">
                <input type="text" id="name" placeholder="Enter your name" required style><br>
                <input type="number" id="card" placeholder="Enter card number" required><br>
                <input type="number" id="cvv" placeholder="Enter CVV" required><br>
                <div class="error-message" id="form-error">All fields are required</div>
                <button type="submit" id="pay-btn">Pay</button>
                <button type="button" id="close-modal">Cancel</button>
            </form>
        </div>
    `;
    //paymentModal.style.display = "flex";
    paymentModal.style.position = "fixed";
        paymentModal.style.top = "0";
        paymentModal.style.left = "0";
        paymentModal.style.width = "100%";
        paymentModal.style.height = "100%";
        paymentModal.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
        paymentModal.style.display = "flex";
        paymentModal.style.justifyContent = "center";
        paymentModal.style.alignItems = "center";
        paymentModal.style.zIndex = "1000";
    
    // Close modal when "Cancel" button is clicked
    document.getElementById("close-modal").addEventListener("click", () => {
        paymentModal.style.display = "none";
    });
    
    // Handle payment form submission
    document.getElementById("payment-form").addEventListener("submit", (e) => {
        e.preventDefault();
        
        const name = document.getElementById("name").value.trim();
        const card = document.getElementById("card").value.trim();
        const cvv = document.getElementById("cvv").value.trim();
        
        // Check if all fields are filled
        if (name === "" || card === "" || cvv === "") {
            document.getElementById("form-error").style.display = "block";
            return;
        }
        
        // If all fields are filled, process payment and show confirmation message
        paymentModal.style.display = "none";
        
        // Display the confirmation message
        const orderContainer = document.getElementById("order-list");
        orderContainer.innerHTML = `
            <div class="order-confirmation">
                <h2>Thanks ${name}, your order is on its way!</h2>
            </div>
        `;
        
        // Clear the order
        selectedItems = [];
    });
}