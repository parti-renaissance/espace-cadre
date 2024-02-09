import React from 'react'
import { Button, SxProps, Theme } from '@mui/material'
import ChooseType from '~/components/Messagerie/Component/ChooseType'
import TypeCard from '~/components/Messagerie/Component/TypeCard'
import NewletterIcon from '~/assets/icons/newletter-icon'
import ActualityIcon from '~/assets/icons/actuality-icon'
import { primary } from '~/theme/palette'
import { Stack, StackProps } from '@mui/system'

const messageTypes = [
  {
    id: 'actuality',
    title: 'Actualité',
    subTitle: 'Recommandé',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    icon: <ActualityIcon />,
  },
  {
    id: 'newsletter',
    title: 'Newsletter',
    subTitle: 'Éditeur externe',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    icon: <NewletterIcon />,
  },
]

const TypesContainer = ({ children }: StackProps) => (
  <Stack
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gridGap: '1rem',
    }}
  >
    {children}
  </Stack>
)

interface TypeSelectorProps {
  onChange?: (value: string) => void
}

export default function TypeSelector(props: TypeSelectorProps) {
  const [selectedType, setSelectedType] = React.useState(messageTypes[1].id)
  const setSelectedTypeWithOnChange = (value: string) => {
    setSelectedType(value)
    props.onChange && props.onChange(value)
  }

  const selectedStyle: SxProps<Theme> = {
    borderWidth: 2,
    borderColor: primary.darker,
    borderStyle: 'solid',
  }

  return (
    <ChooseType
      data={messageTypes}
      container={TypesContainer}
      render={({ data, selected }) => (
        <TypeCard
          title={data.title}
          subTitle={data.subTitle}
          description={data.description}
          icon={data.icon}
          sx={selected ? selectedStyle : {}}
        />
      )}
      onChange={setSelectedTypeWithOnChange}
      value={selectedType}
    />
  )
}
