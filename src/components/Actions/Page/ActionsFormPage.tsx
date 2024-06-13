import { SubmitHandler, useForm } from 'react-hook-form'
import { ActionEnum, ActionFormModel } from '~/models/actions.model'
import { zodResolver } from '@hookform/resolvers/zod'
import { ActionsFormSchema } from '~/components/Actions/Utils/ActionsFormSchema'
import { useCallback } from 'react'
import FormGroup from '~/components/Events/pages/createOrEdit/components/FormGroup/FormGroup'
import Category from '~/components/Events/pages/createOrEdit/components/forms/category'
import { Stack } from '@mui/material'
import BlockForm from '~/components/Events/pages/createOrEdit/components/BlockForm/BlockForm'

export default function ActionsFormPage() {
  const { control, handleSubmit, watch, setValue, register } = useForm<ActionFormModel>({
    mode: 'onChange',
    resolver: zodResolver(ActionsFormSchema),
    defaultValues: {
      type: ActionEnum.BOITAGE,
      date: new Date(),
      city: '',
      description: '',
      postalCode: '',
      street: '',
    },
  })

  const onSubmit: SubmitHandler<ActionFormModel> = useCallback(v => {
    console.log('Values on submit', v)
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack mt={4} spacing={5}>
        <BlockForm title="Catégories d’action">
          <FormGroup label="Catégorie">
            <Category category={watch('type')} onClick={() => {}} register={register} />
          </FormGroup>
        </BlockForm>
      </Stack>
    </form>
  )
}
