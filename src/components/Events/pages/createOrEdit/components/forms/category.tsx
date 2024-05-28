import React, { useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '~/api/events'
import { UseFormRegister } from 'react-hook-form'

type Category = {
  id: number
  name: string
  slug: string
  description: string
}

interface CategoryProps {
  category: string
  onClick: (e: React.MouseEvent<HTMLDivElement>, category: string) => void
  type?: 'event' | 'action'
  register: UseFormRegister<any>
}

export default function Category({ category, onClick, register, type = 'event' }: CategoryProps) {
  const [categorySelected, setCategorySelected] = useState<string>(category)

  const { data: categories, isLoading } = useQuery(['categories', type], () =>
    type === 'event' ? getCategories() : () => {}
  )

  useEffect(() => {
    if (category) {
      setCategorySelected(category)
    }
  }, [category])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, category: string) => {
    register('categoryId').onChange(e)

    setCategorySelected(category)
    onClick(e, category)
  }

  if (!categories || isLoading) {
    return null
  }

  return (
    <Grid container spacing={2}>
      {categories.map((category: Category, index: number) => (
        <Grid key={index} item xs={12} md={6}>
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              border: 1,
              borderColor: categorySelected === category.slug ? 'primary.main' : 'grey.300',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => handleClick(e, category.slug)}
          >
            <Stack spacing={1}>
              <Typography variant="h6" fontWeight={600}>
                {category.name}
              </Typography>

              {category.description && (
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
              )}
            </Stack>
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}
