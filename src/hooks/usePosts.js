import { useLocalStorage } from "./useLocalStorage";
import { error, result } from "../functions/api";
import { useState } from "react";

//Get the posts from API
function usePosts() {
  //LocalStorage Custom Hook
  const { posts, savePosts, dataLoaded } = useLocalStorage();
  const [sharedMessage, setSharedMessage] = useState("");

  const createPost = async (post) => {
    //Crate post structure
    const newPost = {
      title: post.title.trim(),
      body: post.body.trim(),
      userId: 1,
    };

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          body: JSON.stringify(newPost),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const resp = await response.json();

      // Cambia el Id debido a que la API siempre establece el mismo id
      resp.id = posts[posts.length - 1].id + 1;

      // Crea una copia de los posts actuales y guárdalos en el estado con el nuevo post
      let newPosts = [...posts];
      newPosts.push(resp);
      savePosts(newPosts);

      return resp.id;
    } catch (error) {
      return -1;
    }
  };

  const getPost = (id) => {
    return posts.find((post) => post.id == id);
  };

  const updatePost = async (postData) => {
    //As the  API fakes the data
    //sending the request with an id that doesn't exist throws an 500 status code
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/1`,
        {
          method: "PUT",
          body: JSON.stringify({
            userId: postData.userId,
            id: postData.id,
            title: postData.title.trim(),
            body: postData.body.trim(),
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      //create resp variable and change id
      let resp = await response.json();
      resp.id = postData.id;

      const index = posts.findIndex((post) => post.id == resp.id);

      let newPosts = [...posts];
      newPosts[index] = { ...resp };
      savePosts(newPosts);

      return result("Information updated sucessfully.");
    } catch (e) {
      return error("Could not update the post, try again.");
    }
  };

  const deletePost = async (postData) => {
    try {
      //Simulating API Call
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postData.id}`,
        {
          method: "DELETE",
        }
      );
      const resp = await res.json();

      if (Object.keys(resp).length === 0) {
        const index = posts.findIndex((post) => post.id == postData.id);

        let newPosts = [...posts];
        newPosts.splice(index, 1);

        savePosts(newPosts);
        return result("Post deleted successfully.");
      } else {
        throw new Error(
          "Something went wrong deleting the post, please try again."
        );
      }
    } catch (e) {
      return error(e.message);
    }
  };

  return {
    posts,
    createPost,
    getPost,
    updatePost,
    deletePost,
    sharedMessage,
    setSharedMessage,
    dataLoaded,
  };
}

export default usePosts;
