import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from "react-native";
import { Themes } from "../assets/Themes";
import { useNavigation } from "@react-navigation/native";

const Chat = ({
  index,
  id,
  name,
  imageUrl,
}) => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() =>
        // Navigates to ChatScreen passing 'id' as the chatbotName parameter
        navigation.navigate("ChatScreen", {
          chatbotName: id,
        })
      }
    >
      <View style={styles.chat}>
        <Text style={styles.index}>{index + 1}</Text>
        <Image
          style={styles.avatar}
          source={{ uri: imageUrl }}
        />
        <View style={styles.chatTextContainer}>
          <Text style={styles.chatbotName} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            Tap to open chat
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chat: {
    display: "flex",
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-start",
  },
  index: {
    color: Themes.colors.gray,
    width: 30,
    textAlign: "center",
    fontSize: 12,
  },
  avatar: {
    resizeMode: "cover",
    width: 50,
    height: 50,
    borderRadius: 25, 
    marginHorizontal: 10,
  },
  chatTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  chatbotName: {
    color: Themes.colors.white || "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    color: Themes.colors.gray || "#888888",
    fontSize: 12,
    marginTop: 2,
  },
});

export default Chat;