export const ecommerceTemplate = `import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';

const PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', price: 99, emoji: '🎧', rating: 4.5 },
  { id: 2, name: 'Smart Watch', price: 299, emoji: '⌚', rating: 4.8 },
  { id: 3, name: 'Laptop Stand', price: 49, emoji: '💻', rating: 4.3 },
  { id: 4, name: 'Phone Case', price: 19, emoji: '📱', rating: 4.6 },
  { id: 5, name: 'USB-C Cable', price: 15, emoji: '🔌', rating: 4.4 },
  { id: 6, name: 'Keyboard', price: 129, emoji: '⌨️', rating: 4.7 },
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const filteredProducts = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🛍️ Shop</Text>
        <View style={styles.cartBadge}>
          <Text style={styles.cartCount}>{cart.length}</Text>
        </View>
      </View>

      <TextInput
        style={styles.searchBar}
        value={search}
        onChangeText={setSearch}
        placeholder="Search products..."
      />

      <ScrollView style={styles.products}>
        {filteredProducts.map(product => {
          const inCart = cart.filter(item => item.id === product.id).length;
          return (
            <View key={product.id} style={styles.productCard}>
              <Text style={styles.productEmoji}>{product.emoji}</Text>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>\${product.price}</Text>
                <Text style={styles.productRating}>⭐ {product.rating}</Text>
              </View>
              <View style={styles.productActions}>
                {inCart > 0 && (
                  <TouchableOpacity 
                    style={styles.removeBtn}
                    onPress={() => removeFromCart(product.id)}
                  >
                    <Text style={styles.btnText}>-</Text>
                  </TouchableOpacity>
                )}
                {inCart > 0 && (
                  <Text style={styles.quantity}>{inCart}</Text>
                )}
                <TouchableOpacity 
                  style={styles.addBtn}
                  onPress={() => addToCart(product)}
                >
                  <Text style={styles.btnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {cart.length > 0 && (
        <View style={styles.cartSummary}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>\${total}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn}>
            <Text style={styles.checkoutText}>Checkout ({cart.length} items)</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  cartBadge: {
    backgroundColor: '#e94560',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCount: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchBar: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    fontSize: 16,
  },
  products: {
    flex: 1,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    margin: 10,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    gap: 15,
  },
  productEmoji: {
    fontSize: 50,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    color: '#4ECDC4',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productRating: {
    fontSize: 12,
    color: '#a0a0a0',
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addBtn: {
    backgroundColor: '#4ECDC4',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtn: {
    backgroundColor: '#e94560',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantity: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartSummary: {
    backgroundColor: '#1a1a2e',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2a2a3e',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 18,
    color: '#a0a0a0',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  checkoutBtn: {
    backgroundColor: '#4ECDC4',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});`;
