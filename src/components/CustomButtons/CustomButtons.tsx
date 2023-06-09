import "./CustomButtons.css";

interface AuthButtonProps {
  buttonText: string;
  buttonWidth?: string | number;
}

export const AutenticationButtons = (props: AuthButtonProps) => {
  return (
    <button
      className="authentication-button"
      style={{
        cursor: "pointer",
        border: "0",
        borderRadius: "4px",
        margin: 0,
        width: props.buttonWidth,
        padding: "10px 0px",
        transition: "0.4s",
        textAlign: "center",
      }}
    >
      {props.buttonText}
    </button>
  );
};
