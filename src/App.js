import { useEffect, useState } from "react";
import supabase from "./supabase";

import "./style.css";
const CATEGORIES = [
  { name: "reduce", color: "#4B6B4E" },
  { name: "reuse", color: "#4B6B4E" },
  { name: "recycle", color: "#4B6B4E" },
  { name: "compost", color: "#4B6B4E" },
  { name: "living sustainably", color: "#4B6B4E" },
  { name: "stories", color: "#4B6B4E" },
  { name: "challenges", color: "#4B6B4E" },
  { name: "news", color: "#4B6B4E" },
];

function App() {
  //define state variable
  const [showForm, setShowForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(
    function () {
      async function getPosts() {
        setIsLoading(true);

        let query = supabase.from("posts").select("*");

        if (currentCategory !== "all") {
          query = query.eq("category", currentCategory);
        }

        const { data: posts, error } = await query
          .order("votesAmazing", { ascending: false })
          .limit(1000);
        if (!error) setPosts(posts);
        else alert("There was a problem getting the data.");
        setIsLoading(false);
      }
      getPosts();
    },
    [currentCategory]
  );

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {/* use state variable */}
      {showForm ? (
        <NewPostForm setPosts={setPosts} setShowForm={setShowForm} />
      ) : null}

      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <PostList posts={posts} setPosts={setPosts} />
        )}
      </main>
    </>
  );
}

function Header({ showForm, setShowForm }) {
  const appTitle = "Green Living Exchange";
  return (
    <header className="header">
      <div className="logo">
        <img
          src="logo.png"
          height="68"
          width="68"
          alt="Green Living Exchange Logo"
        />
        <h1>{appTitle}</h1>
      </div>
      <button
        className="btn btn-large something-btn shareBtn btn-open"
        // update state variable
        onClick={() => setShowForm((show) => !show)}
      >
        {showForm ? "Close" : "Share something"}
      </button>
    </header>
  );
}
function Loader() {
  return <p className="message">Loading...</p>;
}
function NewPostForm({ setPosts, setShowForm }) {
  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;
  async function handleSubmit(e) {
    e.preventDefault();

    if (text && location && category && textLength <= 200) {
      setIsUploading(true);
      const { data: newPost, error } = await supabase
        .from("posts")
        .insert([
          {
            text,
            location,
            category,
          },
        ])
        .select();
      setIsUploading(false);

      if (!error) {
        setPosts((posts) => [newPost[0], ...posts]);
      }

      setText("");
      setCategory("");
      setLocation("");

      setShowForm(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share something on sustainability..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />
      <span style={{ color: "#4b6b4e" }}>{200 - textLength}</span>
      <input
        type="text"
        placeholder="City in which Located"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        disabled={isUploading}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name} style={{ color: "#4b6b4e" }}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button
        className="btn btn-large"
        style={{ color: "#ece0c8" }}
        disabled={isUploading}
      >
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            style={{ backgroundColor: "#8b5f2b" }}
            onClick={() => setCurrentCategory("all")}
          >
            all
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: "#4b6b4e" }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function PostList({ posts, setPosts }) {
  if (posts.length === 0) {
    return (
      <p className="message">
        No posts for this category yet! You should add the first one!
      </p>
    );
  }

  return (
    <section>
      <ul className="posts-list">
        {posts.map((post) => (
          <Post key={post.id} post={post} setPosts={setPosts} />
        ))}
      </ul>
    </section>
  );
}

function Post({ post, setPosts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed = post.votesAmazing + post.votesGreen < post.votesUnHelpful;
  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedPost, error } = await supabase
      .from("posts")
      .update({ [columnName]: post[columnName] + 1 })
      .eq("id", post.id)
      .select();
    setIsUpdating(false);

    if (!error)
      setPosts((posts) =>
        posts.map((p) => (p.id === post.id ? updatedPost[0] : p))
      );
  }

  return (
    <li className="post">
      <p>
        {post.text + " "}
        {isDisputed ? <span className="disputed">[DISPUTED]</span> : null}
        <span className="location">({post.location})</span>
      </p>
      <span className="tag" style={{ backgroundColor: "#4b6b4e" }}>
        {post.category}
      </span>
      <div className="vote-buttons">
        <button
          onClick={() => handleVote("votesAmazing")}
          disabled={isUpdating}
        >
          😁<strong>{post.votesAmazing}</strong>
        </button>
        <button onClick={() => handleVote("votesGreen")} disabled={isUpdating}>
          🌲 <strong>{post.votesGreen}</strong>
        </button>
        <button
          onClick={() => handleVote("votesUnHelpful")}
          disabled={isUpdating}
        >
          👎 <strong>{post.votesUnHelpful}</strong>
        </button>
      </div>
    </li>
  );
}
export default App;
