<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Student Info</title>
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
            background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent white */
            border-radius: 15px; /* Rounded corners */
            padding: 20px;
            width: 50%; /* Adjust the width as needed */
            margin: 100px auto; /* Center the form */
            box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3); /* Shadow for the floating effect */
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
    <form action="update_student_info.php" method="POST">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" value="">

        <label for="father_name">Father's Name:</label>
        <input type="text" id="father_name" name="father_name" value="">

        <label for="mother_name">Mother's Name:</label>
        <input type="text" id="mother_name" name="mother_name" value="">

        <label for="present_address">Present Address:</label>
        <input type="text" id="present_address" name="present_address" value="">

        <label for="permanent_address">Permanent Address:</label>
        <input type="text" id="permanent_address" name="permanent_address" value="">

        <label for="phone_number">Phone Number (+880):</label>
        <input type="text" id="phone_number" name="phone_number" value="">

        <label for="department">Department:</label>
        <select id="department" name="department">
            <option value="" disabled selected>Select Department</option>
            <option value="CSE">CSE</option>
            <option value="EEE">EEE</option>
            <option value="EEE">ICT</option>
            <option value="EEE">CIVIL</option>
            <option value="EEE">MICRO BIOLOGY</option>
            <option value="EEE">BANGLA</option>
            <option value="EEE">ENGLISH</option>
            <!-- Add more options as needed -->
        </select>

        <label for="session">Session:</label>
        <input type="text" id="session" name="session" value="">

        <label for="student_id">ID:</label>
        <input type="text" id="student_id" name="student_id" value="">

        <input type="submit" value="Update Info">
    </form>
</div>

</body>
</html>
