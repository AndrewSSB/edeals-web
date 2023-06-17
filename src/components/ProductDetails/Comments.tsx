import { Avatar } from "@mui/material";

interface CommentsProps {
  username?: string;
  initialsName?: string;
  message?: string;
  date?: string;
  onClick?: () => void;
}

export const Comments = (props: CommentsProps) => {
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
          Ene
        </span>
        <span
          style={{
            marginTop: "10px",
            fontSize: "12px",
            fontStyle: "italic",
            color: "#6b6b6b",
          }}
        >
          20 mai 2018
        </span>
        <span style={{ wordBreak: "break-word", margin: "20px 50px 0 0px" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id
          massa eu ex lobortis egestas sed in sem. Integer nec egestas tortor.
          Interdum et malesuada fames ac ante ipsum primis in faucibus.
          Suspendisse ultricies nibh lacus, sit amet cursus eros mollis a.
          Quisque vel scelerisque sapien.
        </span>
      </div>
    </div>
  );
};
