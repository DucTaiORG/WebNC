-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 15, 2020 lúc 06:47 AM
-- Phiên bản máy phục vụ: 10.4.11-MariaDB
-- Phiên bản PHP: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `banking`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nganhanglienket`
--

CREATE TABLE `nganhanglienket` (
  `id` int(11) NOT NULL,
  `code` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `nganhanglienket`
--

INSERT INTO `nganhanglienket` (`id`, `code`) VALUES
(1, 'B'),
(2, 'C');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoan`
--

CREATE TABLE `taikhoan` (
  `id` int(11) NOT NULL,
  `SoTaiKhoan` text NOT NULL,
  `NgaySinh` date NOT NULL,
  `TenDangNhap` text NOT NULL,
  `MatKhau` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `taikhoan`
--

INSERT INTO `taikhoan` (`id`, `SoTaiKhoan`, `NgaySinh`, `TenDangNhap`, `MatKhau`) VALUES
(1, '123456789', '0000-00-00', 'ductai', '123456'),
(2, '1234567812', '2020-05-22', 'ductai1', '123');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoanthanhtoan`
--

CREATE TABLE `taikhoanthanhtoan` (
  `id` int(11) NOT NULL,
  `SoTaiKhoan` text NOT NULL,
  `SoDu` text NOT NULL,
  `idTaiKhoan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `taikhoanthanhtoan`
--

INSERT INTO `taikhoanthanhtoan` (`id`, `SoTaiKhoan`, `SoDu`, `idTaiKhoan`) VALUES
(1, '012345678', '1000000', 1),
(2, '123456781', '200000', 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoantietkiem`
--

CREATE TABLE `taikhoantietkiem` (
  `id` int(11) NOT NULL,
  `SoTaiKhoan` text NOT NULL,
  `SoDu` text NOT NULL,
  `idTaiKhoan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `nganhanglienket`
--
ALTER TABLE `nganhanglienket`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `taikhoanthanhtoan`
--
ALTER TABLE `taikhoanthanhtoan`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `taikhoantietkiem`
--
ALTER TABLE `taikhoantietkiem`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `nganhanglienket`
--
ALTER TABLE `nganhanglienket`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `taikhoanthanhtoan`
--
ALTER TABLE `taikhoanthanhtoan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `taikhoantietkiem`
--
ALTER TABLE `taikhoantietkiem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
