import { Avatar, TextField } from "@mui/material";
import { AutenticationButtons } from "../CustomButtons/CustomButtons";
import { useState } from "react";

interface CommentsProps {
  username?: string;
  initialsName?: string;
  message?: string;
  date?: string;
  onClick?: () => void;
  showForm?: boolean;
  saveComment?: (value: string) => void;
  closeComment?: () => void;
}

export const Comments = (props: CommentsProps) => {
  const [reviewText, setReviewText] = useState("");

  const handleReviewTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReviewText(event.target.value);
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        style={{
          minWidth: "100px",
          display: "flex",
          justifyContent: "center",
          marginTop: "40px",
        }}
      >
        <div
          onClick={props?.onClick}
          style={{
            cursor: "pointer",
            width: "80px",
            height: "80px",
            borderRadius: "50px",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#646FCB",
              color: "#fff",
              fontSize: 36,
              width: "80px",
              height: "80px",
            }}
          >
            {props.initialsName}
          </Avatar>
        </div>
      </div>
      {!props.showForm ? (
        <div
          style={{
            margin: "35px 0px 40px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
          }}
        >
          <span
            onClick={props?.onClick}
            style={{ cursor: "pointer", height: "15px", width: "10px" }}
          >
            {props.username}
          </span>
          <span
            style={{
              marginTop: "10px",
              fontSize: "12px",
              fontStyle: "italic",
              color: "#6b6b6b",
            }}
          >
            {new Date(props.date!).toLocaleDateString()}
          </span>
          <span style={{ wordBreak: "break-word", margin: "20px 50px 0 0px" }}>
            {props.message}
          </span>
        </div>
      ) : (
        <div
          style={{
            height: "100%",
            width: "90%",
            margin: "35px 0px 40px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
          }}
        >
          <TextField
            value={reviewText}
            onChange={handleReviewTextChange}
            multiline
            rows={4}
            placeholder="Scrie intrebarea ta..."
            style={{
              marginBottom: "16px",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <AutenticationButtons
              buttonText={"Salvează"}
              style={{ width: "10%", height: "30%" }}
              onClick={() => props.saveComment!(reviewText)}
            />
            <AutenticationButtons
              buttonText={"Închide"}
              style={{ width: "10%", height: "30%" }}
              onClick={props.closeComment}
            />
          </div>
        </div>
      )}
    </div>
  );
};
