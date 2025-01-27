import { LabelTypeModel } from '~/models/activist.model'
import { UIChip } from '~/ui/Card'
import { fontWeight } from '~/theme/typography'
import { Stack } from '@mui/material'
import { v1 as uuid } from 'uuid'

const chipShape = (tag: LabelTypeModel) => {
  if (tag.code?.includes(':a_jour_' + new Date().getFullYear())) {
    return {
      color: '#8E681E',
      bgcolor: '#FFECCC',
    }
  }

  if (tag.code?.includes(':plus_a_jour')) {
    return {
      color: '#0F72BD',
      bgcolor: '#D6E7FF',
    }
  }

  if (tag.type === 'elu') {
    return {
      color: '#C85D3C',
      bgcolor: '#FCE7E9',
    }
  }

  if (tag.type === 'sympathisant') {
    return {
      color: '#32819C',
      bgcolor: '#E3F8FF',
    }
  }

  if (tag.type === 'role') {
    return {
      color: '#714991',
      bgcolor: '#ECE2FF',
    }
  }

  if (tag.type === 'static') {
    return {
      color: '#DFE3E8',
      bgcolor: '#525E6A',
    }
  }

  return {
    color: '#525E6A',
    bgcolor: '#DFE3E8',
  }
}

const TagsList = ({ tags }: { tags: LabelTypeModel[] }) => (
  <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap' }} spacing={1}>
    {tags.map(tag => (
      <UIChip
        labelStyle={{ fontSize: '14px', fontWeight: fontWeight.medium }}
        key={uuid()}
        label={tag.label}
        variant="contained"
        {...chipShape(tag)}
      />
    ))}
  </Stack>
)

export default TagsList
