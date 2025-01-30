// import React from "react";
import styles from "./hero.module.css";

const Hero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.background}></div>
      <div className={styles.skewedBackground}></div>
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>
            THAPAR INSTITUTE OF ENGINEERING AND TECHNOLOGY
          </h1>
          <p className={styles.subtitle}>DEEMED TO BE UNIVERSITY</p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
