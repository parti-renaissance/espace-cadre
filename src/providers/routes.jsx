import { Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import paths from '~/shared/paths'
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
import Formations from '~/components/Formations'
import GeneralReports from '~/components/GeneralReports'
import Committees from '~/components/Committees'
import Documents from '~/components/Documents'
import { useUserScope } from '~/redux/user/hooks'
import MandateListPage from '~/components/Procurations/Pages/MandateListPage'
import MandateMatchPage from '~/components/Procurations/Pages/MandateMatchPage'
import MandateValidationPage from '~/components/Procurations/Pages/MandateValidationPage'
import MandateEditPage from '~/components/Procurations/Pages/MandateEditPage'
import { FeatureEnum } from '~/models/feature.enum'
import Consultations from '~/components/Consultations'
import Featurebase from '~/components/Featurebase'
import ReferralsRoute from '~/components/Referrals'
import Rentree from '~/components/Rentree'
import RedirectToEaggle from '~/components/Elections/RedirectToEaggle.jsx'

const AppPrivateRoutes = () => {
  const location = useLocation()
  const [currentScope] = useUserScope()

  useEffect(() => window.scrollTo(0, 0), [location])

  return (
    <>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="*" element={<NoMatch />} />
          <Route path={paths.dashboard} element={<Dashboard key={currentScope.key} />} />
          <Route path={paths['featurebase-help-center']} element={<Dashboard />} />
          <Route path={paths['featurebase-requests']} element={<Dashboard />} />
          <Route path={paths.contacts} element={currentScope.hasFeature(FeatureEnum.CONTACTS) && <Activists />} />
          <Route
            path={`${paths.messages}/*`}
            element={currentScope.hasFeature(FeatureEnum.MESSAGES) && <Messagerie />}
          />
          <Route
            path={`${paths.statutory_message}/*`}
            element={currentScope.hasFeature(FeatureEnum.STATUTORY_MESSAGE) && <MailsStatutory />}
          />
          <Route
            path={`${paths.adherent_formations}/*`}
            element={currentScope.hasFeature(FeatureEnum.ADHERENT_FORMATIONS) && <Formations />}
          />
          <Route
            path={`${paths.general_meeting_reports}/*`}
            element={currentScope.hasFeature(FeatureEnum.GENERAL_MEETING_REPORTS) && <GeneralReports />}
          />
          <Route
            path={`${paths.designation}/*`}
            element={currentScope.hasFeature(FeatureEnum.DESIGNATION) && <Consultations />}
          />
          <Route
            path={`${paths.committee}/*`}
            element={currentScope.hasFeature(FeatureEnum.COMMITTEE) && <Committees />}
          />
          <Route
            path={`${paths.documents}/*`}
            element={currentScope.hasFeature(FeatureEnum.DOCUMENTS) && <Documents />}
          />
          <Route path={paths.elections} element={currentScope.hasFeature(FeatureEnum.ELECTIONS) && <Elections />} />
          <Route path={paths.eaggle} element={currentScope.hasFeature(FeatureEnum.EAGGLE) && <RedirectToEaggle />} />
          <Route path={paths.ripostes} element={currentScope.hasFeature(FeatureEnum.RIPOSTES) && <Ripostes />} />
          <Route path={`${paths.team}/*`} element={currentScope.hasFeature(FeatureEnum.TEAM) && <Groups />} />
          <Route path={paths.news} element={currentScope.hasFeature(FeatureEnum.NEWS) && <News />} />
          <Route path={`${paths.events}/*`} element={currentScope.hasFeature(FeatureEnum.EVENTS) && <Events />} />
          <Route path={`${paths.rentree}/*`} element={currentScope.hasFeature(FeatureEnum.RENTREE) && <Rentree />} />
          <Route path={`${paths.survey}/*`} element={currentScope.hasFeature(FeatureEnum.SURVEY) && <Surveys />} />
          <Route
            path={`${paths.phoning_campaign}/*`}
            element={currentScope.hasFeature(FeatureEnum.PHONING_CAMPAIGN) && <Phoning />}
          />
          <Route
            path={`${paths.department_site}/*`}
            element={currentScope.hasFeature(FeatureEnum.DEPARTMENT_SITE) && <Site />}
          />
          <Route path={`${paths.pap}/*`} element={currentScope.hasFeature(FeatureEnum.PAP) && <DTD />} />
          <Route
            path={`${paths.pap_v2}/*`}
            element={currentScope.hasFeature(FeatureEnum.PAP_V2) && <DTDLegislatives />}
          />
          <Route path={`${paths.my_team}/*`} element={currentScope.hasFeature(FeatureEnum.MY_TEAM) && <MyTeam />} />
          <Route
            path={`${paths.referrals}/*`}
            element={currentScope.hasFeature(FeatureEnum.REFERRALS) && <ReferralsRoute />}
          />
          <Route
            path={paths.procurations}
            element={currentScope.hasFeature(FeatureEnum.PROCURATIONS) && <MandateListPage />}
          />
          <Route
            path={`${paths.procurations}/request/:id/:round`}
            element={currentScope.hasFeature(FeatureEnum.PROCURATIONS) && <MandateMatchPage />}
          />
          <Route
            path={`${paths.procurations}/request/:id/:round/link`}
            element={currentScope.hasFeature(FeatureEnum.PROCURATIONS) && <MandateValidationPage />}
          />
          <Route
            path={`${paths.procurations}/request/:id/:round/edit`}
            element={currentScope.hasFeature(FeatureEnum.PROCURATIONS) && <MandateEditPage />}
          />
        </Routes>
      </Suspense>
      {!!currentScope && currentScope.hasFeature(FeatureEnum.FEATUREBASE) && <Featurebase />}
    </>
  )
}

export default AppPrivateRoutes
