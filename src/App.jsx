import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import SignIn from './pages/SignIn'
import Projects from "./pages/Projects";
import SignUp from "./pages/SignUp";
import Search from "./pages/Search";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />} >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />} >
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
};

export default App;
