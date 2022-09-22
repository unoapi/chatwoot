class Public::Api::V1::InboxesController < PublicController
  before_action :set_inbox_channel
  before_action :set_contact_inbox
  before_action :set_conversation

  private

  def set_inbox_channel
    @inbox_channel = ::Channel::Api.find_by!(identifier: params[:inbox_id])
  rescue ActiveRecord::RecordNotFound
    # rubocop:disable Rails/FindById
    @inbox_channel = ::Inbox.find_by!(id: params[:inbox_id]).channel
    # rubocop:enable Rails/FindById
  end

  def set_contact_inbox
    return if params[:contact_id].blank?

    begin
      @contact_inbox = @inbox_channel.inbox.contact_inboxes.find_by!(source_id: params[:contact_id])
    rescue ActiveRecord::RecordNotFound
      @contact_inbox = @inbox_channel.inbox.contact_inboxes.find_by!(contact_id: params[:contact_id])
    end
  end

  def set_conversation
    return if params[:conversation_id].blank?

    @conversation = @contact_inbox.contact.conversations.find_by!(display_id: params[:conversation_id])
  end
end
