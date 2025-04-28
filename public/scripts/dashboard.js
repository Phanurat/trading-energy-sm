const contractABI = [
    {
        "inputs": [{ "internalType": "string", "name": "_data", "type": "string" }],
        "name": "setName",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getName",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    }
];

let web3;
let contract;

async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        await loadContractOptions();
    } else {
        alert("⚠️ กรุณาติดตั้ง MetaMask ก่อนใช้งาน");
    }
}

async function loadContractOptions() {
    const selector = document.getElementById("contractSelector");
    selector.innerHTML = "<option>⏳ กำลังโหลด...</option>";

    try {
        const response = await fetch("/api/contracts"); // ✅ เปลี่ยน endpoint นี้ตาม backend ของคุณ
        const data = await response.json();

        selector.innerHTML = "";

        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id_contracts;
            option.textContent = `ID ${item.id} - ${item.id_contracts}`;
            selector.appendChild(option);
        });

        selector.addEventListener("change", onContractChange);
        if (data.length > 0) {
            await onContractChange(); // load ครั้งแรกเลย
        }

    } catch (err) {
        console.error("❌ โหลดรายชื่อ contract ไม่สำเร็จ:", err);
        document.getElementById("status").textContent = "❌ โหลด contract จากฐานข้อมูลล้มเหลว";
    }
}

async function onContractChange() {
    const address = document.getElementById("contractSelector").value;
    contract = new web3.eth.Contract(contractABI, address);
    console.log("📦 Loaded contract:", address);
    document.getElementById("status").textContent = `📍 แสดงข้อมูลจาก: ${address}`;
    await loadOrders();
}

async function loadOrders() {
    const list = document.getElementById("orderList");
    list.innerHTML = "";
    const status = document.getElementById("status");

    try {
        const encoded = await contract.methods.getName().call();
        console.log("📦 Encoded:", encoded);

        const decoded = JSON.parse(atob(encoded));
        console.log("🔓 Decoded:", decoded);

        decoded.forEach(order => {
            const li = document.createElement("li");
            li.innerHTML = `
          🆔 Order ID: <strong>${order[0]}</strong><br>
          📅 Date: ${order[1]}<br>
          🧾 Type: ${order[2]}<br>
          📌 Status: ${order[3]}<br>
          ⚡ Energy: ${order[4]} kWh<br>
          💸 Avg Price: ${order[5]} THB<br>
          💰 Total: ${order[6]} THB
        `;
            list.appendChild(li);
        });

        status.textContent = `✅ โหลดข้อมูลแล้ว (${decoded.length} รายการ)`;

    } catch (err) {
        console.error("❌ Error:", err);
        status.textContent = "❌ ไม่สามารถแสดงข้อมูล (ข้อมูลอาจยังไม่มีหรือผิดพลาด)";
    }
}

init();