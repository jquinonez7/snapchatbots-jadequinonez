import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';


const CHATBOT_USER_OBJ = {
  _id: 3,
  name: "Bob",
  _id: 2,
  avatar:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJKaEdVfkce23g4C-kiMVkbDfRG_jCmFSrpbJ3buGaIQy3VThLGLfBP-Y&s=10",
};

const questions = [
  {
    id: 1,
    question: "What is the name of the tiny teddy bear that Bob carries everywhere?",
    answer: "Tim"
  },
  {
    id: 2,
    question: "What is the Minions' favorite food?",
    answer: "Bananas!"
  },
  {
    id: 3,
    question: "What is the name of the supervillain the Minions serve throughout most of the movies?",
    answer: "Gru"
  },
  {
    id: 4,
    question: "Which tall, two-eyed Minion loves playing the ukulele and acts like a responsible leader?",
    answer: "Kevin"
  },
  {
    id: 5,
    question: "What color do Minions turn when they are injected with the evil PX-41 serum?",
    answer: "Purple"
  },
  {
    id: 6,
    question: "What is the name of Gru's spiky, sharp-toothed pet 'dog'?",
    answer: "Kyle"
  },
  {
    id: 7,
    question: "Which chill, one-eyed Minion loves playing guitar and gets mistaken for a fire hydrant?",
    answer: "Stuart"
  },
  {
    id: 8,
    question: "In the 2015 'Minions' movie, which British monarch accidentally crowns Bob as king?",
    answer: "Queen Elizabeth II"
  },
  {
    id: 9,
    question: "What is the name of the round, chatty Minion with braces who loses a magical stone?",
    answer: "Otto"
  },
  {
    id: 10,
    question: "What material are the Minions' signature blue overalls made of?",
    answer: "Denim"
  },
  {
    id: 11,
    question: "What fruit do the Minions use to make a fake laser gun noise? (Bada-...? )",
    answer: "Potato"
  },
  {
    id: 12,
    question: "What does the word 'Tulaliloo ti amo' mean in Minion-ese?",
    answer: "I love you"
  },
  {
    id: 13,
    question: "Which supervillainess with a giant red dress do the Minions serve in 1968?",
    answer: "Scarlet Overkill"
  },
  {
    id: 14,
    question: "What is the name of Scarlet Overkill's mod, gadget-building husband?",
    answer: "Herb"
  },
  {
    id: 15,
    question: "What hilarious household item do Minions put on their heads to pretend to be firefighters?",
    answer: "A red flashing siren (or a megaphone)"
  },
  {
    id: 16,
    question: "How many fingers does a Minion have on each hand?",
    answer: "Three" || "3"
  },
  {
    id: 17,
    question: "True or False: Minions can survive in outer space without a spacesuit.",
    answer: "True"
  },
  {
    id: 18,
    question: "What are the names of Gru's three adopted daughters?",
    answer: "Margo, Edith, and Agnes"
  },
  {
    id: 19,
    question: "What kind of vehicle do the Minions use to travel across America to Villain-Con?",
    answer: "A station wagon (with a family of bank robbers!)"
  },
  {
    id: 20,
    question: "Which prehistoric creature did the Minions accidentally knock into a volcano?",
    answer: "A Tyrannosaurus Rex"
  },
  {
    id: 21,
    question: "What do Minions love to print pictures of when they find a photocopying machine?",
    answer: "Their butts"
  },
  {
    id: 22,
    question: "What is the name of Gru's twin brother who has a full head of blonde hair?",
    answer: "Dru"
  },
  {
    id: 23,
    question: "In Despicable Me 4, what are the five enhanced, superpower-wielding Minions called?",
    answer: "The Mega Minions"
  },
  {
    id: 24,
    question: "What musical instrument does Otto traded a sacred zodiac amulet for?",
    answer: "A Pet Rock"
  },
  {
    id: 25,
    question: "What is the name of Gru's elderly, hard-of-hearing gadget scientist?",
    answer: "Dr. Nefario"
  }
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);


  useEffect(() => {
    if (messages.length < 1) {
      // Add a "starting message" when chat UI first loads
      addBotMessage(
        "Bello! Welcome to the Ultimate Minion Trivia Game! 🍌 Chaba tu know Kevin, Stuart, and Bob—bello, me, better than anyone else? Say 'Yes' when you ready to play! Woohoo! Tim, look!",
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
    const handleQuestionNumber = (questionNumber) => {
      setQuestionNumber(questionNumber + 1);
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
  const messageInput = userMessages[0].text.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_~()]/g, "");

  // --- GAME NOT STARTED ---
  if (!gameStarted) {
    if (messageInput === "yes") {
      const firstRandomIndex = Math.floor(Math.random() * questions.length);
      
      setGameStarted(true);
      setCurrentQuestionIndex(firstRandomIndex);
      setQuestionNumber(1); // Reset counter to 1
      
      addBotMessage("Yayyyy! Let's start.\n\nQuestion 1: " + questions[firstRandomIndex].question);
    } else {
      addBotMessage("Por Favor say 'Yes' when you ready to play!");
    }
    return; // Stop execution here so it doesn't leak into the next block
  }

  // --- GAME IS RUNNING ---
  if (gameStarted) {
    const currentQuestion = questions[currentQuestionIndex];
    const answer = currentQuestion.answer.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_~()]/g, "");

    // 1. Check the answer to the CURRENT question
    if (answer.includes(messageInput) || messageInput.includes(answer)) {
      addBotMessage("Correct!!");
    } else {
      addBotMessage(`Incorrect! The answer was: ${currentQuestion.answer}`);
    }

    const nextQuestionNumber = questionNumber + 1;

    if (nextQuestionNumber <= 5) {
      const nextRandomIndex = Math.floor(Math.random() * questions.length);
      
      setQuestionNumber(nextQuestionNumber);
      setCurrentQuestionIndex(nextRandomIndex); 
      
      addBotMessage(`Question ${nextQuestionNumber}: ${questions[nextRandomIndex].question}`);
    } else {
      // Game Over sequence
      addBotMessage("Game Over! You completed 5 questions!");
      setGameStarted(false);
      setQuestionNumber(1);
      setCurrentQuestionIndex(0);
      
      // Delay this slightly so it prints after the Game over message clearly
      setTimeout(() => {
        addBotMessage("Want to play again? Say 'Yes' to restart!");
      }, 500);
    }
  }
};


  const onSend = useCallback((messages = []) => {
    addNewMessage(messages);
  }, []);

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