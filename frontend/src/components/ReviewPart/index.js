import RatingPart from '../RatingPart'
import ReviewItem from '../ReviewItem';
import './ReviewPart.css'
function ReviewPart(props) {
    const {reviewInfo,averageRating,totalRatingCount} = props;
    return (<>
            <div className="review-rating">
                {totalRatingCount> 0 ? (
                    <div className="rating-box">
                        <RatingPart averageRating={averageRating} caller={"review"} />
                        <span>{totalRatingCount} <span>global ratings</span></span>
                        <div className="rating-number">{averageRating} out of 5 stars</div>
                    </div>
                ):null}            
            </div>
            <div className="review-review">
                <h1><span>Customer reviews</span></h1>
                {reviewInfo.map(reviewItem => (
                    <div key={reviewItem.id}>
                        <ReviewItem reviewItem={reviewItem}/>
                    </div>
                ))}
            </div>
    </>
    )
}

export default ReviewPart