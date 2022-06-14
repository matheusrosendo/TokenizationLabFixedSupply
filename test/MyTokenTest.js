const Token = artifacts.require("MyToken");
const MyTokenSale = artifacts.require("MyTokenSale");

var chai = require("chai");
const BN = web3.utils.BN;
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);

var chaiAsPromissed = require("chai-as-promised");
chai.use(chaiAsPromissed);

const expect = chai.expect;

contract ("Token Test", async (accounts) => {
    const [ initialHolder, recipient, anotherAccount ] = accounts;
    const maxSupply = 1000000000;

    //call before each test unit, it can redeploy de contract
    beforeEach( async() => {
        this.myToken = await Token.new(maxSupply);
    })

    it("all tokens should be in myTokenSale account", async() => {
        let instance = await this.myToken;
        let totalSupply = await instance.totalSupply();
        //essa seria a primeira forma de fazer
        //let balance = await instance.balanceOf(accounts[0]);
        //assert.equal(balance.valueOf(), initialSupply.valueOf(), "Balance was not the same")
        
        //essa a segunda, sem usar o chai as promisse
        //expect(await instance.balanceOf(accounts[0])).to.be.a.bignumber.equal(totalSupply);

        //essa a terceira usando o chai as promisse
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);

    });

    it("I can send tokens from Account 1 to Account 2", async () => {
        const sendTokens = 1;
        let instance = await this.myToken;
        let totalSupply = await instance.totalSupply();
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
        await expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;      
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        await expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
      });
  
  
      it("It's not possible to send more tokens than account 1 has", async () => {
        let instance = await this.myToken;
        let balanceOfAccount = await instance.balanceOf(initialHolder);
        await expect(instance.transfer(recipient, new BN(balanceOfAccount+1))).to.eventually.be.rejected;
  
        //check if the balance is still the same
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(balanceOfAccount);
  
      });

})

