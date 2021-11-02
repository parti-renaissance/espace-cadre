/* eslint-disable import/prefer-default-export */
import { useDispatch, useSelector } from 'react-redux'

import { useCallback } from 'react'
import { resetMessagerieState, updateSelectedTemplate } from './slice'
import { getSelectedTemplate } from './selectors'
import { apiClient } from '../../services/networking/client'

export const useSelectedTemplate = () => {
    const dispatch = useDispatch()

    const setSelectedTemplate = useCallback(async (option) => {
        if (option?.value) {
            const templateContent = await apiClient.get(`/v3/email_templates/${option.value}`)
            dispatch(updateSelectedTemplate({ ...option, ...templateContent }))
        } else {
            dispatch(updateSelectedTemplate(option))
        }
    }, [dispatch])

    return [
        useSelector(getSelectedTemplate),
        setSelectedTemplate,
    ]
}

export const useResetMessagerieState = () => {
    const dispatch = useDispatch()

    return useCallback(() => dispatch(resetMessagerieState()), [dispatch])
}
