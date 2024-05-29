class AddDataToInboxMember < ActiveRecord::Migration[6.1]
  def up
    add_column :inbox_members, :data, :json, default: {}
  end
end
