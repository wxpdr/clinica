const token = localStorage.getItem("token");

if (!token) {
  alert("Você precisa estar logado para acessar esta página.");
  window.location.href = "loginpaciente.html";
}

// Função para decodificar o token e extrair o ID (sub)
function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    console.error("Erro ao decodificar token:", e);
    return null;
  }
}

// Buscar dados do paciente logado (nome + ID do token)
async function buscarPerfil() {
  const decoded = parseJwt(token);
  const id = decoded?.sub;

  if (!id) {
    alert("Erro ao identificar o paciente. Faça login novamente.");
    window.location.href = "loginpaciente.html";
    return;
  }

  const res = await fetch("http://localhost:8080/usuarios/perfil", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar perfil");
  }

  const perfil = await res.json();
  perfil.id = id; // insere o ID manualmente no perfil retornado
  return perfil;
}

// Carregar as consultas do paciente
async function carregarConsultas() {
  try {
    const perfil = await buscarPerfil();

    document.getElementById("nome-paciente").textContent = `Olá, ${perfil.nome}`;

    const res = await fetch(`http://localhost:8080/atendimentos/paciente/${perfil.id}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar atendimentos");
    }

    const consultas = await res.json();
    const lista = document.getElementById("lista-consultas");
    lista.innerHTML = "";

    if (consultas.length === 0) {
      lista.innerHTML = "<p>Nenhuma consulta marcada.</p>";
      return;
    }

    consultas.forEach((c) => {
      const card = document.createElement("div");
      card.className = "consulta-card";
      card.innerHTML = `
        <h3>Com Dr(a). ${c.nomeMedico}</h3>
        <p>Especialidade: ${c.especialidade}</p>
        <p>Data: ${new Date(c.dataAtendimento).toLocaleDateString()}</p>
        <p>Hora: ${new Date(c.dataAtendimento).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        <p>Sala: ${c.sala}</p>
      `;
      lista.appendChild(card);
    });

  } catch (err) {
    console.error("Erro:", err);
    alert("Falha ao carregar os dados.");
  }
}

carregarConsultas();
