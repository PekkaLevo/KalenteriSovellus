import React, { useState } from "react";
import { StyleSheet, View, FlatList, Keyboard } from "react-native";
import {
  ThemeProvider,
  Text,
  Input,
  Button,
  ListItem,
  Divider,
} from "@rneui/themed";
import { Feather } from "@expo/vector-icons";

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

function ShoppingListScreen() {
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [list, setList] = useState([]);

  const addItem = () => {
    const name = item.trim();
    const qty = amount.trim();
    if (!name || !qty) return;
    const newItem = { id: makeId(), name, amount: qty };
    setList((prev) => [newItem, ...prev]);
    setItem("");
    setAmount("");
    Keyboard.dismiss();
  };

  const clearList = () => setList([]);
  const removeItem = (id) =>
    setList((prev) => prev.filter((it) => it.id !== id));

  const renderItem = ({ item }) => (
    <ListItem bottomDivider containerStyle={styles.listItem}>
      <Feather name="shopping-cart" size={20} />
      <ListItem.Content>
        <ListItem.Title style={styles.itemTitle}>{item.name}</ListItem.Title>
        <ListItem.Subtitle style={styles.itemSubtitle}>
          {item.amount}
        </ListItem.Subtitle>
      </ListItem.Content>
      <Feather
        name="x-circle"
        size={20}
        color="#ef4444"
        onPress={() => removeItem(item.id)}
      />
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>
        Shopping List
      </Text>

      <View style={styles.inputsRow}>
        <Input
          placeholder="Item"
          value={item}
          onChangeText={setItem}
          leftIcon={<Feather name="edit-3" size={18} />}
          containerStyle={styles.inputContainerHalf}
          inputContainerStyle={styles.inputInner}
          returnKeyType="next"
          onSubmitEditing={() => {}}
        />
        <Input
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          leftIcon={<Feather name="hash" size={18} />}
          containerStyle={styles.inputContainerHalf}
          inputContainerStyle={styles.inputInner}
          returnKeyType="done"
          onSubmitEditing={addItem}
        />
      </View>

      <View style={styles.buttonsRow}>
        <Button
          title="Add"
          onPress={addItem}
          icon={<Feather key="add-icon" name="plus" size={16} color="#fff" />}
          buttonStyle={styles.primaryBtn}
        />

        <Button
          title="Clear"
          type="outline"
          onPress={clearList}
          icon={
            <Feather key="clear-icon" name="trash-2" size={16} color="#d33" />
          }
          titleStyle={{ color: "#d33" }}
          buttonStyle={styles.clearBtn}
        />
      </View>

      <Divider style={{ width: "90%", marginVertical: 10 }} />

      <FlatList
        style={styles.list}
        data={list}
        keyExtractor={(it) => String(it.id)}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Feather name="inbox" size={20} color="#9aa0a6" />
            <Text style={styles.emptyText}>No items.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider
      theme={{ lightColors: { primary: "#4f46e5" }, mode: "light" }}
    >
      <ShoppingListScreen />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 56,
    backgroundColor: "#fff",
  },
  title: { marginBottom: 10 },
  inputsRow: { width: "90%", flexDirection: "row", gap: 10 },
  inputContainerHalf: { flex: 1 },
  inputInner: {
    borderBottomWidth: 0,
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  buttonsRow: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
    columnGap: 12,
  },
  primaryBtn: { paddingHorizontal: 18, borderRadius: 10 },
  clearBtn: { paddingHorizontal: 18, borderRadius: 10, borderColor: "#d33" },
  list: { width: "92%", marginTop: 6 },
  listItem: { borderRadius: 12, marginVertical: 6, paddingVertical: 10 },
  itemTitle: { fontSize: 16, fontWeight: "600" },
  itemSubtitle: { color: "#6b7280", marginTop: 2 },
  emptyWrap: { alignItems: "center", marginTop: 24 },
  emptyText: { color: "#777", marginTop: 6 },
});
