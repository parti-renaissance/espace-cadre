import React, { useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '~/api/events'
import { Category } from '~/components/Events/shared/types'

interface CategoryProps {
  category: Category
  onClick: (e: React.MouseEvent<HTMLDivElement>, category: Category) => void
  register: any
}

const Category = ({ category, onClick, register }: CategoryProps) => {
  const [categorySelected, setCategorySelected] = useState<Category>(category)

  const { data: categories, isLoading } = useQuery(['categories'], getCategories)

  useEffect(() => {
    if (category) {
      setCategorySelected(category)
    }
  }, [category])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, category: Category) => {
    register('category').onChange(e)

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
              borderColor: categorySelected && categorySelected.slug === category.slug ? 'primary.main' : 'grey.300',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => handleClick(e, category)}
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

export default Category
