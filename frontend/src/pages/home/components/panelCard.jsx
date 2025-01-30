import styles from "./PanelCard.module.css";
import { Badge } from "@mui/material"; 
import { Link } from "react-router-dom";

const PanelCard = (prop) => {
    const { icon: Icon, badge, title, description, features, href } = prop;
  return (
    <div className={`${styles.card} group`}>
      <div className={styles.cardHeader}>
        <div className={styles.iconContainer}>
          <Icon className={styles.icon} />
        </div>
        <div className={styles.textContainer}>
          <Badge className={styles.badge} color="secondary" variant="outlined" badgeContent={badge} />
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.features}>
          {features.map(({ icon: FeatureIcon, text }) => (
            <div key={text} className={styles.featureItem}>
              <FeatureIcon className={styles.featureIcon} />
              <span>{text}</span>
            </div>
          ))}
        </div>
        <Link to={href} className={styles.button}>
          Access Panel
          <svg className={styles.arrowIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default PanelCard;
