class WebhookJob < ApplicationJob
  queue_as :medium

  def perform(url, payload, method = :post, headers = { content_type: :json, accept: :json })
    Webhooks::Trigger.execute(url, payload, method, headers)
  end
end
