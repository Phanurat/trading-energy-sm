const contractABI = [
    {
        "inputs": [
            { "internalType": "string", "name": "_data", "type": "string" }
        ],
        "name": "setName",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getName",
        "outputs": [
            { "internalType": "string", "name": "", "type": "string" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];


let web3;
let contract;
let userAccount;
let contractAddress = ""; // dynamic

async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        userAccount = accounts[0];
        await loadContracts();
    } else {
        alert("❗ กรุณาติดตั้ง MetaMask");
    }
}

async function loadContracts() {
    const selector = document.getElementById("contractSelector");
    selector.innerHTML = "<option>⏳ กำลังโหลด...</option>";

    try {
        const response = await fetch("/api/contracts"); // ✅ แก้ไข endpoint นี้ให้ตรง backend
        const data = await response.json();

        selector.innerHTML = "";

        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id_contracts;
            option.textContent = `ID ${item.id} - ${item.id_contracts}`;
            selector.appendChild(option);
        });

        // ตั้งค่าตัวแรกเป็น default
        if (data.length > 0) {
            contractAddress = data[0].id_contracts;
            contract = new web3.eth.Contract(contractABI, contractAddress);
            document.getElementById("status").textContent = `📍 ใช้งาน contract ล่าสุด: ${contractAddress}`;
        }
    } catch (err) {
        selector.innerHTML = "<option>⚠️ โหลดไม่สำเร็จ</option>";
        console.error(err);
    }
}

function onContractChange() {
    const selector = document.getElementById("contractSelector");
    contractAddress = selector.value;
    contract = new web3.eth.Contract(contractABI, contractAddress);
    document.getElementById("status").textContent = `📍 ใช้งาน contract: ${contractAddress}`;
}

async function submitOrders() {
    const input = document.getElementById("bulkInput").value;
    const statusDiv = document.getElementById("status");
    statusDiv.style.color = "black";
    statusDiv.textContent = "📡 กำลังส่งข้อมูล...";

    try {
        // ตรวจสอบว่า input เป็น JSON ถูกต้อง
        const parsed = JSON.parse(input);

        // แปลงกลับเป็น JSON string
        const jsonString = JSON.stringify(parsed);
        console.log("📦 JSON String:", jsonString);

        // Encode เป็น Base64
        const base64Encoded = btoa(unescape(encodeURIComponent(jsonString)));
        console.log("🔐 Base64 Encoded:", base64Encoded);

        // ส่งเข้า smart contract
        await contract.methods.setName(base64Encoded).send({ from: userAccount });

        statusDiv.style.color = "green";
        statusDiv.textContent = "✅ ส่งข้อมูลทั้งหมดเรียบร้อยแล้ว!";
    } catch (error) {
        console.error("🚫 Error while submitting:", error);
        statusDiv.style.color = "red";
        statusDiv.textContent = "❌ เกิดข้อผิดพลาด: กรุณาตรวจสอบรูปแบบข้อมูล";
    }
}


async function submitCreateContract() {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    let contractBytecode = "6080604052348015600e575f80fd5b5061062f8061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c806317d7de7c14610038578063c47f002714610056575b5f80fd5b610040610072565b60405161004d9190610183565b60405180910390f35b610070600480360381019061006b91906102e0565b610101565b005b60605f805461008090610354565b80601f01602080910402602001604051908101604052809291908181526020018280546100ac90610354565b80156100f75780601f106100ce576101008083540402835291602001916100f7565b820191905f5260205f20905b8154815290600101906020018083116100da57829003601f168201915b5050505050905090565b805f908161010f919061052a565b5050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f61015582610113565b61015f818561011d565b935061016f81856020860161012d565b6101788161013b565b840191505092915050565b5f6020820190508181035f83015261019b818461014b565b905092915050565b5f604051905090565b5f80fd5b5f80fd5b5f80fd5b5f80fd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6101f28261013b565b810181811067ffffffffffffffff82111715610211576102106101bc565b5b80604052505050565b5f6102236101a3565b905061022f82826101e9565b919050565b5f67ffffffffffffffff82111561024e5761024d6101bc565b5b6102578261013b565b9050602081019050919050565b828183375f83830152505050565b5f61028461027f84610234565b61021a565b9050828152602081018484840111156102a05761029f6101b8565b5b6102ab848285610264565b509392505050565b5f82601f8301126102c7576102c66101b4565b5b81356102d7848260208601610272565b91505092915050565b5f602082840312156102f5576102f46101ac565b5b5f82013567ffffffffffffffff811115610312576103116101b0565b5b61031e848285016102b3565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061036b57607f821691505b60208210810361037e5761037d610327565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026103e07fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826103a5565b6103ea86836103a5565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f61042e61042961042484610402565b61040b565b610402565b9050919050565b5f819050919050565b61044783610414565b61045b61045382610435565b8484546103b1565b825550505050565b5f90565b61046f610463565b61047a81848461043e565b505050565b5b8181101561049d576104925f82610467565b600181019050610480565b5050565b601f8211156104e2576104b381610384565b6104bc84610396565b810160208510156104cb578190505b6104df6104d785610396565b83018261047f565b50505b505050565b5f82821c905092915050565b5f6105025f19846008026104e7565b1980831691505092915050565b5f61051a83836104f3565b9150826002028217905092915050565b61053382610113565b67ffffffffffffffff81111561054c5761054b6101bc565b5b6105568254610354565b6105618282856104a1565b5f60209050601f831160018114610592575f8415610580578287015190505b61058a858261050f565b8655506105f1565b601f1984166105a086610384565b5f5b828110156105c7578489015182556001820191506020850194506020810190506105a2565b868310156105e457848901516105e0601f8916826104f3565b8355505b6001600288020188555050505b50505050505056fea264697066735822122088901aed2d85f2d2ede7f92afa823d86266d5e70a93b40e6b7429ad70ae8681a64736f6c634300081a0033";

    try {
        document.getElementById('status').innerText = 'กำลังติดตั้ง Smart Contract...';

        const contract = new web3.eth.Contract(contractABI); // สร้าง instance ของ smart contract โดยใช้ ABI

        const gasEstimate = await contract.deploy({
            data: contractBytecode // ใช้ bytecode ของ contract
        }).estimateGas({ from: account }); // ประเมินค่าก๊าซที่จะใช้

        const contractDeployment = await contract.deploy({
            data: contractBytecode
        }).send({
            from: account,
            gas: gasEstimate // ใช้ค่าก๊าซที่ประเมินได้
        });

        const contractAddress = contractDeployment.options.address; // ที่อยู่ของ contract ที่ติดตั้งเสร็จ
        console.log(contractAddress);

        document.getElementById('status').innerText = 'ติดตั้ง Smart Contract สำเร็จ!';
        document.getElementById('contractAddress').innerText = 'ที่อยู่ของสัญญา: ' + contractAddress;

        // ส่งข้อมูล contract ไปบันทึกในฐานข้อมูลผ่าน API
        await fetch('/api/contracts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_contracts: contractAddress
            })
        });

    } catch (error) {
        console.error("Error deploying contract:", error);
        document.getElementById('status').innerText = `Error deploying contract: ${error.message}`;
    }
}


window.addEventListener("load", init);