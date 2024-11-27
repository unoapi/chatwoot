class BrazilianNumberValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return if value.blank?

    phone = value.delete('+')

    return if phone[0, 2] != '55'

    local = phone[2, phone.length - 1]

    return if !mobile?(local) || local.scan(/\d/).join.length == 11

    record.errors.add(attribute, 'Número inválido, tente adicionar o nono dígito')
  end

  def mobile?(phone)
    %w[6 7 8 9].include?(phone[2])
  end
end
