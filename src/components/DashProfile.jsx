/* eslint-disable no-unused-vars */
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutSuccess,
} from "../redux/user/userSlice";

import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUplodingProgress, setImageFileUplodingProgress] =
    useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setshowModel] = useState(false);

  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploadError(null);
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUplodingProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Couldn't upload Image (File must be less than 2mb)"
        );
        setImageFileUplodingProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setshowModel(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />

        <Button
          type="submit"
          className="bg-custom-gradient"
          outline
          disabled={loading || imageFileUploading}
        >
          {loading ? "Loading..." : "Update"}
        </Button>

        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              className="bg-custom-gradient tracking-widest w-full"
            >
              CREATE A POST
            </Button>
          </Link>
        )}

        <div className="text-red-500 flex justify-between mt-5">
          <span onClick={() => setshowModel(true)} className="cursor-pointer">
            Delete account
          </span>
          <button onClick={handleSignout} className="hover:cursor-pointer">
            Sign Out
          </button>
        </div>

        {updateUserSuccess && (
          <Alert color="success" className="mt-5">
            {updateUserSuccess}
          </Alert>
        )}
        {updateUserError && (
          <Alert color="failure" className="mt-5">
            {updateUserError}
          </Alert>
        )}
        {error && (
          <Alert color="failure" className="mt-5">
            {error}
          </Alert>
        )}

        <Modal
          show={showModal}
          onClose={() => setshowModel(false)}
          popup
          size="md"
        >
          <Modal.Header className="ml-2">Delete Account</Modal.Header>
          <Modal.Body className="">
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-400 mb-4 mx-auto" />
              <h3 className="mb-6 text-lg text-gray-500 dark:text-gray-400">
                Are you sure you want to delete your account?
              </h3>
            </div>
            <div className="flex gap-4 justify-center">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I`m sure
              </Button>
              <Button onClick={() => setshowModel(false)}>Cancel</Button>
            </div>
          </Modal.Body>
        </Modal>
      </form>
    </div>
  );
}

export default DashProfile;
