import React from "react";
import SignupCard from "./SignupCard";
import LoginCard from "./LoginCard";
import { useRecoilState, useRecoilValue } from "recoil";
import authScreenAtom from "../atoms/authAtom";

const AuthonticationPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  // useRecoilState(AuthScreenState);
//   console.log(authScreenState);

  return <>{authScreenState === "login" ? <LoginCard /> : <SignupCard />}</>;
};

export default AuthonticationPage;
