import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView, Platform } from "react-native";
import { getChat } from "../utils/getChatGPT";

const CHATBOT_USER_OBJ = {
  _id: 2,
  name: "React Native Chatbot",
  avatar: "https://loremflickr.com/140/140",
};

export default function BasicChatbot() {
  const [messages, setMessages] = useState([]);

  const prompt = [
    {
      role: "system",
      content:
        "You are now EmojiMovieGPT, a reality game show where contestants play to win it all. The premise of the game is to play for 5 rounds and have the user guess the movie for a given set of emojis. You will provide a set of emojis based on a movie and the user will provide a guess. If the user is correct, they get 1 point. First, ask the user for their name and then start the show! All of your responses should be directly addressed to the player.",
    },
  ];

  useEffect(() => {
    fetchInitialMessage();
  }, []);



  async function fetchInitialMessage() {
    const response = await getChat(prompt);
    if (response.error) {
      console.log("RESPONSE ERROR", response);
    } else {
      const message = response.choices[0].message;
      ("message: ", message);
      const content = response.choices[0].message.content;
      addBotMessage(content);
    }
  }

    const addNewMessage = (newMessages) => {
    setMessages((previousMessages) => {
      // console.log("PREVIOUS MESSAGES:", previousMessages);
      // console.log("NEW MESSAGE:", newMessages);
      return GiftedChat.append(previousMessages, newMessages);
    });
  };

  const addBotMessage = (text) => {
    addNewMessage([
      {
        _id: Math.round(Math.random() * 1000000),
        text: text,
        createdAt: new Date(),
        user: CHATBOT_USER_OBJ,
      },
    ]);
  };

  const respondToUser = (userMessages) => {
    //chatgpt does not have a memory
    //we must create smth that will hold chat history
    //this adds usermessages to messages to form 1 big list
    const allMessages = [...userMessages, ...messages].reverse();

    //we must assign role to each message
    // we use a map to go through each msg
    //current format:
    // _id: Math.round(Math.random() * 1000000), // <-- GiftedChat rule
    // text: text,                               // <-- GiftedChat rule
    // createdAt: new Date(),                    // <-- GiftedChat rule
    // user: CHATBOT_USER_OBJ,                   // <-- GiftedChat rule
    const formattedMessages = allMessages.map((msg) => {
      //assign role to empty at first
      let messageRole = "";
      // if id is 1 then user
      if (msg.user._id === 1) {
        messageRole = "user";
        //if not 1 then its the bot
      } else {
        messageRole = "assistant";
      }
      //we have to return in format that chatgpt expects
      return {
        role: messageRole,  // We rename GiftedChat's "user" to "role"
        content: msg.text   // We rename GiftedChat's "text" to "content"
      };
    });

    const finalApiHistory = [prompt[0]].concat(formattedMessages);
      
    getChat(finalApiHistory)
      .then((response) => {
        if (!response.error) {
          const botReply = response.choices[0].message.content;
          addBotMessage(botReply);
        }
      });

  };

  const onSend = useCallback((messages = []) => {
    addNewMessage(messages);
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => {
        onSend(messages);
        setTimeout(() => respondToUser(messages));
      }}
      user={{
        _id: 1,
        name: "Baker",
      }}
      renderUsernameOnMessage={true}
    />
  );
}
