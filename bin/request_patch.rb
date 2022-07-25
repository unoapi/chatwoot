# https://gist.github.com/bluefuton/5851093
require 'json'
require 'uri'

module RequestPatch
  def self.included(base)
    base.send(:include, InstanceMethods)
    
    base.class_eval do
      alias_method :make_headers_original, :make_headers
      alias_method :make_headers, :make_headers_and_put_headers_authorizarion
    end    
  end 
  
  module InstanceMethods
    # WHATSAPP_CHANNEL_URLS = {
    #   'https://localhost:9999': {
    #     'header_name': '',
    #     'header_value': ''
    #   }
    # }
    
    def make_headers_and_put_headers_authorizarion(user_headers)
      puts ">>>>>>>>>>>>>>>>>>> WHATSAPP_CHANNEL_URLS: #{ENV['WHATSAPP_CHANNEL_URLS']}"
      @urls = JSON.parse(ENV['WHATSAPP_CHANNEL_URLS'] || '{}').with_indifferent_access
      puts ">>>>>>>>>>>>>>>>>>> @urls: #{@urls}"
      uri = URI(@url)
      key = "#{uri.scheme}://#{uri.host}"
      puts ">>>>>>>>>>>>>>>>>>> @urls[#{key}]: #{@urls[key]}"
      if @urls[key]
        user_headers.store(@urls[key][:header_name], @urls[key][:header_value])
        puts ">>>>>>>>>>>>>>>>>>> make_headers for #{@urls[key]} with params #{user_headers}"
      end
      make_headers_original(user_headers)
    end
  end
end

ActiveSupport::Reloader.to_prepare do
  puts "add monkey patch http_party.........."
  RestClient::Request.include(RequestPatch)
  puts "monkey patch http_party successful!"
end
