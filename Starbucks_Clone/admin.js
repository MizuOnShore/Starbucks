$(document).ready(function() {
    // Function to fetch and display users
    function fetchUsers() {
        var users = JSON.parse(localStorage.getItem("users")) || [];
        var $userList = $("#user-list");
        $userList.empty(); // Clear previous users
        users.forEach(function(user) {
            var $row = $("<tr></tr>");
            $row.append("<td>" + user.email + "</td>");
            var $deleteButton = $("<button class='btn btn-danger'>Delete</button>");
            $deleteButton.click(function() {
                deleteUser(user.email);
            });
            var $actionCell = $("<td></td>");
            $actionCell.append($deleteButton);
            $row.append($actionCell);
            $userList.append($row);
        });
    }

    // Function to delete a user
    function deleteUser(email) {
        var users = JSON.parse(localStorage.getItem("users")) || [];
        var updatedUsers = users.filter(function(user) {
            return user.email !== email;
        });
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        fetchUsers(); // Refresh user list
    }

    // Function to sign out
    function signOut() {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("isAdmin"); // Remove admin flag
        window.location.href = "index.html"; // Redirect to index.html
    }

    // Call fetchUsers on page load
    fetchUsers();

    // Attach click event handler to signout button
    $("#signout-btn").click(signOut);
});
