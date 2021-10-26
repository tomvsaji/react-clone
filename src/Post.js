import React, { useState, useEffect } from "react";
import "./Post.css";
import { Avatar } from "@mui/material";
import { db } from "./firebase";
import firebase from "@firebase/app-compat";


function Post({ postId, user, imageUrl, username, caption }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState();

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        }); //snapshot listener inside comments collection in database for this specific post
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text:  comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    setComment('');
  }

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt="tomvellavoor"
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>

      <img class="post__image" src={imageUrl} alt="Tree" />

      <h4 className="post__text">
        <strong>{username} </strong>
        {caption}
      </h4>

      <div className="post__comments">
        {comments.map((comment) =>  (
          <p>
            {console.log(comment.text)}
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}

      </div>

      {user && (
      <form className="post__commentBox" >
        <input
          className="post__input"
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
        className="post__button" 
        disabled={!comment}
        type="submit"
        onClick={postComment} 
        >
        Post
        </button>
      </form>
      )}

    </div>
  );
}

export default Post;

// image

// username + caption

//  header -> avatar +  username
