import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React, { useContext, useState } from "react";
import { MyBooksContext } from "../context/MyBooksProvider";
import Colors from "../constants/Colors";

type BookItemProps = {
  book: Book;
};

const BookItem = ({ book }: BookItemProps) => {
  const { isBookSaved,addBookToggle } = useContext(MyBooksContext);
  const saved = isBookSaved(book);
  return (
    <Pressable style={styles.container} onPress={()=>alert("Booked Clicked")}>
      <Image source={{ uri: book.image }} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{book.title}</Text>
        <Text>by {book.authors?.join(", ")}</Text>
        <Pressable
          style={[styles.button, saved ? { backgroundColor: 'lightgray' } : {}]}
          onPress={() => addBookToggle(book)}>
          <Text style={styles.buttonText}>{saved ? 'Remove' : 'Want to Read'}</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 10,
  },
  image: {
    flex: 1,
    aspectRatio: 3 / 4,
    marginRight: 10,
  },
  contentContainer: {
    flex: 4,
    borderColor: "lightgray",
    borderBottomWidth: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  button:{
    backgroundColor:Colors.light.tint,
    alignSelf:'flex-start',
    marginTop:19,
    marginVertical:18,
    padding:7,
    paddingHorizontal:15,
    borderRadius:5
  },
  buttonText:{
    color:'white',
    fontWeight:'600'
  }
});

export default BookItem;