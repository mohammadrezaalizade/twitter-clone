import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { addDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";

import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { collection } from "@firebase/firestore";
import LoadingSpinner from "./LoadingSpinner";
import { useRecoilState } from "recoil";
import { loaderStatus } from "../atoms/loaderStatus";

const Input = () => {
  const { data: session } = useSession();
  const [text, setText] = useState("");
  const [tweetStatusBtn, setTweetStatusBtn] = useState(false);
  const picPicker = useRef(null);
  const [emojiStatus, setEmojiStatus] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const activeText = useRef();
  const [loading, setLoading] = useRecoilState(loaderStatus);

  useEffect(() => {
    activeText.current.focus();
  }, []);

  useEffect(() => {
    if (text.trim().length > 1) {
      setTweetStatusBtn(true);
    } else {
      setTweetStatusBtn(false);
    }
  }, [text]);

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      id: session.user.uid,
      username: session.user.name,
      userImg: session.user.image,
      tag: session.user.tag,
      text,
      timestamp: serverTimestamp(),
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      });
    }

    setLoading(false);
    setText("");
    setSelectedFile(null);
    setEmojiStatus(false);
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setText(text + emoji);
  };

  return (
    <div
      className={`border-b border-gray-700 flex flex-col overflow-y-scroll p-3 scrollbar-hide ${
        loading && "select-none bg-opacity-75"
      }`}
    >
      <div className={`flex space-x-4 mb-3`}>
        <img
          src={session.user.image}
          alt="Profile user"
          className="w-10 h-10 rounded-full cursor-pointer"
        />
        <textarea
          rows="10"
          placeholder="What's happening?"
          className="flex-grow min-h-[50px] max-h-[150px] outline-none p-2  bg-[#272727] focus:bg-opacity-80 transition duration-200 rounded-xl text-gray-100 scrollbar-hide overflow-y-scroll "
          value={text}
          onChange={(e) => setText(e.target.value)}
          ref={activeText}
        />
      </div>
      {selectedFile && (
        <div className="relative mb-3">
          <div
            onClick={() => setSelectedFile(null)}
            className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
          >
            <XIcon className="text-white h-5" />
          </div>
          <img
            src={selectedFile}
            alt=""
            className="rounded-2xl max-h-80 object-contain"
          />
        </div>
      )}
      <div className="border-t border-gray-700 w-full">
        <div className="flex items-center justify-between pt-2.5 ">
          <div className="flex items-center">
            <div className="icon" onClick={() => picPicker.current.click()}>
              <PhotographIcon className="h-[22px] text-[#1d9bf0]" />
              <input
                type="file"
                hidden
                ref={picPicker}
                onChange={addImageToPost}
                accept="image/*"
              />
            </div>
            <div className="icon rotate-90">
              <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
            </div>
            <div className="icon" onClick={() => setEmojiStatus(!emojiStatus)}>
              <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
            </div>

            <div className="icon">
              <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
            </div>

            {emojiStatus && (
              <Picker
                onSelect={addEmoji}
                style={{
                  position: "absolute",
                  marginTop: "465px",
                  marginLeft: 40,
                  maxWidth: "320px",
                  borderRadius: "20px",
                  scrollBehavior: "smooth",
                }}
                theme="dark"
                native={true}
              />
            )}
          </div>
          <button
            disabled={!tweetStatusBtn}
            className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
            onClick={sendPost}
          >
            Tweet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Input;
