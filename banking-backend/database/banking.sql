-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 22, 2020 lúc 06:25 PM
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
  `code` text NOT NULL,
  `secretKey` text NOT NULL,
  `publicKeyPGP` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `nganhanglienket`
--

INSERT INTO `nganhanglienket` (`id`, `code`, `secretKey`, `publicKeyPGP`) VALUES
(1, 'B', 'NganHangB', '-----BEGIN PGP PUBLIC KEY BLOCK-----\\nVersion: Keybase OpenPGP v1.0.0\\nComment: https://keybase.io/crypto\\n\\nxo0EXsaK0AEEANKBWGQRobFMrwyuELsALiyhz+HJDgf+hiPF+4QXC1YCj5VVBlvR\\nK/JE2hs1gVjsAV6nDMcfgMbaguCPb5u3lp8ir/88qQOdyYMLYbUL5L4ir1MbfNhw\\nTpMMeCuXwoed/F2BTtgloedCkwmthcaEcrWLHDiV/MEYyq6V1kjHl0cDABEBAAHN\\nHkR1YyB0YWkgPHJvbmluMzIwMTRAZ21haWwuY29tPsKtBBMBCgAXBQJexorQAhsv\\nAwsJBwMVCggCHgECF4AACgkQCHaebKSUPRZ/zQP+M+zmhUMyWWNiU2yOZDRUsFHS\\n3qevkwHLIWHlvrq2rP44gPAk2Phvw7htYK19adJvoEAxFyDH66awha+yWNPi9uFB\\n3Tvkbasas2wTf0RZbB0QGnprBTqqf0a+Kj3PfifK/jFvm0zqXoXU5Yme7Xj5alJt\\nnvIL/+XKVsOoFMo2h7rOjQRexorQAQQAtFteY9E1lhsBJlD1uX2FnOIjkJoUNQ0o\\nhvHaP5ynsFivgKbjrTM5YSgdv8TopJeNqByUk991oLtimeITUQ9BLpWFkvCoQ+ey\\npYk1eG1Nz4UhoGpYMPrT+nqSd6vz7pK+dQcJ7ZzPcgFSc/FtZZ9npGqc0IByqDiM\\npn1RPB1GnNsAEQEAAcLAgwQYAQoADwUCXsaK0AUJDwmcAAIbLgCoCRAIdp5spJQ9\\nFp0gBBkBCgAGBQJexorQAAoJEK+nKFfkuN+JodQEAIjlPDTpVNl2tgzUK7sxHNzC\\nkPlXJMtIaaXvWV5FSTOh/SNcpFpcUULgQ1cOyH8T5uzekNnxaJcoz3FajqJNpqGK\\ncgo+ESIJPoNxbkajM0uRkUYuWLzrrKDs8JBGRilQX1170sW+WhbZHs/GanSS5AEZ\\njwM87cxvx2+/JnPugSTq/isEAKFRVG7U34pxKAwb4yp2po81zMPhTMnN3vlxtDDG\\nUe+wBwIJWFDnvEhOyeDGWnCEyRlemTaNXVUcDfGYM8JS5Kwn9cfxyNDQ6ujG5mBP\\nw61c+Sh5wPPe8ZnsAlAiHmryCRY/K1pGQsCEsaVoUzLlRkpW8/A1JZYizpz9TxSV\\nNV3+zo0EXsaK0AEEAMdQbesY9hpC8lr/PrCXMSz61A5NFlbFq4O/Qc1KdthZTgdm\\nRRAnjzR2soq2kb2IEtMVY1Dgj+4vbtBbovIRbBegbhpcTQndKFRizDuCBbaFQmwj\\n3Ske/mqT5o88cy+ZhTI11BADLIo9L9NV0aJUjchDqXx97iKzAtbb/ce6xisRABEB\\nAAHCwIMEGAEKAA8FAl7GitAFCQ8JnAACGy4AqAkQCHaebKSUPRadIAQZAQoABgUC\\nXsaK0AAKCRD8JTRgXpBFOFU0A/wMOuI4OPA/aYhcvLa/o2A46KHvfK6Ugr3zt3f/\\nYW4DM1ZnadxAGOm1OVdaXCYpYHwL6U+Ndnr65pQkPXhISv9WSUR89bbKRfGQxx2L\\nAWfOnBxoAU+U8kbXkZWhwENQK8vEHBDm3xRRFlLp56M4SardG9xRI3HKwBQfvPaE\\nVCOKRcYyA/9jchZAQjEgyobBfDhDdWRNAbYUMfIcvFgfnXIvYnnFQI6h1m7SlisE\\nCaXJe8SNXyBlK+0EkVtdnbQyroWi4yzT/4Wgb4CGsraH2ZW7JkjoYm/XdgolYKEM\\n2DjM88WcSaX+3NPdMOSUNuCIfHit/2AxghMcCwpNkvlAz52UjySOag==\\n=sMbW\\n-----END PGP PUBLIC KEY BLOCK-----'),
(2, 'C', '', '');

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
(1, '012345678', 'NaN', 1),
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
