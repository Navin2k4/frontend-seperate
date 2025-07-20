/* eslint-disable no-unused-vars */
import { Alert, Button, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("api/event/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something Went Wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-2xl my-7 font-semibold tracking-widest ">
        Create An Event
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            required
            type="text"
            placeholder="Event Title"
            id="title"
            className="flex-1"
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
            }}
          />
          <Select
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
            }}
          >
            <option value="uncategorized">Select Category</option>
            <option value="cultural" className="">
              Cutural
            </option>
            <option value="music" className="">
              Music
            </option>
            <option value="arts" className="">
              Arts
            </option>
          </Select>
        </div>
        <TextInput
          required
          type="text"
          placeholder="Event Location"
          id="location"
          className="flex-1"
          onChange={(e) => {
            setFormData({ ...formData, location: e.target.value });
          }}
        />
        <TextInput
          required
          type="datetime-local"
          placeholder="Event Date & Time"
          id="datetime"
          className="flex-1"
          onChange={(e) => {
            setFormData({ ...formData, datetime: e.target.value });
          }}
        />
        <TextInput
          required
          type="number"
          min="1"
          placeholder="Max Registration"
          id="maxRegistration"
          className="flex-1"
          onChange={(e) => {
            setFormData({
              ...formData,
              maxRegistration: parseInt(e.target.value, 10),
            });
          }}
        />
        <ReactQuill
          theme="snow"
          placeholder="Describe the Event"
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" className="bg-custom-gradient">
          Publish Event
        </Button>

        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}

export default CreatePost;
