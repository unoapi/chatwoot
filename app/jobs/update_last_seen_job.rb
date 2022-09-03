class UpdateLastSeenJob < ApplicationJob
  queue_as :default

  def perform(conversation_id, agent_last_seen_at, is_assignee)
    ActiveRecord::Base.transaction do
      conversation = Conversation.find(conversation_id)
      # rubocop:disable Rails/SkipsModelValidations
      conversation.update_column(:agent_last_seen_at, agent_last_seen_at)
      conversation.update_column(:assignee_last_seen_at, agent_last_seen_at) if is_assignee
      # rubocop:enable Rails/SkipsModelValidations
      conversation.messages.to_read(agent_last_seen_at).each do |message|
        message.update(status: :read)
      end
    end
  end
end
