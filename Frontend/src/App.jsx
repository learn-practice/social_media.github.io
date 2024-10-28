import { Box, Button, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import Userpage from "./pages/Userpage";
import PostPage from "./pages/PostPage";
import Header from "./component/Header";
import HomePage from "./pages/HomePage";
import AuthonticationPage from "./pages/AuthonticationPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./component/CreatePost";
import ChatPage from "./pages/ChatPage";

function App() {
  const user = useRecoilValue(userAtom);
  return (
    <>
      <Box position={"relative"} w={"full"}>
        <Container maxW={"620px"}>
          <Header></Header>
          <Routes>
            <Route
              path="/"
              element={user ? <HomePage /> : <Navigate to="/auth" />}
            ></Route>
            <Route
              path="/auth"
              element={!user ? <AuthonticationPage /> : <Navigate to="/" />}
            ></Route>
            <Route
              path="/update"
              element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
            ></Route>

            <Route
              path="/:username"
              element={
                user ? (
                  <>
                    <Userpage />
                    <CreatePost />
                  </>
                ) : (
                  <Userpage />
                )
              }
            ></Route>
            <Route path="/:username/post/:pid" element={<PostPage />}></Route>
            <Route
              path="/chat"
              element={user ? <ChatPage /> : <Navigate to={"/auth"} />}
            ></Route>
          </Routes>
        </Container>
      </Box>
    </>
  );
}

export default App;
