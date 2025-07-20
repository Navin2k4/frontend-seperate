import { Alert, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { useState } from "react";
const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.email) {
      return setErrorMessage("Please fill out all fields");
    }

    let data;

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch("api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      data = await res.json();

      if (data.success === false) {
        // Sequelize unique constraint error handling
        if (
          data.message &&
          data.message.toLowerCase().includes("must be unique")
        ) {
          if (data.message.toLowerCase().includes("email")) {
            setErrorMessage("Email is already in use");
          } else if (data.message.toLowerCase().includes("username")) {
            setErrorMessage("Username is already taken");
          } else {
            setErrorMessage("A unique constraint error occurred.");
          }
        } else {
          setErrorMessage(data.message); // Other errors
        }
        setLoading(false);
        return;
      }
      if (res.ok) {
        setLoading(false);
        navigate("/sign-in");
      }
    } catch (error) {
      if (data) {
        setErrorMessage(data.message);
      } else {
        setErrorMessage(
          "An error occurred while signing up. Please try again later."
        );
      }
      setLoading(false);
    }
  };

  return (
    <section className="mb-40 mt-10 md:mt-20">
      <div className="flex p-3 max-w-4xl mx-auto flex-col md:flex-row md:items-center gap-10">
        <div className="flex-1">
          <Link
            to="/"
            className="tracking-widest text-4xl font-bold dark:text-white leading-normal"
          >
            <span className="px-2 py-1  bg-custom-gradient rounded-lg text-white mr-2 ">
              Event
            </span>
            App
          </Link>
          <p className="mt-5 text-l leading-relaxed ">
            Join Event App now! Sign up with your email and password to access
            exclusive content and connect with changemakers driving positive
            change in Event communities.
          </p>
        </div>

        <div className="flex-1 bg-green-100 p-5 rounded-2xl shadow-lg ring-1 ring-slate-600/5 dark:bg-gray-700">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <Label value="Your Username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                className="mt-3"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                className="mt-3"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                className="mt-3"
                onChange={handleChange}
              />
            </div>
            <Button
              className="bg-custom-gradient"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5 justify-center">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-lime-300 underline">
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </section>
  );
};

export default SignUp;
