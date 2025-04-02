import { React, useState } from "react";
import { Button, Container, Row, Col, ListGroup, Image, Modal, OverlayTrigger, Tooltip, Form, InputGroup  } from "react-bootstrap";

export const Cart = () => {
  
  const [selectedProduct, setSelectedProduct] = useState(null); // Stores the selected product for modal
  const [showModal, setShowModal] = useState(false); // Controls modal visibility
  const [shippingFee, setShippingFee] = useState(16);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sample products
  const products = [
    {
      id: 1,
      name: "Cheeky Bottoms",
      price: 55,
      discountPrice: 55,
      imageUrl: "../../images/chk-btm.jpg",
      variants: ["../../images/chk-btm.jpg", "../../images/chk-btm2.jpg"],
      stock: 10,
    },
    {
      id: 2,
      name: "Cheeky Bottoms",
      price: 55,
      discountPrice: 55,
      imageUrl: "../../images/chk-btm3.jpg",
      variants: ["../../images/chk-btm3.jpg", "../../images/chk-btm4.jpg"],
      stock: 4,
    },
    {
      id: 3,
      name: "Cheeky Bottoms",
      price: 55,
      discountPrice: null,
      imageUrl: "../../images/chk-btm5.jpg",
      variants: ["../../images/chk-btm5.jpg", "../../images/chk-btm6.jpg"],
      stock: 3,
    },
    {
      id: 4,
      name: "Cheeky Bottoms",
      price: 55,
      discountPrice: null,
      imageUrl: "../../images/chk-btm7.jpg",
      variants: ["../../images/chk-btm7.jpg", "../../images/chk-btm8.jpg"],
      stock: 9,
    },
    {
      id: 5,
      name: "Cheeky Bottoms",
      price: 55,
      discountPrice: 55,
      imageUrl: "../../images/chk-btm10.jpg",
      variants: ["../../images/chk-btm9.jpg", "../../images/chk-btm10.jpg"],
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

  const addItemQuantity = (product) => {
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

  const removeItemFromCart = (product) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== product.id));
  };

  const handleShippingChange = (event) => {
    const selectedValue = event.target.value;
    setShippingFee(selectedValue === "1" ? 16 : 15);
  };

  // Apply coupon
  const applyCoupon = () => {
    if (coupon === "BBSWIMPH2025") {
      setCouponApplied(true);
      setErrorMessage('');
    } else {
      setCouponApplied(false);
      setErrorMessage('Sorry, but this coupon doesn\'t exist.');
    }
  };

  // Calculate total cost
  const calculateTotal = () => {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = couponApplied ? 0.2 * subtotal : 0;
    const discountedTotal = subtotal - discount;
  
    // Free shipping applies only if discountedTotal is $500 or more
    const shipping = discountedTotal >= 500 ? 0 : 16;
  
    return { 
      subtotal, 
      discount, 
      finalTotal: discountedTotal, 
      shipping, 
      total: discountedTotal + shipping 
    };
  };

  return (
    <Container className="cart-container">
      <Row>
        <h1>Cart</h1>
      </Row>
      <Row>
        <Col className="list-group-container">
          <h3>Cart Items</h3>
          {cart.length === 0 ? (
            <p>No items in cart</p>
          ) : (
            <ListGroup className="shadow-sm">
              {cart.map((item) => (
                <ListGroup.Item key={item.id} className="d-flex align-items-center justify-content-between p-4">
                  
                  {/* Product Image and Name */}
                  <div 
                    onClick={() => handleShowModal(item)} 
                    className="d-flex align-items-center flex-grow-1" 
                    style={{ cursor: "pointer" }}
                  >
                    <Image 
                      src={item.imageUrl} 
                      alt={item.name} 
                      width={72} 
                      height={108} 
                      className="me-3"
                    />
                    <strong>{item.name}</strong>
                  </div>

                  {/* Quantity and Price Controls */}
                  <span className="d-flex align-items-center">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => decreaseItemQuantity(item)} 
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    
                    <span>{item.quantity}</span>

                    {item.quantity >= item.stock ? (
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-${item.id}`}>Insufficient stock</Tooltip>}
                      >
                        <span>
                          <Button 
                            variant="outline-secondary" 
                            disabled 
                            className="ms-2"
                          >
                            +
                          </Button>
                        </span>
                      </OverlayTrigger>
                    ) : (
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => addItemQuantity(item)} 
                        className="ms-2"
                      >
                        +
                      </Button>
                    )}
                  </span>

                  {/* Price Section */}
                  <div className="text-end ms-3">
                    {item.discountPrice ? (
                      <>
                        <span className="text-muted text-decoration-line-through">${item.price}</span>
                        <strong className="ms-2">${item.discountPrice}</strong>
                      </>
                    ) : (
                      <strong>${item.price}</strong>
                    )}
                  </div>

                  {/* Wishlist and Remove Actions */}
                  <div className="d-flex align-items-center">
                    <div className="ms-3 d-flex align-items-center" style={{ cursor: "pointer" }}>
                      <Image 
                        src="../../icons/heart.png"
                        alt="heart"
                        width={16}
                        height={16}
                      />
                      <p className="wishlist ms-2">Save to Wishlist</p>
                    </div>

                    <div className="d-flex align-items-center">
                      <span className="me-3 ms-3">|</span>
                    </div>

                    <div className="d-flex align-items-center" style={{ cursor: "pointer" }} onClick={() => removeItemFromCart(item)}>
                      <Image 
                        src="../../icons/trash.png"
                        alt="trash"
                        width={16}
                        height={16}
                      />
                      <span className="ms-1">Remove</span>
                    </div>
                  </div>

                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col className="order-container">
          <Row className="shipping-fee-container ps-3 pe-3">
            <p style={{ fontSize: "18px",  }}>ESTIMATED SHIPPING FEE </p>
            <p style={{ fontSize: "14px" }}>Shipping via:</p>

            <div className="d-flex align-items-center mb-2">
              <Form.Select onChange={handleShippingChange}>
                <option value="1">DHL International Shipping</option>
                <option value="2">FedEx</option>
              </Form.Select>
            </div>

            <p style={{ fontSize: "14px"}}>Fee:</p>

            <InputGroup className="mt-1">
              <Form.Control
                value={`$${shippingFee}`}
                readOnly 
              />
            </InputGroup>
            <p style={{fontSize: "14px" }}>Shipping fees may vary based on your address. The final cost will be confirmed at checkout if this shipping method is available in your location.</p>
          </Row>

          <Row className="order-fee-container ps-3 pe-3">
            <div>
              <p style={{ fontSize: "18px"}}>ORDER SUMMARY</p>
              <p style={{ fontSize: "16px"}}>Discount</p>
            </div>

            <div>
              <div className="d-flex justify-content-between">
                <InputGroup className="mb-3 me-3">
                  <Form.Control
                    text="text"
                    placeholder="Enter discount code or gift card"
                    onChange={(e) => setCoupon(e.target.value)}
                    value={coupon}
                  />
                </InputGroup>
                <Button size="sm" onClick={applyCoupon}>Apply</Button>
              </div>

              <div className="d-flex justify-content-between">
                <p style={{ fontSize: "16px",  }}>Subtotal </p>
                <p style={{ fontSize: "16px",  }}>${calculateTotal().subtotal.toFixed(2)}</p>
              </div>

              <div className="d-flex justify-content-between">
                <p style={{ fontSize: "16px" }}>Shipping Fee</p>
                <p style={{ fontSize: "16px" }}>${calculateTotal().shipping}</p>
              </div>

              <div className="border-top my-3" style={{ borderWidth: "8px" }}></div>

              <div className="d-flex justify-content-between">
                <p style={{ fontSize: "24px" }}>ESTIMATED TOTAL</p>
                <p style={{ fontSize: "24px" }}>${calculateTotal().total.toFixed(2)}</p>
              </div>

            </div>
          </Row>
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
            </Modal.Body>
          </>
        )}
      </Modal>
    </Container>
  );
};
