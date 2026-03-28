import "./style.css";
import axios from "axios";

// URL da API (ajuste se necessário)
const API_URL = "http://localhost:3000";

/* =========================
   🔐 LOGIN
========================= */
async function login() {
    const email = document.getElementById("email")?.value.trim();
    const senha = document.getElementById("senha")?.value.trim();

    if (!email || !senha) {
        alert("⚠️ Preencha email e senha!");
        return;
    }

    try {
        const response = await axios.post(`${API_URL}/login`, {
            email,
            senha
        });

        alert("✅ Login realizado com sucesso!");

        // salva token
        localStorage.setItem("token", response.data.token);

        // redireciona
        window.location.href = "home.html";

    } catch (error) {
        console.error(error);
        alert("❌ Email ou senha inválidos!");
    }
}

/* =========================
   📅 AGENDAMENTO
========================= */
function agendar() {
    const nome = document.getElementById('nome')?.value.trim();
    const servico = document.getElementById('servico')?.value;
    const data = document.getElementById('data')?.value;
    const hora = document.getElementById('hora')?.value;

    if (!nome || !servico || !data || !hora) {
        alert("⚠️ Preencha todos os campos!");
        return;
    }

    enviarAgendamento({ nome, servico, data, hora });
}

async function enviarAgendamento(dados) {
    try {
        const response = await axios.post(
            `${API_URL}/agendamentos`,
            dados
        );

        alert("✅ Agendamento realizado com sucesso!");
        limparCampos();

        console.log(response.data);

    } catch (error) {
        console.error(error);
        alert("❌ Erro ao agendar.");
    }
}

/* =========================
   🧹 LIMPAR CAMPOS
========================= */
function limparCampos() {
    if (document.getElementById('nome')) document.getElementById('nome').value = '';
    if (document.getElementById('servico')) document.getElementById('servico').value = '';
    if (document.getElementById('data')) document.getElementById('data').value = '';
    if (document.getElementById('hora')) document.getElementById('hora').value = '';
}

/* =========================
   🔐 VERIFICA LOGIN
========================= */
function verificarLogin() {
    const token = localStorage.getItem("token");

    const pagina = window.location.pathname.split("/").pop();

    console.log("Página atual:", pagina);
    console.log("Token:", token);

    // bloqueia apenas admin.html
    if (pagina === "admin.html" && !token) {
        alert("⚠️ Você precisa estar logada!");
        window.location.href = "login.html";
    }
}

/* =========================
   🚀 INICIALIZAÇÃO
========================= */
document.addEventListener("DOMContentLoaded", () => {

    // botão login
    const btnLogin = document.getElementById("btnLogin");
    if (btnLogin) {
        btnLogin.addEventListener("click", login);
    }

    // botão agendar
    const btnAgendar = document.getElementById("agendar");
    if (btnAgendar) {
        btnAgendar.addEventListener("click", agendar);
    }

    verificarLogin();
});