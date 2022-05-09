require 'net/http'
require 'net/https'
require 'uri'
require 'net/imap'

class EmailRelayJob 
  include Sidekiq::Job
  sidekiq_options retry: 5 # Only five retries and then to the Dead Job Queue
  
  def perform(message)
    mail = Mail::Message.new(message)
    puts "New mail from #{mail.from.first}: #{mail.subject}"
    uri = URI.parse(ENV['CHATWOOT_URL'])
    req = Net::HTTP::Post.new(uri)
    req.basic_auth(ENV['INGRESS_USER'], ENV['INGRESS_PASSWORD'])
    req.body = message
    req.content_type = 'message/rfc822'
    Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https') do |http|
      puts 'message pushing'
      response = http.request(req)
      puts "response.body -> #{response.read_body}"
      case response
      when Net::HTTPSuccess then
        puts 'message pushed'
        response
      else
        puts "response -> #{response}"
        puts "message not pushed, retray in #{ENV['RETRAY_IN']} seconds"
        EmailRelayJob.perform_in(ENV['RETRAY_IN'].to_i.seconds, message)
      end
    end
  end
end