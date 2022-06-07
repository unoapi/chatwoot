# # https://medium.com/parallel-thinking/monkey-patching-active-record-models-6fe9f8b1afe9

module AddExternalSourceIdsWhatsappToMessage
  def self.included(base)
    
    base.class_eval do
      puts ">>>>>>>>>>>>>>>>>>> overrided external_source_ids adding :whastapp"
      store_accessor :external_source_ids, :whastapp
    end    
  end
end

ActiveSupport::Reloader.to_prepare do
  puts "add monkey patch add_external_source_ids_whatsapp.........."
  Message.include(AddExternalSourceIdsWhatsappToMessage)
  puts "monkey patch add_external_source_ids_whatsapp successfull!"
end