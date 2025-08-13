import { Route, Routes } from 'react-router-dom'
import List from '~/components/Rentree/List'

const Rentree = () => (
  <Routes>
    <Route path="*" element={<List />} />
  </Routes>
)

export default Rentree
