# https://gist.github.com/bluefuton/5851093

module InboxesControllerPatch
  def self.included(base)
    base.send(:include, InstanceMethods)
    
    base.class_eval do
      alias_method :set_inbox_channel_original, :set_inbox_channel
      alias_method :set_inbox_channel, :set_inbox_channel_try_find_with_inbox_id

      alias_method :set_contact_inbox, :set_contact_inbox_with_contact_id
    end    
  end 
  
  module InstanceMethods
    def set_inbox_channel_try_find_with_inbox_id
      puts ">>>>> set_inbox_channel original first.........."
      begin
        set_inbox_channel_original
      rescue ActiveRecord::RecordNotFound
        puts ">>>>> try again by inbox id.........."
        @inbox_channel = ::Inbox.find_by!(id: params[:inbox_id]).channel
        puts ">>>>> retrieved #{@inbox_channel}.........."
      end
    end

    def set_contact_inbox_with_contact_id
      return if params[:contact_id].blank?
      puts ">>>>> set_contact_inbox original first with source_id: #{params[:contact_id]}.........."
      begin
        @contact_inbox = @inbox_channel.inbox.contact_inboxes.find_by!(source_id: params[:contact_id])
      rescue ActiveRecord::RecordNotFound
        puts ">>>>> try again with contact_id: #{params[:contact_id]}.........."
        @contact_inbox = @inbox_channel.inbox.contact_inboxes.find_by!(contact_id: params[:contact_id])
        puts ">>>>> retrieved #{@contact_inbox.id}.........."
      end
    end
  end
end


ActiveSupport::Reloader.to_prepare do
  puts "add monkey patch inboxes_controller_patch.........."
  Public::Api::V1::InboxesController.include(InboxesControllerPatch)
  puts "monkey patch inboxes_controller_patch successful!"
end
