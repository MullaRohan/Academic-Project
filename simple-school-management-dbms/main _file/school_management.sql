-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 06, 2024 at 11:18 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `school_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `privileges` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `session` varchar(50) DEFAULT NULL,
  `father_name` varchar(100) DEFAULT NULL,
  `mother_name` varchar(100) DEFAULT NULL,
  `present_address` text DEFAULT NULL,
  `permanent_address` text DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `user_id`, `department`, `session`, `father_name`, `mother_name`, `present_address`, `permanent_address`, `phone_number`, `name`) VALUES
(3, 8, 'CSE', '2022/2', 'habiber abba', 'habiber maa', 'habiber bari, kushtia, khulna', 'kushtiar match', '01888888888', 'Habibur Rahman'),
(19, 3, 'CSE', '2022/2', 'Md. Abdur Razzak', 'Mrs, Rebeka Begum', 'Nowpara, Mirpur, Kushtia', 'Nowpara, Mirpur, Kushtia', '1867799622', 'Rohan Mulla');

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id`, `user_id`, `department`, `phone_number`, `name`, `address`) VALUES
(1, 2, 'CSE', '01879466161649', 'Rohan Teacher', 'Noya Mirpur, Kushtia, Khulna, Bangladesh'),
(2, 4, 'MICRO BIOLOGY', '0112233445', 'Rohan Microbiology', 'Trimohoni Kushtia');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','teacher','admin') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Rohan', 'rohanadmin@gmail.com', '$2y$10$bXX1tKQ1aEyJexwReGEDFO0fkZb.uDo2bQAL9M0ODCaP19M.YqVJC', 'admin', '2024-10-04 08:43:03', '2024-10-04 08:43:03'),
(2, 'Rohan', 'rohanteacher@gmail.com', '$2y$10$4Qr90FpGu1Uwkabjo3Az5eh4LB7jZymw7JOXmG24og5LLfH2L61BK', 'teacher', '2024-10-04 08:43:25', '2024-10-04 08:43:25'),
(3, 'Rohan', 'rohanstudent@gmail.com', '$2y$10$EhNwx8nqNqmqPiIUQxHp1eR.a4MK8U0ZiaLGJJ0tjGSe9JOYDc.Xe', 'student', '2024-10-04 08:43:47', '2024-10-04 08:43:47'),
(4, 'rohan Teacher Microbiology', 'rohanmicrobiology@gmail.com', '$2y$10$6IwlwkeekRSlzQWTinXQFOVciZ2H4u74gZxeoTaLzP3fD8M6kH5tu', 'teacher', '2024-10-04 11:13:02', '2024-10-04 11:13:02'),
(5, 'Rohan Test', 'rohanteststudent@gmail.com', '$2y$10$3O/fb.SxWGBeM3OAkw7pwOGJSkb.Bgk4yU4zFiwm3UAfo/ktDNIoe', 'student', '2024-10-04 12:39:18', '2024-10-04 12:39:18'),
(8, 'habib', 'habib@gmai.com', '$2y$10$AuxPWiQ4r9ohcnCf07LKze5SlGX/sgVabgDLzX8A5sHberzbPxIBq', 'student', '2024-10-06 07:21:36', '2024-10-06 07:21:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9223372036854775807;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
