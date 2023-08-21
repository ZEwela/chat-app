import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { firestoreDB } from "../config/firebase.config";

export const getSendAMessage = async (
  message,
  recordUri,
  setRecordUri,
  setMessage,
  room,
  user
) => {
  const timeStamp = serverTimestamp();
  const id = `${Date.now()}`;
  let recordDownloadURL = null;

  if (recordUri !== undefined) {
    try {
      const response = await fetch(recordUri);
      const blob = await response.blob();
      const storage = getStorage();
      const storageRef = ref(storage, "recordings/record" + id);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            reject(error);
          },
          async () => {
            recordDownloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve();
          }
        );
      });

      setRecordUri(undefined);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  const _doc = {
    _id: id,
    roomId: room._id,
    timeStamp: timeStamp,
    message: message,
    recordingURL: recordDownloadURL,
    user: user,
  };

  setMessage("");

  await addDoc(
    collection(doc(firestoreDB, "chats", room._id), "messages"),
    _doc
  ).catch((err) => alert(err));
};
