# Snap Chatbots

A React Native app with a Snapchat-style list of chatbots. Tap a chat to open a conversation. Some bots are scripted trivia games, and others are AI game hosts powered by the OpenAI API.

Built during the **Snap Engineering Academy (Summer 2026)**. The project combines two earlier labs: a Spotify-style navigation lab and a TriviaChat lab. The Spotify song list became a list of chatbots.

## The Chatbots

| Chatbot | Type | What it does |
| --- | --- | --- |
| **Minion Adventure** | AI (OpenAI) | A 7-round text adventure hosted by Bob the Minion. You and Bob break into Vector's sky fortress to steal the Shrink Ray 2.0. Each round gives choices A, B, and C. The game is meant to be hard: it tracks hidden "progress" and "trouble" values, has instant-game-over traps, and only lets you win with near-perfect choices. |
| **React Native Chatbot (EmojiMovieGPT)** | AI (OpenAI) | A 5-round game show. The bot shows a movie as a set of emojis, you guess the title, and it keeps score. |
| **Minion Trivia** | Scripted | 25 Despicable Me and Minions trivia questions asked in random order, with instant correct or incorrect feedback. |
| **Dog Trivia** | Scripted | A dog trivia bot contributed by a classmate. |
| **Jackie Trivia** | Scripted | A sample trivia bot from the lab materials. |

I built the app's navigation and chat list, the Minion Adventure, EmojiMovieGPT, and Minion Trivia bots, and the OpenAI integration.

## How It Works

### Navigation
- `HomeScreen` reads every entry in the `CHATBOTS` registry (`screens/ChatScreen.js`) and passes them to `ChatList`, which renders them in a `FlatList`.
- Tapping a `Chat` row navigates to `ChatScreen` with the bot's `id`. `ChatScreen` looks up that bot and renders its component.
- **Adding a new bot** takes one component plus one entry in `CHATBOTS`.

### Giving the AI a memory
The OpenAI Chat Completions API is stateless: it doesn't remember earlier messages. To make multi-round games work, each request sends the full conversation:

1. Merge the new user message with the existing chat history.
2. Convert each GiftedChat message into OpenAI's format. The user's messages become `role: "user"` and the bot's become `role: "assistant"`, with `text` renamed to `content`.
3. Put the game's **system prompt** at the front, so the rules, character, and hidden game state stay in effect for every turn.
4. Send the request to `gpt-4.1-nano` through `utils/getChatGPT.js` and add the reply to the chat.

### Prompt design (Minion Adventure)
The Minion Adventure behavior comes entirely from its system prompt:
- a fixed opening message and name registration before Round 1
- strict input validation (only A, B, or C once the game starts, plus an in-character reprompt otherwise)
- hidden progress and trouble variables that the bot never names
- short, 1–2 sentence setups per round to keep players engaged
- clear win and lose conditions checked at Round 7

## Tech Stack

- **React Native** + **Expo**
- **React Navigation** (stack navigator)
- **react-native-gifted-chat** for the chat UI
- **OpenAI Chat Completions API** (`gpt-4.1-nano`)

## Getting Started

**Prerequisites:** Node.js, the Expo Go app or a simulator, and an OpenAI API key.

```bash
git clone https://github.com/jquinonez7/snapchatbots-jadequinonez.git
cd snapchatbots-jadequinonez
npm install
cp .env.example .env   # then add your OpenAI key to .env
npx expo start
```

`.env` should contain:

```
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

`.env` is in `.gitignore`, so your key is never committed.

## Project Structure

```
├── App.js                      # Navigation container + stack routes
├── components/
│   ├── ChatList.js             # FlatList of chatbots
│   ├── Chat.js                 # Pressable chat row → opens ChatScreen
│   ├── BasicChatbot.js         # EmojiMovieGPT (OpenAI)
│   ├── MinionAdventureChatbot.js  # Minion Adventure (OpenAI)
│   ├── MinionChatbot.js        # Minion Trivia (scripted)
│   ├── AlexisChatbot.js        # Dog Trivia (scripted)
│   └── JackiesChatbot.js       # Jackie Trivia (scripted)
├── screens/
│   ├── HomeScreen.js           # Chat list
│   └── ChatScreen.js           # CHATBOTS registry + chat view
└── utils/
    └── getChatGPT.js           # OpenAI API request helper
```

## Known Limitations and Next Steps

- **API key in the client:** Expo includes `EXPO_PUBLIC_` variables in the app bundle, so this setup only works for local development. A production version would send requests through a small backend so the key stays on a server.
- Save chat history between sessions.
- Add a loading or typing indicator while the AI responds.
- Show a friendly message in the chat when an API request fails.
