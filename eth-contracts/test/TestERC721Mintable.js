const ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const account_four = accounts[3];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
            await this.contract.mint(account_two, 1, {from: account_one});
            await this.contract.mint(account_three, 2, {from: account_one});
            await this.contract.mint(account_four, 3, {from: account_one});
        })

        it('should return total supply', async function () { 
            const supply = await this.contract.totalSupply.call();

            assert.equal(supply, 3, "Total supply incorrect");
        })

        it('should get token balance', async function () { 
            const balance = await this.contract.balanceOf.call(account_two);

            assert.equal(balance, 1, "Token balance incorrect");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const tokenURI = await this.contract.tokenURI.call(1);
            const expectedTokenURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1"
            assert.equal(tokenURI, expectedTokenURI, "Invalid token URI");

        })

        it('should transfer token from one owner to another', async function () { 
            let eventTriggered = false;
            await this.contract.Transfer((err, res) => {
                eventTriggered = true;
            })

            await this.contract.transferFrom(account_three, account_four, 2, {from: account_three});
            const ownerOfToken = await this.contract.ownerOf.call(2);
            const tokenBalance = await this.contract.balanceOf.call(account_four);

            assert.equal(ownerOfToken, account_four, "Token owner incorrect");
            assert.equal(tokenBalance, 2, "Token owner incorrect");
            assert.equal(eventTriggered, true, "Transfer event not triggered");

        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () {
            let failed = false;
            try {
                await this.contract.mint(account_two, 4, {from: account_two});
            } catch (err) {
                failed = true;
            }

            assert.equal(failed, true, "Minting should fail if sender is not owner");
        })

        it('should return contract owner', async function () { 
            const owner = await this.contract.getOwner.call();

            assert.equal(owner, account_one, "Contract owner invalid");
        })

    });
})