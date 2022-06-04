# https://medium.com/parallel-thinking/monkey-patching-active-record-models-6fe9f8b1afe9

module AddExternalSourceIdsWhatsappToMessage
  extend ActiveRecord::Store::ClassMethods
  extend ActiveRecord::Attributes::ClassMethods
  extend ActiveRecord::AttributeMethods::Serialization::ClassMethods
  
  store :external_source_ids, accessors: [:slack, :whastapp], coder: JSON, prefix: :external_source_id

  def self.included(base)
    base.send(:include, InstanceMethods)    
  end 
  
  module InstanceMethods
    class_attribute :attributes_to_define_after_schema_loads, instance_accessor: false, default: {} # :internal:
  end
end

ActiveSupport::Reloader.to_prepare do
  puts "add monkey patch add_external_source_ids_whatsapp"
  Message.include AddExternalSourceIdsWhatsappToMessage
  puts "monkey patch add_external_source_ids_whatsapp successfull!"
end
