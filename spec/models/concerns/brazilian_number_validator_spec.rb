require 'rails_helper'

RSpec.describe BrazilianNumberValidator, type: :validator do
  # Create a simple test model for validation
  before_all do
    # rubocop:disable Lint/ConstantDefinitionInBlock
    # rubocop:disable RSpec/LeakyConstantDeclaration
    TestModelForBrazilianNumberValidation = Struct.new(:phone) do
      include ActiveModel::Validations

      validates :phone, brazilian_number: true
    end
    # rubocop:enable Lint/ConstantDefinitionInBlock
    # rubocop:enable RSpec/LeakyConstantDeclaration
  end

  context 'with incorrect types' do
    it 'fails validation' do
      model = TestModelForBrazilianNumberValidation.new('554988290955')
      expect(model.valid?).to be false
      expect(model.errors.messages).to eq({ phone: ['Número inválido, tente adicionar o nono dígito'] })
    end

    it 'success validation' do
      model = TestModelForBrazilianNumberValidation.new('5549988290955')
      expect(model.valid?).to be true
    end

    it 'success fixed validation' do
      model = TestModelForBrazilianNumberValidation.new('+554936213177')
      expect(model.valid?).to be true
    end
  end
end
