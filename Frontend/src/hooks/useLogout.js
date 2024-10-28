import React from 'react'
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from './useShowToast';

const useLogout = () => {
    const setUser = useSetRecoilState(userAtom);
    const showToast = useShowToast();
    const logout = async () => {
        try {
          //fetch
          const res = fetch("/api/user/logout", {
            method: "POST",
            headers: {
              "content-typr": "application/json",
            },
          });
          const data = (await res).json();
          console.log(data);
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
          localStorage.removeItem("user-threads");
          setUser(null);
        } catch (error) {
          showToast("Error", error, "error");
        }
      };
      return {logout};
}

export default useLogout
