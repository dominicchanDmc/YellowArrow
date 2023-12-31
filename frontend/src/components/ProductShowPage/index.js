import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom/cjs/react-router-dom";
import { fetchProduct, getProduct, getProductRatings } from "../../store/productsReducer";
import './ProductShowPage.css'
import { fetchAddToCart, fetchUpdateCartItemQuantity, selectUserCartItems } from "../../store/cartItemsReducer";
import ReviewPart from "../ReviewPart";
import RatingPart from "../RatingPart";
import { getRatingInfo } from "../../utils/ratingUtils";

function ProductShowPage() {
    const { productId } = useParams();
    const product = useSelector(getProduct(productId));
    const ratings = useSelector(getProductRatings(productId));
    const [quantity, setQuantity] = useState(1); 
    const [message, setMessage] = useState({ content: '', visible: false })
    const history = useHistory();
    const dispatch = useDispatch();
    const cartItems = useSelector(selectUserCartItems);
    const sessionUser = useSelector(state => state.session.user);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const location = useLocation();
    const { pathname } = location;
    let ratingInfo,productInfo; 

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    useEffect(() => {
        dispatch(fetchProduct(productId));
    }, [dispatch,productId]);

    const handleAddToCart = () => {
        if (sessionUser){
            const existingCartItem = Object.values(cartItems) ? 
            Object.values(cartItems).find(item => item.productId === product.id):0;
            if (existingCartItem) {
                const updatedQuantity = existingCartItem.quantity + quantity;

                if (updatedQuantity >30){
                    setMessage({ content: 'each product limit of 30 per order!', visible: true });
                    setTimeout(() => {
                    setMessage({ ...message, visible: false });
                    }, 5000);
                    return;
                }
                else
                    dispatch(fetchUpdateCartItemQuantity(existingCartItem.id, updatedQuantity));
            } else {
                dispatch(fetchAddToCart(product.id, quantity));
            }
            setMessage({ content: 'Item Added to Cart', visible: true });
            setTimeout(() => {
            setMessage({ ...message, visible: false });
            }, 2000);
        }
        else {
            history.push('/login');
        }
    };
    const handleThumbnailClick = (index) => {
        setSelectedImageIndex(index);
    };
    
    const handleQuantityChange = (event) => {
        const newQuantity = parseInt(event.target.value);
        setQuantity(newQuantity);
    };
    
    if (product){
        const selectedImageUrl = product.photoUrls && product.photoUrls[selectedImageIndex];
        ratingInfo= getRatingInfo(product);         
        let finalPrice = product.price;
        let priceSpan;
            if (product.discount){
                finalPrice = Number(product.price * (100-product.discount)/100).toFixed(2);
                priceSpan =    (<>
                    <span>
                        <span className="colorRed price-fontSize-mid">
                            {"-"+product.discount +"% "}
                        </span>
                        <span className="colorBlack price-fontSize-large">
                            {"$"+ finalPrice}
                        </span>
                    </span>
                    <span className="price-fontSize-samll">Typical price: <s>{"$"+product.price}</s></span>            
                </>)
            }
            else
            {
                priceSpan =  (
                <span className="colorBlack price-fontSize-large">
                    {"$"+ product.price}
                </span>
                )
            }

        productInfo = (<>
            <section id="product-info" className="bgcolor-white">
                <div className="item-image-parent">
                    <div className="item-list-vertical">
                        {
                           product.photoUrls && (
                                product.photoUrls.map((url,index) => (
                                    <div key={product.id+"-"+index} className="thumb-box"
                                    onClick={() => handleThumbnailClick(index)}>
                                        <img src={url} alt="thumbnail" />
                                    </div>
                                ))
                            ) 
                        }
                    </div>
                    <div className="item-image-main">
                        {product.photoUrls && (
                            <img src={selectedImageUrl} alt="default" />
                        ) }
                    </div>
                </div>

                <div className="item-info-parent">
                    <div className="main-info">
                        <h4>{product.productName}</h4>
                        <div className="star-rating">
                            <span className="price-fontSize-14">{ratingInfo.averageRating} out of 5 stars</span>
                             <div className='star-container'>
                                 <div className="star-widget">
                                <RatingPart averageRating={ratingInfo.averageRating} caller={"show"}/>
                                </div>
                            </div>
                            <span className="price-fontSize-14"> {ratingInfo.totalRatingCount} ratings</span >            
                        </div>
                        <p><span className="showItem-price">{priceSpan}</span></p>
                                
                    </div>

                    <div className="description">
                        <p className="description-fontSize-mid">
                            <b>Product Description</b>
                        </p>
                        <p className="description-fontSize-samll">{product.description}</p>
                    </div>

                </div>
                <div className="item-cart-parent">
                    <div className="item-cart-form"> 
                        <span className="colorBlack price-fontSize-large">
                            {"$"+ finalPrice}
                        </span>                        
                        <span className="colorGrayBlue price-fontSize-14">FREE Returns</span>
                        <span className="colorGrayBlue price-fontSize-14">FREE delivery <strong className="colorBlack">Wednesday, August 23</strong></span>
                        <span className=" price-fontSize-14">Or fastest delivery <strong className="colorBlack">Tomorrow, August 19.</strong></span>
                        <span className="colorGreen price-fontSize-18">In Stock</span>
                        <div>
                            <label htmlFor="quantity">Qty: </label>
                            <select id="quantity" onChange={handleQuantityChange}
                             name="quantity" className="showQuantitySelect" defaultValue={"1"}>
                                <option key="1" value="1">1 </option>
                                {Array.from({ length: 14 }, (_, index) => index + 2).map((qty) => (
                                    <option key={qty} value={qty}>
                                        {qty}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button onClick={handleAddToCart}>Add toCart</button>
                        {message.visible && (
                            <div className="cart-message">
                            <b>{message.content}</b>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>)
    }
    else
        productInfo=""

    let reviewItems;
    if (ratingInfo?.reviewInfo.length > 0) {
        reviewItems = (<>
            <section id="review-section">
                <ReviewPart reviewInfo={ratingInfo.reviewInfo} 
                averageRating={ratingInfo.averageRating}
                totalRatingCount={ratingInfo.totalRatingCount}
                productId={product.id}
                />
                
            </section>
        </>
        );
    }
    return(
        <>
            {productInfo}
            {reviewItems}
        </>
    )
}

export default ProductShowPage 