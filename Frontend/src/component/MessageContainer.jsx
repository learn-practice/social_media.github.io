import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  converstaionAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/ContextSocket";

const MessageContainer = () => {
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [loadingMessage, setLoadingMessage] = useState(true);
  const [message, setMessage] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const setConversation = useSetRecoilState(converstaionAtom);
  const messageRef = useRef(null);
  useEffect(() => {
    socket?.on("newMessage", (message) => {
      if (selectedConversation._id === message.conversationId) {
        setMessage((prevMessage) => [...prevMessage, message]);
      }
      setConversation((prev) => {
        const updatedConversation = prev.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversation;
      });
    });
    return () => socket.off("newMessage");
  }, [socket, selectedConversation, setConversation]);
  useEffect(() => {
    const lastMessageFromOtherUser =
      message.length && message[message.length - 1].sender !== currentUser._id;
    if (lastMessageFromOtherUser) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }
    socket.on("messageSeen", (conversationId) => {
      if (selectedConversation._id === conversationId) {
        setMessage((prev) => {
          const updatedMessage = prev.map((message) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
          return updatedMessage;
        });
      }
    });
  }, [socket, currentUser._id, message, selectedConversation]);
  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  useEffect(() => {
    const getMessage = async () => {
      setLoadingMessage(true);
      setMessage([]);
      try {
        if (selectedConversation.mock) return;
        const res = await fetch(`/api/message/${selectedConversation.userId}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setMessage(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingMessage(false);
      }
    };
    getMessage();
  }, [showToast, selectedConversation.userId, , selectedConversation.mock]);
  return (
    <Flex
      flex={70}
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      flexDirection={"column"}
      p={2}
    >
      {/* message header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
        <Text display={"flex"} alignItems={"center"}>
          {selectedConversation.username}{" "}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
      </Flex>
      <Divider />
      {/* messages */}
      <Flex
        flexDirection={"column"}
        gap={4}
        my={4}
        height={"400px"}
        overflowY={"auto"}
        p={2}
      >
        {loadingMessage &&
          [0, 1, 2, 3, 4].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir={"column"} gap={2}>
                <Skeleton h={"8px"} width={"250px"} />
                <Skeleton h={"8px"} width={"250px"} />
                <Skeleton h={"8px"} width={"250px"} />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}
        {/* message */}

        {!loadingMessage &&
          message.map((mess) => (
            <Flex
              key={mess._id}
              direction={"column"}
              ref={
                message.length - 1 === message.indexOf(message)
                  ? messageRef
                  : null
              }
            >
              <Message
                message={mess}
                ownMessage={currentUser._id === mess.sender}
              />
            </Flex>
          ))}
      </Flex>
      {/* message input */}
      <MessageInput setMessage={setMessage} />
    </Flex>
  );
};

export default MessageContainer;
