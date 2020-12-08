const assert = require('assert')
const PasswordHelper = require('../helper/passwordHelper')

const senhaForte = '123456'
const hashSenhaForte ='$2b$04$vrcwZAv4/2ldWaPGo8VOPe.ZZQOM3W7ywZhbcr6Q1kpCWdaBCG0xW'

describe('UserHelper test suite', function () {
    it('Deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(senhaForte)
        console.log(`Senha gerada: ${result}`)
        assert.ok(result.length > 10)
    })

    it('Deve validar a senha', async () =>{
        const result = await PasswordHelper.comparePassword(senhaForte, hashSenhaForte)
        assert.ok(result)
    })
})