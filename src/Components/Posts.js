import React, { useState, useEffect } from 'react'
import "../CSS/posts.css"
import firebase from 'firebase'
import { Avatar, Button, Fab } from "@material-ui/core"
import { db } from '../firebase';
import { deepOrange } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import SendIcon from '@material-ui/icons/Send';
import Test from './Test'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[300]),
    backgroundColor: deepOrange[300],
  },
}));
function Posts(props) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [likess, setLikess] = useState([])
  const [likes, setLikes] = useState(1)

  useEffect(() =>{
    let unsubscribe;
    if (props.postId) {
      unsubscribe = db
        .collection("posts")
        .doc(props.postId)
        .collection("comments")
        
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => { 
      unsubscribe();
    };
  },[props.postId]);

  useEffect(() =>{
    let unsubscribes;
    if (props.postId) {
      unsubscribes = db
        .collection("posts")
        .doc(props.postId)
        .collection("likes")
        .onSnapshot((snapshot) => {
          setLikess(snapshot.docs.map((doc) => ({
            user1: doc.id,
            perLike: doc.data().like,
            theName: doc.data().username,
            
          })));
        });
    }
    return () => { 
      
      unsubscribes();
    };
  },[props.postId]);
  

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts")
      .doc(props.postId)
      .collection("comments")
      
      .add({
        text: comment,
        username: props.user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setComment("");
  }
  const addLikes = (event) => {
    event.preventDefault();
      // setLikes(likess.perLike + 1)
    //  const [test] = likess
    //   console.log(test)
    //   const {perLike} = test
    //   console.log(perLike)
    const test = db.collection('posts').doc(props.postId).collection("likes").doc(props.postId);
    test.set({
      like: likes,
      username: props.user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
 
    likess.map((test2) => {
      console.log(test2)
      const {perLike} = test2
      console.log(test2)
    
    const test = db.collection('posts').doc(props.postId).collection("likes").doc(props.postId);
      test.set({
        like: perLike + 1,
        username: props.user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    })
    // db.collection("posts")
    //     .doc(props.postId)
    
    //     .collection("likes")
    //     .doc(props.postId)
    //     .set({
    
    //       like: perLike + 1,
    //       username: props.user.displayName,
    //       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //     }, { merge: true });
     
    // setLikes(0);
  }
  const classes = useStyles();
    return (
      <div className="posts">
        <div className="posts__header">
          <Avatar
            className={`${classes.orange} posts__avatar`}
            alt="Your Username"
          >
            {props.username.slice(0, 1)}
          </Avatar>
          <h3>{props.username}</h3>
        </div>
        <p className="posts__caption">{props.caption}</p>
        {/* header avatar + username */}

        <img className="posts__img" src={props.imgURL} alt="sample pic"></img>
        {/* image */}
        <div className="posts__comment">
          {comments.map((comment, index) => (
            <p key={index}>
              <strong>{comment.username}: </strong>
              {comment.text}
            </p>
          ))}
          {likess.map(({ user1, perLike }) => (
            <div className="posts__Likestat" key={user1}>
              <ThumbUpAltIcon color="primary" />{" "}
              <div style={{ marginLeft: "10px", marginTop: "3px" }}>
                {" "}
                {perLike}
              </div>
            </div>
          ))}
        </div>

        {props.user && (
          <form className="posts__commentBox">
            <input
              className="posts__input"
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></input>
            <button
              className="posts__commentButton"
              disabled={!comment}
              onClick={postComment}
            >
              <Fab color="primary" size="small">
                <SendIcon />
              </Fab>
            </button>
            <button className="posts__commentButton" onClick={addLikes}>
              <Test />
            </button>
          </form>
        )}

        {/* username + caption */}
      </div>
    );
}

export default Posts

