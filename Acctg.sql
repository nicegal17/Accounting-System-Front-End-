-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               5.6.24 - MySQL Community Server (GPL)
-- Server OS:                    Win32
-- HeidiSQL Version:             8.0.0.4396
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for procedure accounting.ACCOUNTING_ENTRY_BB
DROP PROCEDURE IF EXISTS `ACCOUNTING_ENTRY_BB`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `ACCOUNTING_ENTRY_BB`(IN IDACCOUNT INT,IN AMOUNT DOUBLE(18,2))
BEGIN 
	/*SET @BRANCHCODE = (SELECT code FROM tbl_branch WHERE brID = (SELECT idBranch FROM tblsettings))*/

	IF ((SELECT normsID FROM tbl_acctchart WHERE idAcctTitle=IDACCOUNT)=1) THEN
		INSERT INTO tbl_gl(idAcctTitle,transDate,Debit,periodID,book)
		VALUES(IDACCOUNT,curdate,AMOUNT,PERIOD,'BB');
	END IF;
END//
DELIMITER ;


-- Dumping structure for procedure accounting.SP_APVEntries
DROP PROCEDURE IF EXISTS `SP_APVEntries`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_APVEntries`(IN `APVID` INT)
BEGIN
	DROP TEMPORARY TABLE IF EXISTS tbl_tmpAPV;
	CREATE TEMPORARY TABLE tbl_tmpAPV (
		apvID INT(10),
		APVNum VARCHAR(30) NULL,
		transdate VARCHAR(30) NULL,
		particulars VARCHAR(100) NULL,
		title VARCHAR(50) NULL,
		DB DOUBLE(8,2) DEFAULT' 0.00',
		CR DOUBLE(8,2) DEFAULT' 0.00',
		empName VARCHAR(50) NULL,
		appby VARCHAR(50) NULL,
		auditby VARCHAR(50) NULL
	);
	
	INSERT INTO tbl_tmpAPV(apvID, title, DB, appby, auditby)
	SELECT apvID, title, DB, appby, auditby FROM
		(SELECT a.apvID, b.acctTitle AS title, a.amount AS DB, (SELECT a.empName FROM tbl_employee a LEFT JOIN tbl_useracct b ON a.empID=b.empID 
			LEFT JOIN tbl_apv c ON b.userID=c.approveBy WHERE c.apvID=APVID) AS appby, (SELECT a.empName FROM tbl_employee a LEFT JOIN tbl_useracct b 
			ON a.empID=b.empID LEFT JOIN tbl_apv c ON b.userID=c.auditedBy WHERE c.apvID=APVID) AS auditby
		 FROM tbl_apventries a
		 LEFT JOIN tbl_acctchart b ON b.idAcctTitle=a.idAcctTitleDB
	    WHERE a.apvID = APVID AND a.idAcctTitleDB IS NOT NULL group by a.idAcctTitleDB
	) AS tbl;
	
	INSERT INTO tbl_tmpAPV(apvID, title, CR, appby, auditby)
	SELECT apvID, title, CR, appby, auditby FROM
		(SELECT a.apvID, b.acctTitle AS title, a.amount AS CR, (SELECT a.empName FROM tbl_employee a LEFT JOIN tbl_useracct b ON a.empID=b.empID
			LEFT JOIN tbl_apv c ON b.userID=c.approveBy WHERE c.apvID=APVID) AS appby, (SELECT a.empName FROM tbl_employee a LEFT JOIN tbl_useracct b 
			ON a.empID=b.empID LEFT JOIN tbl_apv c ON b.userID=c.auditedBy WHERE c.apvID=APVID) AS auditby
		FROM tbl_apventries a
		LEFT JOIN tbl_acctchart b ON b.idAcctTitle=a.idAcctTitleCR
		WHERE a.apvID = APVID AND a.idAcctTitleCR IS NOT NULL group by a.idAcctTitleCR
	) AS tbl;
	
	UPDATE tbl_tmpAPV a
	LEFT JOIN tbl_apv b ON a.apvID=b.APVID
	LEFT JOIN tbl_useracct c ON c.userID=b.prepBy
	LEFT JOIN tbl_employee d ON d.empID=c.empID
	SET a.APVNum=b.APVNum, a.transDate=b.transDate, a.particulars=b.particulars, a.empName=d.empName
	WHERE b.apvID=APVID;
		
	SELECT * FROM tbl_tmpAPV;
END//
DELIMITER ;


-- Dumping structure for procedure accounting.SP_CDVEntries
DROP PROCEDURE IF EXISTS `SP_CDVEntries`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_CDVEntries`(IN `CDVNo` INT)
BEGIN
	DROP TEMPORARY TABLE IF EXISTS tbl_tmpCDV;
	CREATE TEMPORARY TABLE tbl_tmpCDV (
		PK INT(10),
		cdvID INT(10),
		acctTitle VARCHAR(50),
		DB DOUBLE(8,2) DEFAULT' 0.00',
		CR DOUBLE(8,2) DEFAULT' 0.00'
	);
	
	INSERT INTO tbl_tmpCDV(PK, cdvID, acctTitle, DB)
	SELECT a.PK, a.cdvID, b.acctTitle AS title, a.amount AS DB FROM tbl_cdventries a
	LEFT JOIN tbl_acctchart b ON b.idAcctTitle=a.idAcctTitleDB WHERE a.cdvID=CDVNo AND a.idAcctTitleDB IS NOT NULL group by a.idAcctTitleDB;
	
	INSERT INTO tbl_tmpCDV(PK, cdvID, acctTitle, CR)
	SELECT a.PK, a.cdvID, b.acctTitle AS title, a.amount AS CR FROM tbl_cdventries a
	LEFT JOIN tbl_acctchart b ON b.idAcctTitle=a.idAcctTitleCR WHERE a.cdvID=CDVNo AND a.idAcctTitleCR IS NOT NULL group by a.idAcctTitleCR;
	
	SELECT PK, cdvID,acctTitle AS title,FORMAT(DB,2) AS DB,FORMAT(CR,2) AS CR FROM tbl_tmpCDV;
END//
DELIMITER ;


-- Dumping structure for procedure accounting.SP_CDVPreview
DROP PROCEDURE IF EXISTS `SP_CDVPreview`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_CDVPreview`(IN `id` INT)
BEGIN
	SELECT cdvID, CDVNo, payee, address, chkDate, bankName, chkNo, particular, prepby, approvedby, auditedby, notedby FROM
		(SELECT a.cdvID, a.CDVNo, a.payee, a.address,a.chkDate, d.bankName, a.chkNO, a.particular, b.empName AS prepby,
		(SELECT UPPER(value) FROM tbl_settings WHERE idSettings=2) AS approvedby,
		(SELECT value FROM tbl_settings WHERE idSettings=3) AS auditedby,
		(SELECT UPPER(value) FROM tbl_settings WHERE idSettings=4) AS notedby
	FROM tbl_cdv a
	LEFT JOIN tbl_useracct c ON c.userID=a.prepBy
	LEFT JOIN tbl_employee b ON b.empID=c.empID
	LEFT JOIN tbl_bank d ON d.bankID=a.bankID
	WHERE a.cdvID=id
	) AS tbl;
END//
DELIMITER ;


-- Dumping structure for procedure accounting.SP_EditCDVEntries
DROP PROCEDURE IF EXISTS `SP_EditCDVEntries`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_EditCDVEntries`(IN `PK` INT)
BEGIN
	DROP TEMPORARY TABLE IF EXISTS tbl_tmpCDVEntries;
	CREATE TEMPORARY TABLE tbl_tmpCDVEntries (
		PK INT(10),
		cdvID INT(10),
		acctTitle VARCHAR(50),
		DB DOUBLE(8,2) DEFAULT' 0.00',
		CR DOUBLE(8,2) DEFAULT' 0.00'
	);
	
	INSERT INTO tbl_tmpCDVEntries(PK, cdvID, acctTitle, DB)
	SELECT a.PK, a.cdvID, b.acctTitle AS title, a.amount AS DB FROM tbl_acctngentries a
	LEFT JOIN tbl_acctchart b ON b.idAcctTitle=a.idAcctTitleCR OR b.idAcctTitle=a.idAcctTitleDB WHERE PK=PK;
	
	/*INSERT INTO tbl_tmpCDVEntries(PK, cdvID, acctTitle, CR)
	SELECT a.PK, a.cdvID, b.acctTitle AS title, a.amount AS CR FROM tbl_acctngentries a
	LEFT JOIN tbl_acctchart b ON b.idAcctTitle=a.idAcctTitleCR OR b.idAcctTitle=a.idAcctTitleCR WHERE PK=PK;*/
	
	SELECT PK,cdvID,acctTitle AS title,DB,CR FROM tbl_tmpCDVEntries;
END//
DELIMITER ;


-- Dumping structure for procedure accounting.SP_JVEntries
DROP PROCEDURE IF EXISTS `SP_JVEntries`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_JVEntries`(IN `JID` INT)
BEGIN
	DROP TEMPORARY TABLE IF EXISTS tbl_tmpJV;
	CREATE TEMPORARY TABLE tbl_tmpJV (
		PK INT(10),
		JID INT(10),
		JVNum VARCHAR(30) NULL,
		transdate VARCHAR(30) NULL,
		particulars VARCHAR(100) NULL,
		idAcctTitle INT(10),
		acctTitle VARCHAR(50) NULL,
		DB DOUBLE(8,2) DEFAULT' 0.00',
		CR DOUBLE(8,2) DEFAULT' 0.00',
		empName VARCHAR(50) NULL,
		appby VARCHAR(50) NULL,
		auditby VARCHAR(50) NULL
	);
	
	INSERT INTO tbl_tmpJV(PK, JID, idAcctTitle, acctTitle, DB, appby, auditby)
	SELECT PK, JID, idAcctTitle, acctTitle, DB, appby, auditby FROM
		(SELECT a.PK, a.JID, b.idAcctTitle, b.acctTitle, a.amount AS DB, (SELECT a.empName FROM tbl_employee a LEFT JOIN tbl_useracct b ON a.empID=b.empID 
			LEFT JOIN tbl_gj c ON b.userID=c.approveBy WHERE c.JID=JID) AS appby, (SELECT a.empName FROM tbl_employee a LEFT JOIN tbl_useracct b 
			ON a.empID=b.empID LEFT JOIN tbl_gj c ON b.userID=c.auditedBy WHERE c.JID=JID) AS auditby
		 FROM tbl_journalentries a
		 LEFT JOIN tbl_acctchart b ON b.idAcctTitle=a.idAcctTitleDB
	    WHERE a.JID = JID AND a.idAcctTitleDB IS NOT NULL group by a.idAcctTitleDB
	) AS tbl;
	
	INSERT INTO tbl_tmpJV(PK, JID, idAcctTitle, acctTitle, CR, appby, auditby)
	SELECT PK, JID, idAcctTitle, acctTitle, CR, appby, auditby FROM
		(SELECT a.PK, a.JID, b.idAcctTitle, b.acctTitle, a.amount AS CR, (SELECT a.empName FROM tbl_employee a LEFT JOIN tbl_useracct b ON a.empID=b.empID
			LEFT JOIN tbl_gj c ON b.userID=c.approveBy WHERE c.JID=JID) AS appby, (SELECT a.empName FROM tbl_employee a LEFT JOIN tbl_useracct b 
			ON a.empID=b.empID LEFT JOIN tbl_gj c ON b.userID=c.auditedBy WHERE c.JID=JID) AS auditby
		FROM tbl_journalentries a
		LEFT JOIN tbl_acctchart b ON b.idAcctTitle=a.idAcctTitleCR
		WHERE a.JID = JID AND a.idAcctTitleCR IS NOT NULL group by a.idAcctTitleCR
	) AS tbl;
	
	UPDATE tbl_tmpJV a
	LEFT JOIN tbl_gj b ON a.JID=b.JID
	LEFT JOIN tbl_useracct c ON c.userID=b.prepBy
	LEFT JOIN tbl_employee d ON d.empID=c.empID
	SET a.JVNum=b.JVNum, a.transDate=b.transDate, a.particulars=b.particulars, a.empName=d.empName
	WHERE b.JID=JID;
	
	SELECT * FROM tbl_tmpJV;
END//
DELIMITER ;


-- Dumping structure for table accounting.tbl_acctchart
DROP TABLE IF EXISTS `tbl_acctchart`;
CREATE TABLE IF NOT EXISTS `tbl_acctchart` (
  `idAcctTitle` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `acctCode` varchar(15) DEFAULT NULL,
  `acctTitle` varchar(150) NOT NULL,
  `idParent` int(10) DEFAULT NULL,
  `acctTypeID` int(10) unsigned DEFAULT NULL,
  `normsID` tinyint(10) unsigned DEFAULT NULL,
  `FSID` int(10) unsigned NOT NULL,
  `depth` tinyint(3) DEFAULT '1',
  `postedBy` int(10) DEFAULT NULL,
  `fundID` int(10) unsigned NOT NULL,
  `branchCode` varchar(5) NOT NULL DEFAULT 'SMSi',
  PRIMARY KEY (`idAcctTitle`),
  KEY `acctTypeID_FK` (`acctTypeID`),
  CONSTRAINT `acctTypeID_FK` FOREIGN KEY (`acctTypeID`) REFERENCES `tbl_acctgroup` (`acctTypeID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_acctchart: ~68 rows (approximately)
/*!40000 ALTER TABLE `tbl_acctchart` DISABLE KEYS */;
INSERT INTO `tbl_acctchart` (`idAcctTitle`, `acctCode`, `acctTitle`, `idParent`, `acctTypeID`, `normsID`, `FSID`, `depth`, `postedBy`, `fundID`, `branchCode`) VALUES
	(1, '', 'Deposit in bank - RCBC s/a', NULL, 1, 1, 1, 1, 5, 3, 'SMSi'),
	(2, NULL, 'Deposit in Bank - MBTC', NULL, 1, 1, 1, 1, 5, 3, 'SMSi'),
	(3, NULL, 'Cash on Hand', NULL, 1, 1, 1, 1, 5, 1, 'SMSi'),
	(4, NULL, 'Petty Cash Fund', NULL, 1, 1, 1, 1, 5, 2, 'SMSi'),
	(5, NULL, 'Accounts Receivable-trade', NULL, 1, 1, 1, 1, 5, 3, 'SMSi'),
	(6, NULL, 'Accounts Receivable-nontrade', NULL, 1, 1, 1, 1, 5, 3, 'SMSi'),
	(7, NULL, 'Cash Advances to Employees & Officers', NULL, NULL, 1, 1, 1, 5, 0, 'SMSi'),
	(8, NULL, 'Prepaid Insurance', NULL, 1, 1, 1, 1, 5, 1, 'SMSi'),
	(9, NULL, 'Inventory ', NULL, NULL, 1, 1, 1, 5, 0, 'SMSi'),
	(10, NULL, 'Furnitures & Fixtures', NULL, 2, 1, 1, 1, 5, 1, 'SMSi'),
	(11, NULL, 'Office Equipment', NULL, 2, 1, 1, 1, 5, 1, 'SMSi'),
	(12, NULL, 'Transportation Vehicle', NULL, NULL, 1, 1, 1, 5, 0, 'SMSi'),
	(13, NULL, 'Computer Outfit', NULL, 2, 1, 1, 1, 5, 1, 'SMSi'),
	(14, NULL, 'Recoverable Deposits-Other Assets', NULL, NULL, 1, 1, 1, 5, 0, 'SMSi'),
	(16, '', 'Accum. Depreciation - Furnitures & Fixtures', NULL, 2, 2, 1, NULL, 5, 1, 'SMSi'),
	(17, '', 'Accum. Depreciation - Office Equipment', NULL, 2, 2, 1, NULL, 5, 1, 'SMSi'),
	(18, '', 'Accum. Depreciation - Computer Outfit', NULL, 2, 2, 1, NULL, 5, 1, 'SMSi'),
	(19, '', 'Accum. Depreciation - Transportation Vehicle', NULL, NULL, 2, 1, NULL, 5, 0, 'SMSi'),
	(20, '', 'Accounts Payable-trade', NULL, NULL, 2, 1, NULL, 5, 0, 'SMSi'),
	(21, '', 'Accounts Payable - Vehicle', NULL, NULL, 2, 1, NULL, 5, 0, 'SMSi'),
	(22, '', 'Accounts Payable-nontrade', NULL, NULL, 2, 1, NULL, 5, 0, 'SMSi'),
	(23, '', 'Accrued Expenses', NULL, NULL, 2, 1, NULL, 5, 0, 'SMSi'),
	(24, '', 'SSS Payables', NULL, 3, 2, 1, NULL, 5, 1, 'SMSi'),
	(25, '', 'Phlihealth EE Payable', NULL, 3, 2, 1, NULL, 5, 1, 'SMSi'),
	(26, '', 'Pag-ibig  EE Payable', NULL, 3, 2, 1, NULL, 5, 1, 'SMSi'),
	(27, '', 'Withholding Tax Payable', NULL, 3, 2, 1, NULL, 5, 1, 'SMSi'),
	(28, '', 'Loans Payable-AFC', NULL, 3, 2, 1, NULL, 5, 1, 'SMSi'),
	(29, '', 'MEMBA EP/MD Payable', NULL, NULL, 2, 1, NULL, 5, 0, 'SMSi'),
	(30, '', 'Loans Payable-SSS', NULL, NULL, 2, 1, NULL, 5, 0, 'SMSi'),
	(31, '', 'Loans Payable-HDMF', NULL, NULL, 2, 1, NULL, 5, 0, 'SMSi'),
	(32, '', 'Advances from Officers', NULL, NULL, 2, 1, NULL, 5, 0, 'SMSi'),
	(33, '', 'Capital Stock', NULL, NULL, 2, 1, NULL, 5, 0, 'SMSi'),
	(34, '', 'Retained Earnings', NULL, NULL, 2, 1, NULL, 5, 0, 'SMSi'),
	(35, '', 'Rendering of Services', NULL, NULL, 2, 2, NULL, 5, 0, 'SMSi'),
	(36, '', 'Other Income - PC equip', NULL, NULL, 2, 2, NULL, 5, 0, 'SMSi'),
	(37, '', 'Interest Income', NULL, NULL, 2, 2, NULL, 5, 0, 'SMSi'),
	(38, '', 'Purchases/Direct Cost', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(39, '', 'Salaries & wages ', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(40, '', 'Staff Benefits - JRL', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(41, '', 'Staff Benefits - Rice', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(42, '', 'Staff Benefits - Housing', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(43, '', 'Staff Benefits - Representation', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(44, '', 'Staff Benefits - Transportation', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(45, '', 'Staff Benefits - Honorarium', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(46, '', 'Per Diem', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(47, '', 'Leave Conversion', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(48, '', 'SSS ER Share', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(49, '', 'Philhealth ER Share', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(50, '', 'Pag-ibig ER Share', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(51, '', 'Representation & Entertainment', NULL, 8, 1, 2, NULL, 5, 2, 'SMSi'),
	(52, '', 'Travelling Expenses', NULL, 8, 1, 2, NULL, 5, 2, 'SMSi'),
	(53, '', 'Light & Water', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(54, '', 'Fuel & Lubricants', NULL, 8, 1, 2, NULL, 5, 2, 'SMSi'),
	(55, '', 'Repairs & Maintenance', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(56, '', 'Penalties & Surcharges', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(57, '', 'Office Supplies Expenses', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(58, '', 'Freight Charges', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(59, '', 'Telephone & Internet', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(60, '', 'Taxes & Licenses', NULL, 8, 1, 2, NULL, 5, 2, 'SMSi'),
	(61, '', 'Registration of Vehicle', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(62, '', 'Professional Fee', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(63, '', 'Loyalty', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(64, '', '13th month', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(65, '', 'Bonus', NULL, NULL, 1, 2, NULL, 5, 0, 'SMSi'),
	(66, '', 'Insurance Expense', NULL, 8, 1, 2, NULL, 5, 1, 'SMSi'),
	(67, '', 'Depreciation Expenses', NULL, 8, 1, 2, NULL, 5, 1, 'SMSi'),
	(68, '', 'Miscellaneous Expenses', NULL, 8, 1, 2, NULL, 5, 2, 'SMSi');
/*!40000 ALTER TABLE `tbl_acctchart` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_acctgroup
DROP TABLE IF EXISTS `tbl_acctgroup`;
CREATE TABLE IF NOT EXISTS `tbl_acctgroup` (
  `acctTypeID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `acctType` varchar(50) NOT NULL,
  `acctGroup` varchar(10) NOT NULL,
  `norm` varchar(5) NOT NULL,
  `groupCode` varchar(10) NOT NULL,
  PRIMARY KEY (`acctTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_acctgroup: ~8 rows (approximately)
/*!40000 ALTER TABLE `tbl_acctgroup` DISABLE KEYS */;
INSERT INTO `tbl_acctgroup` (`acctTypeID`, `acctType`, `acctGroup`, `norm`, `groupCode`) VALUES
	(1, 'Current Assets', 'A', 'DR', 'CA'),
	(2, 'Noncurrent Assets', 'A', 'DR', 'NCA'),
	(3, 'Current Liabilities', 'L', 'CR', 'CL'),
	(4, 'Noncurrent Liabilities', 'L', 'CR', 'NCL'),
	(5, 'Member\'s and Owner\'s Equity', 'O', 'CR', 'MOE'),
	(6, 'Revenue', 'R', 'CR', 'R'),
	(7, 'Operating Expenses', 'E', 'DR', 'OE'),
	(8, 'Other Expenses', 'E', 'DR', 'OX');
/*!40000 ALTER TABLE `tbl_acctgroup` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_acctperiod
DROP TABLE IF EXISTS `tbl_acctperiod`;
CREATE TABLE IF NOT EXISTS `tbl_acctperiod` (
  `periodID` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `strDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  PRIMARY KEY (`periodID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_acctperiod: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_acctperiod` DISABLE KEYS */;
INSERT INTO `tbl_acctperiod` (`periodID`, `strDate`, `endDate`) VALUES
	(1, '2015-01-01', '2015-12-31');
/*!40000 ALTER TABLE `tbl_acctperiod` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_apv
DROP TABLE IF EXISTS `tbl_apv`;
CREATE TABLE IF NOT EXISTS `tbl_apv` (
  `apvID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `APVNum` varchar(15) NOT NULL,
  `transDate` date NOT NULL,
  `particulars` varchar(50) NOT NULL,
  `prepBy` int(10) unsigned NOT NULL,
  `approveBy` int(10) unsigned DEFAULT NULL,
  `auditedBy` int(10) unsigned DEFAULT NULL,
  `glPosted` varchar(5) NOT NULL DEFAULT 'PEN',
  `tranStatus` varchar(5) NOT NULL DEFAULT 'PEN',
  `brnch` varchar(5) NOT NULL DEFAULT 'SMSi',
  PRIMARY KEY (`apvID`),
  KEY `pID` (`prepBy`),
  KEY `approve` (`approveBy`),
  KEY `audit` (`auditedBy`),
  CONSTRAINT `approve` FOREIGN KEY (`approveBy`) REFERENCES `tbl_useracct` (`userID`) ON UPDATE CASCADE,
  CONSTRAINT `audit` FOREIGN KEY (`auditedBy`) REFERENCES `tbl_useracct` (`userID`) ON UPDATE CASCADE,
  CONSTRAINT `pID` FOREIGN KEY (`prepBy`) REFERENCES `tbl_useracct` (`userID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_apv: ~4 rows (approximately)
/*!40000 ALTER TABLE `tbl_apv` DISABLE KEYS */;
INSERT INTO `tbl_apv` (`apvID`, `APVNum`, `transDate`, `particulars`, `prepBy`, `approveBy`, `auditedBy`, `glPosted`, `tranStatus`, `brnch`) VALUES
	(3, '201511-0007', '2015-11-11', 'Please save...', 5, 5, 5, 'PEN', 'AUD', 'CDO'),
	(4, '201605-0009', '2016-05-30', 'mt cdo', 5, NULL, NULL, 'PEN', 'PEN', 'CDO'),
	(5, '201606-0011', '2016-06-20', 'test APV. . . .', 5, 5, NULL, 'PEN', 'CAN', 'CDO'),
	(6, '201606-0019', '2016-06-21', 'fdsfdsf', 5, 5, 5, 'PEN', 'AUD', 'SMSi');
/*!40000 ALTER TABLE `tbl_apv` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_apventries
DROP TABLE IF EXISTS `tbl_apventries`;
CREATE TABLE IF NOT EXISTS `tbl_apventries` (
  `PK` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `apvID` int(10) unsigned NOT NULL,
  `idAcctTitleDB` int(10) unsigned DEFAULT NULL,
  `idAcctTitleCR` int(10) unsigned DEFAULT NULL,
  `amount` double(10,0) DEFAULT NULL,
  PRIMARY KEY (`PK`),
  KEY `idAcctTitleCR` (`idAcctTitleCR`),
  KEY `idAcctTitleDB` (`idAcctTitleDB`),
  KEY `APVoucher` (`apvID`),
  CONSTRAINT `APVoucher` FOREIGN KEY (`apvID`) REFERENCES `tbl_apv` (`apvID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_apventries: ~5 rows (approximately)
/*!40000 ALTER TABLE `tbl_apventries` DISABLE KEYS */;
INSERT INTO `tbl_apventries` (`PK`, `apvID`, `idAcctTitleDB`, `idAcctTitleCR`, `amount`) VALUES
	(1, 5, 17, NULL, 100),
	(2, 5, 12, NULL, 100),
	(3, 5, NULL, 4, 200),
	(4, 6, 11, NULL, 11),
	(5, 6, NULL, 12, 11);
/*!40000 ALTER TABLE `tbl_apventries` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_assetinfo
DROP TABLE IF EXISTS `tbl_assetinfo`;
CREATE TABLE IF NOT EXISTS `tbl_assetinfo` (
  `itemID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `itemName` varchar(50) NOT NULL,
  `cost` double(10,0) NOT NULL,
  `datePurchased` date NOT NULL,
  `estLife` int(10) NOT NULL,
  `qty` int(10) NOT NULL,
  `categoryID` int(10) unsigned DEFAULT NULL,
  `idPeriod` tinyint(3) unsigned DEFAULT NULL,
  `postedDate` date NOT NULL,
  `postedBy` int(10) NOT NULL,
  PRIMARY KEY (`itemID`),
  KEY `catID_FK` (`categoryID`),
  KEY `idPeriod_FK` (`idPeriod`),
  CONSTRAINT `catID_FK` FOREIGN KEY (`categoryID`) REFERENCES `tbl_category` (`categoryID`) ON UPDATE CASCADE,
  CONSTRAINT `idPeriod_FK` FOREIGN KEY (`idPeriod`) REFERENCES `tbl_acctperiod` (`periodID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_assetinfo: ~8 rows (approximately)
/*!40000 ALTER TABLE `tbl_assetinfo` DISABLE KEYS */;
INSERT INTO `tbl_assetinfo` (`itemID`, `itemName`, `cost`, `datePurchased`, `estLife`, `qty`, `categoryID`, `idPeriod`, `postedDate`, `postedBy`) VALUES
	(1, 'gfhgf', 4, '2015-08-03', 12, 12, 3, 1, '0000-00-00', 0),
	(2, 'aa', 12, '2015-08-03', 2, 3, 2, 1, '0000-00-00', 0),
	(3, 'Test Item', 10000, '2015-08-03', 12, 3, 4, 1, '0000-00-00', 0),
	(4, 'Computers', 40000, '2015-09-01', 20, 4, 4, 1, '2015-09-03', 0),
	(5, 'Mac Book Pro', 55000, '2015-11-17', 12, 1, 4, NULL, '2015-11-18', 5),
	(6, 'uytuy', 12, '2015-11-17', 12, 12, 6, NULL, '2015-11-18', 5),
	(7, 'Cars', 12, '2015-11-23', 12, 12, 5, NULL, '2015-11-18', 5),
	(8, 'dsadsa', 12, '2015-11-19', 12, 11, 6, NULL, '2015-11-18', 5),
	(9, 'Try', 12, '2015-12-03', 12, 12, 3, NULL, '2015-12-04', 5),
	(10, 'Tryyyyyy', 480, '2016-05-24', 3, 2, 3, NULL, '2016-05-28', 5);
/*!40000 ALTER TABLE `tbl_assetinfo` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_bank
DROP TABLE IF EXISTS `tbl_bank`;
CREATE TABLE IF NOT EXISTS `tbl_bank` (
  `bankID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bankName` varchar(60) DEFAULT NULL,
  `acctNum` varchar(40) DEFAULT NULL,
  `address` varchar(60) DEFAULT NULL,
  `Tel` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`bankID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_bank: ~3 rows (approximately)
/*!40000 ALTER TABLE `tbl_bank` DISABLE KEYS */;
INSERT INTO `tbl_bank` (`bankID`, `bankName`, `acctNum`, `address`, `Tel`) VALUES
	(1, 'RCBC', '4895-485-45', 'Velez St., CDO', '225-956'),
	(2, 'Metro Bank', 'gfhgf', 'ghgf', '12345678'),
	(3, 'Union Bank', '1254697', 'Velez St.', '2239052'),
	(4, 'Metro Bank', 'ass', 'q', 'ewrewr');
/*!40000 ALTER TABLE `tbl_bank` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_bankacct
DROP TABLE IF EXISTS `tbl_bankacct`;
CREATE TABLE IF NOT EXISTS `tbl_bankacct` (
  `acctID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `acctNo` varchar(30) NOT NULL,
  `bankID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`acctID`),
  KEY `bankID` (`bankID`),
  CONSTRAINT `bankID` FOREIGN KEY (`bankID`) REFERENCES `tbl_bank` (`bankID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_bankacct: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_bankacct` DISABLE KEYS */;
INSERT INTO `tbl_bankacct` (`acctID`, `acctNo`, `bankID`) VALUES
	(1, '1919-1919-11', 1);
/*!40000 ALTER TABLE `tbl_bankacct` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_book
DROP TABLE IF EXISTS `tbl_book`;
CREATE TABLE IF NOT EXISTS `tbl_book` (
  `bookID` tinyint(5) unsigned NOT NULL AUTO_INCREMENT,
  `bookType` varchar(10) NOT NULL,
  `bookName` varchar(60) NOT NULL,
  PRIMARY KEY (`bookID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_book: ~8 rows (approximately)
/*!40000 ALTER TABLE `tbl_book` DISABLE KEYS */;
INSERT INTO `tbl_book` (`bookID`, `bookType`, `bookName`) VALUES
	(1, 'CRJ', 'Cash Receipts Journal'),
	(2, 'GJ', 'General Journal'),
	(3, 'SRA', 'Sales Return and Allowances'),
	(4, 'CDJ', 'Cash Disbursement Journal'),
	(5, 'BB', 'Beginning Balance'),
	(6, 'ARJ', 'Accounts Receivable Journal'),
	(7, 'SJ', 'Sales Journal'),
	(8, 'APJ', 'Accounts Payable Journal'),
	(9, 'PRA', 'Purchase Return and Allowances');
/*!40000 ALTER TABLE `tbl_book` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_branch
DROP TABLE IF EXISTS `tbl_branch`;
CREATE TABLE IF NOT EXISTS `tbl_branch` (
  `brID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `brName` varchar(100) DEFAULT NULL,
  `brManager` varchar(100) DEFAULT NULL,
  `brAddress` varchar(100) DEFAULT NULL,
  `tel` varchar(15) DEFAULT NULL,
  `IP` varchar(60) DEFAULT NULL,
  `code` varchar(20) DEFAULT NULL,
  `userID` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`brID`),
  KEY `IDUser` (`userID`),
  CONSTRAINT `IDUser` FOREIGN KEY (`userID`) REFERENCES `tbl_useracct` (`userID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_branch: ~7 rows (approximately)
/*!40000 ALTER TABLE `tbl_branch` DISABLE KEYS */;
INSERT INTO `tbl_branch` (`brID`, `brName`, `brManager`, `brAddress`, `tel`, `IP`, `code`, `userID`) VALUES
	(1, 'MT-ILG', 'Dantes, Jean', 'CDO', '2254045', '198.68.1.12', '001', 5),
	(2, 'MT-DVO', 'Eunice Lacson', 'Davao City', '2239052', '192.168.1.1', '1125', 5),
	(4, 'MT-CDO', 'Bersano, Melanie M', 'Barra Iponan, CDO', '223-9052', '198.168.1.1', '002fff', 5),
	(5, 'qqqq', 'dsfghjhjhg', 'sdfdshgj', 'tertret', 'dsfds', 'dsfdsf', 5),
	(6, 'MT-PGD', 'fdgfd', 'fdgfdg', 'fdgfd', 'gfgfd', 'fdgfdg', 5),
	(7, 'Solutions Management System Inc.', 'Montera, Elvira', '47 Hayes Cor. Pabayo Sts. , Cagayan De Oro', '789456321', '192.168.1.1', 'SMSi', 5),
	(8, 'MT ZAMBOANGA', 'Ryan Rems', 'Zamboanga Sibugay', '2257426', '192.167.1.1', 'mt_zbo', 5);
/*!40000 ALTER TABLE `tbl_branch` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_category
DROP TABLE IF EXISTS `tbl_category`;
CREATE TABLE IF NOT EXISTS `tbl_category` (
  `categoryID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `desc` varchar(50) NOT NULL,
  `idAcctTitle` int(10) unsigned NOT NULL,
  `Type` varchar(5) NOT NULL,
  PRIMARY KEY (`categoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_category: ~6 rows (approximately)
/*!40000 ALTER TABLE `tbl_category` DISABLE KEYS */;
INSERT INTO `tbl_category` (`categoryID`, `desc`, `idAcctTitle`, `Type`) VALUES
	(1, 'Land', 152, 'FA'),
	(2, 'Building', 153, 'FA'),
	(3, 'Furniture and Fixture', 154, 'FA'),
	(4, 'Office Equipment', 155, 'FA'),
	(5, 'Garage Equipment', 156, 'FA'),
	(6, 'Transportation Equipment', 157, 'FA');
/*!40000 ALTER TABLE `tbl_category` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_cdv
DROP TABLE IF EXISTS `tbl_cdv`;
CREATE TABLE IF NOT EXISTS `tbl_cdv` (
  `cdvID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `CDVNo` varchar(30) NOT NULL,
  `payee` varchar(60) NOT NULL,
  `address` varchar(60) NOT NULL,
  `chkDate` date NOT NULL,
  `bankID` int(10) unsigned NOT NULL,
  `amount` double(10,0) DEFAULT NULL,
  `chkNO` varchar(20) NOT NULL,
  `particular` varchar(100) NOT NULL,
  `transDate` date DEFAULT NULL,
  `status` varchar(10) DEFAULT 'PEN',
  `prepBy` int(10) unsigned DEFAULT NULL,
  `posted` varchar(15) DEFAULT 'PEN',
  `postedBy` int(10) unsigned DEFAULT NULL,
  `postedDate` date DEFAULT NULL,
  `approveby` int(10) unsigned DEFAULT NULL,
  `auditedBy` int(10) unsigned DEFAULT NULL,
  `idperiod` tinyint(3) unsigned DEFAULT NULL,
  PRIMARY KEY (`cdvID`),
  KEY `bnkID` (`bankID`),
  KEY `UID` (`prepBy`),
  KEY `appBy` (`approveby`),
  CONSTRAINT `UID` FOREIGN KEY (`prepBy`) REFERENCES `tbl_useracct` (`userID`) ON UPDATE CASCADE,
  CONSTRAINT `appBy` FOREIGN KEY (`approveby`) REFERENCES `tbl_useracct` (`userID`) ON UPDATE CASCADE,
  CONSTRAINT `bnkID` FOREIGN KEY (`bankID`) REFERENCES `tbl_bank` (`bankID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_cdv: ~44 rows (approximately)
/*!40000 ALTER TABLE `tbl_cdv` DISABLE KEYS */;
INSERT INTO `tbl_cdv` (`cdvID`, `CDVNo`, `payee`, `address`, `chkDate`, `bankID`, `amount`, `chkNO`, `particular`, `transDate`, `status`, `prepBy`, `posted`, `postedBy`, `postedDate`, `approveby`, `auditedBy`, `idperiod`) VALUES
	(1, '201605-0029', 'Jean A. Salvan', 'Cagayan de Oro City', '2014-01-26', 1, 7509, '1200000216', 'Repair and Maintenance for Innova', '2016-05-30', 'CAN', 5, 'PEN', NULL, NULL, 5, NULL, NULL),
	(2, '201605-0030', 'ALFREDO BONIEL &/OR JEAN A. SALVAN', 'Cagayan de Oro City', '2014-01-26', 1, 7509, '1200000216', 'Repair and Maintenance for Innova', '2016-05-30', 'PEN', 5, 'PEN', NULL, NULL, 5, NULL, NULL),
	(3, '201605-0031', 'GLOBE TELECOM', 'CAGAYAN DE ORO CITY', '2014-01-26', 1, 2556, '1200000215', 'TELEPHONE ALLOWANCE OF BBC FOR DECEMBER 13, 2013-JANUARY 12,', '2016-05-30', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(4, '201605-0032', 'GLOBE TELECOM', 'CAGAYAN DE ORO CITY', '2014-01-26', 1, 2556, '1200000215', 'TELEPHONE ALLOWANCE OF BBC FOR DECEMBER 13, 2013-JANUARY 12,', '2016-05-30', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(5, '201605-0033', 'GLOBE TELECOM', 'CAGAYAN DE ORO CITY', '2014-01-26', 1, 2556, '1200000215', 'TELEPHONE ALLOWANCE OF BBC FOR DECEMBER 13, 2013-JANUARY 12,', '2016-05-30', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(6, '201606-0036', 'ALFREDO BONIEL &/OR JEAN A. SALVAN', 'CAGAYAN DE ORO CITY', '2014-01-26', 1, 7509, '1200000216', 'IN FULL PAYMENT OF SMSi\'s REPAIR AND MAINTENANCE FOR INNOVA', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(7, '201606-0037', 'GLOBE TELECOM', 'CAGAYAN DE ORO CITY', '2014-01-26', 1, 2556, '1200000215', 'IN FULL PAYMENT OF SMSi\'s TELEPHONE ALLOWANCE OF BBC FOR THE PERIOD OF DECEMBER 13,2013-JANUARY 12,2', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(8, '201606-0038', 'GLOBE TELECOM', 'CAGAYAN DE ORO CITY', '2014-01-26', 1, 2556, '1200000215', 'IN FULL PAYMENT OF SMSi\'s TELEPHONE ALLOWANCE OF BBC FOR THE PERIOD OF DECEMBER 13,2013-JANUARY 12,2', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(9, '201606-0039', 'GLOBE TELECOM', 'CAGAYAN DE ORO CITY', '2014-01-26', 1, 2556, '1200000215', 'IN FULL PAYMENT OF SMSi\'s TELEPHONE ALLOWANCE OF BBC FOR THE PERIOD OF DECEMBER 13,2013-JANUARY 12,2', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(10, '201606-0040', 'MEMBA', 'CAGAYAN DE ORO CITY', '2014-01-17', 1, 2385, '1200000212', 'IN FULL PAYMENT OF SMSi\'s MD&EP SHARE FR THE MONTH OF JANUARY 2014', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(11, '201606-0041', 'MEMBA', 'CAGAYAN DE ORO', '2014-01-17', 1, 2385, '1200000212', 'IN FULL PAYMENT OF SMSi\'s MD & EP SHARE FOR THE MONTH OF JANUARY 2014', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(12, '201606-0043', 'ALFREDO BONIEL &/OR JEAN A. SALVAN', 'CAGAYAN DE ORO CITY', '2014-01-26', 1, 7509, '1200000216', 'IN FULL PAYMENTS OF SMSI\'S REPAIR AND MAINTENANCE FOR INNOVA', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(13, '201606-0044', 'GLOBE TELECOM', 'CAGAYAN DE ORO CITY', '2014-01-26', 1, 2556, '1200000215', 'IN FULL PAYMENT OF SMSI\'S TELEPHONE ALLOWANCE OF BBC FOR THE PERIOD OF DECEMBER 13, 2013-JANUARY 12,', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(14, '201606-0045', 'ELVIRA C. MONTERA', 'CAGAYAN DE ORO CITY', '2014-01-21', 1, 5000, '1200000214', 'IN FULL PAYMENT OF SMSI\'S CASH ADVANCE - ECM', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(15, '201606-0046', 'ELVIRA C. MONTERA', 'CAGAYAN DE ORO CITY', '2014-01-21', 1, 5000, '1200000213', 'IN FULL PAYMENT OF SMSI\'S CASH ADVANCE - ECM', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(16, '201606-0047', 'MEMBA', 'CAGAYAN DE ORO CITY', '2014-01-17', 1, 2385, '1200000212', 'IN FULL PAYMENT OF SMSI\'S MD & EP SHARE FOR THE MONTH OF JANUARY 2014', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(17, '201606-0048', 'AMAARA FINANCIAL CORPORATION', 'CAGAYAN DE ORO CITY', '2014-01-17', 1, 26044, '1200000211', 'IN FULL PAYEMENT OF SMSI\'S LOAN PAYABLE TO AFC-DVO FOR THE MONTH OF JANUARY 15,2014', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(18, '201606-0049', 'BAYAN TELECOMMUNICATIONS INC', 'CAGAYAN DE ORO CITY', '2014-01-17', 1, 2599, '1200000210', 'IN FULL PAYMENT OF SMSI\'S INTERNET SUBSCRIPTION FOR THE MONTH OF DECEMBER 2013', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(19, '201606-0050', 'SMART COMMUNICATIONS INC', 'CAGAYAN DE ORO CITY', '2014-01-17', 1, 2400, '1200000209', 'IN FULL PAYMENT OF SMSI\'S TELEPHONE (SMART GOLD) FOR THE PERIOD OF NOV 29-DEC 28,2013', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(20, '201606-0051', 'BUREAU OF INTERNAL REVENUE', 'CAGAYAN DE ORO CITY', '2014-01-17', 1, 3555, '4261595124', 'IN FULL PAYMENT OF SMSI\'S PERCENTAGE TAX FOR THE REVENUE PERIOD OF DECEMBER 2013', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(21, '201606-0052', 'PLDT-PHILCOM INC.', 'CAGAYAN DE ORO CITY', '2014-01-17', 1, 921, '1200000208', 'IN FULL PAYMENT OF SMSI\'S TELEPHONE FOR THE STATEMENT AS OF JAN 01, 2014', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(22, '201606-0053', 'MANILA TEACHERS\' SLAI', 'CAGAYAN DE ORO CITY', '2014-01-17', 1, 30000, '1200000207', 'IN FULL PAYMENT OF SMSI\'S ELECTRICITY AND WATER SHARE FOR THE MONTHS OF NOVEMBER AND DECEMBER', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(23, '201606-0051', 'BUREAU OF INTERNAL REVENUE', 'CAGAYAN DE ORO CITY', '2014-01-17', 1, 3555, '4261595124', 'IN FULL PAYMENT OF SMSI\'S PERCENTAGE TAX FOR THE REVENUE PERIOD OF DECEMBER 2013', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(24, '201606-0052', 'PLDT-PHILCOM INC.', 'CAGAYAN DE ORO CITY', '2014-01-17', 1, 921, '1200000208', 'IN FULL PAYMENT OF SMSI\'S TELEPHONE FOR THE STATEMENT AS OF JAN 01, 2014', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(25, '201606-0053', 'MANILA TEACHERS\' SLAI', 'CAGAYAN DE ORO CITY', '2014-01-17', 1, 30000, '1200000207', 'IN FULL PAYMENT OF SMSI\'S ELECTRICITY AND WATER SHARE FOR THE MONTHS OF NOVEMBER AND DECEMBER', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(26, '201606-0054', 'JEAN A. SALVAN', 'CAGAYAN DE ORO CITY', '2014-01-17', 1, 3400, '1200000206', 'IN FULL PAYMENT OF SMSI\'S FUEL AND CASH ADVANCE FOR BUSINESS PERMIT', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(27, '201606-0055', 'RENANTE E. BUTALID &/OR JEAN A. SALVAN', 'CAGAYAN DE ORO CITY', '2014-01-17', 1, 5000, '1200000205', 'IN FULL PAYMENT OF SMSI\'S DONATIONS/FINANCIAL ASSISTANCE FOR REB', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(28, '201606-0056', 'GLOBE TELECOM', 'CAGAYAN DE ORO CITY', '2014-01-14', 1, 2906, '1200000204', 'IN FULL PAYMENT OF SMSI\'S TELEPHONE ALLOWANCE OF BBC- BILL PERIOD: NOVEMBER 13, 2013-DECEMBER 12, 20', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(29, '201606-0057', 'JEAN A. SALVAN', 'CAGAYAN DE ORO CITY', '2014-01-12', 1, 1500, '4261595123', 'IN FULL PAYMENT OF SMSI\'S FUEL REQUEST', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(30, '201606-0058', 'SHERWIN S. VILLAMOR', 'CAGAYAN DE ORO CITY', '2014-01-12', 1, 3000, '1200000203', 'IN FULL PAYMENT OF SSV\'S CASH ADVANCE FOR DAVAO TRAVEL', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(31, '201606-0059', 'SHERWIN S. VILLAMOR', 'CAGAYAN DE ORO CITY', '2014-01-12', 1, 3000, '1200000203', 'IN FULL PAYMENT OF SSV\'S CASH ADVANCE FOR DAVAO TRAVEL', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(32, '201606-0060', 'METROPOLITAN BANK & TRUST COMPANY', 'CAGAYAN DE ORO CITY', '2014-01-12', 1, 9601, '4261595122', 'IN FULL PAYMENT OF SMSI\'S PAYABLE TO JRL CREDIT CARD FOR THE PURCHASES OF DOMAIN NAMES', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(33, '201606-0061', 'INTERPACE COMPUTER SYSTEMS', 'CAGAYAN DE ORO CITY', '2014-01-12', 1, 10485, '1200000202', 'IN FULL PAYMENT OF SMSI\'S A/R OF C3 AND M.CHIONGBIAN WITH PO NO. 2013-027 & 2013-028', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(34, '201606-0062', 'GLOBE TELECOM', 'CAGAYAN DE ORO CITY', '2014-01-12', 1, 1200, '1200000201', 'IN FULL PAYMENT OF SMSI\'S TELEPHONE ALLOWANCE OF SSV FOR BILL PERIOD: NOVEMBER 21, 201 - DECEMBER 20', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(35, '201606-0063', 'JEAN A. SALVAN', 'CAGAYAN DE ORO CITY', '2014-01-09', 1, 57825, '1200000200', 'IN FULL PAYMENT OF SMSI\'S CASH ADVANCE FOR RENEWAL OF ALL BUSINESS LICENSE FOR THE WHOLE YEAR OF 201', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(36, '201606-0064', 'BUREAU OF INTERNAL REVENUE', 'CAGAYAN DE ORO CITY', '2014-01-08', 1, 8512, '4261595121', 'IN FULL PAYMENT OF SMSI\'S WITHHOLDING TAX-COMPENSATION FOR THE MONTH OF DECEMBER 2013', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(37, '201606-0065', 'JEAN A. SALVAN', 'CAGAYAN DE ORO CITY', '2014-01-07', 1, 30073, '1200000199', 'IN FULL PAYMENT OF SMSI\'S STAFF BENEFITS REMITTANCES FOR DECEMBER 2013', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(38, '201606-0066', 'JEAN A. SALVAN', 'CAGAYAN DE ORO CITY', '2014-01-05', 1, 2853, '4261595120', 'IN FULL PAYMENT OF SMSI\'S PETTY CASH REPLENISHMENT AND OFFICE SUPPLIES FOR THE PERIOD OF JANUARY 201', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(39, '201606-0067', 'JEAN A. SALVAN', 'CAGAYAN DE ORO CITY', '2014-02-26', 2, 3888, '4261595131', 'IN FULL PAYMENT OF SMSI\'S PETTY CASH REPLENISHMENT, FUEL FOR ECQ ON MARCH 3, 2014', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(40, '201606-0068', 'GLOBE TELECOM', 'CAGAYAN DE ORO CITY', '2014-02-25', 1, 1200, '1200000235', 'IN FULL PAYMENT OF SMSI\'S TELEPHONE ALLOWANCE OF SSV FOR BILL PERIOD 21 DECEMBER 2013-20 JANUARY 201', '2016-06-01', 'PEN', 5, 'PEN', NULL, NULL, NULL, NULL, NULL),
	(41, '201606-0069', 'DANIEL O. FAGELA &/OR JEAN A.SALVAN', 'CAGAYAN DE ORO CITY', '2014-02-21', 1, 56886, '1200000234', 'IN FULL PAYMENT OF SMSI\'S CASH ADVANCE FOR CCTV EQUIPMENT FOR VESPA SHOWROOM', '2016-06-01', 'APR', 5, 'PEN', NULL, NULL, 5, NULL, NULL),
	(42, '201606-0070', 'Charelene Almuete', 'NHA', '2016-06-08', 1, 10000, '57785', 'IN FULL PAYMENT OF SMSI\'S CASH ADVANCE FOR CCTV EQUIPMENT FOR VESPA SHOWROOM', '2016-06-09', 'APR', 5, 'PEN', NULL, NULL, 5, 2, NULL);
/*!40000 ALTER TABLE `tbl_cdv` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_cdventries
DROP TABLE IF EXISTS `tbl_cdventries`;
CREATE TABLE IF NOT EXISTS `tbl_cdventries` (
  `PK` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cdvID` int(10) unsigned NOT NULL,
  `idAcctTitleDB` int(10) unsigned DEFAULT NULL,
  `idAcctTitleCR` int(10) unsigned DEFAULT NULL,
  `amount` double(10,0) NOT NULL,
  PRIMARY KEY (`PK`),
  KEY `fkcdv` (`cdvID`),
  KEY `CRFK` (`idAcctTitleCR`),
  KEY `DBFK` (`idAcctTitleDB`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_cdventries: ~2 rows (approximately)
/*!40000 ALTER TABLE `tbl_cdventries` DISABLE KEYS */;
INSERT INTO `tbl_cdventries` (`PK`, `cdvID`, `idAcctTitleDB`, `idAcctTitleCR`, `amount`) VALUES
	(1, 42, 1, NULL, 10000),
	(2, 42, NULL, 4, 10000);
/*!40000 ALTER TABLE `tbl_cdventries` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_checks
DROP TABLE IF EXISTS `tbl_checks`;
CREATE TABLE IF NOT EXISTS `tbl_checks` (
  `checkID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Items` varchar(100) NOT NULL,
  `amount` double(10,0) NOT NULL,
  `check_date` date NOT NULL,
  `userID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`checkID`),
  KEY `checkUserID` (`userID`),
  CONSTRAINT `checkUserID` FOREIGN KEY (`userID`) REFERENCES `tbl_useracct` (`userID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_checks: ~8 rows (approximately)
/*!40000 ALTER TABLE `tbl_checks` DISABLE KEYS */;
INSERT INTO `tbl_checks` (`checkID`, `Items`, `amount`, `check_date`, `userID`) VALUES
	(1, 'Mac Book Pro', 55000, '2015-11-13', 5),
	(2, 'Computers', 30000, '2015-11-16', 5),
	(15, 'dcgfdg', 12, '2015-12-05', 5),
	(16, 'Jaye', 12, '2015-12-04', 5),
	(17, 'gfhgf', 12, '2015-12-04', 5),
	(18, 'asas', 12, '2015-12-04', 5),
	(19, 'ffdsf', 12, '2015-12-04', 5),
	(20, 'dfgd', 12, '2015-12-04', 5),
	(21, 'kjhk', 12, '0000-00-00', 5),
	(22, 'gdf', 12, '0000-00-00', 5),
	(23, 'Computers', 5000, '2016-05-27', 5),
	(24, 'JEAN A. SALVAN', 7509, '2014-01-26', 5);
/*!40000 ALTER TABLE `tbl_checks` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_employee
DROP TABLE IF EXISTS `tbl_employee`;
CREATE TABLE IF NOT EXISTS `tbl_employee` (
  `empID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `empName` varchar(100) DEFAULT NULL,
  `empAddress` varchar(100) DEFAULT NULL,
  `phoneNo` varchar(15) DEFAULT NULL,
  `idPosition` tinyint(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`empID`),
  KEY `idPosition` (`idPosition`),
  CONSTRAINT `tbl_employee_ibfk_1` FOREIGN KEY (`idPosition`) REFERENCES `tbl_position` (`idPosition`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_employee: ~7 rows (approximately)
/*!40000 ALTER TABLE `tbl_employee` DISABLE KEYS */;
INSERT INTO `tbl_employee` (`empID`, `empName`, `empAddress`, `phoneNo`, `idPosition`) VALUES
	(1, 'Alchas, Shiela', 'Gusa, Cdo', '546456', 5),
	(2, 'Sherwin qq', 'Iponan, CDO', '09123645789', 2),
	(3, 'Janine Jasmin', 'Lugait', '09214563985', 3),
	(4, 'Jasmin, Janinedfgfdg', '12th-29th St. Nazareth, Cdo', '09093130225', 1),
	(5, 'Moreno, Renan', 'Barra, Iponan', '09094569874', 4),
	(6, 'Arangco, Marco', 'Kauswagan, NHA', 'fdgfdg', 3),
	(7, 'rwe', 'ewr', 'werwer', 1);
/*!40000 ALTER TABLE `tbl_employee` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_fs
DROP TABLE IF EXISTS `tbl_fs`;
CREATE TABLE IF NOT EXISTS `tbl_fs` (
  `FSID` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `FSDesc` varchar(30) NOT NULL,
  `FS` varchar(5) NOT NULL,
  PRIMARY KEY (`FSID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_fs: ~2 rows (approximately)
/*!40000 ALTER TABLE `tbl_fs` DISABLE KEYS */;
INSERT INTO `tbl_fs` (`FSID`, `FSDesc`, `FS`) VALUES
	(1, 'Balance Sheet', 'BS'),
	(2, 'Income Statement', 'IS');
/*!40000 ALTER TABLE `tbl_fs` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_fund
DROP TABLE IF EXISTS `tbl_fund`;
CREATE TABLE IF NOT EXISTS `tbl_fund` (
  `fundID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fundDesc` varchar(60) DEFAULT NULL,
  `fundCode` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`fundID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_fund: ~4 rows (approximately)
/*!40000 ALTER TABLE `tbl_fund` DISABLE KEYS */;
INSERT INTO `tbl_fund` (`fundID`, `fundDesc`, `fundCode`) VALUES
	(1, 'Optional Fund', 'OF'),
	(2, 'General Fund', 'GF'),
	(3, 'Basic Benefit Fund', 'BF'),
	(4, 'Consolidated Fund', 'CF');
/*!40000 ALTER TABLE `tbl_fund` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_gj
DROP TABLE IF EXISTS `tbl_gj`;
CREATE TABLE IF NOT EXISTS `tbl_gj` (
  `JID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `JVNum` varchar(30) NOT NULL,
  `transDate` date DEFAULT NULL,
  `prepBy` int(10) unsigned NOT NULL,
  `particulars` varchar(50) NOT NULL,
  `approveBy` int(10) unsigned DEFAULT NULL,
  `auditedBy` int(10) unsigned DEFAULT NULL,
  `glPOsted` varchar(10) NOT NULL DEFAULT 'PEN',
  `status` varchar(10) NOT NULL DEFAULT 'PEN',
  `brnch` varchar(10) DEFAULT 'SMSi',
  PRIMARY KEY (`JID`),
  KEY `ID` (`prepBy`),
  KEY `AppID` (`approveBy`),
  CONSTRAINT `AppID` FOREIGN KEY (`approveBy`) REFERENCES `tbl_useracct` (`userID`) ON UPDATE CASCADE,
  CONSTRAINT `ID` FOREIGN KEY (`prepBy`) REFERENCES `tbl_useracct` (`userID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_gj: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_gj` DISABLE KEYS */;
INSERT INTO `tbl_gj` (`JID`, `JVNum`, `transDate`, `prepBy`, `particulars`, `approveBy`, `auditedBy`, `glPOsted`, `status`, `brnch`) VALUES
	(29, '201701-0028', '2017-01-05', 5, 'dasdsad', NULL, NULL, 'PEN', 'PEN', 'SMSi');
/*!40000 ALTER TABLE `tbl_gj` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_gl
DROP TABLE IF EXISTS `tbl_gl`;
CREATE TABLE IF NOT EXISTS `tbl_gl` (
  `GLID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idAcctTitle` int(10) unsigned DEFAULT NULL,
  `transDate` date NOT NULL,
  `amount` double(10,0) NOT NULL,
  `branchCode` varchar(10) NOT NULL DEFAULT 'CDO',
  `periodID` tinyint(3) unsigned DEFAULT NULL,
  `bookID` tinyint(5) unsigned DEFAULT NULL,
  `normsID` int(5) unsigned DEFAULT NULL,
  `postedBY` int(5) unsigned NOT NULL,
  PRIMARY KEY (`GLID`),
  KEY `idacctTitle_FK` (`idAcctTitle`),
  KEY `periodID_FK` (`periodID`),
  KEY `bookIDFK` (`bookID`),
  KEY `normID_FK` (`normsID`),
  CONSTRAINT `bookIDFK` FOREIGN KEY (`bookID`) REFERENCES `tbl_book` (`bookID`) ON UPDATE CASCADE,
  CONSTRAINT `normID_FK` FOREIGN KEY (`normsID`) REFERENCES `tbl_normalbalance` (`normsID`) ON UPDATE CASCADE,
  CONSTRAINT `periodID_FK` FOREIGN KEY (`periodID`) REFERENCES `tbl_acctperiod` (`periodID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_gl: ~7 rows (approximately)
/*!40000 ALTER TABLE `tbl_gl` DISABLE KEYS */;
INSERT INTO `tbl_gl` (`GLID`, `idAcctTitle`, `transDate`, `amount`, `branchCode`, `periodID`, `bookID`, `normsID`, `postedBY`) VALUES
	(1, NULL, '0000-00-00', 100, 'CDO', NULL, NULL, NULL, 0),
	(2, 1, '0000-00-00', 100, 'CDO', 1, 5, NULL, 0),
	(3, 14, '2015-09-01', 12, 'CDO', NULL, NULL, NULL, 0),
	(4, 14, '2015-09-01', 1234, 'CDO', 1, 5, NULL, 0),
	(5, 10, '2015-09-01', 5354, 'CDO', 1, 5, NULL, 0),
	(6, 31, '2015-09-02', 5765, 'CDO', 1, 5, 2, 0),
	(7, 34, '2015-09-02', 4324, 'CDO', 1, 5, 1, 0),
	(8, 3, '2015-09-22', 100000, 'CDO', 1, 5, 1, 0),
	(9, 23, '2016-05-28', 145000, 'CDO', 1, 5, 1, 0);
/*!40000 ALTER TABLE `tbl_gl` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_journalentries
DROP TABLE IF EXISTS `tbl_journalentries`;
CREATE TABLE IF NOT EXISTS `tbl_journalentries` (
  `PK` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `JID` int(10) unsigned NOT NULL,
  `idAcctTitleDB` int(10) unsigned DEFAULT NULL,
  `idAcctTitleCR` int(10) unsigned DEFAULT NULL,
  `amount` double(10,0) NOT NULL,
  PRIMARY KEY (`PK`),
  KEY `JID` (`JID`),
  KEY `CR` (`idAcctTitleCR`),
  KEY `DB` (`idAcctTitleDB`),
  CONSTRAINT `JID` FOREIGN KEY (`JID`) REFERENCES `tbl_gj` (`JID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_journalentries: ~2 rows (approximately)
/*!40000 ALTER TABLE `tbl_journalentries` DISABLE KEYS */;
INSERT INTO `tbl_journalentries` (`PK`, `JID`, `idAcctTitleDB`, `idAcctTitleCR`, `amount`) VALUES
	(25, 29, 13, NULL, 1),
	(26, 29, NULL, 10, 1);
/*!40000 ALTER TABLE `tbl_journalentries` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_modules
DROP TABLE IF EXISTS `tbl_modules`;
CREATE TABLE IF NOT EXISTS `tbl_modules` (
  `module_id` tinyint(10) unsigned NOT NULL AUTO_INCREMENT,
  `module_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`module_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_modules: ~4 rows (approximately)
/*!40000 ALTER TABLE `tbl_modules` DISABLE KEYS */;
INSERT INTO `tbl_modules` (`module_id`, `module_name`) VALUES
	(1, 'Manage Users'),
	(2, 'Settings'),
	(3, 'Accounting'),
	(4, 'Tasks'),
	(5, 'Reports');
/*!40000 ALTER TABLE `tbl_modules` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_mop
DROP TABLE IF EXISTS `tbl_mop`;
CREATE TABLE IF NOT EXISTS `tbl_mop` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `payment` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_mop: ~2 rows (approximately)
/*!40000 ALTER TABLE `tbl_mop` DISABLE KEYS */;
INSERT INTO `tbl_mop` (`id`, `payment`) VALUES
	(1, 'check'),
	(2, 'cash');
/*!40000 ALTER TABLE `tbl_mop` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_normalbalance
DROP TABLE IF EXISTS `tbl_normalbalance`;
CREATE TABLE IF NOT EXISTS `tbl_normalbalance` (
  `normsID` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `normDesc` varchar(8) DEFAULT NULL,
  `normCode` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`normsID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_normalbalance: ~2 rows (approximately)
/*!40000 ALTER TABLE `tbl_normalbalance` DISABLE KEYS */;
INSERT INTO `tbl_normalbalance` (`normsID`, `normDesc`, `normCode`) VALUES
	(1, 'Debit', 'DR'),
	(2, 'Credit', 'CR');
/*!40000 ALTER TABLE `tbl_normalbalance` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_or
DROP TABLE IF EXISTS `tbl_or`;
CREATE TABLE IF NOT EXISTS `tbl_or` (
  `ORID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ORNum` varchar(50) NOT NULL,
  `transDate` date NOT NULL,
  `branch` int(10) unsigned NOT NULL,
  `amount` double NOT NULL,
  `particulars` varchar(50) NOT NULL,
  `userID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ORID`),
  KEY `addedBY` (`userID`),
  KEY `BRName` (`branch`),
  CONSTRAINT `BRName` FOREIGN KEY (`branch`) REFERENCES `tbl_branch` (`brID`) ON UPDATE CASCADE,
  CONSTRAINT `addedBY` FOREIGN KEY (`userID`) REFERENCES `tbl_useracct` (`userID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_or: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_or` DISABLE KEYS */;
INSERT INTO `tbl_or` (`ORID`, `ORNum`, `transDate`, `branch`, `amount`, `particulars`, `userID`) VALUES
	(1, '464567547', '2015-11-17', 2, 50000, 'Purchased MAc Book Pro', 5),
	(2, '123424', '2015-11-19', 6, 123, 'ewrewrewrer', 5);
/*!40000 ALTER TABLE `tbl_or` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_permissions
DROP TABLE IF EXISTS `tbl_permissions`;
CREATE TABLE IF NOT EXISTS `tbl_permissions` (
  `ID` tinyint(10) unsigned NOT NULL AUTO_INCREMENT,
  `permission_title` varchar(50) NOT NULL,
  `permission_slug` varchar(50) NOT NULL,
  `module` tinyint(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `moduleid_fk` (`module`),
  CONSTRAINT `moduleid_fk` FOREIGN KEY (`module`) REFERENCES `tbl_modules` (`module_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_permissions: ~16 rows (approximately)
/*!40000 ALTER TABLE `tbl_permissions` DISABLE KEYS */;
INSERT INTO `tbl_permissions` (`ID`, `permission_title`, `permission_slug`, `module`) VALUES
	(1, 'ManageUserMenuItem', 'Manage User ', 1),
	(2, 'EmployeeMenuItem', 'Employee Mgt.', 2),
	(3, 'PositionMenuItem', 'Position Mgt.', 2),
	(4, 'BranchMenuItem', 'Branch Mgt.', 2),
	(5, 'BankMenuIem', 'Bank Mgt.', 2),
	(6, 'BBalanceMenuItem', 'Creating New Beginning Balance', 3),
	(7, 'UpdateNumberSeriesMenuItem', 'Update No. Series', 3),
	(8, 'AccountMenuItem', 'Creating New Accounting Titles', 3),
	(9, 'FAMenuItem', 'Adding New Fixed Asset', 3),
	(10, 'WriteCheckMenuItem', 'Creating New Check', 4),
	(11, 'POMenuItem', 'Creating New Purchase Order', 4),
	(12, 'ORMenuItem', 'Issuing new Official Reciept', 4),
	(13, 'UpdateAccountingMenuItem', 'Update Accounting Balances', 4),
	(14, 'CDVMenuItem', 'Check Disbursement Voucher Mgt.', 4),
	(15, 'JVMenuItem', 'Journal Voucher Mgt.', 4),
	(16, 'APVMenuItem', 'Account Payable Voucher Mgt.', 4);
/*!40000 ALTER TABLE `tbl_permissions` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_permission_role
DROP TABLE IF EXISTS `tbl_permission_role`;
CREATE TABLE IF NOT EXISTS `tbl_permission_role` (
  `id` tinyint(10) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(10) unsigned NOT NULL,
  `role_id` tinyint(10) unsigned NOT NULL,
  `permission_id` tinyint(10) unsigned NOT NULL,
  `Read` tinyint(3) NOT NULL,
  `Write` tinyint(3) NOT NULL,
  `Delete` tinyint(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `perm_id` (`permission_id`),
  KEY `RID` (`role_id`),
  KEY `u_id` (`userid`),
  CONSTRAINT `RID` FOREIGN KEY (`role_id`) REFERENCES `tbl_roles` (`roleID`) ON UPDATE CASCADE,
  CONSTRAINT `perm_id` FOREIGN KEY (`permission_id`) REFERENCES `tbl_permissions` (`ID`) ON UPDATE CASCADE,
  CONSTRAINT `u_id` FOREIGN KEY (`userid`) REFERENCES `tbl_useracct` (`userID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_permission_role: ~16 rows (approximately)
/*!40000 ALTER TABLE `tbl_permission_role` DISABLE KEYS */;
INSERT INTO `tbl_permission_role` (`id`, `userid`, `role_id`, `permission_id`, `Read`, `Write`, `Delete`) VALUES
	(1, 5, 1, 1, 1, 1, 1),
	(5, 5, 1, 2, 1, 1, 1),
	(6, 5, 1, 3, 1, 1, 1),
	(8, 5, 1, 4, 1, 1, 1),
	(9, 5, 1, 5, 1, 1, 1),
	(10, 5, 1, 6, 1, 1, 1),
	(11, 5, 1, 7, 1, 1, 1),
	(12, 5, 1, 8, 1, 1, 1),
	(13, 5, 1, 9, 1, 1, 1),
	(14, 5, 1, 10, 1, 1, 1),
	(15, 5, 1, 11, 1, 1, 1),
	(16, 5, 1, 12, 1, 1, 1),
	(18, 5, 1, 13, 1, 1, 1),
	(19, 5, 1, 14, 1, 1, 1),
	(20, 5, 1, 15, 1, 1, 1),
	(21, 5, 1, 16, 1, 1, 1);
/*!40000 ALTER TABLE `tbl_permission_role` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_po
DROP TABLE IF EXISTS `tbl_po`;
CREATE TABLE IF NOT EXISTS `tbl_po` (
  `poID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `po_num` varchar(20) NOT NULL,
  `supplier` int(10) unsigned NOT NULL,
  `branch` int(10) unsigned NOT NULL,
  `PO_date` date NOT NULL,
  `bank` int(10) unsigned NOT NULL,
  `purchasing_agent` varchar(60) NOT NULL,
  `requestedby` int(10) unsigned NOT NULL,
  `mop` int(10) unsigned NOT NULL,
  `userID` int(10) unsigned DEFAULT NULL,
  `approveBy` int(10) unsigned DEFAULT NULL,
  `status` varchar(10) DEFAULT 'PEN',
  `paymentStatus` varchar(10) NOT NULL,
  PRIMARY KEY (`poID`),
  KEY `supplierID` (`supplier`),
  KEY `idBnk` (`bank`),
  KEY `requestedBy` (`requestedby`),
  KEY `branchID` (`branch`),
  KEY `mop` (`mop`),
  KEY `userid` (`userID`),
  KEY `approveID` (`approveBy`),
  CONSTRAINT `approveID` FOREIGN KEY (`approveBy`) REFERENCES `tbl_useracct` (`userID`) ON UPDATE CASCADE,
  CONSTRAINT `branchID` FOREIGN KEY (`branch`) REFERENCES `tbl_settings` (`idSettings`) ON UPDATE CASCADE,
  CONSTRAINT `idBnk` FOREIGN KEY (`bank`) REFERENCES `tbl_bank` (`bankID`) ON UPDATE CASCADE,
  CONSTRAINT `mop` FOREIGN KEY (`mop`) REFERENCES `tbl_mop` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `requestedBy` FOREIGN KEY (`requestedby`) REFERENCES `tbl_branch` (`brID`) ON UPDATE CASCADE,
  CONSTRAINT `supplierID` FOREIGN KEY (`supplier`) REFERENCES `tbl_supplier` (`supplierID`) ON UPDATE CASCADE,
  CONSTRAINT `userid` FOREIGN KEY (`userID`) REFERENCES `tbl_useracct` (`userID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_po: ~10 rows (approximately)
/*!40000 ALTER TABLE `tbl_po` DISABLE KEYS */;
INSERT INTO `tbl_po` (`poID`, `po_num`, `supplier`, `branch`, `PO_date`, `bank`, `purchasing_agent`, `requestedby`, `mop`, `userID`, `approveBy`, `status`, `paymentStatus`) VALUES
	(7, '2015015', 1, 1, '2015-10-15', 1, 'Daniel Fagela', 2, 1, 5, 5, 'APR', 'U'),
	(8, '2015016', 2, 1, '2015-10-16', 1, 'Mikel Baculio', 4, 1, 5, NULL, 'PEN', 'U'),
	(9, '2015017', 2, 1, '2015-10-16', 2, 'Mikel Baculio', 2, 1, 5, NULL, 'PEN', 'U'),
	(10, '2015018', 2, 1, '2015-11-12', 2, 'Darylle Battad', 2, 1, 5, NULL, 'PEN', 'P'),
	(11, '2015019', 2, 1, '2015-11-12', 2, 'hgh', 2, 2, 5, 5, 'APR', 'P'),
	(12, '2015020', 2, 1, '2015-11-12', 3, 'fgdfgf', 4, 2, 5, 5, 'APR', 'U'),
	(13, '2015021', 2, 1, '2015-11-12', 2, 'dsds', 4, 1, 5, NULL, 'PEN', 'U'),
	(14, '2015022', 2, 1, '2015-11-19', 3, 'rewr', 2, 1, 5, NULL, 'PEN', 'U'),
	(15, '2016023', 1, 1, '2016-05-30', 1, 'PETE BALAGOSA', 1, 1, 5, NULL, 'PEN', ''),
	(16, '2016024', 1, 1, '2016-05-31', 1, 'Jnaine Jamsin', 4, 1, 5, 5, 'APR', '');
/*!40000 ALTER TABLE `tbl_po` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_position
DROP TABLE IF EXISTS `tbl_position`;
CREATE TABLE IF NOT EXISTS `tbl_position` (
  `idPosition` tinyint(10) unsigned NOT NULL AUTO_INCREMENT,
  `posName` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`idPosition`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_position: ~4 rows (approximately)
/*!40000 ALTER TABLE `tbl_position` DISABLE KEYS */;
INSERT INTO `tbl_position` (`idPosition`, `posName`) VALUES
	(1, 'Administrator'),
	(2, 'Operations Manager'),
	(3, 'Bookkeeper'),
	(4, 'Business Analyst'),
	(5, 'Admin Assistant');
/*!40000 ALTER TABLE `tbl_position` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_po_items
DROP TABLE IF EXISTS `tbl_po_items`;
CREATE TABLE IF NOT EXISTS `tbl_po_items` (
  `itemID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `poID` int(10) unsigned NOT NULL,
  `items` varchar(200) NOT NULL,
  `qty` int(10) unsigned NOT NULL,
  `unit` int(10) unsigned NOT NULL,
  `unit_price` double(8,0) unsigned NOT NULL,
  `total` double(10,0) unsigned NOT NULL,
  PRIMARY KEY (`itemID`),
  KEY `poID` (`poID`),
  KEY `unitID` (`unit`),
  CONSTRAINT `poID` FOREIGN KEY (`poID`) REFERENCES `tbl_po` (`poID`) ON UPDATE CASCADE,
  CONSTRAINT `unitID` FOREIGN KEY (`unit`) REFERENCES `tbl_unit` (`unitID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_po_items: ~8 rows (approximately)
/*!40000 ALTER TABLE `tbl_po_items` DISABLE KEYS */;
INSERT INTO `tbl_po_items` (`itemID`, `poID`, `items`, `qty`, `unit`, `unit_price`, `total`) VALUES
	(2, 7, 'Laptop', 1, 1, 12000, 12000),
	(3, 8, 'CPU', 2, 1, 12000, 24000),
	(4, 9, 'laptop ASUS', 1, 1, 24000, 24000),
	(5, 9, 'CPU', 1, 1, 10000, 10000),
	(6, 10, 'MAC BOOK', 1, 1, 45000, 45000),
	(7, 11, 'dsfgfdg', 12, 2, 12, 12222),
	(8, 12, 'wqewewq', 1, 1, 11, 11),
	(9, 13, 'dsadsad', 1, 1, 12, 12),
	(10, 14, 'ytr', 1, 1, 12, 12),
	(11, 15, 'MONITOR', 1, 1, 3895, 3895),
	(12, 16, 'fsdfds', 1, 1, 12, 12),
	(13, 16, 'rt', 1, 2, 123, 123);
/*!40000 ALTER TABLE `tbl_po_items` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_roles
DROP TABLE IF EXISTS `tbl_roles`;
CREATE TABLE IF NOT EXISTS `tbl_roles` (
  `roleID` tinyint(10) unsigned NOT NULL AUTO_INCREMENT,
  `role_title` varchar(50) NOT NULL,
  `read` tinyint(3) NOT NULL,
  `write` tinyint(3) NOT NULL,
  `delete` tinyint(3) NOT NULL,
  `print` tinyint(3) NOT NULL,
  PRIMARY KEY (`roleID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_roles: ~3 rows (approximately)
/*!40000 ALTER TABLE `tbl_roles` DISABLE KEYS */;
INSERT INTO `tbl_roles` (`roleID`, `role_title`, `read`, `write`, `delete`, `print`) VALUES
	(1, 'super_admin', 1, 1, 1, 1),
	(2, 'admin_assistant', 1, 1, 1, 1),
	(3, 'bookkeeper', 1, 1, 0, 1);
/*!40000 ALTER TABLE `tbl_roles` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_series
DROP TABLE IF EXISTS `tbl_series`;
CREATE TABLE IF NOT EXISTS `tbl_series` (
  `idNum` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `numSeries` varchar(15) DEFAULT NULL,
  `Description` varchar(30) DEFAULT NULL,
  `ABRV` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`idNum`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_series: ~2 rows (approximately)
/*!40000 ALTER TABLE `tbl_series` DISABLE KEYS */;
INSERT INTO `tbl_series` (`idNum`, `numSeries`, `Description`, `ABRV`) VALUES
	(1, '29', 'Journal Voucher', 'JV'),
	(2, '78', 'Check Disbursement Voucher', 'CDV'),
	(3, '20', 'Accounts Payable Voucher', 'APV'),
	(4, '25', 'Purchase Order', 'PO'),
	(5, '001', 'Statement of Account', 'SOA');
/*!40000 ALTER TABLE `tbl_series` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_settings
DROP TABLE IF EXISTS `tbl_settings`;
CREATE TABLE IF NOT EXISTS `tbl_settings` (
  `idSettings` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `item` varchar(30) NOT NULL,
  `value` varchar(50) NOT NULL,
  PRIMARY KEY (`idSettings`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_settings: ~3 rows (approximately)
/*!40000 ALTER TABLE `tbl_settings` DISABLE KEYS */;
INSERT INTO `tbl_settings` (`idSettings`, `item`, `value`) VALUES
	(1, 'BranchName', 'Solutions Management System Inc'),
	(2, 'General Manager', 'Ramon Alejandro M. Valleser'),
	(3, 'VP Finance', 'Marlon H. Montera'),
	(4, 'VP Operations Support Services', 'Jennifer P. Dantes');
/*!40000 ALTER TABLE `tbl_settings` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_supplier
DROP TABLE IF EXISTS `tbl_supplier`;
CREATE TABLE IF NOT EXISTS `tbl_supplier` (
  `supplierID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `supplier` varchar(100) NOT NULL,
  `address` varchar(150) NOT NULL,
  `phone` varchar(20) NOT NULL,
  PRIMARY KEY (`supplierID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_supplier: ~2 rows (approximately)
/*!40000 ALTER TABLE `tbl_supplier` DISABLE KEYS */;
INSERT INTO `tbl_supplier` (`supplierID`, `supplier`, `address`, `phone`) VALUES
	(1, 'Interpace', 'CDO', '2239052'),
	(2, 'MicroTrade GSM', 'CDO Hayes', '9052223');
/*!40000 ALTER TABLE `tbl_supplier` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_unit
DROP TABLE IF EXISTS `tbl_unit`;
CREATE TABLE IF NOT EXISTS `tbl_unit` (
  `unitID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `unit` varchar(50) NOT NULL,
  PRIMARY KEY (`unitID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_unit: ~2 rows (approximately)
/*!40000 ALTER TABLE `tbl_unit` DISABLE KEYS */;
INSERT INTO `tbl_unit` (`unitID`, `unit`) VALUES
	(1, 'Pc(s)'),
	(2, 'Box(s)');
/*!40000 ALTER TABLE `tbl_unit` ENABLE KEYS */;


-- Dumping structure for table accounting.tbl_useracct
DROP TABLE IF EXISTS `tbl_useracct`;
CREATE TABLE IF NOT EXISTS `tbl_useracct` (
  `userID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `empID` int(10) unsigned DEFAULT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `role_title` tinyint(10) unsigned DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `active` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`userID`),
  KEY `UserFK` (`empID`),
  KEY `role_title` (`role_title`),
  CONSTRAINT `UserFK` FOREIGN KEY (`empID`) REFERENCES `tbl_employee` (`empID`) ON UPDATE CASCADE,
  CONSTRAINT `role_title` FOREIGN KEY (`role_title`) REFERENCES `tbl_roles` (`roleID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

-- Dumping data for table accounting.tbl_useracct: ~3 rows (approximately)
/*!40000 ALTER TABLE `tbl_useracct` DISABLE KEYS */;
INSERT INTO `tbl_useracct` (`userID`, `empID`, `username`, `password`, `role_title`, `remember_token`, `created_at`, `updated_at`, `active`) VALUES
	(2, 1, 'ff', 'ff', 2, '', '2016-01-29 10:27:29', '2016-01-29 10:27:29', 1),
	(5, 4, 'aa', 'aa', 1, '', '2016-05-30 14:27:24', '2016-05-30 14:27:24', 1),
	(10, 6, 'marco', 'dwefdfd', 3, NULL, '2016-05-30 16:22:17', '2016-05-30 16:22:17', 1);
/*!40000 ALTER TABLE `tbl_useracct` ENABLE KEYS */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
