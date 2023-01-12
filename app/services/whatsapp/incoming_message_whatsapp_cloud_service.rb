# https://docs.360dialog.com/whatsapp-api/whatsapp-api/media
# https://developers.facebook.com/docs/whatsapp/api/media/

class Whatsapp::IncomingMessageWhatsappCloudService < Whatsapp::IncomingMessageBaseService
  private

  def set_contact
    contact_params = @processed_params[:contacts]&.first
    return if contact_params.blank?

    if group_message?
      contact_inbox = ::ContactInboxWithContactBuilder.new(
        source_id: contact_params[:wa_id],
        inbox: inbox,
        contact_attributes: { email: contact_params[:wa_id], name: contact_params.dig(:profile, :name) }
      ).perform
      @sender = ::ContactInboxWithContactBuilder.new(
        source_id: contact_params[:from_id],
        inbox: inbox,
        contact_attributes: { name: contact_params.dig(:profile, :name), phone_number: "+#{@processed_params[:messages].first[:from]}" }
      ).perform.contact

      @contact_inbox = contact_inbox
      @contact = contact_inbox.contact
    else
      super
    end
  end

  def processed_params
    @processed_params ||= params[:entry].first['changes'].first['value']
  end

  def download_attachment_file(attachment_payload)
    url_response = HTTParty.get(inbox.channel.media_url(attachment_payload[:id]), headers: inbox.channel.api_headers)
    # This url response will be failure if the access token has expired.
    inbox.channel.authorization_error! if url_response.unauthorized?
    Down.download(url_response.parsed_response['url'], headers: inbox.channel.api_headers) if url_response.success?
  end

  def message_content(message)
    content = super(message)
    group_message? ? "*#{@sender.name}*: #{content}" : content
  end

  def group_message?
    contact_params = @processed_params[:contacts]&.first
    contact_params.present? && contact_params[:wa_id].include?('@g.us')
  end
end
