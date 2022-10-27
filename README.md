# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

`npm install`

`npm start`

## Publish hello_blockchain to your address

`cd aptos-move/move-examples/hello_blockchain`

`aptos init`

`aptos move publish --named-addresses hello_blockchain=default`

Then you can copy and paste your private key in
`aptos-move/move-examples/hello_blockchain/.aptos/config.yaml`
to your browser wallet

### Reference

https://aptos.dev/tutorials/your-first-dapp#add-the-aptos-dependency-to-packagejson
