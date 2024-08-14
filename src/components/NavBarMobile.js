import React, { useState } from "react";
import logo from "../assets/logo.png";
import styles from "../styles/NavBarMobile.module.css";
import { NavLink } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import axios from "axios";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";
import { removeTokenTimestamp } from "../utils/utils";

const NavBarMobile = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
      removeTokenTimestamp();
    } catch (err) {
      // Handle sign out error here
    }
  };

  const addPostIcon = (
    <NavLink
      className={styles.NavLink}
      activeClassName={styles.Active}
      to="/posts/create"
    >
      <i className="far fa-plus-square"></i>Add post
    </NavLink>
  );

  const loggedInIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/feed"
      >
        <i className="fas fa-stream"></i>Feed
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/liked"
      >
        <i className="fas fa-heart"></i>Liked
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/messages"
      >
        <i className="fas fa-envelope"></i>Message List
      </NavLink>
      <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
        <i className="fas fa-sign-out-alt"></i>Sign out
      </NavLink>
      <NavLink
        className={styles.NavLink}
        to={`/profiles/${currentUser?.profile_id}`}
      >
        <Avatar src={currentUser?.profile_image} text="Profile" height={40} />
      </NavLink>
    </>
  );

  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
      >
        <i className="fas fa-sign-in-alt"></i>Sign in
      </NavLink>
      <NavLink
        to="/signup"
        className={styles.NavLink}
        activeClassName={styles.Active}
      >
        <i className="fas fa-user-plus"></i>Sign up
      </NavLink>
    </>
  );

  return (
    <nav className={styles.NavBar}>
      <div className={styles.NavHeader}>
        <NavLink to="/">
          <img src={logo} alt="Logo" className={styles.Logo} />
        </NavLink>
        <button
          className={styles.Hamburger}
          onClick={() => setExpanded(!expanded)}
          ref={ref}
          aria-expanded={expanded}
          aria-controls="navbar-mobile"
        >
          <span className={styles.HamburgerIcon}></span>
          <span className={styles.HamburgerIcon}></span>
          <span className={styles.HamburgerIcon}></span>
        </button>
      </div>
      <ul
        id="navbar-mobile"
        className={`${styles.NavLinks} ${expanded ? styles.NavLinksOpen : ""}`}
      >
        <li>
          <NavLink exact to="/" className={styles.NavLink} activeClassName={styles.Active}>
            <i className="fas fa-home"></i> Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/search" className={styles.NavLink} activeClassName={styles.Active}>
            <i className="fas fa-search"></i> Search
          </NavLink>
        </li>
        <li>
          <NavLink to="/messages" className={styles.NavLink} activeClassName={styles.Active}>
            <i className="fas fa-envelope"></i> Messages
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={styles.NavLink} activeClassName={styles.Active}>
            <i className="fas fa-user"></i> Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/more" className={styles.NavLink} activeClassName={styles.Active}>
            <i className="fas fa-ellipsis-h"></i> More
          </NavLink>
        </li>
        {currentUser ? loggedInIcons : loggedOutIcons}
      </ul>
    </nav>
  );
};

export default NavBarMobile;
