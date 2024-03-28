import { MessageContent } from '~/domain/message'

const parseMessageContent = (messageContent: MessageContent | undefined, data?: unknown) => {
  if (!messageContent || !data) {
    return messageContent
  }

  let result = messageContent.json_content

  if (typeof data !== 'object') {
    throw new Error('Data must be an object')
  }

  Object.entries(data).map(([key, value]) => {
    if (value) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value)
    }
  })

  return {
    ...messageContent,
    json_content: result,
    content: '',
  }
}

export default parseMessageContent
