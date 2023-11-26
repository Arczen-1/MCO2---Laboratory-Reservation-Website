document.addEventListener("DOMContentLoaded", function() {
    var isAuthenticated = localStorage.getItem("isAuthenticated");

    // Check if the user is already authenticated
    if (isAuthenticated === "true") {
        // Clear authentication status and redirect to the login page on automatic logout
        localStorage.setItem("isAuthenticated", "false");
        localStorage.setItem("username", "");
        window.location.href = "login.html"; // Redirect to the login page after automatic logout
    }

    var welcomeMessageElement = document.getElementById("welcome-message");
    welcomeMessageElement.textContent = "Welcome, Guest!";

    
});


