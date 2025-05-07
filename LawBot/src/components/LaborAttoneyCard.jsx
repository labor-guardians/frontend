import React from "react";
import { useNavigate } from "react-router-dom";
import { LABOR_ATTORNEY_CHAT } from "../constants/path";
import { Button } from "./Button";

export const LaborAttoneyCard = ({ userId, userName, description, photo, index }) => {
  const navigate = useNavigate();

  const goChat = () => {
    navigate(`/${LABOR_ATTORNEY_CHAT}/${userId}`);
  };

  return (
    <div
      className={`card card-side bg-base-100 shadow-sm ${
        index == 0 && "md:col-start-1 md:col-end-3"
      }
                ${index == 9 && "md:col-start-2 md:col-end-4"}
            }`}>
      <figure className="shrink-0">
        <img src={photo || "/src/assets/constant_no_image.png"} alt="Movie" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{userName}</h2>
        <p className="line-clamp-7">{description}</p>
        <div className="card-actions justify-end">
          <Button onClick={goChat} text="채팅하기" />
        </div>
      </div>
    </div>
  );
};
