import express from 'express'
import App from "./app";

const PORT = process.env.PORT || 7777

const debugMode = true;

new App(express(), debugMode).server.listen(PORT, () => {
    console.log('Listening Port: ' + PORT)
})