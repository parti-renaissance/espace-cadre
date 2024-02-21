import { MessageContent } from '~/domain/message'
import { useQuery } from '@tanstack/react-query'
import { getEvent } from '~/api/events'
import parseMessageContent from '~/utils/parse-template'
import { useSearchParams } from 'react-router-dom'

export type PrefillTemplateDetails = {
  type?: string | null
  dataId?: string | null
}

const getQuery = ({ type, dataId }: PrefillTemplateDetails): Promise<unknown> => {
  if (!type || !dataId) {
    return Promise.resolve({})
  }
  if (type === 'event') {
    return getEvent(dataId)
  }

  throw new Error(`No query found for type ${type}`)
}

const isPrefillTemplateDetails = (x: unknown): x is { type: string; dataId: string } =>
  typeof x === 'object' && x !== null && 'type' in x && 'dataId' in x

export const usePrefillTemplate = (x: MessageContent | undefined, detail: PrefillTemplateDetails) => {
  const isParsingNeeded = x && isPrefillTemplateDetails(detail)

  const query = useQuery({
    queryKey: Object.values(detail),
    queryFn: () => getQuery(detail),
    enabled: isParsingNeeded,
  })

  return isParsingNeeded
    ? {
        isLoading: query.isLoading,
        isProccessed: query.isFetched,
        data: parseMessageContent(x, query.data),
        isParsingNeeded,
      }
    : {
        isLoading: false,
        isProccessed: false,
        data: x,
        isParsingNeeded,
      }
}

export const useGetPrefillDetails = () => {
  const [searchParams] = useSearchParams()
  const type = searchParams.get('prefill-template-type')
  const dataId = searchParams.get('prefill-template-data-id')

  return { detail: { type, dataId }, isPrefilledTemplate: type && dataId }
}
