import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./App.css";

const getBlogs = async (url) => {
  const response = await fetch(url, {
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error(`HTTP error: Status ${response.status}`);
  }
  console.log(response);
  return response.json();
};

const App = () => {
  const [signIn, setSignIn] = useState(false);
  const [data, setData] = useState(null);
  const [changeStatus, setChangeStatus] = useState(0);
  const signInRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      try {
        const response = await fetch(
          "https://blogapi-production-17ab.up.railway.app/api/token",
          {
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setSignIn(true);
      } catch (error) {
        localStorage.clear();
        console.log("token expired");
        setSignIn(false);
      }
      console.log(localStorage.getItem("token"));
    };
    check();
  }, []);

  useEffect(() => {
    const blogPosts = async () => {
      const result = await fetch(
        "https://blogapi-production-17ab.up.railway.app/api/allPosts",
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const allPosts = await result.json();
      console.log(allPosts);
      setData(allPosts);
    };
    if (signIn) {
      blogPosts();
      setInterval(() => {
        localStorage.clear();
        setSignIn(false);
      }, 3600000);
    }
  }, [signIn, changeStatus]);

  // submitting signIn form to get token
  const handleSignIn = async (event) => {
    event.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    console.log(username, password);
    try {
      const response = await fetch(
        `https://blogapi-production-17ab.up.railway.app/api/logIn`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );
      const newToken = await response.json();
      signInRef.current.reset();
      localStorage.setItem("token", newToken.token);
      console.log(localStorage.getItem("token"));
      setSignIn(true);
    } catch (error) {
      console.log(error);
      signInRef.current.reset();
      alert("Wrong username || password");
    }
  };

  // useEffect(() => {
  //   const fetchBlogData = async () => {
  //     try {
  //       const postsData = await getBlogs("https://blogapi-production-17ab.up.railway.app/api/");
  //       console.log("bl");
  //       console.log(postsData);
  //       setData(postsData);
  //       setError(null);
  //     } catch (err) {
  //       setError(err.message);
  //       setData(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchBlogData();
  // }, []);

  const handleLogOut = () => {
    localStorage.clear();
    setSignIn(false);
  };

  const changePublishStatus = async (status, postId) => {
    await fetch(
      `https://blogapi-production-17ab.up.railway.app/api/allPosts/${postId}/${!status}`,
      {
        mode: "cors",
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setChangeStatus((prev) => prev + 1);
  };

  return (
    <div className="content">
      <h1>Saba's Blog Page</h1>
      <h2>Welcome Saba!</h2>
      <br />
      {!signIn && (
        <form action="" ref={signInRef} onSubmit={handleSignIn}>
          <input
            type="text"
            name="username"
            required
            placeholder="Enter username"
            ref={usernameRef}
          />
          <br />
          <input
            type="password"
            name="password"
            required
            ref={passwordRef}
            placeholder="Enter password"
          />
          <br />
          <button type="submit">Submit</button>
        </form>
      )}
      {signIn && (
        <div className="signedIn">
          <button onClick={handleLogOut}>Log Out</button>
          <button onClick={() => navigate("/post")}>Add Post</button>
          {/* <button onClick={() => navigate("/blog/11")}>redirect</button> */}
        </div>
      )}
      {signIn && data && (
        <>
          <h2>Posts</h2>
          <ul className="posts">
            {data.posts.map((post) => {
              return (
                <div key={post.title}>
                  <Link className="linker" to={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                  <button
                    onClick={() => changePublishStatus(post.published, post.id)}
                  >
                    Status: {post.published ? "Published" : "Not Published"}
                  </button>
                </div>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default App;
