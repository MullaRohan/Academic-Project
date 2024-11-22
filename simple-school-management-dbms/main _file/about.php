<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-image: url('http://localhost:8080/school_management/images/about_background.jpg');
            background-size: cover;
            background-position: center;
            height: 100vh;
            font-family: 'Times New Roman', Times, serif;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
        }
        .about-container {
            background-color: rgba(255, 255, 255, 0.85);
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            max-width: 800px;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        h1 {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 20px;
            text-decoration: underline;
            width: 100%;
        }
        p {
            margin-bottom: 20px;
        }
        .submit-container {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }
        .submit-box {
            background-color: #e0e0e0;
            padding: 15px;
            border-radius: 10px;
            text-align: left;
            font-size: 16px;
            margin-top: 20px;
            width: 45%;
        }
        .redirect-button {
            margin-top: 30px;
            background-color: #007bff;
            color: white;
            padding: 05px 10px;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            text-align: center;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .redirect-button:hover {
            background-color: #cc0066;
        }
    </style>
</head>
<body>
    <div class="about-container">
        <h1>About Project</h1>
        <p>Second Year final project of Database Management System.<br/>Department of CSE,<br>
         <font size="5">RABINDRA MAITREE UNIVERSITY.</font></p>
        
        <div class="submit-container">
            <div class="submit-box">
                <p><strong>Submitted by:</strong><br>
                Name: Rohan Mulla <br>
                Student ID: 087-22-22-00-05101-019 <br>
                Department: CSE <br>
                Admission Semester: 2022/02 <br>
                Level: 2/2
                </p>
            </div>

            <div class="submit-box">
                <p><strong>Submitted to:</strong><br>
                Name: <b>MD Kamrul Islam</b> <br>
                Department: CSE <br>
                Lecturer <br>
                Department of CSE <br>
                Rabindra Maitree University
                </p>
            </div>
        </div>

        <!-- Button for redirect -->
        <button class="redirect-button" onclick="window.location.href='http://localhost:8080/school_management/home.php'">
            Go to Home
        </button>
    </div>
</body>
</html>
