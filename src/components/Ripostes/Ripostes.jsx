import React, { useEffect, useState } from 'react'
import {
    Button, Container, createStyles, Grid, makeStyles,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import RiposteCard from './Riposte'
import RiposteModal from './RiposteModal'
import Riposte from '../../domain/riposte'
import { getRipostes, updateRiposte } from '../../api/ripostes'

const useStyles = makeStyles((theme) => createStyles({
    riposteContainer: {
        marginBottom: theme.spacing(2),
    },
    pageTitle: {
        fontSize: '24px',
        fontWeight: '400',
        color: theme.palette.gray800,
    },
    buttonContainer: {
        background: theme.palette.riposteBackground,
        borderRadius: '8.35px',
        marginBottom: theme.spacing(4),
    },
    icon: {
        marginRight: '8px',
    },
    createButton: {
        color: theme.palette.teal700,
        padding: theme.spacing(0.75, 1),
    },
    root: {
        padding: theme.spacing(2),
        borderRadius: '8.35px',
    },
}))

const Ripostes = () => {
    const classes = useStyles()
    const [ripostes, setRipostes] = useState([])
    const [newRiposte, setNewRiposte] = useState(null)
    const [open, setOpen] = useState(false)

    const handleClickOpen = (id) => {
        setNewRiposte(ripostes.find((riposte) => riposte.id === id) || null)
        setOpen(true)
    }

    const toggleEnableRiposte = async (id) => {
        const riposte = ripostes.find((r) => r.id === id)
        const newRiposte = riposte.toggleEnabled()
        setRipostes((prev) => prev
            .filter((r) => r.id !== id)
            .concat(newRiposte)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
        await updateRiposte(newRiposte)
        getRipostes(setRipostes)
    }

    const handleNewRiposte = () => {
        setNewRiposte(Riposte.NULL())
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    useEffect(() => {
        getRipostes(setRipostes)
    }, [])

    return (
        <Container maxWidth="lg" className={classes.riposteContainer}>
            <Grid container justifyContent="space-between">
                <Grid item className={classes.pageTitle}>
                    Riposte
                </Grid>
                <Grid item className={classes.buttonContainer}>
                    <Button className={classes.createButton} onClick={handleNewRiposte}>
                        <AddIcon className={classes.icon} />Créer une riposte
                    </Button>
                </Grid>
                <Grid container spacing={2}>
                    {ripostes.map((r) => (
                        <RiposteCard
                            key={r.id}
                            riposte={r}
                            handleClickOpen={handleClickOpen}
                            toggleEnabled={toggleEnableRiposte}
                        />
                    ))}
                </Grid>
                <RiposteModal
                    open={open}
                    handleClose={handleClose}
                    riposte={newRiposte}
                    onSubmitRefresh={() => {
                        getRipostes(setRipostes)
                    }}
                />
            </Grid>
        </Container>
    )
}

export default Ripostes
