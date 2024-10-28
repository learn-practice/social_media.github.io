import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Image,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  WrapItem,
} from "@chakra-ui/react";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/messagesAtom";
const Conversation = ({ conversation, isOnline }) => {
  const user = conversation?.participants[0];
  const lastMessage = conversation?.lastMessage;
  const currentUser = useRecoilValue(userAtom);
  const [selesctedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const colorMode = useColorMode();
  console.log("Selected conversation", selesctedConversation);

  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={"1"}
      _hover={{
        cursor: "pointer",
        bg: colorMode === "light" ? "gray.400" : "gray.dark",
        color: "white",
      }}
      onClick={() =>
        setSelectedConversation({
          _id: conversation?._id,
          userId: user?._id,
          userProfilePic: user?.profilePic,
          username: user?.username,
          mock: conversation.mock,
        })
      }
      bg={
        selesctedConversation?._id === conversation?._id
          ? useColorModeValue("gray.600", "gray.dark")
          : ""
      }
      borderRadius={"md"}
    >
      <WrapItem>
        <Avatar
          size={{ base: "xs", sm: "sm", md: "md" }}
          src={user?.profilePic}
        >
          {isOnline ? <AvatarBadge boxSize={"1em"} bg={"green.500"} /> : ""}{" "}
        </Avatar>
      </WrapItem>
      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight="700" display={"flex"} alignItems={"center"}>
          {user?.username}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          {currentUser?._id === lastMessage?.sender ? (
            <Box color={lastMessage.seen ? "blue.400" : ""}>
              <BsCheck2All />
            </Box>
          ) : (
            ""
          )}
          {lastMessage?.text.length > 18
            ? lastMessage?.text.substring(0, 18) + "..."
            : lastMessage?.text}
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;
