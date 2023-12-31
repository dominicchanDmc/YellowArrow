json.set! @product.id do
    json.partial! 'product', product: @product
    json.photoUrls @product.photos.attached? ? @product.photos.map { |file| file.url } :nil
    
    json.ratings do
        @product.ratings.each do |rating|
            json.set! rating.id do
                json.extract! rating, :id,:reviewer_id,:overall_rating,:review_headline,:review
                # json.overall_rating rating.overall_rating
                json.reviewer do
                    json.set! rating.reviewer.id do
                        json.extract! rating.reviewer, :id, :username,:email          
                    end
                end
            end
        end
    end 
end