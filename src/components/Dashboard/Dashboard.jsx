import { Container as MuiContainer, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import KpiEmailCampaign from './Charts/KpiEmailCampaign/KpiEmailCampaign'
import TextChart from './Charts/TextChart/TextChart'
import PageTitle from '~/ui/PageTitle'
import { useUserScope } from '../../redux/user/hooks'
import EmptyContent from '~/ui/EmptyContent'
import scopes from '~/shared/scopes'

const Container = styled(MuiContainer)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const messages = {
  title: "Vue d'ensemble",
  upcoming: 'Bientôt en ligne',
  description: 'Cette page sera bientôt disponible sur notre site !',
}

const upcomingFeatureScopes = [scopes.phoning_national_manager, scopes.pap_national_manager]

const Dashboard = () => {
  const [currentScope] = useUserScope()

  if (currentScope.isAnimator()) {
    return (
      <Container>
        <Grid container sx={{ justifyContent: 'center' }}>
          <Grid item xs={6}>
            <Typography component="p" sx={{ mb: 2 }}>
              Félicitations pour votre élection en tant que Responsable de votre comité local ! Votre rôle est crucial
              dans la mise en place et l&apos;organisation de projets locaux importants pour nos adhérents. Nous sommes
              convaincus que vous apporterez votre expertise et votre détermination pour mener à bien ces projets.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
              Nous vous mettons à disposition plusieurs outils pour vous aider dans votre rôle de Responsable.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
              Tout d&apos;abord, un outil de messagerie vous permettra de communiquer facilement avec les membres de
              votre comité local. De plus, un outil vous facilitera l&apos;accès aux informations de contact de
              l&apos;ensemble des militants de votre comité. Enfin, vous aurez la possibilité de créer des évènements
              pour mobiliser vos adhérents et les impliquer dans des projets locaux.
            </Typography>

            <Typography component="p" sx={{ mb: 2 }}>
              Nous avons hâte de voir les résultats de votre travail et sommes là pour vous soutenir dans vos projets.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    )
  }

  if (upcomingFeatureScopes.includes(currentScope.code)) {
    return <EmptyContent title={messages.upcoming} description={messages.description} />
  }

  return (
    <Container maxWidth={false}>
      <Grid container>
        <PageTitle title={messages.title} breakpoints={{ xs: 12 }} />
        <TextChart />
        <KpiEmailCampaign />
      </Grid>
    </Container>
  )
}

export default Dashboard
