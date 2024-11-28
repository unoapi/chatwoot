class EventDispatcherJob < ApplicationJob
  queue_as :critical

  def perform(event_name, timestamp, data)
    Rails.configuration.dispatcher.async_dispatcher.publish_event(event_name, timestamp, data)
  rescue StandardError => e
    message = (['Error on EventDispatcherJob', "#{self.class} - #{e.class}: #{e.message}"] + e.backtrace).join("\n")
    Rails.logger.error(message)
    raise e
  end
end
