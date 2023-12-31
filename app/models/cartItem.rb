# == Schema Information
#
# Table name: cart_items
#
#  id         :bigint           not null, primary key
#  quantity   :integer          not null
#  user_id    :bigint           not null
#  product_id :bigint           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class CartItem < ApplicationRecord
    validates :quantity, presence: true
    validates :user_id, uniqueness: {scope: :product_id}

    belongs_to :user

    belongs_to :product

	
	
end
