import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const PollingStationSelect = ({ formik }) => {
  const [isCheck, setIsCheck] = useState([])

  const handleIsCheck = () => {
    setIsCheck(isCheck => [...isCheck, { id: Math.floor(Math.random() * 10) }])
  }

  useEffect(() => {
    if (isCheck.length > 0) {
      formik.setFieldValue('isCheck', isCheck)
    }
  }, [isCheck])

  return (
    <>
      <span>Nombre de BV: {isCheck.length}</span>
      <br />
      <button onClick={handleIsCheck}>Ajouter BV</button>
    </>
  )
}

export default PollingStationSelect

PollingStationSelect.propTypes = {
  formik: PropTypes.func,
}
