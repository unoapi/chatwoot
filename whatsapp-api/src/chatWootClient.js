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
    if (message.isGroupMsg || message.chatId.indexOf('@broadcast') > 0) return
    const contact = await this.createContact(message)
    const conversation = await this.createConversation(contact, message.chatId.split('@')[0])

    try {
      if (
        message.type == 'image' ||
        message.type == 'image/png' ||
        message.type == 'video' ||
        message.type == 'in' ||
        message.type == 'document' ||
        message.type == 'ptt' ||
        message.type == 'audio' ||
        message.type == 'sticker'
      ) {
        if (message.mimetype == 'image/webp') message.mimetype = 'image/jpeg'
        const extension = mime.extension(message.mimetype)
        const filename = `${message.timestamp}.${extension}`
        let b64

        if (message.qrCode) {
          b64 = message.qrCode
        } else {
          const buffer = await client.decryptFile(message)
          b64 = await buffer.toString('base64')
        }
        const mediaData = Buffer.from(b64, 'base64')
        const data = new FormData()
        if (message.caption) {
          data.append('content', message.caption)
        }
        data.append('attachments[]', toStream(mediaData), {
          filename: filename,
          contentType: message.mimetype,
        })
        data.append('message_type', 'incoming')
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
        const url = `api/v1/accounts/${this.account_id}/conversations/${conversation.id}/messages`
        const result = await axios.post(url, data, configPost)
        return result
      } else {
        const body = {
          content: message.body,
          message_type: 'incoming',
        }
        const url = `api/v1/accounts/${this.account_id}/conversations/${conversation.id}/messages`
        const { data } = await this.api.post(url, body)
        return data
      }
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
    const name = message.sender.isMyContact ? message.sender.formattedName : message.sender.pushname || message.sender.formattedName
    const phone_number = typeof message.sender.id == 'object' ? message.sender.id.user : message.sender.id.split('@')[0]
    const body = {
      inbox_id: this.inbox_id,
      name,
      phone_number
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
