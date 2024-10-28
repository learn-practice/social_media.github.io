import { Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../component/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();

  useEffect(() => {
    const getFeedPost = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch("/api/post/feed");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPost();
  }, [showToast,setPosts]);

  return (
    <>
      {!loading && posts.length === 0 && (
        <h1>Follow some users to see the feed</h1>
      )}
      {loading && (
        <Flex justifyContent={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default HomePage;
