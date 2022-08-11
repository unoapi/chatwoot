# https://gist.github.com/bluefuton/5851093

module ContactPatch
  def self.included(base)
    
    base.class_eval do
      puts ">>>>>>>>>>>>>>>>>>> add validator brazilian_number for contact#phone_number"
      validates :phone_number, brazilian_number: true
    end    
  end
end


ActiveSupport::Reloader.to_prepare do
  puts "add monkey patch contact_patch.........."
  Contact.include(ContactPatch)
  puts "monkey patch contact_patch successful!"
end