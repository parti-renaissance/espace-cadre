import { Route, Routes } from 'react-router-dom'
import Documents from './Documents'

const DocumentsRoutes = () => (
  <Routes>
    <Route path="*" element={<Documents />} />
  </Routes>
)

export default DocumentsRoutes
