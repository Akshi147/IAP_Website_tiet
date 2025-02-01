import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button } from "../button/button";
import { Menu, X } from "lucide-react";
import { cn } from "../../lib/utils";
import styles from "./navbar.module.css";

const Navbar = ({
  navItems = [
    { name: "Home", path: "/" },
    { name: "Student Panel", path: "/student" },
    { name: "Faculty Panel", path: "/faculty" },
    { name: "Mentor Panel", path: "/mentor" },
  ],
  downloadButton = { text: "Download Files", onClick: () => {} }, // Default Download Button
}) => {
  const [isOpen, setIsOpen] = useState(false);

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
            {downloadButton && (
              <Button variant="outline" onClick={downloadButton.onClick}>
                {downloadButton.text}
              </Button>
            )}
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
            {downloadButton && (
              <Button variant="outline" className={styles.mobileButton} onClick={downloadButton.onClick}>
                {downloadButton.text}
              </Button>
            )}
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
  downloadButton: PropTypes.shape({
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
};

export default Navbar;
