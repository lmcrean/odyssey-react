// App.js

// This file defines the main application component, setting up routes and rendering different pages based on the current URL.

import React from "react";
import './styles/fonts.css';
import './styles/variables.css';
import './styles/base.css'; 
import styles from "./App.module.css";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import PostCreateForm from "./pages/posts/PostCreateForm";
import PostPage from "./pages/posts/PostPage";
import PostsPage from "./pages/posts/PostsPage";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import PostEditForm from "./pages/posts/PostEditForm";
import ProfilePage from "./pages/profiles/ProfilePage";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import NotFound from "./components/NotFound";
import MessageList from "./pages/messaging/MessageList"; 
import MessageDetail from "./pages/messaging/MessageDetail";
import MessageListStartNewForm from "./pages/messaging/MessageListStartNewForm";
import 'tailwindcss/tailwind.css';
import NavBarMobile from "./components/NavBarMobile"; 
import NavBarDesktop from "./components/NavBarDesktop";
import useWindowSize from "./hooks/useWindowSize";
import "./api/axiosDefaults";
import { PostCacheProvider } from './contexts/PostCacheContext';
import { AnimationLoadingProvider } from "./contexts/AnimationLoadingContext";



function App() {
  const currentUser = useCurrentUser();
  const size = useWindowSize();
  const profile_id = currentUser?.profile_id || "";

  return (
    <PostCacheProvider>
    <AnimationLoadingProvider>
    <div className={styles.App}>
      <Container className={styles.Main}>
      <Switch>
        <Route exact path="/" render={() => <PostsPage message="No results found. Adjust the search keyword." />} />
        <Route exact path="/feed" render={() => <PostsPage message="No results found. Adjust the search keyword or follow a user." filter={`owner__followed__owner__profile=${profile_id}&`} />} />
        <Route exact path="/liked" render={() => <PostsPage message="No results found. Adjust the search keyword or like a post." filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`} />} />
        <Route exact path="/signin" render={() => <SignInForm />} />
        <Route exact path="/signup" render={() => <SignUpForm />} />
        <Route exact path="/posts/create" render={() => <PostCreateForm />} />
        <Route exact path="/posts/:id" render={() => <PostPage />} />
        <Route exact path="/posts/:id/edit" render={() => <PostEditForm />} />
        <Route exact path="/profiles/:id" render={() => <ProfilePage />} />
        <Route exact path="/profiles/:id/edit/username" render={() => <UsernameForm />} />
        <Route exact path="/profiles/:id/edit/password" render={() => <UserPasswordForm />} />
        <Route exact path="/profiles/:id/edit" render={() => <ProfileEditForm />} />
        <Route exact path="/messages" render={() => <MessageList />} />
        <Route exact path="/messages/:id" render={() => <MessageDetail/>} />
        <Route exact path="/messages/create/:id" render={() => <MessageListStartNewForm/>} />
        <Route render={() => <NotFound />} />
      </Switch>
      </Container>
      {size.width <= 768 ? <NavBarMobile /> : <NavBarDesktop />} {/* Conditionally render Navbar based on window width */}
    </div>
    </AnimationLoadingProvider>
    </PostCacheProvider>
  );
}

export default App;
