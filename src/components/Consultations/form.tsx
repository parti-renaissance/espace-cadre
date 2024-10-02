import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useMemo } from 'react'
import { DesignationType, schemaCreateDesignation } from '~/domain/designation'

const useFormCreateDesignation = () =>
  useForm<DesignationType>({
    mode: 'onBlur',
    resolver: zodResolver(schemaCreateDesignation),
  })

export const FormProviderCreateDesignation = ({ children }: { children: ReactNode }) => {
  const methods = useFormCreateDesignation()
  return <FormProvider {...methods}>{children}</FormProvider>
}

export const useFormContextCreateDesignation = () => useFormContext<DesignationType>()

export const useTargetChoices = () =>
  useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i).map(year => ({
        value: `adherents_${year}`,
        label: `Adhérents à jour ${year}`,
      })),
    []
  )
