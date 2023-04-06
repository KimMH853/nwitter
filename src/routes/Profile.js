import React, { useEffect, useState } from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { dbService, authService } from "../fbase";
import {
  collection,
  query,
  onSnapshot,
  where,
  orderBy,
} from "firebase/firestore";
const Profile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const navigate = useNavigate();
  const onLogOutClick = () => {
    signOut(authService);
    navigate("/");
  };
  const getMyNweets = async () => {
    const nweetRef = collection(dbService, "nweets");
    const q = query(nweetRef, where("createId", "==", userObj.uid));

    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => doc.data());
    });
  };
  useEffect(() => {
    getMyNweets();
  });

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== null) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Display name"
          onChange={onChange}
          value={newDisplayName || undefined}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
