import { React, useState } from "react";
import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";

export const Cart = () => {
  const [cart, setCart] = useState([]);

  // Sample products
  const products = [
    {
      id: 1,
      name: "Cheeky Bottoms",
      price: 55,
      imageUrl: "",
      stock: 10,
    },
    {
      id: 2,
      name: "Bikini Top",
      price: 55,
      imageUrl: "",
      stock: 10,
    },
    {
      id: 3,
      name: "Swimsuit",
      price: 55,
      imageUrl: "",
      stock: 10,
    },
    {
      id: 4,
      name: "Swimsuit",
      price: 55,
      imageUrl: "",
      stock: 10,
    },
    {
      id: 5,
      name: "Swimsuit",
      price: 55,
      imageUrl: "",
      stock: 10,
    },
  ];

  // Add item to cart function
  const addItemToCart = (product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);

      if (existingIndex !== -1) {
        // Update quantity if item already exists
        const updatedCart = [...prevCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + 1,
        };
        return updatedCart;
      } else {
        // Add new item to cart
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  return (
    <Container className="cart-container">
      <Row>
        <h1>Cart</h1>
        <h3>Products</h3>
      </Row>
      <Row className="row-add-items">
        {products.map((product) => (
          <Col key={product.id}>
            <h5>{product.name}</h5>
            <p>${product.price}</p>
            <Button onClick={() => addItemToCart(product)} variant="primary">
              Add Item
            </Button>
          </Col>
        ))}
      </Row>
      <Row>
        <Col>
          <h3>Cart Items</h3>
          {cart.length === 0 ? (
            <p>No items in cart</p>
          ) : (
            <ListGroup>
              {cart.map((item) => (
                <ListGroup.Item key={item.id}>
                  <strong>{item.name}</strong> - ${item.price} x {item.quantity}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );
};
