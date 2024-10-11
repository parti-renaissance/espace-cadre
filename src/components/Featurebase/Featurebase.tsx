import { useEffect } from 'react'
import useScript from 'react-script-hook'

/**
 * @see https://help.featurebase.app/en/articles/1127499-install-the-all-in-one-widget
 */
const Featurebase = () => {
  useEffect(() => {
    const win = window as any

    if (typeof win.Featurebase !== 'function') {
      win.Featurebase = function () {
        // eslint-disable-next-line prefer-rest-params,no-extra-semi
        ;(win.Featurebase.q = win.Featurebase.q || []).push(arguments)
      }
    }

    win.Featurebase('initialize_portal_widget', {
      organization: 'partirenaissance', // Replace this with your organization name, copy-paste the subdomain part from your Featurebase workspace url (e.g. https://*yourorg*.featurebase.app)
      placement: 'right', // optional
      fullScreen: false, // optional
      initialPage: 'MainView', // optional (MainView, RoadmapView, CreatePost, PostsView, ChangelogView, HelpView)
      locale: 'fr', // Change the language, view all available languages from https://help.featurebase.app/en/articles/8879098-using-featurebase-in-my-language
      metadata: null, // Attach session-specific metadata to feedback. Refer to the advanced section for the details: https://help.featurebase.app/en/articles/3774671-advanced#7k8iriyap66
    })
  }, [])

  // Use this hook instead of <script> tag as it is in canary mode : https://react.dev/reference/react-dom/components/script
  useScript({ src: 'https://do.featurebase.app/js/sdk.js', id: 'featurebase-sdk' })
}

export default Featurebase
