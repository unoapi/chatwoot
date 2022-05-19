import axios from 'axios'
import { default as FormData } from 'form-data'
import mime from 'mime-types'
import toStream from 'buffer-to-stream'
import { downloadContentFromMessage } from '@adiwajshing/baileys'
import { idToNumber } from './utils.js'
import { chatwootClients } from './session.js'
import { redisConnect, redisDisconnect, getAndCacheConversationId } from './redis.js'
import vCard from 'vcard-parser'
import { setConversationId } from './redis.js'

export const getChatwootClient = (token, config) => {
  let chatwootClient
  if (chatwootClients[token] && Object.keys(chatwootClients[token]).length > 0) {
    console.info('Chatwoot client already exist for token', token)
    chatwootClient = chatwootClients[token]
  } else {
    console.info('Create new Chatwoot client for token', token)
    chatwootClient = new ChatWootClient(config)
    chatwootClients[token] = chatwootClient
  }
  return chatwootClient
}

class ChatWootClient {
  constructor(config) {
    this.config = config
    this.mobile_name = this.config.mobile_name
    this.mobile_number = this.config.mobile_number
    this.sender = {
      pushname: this.mobile_name,
      id: this.mobile_number,
    }
    this.account_id = this.config.account_id
    this.inbox_id = this.config.inbox_id
    this.api = axios.create({
      baseURL: this.config.baseURL,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        api_access_token: this.config.token
      }
    })
  }

  async sendMessage(payload) {
    /*
    {
      key: {
        remoteJid: '554936213177@s.whatsapp.net',
        fromMe: false,
        id: 'BAE5571AF7EDC43C',
        participant: undefined
      },
      messageTimestamp: 1652495350,
      pushName: 'Odonto Excellence',
      message: Message {
        extendedTextMessage: ExtendedTextMessage {
          text: '*[Clairton]*\nda minha odonto excellence'
        }
      }
      }

      {
        key: {
          remoteJid: '554936213177@s.whatsapp.net',
          fromMe: true,
          id: '3A31402281D4AFD2B275',
          participant: undefined
        },
        messageTimestamp: 1652495215,
        pushName: 'Clairton Rodrigo Heinzen',
        status: 2,
        message: Message { conversation: 'Oi' }
      }
      {
        key: {
          remoteJid: '554936213177@s.whatsapp.net',
          fromMe: false,
          id: 'BAE5EDFE6B58778D',
          participant: undefined
        },
        messageTimestamp: 1652548464,
        pushName: 'Odonto Excellence',
        message: Message {
          documentMessage: DocumentMessage {
            url: 'https://mmg.whatsapp.net/d/f/Aq9AwiI-4iPo-IIEa5I-vTHH6-of-K_PrJmWFFn0OQ7T.enc',
            mimetype: 'application/pdf',
            fileSha256: [Uint8Array],
            fileLength: [Long],
            mediaKey: [Uint8Array],
            fileName: '143cac00ad37e8959ad62ecdf86c7d1bb5bd38ce-220216170607kgUxy.pdf',
            fileEncSha256: [Uint8Array],
            directPath: '/v/t62.7119-24/56154192_166716635803027_3601122370820876096_n.enc?ccb=11-4&oh=01_AVx-cqOyQot2prbZPhYua5SjszlDupn4HKBrzVLPrRCDOA&oe=62A5DF63',
            mediaKeyTimestamp: [Long]
          }
        }
      }

    {
      key: {
        remoteJid: '554999621461@s.whatsapp.net',
        fromMe: false,
        id: '3A4FBD061C5F3BABB5B2'
        },
        messageTimestamp: 1652802085,
        pushName: 'Silvia Castagna Heinzen',
        message: {
        contactMessage: {
        displayName: 'Everton - Laboratorio',
        vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Everton - Laboratorio;;;\nFN:Everton - Laboratorio\nTEL;type=CELL;type=VOICE;waid=554991537303:+55 49 9153-7303\n' +
        'END:VCARD'
        },
        messageContextInfo: { deviceListMetadata: [Object], deviceListMetadataVersion: 2 }
        },
        phone: '+5549999621461'
      }
    }

    {
      key: {
        remoteJid: '5511951005318-1574706845@g.us',
        fromMe: false,
        id: '3EB0B37E2B6CF7BD44DB',
        participant: '5511985206083:1@s.whatsapp.net'
      },
      messageTimestamp: 1652906110,
      pushName: 'Canaltech Ofertas',
      message: {
        senderKeyDistributionMessage: {
          groupId: '5511951005318-1574706845@g.us',
          axolotlSenderKeyDistributionMessage: 'MwiV5+yJBRAAGiDhyCCAgkkJ7c1TyoH9vVq2GAaX82Av7gDXTJO9g4Uq9CIhBR6Hd8fdM509vVQggWRdSeR2eRFmp/BjRavARk5il/h4'
        },
        extendedTextMessage: {
          text: '👏🏻👏🏻👏🏻\n' +
            '\n' +
            'São MUITOS itens com cupom de desconto para você escolher! Clique em destacar o cupom na página do link e ele será aplicado no carrinho de compras!\n' +
            '\n' +
            'Loja de Cupons Amazon\n' +
            '\n' +
            '*Acesse:* https://canalte.ch/c1p1/p6xiz\n' +
            '\n' +
            'Link pra entrar no grupo de ofertas:\n' +
            'https://canalte.ch/canaltech-ofertas',
          matchedText: 'https://canalte.ch/c1p1/p6xiz',
          canonicalUrl: 'https://canalte.ch/c1p1/p6xiz',
          description: 'Loja de Cupons Amazon. Compre aqui com o melhor preço nas melhores lojas 80135',
          title: 'Loja de Cupons Amazon 80135 - Canaltech Ofertas',
          previewType: 'VIDEO',
          contextInfo: [Object],
          thumbnailSha256: 'iQHLbX6ZH0/hJ0tbQaBi7rK42EaAaw5SPPGcrxkm/SQ=',
          thumbnailEncSha256: 'gUH5UUQd9/sqMVNv1iD3i2dUU23ylpSAyH1F1WAgXjQ=',
          mediaKey: 'O2gor1y/ty26fg9pKXpgKWWpxrhpusZAQd7q3hkxuOw=',
          mediaKeyTimestamp: '1652905855',
          thumbnailHeight: 600,
          thumbnailWidth: 1200
        },
        messageContextInfo: { deviceListMetadata: [Object], deviceListMetadataVersion: 2 }
      },
      chatId: '5511951005318-1574706845@g.us',
      phone: '+5511951005318-1574706845'
    }
    */
    try {
      const { key: { remoteJid, fromMe } } = payload
      payload.phone = idToNumber(remoteJid)
      const contact = await this.createContact(payload)
      const conversation = await this.createConversation(contact, payload.chatId)
      const url = `api/v1/accounts/${this.account_id}/conversations/${conversation.id}/messages`
      const messageType = Object.keys(payload.message)[0]
      const chatwootMessageType = fromMe ? 'template' : 'incoming'
      switch (messageType) {
        case 'imageMessage':
        case 'videoMessage':
        case 'audioMessage':
        case 'stickerMessage':
        case 'documentMessage':
        case 'qrCodeMessage':
          let b64
          const binMessage = payload.message[messageType]
          if (messageType === 'qrCodeMessage') {
            b64 = binMessage.url.replace('data:image/png;base64,', '')
          } else {
            const stream = await downloadContentFromMessage(binMessage, messageType.replace('Message', ''))
            let buffer = Buffer.from([])
            for await (const chunk of stream) {
              buffer = Buffer.concat([buffer, chunk])
            }
            b64 = await buffer.toString('base64')
          }
          let mimetype = binMessage.mimetype
          if (mimetype == 'image/webp') mimetype = 'image/jpeg'
          const extension = mime.extension(mimetype)
          const filename = `${payload.messageTimestamp}.${extension}`
          const mediaData = Buffer.from(b64, 'base64')
          const data = new FormData()
          if (binMessage.caption) {
            data.append('content', binMessage.caption)
          }
          data.append('attachments[]', toStream(mediaData), {
            filename: filename,
            contentType: mimetype,
          })
          data.append('message_type', chatwootMessageType)
          data.append('private', 'false')

          const configPost = Object.assign(
            {},
            {
              baseURL: this.config.baseURL,
              headers: {
                'Content-Type': 'application/json; charset=utf-8',
                api_access_token: this.config.token,
              },
            }
          )
          configPost.headers = { ...configPost.headers, ...data.getHeaders() }
          return await axios.post(url, data, configPost)

        case 'contactMessage':
          let card = vCard.parse(payload.message.contactMessage.vcard)
          let d = {
            content: `${card.fn[0].value} ${card.tel.map(t => t.value).join(', ')}`,
            message_type: chatwootMessageType
          }
          console.debug('message to send to chatwoot', d)
          return await this.api.post(url, d)

        case 'conversation':
        case 'extendedTextMessage':
          let content
          if (payload.message && payload.message.conversation) {
            content = payload.message.conversation
          } else if (payload.message && payload.message.extendedTextMessage && payload.message.extendedTextMessage.text) {
            content = payload.message.extendedTextMessage.text
          }
          const body = {
            content,
            message_type: chatwootMessageType,
          }
          console.debug('message to send to chatwoot', body)
          return await this.api.post(url, body)

        case 'protocolMessage':
          return;

        default:
          throw `Unknow message type ${messageType}`
      }
    } catch (e) {
      console.error('error on send message', e)
      console.error('error on send message with payload', payload)
      throw e
    }
  }

  async findContact(query) {
    try {
      console.debug(`Find contact with query ${query}`)
      const { data } = await this.api.get(`api/v1/accounts/${this.account_id}/contacts/search/?q=${query}`)
      return data
    } catch (e) {
      console.error('error on find contact', e)
      throw e
    }
  }

  async createContact(message) {
    const contact = await this.findContact(message.phone.replace('+', ''))
    if (contact && contact.meta && contact.meta.count > 0) {
      console.debug(`Found contact with phone ${message.phone}`)
      return contact.payload[0]
    }
    try {
      const body = {
        inbox_id: this.inbox_id,
        name: message.pushName,
        phone_number: message.phone
      }
      const { key: { fromMe } } = message
      if (fromMe) {
        // @TODO: retrieve profile name
        body.name = message.phone
      } else {
        body.name = message.pushName
      }
      console.debug(`Creating contact with phone ${body.phone_number}`)
      const data = await this.api.post(`api/v1/accounts/${this.account_id}/contacts`, body)
      console.debug(`Created contact with phone ${body.phone_number}`)
      return data.data.payload.contact
    } catch (e) {
      console.error('error on create contact', e)
      throw e
    }
  }

  async findConversation(conversationId) {
    try {
      const { data } = await this.api.get(`api/v1/accounts/${this.account_id}/conversations/${conversationId}`)
      console.debug('find conversation', data)
      if (data.status === 'revolved') {
        console.debug('Found conversation, but status is resolved', data)
        return
      } else {
        console.debug('Found conversation', data)
        return data
      }
    } catch (e) {
      console.error('erro on find conversation', e)
      throw e
    }
  }

  async createConversation(contact, sourceId) {
    const redisClient = await redisConnect()
    const conversationId = await getAndCacheConversationId(redisClient, sourceId)
    if (conversationId) {
      const conversation = await this.findConversation(conversationId)
      if (conversation) {
        await redisDisconnect(redisClient)
        console.debug(`Found conversation with source id ${sourceId}`)
        return conversation
      }
    }
    const body = {
      source_id: sourceId,
      inbox_id: this.inbox_id,
      contact_id: contact.id,
      status: 'open',
    }
    try {
      console.debug(`Creating conversation with source id ${sourceId}`)
      const { data } = await this.api.post(`api/v1/accounts/${this.account_id}/conversations`, body)
      console.debug(`Created conversation ${data.id} with source id ${sourceId}`)
      await setConversationId(redisClient, sourceId, data.id)
      return data
    } catch (e) {
      console.error('erro on create conversation', e)
      throw e
    } finally {
      try {
        await redisDisconnect(redisClient)
      } catch (_error) { }
    }
  }
}
