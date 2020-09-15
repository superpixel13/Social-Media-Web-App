import React, { useState, useEffect } from 'react';
import './App.css';
import Posts from "./Components/Posts";
import { db, auth, storage } from "./firebase"
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import { ImageUpload } from './Components/ImageUpload';
// import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 'auto',
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [post, setPost] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user is logged in...
        
        setUser(authUser);
        
      } else {
        // logged out
        setUser(null);
      }
    })

    return () => {
      // perform cleanup to remove duplicates
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPost(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);


  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
         authUser.user.updateProfile({
          displayName: username,
        });
     
       
      })
      .catch((error) => alert(error.message));
      
      // eslint-disable-next-line no-restricted-globals
      setTimeout(() => location.reload(), 5000)
      alert("Reloading please wait...")
      //  setOpen(false)
      // setPassword('')
      // setEmail('')
    
    
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
    setPassword('')
      setEmail('')
  };

  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form onSubmit={signUp} className="App__signup">
            <Input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit">Register</Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form onSubmit={signIn} className="App__signup">
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit">Login</Button>
          </form>
        </div>
      </Modal>

      <Modal open={openUpload} onClose={() => setOpenUpload(false)}>
        <div style={modalStyle} className={classes.paper}>
          {user?.displayName ? (
            <ImageUpload username={user.displayName} />
          ) : (
            <h3>Need to login to upload</h3>
          )}
        </div>
      </Modal>
      <div className="App_header">
        {/* <img
          className="App__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="Instagram pic"
        ></img> */}
        <h2 style={{ alignItems: "center", marginTop:'10px' }}>
          Meme Review
        </h2>

        {user ? (
          <div>
            <Button
              style={{ margin: "10px" }}
              variant="contained"
              type="button"
              onClick={() => auth.signOut()}
            >
              Logout
            </Button>
            <Button
              style={{ margin: "10px" }}
              variant="contained"
              
              type="button"
              onClick={() => setOpenUpload(true)}
            >
              Upload an Image
              
            </Button>


          </div>
        ) : (
          <div className="App__loginContainer">
            <Button
              style={{ margin: "5px" }}
              variant="contained"
              color="primary"
              type="button"
              onClick={() => setOpen(true)}
            >
              Sign up
            </Button>
            <Button
              style={{ margin: "5px" }}
              variant="contained"
              color="primary"
              type="button"
              onClick={() => setOpenSignIn(true)}
            >
              Sign In
            </Button>
          </div>
        )}
      </div>
      <div className="App__posts">
        <div className="App__postsLeft">
       
          {post.map(({ post, id }) => (
            <Posts
              key={id}
              postId={id}
              user={user}
              username={post.username}
              imgURL={post.imgURL}
              caption={post.caption}
            />
          ))}
        </div>
        {/* <div className="App__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/CFBUiApjeOr/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div> */}
      </div>

      {/* the question mark at the user is a try and catch for the user */}
    </div>
  );
}

export default App;
