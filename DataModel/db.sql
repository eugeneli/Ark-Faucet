CREATE SCHEMA IF NOT EXISTS `ArkFaucet` DEFAULT CHARACTER SET utf8 ;
USE `ArkFaucet` ;

CREATE TABLE IF NOT EXISTS `ArkFaucet`.`Unpaid_Balances` (
  `address` VARCHAR(34) NOT NULL,
  `pending` DECIMAL(65, 8) NOT NULL,
  PRIMARY KEY (`address`));

CREATE TABLE IF NOT EXISTS `ArkFaucet`.`Roll_Times` (
  `IP` VARCHAR(15) NOT NULL,
  `lastRoll` DATETIME,
  PRIMARY KEY (`IP`));
