# == Schema Information
#
# Table name: channel_sip
#
#  id         :bigint           not null, primary key
#  url        :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  account_id :bigint           not null
#
# Indexes
#
#  index_channel_sip_on_account_id  (account_id)
#

class Channel::Sip < ApplicationRecord
  include Channelable

  self.table_name = 'channel_sip'
  EDITABLE_ATTRS = [:url].freeze

  validates :url, length: { maximum: Limits::URL_LENGTH_LIMIT }

  def name
    'Sip'
  end

  def messaging_window_enabled?
    false
  end
end
