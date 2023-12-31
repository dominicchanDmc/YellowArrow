class Api::ProductsController < ApplicationController
    def index
        # @products = Product.all.sort { |a,b| b.created_at <=> a.created_at }
        @products = Product.includes(ratings: :reviewer).all

      if params[:search] 
          # @products = @products.where("product_name ILIKE '%#{params[:search]}%'")
          @products = @products.where("product_name ILIKE ?", "%#{params[:search]}%")
      end

      if params[:category].present?
        categories = params[:category]
        @products = @products.where("ARRAY[?] && STRING_TO_ARRAY(categories, ',')", categories)
      end

      if params[:limit_to_five] == 'true'
        @products = @products.limit(5)
      end
    end

    def show
      # @product = Product.find_by(id: params[:id]) 
      @product = Product.includes(ratings: :reviewer).find_by(id: params[:id]) 
      render :show
  end

end
