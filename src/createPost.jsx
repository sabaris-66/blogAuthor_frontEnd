import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const CreatePost = () => {
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const navigate = useNavigate();

  const addPost = async (event) => {
    event.preventDefault();
    const title = titleRef.current.value;
    const content = contentRef.current.value;
    await fetch("http://localhost:3000/api/blog", {
      mode: "cors",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title, content }),
    });
    formRef.current.reset();
    navigate("/");
  };
  return (
    <>
      <form action="" ref={formRef} onSubmit={addPost}>
        <label htmlFor="title">
          Title:
          <input
            type="text"
            name="title"
            ref={titleRef}
            id="title"
            placeholder="Enter Title"
            required
          />
        </label>
        <label htmlFor="content">
          Content:
          <textarea
            name="content"
            id="content"
            ref={contentRef}
            rows={10}
            cols={10}
            required
            placeholder="Enter Content"
          ></textarea>
        </label>
        <button type="submit">Submit</button>
      </form>
      <Link to="/blog/11">trial</Link>
    </>
  );
};

export default CreatePost;
