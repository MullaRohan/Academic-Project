<?php
require_once 'db_connection.php';
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] != 'admin') {
    header("Location: login.php");
    exit();
}
$sql = "SELECT * FROM students ORDER BY id ASC";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student List</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-image: url('http://localhost:8080/school_management/images/admin_dashboard_background.jpg');
            background-size: cover;
            background-position: center;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
        }
        .container {
            background-color: rgba(255, 255, 255, 0.9);
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 1200px;
            width: 100%;
        }
        h2 {
            font-family: 'Times New Roman', serif;
            font-size: 33px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
        }
        th {
            background-color: #99cc66;
            color: white;
        }
        tr:nth-child(odd) {
            background-color: #ECFFDC;
        }
        tr:nth-child(even) {
            background-color: #C1E1C1;
        }

        /* Flexbox to align buttons */
        td.action-buttons {
            display: flex;
            gap: 10px; /* Space between buttons */
            justify-content: flex-start; /* Aligns buttons to the left */
        }

        .btn-custom, .btn-warning, .btn-danger {
            padding: 8px 12px;
            border-radius: 5px;
            border: none;
            transition: background-color 0.3s ease;
            display: inline-block;
        }
        .btn-danger {
            background-color: #dc3545;
            color: white;
        }
        .btn-warning {
            background-color: #ffc107;
            color: white;
        }
        .btn-sm {
            font-size: 12px;
            padding: 5px 10px;
        }
    </style>
</head>
<body>
<div class="container mt-5">
    <h2>Student List</h2>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Father's Name</th>
                <th>Mother's Name</th>
                <th>Present Address</th>
                <th>Permanent Address</th>
                <th>Department</th>
                <th>Session</th>
                <th>Phone Number</th>                
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php while ($row = $result->fetch_assoc()) { ?>
            <tr>
                <td><?php echo $row['id']; ?></td>
                <td><?php echo $row['name']; ?></td>
                <td><?php echo $row['father_name']; ?></td>
                <td><?php echo $row['mother_name']; ?></td>
                <td><?php echo $row['present_address']; ?></td>
                <td><?php echo $row['permanent_address']; ?></td>
                <td><?php echo $row['department']; ?></td>
                <td><?php echo $row['session']; ?></td>
                <td><?php echo $row['phone_number']; ?></td>
                
                <td class="action-buttons">
                <a href="http://localhost:8080/school_management/edit_student_admin.php?id=<?php echo $row['id']; ?>" class="btn btn-warning btn-sm">Edit</a>
                <a href="delete_student.php?id=<?php echo $row['id']; ?>" class="btn btn-danger btn-sm">Delete</a>
                </td>

            </tr>
            <?php } ?>
        </tbody>
    </table>
</div>
</body>
</html>
