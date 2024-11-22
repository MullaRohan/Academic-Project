
<?php
session_start();
include 'db_connection.php';

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Get the logged-in user's ID from the session
$user_id = $_SESSION['user_id'];

// Fetch teacher details from the teachers table
$query = "SELECT id, name, department, phone_number, address FROM teachers WHERE user_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $teacher = $result->fetch_assoc();
    $id = $teacher['id'];
    $name = $teacher['name'] ?? '';
    $department = $teacher['department'] ?? '';
    $phone_number = $teacher['phone_number'] ?? '';
    $address = $teacher['address'] ?? '';
} else {
    // Handle case where teacher data isn't found
    echo "No teacher found!";
    exit();
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Teacher Info</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-image: url('http://localhost:8080/school_management/images/student_dashboard_background.jpg.jpg');
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        .form-container {
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 15px;
            padding: 20px;
            width: 50%;
            margin: 100px auto;
            box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
        }

        label {
            font-weight: bold;
        }

        input[type="text"], select {
            width: 100%;
            padding: 10px;
            margin: 8px 0;
            display: inline-block;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
        }

        input[type="submit"] {
            background-color: #4CAF50;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
        }

        input[type="submit"]:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>

<div class="form-container">
    <form action="update_teacher_info.php" method="POST">
        <label for="id">ID:</label>
        <input type="text" id="id" name="id" value="<?php echo htmlspecialchars($id); ?>" readonly>

        <label for="name">Name:</label>
        <input type="text" id="name" name="name" value="<?php echo htmlspecialchars($name); ?>">

        <label for="department">Department:</label>
        <select id="department" name="department">
            <option value="CSE" <?php if ($department == 'CSE') echo 'selected'; ?>>CSE</option>
            <option value="EEE" <?php if ($department == 'EEE') echo 'selected'; ?>>EEE</option>
            <option value="CIVIL" <?php if ($department == 'CIVIL') echo 'selected'; ?>>CIVIL</option>
            <option value="MICRO BIOLOGY" <?php if ($department == 'MICRO BIOLOGY') echo 'selected'; ?>>MICRO BIOLOGY</option>
        </select>

        <label for="phone_number">Phone Number:</label>
        <input type="text" id="phone_number" name="phone_number" value="<?php echo htmlspecialchars($phone_number); ?>">

        <label for="address">Address:</label>
        <input type="text" id="address" name="address" value="<?php echo htmlspecialchars($address); ?>">

        <input type="submit" value="Update Info">
    </form>
</div>

</body>
</html>
