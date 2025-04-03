import { React, useState } from "react";
import { Button, Container, Row, Col, ListGroup, Image, Modal, OverlayTrigger, Tooltip, Form, InputGroup  } from "react-bootstrap";

export const Cart = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [showModal, setShowModal] = useState(false); 
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [shippingFee, setShippingFee] = useState(16);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [itemToRemove, setItemToRemove] = useState(null);
  const [wishlist, setWishlist] = useState([]);

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

  const handleSelectItem = (itemId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]); // Deselect all
    } else {
      setSelectedItems(cart.map((item) => item.id)); // Select all
    }
  };

  //Show details of the item
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

  const toggleWishlist = (item) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(item.id)
        ? prevWishlist.filter((id) => id !== item.id) 
        : [...prevWishlist, item.id] 
    );
  };

  //Removing of item with confirmation functions
  const handleRemoveClick = (item) => {
    setItemToRemove(item);
    setShowConfirmModal(true);
  };
  
  const confirmRemoveItem = () => {
    if (itemToRemove) {
      removeItemFromCart(itemToRemove);
      setShowConfirmModal(false);
      setItemToRemove(null);
    }
  };
  
  const cancelRemove = () => {
    setShowConfirmModal(false);
    setItemToRemove(null);
  };

  const removeItemFromCart = (product) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== product.id));
  };

  //Shipping Fee
  const handleShippingChange = (event) => {
    const selectedValue = event.target.value;
    setShippingFee(selectedValue === "1" ? 16 : 15);
  };

  // Apply coupon
  const applyCoupon = () => {
    if (!coupon.trim()) {
      setErrorMessage("Please enter a valid code.");
      setCouponApplied(false);
    } else if (coupon === "BBSWIMPH2025") {
      setCouponApplied(true);
      setErrorMessage("");
    } else {
      setCouponApplied(false);
      setErrorMessage("Sorry, but this coupon doesn't exist.");
    }
  };

  // Calculate total cost
  const calculateTotal = () => {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = couponApplied ? 0.2 * subtotal : 0;
    const discountedTotal = subtotal - discount;
  
    // Free shipping applies only if discountedTotal is $500 or more
    const finalShippingFee = discountedTotal >= 500 ? 0 : shippingFee;

    return { 
      subtotal, 
      discount, 
      finalTotal: discountedTotal, 
      shipping: finalShippingFee, 
      total: discountedTotal + finalShippingFee
    };
  };

  return (
    <Container className="cart-container">
      <Row>
        <h1>Cart</h1>
      </Row>

      {/* Cart Items Column */}
      <Row>
        <Col xs={12} md={8} lg={8} className="list-group-container">
        <div className="d-flex align-items-center">
          <input
            type="checkbox"
            checked={selectedItems.length === cart.length && cart.length > 0}
            onChange={handleSelectAll}
          />
          <h3 className="ms-2">All Items ({cart.length})</h3>
        </div>
          {cart.length === 0 ? (
            <p>No items in cart</p>
          ) : (
            <ListGroup className="shadow-sm">
              {cart.map((item) => (
                <ListGroup.Item key={item.id} className="p-4">
                <div className="d-flex align-items-row">
                  <div>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="me-3"
                    />

                    {/* Product Image and Name */}
                    <Image 
                      style={{ cursor: "pointer" }}
                      src={item.imageUrl} 
                      alt={item.name} 
                      width={72} 
                      height={108} 
                      onClick={() => handleShowModal(item)} 
                      className="me-3"
                    />
                  </div>

                  <div>
                    <div className="d-flex align-items-left">
                      <p 
                          onClick={() => handleShowModal(item)} 
                          style={{ cursor: "pointer" }}
                          className="mb-0"
                        >
                          {item.name}
                      </p>
                    </div>

                    {/* Quantity and Price - Spread Apart */}
                    <div className="d-flex justify-content-between">
                      <div className="d-flex">
                        <Image
                          style={{ cursor: "pointer" }}
                          src={'../../icons/minus.png'}
                          alt={'minus'}
                          width={24}
                          height={24}
                          onClick={() => decreaseItemQuantity(item)}
                          disabled={item.quantity <= 1}
                        />
                        <span className="mx-2">{item.quantity}</span>

                        {item.quantity >= item.stock ? (
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id={`tooltip-${item.id}`}>Insufficient stock</Tooltip>}
                          >
                            <span>
                              <Image
                                style={{ cursor: "pointer", opacity: '0.3' }}
                                src={'../../icons/plus.png'}
                                alt={'plus'}
                                width={24}
                                height={24}
                              />
                            </span>
                          </OverlayTrigger>
                        ) : (
                          <Image
                            style={{ cursor: "pointer" }}
                            src={'../../icons/plus.png'}
                            alt={'plus'}
                            width={24}
                            height={24}
                            onClick={() => addItemQuantity(item)}
                          />
                        )}
                      </div>
                      
                      {/* Price */}
                      <div className="d-flex align-items-right">
                        {item.discountPrice ? (
                          <>
                            <span className="text-muted text-decoration-line-through">${item.price}</span>
                            <strong className="ms-2">${item.discountPrice}</strong>
                          </>
                        ) : (
                          <strong>${item.price}</strong>
                        )}
                      </div>
                    </div>
                    
                    {/* Wishlist and Remove Actions */}
                    <div className="d-flex align-items-right gap-3 mt-5">
                      <div 
                        className="d-flex align-items-center" 
                        style={{ cursor: "pointer" }} 
                        onClick={() => toggleWishlist(item)}
                      >
                        <Image 
                          src={wishlist.includes(item.id) ? "../../icons/redheart.png" : "../../icons/heart.png"}
                          alt="heart"
                          width={16}
                          height={16}
                        />
                        <p className="wishlist ms-2 mb-0">
                          {wishlist.includes(item.id) ? "Added to Wishlist" : "Save to Wishlist"}
                        </p>
                      </div>

                      {/* Separator */}
                      <span className="border-start ps-3"></span>

                      {/* Remove Section */}
                      <div 
                        className="d-flex align-items-center" 
                        style={{ cursor: "pointer" }} 
                        onClick={() => handleRemoveClick(item)}
                      >
                        <Image 
                          src="../../icons/trash.png"
                          alt="trash"
                          width={16}
                          height={16}
                        />
                        <span className="ms-2">Remove</span>
                      </div>
                    </div>

                  </div>
                </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        {/* Order Summary Column */}
        <Col xs={12} md={4} lg={4} className="order-container">
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
                    type="text"
                    placeholder="Enter discount code or gift card"
                    onChange={(e) => setCoupon(e.target.value)}
                    value={coupon}
                  />
                </InputGroup>
                <Button size="sm" onClick={applyCoupon}>Apply</Button>
              </div>

              {/* Error message */}
              {errorMessage && <p className="text-danger">{errorMessage}</p>}

              {/* Applied Coupon Tag */}
              {couponApplied && (
                <div className="alert alert-success p-2">
                  Coupon <strong>{coupon}</strong> applied!
                </div>
              )}

              <div className="d-flex justify-content-between">
                <p style={{ fontSize: "16px",  }}>Subtotal </p>
                <p style={{ fontSize: "16px",  }}>${calculateTotal().subtotal.toFixed(2)}</p>
              </div>

              <div className="d-flex justify-content-between">
                <p style={{ fontSize: "16px" }}>Shipping Fee</p>
                <p style={{ fontSize: "16px" }}>${calculateTotal().shipping}</p>
              </div>

              <div className="flex-grow-1 border-top"></div>

              <div className="d-flex justify-content-between">
                <p style={{ fontSize: "24px" }}>ESTIMATED TOTAL</p>
                <p style={{ fontSize: "24px" }}>${calculateTotal().total.toFixed(2)}</p>
              </div>

              <div className="d-flex flex-column align-items-center w-100">
                {/* Checkout Button */}
                <Button className="w-100 mb-3" disabled={!termsChecked}>Checkout Now</Button>

                {/* Divider with Text */}
                <div className="d-flex align-items-center w-100">
                  <div className="flex-grow-1 border-top"></div>
                  <p className="mx-2 my-0" style={{ fontSize: "12px" }}>OR EXPRESS TOTAL</p>
                  <div className="flex-grow-1 border-top"></div>
                </div>

                {/* PayPal Button */}
                <Button className="w-100 mt-3" variant="warning" disabled={!termsChecked}>Paypal</Button>
              </div>

              <div className="d-flex align-items-center">
                <Form.Check 
                  label="I agree to the Terms & Conditions and Privacy Policy" 
                  checked={termsChecked} 
                  onChange={() => 
                  setTermsChecked(!termsChecked)}/>
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
      
      {/* Confirmation Delete Modal */}
      <Modal show={showConfirmModal} onHide={cancelRemove} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Removal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove <strong>{itemToRemove?.name}</strong> from your cart?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelRemove}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmRemoveItem}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
