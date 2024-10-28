import { atom } from "recoil";

export const converstaionAtom = atom({
  key: "converstaionAtom",
  default: [],
});

export const selectedConversationAtom = atom({
  key: "selectedConversationAtom",
  default: {
    _id: "",
    userId: "",
    username: "",
    userProfilePic: "",
  },
});
