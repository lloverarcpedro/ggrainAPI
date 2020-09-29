/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import usersRoutes from './users-routes'
import ccRoutes from './cc-routes'
import grainchainRoutes from './grainchain-routes'
import loadRoutes from './load-routes'
import {Application} from 'express'

export default (app: Application) => {
    app.use('/api/users', usersRoutes)
    app.use('/api/cc', ccRoutes)
    app.use('/api/grainchain', grainchainRoutes)
    app.use('/api/loads', loadRoutes)
}