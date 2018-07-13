# Ark-Faucet

This is a full front/backend implementation of a cryptocurrency faucet for Ark written in Node using the Express framework.

# Introduction

<p align="center">
    <a href="https://arkcommunity.fund/"><img src="https://arkcommunity.fund/media-kit/funded/banner.png" /></a>
</p>

## Getting Started

First and foremost, you will need a MySQL server installed. Once the database server is running, create the ArkFaucet tables by running `db.sql` located inside the `DataModel` directory.

Then, familiarize yourself with `config.json`
```
{
    "node": "5.39.9.240",
    "port": 80,
    "payPerClick": 0.05,
    "cooldown": 3600,
    "paySchedule": "0 01 0 * * *",
    "payMinimum": 1.1,
    "txFee": 0.1,
    "log": "tx.log",
    "database": {
        "username": "arkfaucet",
        "password": "test"
    },
    "recaptcha": {
        "siteKey": "",
        "secretKey": ""
    }
}
```
- `node` - The IP address of the Ark node the backend will use to query Ark's blockchain
- `port` - The port the server will listen on
- `payPerClick` - How much Ark to credit users per use of the faucet
- `cooldown` - How long users have to wait before using the faucet again (in seconds)
- `paySchedule` - When the faucet automatically pays out, in cron format
- `payMinimum` - The minimum balance users must accrue before they are paid out
- `txFee` - The transaction fee to be subtracted from users' payouts. Set to 0 if you want to pay their transaction fees.
- `log` - Filename of log file
- `database:username` - MySQL username
- `database:password` - MySQL password
- `recaptcha:siteKey` - ReCaptcha site key
- `recaptcha:secretKey` - ReCaptcha secret key


### Installation and Usage
First, remember to prepare your MySQL database as mentioned above and insert your credentials and other settings in ```config.json```
1) Clone this repository
2) ```cd Ark-Faucet```
3) ```npm install```

#### Command line usage:
`node server --pass "Your Faucet Passphrase"`

If applicable, you can also put in your second passphrase:  `node server --pass "Your Faucet Passphrase" --secPass "Your Faucet Multisig"`

Note: You will need to run as root if you want the web server to listen on port `80`

### Frontend

This project includes a reference UI that's served automatically in the `frontend` directory. You can test it out by going to `http://localhost` or `http://localhost:PORT`

![alt text](https://i.imgur.com/BW5q73T.jpg)

![alt text](https://i.imgur.com/ZlneqUW.jpg)



## Authors

* **Eugene Li** - [eugeneli](https://github.com/eugeneli)

See also the list of [contributors](https://github.com/eugeneli/Ark-Faucet/graphs/contributors) who participated in this project.

## License

The MIT License (MIT)

Copyright (c) 2017 Eugene Li

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
