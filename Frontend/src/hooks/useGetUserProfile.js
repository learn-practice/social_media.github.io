import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  const { username } = useParams();
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/profile/${username}`);
        const data = await res.json();
        if(data.error)
        {
            showToast("Error",data.error,"error");
            return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      }finally{
        setLoading(false);
      }
    };
    getUser();
  }, [username,showToast]);
  return {loading,user}
};

export default useGetUserProfile;
