class CreateChannelSip < ActiveRecord::Migration[6.1]
  def up
    create_table :channel_sip do |t|
      t.references :account, null: false
      t.string :url, null: false

      t.timestamps
    end
  end
end
