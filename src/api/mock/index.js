import { createServer } from 'miragejs'

export default ({ environment = 'development' } = {}) =>
  createServer({
    environment,

    routes() {
      this.urlPrefix = `${process.env.REACT_APP_OAUTH_HOST}`

      this.post('/oauth/v2/token', () => ({
        access_token: 'fake_access_token',
        refresh_token: 'fake_refresh_token',
        expires_at: 3600,
        type: 'Bearer',
      }))

      this.urlPrefix = `${process.env.REACT_APP_API_HOST}`
      this.namespace = '/api'

      this.get('/me', () => ({
        firstName: 'Bernard',
        lastName: 'Dupont',
        email: 'bd@exemple.fr',
      }))

      this.passthrough()
    },
  })
