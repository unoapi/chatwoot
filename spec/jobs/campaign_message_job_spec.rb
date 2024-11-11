require 'rails_helper'

RSpec.describe CampaignMessageJob do
  subject(:job) do
    described_class.perform_later(
      campaign.account_id,
      campaign.inbox_id,
      campaign.id,
      phone_number,
      campaign.message
    )
  end

  let(:account) { create(:account) }
  let!(:unoapi_channel) { create(:channel_whatsapp, provider: 'unoapi', sync_templates: false, validate_provider_config: false) }
  let!(:unoapi_inbox) { create(:inbox, channel: unoapi_channel) }
  let(:phone_number) { Faker::PhoneNumber.cell_phone_in_e164 }
  let(:name) { Faker::Name.name }
  let(:identifier) { rand(999..1000).to_s }
  let(:audience_1) { { phone_number: phone_number, name: name } }
  let(:audience) { [audience_1] }
  let!(:campaign) do
    create(:campaign, inbox: unoapi_inbox, account: account, audience: [audience], message: 'hello #name')
  end
  let!(:team) { create(:team) }

  it 'enqueues the job' do
    expect { job }.to have_enqueued_job(described_class)
      .with(
        campaign.account_id,
        campaign.inbox_id,
        campaign.id,
        phone_number,
        campaign.message
      )
      .on_queue('low')
  end

  context 'when the job is triggered on a new message' do
    let(:process_service) { double }

    before do
      allow(process_service).to receive(:perform)
    end

    it 'calls create a message' do
      count = Message.count
      described_class.perform_now(
        campaign.account_id,
        campaign.inbox_id,
        campaign.id,
        campaign.message,
        audience_1
      )
      expect(Message.count).to be count + 1
    end

    it 'bind message content' do
      described_class.perform_now(
        campaign.account_id,
        campaign.inbox_id,
        campaign.id,
        campaign.message,
        audience_1
      )
      expect(Message.last.content).to eq("hello #{name}")
    end

    it 'with team' do
      audience_1[:team_id] = team.id
      described_class.perform_now(
        campaign.account_id,
        campaign.inbox_id,
        campaign.id,
        campaign.message,
        audience_1
      )
      expect(Message.last.conversation.team_id).to eq(team.id)
    end

    it 'with content content type image' do
      link = 'https://farm4.staticflickr.com/3827/11349066413_99c32dee4a_z_d.jpg'
      stub_request(:get, link).to_return(status: 200, headers: {})
      audience2 = { phone_number: Faker::PhoneNumber.cell_phone_in_e164, name: name, content_type: :image, link: link }
      campaign2 = create(:campaign, { inbox: unoapi_inbox, account: account, audience: [audience2], message: 'hello #name' })

      count = Attachment.count
      described_class.perform_now(
        campaign2.account_id,
        campaign2.inbox_id,
        campaign2.id,
        campaign2.message,
        audience2
      )
      expect(Attachment.count).to be count + 1
    end

    it 'update contact with identifier' do
      described_class.perform_now(
        campaign.account_id,
        campaign.inbox_id,
        campaign.id,
        campaign.message,
        audience_1
      )
      expect(Contact.where(identifier: identifier).count).to eq(0)
      expect(Message.last.content).to eq("hello #{name}")
      audience = { phone_number: phone_number, name: name, identifier: identifier }
      described_class.perform_now(
        campaign.account_id,
        campaign.inbox_id,
        campaign.id,
        campaign.message,
        audience
      )
      expect(Contact.where(identifier: identifier).count).to eq(1)
    end
  end
end
