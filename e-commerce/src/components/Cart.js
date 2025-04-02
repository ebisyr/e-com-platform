import { React, useState } from "react";
import { Button, Container, Row, Col, ListGroup, Image, Modal, OverlayTrigger, Tooltip  } from "react-bootstrap";

export const Cart = () => {
  
  const [selectedProduct, setSelectedProduct] = useState(null); // Stores the selected product for modal
  const [showModal, setShowModal] = useState(false); // Controls modal visibility

  // Sample products
  const products = [
    {
      id: 1,
      name: "Cheeky Bottoms",
      price: 55,
      discountPrice: 55,
      imageUrl: "../../images/cheeky-bottoms.jpg",
      variants: ["../../images/cheeky-bottoms.jpg", "../../images/cheeky-bottoms2.jpg"],
      stock: 10,
    },
    {
      id: 2,
      name: "Cheeky Bottoms",
      price: 55,
      discountPrice: 55,
      imageUrl: "../../images/cheeky-bottoms3.jpg",
      variants: ["../../images/cheeky-bottoms3.jpg", "../../images/cheeky-bottoms4.jpg"],
      stock: 4,
    },
    {
      id: 3,
      name: "Cheeky Bottoms",
      price: 55,
      discountPrice: null,
      imageUrl: "../../images/cheeky-bottoms5.jpg",
      variants: ["../../images/cheeky-bottoms5.jpg", "../../images/cheeky-bottoms6.jpg"],
      stock: 3,
    },
    {
      id: 4,
      name: "Cheeky Bottoms",
      price: 55,
      discountPrice: null,
      imageUrl: "../../images/cheeky-bottoms7.jpg",
      variants: ["../../images/cheeky-bottoms7.jpg", "../../images/cheeky-bottoms8.jpg"],
      stock: 9,
    },
    {
      id: 5,
      name: "Cheeky Bottoms",
      price: 55,
      discountPrice: 55,
      imageUrl: "../../images/cheeky-bottoms10.jpg",
      variants: ["../../images/cheeky-bottoms9.jpg", "../../images/cheeky-bottoms10.jpg"],
      stock: 7,
    },
  ];

  // Open modal when product is clicked
  const handleShowModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Initialize cart with all products, each with quantity: 1
  const [cart, setCart] = useState(products.map((product) => ({ ...product, quantity: 1 })));

  const addItemToCart = (product) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === product.id && item.quantity < product.stock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      return updatedCart;
    });
  };

  const decreaseItemQuantity  = (product) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === product.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      return updatedCart;
    });
  };

  return (
    <Container className="cart-container">
      <Row>
        <h1>Cart</h1>
      </Row>
      <Row>
        <Col>
          <h3>Cart Items</h3>
          {cart.length === 0 ? (
            <p>No items in cart</p>
          ) : (
            <ListGroup>
              {cart.map((item) => (
                <ListGroup.Item key={item.id} className="d-flex align-items-center">
                  <div 
                    onClick={() => handleShowModal(item)} 
                    className="d-flex align-items-center" 
                    style={{ cursor: "pointer" }}
                  >
                    <Image 
                      src={item.imageUrl} 
                      alt={item.name} 
                      width={80} 
                      height={80} 
                      rounded 
                      className="me-3"
                    />
                  <strong>{item.name}</strong>
                  </div>
                  <span className="ms-auto">
                    <Button onClick={() => decreaseItemQuantity(item)} disabled={item.quantity <= 1}>-</Button>
                    {item.quantity}
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-${item.id}`}>
                          {item.quantity >= item.stock ? "Insufficient stock" : ""}
                        </Tooltip>
                      }
                    >
                      <Button
                        onClick={() => addItemToCart(item)}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </Button>
                    </OverlayTrigger>
                      {item.discountPrice ? (
                        <>
                          <span style={{ textDecoration: "line-through", color: "gray" }}>
                            ${item.price}
                          </span>
                          {" "}<strong>${item.discountPrice}</strong>
                        </>
                      ) : (
                        <strong>${item.price}</strong>
                      )}
                  </span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>

      {/* Product Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        {selectedProduct && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedProduct.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <Row className="justify-content-center">
                {selectedProduct.variants.map((variant, index) => (
                  <Col key={index} xs={4} className="text-center">
                    <Image src={variant} alt="Variant" className="img-fluid" rounded />
                  </Col>
                ))}
              </Row>
              <p className="mt-3">Price: ${selectedProduct.price}</p>
              <Button onClick={() => addItemToCart(selectedProduct)} variant="primary">
                Add to Cart
              </Button>
            </Modal.Body>
          </>
        )}
      </Modal>
    </Container>
  );
};
