import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth} from "./firebase"; //import database from firebase
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@mui/material/Modal"; //Blurs background and makes model pop
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
       if (authUser) {
         // user has logged in....
         console.log(authUser);
         setUser(authUser); //Sets user and uses cookie tracking to keep you logged in
       }else  {
         // user has logged out...
         setUser(null);
       }

     })//if  any change in auth 

     return () => {
       //perform some clean up action before  firing this  useffect. This prevents repeated duplicate event listeners

       unsubscribe();
     }
  },  [user, username]);//this lists dependecies to keep an eye on

  //USEEFFECT runs a piece of code based on specific conditions

  useEffect(() => {
    // run it once-[],runs everytime the posts change
    //snapshot - powerfull listener- all the documents when updated,  updates  database like a snapshot
    db.collection("posts").orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
      //everytime a new  post is  added, this  code fires
      setPosts(
        snapshot.docs.map((doc) => ({ //pls look into how this works?
          id: doc.id,
          post: doc.data(),  //database accessed here.
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
        displayName: username
      })
    })
    .catch((error) =>  alert(error.message))//alert for errors
    setOpen(false);
    //sign in booooom
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message)) //catches and displays the error message

    setOpenSignIn(false);
  }

  return (
    <div className="app">
      
      
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://s3.amazonaws.com/static.organiclead.com/Site-7fe9650c-46f7-4b46-a14b-13e9d38eb977/Instagram_Logo.png"
                alt=""
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://s3.amazonaws.com/static.organiclead.com/Site-7fe9650c-46f7-4b46-a14b-13e9d38eb977/Instagram_Logo.png"
                alt=""
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://s3.amazonaws.com/static.organiclead.com/Site-7fe9650c-46f7-4b46-a14b-13e9d38eb977/Instagram_Logo.png"
          alt=""
        />
        {user  ? (
      <Button onClick={() => auth.signOut()}>Logout</Button>//logout auth.signOut is the hero. Boom
      ): (
      <div className="app__loginContainer">
      <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
        
      <Button onClick={() => setOpen(true)}>Sign Up</Button>
      </div>
      )}
 
      </div>
       
      <div className="app__posts">
       
      {
      posts.map(({ id, post }) => (
        <Post
          key={id} //this makes  react  intelligent and recognises which post component is updated and updates just that specific key component. (ie efficency)
          postId={id}
          user={user}
          imageUrl={post.imageUrl}
          username={post.username}
          caption={post.caption}
        />
      ))
      }

      </div>
       
      <InstagramEmbed
  url='https://instagr.am/p/Zw9o4/'
  clientAccessToken='123|456'
  maxWidth={320}
  hideCaption={false}
  containerTagName='div'
  protocol=''
  injectScript
  onLoading={() => {}}
  onSuccess={() => {}}
  onAfterRender={() => {}}
  onFailure={() => {}}
/>
      


{user?.displayName ?  ( //this used optional to tell react to not freak out;
      <ImageUpload username={user.displayName}/>
      ) : (//only activates if  logged in
        <h3>Sorry you need to login to  upload</h3>
      )}


    </div>
  );
}

export default App;
