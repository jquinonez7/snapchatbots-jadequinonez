import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
// import { add } from "react-native/types_generated/Libraries/Animated/AnimatedExports";
// import { setPublicInstanceForReactNativeDocumentElementInstanceHandle } from "react-native/types_generated/src/private/webapis/dom/nodes/internals/ReactNativeDocumentElementInstanceHandle";

const CHATBOT_USER_OBJ = {
  _id: 2,
  name: "Chatbot",
  avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg1IgnM0u9bgP0QLLWbn2_uFNH6zAzqwj7ePV9vKCQm7dKWI4-AEJ-uRs&s=10",
};

export default function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (messages.length < 1) {
      // Add a "starting message" when chat UI first loads
      addBotMessage(
        "Hello, welcome to Jackie trivia! Say 'Yes' when you're ready to play!",
      );
    }
  }, []);

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

  const remindBotMessage = (text) => {
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
    const userResponse = userMessages[0].text.trim();
    // this decides if the user has began to play the game
    if (currentQuestion === -1) {
      // if they say yes then ask question
      if (userResponse.toLowerCase() === "yes") {
        addBotMessage(jackieQuestions[0].question);
        // saves where you are
        setCurrentQuestion(0);
      } else {
        // if the user says anything but yes, make them say yes to start
        addBotMessage("Please say yes");
      }
      return;
    }
    let newScore = score;

    if (
      userResponse.toLowerCase() ===
      jackieQuestions[currentQuestion].correctAnswer.toLowerCase()
    ) {
      newScore++;
      setScore(newScore);
      addBotMessage("correct");
    } else {
      // if the user types the wrong answer, tell them its wrong
      addBotMessage(
        `Wrong. The correct answer is ${jackieQuestions[currentQuestion].correctAnswer}.`,
      );
    }

    // checks if there is another question to ask
    if (currentQuestion < jackieQuestions.length - 1) {
      // go to the following question
      const nextQuestion = currentQuestion + 1;
      // save where you are next
      setCurrentQuestion(nextQuestion);
      // send the next question to the user
      addBotMessage(jackieQuestions[nextQuestion].question);
    } else {
      // when you run out of questions at the end of the loop, send this message
      addBotMessage(`game over!\nfinal score is ${newScore}/7`);

      if (newScore === 7) {
        addBotMessage("Amazing, you must really know Jackie!");
      } else if (newScore >= 5) {
        addBotMessage("Good, you know Jackie more than most.");
      } else if (newScore >= 3) {
        addBotMessage("Eh not too bad!");
      } else {
        addBotMessage("Bad bad bad, you do NOT know ackie");
      }
      setCurrentQuestion(-1);
      setScore(0);

      addBotMessage('type "Yes" to restart');
    }
  };
  // if (userMessages[0].text === "Yes") addBotMessage("I am da response!");
  // else remindBotMessage("Please say Yes");

  const onSend = useCallback((messages = []) => {
    addNewMessage(messages);
  }, []);

  //
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [score, setScore] = useState(0);
  // array of objects
  const jackieQuestions = [
    {
      question: "What is my favorite animal?",
      correctAnswer: "Penguin",
    },
    {
      question: "What is my favorite color?",
      correctAnswer: "Blue",
    },
    {
      question: "What is my favorite city?",
      correctAnswer: "San Diego",
    },
    {
      question: "What is my favorite number?",
      correctAnswer: "7",
    },
    {
      question: "What is my favorite chip?",
      correctAnswer: "Doritos",
    },
    {
      question: "Which series is my favorite Sonny Angel?",
      correctAnswer: "Marine series",
    },
    {
      question: "Where will I travel to next this year?",
      correctAnswer: "Mexico",
    },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <GiftedChat
          messages={messages}
          onSend={(messages) => {
            onSend(messages);
            // Wait a sec before responding
            setTimeout(() => respondToUser(messages), 1000);
          }}
          user={{
            _id: 1,
            name: "Chilla",
          }}
          renderUsernameOnMessage={true}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Workaround to hide an unnessary warning about defaultProps
const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};