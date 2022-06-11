# https://gist.github.com/bluefuton/5851093

module MessageBuilderPatch
  def self.included(base)
    base.send(:include, InstanceMethods)
    
    base.class_eval do
      alias_method :message_params_original, :message_params
      alias_method :message_params, :message_params_and_external_values
    end    
  end 
  
  module InstanceMethods
    def message_params_and_external_values
      message_params = message_params_original()
      puts ">>>>>>>>>>>>>>>>>>> overrided message_params adding external_source_id_whatsapp: #{@params[:external_source_id_whatsapp]}"
      message_params =  message_params.merge({external_source_id_whatsapp: @params[:external_source_id_whatsapp]}) if @params[:external_source_id_whatsapp]
      puts ">>>>>>>>>>>>>>>>>>> params: #{message_params}"
      message_params
    end
  end
end


ActiveSupport::Reloader.to_prepare do
  puts "add monkey patch message_builder_patch.........."
  Messages::MessageBuilder.include(MessageBuilderPatch)
  puts "monkey patch message_builder_patch successful!"
end