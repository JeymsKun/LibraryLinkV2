import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { IconButton } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";
import { AntDesign } from "@expo/vector-icons";

const UserBrowse = () => {
  const { user } = useAuth();
  const userId = user?.user_id;

  const [genres, setGenres] = useState([]);
  const [booksByGenre, setBooksByGenre] = useState({});
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [favoriteBooks, setFavoriteBooks] = useState([]);

  const fetchFavoriteBooks = useCallback(async () => {
    const { data, error } = await supabase
      .from("favorites")
      .select("*, books(*)")
      .eq("user_id", userId);

    if (error) return;

    const resolved = await Promise.all(
      data.map(async ({ books }) => {
        const { data: urlData } = supabase.storage
          .from("library")
          .getPublicUrl(books.cover_image_url.trim());
        return {
          ...books,
          coverUrl: urlData.publicUrl,
        };
      })
    );
    setFavoriteBooks(resolved);
  }, [userId]);

  useEffect(() => {
    if (userId) fetchFavoriteBooks();
    else setFavoriteBooks([]);
  }, [userId]);

  useEffect(() => {
    const fetchGenres = async () => {
      const { data, error } = await supabase
        .from("genres")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data) {
        setGenres(data);
        fetchBooksForGenres(data);
      }
    };
    fetchGenres();
  }, []);

  const fetchBooksForGenres = async (genreList) => {
    setLoading(true);
    const result = {};

    for (const genre of genreList) {
      const { data, error } = await supabase
        .from("book_genres")
        .select("books:books_id(title, author, books_id, cover_image_url)")
        .eq("genre_id", genre.genre_id);

      if (!error && data) {
        const booksWithUrls = data.map((d) => {
          const book = d.books;
          const { data: publicUrlData } = supabase.storage
            .from("library")
            .getPublicUrl(book.cover_image_url);
          return {
            ...book,
            cover_image_url: publicUrlData.publicUrl,
          };
        });
        result[genre.name] = booksWithUrls;
      }
    }

    setBooksByGenre(result);
    setLoading(false);
  };

  const handleBookClick = async (bookId) => {
    if (!userId || !bookId) return;

    const { data: existing, error: checkError } = await supabase
      .from("user_library")
      .select("user_library_id")
      .eq("user_id", userId)
      .eq("books_id", bookId)
      .single();

    if (!existing) {
      await supabase
        .from("user_library")
        .insert([{ user_id: userId, books_id: bookId }]);
    }

    onBookClick(bookId);
  };

  const filteredGenres = selectedGenre
    ? genres.filter((g) => g.name === selectedGenre)
    : genres;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search a book"
          style={styles.input}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <IconButton
          icon="magnify"
          size={24}
          onPress={() => setSelectedGenre("")}
        />
      </View>

      <RNPickerSelect
        onValueChange={setSelectedGenre}
        placeholder={{ label: "All Genres", value: "" }}
        items={genres.map((g) => ({ label: g.name, value: g.name }))}
        style={pickerSelectStyles}
      />

      {filteredGenres.map((genre) => {
        const books = booksByGenre[genre.name] || [];

        return (
          <View key={genre.genre_id} style={styles.genreSection}>
            <Text style={styles.genreTitle}>{genre.name}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {loading ? (
                <ActivityIndicator size="large" />
              ) : (
                books
                  .filter(
                    (book) =>
                      book.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      book.author
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((book) => (
                    <TouchableOpacity
                      key={book.books_id}
                      style={styles.bookCard}
                      onPress={() => handleBookClick(book.books_id)}
                    >
                      <Image
                        source={{ uri: book.cover_image_url }}
                        style={styles.bookImage}
                      />
                      <Text style={styles.bookTitle} numberOfLines={1}>
                        {book.title}
                      </Text>
                      <Text style={styles.bookAuthor} numberOfLines={1}>
                        {book.author}
                      </Text>
                    </TouchableOpacity>
                  ))
              )}
            </ScrollView>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#e6f4fb",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
  },
  genreSection: {
    marginBottom: 24,
  },
  genreTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  bookCard: {
    width: 120,
    marginRight: 12,
    backgroundColor: "#cce6f9",
    borderRadius: 8,
    padding: 6,
    alignItems: "center",
  },
  bookImage: {
    width: "100%",
    height: 160,
    borderRadius: 6,
    backgroundColor: "#ccc",
  },
  bookTitle: {
    fontWeight: "bold",
    marginTop: 4,
    fontSize: 12,
  },
  bookAuthor: {
    color: "#555",
    fontSize: 11,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "black",
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "black",
    marginBottom: 20,
    backgroundColor: "#fff",
  },
};

export default UserBrowse;
