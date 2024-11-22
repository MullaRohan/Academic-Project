<?php
include 'db_connection.php';

// Handle form submission (Create or Update)
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['id']) && $_POST['id'] != "") {
        // Update existing record
        $id = $_POST['id'];
        $name = $_POST['name'];
        $email = $_POST['email'];
        $role = $_POST['role'];

        $sql = "UPDATE users SET name='$name', email='$email', role='$role' WHERE id=$id";
        if ($conn->query($sql) === TRUE) {
            echo "Record updated successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else {
        // Insert new record
        $name = $_POST['name'];
        $email = $_POST['email'];
        $role = $_POST['role'];

        $sql = "INSERT INTO users (name, email, role) VALUES ('$name', '$email', '$role')";
        if ($conn->query($sql) === TRUE) {
            echo "New record created successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
}

// Handle deletion
if (isset($_GET['delete_id'])) {
    $delete_id = $_GET['delete_id'];
    $sql = "DELETE FROM users WHERE id=$delete_id";
    if ($conn->query($sql) === TRUE) {
        echo "Record deleted successfully";
    } else {
        echo "Error deleting record: " . $conn->error;
    }
}

// Fetch all records
$sql = "SELECT * FROM users";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRUD Operations</title>
</head>
<body>

<h2>Create or Update User</h2>
<form action="crud.php" method="POST">
    <input type="hidden" name="id" value="<?php echo isset($_GET['edit_id']) ? $_GET['edit_id'] : ''; ?>">
    <label for="name">Name:</label>
    <input type="text" name="name" value="<?php echo isset($_GET['edit_name']) ? $_GET['edit_name'] : ''; ?>" required><br>
    <label for="email">Email:</label>
    <input type="email" name="email" value="<?php echo isset($_GET['edit_email']) ? $_GET['edit_email'] : ''; ?>" required><br>
    <label for="role">Role:</label>
    <select name="role" required>
        <option value="student" <?php echo (isset($_GET['edit_role']) && $_GET['edit_role'] == 'student') ? 'selected' : ''; ?>>Student</option>
        <option value="teacher" <?php echo (isset($_GET['edit_role']) && $_GET['edit_role'] == 'teacher') ? 'selected' : ''; ?>>Teacher</option>
    </select><br>
    <button type="submit"><?php echo isset($_GET['edit_id']) ? 'Update' : 'Create'; ?> User</button>
</form>

<h2>User List</h2>
<table border="1">
    <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Actions</th>
    </tr>
    <?php
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo "<tr>
                    <td>" . $row["id"] . "</td>
                    <td>" . $row["name"] . "</td>
                    <td>" . $row["email"] . "</td>
                    <td>" . $row["role"] . "</td>
                    <td>
                        <a href='crud.php?edit_id=" . $row["id"] . "&edit_name=" . $row["name"] . "&edit_email=" . $row["email"] . "&edit_role=" . $row["role"] . "'>Edit</a> |
                        <a href='crud.php?delete_id=" . $row["id"] . "'>Delete</a>
                    </td>
                  </tr>";
        }
    } else {
        echo "<tr><td colspan='5'>No users found</td></tr>";
    }
    ?>
</table>

</body>
</html>

<?php
$conn->close();
?>
