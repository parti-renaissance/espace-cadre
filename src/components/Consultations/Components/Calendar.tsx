import { Designation, DesignationType } from '~/domain/designation'
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { add, differenceInDays, differenceInHours, format, sub } from 'date-fns'

const Calendar = ({ designation }: { designation: Designation | DesignationType }) => (
  <>
    <Typography variant="h6" mt={4}>
      Calendrier prévisionnel
    </Typography>

    <TableContainer component={Paper} sx={{ border: '1px solid #ccc' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date relative</TableCell>
            <TableCell>Date absolue</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Ouverture du vote J-2</TableCell>
            <TableCell>{format(sub(designation.voteStartDate, { days: 2 }), 'dd/MM/yyyy, HH:mm')}</TableCell>
            <TableCell>
              <Stack spacing={2}>
                <Typography>Notification des adhérents par email et push qu’un vote aura lieu.</Typography>
                <Typography>Affichage dans l’espace militant.</Typography>
                <Typography>Impossible de modifier le vote. Impossible d’adhérer pour participer au vote.</Typography>
              </Stack>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Ouverture du vote</TableCell>
            <TableCell>{format(designation.voteStartDate, 'dd/MM/yyyy, HH:mm')}</TableCell>
            <TableCell>
              <Typography>Notification des adhérents par email et push que le vote est ouvert.</Typography>
            </TableCell>
          </TableRow>

          {differenceInDays(designation.voteEndDate, designation.voteStartDate) >= 2 && (
            <TableRow>
              <TableCell>Fin du vote J-1 si durée du vote ≥ 2j</TableCell>
              <TableCell>{format(sub(designation.voteEndDate, { days: 1 }), 'dd/MM/yyyy, HH:mm')}</TableCell>
              <TableCell>
                <Typography>Notification des non-votants par email et push que le vote termine dans 1j.</Typography>
              </TableCell>
            </TableRow>
          )}

          {differenceInHours(designation.voteEndDate, designation.voteStartDate) >= 2 && (
            <TableRow>
              <TableCell>Fin du vote H-1h si durée du vote ≥ 2h</TableCell>
              <TableCell>{format(sub(designation.voteEndDate, { hours: 1 }), 'dd/MM/yyyy, HH:mm')}</TableCell>
              <TableCell>
                <Typography>Notification des non-votants par email et push que le vote termine dans 1h.</Typography>
              </TableCell>
            </TableRow>
          )}

          <TableRow>
            <TableCell>Fin du vote</TableCell>
            <TableCell>{format(designation.voteEndDate, 'dd/MM/yyyy, HH:mm')}</TableCell>
            <TableCell>
              <Typography>Notification des adhérents par email et push que les résultats sont disponibles.</Typography>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Fin du vote J+3</TableCell>
            <TableCell>{format(add(designation.voteEndDate, { days: 3 }), 'dd/MM/yyyy, HH:mm')}</TableCell>
            <TableCell>
              <Typography>Fin de l’affichage dans l’espace militant.</Typography>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Fin du vote J+30</TableCell>
            <TableCell>{format(add(designation.voteEndDate, { days: 30 }), 'dd/MM/yyyy, HH:mm')}</TableCell>
            <TableCell>
              <Typography>Fin de l’accès public aux résultats.</Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </>
)

export default Calendar
