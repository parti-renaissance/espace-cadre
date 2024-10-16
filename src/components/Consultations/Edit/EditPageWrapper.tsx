import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { getDesignation } from '~/api/designations'
import EditPage from '~/components/Consultations/Edit/EditPage'
import Loader from '~/ui/Loader'

const EditPageWrapper = () => {
  const { uuid } = useParams()
  const { data: designation, isFetching } = useQuery(['designation', uuid], () => getDesignation(uuid as string), {
    enabled: !!uuid,
  })

  if (isFetching) {
    return <Loader isCenter />
  }

  return <EditPage designation={designation} />
}

export default EditPageWrapper
