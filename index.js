import { constants, ethers } from "./ethers-5.2.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "Connected"
    } else {
        connectButton.innerHTML = "Please install Metamask!"
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value

    console.log(`Funding with ${ethAmount}`)

    if (typeof window.ethereum !== "undefined") {
        // provider / connection to the blockchain
        // singer / wallet / someoen with some gas
        // contract that we are interacting with
        // ^ ABI & Address

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const singer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, singer)

        try {
            const transacrtionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(transacrtionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transacrtionResponse, provider) {
    console.log(`mining ${transacrtionResponse.hash}...`)

    // create a listener for blockchain

    return new Promise((resolve, reject) => {
        provider.once(transacrtionResponse.hash, (transacrtionReceipt) => {
            console.log(
                `Compleleted with ${transacrtionReceipt.confirmations} confirmations.`
            )

            resolve()
        })
    })
}

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const singer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, singer)

        try {
            const transacrtionResponse = await contract.withdraw()
            await listenForTransactionMine(transacrtionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}
