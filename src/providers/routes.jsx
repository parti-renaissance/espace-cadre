import { Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import paths from '~/shared/paths'
import features from '~/shared/features'
import Spinner from '~/ui/Spinner/Spinner'

import Dashboard from '~/components/Dashboard'
import Activists from '~/components/Activists'
import Messagerie from '~/components/Messagerie'
import MailsStatutory from '~/components/MailsStatutory'
import Elections from '~/components/Elections'
import Ripostes from '~/components/Ripostes'
import Groups from '~/components/Groups'
import News from '~/components/News'
import Phoning from '~/components/Phoning'
import DTD from '~/components/DTD'
import DTDLegislatives from '~/components/DTDLegislatives'
import Surveys from '~/components/Surveys'
import MyTeam from '~/components/MyTeam'
import NoMatch from '~/components/NoMatch'
import Events from '~/components/Events'
import Site from '~/components/Site'
import ElectedRepresentative from '~/components/ElectedRepresentative'
import Formations from '~/components/Formations'
import GeneralReports from '~/components/GeneralReports'
import Committees from '~/components/Committees'
import Documents from '~/components/Documents'
import { useUserScope } from '~/redux/user/hooks'
import MandateListPage from '~/components/Mandates/Pages/MandateListPage'
import MandateMatchPage from '~/components/Mandates/Pages/MandateMatchPage'
import MandateValidationPage from '~/components/Mandates/Pages/MandateValidationPage'
import MandateEditPage from '~/components/Mandates/Pages/MandateEditPage'

const AppPrivateRoutes = () => {
  const location = useLocation()
  const [currentScope] = useUserScope()

  useEffect(() => window.scrollTo(0, 0), [location])
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="*" element={<NoMatch />} />
        <Route path={paths.dashboard} element={currentScope.hasFeature(features.dashboard) && <Dashboard />} />
        <Route path={paths.contacts} element={currentScope.hasFeature(features.contacts) && <Activists />} />
        <Route path={`${paths.messages}/*`} element={currentScope.hasFeature(features.messages) && <Messagerie />} />
        <Route
          path={`${paths.statutory_message}/*`}
          element={currentScope.hasFeature(features.statutory_message) && <MailsStatutory />}
        />
        <Route
          path={`${paths.elected_representative}/*`}
          element={currentScope.hasFeature(features.elected_representative) && <ElectedRepresentative />}
        />
        <Route
          path={`${paths.adherent_formations}/*`}
          element={currentScope.hasFeature(features.adherent_formations) && <Formations />}
        />
        <Route
          path={`${paths.general_meeting_reports}/*`}
          element={currentScope.hasFeature(features.general_meeting_reports) && <GeneralReports />}
        />
        <Route path={`${paths.committee}/*`} element={currentScope.hasFeature(features.committee) && <Committees />} />
        <Route path={`${paths.documents}/*`} element={currentScope.hasFeature(features.documents) && <Documents />} />
        <Route path={paths.elections} element={currentScope.hasFeature(features.elections) && <Elections />} />
        <Route path={paths.ripostes} element={currentScope.hasFeature(features.ripostes) && <Ripostes />} />
        <Route path={`${paths.team}/*`} element={currentScope.hasFeature(features.team) && <Groups />} />
        <Route path={paths.news} element={currentScope.hasFeature(features.news) && <News />} />
        <Route path={`${paths.events}/*`} element={currentScope.hasFeature(features.events) && <Events />} />
        <Route path={`${paths.survey}/*`} element={currentScope.hasFeature(features.survey) && <Surveys />} />
        <Route
          path={`${paths.phoning_campaign}/*`}
          element={currentScope.hasFeature(features.phoning_campaign) && <Phoning />}
        />
        <Route
          path={`${paths.department_site}/*`}
          element={currentScope.hasFeature(features.department_site) && <Site />}
        />
        <Route path={`${paths.pap}/*`} element={currentScope.hasFeature(features.pap) && <DTD />} />
        <Route path={`${paths.pap_v2}/*`} element={currentScope.hasFeature(features.pap_v2) && <DTDLegislatives />} />
        <Route path={`${paths.my_team}/*`} element={currentScope.hasFeature(features.my_team) && <MyTeam />} />

        <Route
          path={paths.procurations}
          element={currentScope.hasFeature(features.procurations) && <MandateListPage />}
        />
        <Route
          path={`${paths.procurations}/request/:id`}
          element={currentScope.hasFeature(features.procurations) && <MandateMatchPage />}
        />
        <Route
          path={`${paths.procurations}/request/:id/link`}
          element={currentScope.hasFeature(features.procurations) && <MandateValidationPage />}
        />
        <Route
          path={`${paths.procurations}/request/:id/edit`}
          element={currentScope.hasFeature(features.procurations) && <MandateEditPage />}
        />
      </Routes>
    </Suspense>
  )
}

export default AppPrivateRoutes
