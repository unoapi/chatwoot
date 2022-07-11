# https://gist.github.com/bluefuton/5851093
require 'json'

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
    @urls = JSON.parse(ENV['WHATSAPP_CHANNEL_URLS'] || '{}')
    def make_headers_and_put_headers_authorizarion(user_headers)
      if @urls[@url]
        user_headers.store(@urls[@url][:header_name], @urls[@url][:token])
        puts ">>>>>>>>>>>>>>>>>>> make_headers for #{@urls[@url][:header_name]} with params #{user_headers}"
      end
      make_headers_original(user_headers)
    end
  end
end

puts "add monkey patch request_patch.........."
RestClient::Request.include(RequestPatch)
puts "monkey patch request_patch successfull!"