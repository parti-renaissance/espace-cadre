import { useCallback, useState } from 'react'
import { useFormikContext } from 'formik'

export const useStepValues = (initialValues = {}) => {
  const { values, setFieldValue } = useFormikContext()
  const [inputValues, setInputValues] = useState(values.id ? values : initialValues)

  const updateInputValues = useCallback((key, value) => {
    const [mainKey, subKey] = key.split('.')
    if (!subKey) return setInputValues(values => ({ ...values, [key]: value }))
    setInputValues(values => ({ ...values, [mainKey]: { ...values[mainKey], [subKey]: value } }))
  }, [])

  const updateValues = useCallback(
    (key, value) => {
      setFieldValue(key, value)
    },
    [setFieldValue]
  )

  return {
    inputValues,
    values,
    updateInputValues,
    updateValues,
  }
}
