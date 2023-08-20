// import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from "firebase/storage";
// import { firestoreDB } from "../config/firebase.config";

// export const getSendAMessage = async (
//   message,
//   recordUri,
//   setRecordUri,
//   setMessage,
//   room,
//   user
// ) => {
//   if (message.length === 0 && recordUri === undefined) {
//     return;
//   }

//   const timeStamp = serverTimestamp();
//   let id = `${Date.now()}`;

//   console.log(recordUri);
//   if (recordUri !== undefined) {
//     const response = await fetch(recordUri);
//     const blob = await response.blob();
//     const storage = getStorage();
//     const storageRef = ref(storage, "recordings/record" + id);
//     const uploadTask = uploadBytesResumable(storageRef, blob);

//     //   listen for events
//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         // Observe state change events such as progress, pause, and resume
//         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//         //   const progress =
//         //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         //   switch (snapshot.state) {
//         //     case "paused":
//         //       console.log("Upload is paused");
//         //       break;
//         //     case "running":
//         //       console.log("Upload is running");
//         //       break;
//         //   }
//       },
//       (error) => {
//         // Handle unsuccessful uploads
//       },
//       () => {
//         // Handle successful uploads on complete
//         // For instance, get the download URL: https://firebasestorage.googleapis.com/...
//         getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
//           await setRecordDownloadURL(downloadURL);
//         });
//       }
//     );
//     setRecordUri(undefined);
//   }

//   let recordDownloadURL;

//   const setRecordDownloadURL = async (str) => {
//     recordDownloadURL = str;
//     console.log("from a fun", recordDownloadURL);
//   };
//   console.log("recordDownload)", recordDownloadURL);
//   const _doc = {
//     _id: id,
//     roomId: room._id,
//     timeStamp: timeStamp,
//     message: message,
//     recordingURL: recordDownloadURL,
//     user: user,
//   };
//   console.log(_doc);

//   setMessage("");

//   await addDoc(
//     collection(doc(firestoreDB, "chats", room._id), "messages"),
//     _doc
//   )
//     .then(() => {})
//     .catch((err) => alert(err));
// };

// export const getSendAMessage = async (
//   message,
//   recordUri,
//   setRecordUri,
//   setMessage,
//   room,
//   user
// ) => {
//   if (message.length === 0 && recordUri === undefined) {
//     return;
//   }

//   const timeStamp = serverTimestamp();
//   const id = `${Date.now()}`;

//   let recordDownloadURL = ""; // Move this declaration outside of setRecordDownloadURL function

//   const setRecordDownloadURL = async (str) => {
//     recordDownloadURL = str;
//     console.log("from a fun", recordDownloadURL);
//   };

//   if (recordUri !== undefined) {
//     const response = await fetch(recordUri);
//     const blob = await response.blob();
//     const storage = getStorage();
//     const storageRef = ref(storage, "recordings/record" + id);
//     const uploadTask = uploadBytesResumable(storageRef, blob);

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {},
//       (error) => {},
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
//           await setRecordDownloadURL(downloadURL);

//           const _doc = {
//             _id: id,
//             roomId: room._id,
//             timeStamp: timeStamp,
//             message: message,
//             recordingURL: recordDownloadURL, // Use recordDownloadURL here
//             user: user,
//           };

//           setMessage("");

//           await addDoc(
//             collection(doc(firestoreDB, "chats", room._id), "messages"),
//             _doc
//           )
//             .then(() => {})
//             .catch((err) => alert(err));
//         });
//       }
//     );
//     setRecordUri(undefined);
//   } else {
//     const _doc = {
//       _id: id,
//       roomId: room._id,
//       timeStamp: timeStamp,
//       message: message,
//       recordingURL: recordDownloadURL, // Use recordDownloadURL here
//       user: user,
//     };

//     setMessage("");

//     await addDoc(
//       collection(doc(firestoreDB, "chats", room._id), "messages"),
//       _doc
//     )
//       .then(() => {})
//       .catch((err) => alert(err));
//   }
// };

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
