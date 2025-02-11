import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import DocumentPicker, { DocumentPickerResponse } from "react-native-document-picker";
import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av"; // Import expo-av for audio playback

interface Track {
  id: string;
  name: string;
  uri: string;
  dateAdded: Date;
  artist: string;
  album: string;
}

const AdminPanel: React.FC = () => {
  const [playlist, setPlaylist] = useState<Track[]>([]); // Playlist state
  const [trackInfo, setTrackInfo] = useState<Partial<Track>>({}); // Temporary track info for editing
  const [loading, setLoading] = useState<boolean>(false); // Loading state for uploads
  const [sound, setSound] = useState<Audio.Sound | null>(null); // Audio sound state for playback

  // Function to handle file upload
  const handleUpload = async () => {
    try {
      setLoading(true); // Set loading to true
      const res: DocumentPickerResponse[] = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio], // Allow only audio files
      });

      // Assuming only one file is selected, handle the first item
      const track = res[0];  // Get the first selected file

      const newTrack = {
        id: new Date().getTime().toString(), // Create a unique ID
        name: track.name || "Unknown Track", // Track name
        uri: track.uri, // URI of the selected file
        dateAdded: new Date(), // Current date and time
        artist: "Unknown Artist", // Default artist name
        album: "Unknown Album", // Default album name
      };
      setPlaylist((prev) => [...prev, newTrack]); // Add new track to the playlist
    } catch (err: unknown) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User cancelled the picker.");
      } else {
        Alert.alert("Upload Error", "An error occurred while uploading the track.");
        console.error(err);
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Function to delete a track
  const handleDelete = async (trackId: string) => {
    try {
      const updatedPlaylist = playlist.filter((track) => track.id !== trackId);
      setPlaylist(updatedPlaylist);
      Alert.alert("Deleted", "Track successfully deleted.");
    } catch (err) {
      console.error("Error deleting track", err);
      Alert.alert("Error", "An error occurred while deleting the track.");
    }
  };

  // Function to update track metadata
  const handleUpdate = async () => {
    try {
      if (!trackInfo.artist || !trackInfo.album) {
        Alert.alert("Validation Error", "Artist and Album fields cannot be empty.");
        return;
      }

      if (trackInfo.id) {
        const updatedPlaylist = playlist.map((track) =>
          track.id === trackInfo.id ? { ...track, ...trackInfo } : track
        );
        setPlaylist(updatedPlaylist);
        Alert.alert("Updated", "Track information successfully updated.");
      } else {
        Alert.alert("Error", "No track selected to update.");
      }
    } catch (err) {
      console.error("Error updating track", err);
      Alert.alert("Error", "An error occurred while updating the track.");
    }
  };

  // Function to select a track for editing
  const handleTrackSelect = (track: Track) => {
    setTrackInfo({
      id: track.id,
      artist: track.artist,
      album: track.album,
    });
  };

  // Function to sort playlist by name or date
  const handleSort = async (type: "alphabetical" | "date") => {
    try {
      const sortedPlaylist = [...playlist].sort((a, b) => {
        if (type === "alphabetical") {
          return a.name.localeCompare(b.name);
        } else if (type === "date") {
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        }
        return 0; // Default case
      });
      setPlaylist(sortedPlaylist);
    } catch (err) {
      console.error("Error sorting playlist", err);
    }
  };

  // Function to play a track
  const handlePlay = async (uri: string) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound", error);
    }
  };

  // Function to stop the current track
  const handleStop = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
      }
    } catch (error) {
      console.error("Error stopping sound", error);
    }
  };

  // Render each track
  const renderTrack = ({ item }: { item: Track }) => (
    <View style={styles.trackItem}>
      <Image
        source={{ uri: item.uri || "https://via.placeholder.com/40" }} // Placeholder image
        style={styles.trackIcon}
      />
      <View>
        <Text style={styles.trackName}>{item.name}</Text>
        <Text style={styles.trackDetails}>
          {item.artist} - {item.album}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleTrackSelect(item)}>
        <FontAwesome name="edit" size={20} color="#f02a7f" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <FontAwesome name="trash" size={20} color="#f02a7f" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePlay(item.uri)}>
        <FontAwesome name="play" size={20} color="#f02a7f" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Panel</Text>

      {/* Upload Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload} disabled={loading}>
        <Text style={styles.uploadText}>{loading ? "Uploading..." : "Upload Track"}</Text>
      </TouchableOpacity>

      {/* Sort Options */}
      <View style={styles.sortOptions}>
        <TouchableOpacity onPress={() => handleSort("alphabetical")}>
          <FontAwesome name="sort-alpha-asc" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSort("date")}>
          <FontAwesome name="calendar" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Playlist */}
      <FlatList
        data={playlist}
        keyExtractor={(item) => item.id}
        renderItem={renderTrack}
        ListEmptyComponent={<Text>No tracks in the playlist.</Text>}
      />

      {/* Update Track Metadata */}
      {trackInfo.id && (
        <View style={styles.updateSection}>
          <TextInput
            placeholder="Artist Name"
            style={styles.input}
            value={trackInfo.artist}
            onChangeText={(text) =>
              setTrackInfo((prev) => ({ ...prev, artist: text }))
            }
          />
          <TextInput
            placeholder="Album Name"
            style={styles.input}
            value={trackInfo.album}
            onChangeText={(text) =>
              setTrackInfo((prev) => ({ ...prev, album: text }))
            }
          />
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateText}>Update Track</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f02a7f",
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: "#f02a7f",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  uploadText: {
    color: "#fff",
    fontSize: 16,
  },
  sortOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  trackIcon: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 10,
  },
  trackName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  trackDetails: {
    fontSize: 14,
    color: "#666",
  },
  updateSection: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  updateButton: {
    backgroundColor: "#f02a7f",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  updateText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AdminPanel;
