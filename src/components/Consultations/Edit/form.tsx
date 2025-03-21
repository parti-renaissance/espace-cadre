import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useMemo } from 'react'
import { DesignationType, schemaCreateDesignation, schemaPartialDesignation } from '~/domain/designation'

const useFormCreateDesignation = (isFullyEditable: boolean, defaultValues: DesignationType) =>
  useForm<DesignationType>({
    mode: 'onBlur',
    defaultValues,
    resolver: zodResolver(isFullyEditable ? schemaCreateDesignation : schemaPartialDesignation),
  })

export const FormProviderCreateDesignation = ({
  isFullyEditable,
  defaultValues,
  children,
}: {
  isFullyEditable: boolean
  defaultValues: DesignationType
  children: ReactNode
}) => <FormProvider {...useFormCreateDesignation(isFullyEditable, defaultValues)}>{children}</FormProvider>

export const useFormContextCreateDesignation = () => useFormContext<DesignationType>()

export const useTargetYearChoices = () =>
  useMemo(
    () =>
      Array.from({ length: new Date().getFullYear() - 2022 + 1 }, (_, i) => new Date().getFullYear() - i).map(year => ({
        value: year,
        label: `À partir des adhérents à jour ${year}`,
      })),
    []
  )
