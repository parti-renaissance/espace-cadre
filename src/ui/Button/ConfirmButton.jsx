import { useState } from 'react'
import Button from 'ui/Button/Button'
import ConfirmationModal from 'ui/Confirmation/ConfrmationModal'

const ConfirmButton = ({ children, onClick }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>{children}</Button>
      {open && (
        <ConfirmationModal
          onCancel={() => setOpen(false)}
          onConfirm={() => {
            onClick()
            setOpen(false)
          }}
          description={'Desc'}
          title={'Confirmation'}
        />
      )}
    </>
  )
}

export default ConfirmButton
