const token = localStorage.getItem("token");

if (!token) {
  alert("Você precisa estar logado para acessar esta página.");
  window.location.href = "loginpaciente.html";
}

// Função para decodificar o token
function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    console.error("Erro ao decodificar token:", e);
    return null;
  }
}

// Buscar médicos da especialidade
async function carregarMedicos() {
  try {
    const res = await fetch("http://localhost:8080/medicos", {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar médicos");
    }

    const medicos = await res.json();
    const lista = document.getElementById("lista-medicos");

    lista.innerHTML = "";

    const cardiologistas = medicos.filter(m => m.especialidade === "Cardiologia");

    if (cardiologistas.length === 0) {
      lista.innerHTML = "<p>Nenhum médico de Cardiologia encontrado.</p>";
      return;
    }

    cardiologistas.forEach(m => {
      const card = document.createElement("div");
      card.className = "medico-card";
      card.innerHTML = `
        <h3>${m.nome}</h3>
        <p>Especialidade: ${m.especialidade}</p>
        <label for="data-${m.id}">Data:</label>
        <input type="date" id="data-${m.id}" />
        <label for="hora-${m.id}">Hora:</label>
        <input type="time" id="hora-${m.id}" />
        <button onclick="agendarConsulta(${m.id})">Agendar</button>
      `;
      lista.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    alert("Erro ao carregar médicos");
  }
}

// Agendar consulta
async function agendarConsulta(idMedico) {
  const data = document.getElementById(`data-${idMedico}`).value;
  const hora = document.getElementById(`hora-${idMedico}`).value;

  if (!data || !hora) {
    alert("Por favor, preencha a data e hora.");
    return;
  }

  const dataHora = `${data}T${hora}`;

  const decoded = parseJwt(token);
  const idPaciente = decoded?.sub;

  if (!idPaciente) {
    alert("Erro ao identificar o paciente. Faça login novamente.");
    window.location.href = "loginpaciente.html";
    return;
  }

  const atendimento = {
    idPaciente,
    idMedico,
    dataAtendimento: dataHora,
    sala: "01"
  };

  try {
    const res = await fetch("http://localhost:8080/atendimentos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(atendimento)
    });

    if (!res.ok) {
      throw new Error("Erro ao agendar consulta");
    }

    alert("Consulta agendada com sucesso!");
  } catch (err) {
    console.error(err);
    alert("Erro ao agendar consulta");
  }
}

// Inicia carregamento ao abrir
carregarMedicos();
