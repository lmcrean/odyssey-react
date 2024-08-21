import React from "react";
import styles from "../styles/NavBarDesktop.module.css";
import { NavLink } from "react-router-dom";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";

const NavBarDesktop = () => {
  const currentUser = useCurrentUser();

  const loggedInIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/"
      >
        <i className="fas fa-home"></i>
        <span className={styles.NavText}>Home Feed</span>
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/posts/create"
      >
        <i className="far fa-plus-square"></i>
        <span className={styles.NavText}>Add Post</span>
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/messages"
      >
        <i className="fas fa-envelope"></i>
        <span className={styles.NavText}>Messages</span>
      </NavLink>
    </>
  );
  
  const profileLink = (
    <div className={styles.ProfileLink}>
      <NavLink
        className={styles.NavLink}
        to={`/profiles/${currentUser?.profile_id}`}
      >
        <Avatar src={currentUser?.profile_image} height={40} />
        <span className={styles.NavText}>Profile</span>
      </NavLink>
    </div>
  );

  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
      >
        <i className="fas fa-sign-in-alt"></i>
        <span className={styles.NavText}>Sign in</span>
      </NavLink>
      <NavLink
        to="/signup"
        className={styles.NavLink}
        activeClassName={styles.Active}
      >
        <i className="fas fa-user-plus"></i>
        <span className={styles.NavText}>Sign up</span>
      </NavLink>
    </>
  );

  return (
    <nav className={styles.NavBarDesktop}>
      {currentUser ? (
        <>
          {loggedInIcons}
          {profileLink}
        </>
      ) : (
        loggedOutIcons
      )}
    </nav>
  );
};

export default NavBarDesktop;
