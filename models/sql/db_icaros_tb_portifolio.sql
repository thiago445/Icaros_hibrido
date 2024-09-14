-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: db_icaros
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tb_portifolio`
--

DROP TABLE IF EXISTS `tb_portifolio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_portifolio` (
  `ID_PORTIFOLIO` int(11) NOT NULL AUTO_INCREMENT,
  `ID_MUSICO` int(11) DEFAULT NULL,
  `DESC_PORTIFOLIO` varchar(255) NOT NULL,
  `LINK` varchar(50) NOT NULL,
  `COMENTARIO` varchar(255) NOT NULL,
  PRIMARY KEY (`ID_PORTIFOLIO`),
  UNIQUE KEY `UK_27wvk1faiq55kp7xiruempa4y` (`ID_MUSICO`),
  CONSTRAINT `FKfbil7dr9p9hcngcfe51m1fdmc` FOREIGN KEY (`ID_MUSICO`) REFERENCES `tb_usuario_musico` (`ID_MUSICO`),
  CONSTRAINT `tb_portifolio_ibfk_1` FOREIGN KEY (`ID_MUSICO`) REFERENCES `tb_usuario_musico` (`ID_MUSICO`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_portifolio`
--

LOCK TABLES `tb_portifolio` WRITE;
/*!40000 ALTER TABLE `tb_portifolio` DISABLE KEYS */;
INSERT INTO `tb_portifolio` VALUES (3,5,'Sou feio as vezes','nao to mais linkado','sempre eu nao comento');
/*!40000 ALTER TABLE `tb_portifolio` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-15 20:57:47
