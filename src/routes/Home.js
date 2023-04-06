import React, { useEffect, useState } from "react";
import { dbService, storageService } from "../fbase";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { query } from "firebase/database";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import Nweet from "../components/Nweet";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");
  // const getNweets = async () => {
  //   const dbNweets = await getDocs(collection(dbService, "nweets"));
  //   dbNweets.forEach((document) => {
  //     const nweetObject = {
  //       ...document.data(),
  //       id: document.id,
  //     };
  //     setNweets((prev) => [nweetObject, ...prev]);
  //   });
  // };

  useEffect(() => {
    //getNweets();

    // onSnapshot(collection(dbService, "cities"), (snapshot) => {
    //   const nweetArray = snapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   }));
    //   console.log(nweetArray);
    //   setNweets(nweetArray);
    // });
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const newNweet = {
      text: nweet,
      createdAt: Date.now(),
      createId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, "nweets"), newNweet);
    setNweet("");
    setAttachment("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      console.log(finishedEvent);
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment(null);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" alt="attachment" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      {nweets.map((nweet) => (
        <Nweet
          key={nweet.id}
          nweetObj={nweet}
          isOwner={nweet.createId === userObj.uid}
        />
      ))}
    </div>
  );
};

export default Home;
