import { Button } from "@mui/material";
import styles from "./navbar.module.css";

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.container}>
        <a href="/" className={styles.logo}>
          <span className="text-xl font-bold">IAP CELL</span>
        </a>
        <nav className={styles.navigationMenu}>
          <ul className={styles.menuList}>
            <li className={styles.menuItem}>
              <a href="/" className={styles.menuLink}>
                Home
              </a>
            </li>
            <li className={styles.menuItem}>
              <a href="/student" className={styles.menuLink}>
                Student Panel
              </a>
            </li>
            <li className={styles.menuItem}>
              <a href="/faculty" className={styles.menuLink}>
                Faculty Panel
              </a>
            </li>
            <li className={styles.menuItem}>
              <a href="/mentor" className={styles.menuLink}>
                Mentor Panel
              </a>
            </li>
          </ul>
        </nav>
        <Button variant="outlined" className={styles.downloadButton}>
          Download Files
        </Button>
      </div>
    </div>
  );
}
 export default Navbar;