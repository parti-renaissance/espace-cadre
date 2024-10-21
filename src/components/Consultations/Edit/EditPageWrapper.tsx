import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { getDesignation } from '~/api/designations'
import EditPage from '~/components/Consultations/Edit/EditPage'
import Loader from '~/ui/Loader'
import { Designation, DesignationTypeEnum } from '~/domain/designation'
import { useMemo } from 'react'

const EditPageWrapper = ({ type }: { type?: DesignationTypeEnum }) => {
  const { uuid } = useParams()
  const { data: designation, isFetching } = useQuery(['designation', uuid], () => getDesignation(uuid as string), {
    enabled: !!uuid,
  })

  if (isFetching) {
    return <Loader isCenter />
  }

  const designationForm = useMemo(() => {
    if (designation) {
      return designation
    }

    const newDesignation = Designation.createForType(type || DesignationTypeEnum.Consultation)

    if (newDesignation.isVote()) {
      newDesignation.fillDefaultVoteState()
    }

    return newDesignation
  }, [designation, type])

  return <EditPage designation={designationForm} />
}

export default EditPageWrapper
