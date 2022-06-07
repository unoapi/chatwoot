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
    def message_params_and_external_values(user_headers)
      params = message_params_original(user_headers)
      puts ">>>>>>>>>>>>>>>>>>> overrided message_params adding external_source_id_whatsapp: #{@params[:external_source_id_whatsapp]} and external_created_at: #{@params[:external_created_at]}"
      params.merge({external_source_id_whatsapp: @params[:external_source_id_whatsapp]}) if @params[:external_source_id_whatsapp]
      params.merge({external_created_at: @params[:external_created_at]}) if @params[:external_created_at]
    end
  end
end


ActiveSupport::Reloader.to_prepare do
  puts "add monkey patch message_builder_patch.........."
  Messages::MessageBuilder.include(MessageBuilderPatch)
  puts "monkey patch message_builder_patch successfull!"
end