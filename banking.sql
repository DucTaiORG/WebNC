-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 16, 2020 lúc 05:11 PM
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
-- Cấu trúc bảng cho bảng `deposit_history`
--

CREATE TABLE `deposit_history` (
  `id` int(11) NOT NULL,
  `deposit_time` datetime NOT NULL,
  `money_amount` bigint(20) NOT NULL,
  `account_num` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `deposit_history`
--

INSERT INTO `deposit_history` (`id`, `deposit_time`, `money_amount`, `account_num`) VALUES
(6, '2020-06-14 17:45:00', 123, 123456789),
(7, '2020-06-14 19:11:07', 123, 123456789),
(8, '2020-06-14 21:10:16', 10000, 123456789),
(9, '2020-06-15 00:48:46', 123, 123456789);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `partnerbank`
--

CREATE TABLE `partnerbank` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `partnerCode` text NOT NULL,
  `secretKey` text NOT NULL,
  `publicKey` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `partnerbank`
--

INSERT INTO `partnerbank` (`id`, `name`, `partnerCode`, `secretKey`, `publicKey`) VALUES
(2, 'Ngân hàng B', 'bankB', 'secretB', '-----BEGIN PGP PUBLIC KEY BLOCK-----\\nVersion: Keybase OpenPGP v1.0.0\\nComment: https://keybase.io/crypto\\n\\nxo0EXud1TgEEAK4aiPJDmV6dxjbJmotC3A9/94n6qpGbKp3w+faDoWeCH16n84kA\\nH4dIMGqaAL3WInd84CyWcCrcK+ijtqW/csNjlvnF79/tAHwUTVTD/73fd8ab+nhF\\n15IWs9kF1dAsa59bJVzxGKOqGDBCSzZnCNKCdQ+c/gDe0vM5zXi8wGGPABEBAAHN\\nGnRhaSA8cm9uaW4zMjAxNEBnbWFpbC5jb20+wq0EEwEKABcFAl7ndU4CGy8DCwkH\\nAxUKCAIeAQIXgAAKCRAnF2LhuNG7atq8BACRgEM1uRskhcpskST93a3+dVKJFZAq\\nxyu/x9vwdJFATXlnjfUIkzIhsmWzdhAfgRvzquh9vcu9UPVjnmLRPuTTMBfZqOPN\\nJfHfLOxfrmmXXYriEFgocGVjbwjrao44hpZapdAD1ynHWyUK8NfJh80jYNdwV0l9\\ncgmwrpczCqiAE86NBF7ndU4BBACpP7ugne2JDeZpWU5vNhfO21c+opC1antkZn5P\\nc2O2WmTahPZ4Wh1Keo2eQoC+paj+UjLj5J6FgxX4NKaZ+mmrvdtNn+QYUG/Q0rhb\\ngAmX1OCXRYN7mQbIYovt/iRJ9RA3FJKwy69WN9Oah82quzAHFZSX5tKg+11QMhec\\nbIGRwQARAQABwsCDBBgBCgAPBQJe53VOBQkPCZwAAhsuAKgJECcXYuG40btqnSAE\\nGQEKAAYFAl7ndU4ACgkQJ9sGeOI8s1MxlQP+OAEeKqq+SU9PS4bumVPKDWkdPMnT\\nMQMUfLtswc/MqKuY4Hv0PDOocnhyq+FP03YsDUrsigyST2aa2uKQ5WUsiVuMvoeS\\nsZxQ1T9dIROUJXKiw4QgYgGirBmxJWVJHX03R05ivpA+yj65sMScmfhRkmLSFYkx\\noBMmEgYcEmKlGkkwgQQAlBuwP8roE9r0UeUQBSUwGeyyvDg0PZ499bzPE48YIhrB\\nbNJ0QQ4SagUM6trmcfY6+cidVLqlFE6Qx//8ZcCoMTHZl5pFDpfCJYOx6VhV8I6v\\n4BDynybztkw4VUPI/XmHk+tqNMb3mI1n5wH+25YkBhWHKypqPh0V//0VEyl+E37O\\njQRe53VOAQQA9Esc3oB6PZViHzVBKveeNnxjNyMVD6UowUmNyHdLulbSKmUTf1iy\\nbEtEk3mNnLtmqBvvUN6yey1J9ZK8qmawk6mNsQk4ZwA58lDzyQ+gGiRoN7B9YTQ3\\n/jIMPEJtkMUMDvbmOJagpRNZgAc1o3Z7ca03dD/46q5pHgi0b6nKp98AEQEAAcLA\\ngwQYAQoADwUCXud1TgUJDwmcAAIbLgCoCRAnF2LhuNG7ap0gBBkBCgAGBQJe53VO\\nAAoJEMu3TxuLmt1nt9EEAJtsjhBIqdR96AY4xpCsddDRrIvI2uxrP+Cjbxiz1sML\\nHU9+2YS0YPfANtdbCQFEkVqRGikxi9wygNZUfsBoT3kFb3Inr4OGUdU7gbOXrwha\\nulr3wvp0OirYaIrvYnuzgS+sLnSW238PZkiiGtpK/TBU1SNk0e1jn+UIgHQ0T1YE\\nUUUD/1Nw4Hp7rBGsTG4qANaav+6HwPmxx7s16JJg9NIrdz4hBzUkshmrDo/JIAmn\\njUYO0xuU67bL/tQ6l++Ar+6h88cT8rTT0SH0At4uYMP2yku72ocUnTSrfTr/+pvS\\ny7nGV21q0k4gW3R3wykeiNn3HBKRoRcT5ROvoqpUDzyJZkZG\\n=GUn5\\n-----END PGP PUBLIC KEY BLOCK-----'),
(3, 'Ngân hàng C', 'bankC', 'secretC', '-----BEGIN PGP PUBLIC KEY BLOCK-----\\nVersion: Keybase OpenPGP v1.0.0\\nComment: https://keybase.io/crypto\\n\\nxo0EXud1TgEEAK4aiPJDmV6dxjbJmotC3A9/94n6qpGbKp3w+faDoWeCH16n84kA\\nH4dIMGqaAL3WInd84CyWcCrcK+ijtqW/csNjlvnF79/tAHwUTVTD/73fd8ab+nhF\\n15IWs9kF1dAsa59bJVzxGKOqGDBCSzZnCNKCdQ+c/gDe0vM5zXi8wGGPABEBAAHN\\nGnRhaSA8cm9uaW4zMjAxNEBnbWFpbC5jb20+wq0EEwEKABcFAl7ndU4CGy8DCwkH\\nAxUKCAIeAQIXgAAKCRAnF2LhuNG7atq8BACRgEM1uRskhcpskST93a3+dVKJFZAq\\nxyu/x9vwdJFATXlnjfUIkzIhsmWzdhAfgRvzquh9vcu9UPVjnmLRPuTTMBfZqOPN\\nJfHfLOxfrmmXXYriEFgocGVjbwjrao44hpZapdAD1ynHWyUK8NfJh80jYNdwV0l9\\ncgmwrpczCqiAE86NBF7ndU4BBACpP7ugne2JDeZpWU5vNhfO21c+opC1antkZn5P\\nc2O2WmTahPZ4Wh1Keo2eQoC+paj+UjLj5J6FgxX4NKaZ+mmrvdtNn+QYUG/Q0rhb\\ngAmX1OCXRYN7mQbIYovt/iRJ9RA3FJKwy69WN9Oah82quzAHFZSX5tKg+11QMhec\\nbIGRwQARAQABwsCDBBgBCgAPBQJe53VOBQkPCZwAAhsuAKgJECcXYuG40btqnSAE\\nGQEKAAYFAl7ndU4ACgkQJ9sGeOI8s1MxlQP+OAEeKqq+SU9PS4bumVPKDWkdPMnT\\nMQMUfLtswc/MqKuY4Hv0PDOocnhyq+FP03YsDUrsigyST2aa2uKQ5WUsiVuMvoeS\\nsZxQ1T9dIROUJXKiw4QgYgGirBmxJWVJHX03R05ivpA+yj65sMScmfhRkmLSFYkx\\noBMmEgYcEmKlGkkwgQQAlBuwP8roE9r0UeUQBSUwGeyyvDg0PZ499bzPE48YIhrB\\nbNJ0QQ4SagUM6trmcfY6+cidVLqlFE6Qx//8ZcCoMTHZl5pFDpfCJYOx6VhV8I6v\\n4BDynybztkw4VUPI/XmHk+tqNMb3mI1n5wH+25YkBhWHKypqPh0V//0VEyl+E37O\\njQRe53VOAQQA9Esc3oB6PZViHzVBKveeNnxjNyMVD6UowUmNyHdLulbSKmUTf1iy\\nbEtEk3mNnLtmqBvvUN6yey1J9ZK8qmawk6mNsQk4ZwA58lDzyQ+gGiRoN7B9YTQ3\\n/jIMPEJtkMUMDvbmOJagpRNZgAc1o3Z7ca03dD/46q5pHgi0b6nKp98AEQEAAcLA\\ngwQYAQoADwUCXud1TgUJDwmcAAIbLgCoCRAnF2LhuNG7ap0gBBkBCgAGBQJe53VO\\nAAoJEMu3TxuLmt1nt9EEAJtsjhBIqdR96AY4xpCsddDRrIvI2uxrP+Cjbxiz1sML\\nHU9+2YS0YPfANtdbCQFEkVqRGikxi9wygNZUfsBoT3kFb3Inr4OGUdU7gbOXrwha\\nulr3wvp0OirYaIrvYnuzgS+sLnSW238PZkiiGtpK/TBU1SNk0e1jn+UIgHQ0T1YE\\nUUUD/1Nw4Hp7rBGsTG4qANaav+6HwPmxx7s16JJg9NIrdz4hBzUkshmrDo/JIAmn\\njUYO0xuU67bL/tQ6l++Ar+6h88cT8rTT0SH0At4uYMP2yku72ocUnTSrfTr/+pvS\\ny7nGV21q0k4gW3R3wykeiNn3HBKRoRcT5ROvoqpUDzyJZkZG\\n=GUn5\\n-----END PGP PUBLIC KEY BLOCK-----'),
(5, 'Ngân hàng A', 'bankA', 'secretA', '-----BEGIN PGP PUBLIC KEY BLOCK-----\\nVersion: Keybase OpenPGP v1.0.0\\nComment: https://keybase.io/crypto\\n\\nxo0EXud1TgEEAK4aiPJDmV6dxjbJmotC3A9/94n6qpGbKp3w+faDoWeCH16n84kA\\nH4dIMGqaAL3WInd84CyWcCrcK+ijtqW/csNjlvnF79/tAHwUTVTD/73fd8ab+nhF\\n15IWs9kF1dAsa59bJVzxGKOqGDBCSzZnCNKCdQ+c/gDe0vM5zXi8wGGPABEBAAHN\\nGnRhaSA8cm9uaW4zMjAxNEBnbWFpbC5jb20+wq0EEwEKABcFAl7ndU4CGy8DCwkH\\nAxUKCAIeAQIXgAAKCRAnF2LhuNG7atq8BACRgEM1uRskhcpskST93a3+dVKJFZAq\\nxyu/x9vwdJFATXlnjfUIkzIhsmWzdhAfgRvzquh9vcu9UPVjnmLRPuTTMBfZqOPN\\nJfHfLOxfrmmXXYriEFgocGVjbwjrao44hpZapdAD1ynHWyUK8NfJh80jYNdwV0l9\\ncgmwrpczCqiAE86NBF7ndU4BBACpP7ugne2JDeZpWU5vNhfO21c+opC1antkZn5P\\nc2O2WmTahPZ4Wh1Keo2eQoC+paj+UjLj5J6FgxX4NKaZ+mmrvdtNn+QYUG/Q0rhb\\ngAmX1OCXRYN7mQbIYovt/iRJ9RA3FJKwy69WN9Oah82quzAHFZSX5tKg+11QMhec\\nbIGRwQARAQABwsCDBBgBCgAPBQJe53VOBQkPCZwAAhsuAKgJECcXYuG40btqnSAE\\nGQEKAAYFAl7ndU4ACgkQJ9sGeOI8s1MxlQP+OAEeKqq+SU9PS4bumVPKDWkdPMnT\\nMQMUfLtswc/MqKuY4Hv0PDOocnhyq+FP03YsDUrsigyST2aa2uKQ5WUsiVuMvoeS\\nsZxQ1T9dIROUJXKiw4QgYgGirBmxJWVJHX03R05ivpA+yj65sMScmfhRkmLSFYkx\\noBMmEgYcEmKlGkkwgQQAlBuwP8roE9r0UeUQBSUwGeyyvDg0PZ499bzPE48YIhrB\\nbNJ0QQ4SagUM6trmcfY6+cidVLqlFE6Qx//8ZcCoMTHZl5pFDpfCJYOx6VhV8I6v\\n4BDynybztkw4VUPI/XmHk+tqNMb3mI1n5wH+25YkBhWHKypqPh0V//0VEyl+E37O\\njQRe53VOAQQA9Esc3oB6PZViHzVBKveeNnxjNyMVD6UowUmNyHdLulbSKmUTf1iy\\nbEtEk3mNnLtmqBvvUN6yey1J9ZK8qmawk6mNsQk4ZwA58lDzyQ+gGiRoN7B9YTQ3\\n/jIMPEJtkMUMDvbmOJagpRNZgAc1o3Z7ca03dD/46q5pHgi0b6nKp98AEQEAAcLA\\ngwQYAQoADwUCXud1TgUJDwmcAAIbLgCoCRAnF2LhuNG7ap0gBBkBCgAGBQJe53VO\\nAAoJEMu3TxuLmt1nt9EEAJtsjhBIqdR96AY4xpCsddDRrIvI2uxrP+Cjbxiz1sML\\nHU9+2YS0YPfANtdbCQFEkVqRGikxi9wygNZUfsBoT3kFb3Inr4OGUdU7gbOXrwha\\nulr3wvp0OirYaIrvYnuzgS+sLnSW238PZkiiGtpK/TBU1SNk0e1jn+UIgHQ0T1YE\\nUUUD/1Nw4Hp7rBGsTG4qANaav+6HwPmxx7s16JJg9NIrdz4hBzUkshmrDo/JIAmn\\njUYO0xuU67bL/tQ6l++Ar+6h88cT8rTT0SH0At4uYMP2yku72ocUnTSrfTr/+pvS\\ny7nGV21q0k4gW3R3wykeiNn3HBKRoRcT5ROvoqpUDzyJZkZG\\n=GUn5\\n-----END PGP PUBLIC KEY BLOCK-----');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `partner_transfer_history`
--

CREATE TABLE `partner_transfer_history` (
  `id` int(11) NOT NULL,
  `partnerId` int(11) NOT NULL,
  `money_amount` bigint(20) NOT NULL,
  `transfer_time` datetime NOT NULL,
  `signature` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `partner_transfer_history`
--

INSERT INTO `partner_transfer_history` (`id`, `partnerId`, `money_amount`, `transfer_time`, `signature`) VALUES
(1, 5, 15000, '2020-06-15 21:10:38', ''),
(2, 5, 15000, '2020-06-15 21:10:38', ''),
(3, 5, 15000, '2020-06-15 21:10:38', ''),
(4, 5, 15000, '2020-06-15 21:21:07', ''),
(5, 5, 100000, '2020-06-15 21:25:49', '\\n-----BEGIN PGP SIGNED MESSAGE-----\\nHash: SHA512\\n\\n{\"accNum\":123456789,\"moneyAmount\":100000}\\n-----BEGIN PGP SIGNATURE-----\\nVersion: OpenPGP.js v4.10.4\\nComment: https://openpgpjs.org\\n\\nwpwEAQEKAAYFAl7nhO0ACgkQJ9sGeOI8s1PZaQP/ROSr18Pt+Gv8aNnABXqo\\nzmrmMa8YTGEwcL8rMu5rMN1AOVk/xPvLzZYLFrz8S4B5TFUYuVvJVJ+cBEYB\\nREJZSI/vGmJBgsDqDFwRfMJ2J9HOgv0I+CoOf9i5nrxNEJB/lFgog3fZiMSy\\naIKrCyfZPJgcDpOLEinEe2fQ7NO+Frk=\\n=OiNR\\n-----END PGP SIGNATURE-----\\n'),
(6, 2, 150000, '2020-06-15 21:58:10', '\\n-----BEGIN PGP SIGNED MESSAGE-----\\nHash: SHA512\\n\\n{\"accNum\":123456789,\"moneyAmount\":150000}\\n-----BEGIN PGP SIGNATURE-----\\nVersion: OpenPGP.js v4.10.4\\nComment: https://openpgpjs.org\\n\\nwpwEAQEKAAYFAl7njIIACgkQJ9sGeOI8s1MGsQQAibC1r1wpsvDs7AhLdvSd\\n+DJe5KMRp6cA7bVVXUodoJiIAvzXAuijQo978Fonu/0eGY6ONVmQ+iYbgS3f\\nRvVPus37PRRu14/ZB7fE4FRFNlC0itonVLFxuSUB1AEbZx/pxW3zfhDLDueq\\nooqDfPudEHdmMeXJVH3H+tgY8SWJgtA=\\n=PpP/\\n-----END PGP SIGNATURE-----\\n'),
(7, 2, 160000, '2020-06-15 21:58:14', '\\n-----BEGIN PGP SIGNED MESSAGE-----\\nHash: SHA512\\n\\n{\"accNum\":123456789,\"moneyAmount\":160000}\\n-----BEGIN PGP SIGNATURE-----\\nVersion: OpenPGP.js v4.10.4\\nComment: https://openpgpjs.org\\n\\nwpwEAQEKAAYFAl7njIYACgkQJ9sGeOI8s1MB3wP9FZbv1fPfxUiHNerEaIm2\\ntm1ACA1bwDqopTye5SFfucEtd0ShBseu1aBnqeOEk8G6oxkn5IjPYx31oLkh\\nkFlYP/5fKTwdlcrOqlNPHmxRuUUgS421DDceDPiS+1ueFMk7F3hDLtN01dyc\\nP+H6lHFudH1OErGzwPfh4R8YAPka2g0=\\n=d/jE\\n-----END PGP SIGNATURE-----\\n'),
(8, 2, 170000, '2020-06-15 21:58:17', '\\n-----BEGIN PGP SIGNED MESSAGE-----\\nHash: SHA512\\n\\n{\"accNum\":123456789,\"moneyAmount\":170000}\\n-----BEGIN PGP SIGNATURE-----\\nVersion: OpenPGP.js v4.10.4\\nComment: https://openpgpjs.org\\n\\nwpwEAQEKAAYFAl7njIkACgkQJ9sGeOI8s1PgCgP/e8a4JIa1nNiS58EXl2Mt\\n+V41ouP3f2awOm9Yrhbo+WDczZlTBxLKBhOr7XmFNZSA4wB2bAuIdZ0v8KqU\\nh0DIjgg/gf+YpuOdU5y7nkQDRho40JgTsVnlB6QCm6saZRsGxvqcSwut9ytC\\ntGSnbcN0Ir87PSIOt+Sj3lfCTekPkzg=\\n=aJJw\\n-----END PGP SIGNATURE-----\\n'),
(9, 3, 130000, '2020-06-15 21:58:39', '\\n-----BEGIN PGP SIGNED MESSAGE-----\\nHash: SHA512\\n\\n{\"accNum\":123456789,\"moneyAmount\":130000}\\n-----BEGIN PGP SIGNATURE-----\\nVersion: OpenPGP.js v4.10.4\\nComment: https://openpgpjs.org\\n\\nwpwEAQEKAAYFAl7njJ8ACgkQJ9sGeOI8s1O1OQP9EPVwSwL9j+7BL/mjsvZK\\nsekae95pvOSDvk1NAOflbKXupuyyvxwLbZh5RAmovs2XVAGZEimWizKuyPED\\nL5dN7PnYhPobcxPQP/TrKPq7RQHQZgBXhcVvLDgLG6bsmehCPUO99e0NOt1o\\ncxVGA+bfR5okFwD282UBKIUQUjcydfk=\\n=4em7\\n-----END PGP SIGNATURE-----\\n'),
(10, 3, 120000, '2020-06-15 21:58:42', '\\n-----BEGIN PGP SIGNED MESSAGE-----\\nHash: SHA512\\n\\n{\"accNum\":123456789,\"moneyAmount\":120000}\\n-----BEGIN PGP SIGNATURE-----\\nVersion: OpenPGP.js v4.10.4\\nComment: https://openpgpjs.org\\n\\nwpwEAQEKAAYFAl7njKIACgkQJ9sGeOI8s1NZVAP9EgqYnhL6WCqopnfrO1ik\\n3oEm2q7NYh6Hm1oRlqHWw2lQVp76BIGBI+6DELBsplpN0eWqZ7L86j/4rCHT\\nGjiH0D0XFW7wLPs9bIopbd/t3xNgNPnxJlRN/nOgzZrIvnvSozLurs9UcCBb\\nd9sdnSbVGCQd1PiMZ8axG5cnMLSabKw=\\n=YhhV\\n-----END PGP SIGNATURE-----\\n'),
(11, 3, 110000, '2020-06-15 21:58:45', '\\n-----BEGIN PGP SIGNED MESSAGE-----\\nHash: SHA512\\n\\n{\"accNum\":123456789,\"moneyAmount\":110000}\\n-----BEGIN PGP SIGNATURE-----\\nVersion: OpenPGP.js v4.10.4\\nComment: https://openpgpjs.org\\n\\nwpwEAQEKAAYFAl7njKUACgkQJ9sGeOI8s1OPNAP/Ww+e4Ds0nQKEBA9IfPlc\\nz/QQlPc/cO9FRn5oBCIV8mbLqdOxylwUQh3OiRrCkOLCljZbDkWz6xZoHTAC\\nnCrlO+PLj1ChwhErLspoSRkXndQyo+UVhZ1IF1opRCKHGjRsK9PKrHHI4Jhu\\nRU/wykquay2f4dV0PjV7PQTPENrb9t8=\\n=OcuI\\n-----END PGP SIGNATURE-----\\n');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `paymentaccount`
--

CREATE TABLE `paymentaccount` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `balance` bigint(20) NOT NULL,
  `accountNumber` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `paymentaccount`
--

INSERT INTO `paymentaccount` (`id`, `userId`, `balance`, `accountNumber`) VALUES
(1, 10, 11000, 123456789),
(2, 18, 470000, 794351225);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `savingaccount`
--

CREATE TABLE `savingaccount` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `balance` bigint(20) NOT NULL,
  `accountNumber` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `savingaccount`
--

INSERT INTO `savingaccount` (`id`, `userId`, `balance`, `accountNumber`) VALUES
(1, 18, 10000, 797083952),
(2, 18, 200000, 132746691);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `transfer_history`
--

CREATE TABLE `transfer_history` (
  `id` int(11) NOT NULL,
  `money_amount` bigint(20) NOT NULL,
  `from_account` text NOT NULL,
  `to_account` text NOT NULL,
  `time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `transfer_history`
--

INSERT INTO `transfer_history` (`id`, `money_amount`, `from_account`, `to_account`, `time`) VALUES
(1, 10000, '794351225', '123456789', '2020-06-16 22:03:20'),
(2, 12345, '794351225', '123456789', '2020-06-16 22:08:27'),
(3, 80000, '794351225', '123456789', '2020-06-16 22:08:39'),
(4, 70000, '794351225', '123456789', '2020-06-16 22:08:54'),
(5, 60000, '794351225', '123456789', '2020-06-16 22:09:13'),
(6, 10000, '794351225', '123456789', '2020-06-16 22:10:54');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` text NOT NULL,
  `password` text NOT NULL,
  `email` text NOT NULL,
  `fullname` text NOT NULL,
  `phoneNo` text NOT NULL,
  `dateOfBirth` date NOT NULL,
  `userRole` int(11) NOT NULL,
  `refreshToken` text NOT NULL,
  `rdt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `fullname`, `phoneNo`, `dateOfBirth`, `userRole`, `refreshToken`, `rdt`) VALUES
(1, 'ductai', '$2a$08$EGbafBgBJd95a2DYKxp7MeVw6CGnIzdZNWfwodggKWRLpTRGiNVOO', '', 'Lâm Đức Tài', '0123456789', '0000-00-00', 3, 'XX16H7bLSMqNt3vvHf3lYz2aMDPASXzbgKV2Rf0XRqmrh960whb18zpDgDo3l3PE45oP1k0GwuRE8Uyx', '2020-06-15 22:21:12'),
(8, 'employee', '$2a$08$Oxz2ZVIVx/nVL02q9iUmiOYVaGIFbtv0y/SMQrdHG/aWPAK6aP20C', '', 'Đức Tài', '0123456789', '0000-00-00', 2, 'tWxuyPoxiyAnEit4YByV5ngEDandT6lQEBP0MPdasDsjQL860V9dDdN0ZRGMq5JJe6XEuavJ996Dhns1', '2020-06-16 22:10:02'),
(9, 'ductai2', '$2a$08$bb0D1Y8DVNnJUrJeURWNaerRQBRsOAW5RZlic3GX55E1UDaUIWkQa', '', 'Đức Tài', '0123456789', '0000-00-00', 1, '', '0000-00-00 00:00:00'),
(10, 'user123', '$2a$08$6MWkNBjZLtl2owwhtMcinevshAAxyrDsWP0V6odCg7CVnqqASo6Yu', '', 'Tài Đức', '0908960580', '0000-00-00', 1, '', '0000-00-00 00:00:00'),
(11, 'employee1', '$2a$08$maIUJsX67lsKLRWQ2PuiC.UPUDrMeU/zYkExpDIBqdqhpoMdFw4Su', 'nva@gmail.com', 'Nguyễn Văn A', '0908960580', '2020-06-10', 2, '', '0000-00-00 00:00:00'),
(18, 'customer1', '$2a$08$xvk3jhXw606O7WXzrGR.VusFMr2TwlqbxcqtvSeeFSPq.CZdb4H6K', '', 'Nguyễn Văn C', '0123456789', '0000-00-00', 1, 'QMVC5MUCPe4Ef5bO9HqWhzpkX7S7uFWaHc16PwUo0bgfGlx95wMWqytHeM02ezDiTwRPvVbxfrT0JWAI', '2020-06-16 22:10:32');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `deposit_history`
--
ALTER TABLE `deposit_history`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `partnerbank`
--
ALTER TABLE `partnerbank`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `partner_transfer_history`
--
ALTER TABLE `partner_transfer_history`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `paymentaccount`
--
ALTER TABLE `paymentaccount`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `savingaccount`
--
ALTER TABLE `savingaccount`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `transfer_history`
--
ALTER TABLE `transfer_history`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `deposit_history`
--
ALTER TABLE `deposit_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `partnerbank`
--
ALTER TABLE `partnerbank`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `partner_transfer_history`
--
ALTER TABLE `partner_transfer_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `paymentaccount`
--
ALTER TABLE `paymentaccount`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `savingaccount`
--
ALTER TABLE `savingaccount`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `transfer_history`
--
ALTER TABLE `transfer_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;