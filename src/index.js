import "./style.css";
import axios from "axios";


async function login() {
    const email = document.getElementById("email")?.value.trim();
    const senha = document.getElementById("senha")?.value.trim();

    if (!email || !senha) {
        alert("⚠️ Preencha email e senha!");
        return;
    }

    try {
        const response = await axios.post("http://localhost:3000/login", {
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
        const token = localStorage.getItem("token");

        const response = await axios.post(
            "http://localhost:3000/agendamentos",
            dados,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        alert("✅ Agendamento realizado com sucesso!");
        limparCampos();

        console.log(response.data);

    } catch (error) {
        console.error(error);
        alert("❌ Erro ao agendar.");
    }
}


function limparCampos() {
    if (document.getElementById('nome')) document.getElementById('nome').value = '';
    if (document.getElementById('servico')) document.getElementById('servico').value = '';
    if (document.getElementById('data')) document.getElementById('data').value = '';
    if (document.getElementById('hora')) document.getElementById('hora').value = '';
}

function verificarLogin() {
    const token = localStorage.getItem("token");

    // se estiver na home e não tiver token → volta pro login
    if (window.location.pathname.includes("home.html") && !token) {
        alert("⚠️ Você precisa estar logada!");
        window.location.href = "login.html";
    }
}

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
