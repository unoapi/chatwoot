require 'phonelib'

class BrazilianNumberValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    phone = Phonelib.parse(value)
    length = phone.local_number.scan(/\d/).join('').length
    puts "validate number #{value} with data: country #{phone.country} invalid? #{phone.invalid?} type #{phone.type} local_number #{phone.local_number} and length #{length}"
    if (phone.country == 'BR' && (phone.invalid? || phone.type == :mobile && length < 11))
      record.errors.add(attribute, (options[:message] || 'Número esta inválido ou é um celular, e nesse caso precisa ter o nono digito!'))
    end
  end
end