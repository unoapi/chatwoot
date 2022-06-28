# https://gist.github.com/bluefuton/5851093

module MessagesControllerPatch
  def self.included(base)
    base.send(:include, InstanceMethods)
    
    base.class_eval do
      alias_method :message_update_params, :message_update_params_external_source
    end    
  end 
  
  module InstanceMethods
    def message_update_params_external_source
      puts ">>>>>>>>>>>>>>>>>>> overrided message_update_params adding external_source_id_whatsapp and external_created_at"
      update_params = params.permit(:external_source_id_whatsapp, :external_created_at, :status, submitted_values: [:name, :title, :value])
      puts ">>>>>>>>>>>>>>>>>>> overrided updatind data #{update_params}"
      return update_params
    end
  end
end


ActiveSupport::Reloader.to_prepare do
  puts "add monkey patch messages_controller_patch.........."
  Public::Api::V1::Inboxes::MessagesController.include(MessagesControllerPatch)
  puts "monkey patch messages_controller_patch successful!"
end