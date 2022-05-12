

export async function chatWoot(req, res) {
    const { session } = req.params;
    const client = clientsArray[session];
    if (client == null || client.status !== 'CONNECTED') {
      return res.status(400).json({ status: 'error', message: `Session ${session} is disconnected` });
    }
    try {
      if (await client.isConnected()) {
        const event = req.body.event;
  
        if (event == 'conversation_status_changed' || event == 'conversation_resolved' || req.body.private) {
          return res.status(200).json({ status: 'success', message: 'Success on receive chatwoot' });
        }
  
        const {
          message_type,
          phone = req.body.conversation.meta.sender.phone_number.replace('+', ''),
          message = req.body.conversation.messages[0],
        } = req.body;
  
        if (event != 'message_created' && message_type != 'outgoing') return res.status(200);
        for (const contato of contactToArray(phone, false)) {
          if (message_type == 'outgoing') {
            if (message.attachments) {
              let base_url = `${client.config.chatWoot.baseURL}/${message.attachments[0].data_url.substring(
                message.attachments[0].data_url.indexOf('/rails/') + 1
              )}`;
              await client.sendFile(`${contato}`, base_url, 'file', message.content);
            } else {
              await client.sendText(contato, message.content);
            }
          }
        }
        return res.status(200).json({ status: 'success', message: 'Success on  receive chatwoot' });
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({ status: 'error', message: 'Error on  receive chatwoot' });
    }
  }