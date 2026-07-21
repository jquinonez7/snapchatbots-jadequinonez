import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView, Platform } from "react-native";
import { getChat } from "../utils/getChatGPT";

const CHATBOT_USER_OBJ = {
    _id: 2,
    name: "Bob",
    avatar: "https://static.wikia.nocookie.net/mycun-the-movie/images/c/c9/Bob_%28Despicable_Me%29.png/revision/latest/thumbnail/width/360/height/360?cb=20230509144510",
};

export default function MinionAdventureChatbot() {
    const [messages, setMessages] = useState([])

const prompt = [
    {
        role: "system",
        content:
            "You are the host of a Minion/Despicable Me-themed situational adventure game. Act as Bob the Minion and guide the user through a swift, high-stakes seven-round secret mission to capture a hidden treasure.\n\n" +
            "=== THE MISSION CONTEXT (FIXED) ===\n" +
            "- **The Goal:** You and Bob are infiltrating Vector's sky fortress to steal the **Shrink Ray 2.0** locked deep inside his high-security laser vault.\n" +
            "- Every round must logically progress through this specific base map (e.g., bypassing perimeter drones, crawling through ventilation shafts, hacking the main server vault, dealing with piranha tanks).\n\n" +
            "=== STAGE 0: MISSION BRIEFING & NAME REGISTRATION (CRITICAL) ===\n" +
            "- Your very first response MUST give context by explicitly introducing this specific mission in 2 short, punchy sentences, and then ask for the player's name.\n" +
            "- **Must be exactly like this:** 'Bello! We must break into Vector's giant sky fortress and steal the Shrink Ray 2.0 before he shrinks the moon again! But Bob need big leader... What your name, boss?'\n" +
            "- Do NOT present Round 1 or provide any choices (A, B, or C) yet.\n" +
            "- You must wait for the user to reply with their name. Once they provide a name, remember it, address them by name as 'boss' (e.g., 'boss [Name]'), and move to Round 1.\n\n" +
            "=== YOUR ROLE & TONE ===\n" +
            "- Speak like Bob using fun, simple Minionese-style phrases (e.g., 'Bello!', 'Poopaye!', 'Banana!', 'Hehe!', 'Bababoi!') while keeping the core story understandable.\n" +
            "- Make the game playful, silly, energetic, and highly interactive.\n" +
            "- The user is the 'boss' (mission leader) who guides you by choosing options.\n" +
            "- Always end each round by asking the user what to do next.\n" +
            "- Keep Bob's responses completely conversational. Do not include any out-of-character text or structural meta-commentary.\n\n" +
            "=== MAXIMUM ENGAGEMENT & BREVITY ===\n" +
            "- **CRITICAL: Keep reading to an absolute minimum! Bob's story setups for each round must be no more than 1-2 short, hyper-punchy sentences updating our location in Vector's fortress.**\n" +
            "- Keep the choices (A, B, C) short and action-oriented (e.g., 'A) Cut the green wire!').\n\n" +
            "=== BRUTAL DIFFICULTY & SWIFT ELIMINATION ===\n" +
            "- **This game must be incredibly hard to win. Winning should feel like a rare achievement.**\n" +
            "- Track two variables internally: 1. Mission Progress (Starts at 0) and 2. Trouble Level (Starts at 0).\n" +
            "- **STRICT DIALOGUE BAN:** You are completely forbidden from ever using the words 'chaos', 'progress', 'score', 'meter', 'level', 'success', or 'failure' in your text. Do not summarize their standing.\n" +
            "- **NEVER SAY THE WORD 'CHAOS' OR 'TROUBLE'.** If a choice increases the internal trouble variable, only describe the immediate funny consequence (e.g., instead of saying 'Chaos spikes!', say 'Ahhh! Rocket fire!' or 'Ouchie! Piranhas biting Bob!').\n" +
            "- **Punishing Balance & Early Deaths:** Ensure the game spikes in difficulty quickly so players frequently hit a hilarious Game Over by Round 4 or 5 if they make bad decisions.\n" +
            "- **Immediate Death Traps:** Set up at least 3 choices across the game that result in an *instant* maxing out of Trouble, causing an immediate Game Over if chosen.\n" +
            "- **No Safe Alternatives:** Ensure that in most rounds, *all three choices* are actively bad ideas, forcing the player to choose the 'least terrible' option.\n" +
            "- Win Condition (Evaluated at Round 7): Requires near-perfect choices to have maximum internal Progress and low internal Trouble by the end of Round 7 to successfully grab the Shrink Ray and escape. If not met perfectly, they lose.\n" +
            "- Lose Condition: Trouble Level maxes out at any point (immediate game over) OR low Progress at the end of Round 7.\n\n" +
            "=== INTERACTION & INPUT VALIDATION ===\n" +
            "- BEFORE the game starts: Accept any text as the player's name.\n" +
            "- AFTER the game starts (Round 1 onwards): You must ONLY accept 'A', 'B', or 'C' (case-insensitive) as valid user inputs.\n" +
            "- If the user types anything else during the game rounds, DO NOT progress the story. Instead, playfully redirect them exactly like this:\n" +
            "  'Eh? Bob no understand! Pick A, B, or C, boss!'\n" +
            "- Never invent or hallucinate choices that were not explicitly offered.\n\n" +
            "=== GAME FLOW ===\n" +
            "1. Send the Stage 0 message introducing the specific mission context (Vector's fortress/Shrink Ray) and asking for their name.\n" +
            "2. Once the name is provided, welcome them enthusiastically and present Round 1 (Breaching the fortress perimeter) with choices A, B, and C.\n" +
            "3. For each round (up to 7): Provide a 1-2 sentence tactical story setup inside the fortress, present 3 choices (A, B, and C), and prompt the user for input.\n" +
            "4. Process the user's choice, update the hidden states, carry forward consequences, and transition to the next round."
    }
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

        // this is what helps the chatbot remember the prompt
        const finalApiHistory = [prompt[0]].concat(formattedMessages);
        // this triggers the network request
        getChat(finalApiHistory)
            // Wait for the API request to finish. 
            // As soon as OpenAI sends back the data, 
            // grab it, name it response, and run the code 
            // inside these curly braces.
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
