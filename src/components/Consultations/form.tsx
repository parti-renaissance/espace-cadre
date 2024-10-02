import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useMemo } from 'react'
import { DesignationType, schemaCreateDesignation } from '~/domain/designation'

const useFormCreateDesignation = (defaultValues: DesignationType) =>
  useForm<DesignationType>({
    mode: 'onBlur',
    defaultValues,
    resolver: zodResolver(schemaCreateDesignation),
  })

export const FormProviderCreateDesignation = ({
  defaultValues,
  children,
}: {
  defaultValues: DesignationType
  children: ReactNode
}) => <FormProvider {...useFormCreateDesignation(defaultValues)}>{children}</FormProvider>

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
