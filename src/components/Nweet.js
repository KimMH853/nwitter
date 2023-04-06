import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { dbService, storageService } from "../fbase";
import { deleteObject, ref } from "firebase/storage";
const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await deleteDoc(doc(dbService, "nweets", `${nweetObj.id}`));
      if (nweetObj.attachmentUrl) {
        await deleteObject(ref(storageService, nweetObj.attachmentUrl));
      }
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    const editNweet = doc(dbService, "nweets", `${nweetObj.id}`);
    await updateDoc(editNweet, {
      text: newNweet,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };
  return (
    <div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="Edit your Nweet"
                  defaultValue={newNweet}
                  required
                  onChange={onChange}
                />
                <input type="submit" value="Update Nweet" />
              </form>
              <button onClick={toggleEditing}>cancel</button>
            </>
          )}
        </>
      ) : (
        <>
          {nweetObj.attachmentUrl && (
            <img
              src={nweetObj.attachmentUrl}
              width="50px"
              height="50px"
              alt="attachment"
            />
          )}
          <h4>{nweetObj.text}</h4>

          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Nweet</button>
              <button onClick={toggleEditing}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
