import * as React from "react";
import styles from "./panelCard.module.css"; // Import the CSS module
import PropTypes from 'prop-types'; // Import PropTypes for prop validation

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`${styles.card} ${className}`}  // Use the module's class
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`${styles.cardHeader} ${className}`} // Use the module's class
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`${styles.cardTitle} ${className}`}  // Use the module's class
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={`${styles.cardDescription} ${className}`}  // Use the module's class
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`${styles.cardContent} ${className}`} // Use the module's class
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`${styles.cardFooter} ${className}`}  // Use the module's class
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
Card.propTypes = {
  className: PropTypes.string,
};

CardHeader.propTypes = {
  className: PropTypes.string,
};

CardTitle.propTypes = {
  className: PropTypes.string,
};

CardDescription.propTypes = {
  className: PropTypes.string,
};

CardContent.propTypes = {
  className: PropTypes.string,
};

CardFooter.propTypes = {
  className: PropTypes.string,
};

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
