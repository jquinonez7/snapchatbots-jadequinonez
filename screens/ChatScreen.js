import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView, Platform, Text } from "react-native";
import BasicChatbot from "../components/BasicChatbot";
import AlexisChatbot from "../components/AlexisChatbot";
import MinionChatbot from "../components/MinionChatbot";
import JackiesChatbot from "../components/JackiesChatbot";
import MinionAdventureChatbot from "../components/MinionAdventureChatbot"; 
// prettier-ignore
export const CHATBOTS = {
  "BasicChatbot": {
    id: "BasicChatbot",
    name: "React Native Chatbot",
    imageUrl: "https://loremflickr.com/140/140",
    component: BasicChatbot,
  },
  "AlexisChatbot": {
    id: "AlexisChatbot",
    name: "Dog Trivia",
    imageUrl: "https://img.freepik.com/free-vector/cute-dog-robot-cartoon-character-animal-technology-isolated_138676-3143.jpg?w=150",
    component: AlexisChatbot,
  },
   "MinionChatbot": {
    id: "MinionChatbot",
    name: "Minion Trivia",
    imageUrl: "https://static.wikia.nocookie.net/despicableme/images/5/52/Bob_Bear%27s.jpg/revision/latest?cb=20211001015750",
    component: MinionChatbot,
  },
     "JackiesChatbot": {
    id: "JackiesChatbot",
    name: "Jackie Trivia",
    imageUrl: "https://api.triviacreator.com/v1/imgs/quiz/question-mark-post-its--60e3201e-f547-4be5-932d-2a7bfa9254b8.jpeg",
    component: JackiesChatbot,
  },
       "MinionAdventureChatbot": {
    id: "MinionAdventureChatbot",
    name: "Minion Adventure",
    imageUrl: "https://i.guim.co.uk/img/static/sys-images/Observer/Pix/pictures/2015/6/25/1435240594611/Burbling-slapstick-multi--009.jpg?width=465&dpr=1&s=none&crop=none",
    component: MinionAdventureChatbot,
  }
};

export default function ChatScreen({ route }) {
  const { chatbotName } = route.params;

  const makeChatbotComponent = (chatbotName) => {
    if (CHATBOTS[chatbotName]) {
      const Chatbot = CHATBOTS[chatbotName].component;
      return <Chatbot />;
    } else {
      return <Text>No Chatbot Found with name '{chatbotName}'</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {makeChatbotComponent(chatbotName)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
