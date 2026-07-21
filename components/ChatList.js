import { FlatList, View, StyleSheet } from "react-native";
import { Themes } from "../assets/Themes";
import Chat from "./Chat"; // Corrected this import from "./Song"

const renderChat = ({ item, index }) => (
  <Chat
    index={index}
    id={item.id}
    name={item.name}
    imageUrl={item.imageUrl}
  />
);

export default function ChatList({ chats }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        // Passing renderChat directly corrects the { item, index } destructuring crash
        renderItem={renderChat}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    marginTop: 20,
    marginLeft: 5,
    marginBottom: 20,
  },
  text: {
    color: Themes.colors.gray,
  },
});