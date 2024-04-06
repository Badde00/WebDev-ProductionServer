import express from 'express'
import ejs from 'ejs'
import path from 'path'
import session from 'express-session'
import { fetchIssues } from './api-connection.js'
import dotenv from 'dotenv'
import { Server } from 'socket.io' // Only for the linting typing...
dotenv.config()

/**
 * Set the settings for the express server
 * @param {express} app The express app
 */
export function setSettings (app) {
  app.use(express.static('src/css'))
  app.set('view engine', 'html')
  app.engine('html', ejs.renderFile)
  app.set('views', path.join(path.resolve(), 'src/ejsFiles'))
  app.use(session({
    secret: process.env.WEBHOOK_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))
  app.use(express.urlencoded({ extended: true }))
  console.log('Settings set')
}

/**
 * Set the main page and webhook
 * @param {express} app The express app
 * @param {Server} io The socket.io server
 */
export function setMainPage (app, io) {
  app.get('/', async (req, res) => {
    const issues = await fetchIssues()
    res.render('home.ejs', { issues })
  })
  console.log('Main page set')

  app.post('/webhook', async (req, res) => {
    console.log('Webhook received')

    // Check if the request is from GitLab
    if (req.headers['User-Agent'] && req.headers['User-Agent'].includes('GitLab')) {
      console.log('Invalid User-Agent')
      return res.sendStatus(403)
    }

    const token = req.headers['x-gitlab-token']

    // Check if the token is correct
    if (token !== process.env.WEBHOOK_SECRET_TOKEN) {
      console.log('Invalid token')
      return res.sendStatus(403)
    }

    const issues = await fetchIssues()
    if (!Array.isArray(issues)) {
      console.log('Issues is not an array')
    } else {
      io.emit('update', issues)
    }
    console.log('Webhook sent to clients')
    res.sendStatus(200)
  })
}
