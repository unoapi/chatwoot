# https://gist.github.com/bluefuton/5851093

module MessageBuilderPatch
  def self.included(base)
    base.send(:include, InstanceMethods)
    
    base.class_eval do
      alias_method :message_params_original, :message_params
      alias_method :message_params, :message_params_and_external_values

      alias_method :sender_original, :sender
      alias_method :sender, :sender_group_incoming
    end    
  end 
  
  module InstanceMethods
    def message_params_and_external_values
      puts ">>>>>>>>>>>>>>>>>>> verify '#{@params[:status]}' not exist #{@message_type} is 'outgoing' and #{@params[:action]} is 'create'"
      @params[:status] = :progress if !@params[:status] && @message_type == 'outgoing' &&  @params[:action] == 'create'
      message_params = message_params_original()
      puts ">>>>>>>>>>>>>>>>>>> overrided message_params adding source_id: #{@params[:source_id]} and external_source_id_whatsapp: #{@params[:external_source_id_whatsapp]} and status: #{@params[:status]}"
      message_params =  message_params.merge({external_source_id_whatsapp: @params[:external_source_id_whatsapp]}) if @params[:external_source_id_whatsapp]
      message_params =  message_params.merge({source_id: @params[:source_id]}) if @params[:source_id]
      message_params =  message_params.merge({status: @params[:status]}) if @params[:status]
      puts ">>>>>>>>>>>>>>>>>>> params: #{message_params}"
      message_params
    end

    def sender_group_incoming
      puts ">>>>>>>>>>>>>>>>>>> overrided sender"
      group_incoming?() ? contact_sender() : sender_original()
    end

    def contact_sender
      puts ">>>>>>>>>>>>>>>>>>> find contact by id #{@params[:sender_id]}"
      Contact.find_by(id: @params[:sender_id])
    end

    def group_incoming?
      mt = message_type()
      puts ">>>>>>>>>>>>>>>>>>> verify #{mt} is 'incoming' and #{@conversation.contact.email} contains '@g.us'"
      mt == 'incoming' && @conversation.contact.email.present? && @conversation.contact.email.include?('@g.us')
    end
  end
end


ActiveSupport::Reloader.to_prepare do
  puts "add monkey patch message_builder_patch.........."
  Messages::MessageBuilder.include(MessageBuilderPatch)
  puts "monkey patch message_builder_patch successful!"
end