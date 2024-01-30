import { createMessageContent, updateMessageContent } from '~/api/messagerie'
import { CreateMessageContentSchema, MessageContent, MessageContentSchema } from '~/domain/message'

const isMessageContent = (payload: Partial<MessageContent>): payload is MessageContent =>
  Object.prototype.hasOwnProperty.call(payload, 'uuid') && typeof payload.uuid === 'string'

export const postUpdateNewsletter = (payload: Partial<MessageContent>): Promise<MessageContent> => {
  const isUpdate = isMessageContent(payload)
  if (isUpdate) {
    const parsedPayload = MessageContentSchema.safeParse(payload)
    if (!parsedPayload.success) {
      throw parsedPayload.error
    }
    const { uuid, ...rest } = parsedPayload.data
    return updateMessageContent(uuid, rest)
  }
  const parsedPayload = CreateMessageContentSchema.safeParse(payload)
  if (!parsedPayload.success) {
    throw parsedPayload.error
  }
  return createMessageContent(parsedPayload.data)
}
