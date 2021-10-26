import React, { useState } from 'react';
import { Input, Button } from '@mui/material';
import {storage, db} from './firebase';
import firebase from "firebase/compat/app";
import './ImageUpload.css'



function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption,  setCaption] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]) { //this tells the program to pick only the  first of selected files
            setImage(e.target.files[0]);
        }
    }

    const handleUpload =  () => {
      const uploadTask = storage.ref(`images/${image.name}`).put(image); //get a reference to storage of image folder and image.name- filename uploaded

      uploadTask.on(
          "state_changed", //asychronous process(ie, takes time)
          (snapshot) => {  //progress bar of upload gives snapshots as it progress
              const progress = Math.round(
                  (snapshot.bytesTransferred  / snapshot.totalBytes) *  100
              );
              setProgress(progress);
          },
          (error) => {
              //error function
              console.log(error.message);
              alert(error.message);
          },
          () => {
              //complete function....
              storage 
              .ref("images")
              .child(image.name)
              .getDownloadURL()//go to the image.name url and get me that  url
              .then(url => {
               db.collection("posts").add({
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),//get the post from the database according to the firebase server timestamp
                  caption: caption,//from state
                  imageUrl: url,
                  username: username //we uploaded it to firebase, they give the download link and we push it in here.
               })
              setProgress(0);
              setCaption("");
              setImage(null);
              })
              
          }
      )
    }
    

    return (

        <div className="imageupload"> 
          {/* progressbar */}
          <progress className="imageupload__progress" value={progress} max="100" />
          <input type="text" //caption input
          placeholder="Enter a caption..."
          onChange={event => setCaption(event.target.value)}
          value={caption}/>
          <input 
          type="file" 
          onChange={handleChange} />
          <Button    //upload button
          onClick={handleUpload}>
              upload  
          </Button>
        </div>
    )
}

export default ImageUpload
//continue from 2.33.08