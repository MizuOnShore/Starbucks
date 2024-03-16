$(document).ready(function() {
    // Check if user is logged in
    var isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
        $("#signin-nav").hide(); // Hide sign in link
        $("#profile-nav").show(); // Show profile link
    } else {
        $("#signin-nav").show(); // Show sign in link
        $("#profile-nav").hide(); // Hide profile link
    }

    // Show signup form and hide login form when "Sign Up" link is clicked
    $("#signup-link").click(function(e) {
        e.preventDefault();
        $("#login-form").hide(); // Hide login form
        $("#signup-form").show(); // Show signup form
        $(".card-header").text("Sign Up"); // Change card header text
    });

    // Show login form and hide signup form when "Login" link is clicked
    $("#login-link").click(function(e) {
        e.preventDefault();
        $("#signup-form").hide(); // Hide signup form
        $("#login-form").show(); // Show login form
        $(".card-header").text("Login"); // Change card header text
    });

    // Handle login form submission
$("#login-form").submit(function(e) {
    e.preventDefault();
    var email = $("#login-email").val();
    var password = $("#login-password").val();
    
    // Validate email
    if (!email) {
        $("#login-email-error").text("Email is required.");
        return;
    } else {
        $("#login-email-error").text(""); // Clear previous error message
    }

    // Validate password
    if (!password) {
        $("#login-password-error").text("Password is required.");
        return;
    } else {
        $("#login-password-error").text(""); // Clear previous error message
    }

    // Check if the entered credentials match the admin credentials
    if (email === "admin@admin.com" && password === "admin") {
        // Set isAdmin flag to true for admin
        localStorage.setItem("isAdmin", true);
        localStorage.setItem("isLoggedIn", true);
        window.location.href = "admin.html"; // Redirect to admin.html for admin
    } else {
        // Proceed with regular user login
        var users = JSON.parse(localStorage.getItem("users")) || [];
        var user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem("isLoggedIn", true);
            window.location.href = "index.html"; // Redirect to index.html for regular user
        } else {
            $("#login-email-error").text("Invalid email or password."); // Show invalid email/password error
        }
    }
});


    // Handle signup form submission
// Handle signup form submission
$("#signup-form").submit(function(e) {
    e.preventDefault();
    // Get form data
    var email = $("#username").val();
    var password = $("#signup-password").val();
    var confirmPassword = $("#confirm-password").val();
    // Validate email
    if (!email) {
        $("#signup-username-error").text("Email is required.");
        return;
    } else {
        $("#signup-username-error").text(""); // Clear previous error message
    }

    // Validate password
    if (!password) {
        $("#signup-password-error").text("Password is required.");
        return;
    } else {
        $("#signup-password-error").text(""); // Clear previous error message
    }

    // Validate confirm password
    if (!confirmPassword) {
        $("#signup-confirm-password-error").text("Please confirm password.");
        return;
    } else if (password !== confirmPassword) {
        $("#signup-confirm-password-error").text("Passwords do not match.");
        return;
    } else {
        $("#signup-confirm-password-error").text(""); // Clear previous error message
    }

    // Check if email is already registered
    var users = JSON.parse(localStorage.getItem("users")) || [];
    var existingUser = users.find(u => u.email === email);
    if (existingUser) {
        $("#signup-username-error").text("Email already registered.");
        return;
    } else {
        $("#signup-username-error").text(""); // Clear previous error message
    }

     // Register new user
     var newUser = { email: email, password: password };
     users.push(newUser);
     localStorage.setItem("users", JSON.stringify(users));
     $("#signup-form")[0].reset(); // Reset form fields
     $("#signup-success-message").text("Account created successfully! Redirecting to login page..."); // Show success message
     setTimeout(function() {
         window.location.href = "login.html"; // Redirect to login page after 2 seconds
     });
 });


    // Handle signout link click
    $("#signout-link").click(function(e) {
        e.preventDefault();
        localStorage.removeItem("isLoggedIn"); // Remove logged in status
        localStorage.removeItem("currentUser"); // Remove current user data
        localStorage.removeItem("cartItems"); // Remove cart items
        window.location.href = "index.html"; // Redirect to index.html
    });

    // Function to calculate the total price of the items in the cart
    function calculateTotalPrice(cartItems) {
        var totalPrice = 0;
        cartItems.forEach(function(item) {
            totalPrice += parseFloat(item.price) * parseInt(item.quantity);
        });
        return totalPrice;
    }

    // Handle the form submission to add items to the cart
    $("form.add-to-cart-form").submit(function(e) {
        e.preventDefault();
        var name = $(this).find("input[name='name']").val();
        var size = $(this).find("select[name='size']").val();
        var quantity = parseInt($(this).find("input[name='quantity']").val());
        var price = parseFloat($(this).find("input[name='price']").val());
        if (isNaN(quantity) || quantity <= 0) {
            alert("Please enter a valid quantity.");
            return;
        }
        var item = { name: name, size: size, quantity: quantity, price: price };
        addToCart(item); // Add the item to the cart
    });

    // Function to display user's orders
    function displayOrders() {
        var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        var $cartItemsContainer = $("#cart-items");
        $cartItemsContainer.empty(); // Clear previous items
        cartItems.forEach(function(item, index) {
            var $itemContainer = $("<li class='list-group-item'></li>");
            $itemContainer.append("<p><strong>Name:</strong> " + item.name + "</p>");
            $itemContainer.append("<p><strong>Size:</strong> " + item.size + "</p>");
            $itemContainer.append("<p><strong>Quantity:</strong> " + item.quantity + "</p>");
            $itemContainer.append("<p><strong>Price:</strong> $" + (parseFloat(item.price) * parseInt(item.quantity)).toFixed(2) + "</p>");
            var $removeButton = $("<button class='btn btn-sm btn-danger'>Remove</button>");
            $removeButton.click(function() {
                cartItems.splice(index, 1);
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                displayOrders();
                updateTotalPrice(); // Update total price after removing item
            });
            $itemContainer.append($removeButton);
            $cartItemsContainer.append($itemContainer);
        });
        updateTotalPrice(); // Update total price
    }

    // Function to update the total price displayed
    function updateTotalPrice() {
        var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        var totalPrice = calculateTotalPrice(cartItems);
        $("#total-price").text(totalPrice.toFixed(2));
    }

    // Function to calculate the total price of the items in the cart
    function calculateTotalPrice(cartItems) {
        var totalPrice = 0;
        cartItems.forEach(function(item) {
            totalPrice += parseFloat(item.price) * parseInt(item.quantity);
        });
        return totalPrice;
    }

    // Call displayOrders on page load
    displayOrders();
});