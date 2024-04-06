import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { setSettings, setMainPage } from './js/modules/expressSetup.js'

/**
 * Set up the express server
 */
async function setUpExpressServer () {
  const app = express()
  const httpServer = createServer(app)
  const io = new Server(httpServer)
  const port = process.env.PORT || 3000
  console.log('Setting up server')

  setSettings(app)
  setMainPage(app, io)

  httpServer.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`) // TODO: Probably need to change this later
  })
}

setUpExpressServer()
