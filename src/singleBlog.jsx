import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const SingleBlog = () => {
  const [loading, setLoading] = useState("Loading...");
  const [data, setData] = useState(null);
  const { postId } = useParams();
  const [noOfChanges, setNoOfChanges] = useState(0);
  const commentRef = useRef(null);
  const commentFormRef = useRef(null);
  const blogRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  console.log(postId);
  useEffect(() => {
    const getPostWithComments = async () => {
      const response = await fetch(
        `http://localhost:3000/api/posts/${postId}`,
        { mode: "cors" }
      );
      const postWithComments = await response.json();
      if (postWithComments) {
        setLoading(null);
        console.log(postWithComments);
        setData(postWithComments);
      }
    };
    getPostWithComments();
  }, [noOfChanges]);

  const addComment = async (event) => {
    event.preventDefault();
    const comment = commentRef.current.value;
    console.log(comment);
    await fetch(`http://localhost:3000/api/posts/${postId}/comment`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment }),
    });
    commentFormRef.current.reset();
    setNoOfChanges((prev) => prev + 1);
  };

  const deleteComment = async (commentId) => {
    await fetch(
      `http://localhost:3000/api/allPosts/${postId}/comments/${commentId}`,
      {
        mode: "cors",
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setNoOfChanges((prev) => prev + 1);
  };

  const updateBlog = async (event) => {
    event.preventDefault();
    const newTitle = titleRef.current.value;
    const newContent = contentRef.current.value;

    await fetch(`http://localhost:3000/api/allPosts/${postId}`, {
      mode: "cors",
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ newTitle, newContent }),
    });
    setNoOfChanges((prev) => prev + 1);
  };

  return (
    <div>
      {loading && <div>{loading}</div>}

      {data && (
        <div className="content">
          <form
            action=""
            onSubmit={updateBlog}
            ref={blogRef}
            className="updateForm"
          >
            <label htmlFor="title">
              <input
                type="text"
                id="title"
                name="title"
                ref={titleRef}
                defaultValue={data.spPost.title}
                required
              />
            </label>
            <label htmlFor="content">
              <textarea
                name="content"
                id="content"
                rows={10}
                cols={28}
                ref={contentRef}
                defaultValue={data.spPost.content}
              ></textarea>
            </label>
            <button type="submit">Update</button>
          </form>

          <br />

          <br />
          <br />
          <h2>Comments: </h2>
          <form action="" onSubmit={addComment} ref={commentFormRef}>
            <input
              type="text"
              ref={commentRef}
              name="newComment"
              placeholder="Comment"
              required
            />
            <button type="submit">Add</button>
          </form>
          <ul className="comments">
            {data.spPost.comments.map((comment) => {
              return (
                <li key={comment.id}>
                  <div className="linker">{comment.comment}</div>
                  <button onClick={() => deleteComment(comment.id)}>
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SingleBlog;
