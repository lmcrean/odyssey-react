// src/pages/profiles/Profile.js

import React from "react";
import styles from "../../styles/Profile.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import Button from "react-bootstrap/Button";
import { axiosReq } from "../../api/axiosDefaults";
import { useSetProfileData } from "../../contexts/ProfileDataContext";

const Profile = (props) => {
  const { profile, mobile, imageSize = 55 } = props;
  const { id, following_id, image, owner } = profile;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const { handleFollow, handleUnfollow } = useSetProfileData();

  const checkIfChatExists = async () => {
    console.log("checkIfChatExists called"); // Debugging log
    try {
      const { data } = await axiosReq.get(`/messages/${id}/`);
      console.log("Messages data:", data); // Debugging log
      if (data.results.length > 0) {
        // If chat exists, redirect to the existing chat
        history.push(`/messages/${id}`);
      } else {
        // If no chat exists, redirect to start a new chat
        history.push(`/messages/create/${id}`);
      }
    } catch (err) {
      console.error("Error checking for existing chat:", err);
    }
  };

  return (
    <div
      className={`my-3 d-flex align-items-center ${mobile && "flex-column"}`}
    >
      <div>
        <Link className="align-self-center" to={`/profiles/${id}`}>
          <Avatar src={image} height={imageSize} />
        </Link>
      </div>
      <div className={`mx-2 ${styles.WordBreak}`}>
        <strong>{owner}</strong>
      </div>
      <div className={`text-right ${!mobile && "ml-auto"}`}>
        {!mobile &&
          currentUser &&
          !is_owner && (
            <>
              {following_id ? (
                <Button
                  className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
                  onClick={() => handleUnfollow(profile)}
                >
                  unfollow
                </Button>
              ) : (
                <Button
                  className={`${btnStyles.Button} ${btnStyles.Black}`}
                  onClick={() => handleFollow(profile)}
                >
                  follow
                </Button>
              )}
              <Button
                className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
                onClick={checkIfChatExists}
              >
                Message
              </Button>
            </>
          )}
      </div>
    </div>
  );
};

export default Profile;
