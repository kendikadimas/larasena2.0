-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 01, 2025 at 02:37 PM
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
-- Database: `lrsn`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('larasena_cache_kendikad@gmail.com|127.0.0.1', 'i:1;', 1760142780),
('larasena_cache_kendikad@gmail.com|127.0.0.1:timer', 'i:1760142780;', 1760142780);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `designs`
--

CREATE TABLE `designs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `canvas_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`canvas_data`)),
  `canvas_width` int(11) NOT NULL DEFAULT 800,
  `canvas_height` int(11) NOT NULL DEFAULT 600,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `preview_3d_models_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `designs`
--

INSERT INTO `designs` (`id`, `title`, `description`, `image_url`, `canvas_data`, `canvas_width`, `canvas_height`, `user_id`, `preview_3d_models_id`, `created_at`, `updated_at`) VALUES
(1, 'batik garis', NULL, '/storage/designs/thumbnails/3_1754736293.jpg', '[{\"id\":\"obj1754676593\",\"x\":-12.449107277831445,\"y\":-3.1078397870745675,\"width\":1038.3827925459561,\"height\":741.0802925459541,\"rotation\":0,\"src\":\"http:\\/\\/localhost:8000\\/storage\\/designs\\/generated\\/3_1754676593.jpg\"}]', 800, 600, 3, NULL, '2025-08-08 11:09:53', '2025-08-09 03:44:53'),
(2, 'seekor burung merak warna mera', NULL, 'designs/generated/3_1754736242.jpg', '[{\"id\":\"obj1754736242\",\"x\":100,\"y\":100,\"width\":600,\"height\":600,\"rotation\":0,\"src\":\"http:\\/\\/localhost:8000\\/storage\\/designs\\/generated\\/3_1754736242.jpg\"}]', 800, 600, 3, NULL, '2025-08-09 03:44:02', '2025-08-09 03:44:02'),
(3, 'motif khas jawa tengah', NULL, 'designs/generated/3_1754736278.jpg', '[{\"id\":\"obj1754736278\",\"x\":100,\"y\":100,\"width\":600,\"height\":600,\"rotation\":0,\"src\":\"http:\\/\\/localhost:8000\\/storage\\/designs\\/generated\\/3_1754736278.jpg\"}]', 800, 600, 3, NULL, '2025-08-09 03:44:38', '2025-08-09 03:44:38'),
(4, 'motif flora dan fauna', NULL, 'designs/generated/3_1754736326.jpg', '[{\"id\":\"obj1754736326\",\"x\":100,\"y\":100,\"width\":600,\"height\":600,\"rotation\":0,\"src\":\"http:\\/\\/localhost:8000\\/storage\\/designs\\/generated\\/3_1754736326.jpg\"}]', 800, 600, 3, NULL, '2025-08-09 03:45:26', '2025-08-09 03:45:26'),
(5, 'motif kalimantan', NULL, 'designs/generated/3_1754736374.jpg', '[{\"id\":\"obj1754736374\",\"x\":100,\"y\":100,\"width\":600,\"height\":600,\"rotation\":0,\"src\":\"http:\\/\\/localhost:8000\\/storage\\/designs\\/generated\\/3_1754736374.jpg\"}]', 800, 600, 3, NULL, '2025-08-09 03:46:14', '2025-08-09 03:46:14'),
(6, 'batik khas papua', NULL, 'designs/generated/3_1754736401.jpg', '[{\"id\":\"obj1754736401\",\"x\":100,\"y\":100,\"width\":600,\"height\":600,\"rotation\":0,\"src\":\"http:\\/\\/localhost:8000\\/storage\\/designs\\/generated\\/3_1754736401.jpg\"}]', 800, 600, 3, NULL, '2025-08-09 03:46:41', '2025-08-09 03:46:41'),
(7, 'batik lereng kangkung', NULL, 'designs/generated/3_1754736493.jpg', '[{\"id\":\"obj1754736493\",\"x\":100,\"y\":100,\"width\":600,\"height\":600,\"rotation\":0,\"src\":\"http:\\/\\/localhost:8000\\/storage\\/designs\\/generated\\/3_1754736493.jpg\"}]', 800, 600, 3, NULL, '2025-08-09 03:48:13', '2025-08-09 03:48:13'),
(8, 'motif parang dan kawung klasik', NULL, 'designs/generated/3_1754736518.jpg', '[{\"id\":\"obj1754736518\",\"x\":100,\"y\":100,\"width\":600,\"height\":600,\"rotation\":0,\"src\":\"http:\\/\\/localhost:8000\\/storage\\/designs\\/generated\\/3_1754736518.jpg\"}]', 800, 600, 3, NULL, '2025-08-09 03:48:38', '2025-08-09 03:48:38'),
(12, 'Desain Batikku', NULL, '/storage/designs/thumbnails/3_1754808203.jpg', '[{\"id\":\"obj1754808147494\",\"x\":776.2785610238734,\"y\":-22.92142066557949,\"src\":\"\\/images\\/motifs\\/2.svg\",\"width\":651.9590007988444,\"height\":651.9590007988444,\"rotation\":0},{\"id\":\"obj1754808143642\",\"x\":328.27856102387346,\"y\":-13.92142066557949,\"src\":\"\\/images\\/motifs\\/2.svg\",\"width\":651.9590007988444,\"height\":651.9590007988444,\"rotation\":0},{\"id\":\"obj1754808131491\",\"x\":-130.72143897612654,\"y\":-8.92142066557949,\"src\":\"\\/images\\/motifs\\/2.svg\",\"width\":651.9590007988444,\"height\":651.9590007988444,\"rotation\":0},{\"id\":\"obj1754808035104\",\"x\":106.40445792284316,\"y\":277.79094078439005,\"src\":\"\\/images\\/motifs\\/4.svg\",\"width\":352.38969905489495,\"height\":352.389699054898,\"rotation\":47.07212475194802},{\"id\":\"obj1754808044144\",\"x\":337.40445792284316,\"y\":78.79094078439005,\"src\":\"\\/images\\/motifs\\/4.svg\",\"width\":352.38969905489495,\"height\":352.389699054898,\"rotation\":47.07212475194802},{\"id\":\"obj1754808047029\",\"x\":567.4044579228432,\"y\":-121.20905921560995,\"src\":\"\\/images\\/motifs\\/4.svg\",\"width\":352.38969905489495,\"height\":352.389699054898,\"rotation\":47.07212475194802},{\"id\":\"obj1754808050075\",\"x\":804.4044579228432,\"y\":-325.20905921560995,\"src\":\"\\/images\\/motifs\\/4.svg\",\"width\":352.38969905489495,\"height\":352.389699054898,\"rotation\":47.07212475194802},{\"id\":\"obj1754808053513\",\"x\":443.4044579228432,\"y\":318.79094078439005,\"src\":\"\\/images\\/motifs\\/4.svg\",\"width\":352.38969905489495,\"height\":352.389699054898,\"rotation\":47.07212475194802},{\"id\":\"obj1754808056248\",\"x\":668.4044579228432,\"y\":116.79094078439005,\"src\":\"\\/images\\/motifs\\/4.svg\",\"width\":352.38969905489495,\"height\":352.389699054898,\"rotation\":47.07212475194802},{\"id\":\"obj1754808059734\",\"x\":899.4044579228432,\"y\":-83.20905921560995,\"src\":\"\\/images\\/motifs\\/4.svg\",\"width\":352.38969905489495,\"height\":352.389699054898,\"rotation\":47.07212475194802},{\"id\":\"obj1754808063655\",\"x\":69.40445792284322,\"y\":9.790940784390045,\"src\":\"\\/images\\/motifs\\/4.svg\",\"width\":352.38969905489495,\"height\":352.389699054898,\"rotation\":47.07212475194802},{\"id\":\"obj1754808066545\",\"x\":305.4044579228432,\"y\":-193.20905921560995,\"src\":\"\\/images\\/motifs\\/4.svg\",\"width\":352.38969905489495,\"height\":352.389699054898,\"rotation\":47.07212475194802},{\"id\":\"obj1754808070886\",\"x\":-72.59699274887411,\"y\":398.3589901887208,\"src\":\"\\/images\\/motifs\\/1.svg\",\"width\":179.22611416866624,\"height\":179.22611416866746,\"rotation\":-40.914985350016124},{\"id\":\"obj1754808079142\",\"x\":49.40300725112587,\"y\":303.3589901887208,\"src\":\"\\/images\\/motifs\\/1.svg\",\"width\":179.22611416866624,\"height\":179.22611416866746,\"rotation\":-40.914985350016124},{\"id\":\"obj1754808081755\",\"x\":173.40300725112587,\"y\":193.35899018872078,\"src\":\"\\/images\\/motifs\\/1.svg\",\"width\":179.22611416866624,\"height\":179.22611416866746,\"rotation\":-40.914985350016124},{\"id\":\"obj1754808084010\",\"x\":292.40300725112587,\"y\":80.35899018872078,\"src\":\"\\/images\\/motifs\\/1.svg\",\"width\":179.22611416866624,\"height\":179.22611416866746,\"rotation\":-40.914985350016124},{\"id\":\"obj1754808086191\",\"x\":413.40300725112587,\"y\":-31.64100981127922,\"src\":\"\\/images\\/motifs\\/1.svg\",\"width\":179.22611416866624,\"height\":179.22611416866746,\"rotation\":-40.914985350016124},{\"id\":\"obj1754808088378\",\"x\":698.4030072511259,\"y\":61.35899018872078,\"src\":\"\\/images\\/motifs\\/1.svg\",\"width\":179.22611416866624,\"height\":179.22611416866746,\"rotation\":-40.914985350016124},{\"id\":\"obj1754808091004\",\"x\":572.4030072511259,\"y\":160.35899018872078,\"src\":\"\\/images\\/motifs\\/1.svg\",\"width\":179.22611416866624,\"height\":179.22611416866746,\"rotation\":-40.914985350016124},{\"id\":\"obj1754808093846\",\"x\":450.4030072511259,\"y\":270.3589901887208,\"src\":\"\\/images\\/motifs\\/1.svg\",\"width\":179.22611416866624,\"height\":179.22611416866746,\"rotation\":-40.914985350016124},{\"id\":\"obj1754808096161\",\"x\":322.4030072511259,\"y\":383.3589901887208,\"src\":\"\\/images\\/motifs\\/1.svg\",\"width\":179.22611416866624,\"height\":179.22611416866746,\"rotation\":-40.914985350016124},{\"id\":\"obj1754808099446\",\"x\":202.40300725112593,\"y\":481.3589901887208,\"src\":\"\\/images\\/motifs\\/1.svg\",\"width\":179.22611416866624,\"height\":179.22611416866746,\"rotation\":-40.914985350016124},{\"id\":\"obj1754808101507\",\"x\":80.40300725112593,\"y\":590.3589901887208,\"src\":\"\\/images\\/motifs\\/1.svg\",\"width\":179.22611416866624,\"height\":179.22611416866746,\"rotation\":-40.914985350016124},{\"id\":\"obj1754808106907\",\"x\":520.9197647636063,\"y\":410.71978307415236,\"src\":\"\\/images\\/motifs\\/17.svg\",\"width\":280.2802169258472,\"height\":280.28021692584724,\"rotation\":0},{\"id\":\"obj1754808112309\",\"x\":667.9197647636063,\"y\":355.71978307415236,\"src\":\"\\/images\\/motifs\\/17.svg\",\"width\":280.2802169258472,\"height\":280.28021692584724,\"rotation\":0},{\"id\":\"obj1754808115173\",\"x\":739.9197647636063,\"y\":213.71978307415236,\"src\":\"\\/images\\/motifs\\/17.svg\",\"width\":280.2802169258472,\"height\":280.28021692584724,\"rotation\":0},{\"id\":\"obj1754808117882\",\"x\":-81.08023523639372,\"y\":-27.28021692584764,\"src\":\"\\/images\\/motifs\\/17.svg\",\"width\":280.2802169258472,\"height\":280.28021692584724,\"rotation\":0},{\"id\":\"obj1754808121104\",\"x\":18.91976476360628,\"y\":-184.28021692584764,\"src\":\"\\/images\\/motifs\\/17.svg\",\"width\":280.2802169258472,\"height\":280.28021692584724,\"rotation\":0}]', 800, 600, 3, NULL, '2025-08-09 23:43:23', '2025-08-09 23:43:23'),
(13, 'batik dengan motif burung di d', NULL, 'designs/generated/3_1754808326.jpg', '[{\"id\":\"obj1754808326\",\"x\":100,\"y\":100,\"width\":600,\"height\":600,\"rotation\":0,\"src\":\"http:\\/\\/127.0.0.1:8000\\/storage\\/designs\\/generated\\/3_1754808326.jpg\"}]', 800, 600, 3, NULL, '2025-08-09 23:45:26', '2025-08-09 23:45:26'),
(14, 'motif burung cendrawasih denga', NULL, 'designs/generated/3_1754808423.jpg', '[{\"id\":\"obj1754808423\",\"x\":100,\"y\":100,\"width\":600,\"height\":600,\"rotation\":0,\"src\":\"http:\\/\\/127.0.0.1:8000\\/storage\\/designs\\/generated\\/3_1754808423.jpg\"}]', 800, 600, 3, NULL, '2025-08-09 23:47:03', '2025-08-09 23:47:03'),
(15, 'burung merak dengan ekor emas', NULL, 'designs/generated/3_1754809262.jpg', '[{\"id\":\"obj1754809262\",\"x\":100,\"y\":100,\"width\":600,\"height\":600,\"rotation\":0,\"src\":\"http:\\/\\/127.0.0.1:8000\\/storage\\/designs\\/generated\\/3_1754809262.jpg\"}]', 800, 600, 3, NULL, '2025-08-10 00:01:02', '2025-08-10 00:01:02'),
(16, 'Desain Keren Nadzare', NULL, '/storage/designs/thumbnails/default.jpg', '\"[]\"', 800, 600, 14, NULL, '2025-08-10 00:33:06', '2025-08-10 00:33:06'),
(17, 'Desain Keren Kafah', NULL, '/storage/designs/thumbnails/default.jpg', '\"[]\"', 800, 600, 15, NULL, '2025-08-10 00:33:06', '2025-08-10 00:33:06'),
(18, 'Desain Keren Edwi', NULL, '/storage/designs/thumbnails/default.jpg', '\"[]\"', 800, 600, 16, NULL, '2025-08-10 00:33:06', '2025-08-10 00:33:06'),
(19, 'Desain Batik Baru', NULL, '/designs/thumbnails/3_1758426022.jpg', '[{\"id\":\"obj1758426020411\",\"x\":362.1999816894531,\"y\":285,\"src\":\"\\/images\\/motifs\\/18.svg\",\"width\":150,\"height\":150,\"rotation\":0}]', 800, 600, 3, NULL, '2025-09-20 20:40:22', '2025-09-20 20:40:22'),
(20, 'Desain Batik Baru', NULL, '/designs/thumbnails/3_1758426823.jpg', '[{\"id\":\"obj1758426820952\",\"x\":321.1999816894531,\"y\":222,\"src\":\"\\/images\\/motifs\\/13.svg\",\"width\":150,\"height\":150,\"rotation\":0}]', 800, 600, 3, NULL, '2025-09-20 20:53:43', '2025-09-20 20:53:43'),
(21, 'burung merak', NULL, '/designs/thumbnails/3_1758427073.jpg', '[{\"id\":\"obj1758427050\",\"x\":7.999999999999545,\"y\":8,\"width\":599.9999999999997,\"height\":579,\"rotation\":0,\"src\":\"http:\\/\\/localhost\\/designs\\/generated\\/3_1758427050.jpg\"}]', 800, 600, 3, NULL, '2025-09-20 20:57:30', '2025-09-20 20:57:53'),
(22, 'Desain Batik Baru', NULL, '/designs/thumbnails/3_1758427155.jpg', '[{\"id\":\"obj1758427085402\",\"x\":-18.80001831054699,\"y\":-56,\"src\":\"\\/images\\/motifs\\/18.svg\",\"width\":644.4483887065525,\"height\":644.4483887065525,\"rotation\":0}]', 800, 600, 3, NULL, '2025-09-20 20:58:07', '2025-09-20 20:59:15'),
(24, 'Desain Batik Baru', NULL, 'designs/thumbnails/3_1760143679.jpg', '[{\"id\":\"obj1760143611933\",\"x\":-356.1202152143726,\"y\":-109.32019690382629,\"src\":\"\\/images\\/motifs\\/22.svg\",\"width\":1408.4885574319464,\"height\":947.4885574319464,\"rotation\":0}]', 800, 600, 3, NULL, '2025-10-10 17:47:14', '2025-10-10 17:47:59'),
(25, 'naruto', NULL, 'designs/generated/3_1760144089.jpg', '[{\"id\":\"obj1760144089\",\"x\":100,\"y\":100,\"width\":600,\"height\":600,\"rotation\":0,\"src\":\"\\/storage\\/designs\\/generated\\/3_1760144089.jpg\"}]', 800, 600, 3, NULL, '2025-10-10 17:54:49', '2025-10-10 17:54:49'),
(26, 'burung garuda', NULL, 'designs/generated/3_1760144183.jpg', '[{\"id\":\"obj1760144183\",\"x\":100,\"y\":100,\"width\":600,\"height\":600,\"rotation\":0,\"src\":\"\\/storage\\/designs\\/generated\\/3_1760144183.jpg\"}]', 800, 600, 3, NULL, '2025-10-10 17:56:23', '2025-10-10 17:56:23'),
(27, 'Desain Keren Nadzare', NULL, '/storage/designs/thumbnails/default.jpg', '\"[]\"', 800, 600, 14, NULL, '2025-10-10 21:41:16', '2025-10-10 21:41:16'),
(28, 'Desain Keren Kafah', NULL, '/storage/designs/thumbnails/default.jpg', '\"[]\"', 800, 600, 15, NULL, '2025-10-10 21:41:16', '2025-10-10 21:41:16'),
(29, 'Desain Keren Edwi', NULL, '/storage/designs/thumbnails/default.jpg', '\"[]\"', 800, 600, 16, NULL, '2025-10-10 21:41:16', '2025-10-10 21:41:16'),
(30, 'Desain Batik Baru', NULL, 'designs/thumbnails/3_1760663483.jpg', '[{\"id\":\"motif-1760663293798\",\"type\":\"image\",\"name\":\"Batik Daun Hutan\",\"imageUrl\":\"\\/images\\/motifs\\/22.svg\",\"x\":-268.3521539392606,\"y\":-133.1690140845073,\"width\":1689.154929577465,\"height\":1231.6901408450708,\"rotation\":0,\"scaleX\":1,\"scaleY\":1},{\"id\":\"VkYW-5-mtSFBuBDXYZpS6\",\"type\":\"image\",\"name\":\"Batik Daun Hutan\",\"imageUrl\":\"\\/images\\/motifs\\/22.svg\",\"x\":1071.2304402386965,\"y\":-219.08963643147848,\"width\":1689.154929577465,\"height\":1231.6901408450708,\"rotation\":0,\"scaleX\":1,\"scaleY\":1}]', 800, 600, 3, NULL, '2025-10-16 18:11:23', '2025-10-16 18:11:23'),
(31, 'Desain Batik Baru', NULL, 'designs/thumbnails/3_1760664210.jpg', '[{\"id\":\"motif-1760664204569\",\"type\":\"image\",\"name\":\"Batik Anggrek\",\"imageUrl\":\"\\/images\\/motifs\\/14.svg\",\"x\":-84.73369607625199,\"y\":33.95883777239743,\"width\":1400.8474576271187,\"height\":834.2615012106537,\"rotation\":0,\"scaleX\":1,\"scaleY\":1}]', 800, 600, 3, NULL, '2025-10-16 18:23:31', '2025-10-16 18:23:31'),
(32, 'Desain Batik Baru', NULL, 'designs/thumbnails/3_1760664774.jpg', '\"[{\\\"id\\\":\\\"motif-1760664770638\\\",\\\"type\\\":\\\"image\\\",\\\"name\\\":\\\"Batik Bunga Matahari\\\",\\\"imageUrl\\\":\\\"\\\\\\/images\\\\\\/motifs\\\\\\/18.svg\\\",\\\"x\\\":283.7605221170778,\\\"y\\\":335.56338028169057,\\\"width\\\":1283.5211267605634,\\\"height\\\":947.7464788732391,\\\"rotation\\\":0,\\\"scaleX\\\":1,\\\"scaleY\\\":1}]\"', 800, 600, 3, NULL, '2025-10-16 18:32:54', '2025-10-16 18:32:54'),
(34, 'Desain Batik Baru', NULL, 'designs/thumbnails/3_1760694329.jpg', '\"[{\\\"id\\\":\\\"motif-1760694319223\\\",\\\"type\\\":\\\"image\\\",\\\"name\\\":\\\"515424014_24099287643000762_7662287561782846282_n\\\",\\\"imageUrl\\\":\\\"\\\\\\/storage\\\\\\/motifs\\\\\\/user\\\\\\/3_1760694307_515424014_24099287643000762_7662287561782846282_n.jpg\\\",\\\"x\\\":157.50893799631785,\\\"y\\\":288.0685067526558,\\\"width\\\":246.85230024213433,\\\"height\\\":312.7118644067791,\\\"rotation\\\":0,\\\"scaleX\\\":1,\\\"scaleY\\\":1}]\"', 800, 800, 3, NULL, '2025-10-17 02:45:29', '2025-10-17 02:45:29'),
(35, 'burung', NULL, 'designs/generated/3_1760782014.jpg', '\"[{\\\"id\\\":\\\"obj1760782014\\\",\\\"type\\\":\\\"image\\\",\\\"x\\\":100,\\\"y\\\":100,\\\"width\\\":600,\\\"height\\\":600,\\\"rotation\\\":0,\\\"imageUrl\\\":\\\"designs\\\\\\/generated\\\\\\/3_1760782014.jpg\\\"}]\"', 800, 600, 3, NULL, '2025-10-18 03:06:54', '2025-10-18 03:06:54');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `konveksis`
--

CREATE TABLE `konveksis` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `rating` decimal(2,1) NOT NULL DEFAULT 0.0,
  `no_telp` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `documentation` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `konveksis`
--

INSERT INTO `konveksis` (`id`, `name`, `location`, `is_verified`, `rating`, `no_telp`, `description`, `documentation`, `icon`, `created_at`, `updated_at`, `user_id`) VALUES
(1, 'Batik Jaya Abadi', 'Pekalongan', 1, 4.8, '081234567001', 'Berpengalaman lebih dari 20 tahun dalam produksi batik tulis dan cap dengan kualitas ekspor.', '[\"\\/storage\\/konveksi\\/gallery\\/sample1.jpg\",\"\\/storage\\/konveksi\\/gallery\\/sample2.jpg\"]', '/storage/konveksi/icons/default.png', '2025-08-08 11:07:32', '2025-08-08 11:07:32', 4),
(2, 'Solo Cantik Garmen', 'Solo', 1, 4.5, '081234567002', 'Spesialis produksi kemeja dan gaun batik modern untuk pasar domestik. Kualitas jahitan butik.', '[\"\\/storage\\/konveksi\\/gallery\\/sample1.jpg\",\"\\/storage\\/konveksi\\/gallery\\/sample2.jpg\"]', '/storage/konveksi/icons/default.png', '2025-08-08 11:07:32', '2025-08-08 11:07:32', 5),
(3, 'Griya Batik Cirebon', 'Cirebon', 0, 4.2, '081234567003', 'Menerima pesanan makloon untuk motif Mega Mendung dan motif khas Cirebon lainnya.', '[\"\\/storage\\/konveksi\\/gallery\\/sample1.jpg\",\"\\/storage\\/konveksi\\/gallery\\/sample2.jpg\"]', '/storage/konveksi/icons/default.png', '2025-08-08 11:07:33', '2025-08-08 11:07:33', 6),
(4, 'Jogja Klasik Konveksi', 'Yogyakarta', 1, 4.7, '081234567004', 'Fokus pada pembuatan seragam kantor dan komunitas dengan sentuhan motif batik klasik.', '[\"\\/storage\\/konveksi\\/gallery\\/sample1.jpg\",\"\\/storage\\/konveksi\\/gallery\\/sample2.jpg\"]', '/storage/konveksi/icons/default.png', '2025-08-08 11:07:33', '2025-08-08 11:07:33', 7),
(5, 'Madura Warna Cemerlang', 'Madura', 0, 4.4, '081234567005', 'Produsen batik Madura dengan ciri khas warna-warna cerah dan motif yang berani.', '[\"\\/storage\\/konveksi\\/gallery\\/sample1.jpg\",\"\\/storage\\/konveksi\\/gallery\\/sample2.jpg\"]', '/storage/konveksi/icons/default.png', '2025-08-08 11:07:33', '2025-08-08 11:07:33', 8),
(6, 'Sentra Batik Lasem', 'Lasem', 1, 4.9, '081234567006', 'Menjaga tradisi Batik Lasem yang kaya akan akulturasi budaya Tionghoa-Jawa.', '[\"\\/storage\\/konveksi\\/gallery\\/sample1.jpg\",\"\\/storage\\/konveksi\\/gallery\\/sample2.jpg\"]', '/storage/konveksi/icons/default.png', '2025-08-08 11:07:34', '2025-08-08 11:07:34', 9),
(7, 'Busana Parahyangan', 'Bandung', 1, 4.6, '081234567007', 'Konveksi modern yang menggabungkan desain fashion terkini dengan motif batik kontemporer.', '[\"\\/storage\\/konveksi\\/gallery\\/sample1.jpg\",\"\\/storage\\/konveksi\\/gallery\\/sample2.jpg\"]', '/storage/konveksi/icons/default.png', '2025-08-08 11:07:34', '2025-08-08 11:07:34', 10),
(8, 'Pesisir Indah Garmen', 'Pekalongan', 0, 4.0, '081234567008', 'Menerima pesanan partai besar untuk produk daster dan pakaian santai bermotif batik.', '[\"\\/storage\\/konveksi\\/gallery\\/sample1.jpg\",\"\\/storage\\/konveksi\\/gallery\\/sample2.jpg\"]', '/storage/konveksi/icons/default.png', '2025-08-08 11:07:34', '2025-08-08 11:07:34', 11),
(9, 'Mahkota Batik Solo', 'Solo', 1, 4.8, '081234567009', 'Menyediakan jasa jahit dan produksi batik premium untuk acara formal dan pernikahan.', '[\"\\/storage\\/konveksi\\/gallery\\/sample1.jpg\",\"\\/storage\\/konveksi\\/gallery\\/sample2.jpg\"]', '/storage/konveksi/icons/default.png', '2025-08-08 11:07:35', '2025-08-08 11:07:35', 12),
(10, 'Karya Anak Bangsa Konveksi', 'Jakarta', 0, 4.3, '081234567010', 'Startup konveksi yang melayani kebutuhan seragam event dan perusahaan di area Jabodetabek.', '[\"\\/storage\\/konveksi\\/gallery\\/sample1.jpg\",\"\\/storage\\/konveksi\\/gallery\\/sample2.jpg\"]', '/storage/konveksi/icons/default.png', '2025-08-08 11:07:35', '2025-08-08 11:07:35', 13),
(11, 'konvek', 'Belum diatur', 0, 0.0, '-', 'Belum ada deskripsi.', NULL, NULL, '2025-10-10 18:11:28', '2025-10-10 18:11:28', NULL),
(12, 'coba', 'Belum diatur', 0, 0.0, '-', 'Belum ada deskripsi.', NULL, NULL, '2025-10-10 20:27:53', '2025-10-10 20:27:53', NULL),
(13, 'konveksi', 'Belum diatur', 0, 0.0, '-', 'Belum ada deskripsi.', NULL, NULL, '2025-10-17 06:18:21', '2025-10-17 06:18:21', NULL),
(14, 'konveksi', 'Jakarta', 0, 0.0, '0987654334567', 'KKKKk', NULL, 'konveksi/icons/IRpITeZQTSrj3pAN8I0I6Q7ITVC9DrejqOPGyQeQ.jpg', '2025-10-26 06:11:33', '2025-10-26 07:35:14', 20),
(15, 'konvek', '', 0, 0.0, '', '', NULL, NULL, '2025-10-26 20:07:31', '2025-10-26 20:07:31', 18);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_08_06_030936_create_preview_3d_models_table', 1),
(5, '2025_08_06_031007_create_motifs_table', 1),
(6, '2025_08_06_031024_create_product_table', 1),
(7, '2025_08_06_031041_create_designs_table', 1),
(8, '2025_08_06_031056_create_productions_table', 1),
(9, '2025_08_07_084222_create_konveksi_table', 1),
(10, '2025_08_08_152949_add_user_id_to_konveksis_table', 1),
(11, '2025_08_08_175835_add_customer_data_to_productions_table', 1),
(12, '2025_10_11_000000_create_user_motifs_table', 2),
(13, '2025_10_17_010037_add_canvas_dimensions_to_designs_table', 3),
(14, '2025_10_18_000002_add_category_to_products_table', 4);

-- --------------------------------------------------------

--
-- Table structure for table `motifs`
--

CREATE TABLE `motifs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `colors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`colors`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `motifs`
--

INSERT INTO `motifs` (`id`, `name`, `description`, `category`, `location`, `image_url`, `file_path`, `colors`, `is_active`, `is_featured`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'Batik Parang Barong', 'Motif klasik dengan makna kekuatan dan keteguhan, biasa digunakan dalam upacara adat.', 'Tradisional', 'Yogyakarta', '/images/motifs/1.svg', '/images/motifs/1.svg', '[\"#8B4513\",\"#D2691E\",\"#F4A460\"]', 1, 1, NULL, '2025-08-08 11:07:32', '2025-08-08 11:07:32'),
(2, 'Batik Kawung Prabu', 'Simbolisasi kesempurnaan hidup dengan pola geometris yang harmonis dan elegan.', 'Tradisional', 'Solo', '/images/motifs/2.svg', '/images/motifs/2.svg', '[\"#654321\",\"#A0522D\",\"#DEB887\"]', 1, 0, NULL, '2025-08-08 11:07:32', '2025-08-08 11:07:32'),
(3, 'Batik Mega Mendung', 'Motif awan yang melambangkan kesabaran dan ketenangan jiwa.', 'Nusantara', 'Cirebon', '/images/motifs/3.svg', '/images/motifs/3.svg', '[\"#1E40AF\",\"#3B82F6\",\"#DBEAFE\"]', 1, 1, NULL, '2025-08-08 11:07:32', '2025-08-08 11:07:32'),
(4, 'Batik Truntum Garuda', 'Motif yang melambangkan cinta kasih yang tumbuh kembali, cocok untuk acara sakral.', 'Tradisional', 'Yogyakarta', '/images/motifs/4.svg', '/images/motifs/4.svg', '[\"#DC2626\",\"#F59E0B\",\"#FEF3C7\"]', 1, 0, NULL, '2025-08-08 11:07:32', '2025-08-08 11:07:32'),
(5, 'Batik Fractal Genesis', 'Perpaduan motif tradisional dengan pola fractal modern yang memukau.', 'Modern', 'Jakarta', '/images/motifs/5.svg', '/images/motifs/5.svg', '[\"#7C3AED\",\"#A855F7\",\"#E0E7FF\"]', 1, 0, NULL, '2025-08-08 11:07:32', '2025-08-08 11:07:32'),
(6, 'Batik Sido Luhur', 'Motif yang melambangkan kehormatan dan kemuliaan hidup.', 'Tradisional', 'Solo', '/images/motifs/6.svg', '/images/motifs/6.svg', '[\"#059669\",\"#10B981\",\"#D1FAE5\"]', 1, 0, NULL, '2025-08-08 11:07:32', '2025-08-08 11:07:32'),
(7, 'Batik Urban Jungle', 'Interpretasi modern dari motif flora dengan sentuhan kontemporer yang segar.', 'Kontemporer', 'Bandung', '/images/motifs/7.svg', '/images/motifs/7.svg', '[\"#16A34A\",\"#22C55E\",\"#BBFBCE\"]', 1, 0, NULL, '2025-08-08 11:07:32', '2025-08-08 11:07:32'),
(8, 'Batik Pekalongan Coastal', 'Motif khas pesisir dengan warna-warna cerah yang mencerminkan kehidupan laut.', 'Nusantara', 'Pekalongan', '/images/motifs/8.svg', '/images/motifs/8.svg', '[\"#0EA5E9\",\"#38BDF8\",\"#E0F2FE\"]', 1, 0, NULL, '2025-08-08 11:07:32', '2025-08-08 11:07:32'),
(13, 'Batik Fractal Genesis', 'Perpaduan motif tradisional dengan pola fractal modern yang memukau.', 'Modern', 'Jakarta', '/images/motifs/5.svg', '/images/motifs/5.svg', '[\"#7C3AED\",\"#A855F7\",\"#E0E7FF\"]', 1, 0, NULL, '2025-08-09 10:20:43', '2025-08-09 10:20:43'),
(18, 'Batik Lereng', 'Motif yang terinspirasi dari lereng gunung dengan pola yang dinamis dan berlapis.', 'Tradisional', 'Malang', '/images/motifs/10.svg', '/images/motifs/10.svg', '[\"#FBBF24\",\"#F59E0B\",\"#FEF3C7\"]', 1, 0, NULL, '2025-08-09 10:20:43', '2025-08-09 10:20:43'),
(20, 'Batik Geometris', 'Motif geometris yang modern dengan kombinasi warna yang berani.', 'Kontemporer', 'Jakarta', '/images/motifs/12.svg', '/images/motifs/12.svg', '[\"#8B5CF6\",\"#A78BFA\",\"#E0D7FF\"]', 1, 0, NULL, '2025-08-09 10:20:43', '2025-08-09 10:20:43'),
(21, 'Batik Bunga Kamboja', 'Motif bunga kamboja yang melambangkan keindahan dan kesegaran, cocok untuk pakaian musim panas.', 'Nusantara', 'Bali', '/images/motifs/13.svg', '/images/motifs/13.svg', '[\"#FBBF24\",\"#F59E0B\",\"#FEF3C7\"]', 1, 0, NULL, '2025-08-09 10:20:43', '2025-08-09 10:20:43'),
(22, 'Batik Anggrek', 'Motif anggrek yang elegan dan anggun, cocok untuk acara formal.', 'Tradisional', 'Jakarta', '/images/motifs/14.svg', '/images/motifs/14.svg', '[\"#A78BFA\",\"#C4B5FD\",\"#EDE9FE\"]', 1, 0, NULL, '2025-08-09 10:20:43', '2025-08-09 10:20:43'),
(24, 'Batik Daun Tropis', 'Motif daun tropis yang segar dan ceria, cocok untuk pakaian musim panas.', 'Kontemporer', 'Jakarta', '/images/motifs/16.svg', '/images/motifs/16.svg', '[\"#16A34A\",\"#22C55E\",\"#BBFBCE\"]', 1, 0, NULL, '2025-08-09 10:20:43', '2025-08-09 10:20:43'),
(25, 'Batik Kupu-Kupu', 'Motif kupu-kupu yang indah dan anggun, melambangkan keindahan dan transformasi.', 'Tradisional', 'Yogyakarta', '/images/motifs/17.svg', '/images/motifs/17.svg', '[\"#F472B6\",\"#EC4899\",\"#FF7F9C\"]', 1, 0, NULL, '2025-08-09 10:20:43', '2025-08-09 10:20:43'),
(26, 'Batik Bunga Matahari', 'Motif bunga matahari yang ceria dan penuh semangat, cocok untuk pakaian santai.', 'Nusantara', 'Bali', '/images/motifs/18.svg', '/images/motifs/18.svg', '[\"#FBBF24\",\"#F59E0B\",\"#FEF3C7\"]', 1, 0, NULL, '2025-08-09 10:20:43', '2025-08-09 10:20:43'),
(27, 'Batik Geometris Modern', 'Motif geometris yang modern dengan kombinasi warna yang berani.', 'Kontemporer', 'Jakarta', '/images/motifs/19.svg', '/images/motifs/19.svg', '[\"#8B5CF6\",\"#A78BFA\",\"#E0D7FF\"]', 1, 0, NULL, '2025-08-09 10:20:43', '2025-08-09 10:20:43'),
(28, 'Batik Bunga Melati', 'Motif bunga melati yang harum dan anggun, melambangkan kesucian dan keindahan.', 'Tradisional', 'Yogyakarta', '/images/motifs/20.svg', '/images/motifs/20.svg', '[\"#F472B6\",\"#EC4899\",\"#FF7F9C\"]', 1, 0, NULL, '2025-08-09 10:20:43', '2025-08-09 10:20:43'),
(29, 'Batik Ombak Hijau', 'Motif ombak dengan nuansa hijau yang menenangkan, cocok untuk pakaian santai.', 'Nusantara', 'Bali', '/images/motifs/21.svg', '/images/motifs/21.svg', '[\"#16A34A\",\"#22C55E\",\"#BBFBCE\"]', 1, 0, NULL, '2025-08-09 10:20:43', '2025-08-09 10:20:43'),
(30, 'Batik Daun Hutan', 'Motif daun hutan yang segar dan alami, cocok untuk pakaian musim panas.', 'Kontemporer', 'Jakarta', '/images/motifs/22.svg', '/images/motifs/22.svg', '[\"#1E3A8A\",\"#3B82F6\",\"#DBEAFE\"]', 1, 0, NULL, '2025-08-09 10:20:43', '2025-08-09 10:20:43'),
(33, 'Batik Mega Mendung', 'Motif awan yang melambangkan kesabaran dan ketenangan jiwa.', 'Nusantara', 'Cirebon', '/images/motifs/3.svg', '/images/motifs/3.svg', '[\"#1E40AF\",\"#3B82F6\",\"#DBEAFE\"]', 1, 1, NULL, '2025-10-10 21:41:42', '2025-10-17 07:03:51'),
(35, 'Batik Fractal Genesis', 'Perpaduan motif tradisional dengan pola fractal modern yang memukau.', 'Modern', 'Jakarta', '/images/motifs/5.svg', '/images/motifs/5.svg', '[\"#7C3AED\",\"#A855F7\",\"#E0E7FF\"]', 1, 0, NULL, '2025-10-10 21:41:42', '2025-10-10 21:41:42'),
(39, 'Batik Modern Flora', 'Perpaduan motif flora dengan pola yang modern dan segar.', 'Kontemporer', 'Jakarta', '/images/motifs/9.svg', '/images/motifs/9.svg', '[\"#F472B6\",\"#EC4899\",\"#FF7F9C\"]', 1, 0, NULL, '2025-10-10 21:41:42', '2025-10-10 21:41:42'),
(42, 'Batik Geometris', 'Motif geometris yang modern dengan kombinasi warna yang berani.', 'Kontemporer', 'Jakarta', '/images/motifs/12.svg', '/images/motifs/12.svg', '[\"#8B5CF6\",\"#A78BFA\",\"#E0D7FF\"]', 1, 0, NULL, '2025-10-10 21:41:42', '2025-10-10 21:41:42'),
(43, 'Batik Bunga Kamboja', 'Motif bunga kamboja yang melambangkan keindahan dan kesegaran, cocok untuk pakaian musim panas.', 'Nusantara', 'Bali', '/images/motifs/13.svg', '/images/motifs/13.svg', '[\"#FBBF24\",\"#F59E0B\",\"#FEF3C7\"]', 1, 0, NULL, '2025-10-10 21:41:42', '2025-10-10 21:41:42'),
(44, 'Batik Anggrek', 'Motif anggrek yang elegan dan anggun, cocok untuk acara formal.', 'Tradisional', 'Jakarta', '/images/motifs/14.svg', '/images/motifs/14.svg', '[\"#A78BFA\",\"#C4B5FD\",\"#EDE9FE\"]', 1, 0, NULL, '2025-10-10 21:41:42', '2025-10-10 21:41:42'),
(45, 'Batik Ombak Biru', 'Motif ombak dengan nuansa biru yang menenangkan, cocok untuk pakaian santai.', 'Nusantara', 'Bali', '/images/motifs/15.svg', '/images/motifs/15.svg', '[\"#2563EB\",\"#3B82F6\",\"#DBEAFE\"]', 1, 0, NULL, '2025-10-10 21:41:42', '2025-10-10 21:41:42'),
(46, 'Batik Daun Tropis', 'Motif daun tropis yang segar dan ceria, cocok untuk pakaian musim panas.', 'Kontemporer', 'Jakarta', '/images/motifs/16.svg', '/images/motifs/16.svg', '[\"#16A34A\",\"#22C55E\",\"#BBFBCE\"]', 1, 0, NULL, '2025-10-10 21:41:42', '2025-10-10 21:41:42'),
(48, 'Batik Bunga Matahari', 'Motif bunga matahari yang ceria dan penuh semangat, cocok untuk pakaian santai.', 'Nusantara', 'Bali', '/images/motifs/18.svg', '/images/motifs/18.svg', '[\"#FBBF24\",\"#F59E0B\",\"#FEF3C7\"]', 1, 0, NULL, '2025-10-10 21:41:42', '2025-10-10 21:41:42'),
(49, 'Batik Geometris Modern', 'Motif geometris yang modern dengan kombinasi warna yang berani.', 'Kontemporer', 'Jakarta', '/images/motifs/19.svg', '/images/motifs/19.svg', '[\"#8B5CF6\",\"#A78BFA\",\"#E0D7FF\"]', 1, 0, NULL, '2025-10-10 21:41:42', '2025-10-10 21:41:42'),
(50, 'Batik Bunga Melati', 'Motif bunga melati yang harum dan anggun, melambangkan kesucian dan keindahan.', 'Tradisional', 'Yogyakarta', '/images/motifs/20.svg', '/images/motifs/20.svg', '[\"#F472B6\",\"#EC4899\",\"#FF7F9C\"]', 1, 0, NULL, '2025-10-10 21:41:42', '2025-10-10 21:41:42'),
(52, 'Batik Daun Hutan', 'Motif daun hutan yang segar dan alami, cocok untuk pakaian musim panas.', 'Kontemporer', 'Jakarta', '/images/motifs/22.svg', '/images/motifs/22.svg', '[\"#1E3A8A\",\"#3B82F6\",\"#DBEAFE\"]', 1, 0, NULL, '2025-10-10 21:41:42', '2025-10-10 21:41:42'),
(53, '515424014_24099287643000762_7662287561782846282_n', 'Motif pribadi', 'Personal', NULL, '/storage/motifs/user/3_1760694307_515424014_24099287643000762_7662287561782846282_n.jpg', 'motifs/user/3_1760694307_515424014_24099287643000762_7662287561782846282_n.jpg', NULL, 1, 0, 3, '2025-10-17 02:45:08', '2025-10-17 02:45:08');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `preview_3d_models`
--

CREATE TABLE `preview_3d_models` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `model_type` enum('kemeja','kaos','daster') NOT NULL,
  `model_url` varchar(255) NOT NULL,
  `previewImageUrl` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `preview_3d_models`
--

INSERT INTO `preview_3d_models` (`id`, `model_type`, `model_url`, `previewImageUrl`, `created_at`, `updated_at`) VALUES
(1, 'kaos', '/models/tshirt.glb', '/images/mockups/tshirt_preview.jpg', '2025-08-08 17:05:27', '2025-08-08 17:05:27');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` enum('fabric','clothing') NOT NULL DEFAULT 'clothing',
  `description` text DEFAULT NULL,
  `base_price` decimal(15,2) NOT NULL,
  `preview_3d_model_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `category`, `description`, `base_price`, `preview_3d_model_id`, `created_at`, `updated_at`) VALUES
(1, 'Kaos Katun Combed 30s', 'clothing', 'Kaos lengan pendek standar berbahan katun combed 30s berkualitas.', 75000.00, 1, '2025-08-08 17:05:27', '2025-08-08 17:05:27'),
(2, 'Kemeja Lengan Panjang', 'clothing', 'Kemeja formal atau kasual dengan bahan katun premium.', 125000.00, 1, '2025-08-08 17:05:27', '2025-08-08 17:05:27'),
(3, 'Polo Shirt', 'clothing', 'Kaos polo dengan bahan yang nyaman dan elegan.', 95000.00, 1, '2025-08-08 17:05:27', '2025-08-08 17:05:27'),
(4, 'Kaos Polos Putih', 'clothing', 'Kaos katun combed 30s', 50000.00, 1, '2025-08-10 00:33:06', '2025-08-10 00:33:06'),
(5, 'Kemeja Flanel', 'clothing', 'Kemeja', 120000.00, 1, '2025-08-10 00:33:06', '2025-08-10 00:33:06'),
(7, 'Kain Polos Batik', 'fabric', 'Kain batik polos tanpa jahitan', 25000.00, NULL, '2025-10-18 10:52:51', '2025-10-18 10:52:51');

-- --------------------------------------------------------

--
-- Table structure for table `productions`
--

CREATE TABLE `productions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `production_status` enum('diterima','ditolak','diproses','dikirim','diterima_selesai') NOT NULL DEFAULT 'diterima',
  `quantity` int(11) NOT NULL,
  `price_per_unit` decimal(15,2) NOT NULL,
  `total_price` decimal(15,2) NOT NULL,
  `payment_proof_url` varchar(255) DEFAULT NULL,
  `payment_status` enum('paid','unpaid','cancelled') NOT NULL DEFAULT 'unpaid',
  `customer_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`customer_data`)),
  `convection_user_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `design_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `productions`
--

INSERT INTO `productions` (`id`, `production_status`, `quantity`, `price_per_unit`, `total_price`, `payment_proof_url`, `payment_status`, `customer_data`, `convection_user_id`, `user_id`, `design_id`, `product_id`, `created_at`, `updated_at`) VALUES
(1, 'diterima', 1, 95000.00, 95000.00, NULL, 'unpaid', '{\"name\":\"User General\",\"company\":null,\"email\":\"user@larasena.com\",\"phone\":\"098745678\",\"address\":\"owdowkodkwo\",\"batik_type\":\"Batik Printing\",\"fabric_size\":\"210 cm x 110 cm (Standar)\",\"deadline\":\"2025-08-22\",\"special_notes\":\"waijdiawjdi\"}', 4, 3, 1, 3, '2025-08-08 17:09:27', '2025-08-08 17:09:27'),
(2, 'diterima', 1, 95000.00, 95000.00, NULL, 'unpaid', '{\"name\":\"User General\",\"company\":null,\"email\":\"user@larasena.com\",\"phone\":\"098745678\",\"address\":\"owdowkodkwo\",\"batik_type\":\"Batik Printing\",\"fabric_size\":\"210 cm x 110 cm (Standar)\",\"deadline\":\"2025-08-22\",\"special_notes\":\"waijdiawjdi\"}', 4, 3, 1, 3, '2025-08-08 17:10:10', '2025-08-08 17:10:10'),
(3, 'diterima', 1, 95000.00, 95000.00, NULL, 'unpaid', '{\"name\":\"User General\",\"company\":null,\"email\":\"user@larasena.com\",\"phone\":\"098745678\",\"address\":\"owdowkodkwo\",\"batik_type\":\"Batik Printing\",\"fabric_size\":\"210 cm x 110 cm (Standar)\",\"deadline\":\"2025-08-22\",\"special_notes\":\"waijdiawjdi\"}', 4, 3, 1, 3, '2025-08-08 17:12:59', '2025-08-08 17:12:59'),
(4, 'diterima', 1, 75000.00, 75000.00, NULL, 'unpaid', '{\"name\":\"User General\",\"company\":\"oeofeo\",\"email\":\"user@larasena.com\",\"phone\":\"098765432\",\"address\":\"kekekekj\",\"batik_type\":\"Batik Printing\",\"fabric_size\":\"210 cm x 110 cm (Standar)\",\"deadline\":\"2025-08-23\",\"special_notes\":\"dwadjadnjadn\"}', 4, 3, 1, 1, '2025-08-08 17:16:37', '2025-08-08 17:16:37'),
(5, 'diterima', 1, 75000.00, 75000.00, NULL, 'unpaid', '{\"name\":\"User General\",\"company\":null,\"email\":\"user@larasena.com\",\"phone\":\"988887765\",\"address\":\"qwertyuisdfghjcvbnm\",\"batik_type\":\"Batik Printing\",\"fabric_size\":\"210 cm x 110 cm (Standar)\",\"deadline\":\"2025-08-09\",\"special_notes\":\"wweee\"}', 9, 3, 1, 1, '2025-08-08 17:50:23', '2025-08-08 17:50:23'),
(6, 'diterima', 2, 95000.00, 190000.00, NULL, 'unpaid', '{\"name\":\"Moreno Hilbran\",\"company\":\"-\",\"email\":\"user@larasena.com\",\"phone\":\"0812234567891\",\"address\":\"Jalan Pahlawan No 21 Purwokerto Jawa Tengah\",\"batik_type\":\"Batik Printing\",\"fabric_size\":\"210 cm x 110 cm (Standar)\",\"deadline\":\"2025-08-14\",\"special_notes\":\"Sebelum tanggal 14 sudah jadi ya kak!\"}', 7, 3, 8, 3, '2025-08-09 22:48:27', '2025-08-09 22:48:27'),
(7, 'diterima', 2, 125000.00, 250000.00, NULL, 'unpaid', '{\"name\":\"Moreno Hilbran\",\"company\":\"-\",\"email\":\"user@larasena.com\",\"phone\":\"081223456764\",\"address\":\"Jalan Pahlawan Purwokerto\",\"batik_type\":\"Batik Printing\",\"fabric_size\":\"250cm x 115cm (Jumbo)\",\"deadline\":\"2025-08-17\",\"special_notes\":\"Tolong jadi sebelum tanggal 17 ya kak!\"}', 7, 3, 8, 2, '2025-08-09 23:56:05', '2025-08-09 23:56:05'),
(8, 'diterima_selesai', 22, 50000.00, 2150000.00, NULL, 'paid', NULL, 2, 14, 16, 4, '2025-07-10 00:33:06', '2025-08-10 00:33:06'),
(9, 'diproses', 18, 120000.00, 3600000.00, NULL, 'unpaid', NULL, 2, 14, 16, 5, '2025-09-10 00:33:06', '2025-08-10 00:33:06'),
(10, 'diterima_selesai', 33, 50000.00, 1200000.00, NULL, 'paid', NULL, 2, 15, 17, 4, '2025-08-10 00:33:06', '2025-08-10 00:33:06'),
(11, 'diproses', 26, 120000.00, 1200000.00, NULL, 'paid', NULL, 2, 15, 17, 5, '2025-08-10 00:33:06', '2025-08-10 00:33:06'),
(12, 'diterima_selesai', 19, 50000.00, 2200000.00, NULL, 'paid', NULL, 2, 16, 18, 4, '2025-10-10 00:33:06', '2025-08-10 00:33:06'),
(13, 'diproses', 21, 120000.00, 2760000.00, NULL, 'paid', NULL, 2, 16, 18, 5, '2025-10-10 00:33:06', '2025-08-10 00:33:06'),
(14, 'diterima_selesai', 40, 50000.00, 1050000.00, NULL, 'paid', NULL, 2, 14, 27, 4, '2025-10-10 21:41:16', '2025-10-10 21:41:16'),
(15, 'diproses', 28, 120000.00, 2040000.00, NULL, 'unpaid', NULL, 2, 14, 27, 5, '2025-10-10 21:41:16', '2025-10-10 21:41:16'),
(16, 'diterima_selesai', 45, 50000.00, 1200000.00, NULL, 'paid', NULL, 2, 15, 28, 4, '2025-10-10 21:41:16', '2025-10-10 21:41:16'),
(17, 'diproses', 16, 120000.00, 2520000.00, NULL, 'unpaid', NULL, 2, 15, 28, 5, '2025-10-10 21:41:16', '2025-10-10 21:41:16'),
(18, 'diterima_selesai', 21, 50000.00, 1250000.00, NULL, 'paid', NULL, 2, 16, 29, 4, '2025-10-10 21:41:16', '2025-10-10 21:41:16'),
(19, 'diproses', 29, 120000.00, 2640000.00, NULL, 'unpaid', NULL, 2, 16, 29, 5, '2025-10-10 21:41:16', '2025-10-10 21:41:16'),
(20, 'diterima', 1, 78750.00, 78750.00, NULL, 'unpaid', '{\"name\":\"Moreno Hilbran\",\"company\":\"dwdwawda\",\"email\":\"user@larasena.com\",\"phone\":\"12323\",\"address\":\"dwawdawd\",\"batik_type\":\"Batik Printing\",\"fabric_size\":\"M\",\"special_notes\":null}', 4, 3, 35, 1, '2025-10-18 04:22:35', '2025-10-18 04:22:35');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('119nIXHOh6DzNpGz9XeVmwcf79BpwrW8byKiiE9r', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibTF1eGxZWDhUUzJRSW9TeG50RUNtOFpRVjlTWEtHZDBNNGJyZFJSOSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czo0MDoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL2tvbnZla3NpLWRhc2hib2FyZCI7fX0=', 1761490877),
('5HrAWpwSmg3OmkJjCXalEIcEwdhxcjt2Wd1uDRXG', 3, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoid1FkUGwxSnBsMUxWZ2RKdTZIZ2wzQktWM2RBVWxJZmhCbEF1b0lXTCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjM7fQ==', 1761540202),
('9skIarLm4Gp0o8f6SXiEYIBYbjO3hwo3A6tSg1TL', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiWG02TUdGcnY1U3dBdlJtMnlManVPazdRUWpUTkRtZ1hUSWlueFQ3ZyI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czo0MDoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL2tvbnZla3NpLWRhc2hib2FyZCI7fXM6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjI3OiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1761531837),
('DDSEYxuafifBk85j814Bw45PRucJHpdSslofOqB1', 18, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoid1d2VDduVjkwREo2NjYzczdSWjlLdXU2bjViMW5nMU4wWGtTMTBsdyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE4O30=', 1761534455),
('fzR97VMKanXHt8NSBbMhIUGUI5Su29fPQVSpH51q', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiNnFCMHZDZHViY0F0eWNLc1U0NDBsN2prY0JsZXJTdVRFTDAwY3BlciI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czozODoiaHR0cDovL2xvY2FsaG9zdDo4MDAwL2tvbnZla3NpLXByb2ZpbGUiO31zOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czoyNzoiaHR0cDovL2xvY2FsaG9zdDo4MDAwL2xvZ2luIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1761559133),
('MEegynzMKzHk4RKVUaITfku9x6m7hgFzb2eTJ9f1', 3, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiQmx6cjNUcENDV3ZKSWhoVXY4M0d6bWtUSTRrTWR6VDl4MGVGbU9nSiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9kYXNoYm9hcmQiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aTozO30=', 1761539070),
('oOHKPPYYqro6JKwiUNybLvetQDCyd1kwKjNbK6ZU', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoidFlwMnpNNHdTb1Noamh2aGkwRWY4MTIxN3ZrYWl4TW1GTm15RjBiVSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1761540151),
('UYiAOHv5kZ7xQbOkGqPZVWclViSXfWsJ9HM8ZgaY', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTHRjcHphSDBiWUtRMzdHVm9NWUlGbVd1cm82cEh0UHloempMeWw5UCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1761569787),
('xnL8W0d1W5vJioOBGecqmaeOsfIl5vJG96FfoQLr', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiREVMYnRYbHJ5TjVGZUpsWUJSV0gyUjVzbml2elZQdnNBQXJEajAyNSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9sb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1761568479);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','General','Convection') NOT NULL DEFAULT 'General',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin Larasena', 'admin@larasena.com', NULL, '$2y$12$3dpIpN4sZDyR.0Y7Q3mZWeRFIeAgT1dmFJlPg/kBilsqiHQGWCLM6', 'Admin', NULL, '2025-08-08 11:07:31', '2025-08-08 11:07:31'),
(2, 'Mitra Konveksi 1', 'konveksi.partner1@larasena.com', NULL, '$2y$12$CV9k14sDXG8tJuNsnhpleuxQR/scVVZg5L10JbJC0elfaXlTiZUtG', 'Convection', NULL, '2025-08-08 11:07:31', '2025-08-08 11:07:31'),
(3, 'Moreno Hilbran', 'user@larasena.com', NULL, '$2y$12$34IdMHIPH2suwIpW2itWLOAhcOvjznH20qhhoF/x0/pxck9qEaW8y', 'General', NULL, '2025-08-08 11:07:32', '2025-08-08 11:07:32'),
(4, 'Batik Jaya Abadi', 'batikjayaabadi@example.com', NULL, '$2y$12$riZST/z/.yaUOPH2B1MPROMR7ZL5MGQ/F1alr9.yX0GGPm58Ct6Eq', 'Convection', NULL, '2025-08-08 11:07:32', '2025-08-08 11:07:32'),
(5, 'Solo Cantik Garmen', 'solocantikgarmen@example.com', NULL, '$2y$12$cbPNs.GeLkIRW3I3aZvRjOijRbQAboUgyVFfCL9bDSfrzebe37ZlK', 'Convection', NULL, '2025-08-08 11:07:32', '2025-08-08 11:07:32'),
(6, 'Griya Batik Cirebon', 'griyabatikcirebon@example.com', NULL, '$2y$12$58XuYFvlTt9r8AtlyHcMa.JexkZDXSu9ACRWtXPylDuy9ngyfqXvi', 'Convection', NULL, '2025-08-08 11:07:33', '2025-08-08 11:07:33'),
(7, 'Jogja Klasik Konveksi', 'jogjaklasikkonveksi@example.com', NULL, '$2y$12$JsvpmcFm7tOByzSbjoLEdOXGs.V5WcgeUsT0oqCKY76cZItWwQnju', 'Convection', NULL, '2025-08-08 11:07:33', '2025-08-08 11:07:33'),
(8, 'Madura Warna Cemerlang', 'madurawarnacemerlang@example.com', NULL, '$2y$12$MOwQ41U165mSDWpaySg7eeTMFS2PIW46awaf77EXwcgQY3KbYvXSG', 'Convection', NULL, '2025-08-08 11:07:33', '2025-08-08 11:07:33'),
(9, 'Sentra Batik Lasem', 'sentrabatiklasem@example.com', NULL, '$2y$12$sX.zRPFKDFT04Mpq9J09UedcCoBczRFSjqQqX5OVyUORgJjtp5.du', 'Convection', NULL, '2025-08-08 11:07:34', '2025-08-08 11:07:34'),
(10, 'Busana Parahyangan', 'busanaparahyangan@example.com', NULL, '$2y$12$SKsw4RgpluOTMKAnw/CyauigD852sVP7bXtlse5ElamuWVCpN0psO', 'Convection', NULL, '2025-08-08 11:07:34', '2025-08-08 11:07:34'),
(11, 'Pesisir Indah Garmen', 'pesisirindahgarmen@example.com', NULL, '$2y$12$jvdXpZ1h7xMEXnVNRYkLcuW6T81zV.JifBrjyyGXs8.JJcQNG0eXO', 'Convection', NULL, '2025-08-08 11:07:34', '2025-08-08 11:07:34'),
(12, 'Mahkota Batik Solo', 'mahkotabatiksolo@example.com', NULL, '$2y$12$VdYYDrVB3e3afjQzVHbpv.MHXnypejrrPChWBe9nOIZzbjIIt1wbS', 'Convection', NULL, '2025-08-08 11:07:35', '2025-08-08 11:07:35'),
(13, 'Karya Anak Bangsa Konveksi', 'karyaanakbangsakonveksi@example.com', NULL, '$2y$12$OHyPT91159Na9Cpmvim.n.cF2rwvNRS0RtHX7zxolD5qm7SwwFkbi', 'Convection', NULL, '2025-08-08 11:07:35', '2025-08-08 11:07:35'),
(14, 'Nadzare', 'nadzare@example.com', NULL, '$2y$12$7eDnj/jAEld9Tt6iGILuHOmS6/q70qKpM26b3TKSd.Gi/rcRpz0tK', 'General', NULL, '2025-08-10 00:33:04', '2025-08-10 00:33:04'),
(15, 'Kafah', 'kafah@example.com', NULL, '$2y$12$k1daaNRHtCGa2dVBBA/fteOCLF4ItXXNyz61HKz6CRHfgP6oi/UjG', 'General', NULL, '2025-08-10 00:33:05', '2025-08-10 00:33:05'),
(16, 'Edwi', 'edwi@example.com', NULL, '$2y$12$lj68C5n57VnItvX9L1TSBuGfFRhr3Phw/HpVkdBxcs9IQyCuZabDK', 'General', NULL, '2025-08-10 00:33:06', '2025-08-10 00:33:06'),
(17, 'Dimas Kendika', 'dkendika@gmail.com', NULL, '$2y$12$LIxT0jPbSQLCOiTANNDvzezSEJaG9Glj8xyc6OYXz2NDm1BUHRsPC', 'Convection', NULL, '2025-09-16 08:37:13', '2025-09-16 08:37:13'),
(18, 'konvek', 'konveksidummy@larasena.com', NULL, '$2y$12$QWhUM5BhYBXUkRk4EdwOH.f.kFApuuZptDQycqmTHRLb76lakD6J.', 'Convection', NULL, '2025-10-10 18:11:28', '2025-10-10 18:11:28'),
(19, 'coba', 'coba@gmail.com', NULL, '$2y$12$qnKGgUbzDGFLJZu6iMp1E.ZBKkJ7OyqXvOK336tjZs3ILhJmmSJVu', 'Convection', NULL, '2025-10-10 20:27:53', '2025-10-10 20:27:53'),
(20, 'konveksi', 'konveksi@larasena.id', NULL, '$2y$12$U8xXWnYiUIhoY6BunlBvH.UKuyC5vBFZnG48Hi5zl9.1KsV5D5Ur6', 'Convection', NULL, '2025-10-17 06:18:21', '2025-10-17 06:18:21'),
(21, 'Admin Larasena', 'admin@larasena.id', NULL, '$2a$12$B.iLqlPPCJkcmhOJM6xwHOTBwWnMof9KUGwlradY2OZm5oCSwbuVC', 'Admin', NULL, '2025-10-01 13:37:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_motifs`
--

CREATE TABLE `user_motifs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `designs`
--
ALTER TABLE `designs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `designs_user_id_foreign` (`user_id`),
  ADD KEY `designs_preview_3d_models_id_foreign` (`preview_3d_models_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `konveksis`
--
ALTER TABLE `konveksis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `konveksis_is_verified_rating_index` (`is_verified`,`rating`),
  ADD KEY `konveksis_location_index` (`location`),
  ADD KEY `konveksis_user_id_foreign` (`user_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `motifs`
--
ALTER TABLE `motifs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `motifs_user_id_foreign` (`user_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `preview_3d_models`
--
ALTER TABLE `preview_3d_models`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_preview_3d_model_id_foreign` (`preview_3d_model_id`);

--
-- Indexes for table `productions`
--
ALTER TABLE `productions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productions_convection_user_id_foreign` (`convection_user_id`),
  ADD KEY `productions_user_id_foreign` (`user_id`),
  ADD KEY `productions_design_id_foreign` (`design_id`),
  ADD KEY `productions_product_id_foreign` (`product_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `user_motifs`
--
ALTER TABLE `user_motifs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_motifs_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `designs`
--
ALTER TABLE `designs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `konveksis`
--
ALTER TABLE `konveksis`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `motifs`
--
ALTER TABLE `motifs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `preview_3d_models`
--
ALTER TABLE `preview_3d_models`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `productions`
--
ALTER TABLE `productions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `user_motifs`
--
ALTER TABLE `user_motifs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `designs`
--
ALTER TABLE `designs`
  ADD CONSTRAINT `designs_preview_3d_models_id_foreign` FOREIGN KEY (`preview_3d_models_id`) REFERENCES `preview_3d_models` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `designs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `konveksis`
--
ALTER TABLE `konveksis`
  ADD CONSTRAINT `konveksis_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `motifs`
--
ALTER TABLE `motifs`
  ADD CONSTRAINT `motifs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_preview_3d_model_id_foreign` FOREIGN KEY (`preview_3d_model_id`) REFERENCES `preview_3d_models` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `productions`
--
ALTER TABLE `productions`
  ADD CONSTRAINT `productions_convection_user_id_foreign` FOREIGN KEY (`convection_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `productions_design_id_foreign` FOREIGN KEY (`design_id`) REFERENCES `designs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `productions_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `productions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_motifs`
--
ALTER TABLE `user_motifs`
  ADD CONSTRAINT `user_motifs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
