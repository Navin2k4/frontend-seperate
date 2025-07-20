import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/event/getevents?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchEvent();
  }, [postSlug]);

  const handleRegister = async () => {
    setRegistering(true);
    setRegisterError("");
    setRegisterSuccess("");
    try {
      const res = await fetch("/api/event/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId: post.id }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setRegisterError(data.message || "Registration failed");
      } else {
        setRegisterSuccess("Registered successfully!");
      }
    } catch (err) {
      setRegisterError("Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen ">
      <h1 className="text-4xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl text-customGreen">
        {post && post.title}
      </h1>

      <Link
        className="self-center mt-5"
        to={`/search?category=${post && post.category}`}
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>

      <img
        className="mt-10 p-3 max-h-[600px] w-full object-cover rounded-3xl"
        src={post && post.image}
        alt={post.title}
      />

      <div className="flex justify-between border-b border-slate-500 p-3 mx-auto w-full max-w-2xl text-md">
        <div className="flex flex-col gap-2">
          <span>
            Created on : {post && new Date(post.createdAt).toLocaleDateString()}
          </span>
          <span>
            Event Date & Time :{" "}
            {post && new Date(post.datetime).toLocaleString()}
          </span>
          <span>Location : {post && post.location}</span>
          <span>Max Registration : {post && post.maxRegistration}</span>
          <Button
            onClick={handleRegister}
            disabled={!currentUser || registering}
            color="success"
            pill
          >
            {registering
              ? "Registering..."
              : !currentUser
              ? "Sign in to Register"
              : "Register"}
          </Button>
          {registerError && (
            <span className="text-red-500">{registerError}</span>
          )}
          {registerSuccess && (
            <span className="text-green-500">{registerSuccess}</span>
          )}
        </div>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0) == 0
            ? 1
            : (post.content.length / 1000).toFixed(0)}{" "}
          mins read
        </span>
      </div>
    </main>
  );
};

export default PostPage;
