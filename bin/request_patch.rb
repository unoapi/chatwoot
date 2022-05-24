# https://gist.github.com/bluefuton/5851093

module RequestPatch
  def self.included(base)
    base.send(:include, InstanceMethods)
    
    base.class_eval do
      alias_method :make_headers_original, :make_headers
      alias_method :make_headers, :make_headers_and_put_headers_authorizarion
    end    
  end 
  
  module InstanceMethods
    def make_headers_and_put_headers_authorizarion(user_headers)
      if @url.starts_with?(ENV['CHATWOOT_WHATSAPP_URL'])
        user_headers.store(:chatwoot_whatsapp_server_auth_token, ENV['CHATWOOT_WHATSAPP_SERVER_AUTH_TOKEN'])
        puts ">>>>>>>>>>>>>>>>>>> make_headers with params #{user_headers}"
      end
      make_headers_original(user_headers)
    end
  end
end