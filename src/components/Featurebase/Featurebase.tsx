import { useEffect } from 'react'
import useScript from 'react-script-hook'
import { APP_ENVIRONMENT } from '~/shared/environments'
import { useSelector } from 'react-redux'
import { getCurrentUser } from '~/redux/user/selectors'
import { useFeaturebaseToken } from '~/redux/auth/hooks'

/**
 * @see https://help.featurebase.app/en/articles/1127499-install-the-all-in-one-widget
 */
const Featurebase = () => {
  if (APP_ENVIRONMENT === 'dev') {
    return null
  }

  const currentUser = useSelector(getCurrentUser)
  const [featurebaseToken, enableFeaturebase] = useFeaturebaseToken()

  useEffect(() => {
    if (!currentUser || !featurebaseToken) {
      enableFeaturebase()
      return
    }

    const win = window as any

    if (typeof win.Featurebase !== 'function') {
      win.Featurebase = function () {
        // eslint-disable-next-line prefer-rest-params,no-extra-semi
        ;(win.Featurebase.q = win.Featurebase.q || []).push(arguments)
      }
    }

    const mainConfig = {
      organization: 'partirenaissance',
      locale: 'fr',
      theme: 'light',
      usersName: `${currentUser?.firstName} ${currentUser?.lastName}`,
      email: currentUser.emailAddress,
      jwtToken: featurebaseToken,
    }

    // Initialize Main widget with all features
    win.Featurebase('initialize_portal_widget', {
      ...mainConfig,
      initialPage: 'MainView',
    })

    // Initialize Changelog widget (popup)
    win.Featurebase('initialize_changelog_widget', {
      ...mainConfig,
      fullscreenPopup: true,
    })

    // Initialize Feedback widget
    win.Featurebase('initialize_feedback_widget', {
      ...mainConfig,
      defaultBoard: '✨ Espace cadre',
    })
  }, [currentUser, enableFeaturebase, featurebaseToken])

  // Use this hook instead of <script> tag as it is in canary mode : https://react.dev/reference/react-dom/components/script
  useScript({ src: 'https://do.featurebase.app/js/sdk.js', id: 'featurebase-sdk' })
}

export default Featurebase
