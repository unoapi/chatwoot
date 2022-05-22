# https://gist.github.com/bluefuton/5851093

module RequestPatch
  def self.included(base)
    base.send(:include, InstanceMethods)
    
    base.class_eval do
      alias_method :execute, :execute_and_put_headers_authorizarion
    end    
  end 
  
  module InstanceMethods
    def execute_and_put_headers_authorizarion(& block)
      if @url.starts_with?(ENV['CHATWOOT_WHATSAPP_URL'])
        @headers.store(:chatwoot_whatsapp_server_auth_token, ENV['CHATWOOT_WHATSAPP_SERVER_AUTH_TOKEN'])
        puts ">>>>>>>>>>>>>>>>>>> Call Request.execute with params #{@headers}"
      end
      super.execute(& block)
    end    
  end
end