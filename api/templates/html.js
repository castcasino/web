/**
 * HTML Email Template
 */
const htmlTemplate = (_msgDetails) => {
    return `
        <h2>Layer1Guru Event</h2>

        <p>
            i have a <strong>BOLD</strong> body!
        </p>

        <p>
            We just saw a transaction on your watched wallet.
            <br>
            <a href="https://explorer.guru.org/tx/${_msgDetails.txid}">
                ${_msgDetails.txid}
            </a>
        </p>

        <div style="text-align: center;">
            <hr />

            <a href="https://layer1.guru" style="text-decoration: none;">
                https://layer1.guru
            </a>

            <br />
            brought to you with ❤️ from
            <a href="https://avasdao.org" style="text-decoration: none;">Ava's DAO</a>
        </div>
    `
}

/* Export module. */
module.exports = htmlTemplate
