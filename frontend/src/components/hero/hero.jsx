import styles from './hero.module.css';

const Hero = () => {
  return (
    <div className={styles.container}>
      <div className={styles.boxx}></div>
      <div className={styles.inner}>
        <div className={styles.heading}>
          IAP CELL
        </div>
        <h1 className={styles.title}>
          THAPAR INSTITUTE OF ENGINEERING AND TECHNOLOGY
        </h1>
        <p className={styles.subtitle}>
          DEEMED TO BE UNIVERSITY
        </p>
        <div className={styles.divider}>
          <div className={styles.outer}></div>
        </div>
        <div className={styles.ending}></div>
      </div>
    </div>
  );
}

export default Hero;