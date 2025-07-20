import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  Navbar,
  NavbarToggle,
} from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
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
    <Navbar className="border-b-2 ">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-l font-semibold dark:text-white sm:text-xl"
      >
        <span className="px-3 py-1 bg-custom-gradient rounded-lg text-white mr-1">
          Event
        </span>
        App
      </Link>
      <div className="flex gap-2 md:order-2">
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
            className="p-2"
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>

            {currentUser.isAdmin && (
              <Link to={"/dashboard?tab=profile"}>
                <DropdownItem>Dashboard</DropdownItem>
              </Link>
            )}
            <DropdownDivider />

            <Link to={"/dashboard?tab=profile"}>
              <DropdownItem>Profile</DropdownItem>
            </Link>

            <DropdownDivider />
            <DropdownItem onClick={handleSignout}>Sign Out</DropdownItem>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button className="bg-custom-gradient" outline>
              Sign In
            </Button>
          </Link>
        )}

        <NavbarToggle />
      </div>
      <Navbar.Collapse></Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
