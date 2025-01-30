import { Facebook, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import styles from "./footer.module.css";
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.section}>
            <h3 className={styles.title}>About TIET</h3>
            <p className={styles.text}>
              Thapar Institute of Engineering and Technology has consistently been a pioneer in engineering education,
              research and innovation.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>
                <Facebook className={styles.icon} />
              </a>
              <a href="#" className={styles.socialLink}>
                <Twitter className={styles.icon} />
              </a>
              <a href="#" className={styles.socialLink}>
                <Linkedin className={styles.icon} />
              </a>
              <a href="#" className={styles.socialLink}>
                <Youtube className={styles.icon} />
              </a>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.title}>Quick Links</h3>
            <ul className={styles.list}>
              <li>
                <a href="#" className={styles.link}>About IAP Cell</a>
              </li>
              <li>
                <a href="#" className={styles.link}>Academic Calendar</a>
              </li>
              <li>
                <a href="#" className={styles.link}>Resources</a>
              </li>
              <li>
                <a href="#" className={styles.link}>FAQs</a>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.title}>Contact Info</h3>
            <ul className={styles.list}>
              <li className={styles.contactItem}>
                <MapPin className={styles.contactIcon} />
                <span className={styles.contactText}>Patiala, Punjab 147004, India</span>
              </li>
              <li className={styles.contactItem}>
                <Phone className={styles.contactIcon} />
                <span className={styles.contactText}>+91-175-2393021</span>
              </li>
              <li className={styles.contactItem}>
                <Mail className={styles.contactIcon} />
                <span className={styles.contactText}>info@thapar.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Thapar Institute of Engineering and Technology. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;