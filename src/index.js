import "./style.css";
import axios from "axios";


const API_URL = "http://localhost:3000";


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
        localStorage.setItem("token", response.data.token);

        window.location.href = "admin.html";

    } catch (error) {
        console.error("Erro login:", error?.response?.data || error.message);
        alert("❌ Email ou senha inválidos!");
    }
}

/* =========================
   📅 AGENDAMENTO
========================= */
async function agendar() {
    const nome = document.getElementById("nome")?.value.trim();
    const telefone = document.getElementById("telefone")?.value.trim();
    const servico = document.getElementById("servico")?.value;
    const data = document.getElementById("data")?.value;
    const hora = document.getElementById("hora")?.value;

    if (!nome || !telefone || !servico || !data || !hora) {
        alert("⚠️ Preencha todos os campos!");
        return;
    }

    const response = await axios.post(
            `${API_URL}/modelos`,
            {nome, telefone}
        );   

    enviarAgendamento({
        id_modelo_fk: response.data.id,
        id_servico_fk: servico,
        data_agendamento: data,
        horario_agendamento: hora
    });
}

async function enviarAgendamento(dados) {
    try {
        const response = await axios.post(
            `${API_URL}/agendamentos`,
            dados
        );

        alert("✅ Agendamento realizado com sucesso!");
        limparCampos();

        console.log("Resposta:", response.data);

    } catch (error) {
        console.error("Erro agendamento:", error?.response?.data || error.message);
        alert(error?.response?.data?.mensagem || "❌ Erro ao agendar.");
    }
}

/* =========================
   📋 LISTAR AGENDAMENTOS (ADMIN)
========================= */
async function carregarAgendamentos() {
    const tabela = document.getElementById("agendamentoTableBody");

    if (!tabela) return;

    try {
        const response = await axios.get(`${API_URL}/agendamentos/detalhado`);

        tabela.innerHTML = "";

        response.data.forEach(item => {
            tabela.innerHTML += `
                <tr>
                    <td>${item.nome}</td>
                    <td>${item.nome_servico}</td>
                    <td>${formatarData(item.data_agendamento)}</td>
                    <td>${item.horario_agendamento}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Erro ao carregar:", error);
    }
}

/* =========================
   🧹 LIMPAR CAMPOS
========================= */
function limparCampos() {
    ["nome", "servico", "data", "hora"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
}

/* =========================
   🔐 VERIFICA LOGIN
========================= */
function verificarLogin() {
    const token = localStorage.getItem("token");
    const pagina = window.location.pathname.split("/").pop();

    if (pagina === "admin.html" && !token) {
        alert("⚠️ Você precisa estar logada!");
        window.location.href = "login.html";
    }
}

/* =========================
   📅 FORMATAR DATA
========================= */
function formatarData(data) {
    if (!data) return "";
    return new Date(data).toLocaleDateString("pt-BR");
}


/* =========================
   🚀 INICIALIZAÇÃO
========================= */
document.addEventListener("DOMContentLoaded", () => {

    const btnLogin = document.getElementById("btnLogin");
    if (btnLogin) btnLogin.addEventListener("click", login);

    const btnAgendar = document.getElementById("agendar");
    if (btnAgendar) btnAgendar.addEventListener("click", agendar);

    verificarLogin();
    carregarAgendamentos();
});