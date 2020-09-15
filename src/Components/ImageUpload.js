import React, {useState} from 'react'
import { Button, LinearProgress } from '@material-ui/core'
import firebase from "firebase";
import { storage, db } from "../firebase";
import '../CSS/imageUpload.css'
import AddCircleIcon from '@material-ui/icons/AddCircle';

export const ImageUpload = (props) => {
    // const [url, setUrl] = useState("");
    const [caption, setCaption] = useState("");
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);


    const handleChange = (e) => {
        if (e.target.files[0]) {
          setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            //progress state
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
          },
          (error) => {
            // Error message
            alert(error.message);
          },
          () => {
            //progress completion
            // gets the imageurl
            storage.ref("images").child(image.name).getDownloadURL().then(url =>{
                // post to db

                db.collection("posts")
                  .add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption,
                    imgURL: url,
                    username: props.username,
                  })
                
                        
              alert('Upload Complete')
                setProgress(0);
                setCaption("");
                setImage(null);
            });
          }
        );
    }



    return (
      <div className="imageupload">
      
        {/* <progress
          className="imageupload__progress"
          value={progress}
          max="100"
        /> */}
        <LinearProgress className="imageupload__progress" variant="determinate" value={progress} max="100" />

        <input
          type="text"
          placeholder="Enter a Caption"
          onChange={(event) => setCaption(event.target.value)}
          value={caption}
        />
       
        
  <input type="file"  onChange={handleChange}/>

        <Button
          style={{ marginTop: "10px" }}
          variant="contained"
          color="primary"
          disabled={!image}
          onClick={handleUpload}
        >
          <AddCircleIcon></AddCircleIcon>
        </Button>
      </div>
    );
}
