import axios from 'axios'
import { default as FormData } from 'form-data'
import mime from 'mime-types'
import toStream from 'buffer-to-stream'
import { formatNumber } from './utils.js'

export default class chatWootClient {
  constructor(config) {
    this.config = config
    this.mobile_name = this.config.mobile_name
    this.mobile_number = formatNumber(this.config.mobile_number)
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

  async sendQrCode(qrCode) {
    return this.sendMessage({
      sender: this.sender,
      chatId: this.mobile_number + '@c.us',
      type: 'image',
      timestamp: 'qrcode',
      mimetype: 'image/png',
      caption: 'leia o qrCode',
      qrCode: qrCode.replace('data:image/png;base64,', ''),
    })
  }

  async sendMessage(message) {
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
    */
    const { key: { remoteJid } } = message
    message.phone = `+${remoteJid.split('@')[0].split(':')[0]}`
    const contact = await this.createContact(message)
    const conversation = await this.createConversation(contact, message.phone)

    try {
      // if (
      //   message.type == 'image' ||
      //   message.type == 'image/png' ||
      //   message.type == 'video' ||
      //   message.type == 'in' ||
      //   message.type == 'document' ||
      //   message.type == 'ptt' ||
      //   message.type == 'audio' ||
      //   message.type == 'sticker'
      // ) {
      //   if (message.mimetype == 'image/webp') message.mimetype = 'image/jpeg'
      //   const extension = mime.extension(message.mimetype)
      //   const filename = `${message.timestamp}.${extension}`
      //   let b64

      //   if (message.qrCode) {
      //     b64 = message.qrCode
      //   } else {
      //     const buffer = await client.decryptFile(message)
      //     b64 = await buffer.toString('base64')
      //   }
      //   const mediaData = Buffer.from(b64, 'base64')
      //   const data = new FormData()
      //   if (message.caption) {
      //     data.append('content', message.caption)
      //   }
      //   data.append('attachments[]', toStream(mediaData), {
      //     filename: filename,
      //     contentType: message.mimetype,
      //   })
      //   data.append('message_type', 'incoming')
      //   data.append('private', 'false')

      //   const configPost = Object.assign(
      //     {},
      //     {
      //       baseURL: this.config.baseURL,
      //       headers: {
      //         'Content-Type': 'application/json; charset=utf-8',
      //         api_access_token: this.config.token,
      //       },
      //     }
      //   )
      //   configPost.headers = { ...configPost.headers, ...data.getHeaders() }
      //   const url = `api/v1/accounts/${this.account_id}/conversations/${conversation.id}/messages`
      //   const result = await axios.post(url, data, configPost)
      //   return result
      // } else {
      const { message: { conversation: conversation_text, extendedTextMessage: { text: extended_text } } } = message
      const message_type = 'incoming'
      const content = conversation_text || extended_text
      const body = {
        content,
        message_type,
      }
      console.debug('message to send to chatwoot', body)
      const url = `api/v1/accounts/${this.account_id}/conversations/${conversation.id}/messages`
      const { data } = await this.api.post(url, body)
      return data
      // }
    } catch (e) {
      console.error('error on send message', e)
      throw e
    }
  }

  async findContact(query) {
    try {
      const { data } = await this.api.get(`api/v1/accounts/${this.account_id}/contacts/search/?q=${query}`)
      return data
    } catch (e) {
      console.error('error on find contact', e)
      throw e
    }
  }

  async createContact(message) {
    const body = {
      inbox_id: this.inbox_id,
      name: message.pushName,
      phone_number: message.phone
    }
    const contact = await this.findContact(body.phone_number.replace('+', ''))
    if (contact && contact.meta && contact.meta.count > 0) return contact.payload[0]
    try {
      const data = await this.api.post(`api/v1/accounts/${this.account_id}/contacts`, body)
      return data.data.payload.contact
    } catch (e) {
      console.error('error on create contact', e)
      throw e
    }
  }

  async findConversation(contact) {
    try {
      const { data } = await this.api.get(
        `api/v1/accounts/${this.account_id}/conversations?inbox_id=${this.inbox_id}&status=all`
      )
      return data.data.payload.find((e) => e.meta.sender.id == contact.id && e.status != 'resolved')
    } catch (e) {
      console.error('erro on find conversation', e)
      throw e
    }
  }

  async createConversation(contact, source_id) {
    var conversation = await this.findConversation(contact)
    if (conversation) return conversation
    const body = {
      source_id: source_id,
      inbox_id: this.inbox_id,
      contact_id: contact.id,
      status: 'open',
    }
    try {
      const { data } = await this.api.post(`api/v1/accounts/${this.account_id}/conversations`, body)
      return data
    } catch (e) {
      console.error('erro on create conversation', e)
      throw e
    }
  }
}
