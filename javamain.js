function getProductKeys() {
    let keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key !== "global_units_sold" && key !== "global_revenue") {
            keys.push(key);
        }
    }
    return keys;
}

function add_fun() {
    let name = document.querySelector(".name").value.trim();
    let price = document.querySelector(".price").value;
    let quantity = document.querySelector(".quantity").value;

    if (name === "" || price === "" || quantity === "") {
        alert("Please fill in all fields");
        return;
    }
    if (Number(price) <= 0 || Number(quantity) <= 0) {
        alert("Price and quantity must be greater than zero");
        return;
    }

    let existing = JSON.parse(localStorage.getItem(name)) || [];
    let currentQty = existing[2] ? Number(existing[2]) : 0;
    let product = [name, Number(price), currentQty + Number(quantity)];
    localStorage.setItem(name, JSON.stringify(product));

    document.querySelector(".name").value = "";
    document.querySelector(".price").value = "";
    document.querySelector(".quantity").value = "";

    alert("Added successfully!");
    displayProducts();
}

function deleteProduct(key) {
    if (confirm('Delete "' + key + '"?')) {
        localStorage.removeItem(key);
        displayProducts();
    }
}

function displayProducts() {
    let show = document.querySelector(".show");
    if (!show) return;
    show.innerHTML = "";
    let keys = getProductKeys();
    if (keys.length === 0) {
        show.innerHTML = '<p style="color:#888;margin-top:10px;">No products yet.</p>';
        return;
    }
    keys.forEach(function(key) {
        let item = JSON.parse(localStorage.getItem(key));
        if (item && Array.isArray(item)) {
            show.innerHTML +=
                '<div class="pro">' +
                '<h3>' + item[0] + '</h3>' +
                '<p>Price: $' + Number(item[1]).toFixed(2) + '</p>' +
                '<p>Stock: <b>' + item[2] + '</b></p>' +
                '<button class="delete-btn" onclick="deleteProduct(\'' + item[0] + '\')">Delete</button>' +
                '</div>';
        }
    });
}

function populateSaleDropdown() {
    let select = document.getElementById("saleName");
    if (!select) return;
    select.innerHTML = '<option value="">-- Select a product --</option>';
    let keys = getProductKeys();
    keys.forEach(function(key) {
        let item = JSON.parse(localStorage.getItem(key));
        if (item && Array.isArray(item)) {
            select.innerHTML += '<option value="' + item[0] + '">' + item[0] + ' (Stock: ' + item[2] + ')</option>';
        }
    });
}

function makeSale() {
    let name = document.getElementById("saleName").value;
    let qtyToSell = Number(document.getElementById("saleQty").value);
    let status = document.getElementById("saleStatus");

    if (!name) { status.innerText = "Please select a product!"; status.style.color = "red"; return; }
    if (!qtyToSell || qtyToSell <= 0) { status.innerText = "Enter a valid quantity!"; status.style.color = "red"; return; }

    let productData = JSON.parse(localStorage.getItem(name));
    if (!productData) { status.innerText = "Product not found!"; status.style.color = "red"; return; }

    let currentStock = Number(productData[2]);
    let price = Number(productData[1]);

    if (qtyToSell > currentStock) {
        status.innerText = "Only " + currentStock + " left in stock!";
        status.style.color = "red";
        return;
    }

    productData[2] = currentStock - qtyToSell;
    localStorage.setItem(name, JSON.stringify(productData));
    localStorage.setItem("global_units_sold", (Number(localStorage.getItem("global_units_sold")) || 0) + qtyToSell);
    localStorage.setItem("global_revenue", (Number(localStorage.getItem("global_revenue")) || 0) + (qtyToSell * price));

    status.innerText = "Sold " + qtyToSell + " x " + name + " for $" + (qtyToSell * price).toFixed(2);
    status.style.color = "green";
    document.getElementById("saleQty").value = "";
    populateSaleDropdown();
}

function loadInventory() {
    let body = document.getElementById("inventoryBody");
    if (!body) return;
    body.innerHTML = "";
    let keys = getProductKeys();
    if (keys.length === 0) {
        body.innerHTML = '<tr><td colspan="4" style="padding:14px;color:#888;">No products yet.</td></tr>';
        return;
    }
    keys.forEach(function(key) {
        let item = JSON.parse(localStorage.getItem(key));
        if (item && Array.isArray(item)) {
            let stock = Number(item[2]);
            let isLow = stock <= 5;
            let badge = isLow
                ? '<span style="color:#c0392b;font-weight:bold;">⚠ Low Stock</span>'
                : '<span style="color:#27ae60;">In Stock</span>';
            body.innerHTML +=
                '<tr style="border-bottom:1px solid #ddd;' + (isLow ? 'background:#fff0f0;' : '') + '">' +
                '<td style="padding:10px;">' + item[0] + '</td>' +
                '<td style="padding:10px;">$' + Number(item[1]).toFixed(2) + '</td>' +
                '<td style="padding:10px;">' + item[2] + '</td>' +
                '<td style="padding:10px;">' + badge + '</td>' +
                '</tr>';
        }
    });
}

function loadDashboard() {
    if (!document.getElementById("dash-products")) return;
    document.getElementById("dash-units").innerText = localStorage.getItem("global_units_sold") || 0;
    document.getElementById("dash-rev").innerText = "$" + Number(localStorage.getItem("global_revenue") || 0).toFixed(2);
    document.getElementById("dash-products").innerText = getProductKeys().length;
}

window.onload = function() {
    loadDashboard();
    displayProducts();
    populateSaleDropdown();
    loadInventory();
};
