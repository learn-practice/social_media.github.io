import { useEffect, useState } from "react";
import UserHeader from "../component/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../component/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";


const Userpage = () => {
  const {loading,user}= useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  useEffect(() => {
   
    const getPosts = async () => {
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/post/user/${username}`);
        const contentType = res.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
          setPosts(data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };
    getPosts();
  }, [username, showToast,setPosts]);
  console.log("post is here and it is recoilstate",posts);
  
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if (!user && !loading) {
    return <h1>User not found</h1>;
  }
  return (
    <>
      <UserHeader user={user} />
      {!fetchingPosts && posts.length === 0 && <h1>User has no posts.</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy}/>
      ))}
    </>
  );
};

export default Userpage;
