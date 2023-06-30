import { CSSProperties } from "react";
import "./CustomButtons.css";

interface AuthButtonProps {
  buttonText: string;
  buttonWidth?: string | number;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  style?: CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const AutenticationButtons = (props: AuthButtonProps) => {
  return (
    <button
      className="authentication-button"
      type={props.type}
      onClick={props.onClick}
      onMouseEnter={() => props.onMouseEnter}
      onMouseLeave={() => props.onMouseLeave}
      style={{
        cursor: "pointer",
        border: "0",
        borderRadius: "4px",
        margin: 0,
        width: props.buttonWidth,
        padding: "10px 0px",
        transition: "0.4s",
        textAlign: "center",
        ...props.style,
      }}
    >
      {props.buttonText}
    </button>
  );
};
