import PropTypes from 'prop-types'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

const QueryProvider = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

QueryProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default QueryProvider
