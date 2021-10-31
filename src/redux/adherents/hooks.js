/* eslint-disable import/prefer-default-export */
import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { getColumnsTitle } from './selectors'
import { updateColumnsTitle } from './slice'

export const useColumnsTitleCache = () => {
    const dispatch = useDispatch()

    const columnsTitle = useSelector(getColumnsTitle)

    const setColumnsTitle = useCallback((body) => dispatch(updateColumnsTitle(body)), [dispatch])

    return [columnsTitle, setColumnsTitle]
}
