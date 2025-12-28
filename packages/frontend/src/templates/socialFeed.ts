export const socialFeedTemplate = `import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';

const POSTS = [
  { id: 1, user: 'John Doe', avatar: '👨', content: 'Just launched my new app! 🚀', likes: 42, time: '2h ago' },
  { id: 2, user: 'Jane Smith', avatar: '👩', content: 'Beautiful sunset today 🌅', likes: 128, time: '5h ago' },
  { id: 3, user: 'Mike Johnson', avatar: '👨‍💼', content: 'Working on something exciting...', likes: 67, time: '1d ago' },
];

export default function App() {
  const [posts, setPosts] = useState(POSTS);
  const [newPost, setNewPost] = useState('');

  const addPost = () => {
    if (!newPost.trim()) return;
    setPosts([
      { id: Date.now(), user: 'You', avatar: '😊', content: newPost, likes: 0, time: 'Just now' },
      ...posts
    ]);
    setNewPost('');
  };

  const likePost = (id) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📱 Social Feed</Text>
      </View>

      <View style={styles.createPost}>
        <Text style={styles.avatar}>😊</Text>
        <TextInput
          style={styles.input}
          value={newPost}
          onChangeText={setNewPost}
          placeholder="What's on your mind?"
          multiline
        />
        <TouchableOpacity style={styles.postBtn} onPress={addPost}>
          <Text style={styles.postBtnText}>Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.feed}>
        {posts.map(post => (
          <View key={post.id} style={styles.post}>
            <View style={styles.postHeader}>
              <Text style={styles.postAvatar}>{post.avatar}</Text>
              <View style={styles.postInfo}>
                <Text style={styles.postUser}>{post.user}</Text>
                <Text style={styles.postTime}>{post.time}</Text>
              </View>
            </View>
            <Text style={styles.postContent}>{post.content}</Text>
            <View style={styles.postActions}>
              <TouchableOpacity 
                style={styles.likeBtn}
                onPress={() => likePost(post.id)}
              >
                <Text style={styles.likeIcon}>❤️</Text>
                <Text style={styles.likeCount}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentBtn}>
                <Text style={styles.commentIcon}>💬</Text>
                <Text style={styles.commentText}>Comment</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  header: {
    backgroundColor: '#1a1a2e',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  createPost: {
    backgroundColor: '#1a1a2e',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  avatar: {
    fontSize: 32,
  },
  input: {
    flex: 1,
    backgroundColor: '#16213e',
    color: '#fff',
    padding: 12,
    borderRadius: 20,
    fontSize: 14,
  },
  postBtn: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  postBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  feed: {
    flex: 1,
  },
  post: {
    backgroundColor: '#1a1a2e',
    margin: 10,
    padding: 15,
    borderRadius: 15,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  postAvatar: {
    fontSize: 40,
  },
  postInfo: {
    flex: 1,
  },
  postUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  postTime: {
    fontSize: 12,
    color: '#a0a0a0',
  },
  postContent: {
    fontSize: 15,
    color: '#e0e0e0',
    lineHeight: 22,
    marginBottom: 15,
  },
  postActions: {
    flexDirection: 'row',
    gap: 20,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  likeIcon: {
    fontSize: 20,
  },
  likeCount: {
    color: '#fff',
    fontWeight: 'bold',
  },
  commentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  commentIcon: {
    fontSize: 20,
  },
  commentText: {
    color: '#a0a0a0',
  },
});`;
