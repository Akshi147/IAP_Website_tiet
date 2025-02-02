import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button } from "../button/button";
import { Menu, X } from "lucide-react";
import { cn } from "../../lib/utils";
import styles from "./navbar.module.css";

const pdfFiles = [
  { name: "Registration Form", file: "RegistrationForm.pdf" },
  { name: "Training Letter/NOC from CSED", file: "TLN_CSED.pdf" },
  { name: "Instruction Handbook", file: "InstructionHandbook.pdf" },
  { name: "Peer-Review Form", file: "peerReview.pdf" },
  { name: "Goal Report Format", file: "GoalReportFormat.pdf" },
  { name: "Mid Way Report Format", file: "MidWayReportFormat.pdf" },
  { name: "Project Semester Report Format", file: "PROJECT_SEMESTER_REPORT_FORMAT.docx" },
];

const Navbar = ({
  navItems = [
    { name: "Home", path: "/" },
    { name: "Student Panel", path: "/student" },
    { name: "Faculty Panel", path: "/faculty" },
    { name: "Mentor Panel", path: "/mentor" },
  ],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className={styles.navbarHeader}>
      <div className={styles.navbarContainer}>
        <nav className={styles.navbar}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            IAP CELL
          </Link>

          {/* Desktop Navigation */}
          <div className={styles.desktopNav}>
            {navItems.map(({ name, path }, index) => (
              <Link key={index} to={path} className={styles.navLink}>
                {name}
                <span className={styles.navUnderline}></span>
              </Link>
            ))}

            {/* Download Files Dropdown */}
            <div
              className={styles.downloadDropdown}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Button variant="outline" className={styles.dropdownButton}>
                Download Files
              </Button>
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  {pdfFiles.map(({ name, file }, index) => (
                    <a
                      key={index}
                      href={`/files/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.dropdownItem}
                    >
                      {name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className={styles.mobileMenuButton} onClick={() => setIsOpen(true)}>
            <Menu className={styles.icon} />
          </button>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(styles.mobileOverlay, isOpen ? styles.open : styles.closed)}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={cn(styles.mobileSidebar, isOpen ? styles.openSidebar : styles.closedSidebar)}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
            <X className={styles.icon} />
          </button>

          {/* Sidebar Navigation */}
          <nav className={styles.mobileNav}>
            {navItems.map(({ name, path }, index) => (
              <Link key={index} to={path} className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>
                {name}
                <span className={styles.mobileNavUnderline}></span>
              </Link>
            ))}

            {/* Mobile Download Files Dropdown */}
            <div className={styles.mobileDownloadDropdown}>
              <Button
                variant="outline"
                className={styles.mobileDropdownButton}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Download Files
              </Button>
              {dropdownOpen && (
                <div className={styles.mobileDropdownMenu}>
                  {pdfFiles.map(({ name, file }, index) => (
                    <a
                      key={index}
                      href={`/files/${file}`}
                      target={file.endsWith(".pdf") ? "_blank" : "_self"} // Open PDFs in new tab, Word files in the same tab
                      rel="noopener noreferrer"
                      className={styles.dropdownItem}
                      download={file.endsWith(".docx") ? file : undefined} // Force download only for Word files
                    >
                      {name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ),
};

export default Navbar;