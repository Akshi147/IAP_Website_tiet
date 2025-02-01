import * as React from "react";
import PropTypes from "prop-types";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import styles from "./button.module.css";

const buttonVariants = cva(styles.base, {
    variants: {
      variant: {
        default: styles.default,
        destructive: styles.destructive,
        outline: styles.outline,
        secondary: styles.secondary,
        ghost: styles.ghost,
        link: styles.link,
      },
      size: {
        default: styles.sizeDefault,
        sm: styles.sizeSm,
        lg: styles.sizeLg,
        icon: styles.sizeIcon,
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  });
  
  const Button = React.forwardRef(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
      const Comp = asChild ? Slot : "button";
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      );
    }
  );
  
  // ✅ Moving `displayName` and `propTypes` outside the component
  Button.displayName = "Button";
  
  Button.propTypes = {
    className: PropTypes.string,
    variant: PropTypes.oneOf([
      "default",
      "destructive",
      "outline",
      "secondary",
      "ghost",
      "link",
    ]),
    size: PropTypes.oneOf(["default", "sm", "lg", "icon"]),
    asChild: PropTypes.bool,
  };
  
  export { Button, buttonVariants };
