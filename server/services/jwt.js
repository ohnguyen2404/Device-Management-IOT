const fs = require('fs')
const jwt = require('jsonwebtoken')

const privateKEY = fs.readFileSync('./private.key', 'utf-8')
const publicKEY = fs.readFileSync('./public.key', 'utf-8')

module.exports = {
  sign: (payload, $Options) => {
    // Token signing options
    const signOptions = {
      issuer: $Options.issuer,
      subject: $Options.subject,
      audience: $Options.audience,
      expiresIn: '30d', // 30 days validity
      algorithm: 'RS256'
    }

    return jwt.sign(payload, privateKEY, signOptions)
  },

  verify: (token, $Options) => {
    const verifyOptions = {
      issuer: $Options.issuer,
      subject: $Options.subject,
      audience: $Options.audience,
      expiresIn: '30d',
      algorithm: ["RS256"]
    }

    try {
      return jwt.verify(token, publicKEY, verifyOptions)
    }
    catch (err) {
      console.log(err)
      return false
    }
  },

  decode: (token) => {
    return jwt.decode(token, {complete: true})
    // will return null if token is invalid
  }

}
