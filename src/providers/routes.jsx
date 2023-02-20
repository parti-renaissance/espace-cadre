import { Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getAuthorizedPages } from '../redux/user/selectors'

import paths from 'shared/paths'
import features from 'shared/features'
import Spinner from 'ui/Spinner/Spinner'

import Dashboard from 'components/Dashboard'
import Activists from 'components/Activists'
import Messagerie from 'components/Messagerie'
import Elections from 'components/Elections'
import Ripostes from 'components/Ripostes'
import Groups from 'components/Groups'
import News from 'components/News'
import Phoning from 'components/Phoning'
import DTD from 'components/DTD'
import DTDLegislatives from 'components/DTDLegislatives'
import Surveys from 'components/Surveys'
import MyTeam from 'components/MyTeam'
import NoMatch from 'components/NoMatch'
import Events from 'components/Events'
import Site from 'components/Site'
import ElectedRepresentative from 'components/ElectedRepresentative'
import Formations from 'components/Formations'
import GeneralReports from 'components/GeneralReports'
import Committees from 'components/Committees'

const AppPrivateRoutes = () => {
  const location = useLocation()
  const authorizedFeatures = useSelector(getAuthorizedPages)

  useEffect(() => window.scrollTo(0, 0), [location])
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="*" element={<NoMatch />} />
        <Route path={paths.dashboard} element={authorizedFeatures.includes(features.dashboard) && <Dashboard />} />
        <Route path={paths.contacts} element={authorizedFeatures.includes(features.contacts) && <Activists />} />
        <Route
          path={`${paths.messages}/*`}
          element={authorizedFeatures.includes(features.messages) && <Messagerie />}
        />
        <Route
          path={`${paths.elected_representative}/*`}
          element={authorizedFeatures.includes(features.elected_representative) && <ElectedRepresentative />}
        />
        <Route
          path={`${paths.adherent_formations}/*`}
          element={authorizedFeatures.includes(features.adherent_formations) && <Formations />}
        />
        <Route
          path={`${paths.general_meeting_reports}/*`}
          element={authorizedFeatures.includes(features.general_meeting_reports) && <GeneralReports />}
        />
        <Route
          path={`${paths.committee}/*`}
          element={authorizedFeatures.includes(features.committee) && <Committees />}
        />
        <Route path={paths.elections} element={authorizedFeatures.includes(features.elections) && <Elections />} />
        <Route path={paths.ripostes} element={authorizedFeatures.includes(features.ripostes) && <Ripostes />} />
        <Route path={`${paths.team}/*`} element={authorizedFeatures.includes(features.team) && <Groups />} />
        <Route path={paths.news} element={authorizedFeatures.includes(features.news) && <News />} />
        <Route path={`${paths.events}/*`} element={authorizedFeatures.includes(features.events) && <Events />} />
        <Route path={`${paths.survey}/*`} element={authorizedFeatures.includes(features.survey) && <Surveys />} />
        <Route
          path={`${paths.phoning_campaign}/*`}
          element={authorizedFeatures.includes(features.phoning_campaign) && <Phoning />}
        />
        <Route
          path={`${paths.department_site}/*`}
          element={authorizedFeatures.includes(features.department_site) && <Site />}
        />
        <Route path={`${paths.pap}/*`} element={authorizedFeatures.includes(features.pap) && <DTD />} />
        <Route
          path={`${paths.pap_v2}/*`}
          element={authorizedFeatures.includes(features.pap_v2) && <DTDLegislatives />}
        />
        <Route path={`${paths.my_team}/*`} element={authorizedFeatures.includes(features.my_team) && <MyTeam />} />
      </Routes>
    </Suspense>
  )
}

export default AppPrivateRoutes
