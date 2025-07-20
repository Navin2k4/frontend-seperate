import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiChat,
  HiDocumentText,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";
import { signOutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

function DashSidebar() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

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
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item active={tab == "profile"} icon={HiUser} as="div">
              Profile
            </Sidebar.Item>
          </Link>
          <Link to="/create-post">
            <Sidebar.Item active={tab == "create-post"} icon={HiChat} as="div">
              Create a Post
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=posts">
            <Sidebar.Item
              active={tab == "posts"}
              icon={HiDocumentText}
              as="div"
            >
              Posts
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=users">
            <Sidebar.Item
              active={tab == "users"}
              icon={HiOutlineUserGroup}
              as="div"
            >
              Users
            </Sidebar.Item>
          </Link>
          <Sidebar.Item onClick={handleSignout} icon={HiArrowSmRight}>
            <button className="hover:cursor-pointer">Sign Out</button>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashSidebar;
