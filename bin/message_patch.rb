# # https://medium.com/parallel-thinking/monkey-patching-active-record-models-6fe9f8b1afe9

module MessagePatch
  def self.included(base)
    
    base.class_eval do
      puts ">>>>>>>>>>>>>>>>>>> overrided external_source_ids adding :whatsapp"
      store_accessor :external_source_ids, :whatsapp, prefix: :external_source_id
    end    
  end
end

ActiveSupport::Reloader.to_prepare do
  puts "add monkey patch message_patch.........."
  Message.include(MessagePatch)
  puts "monkey patch message_patch successful!"
end