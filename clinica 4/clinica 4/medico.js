document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Acesso negado. Faça login primeiro.");
    window.location.href = "loginmedico.html";
    return;
  }

  async function buscarDadosMedico() {
    try {
      const response = await fetch("http://localhost:8080/usuarios/perfil", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) throw new Error("Erro ao buscar perfil do médico");

      const medico = await response.json();
      return medico.id; // Supondo que o ID do médico está aqui
    } catch (error) {
      console.error("Erro ao obter dados do médico:", error);
      alert("Erro ao buscar dados do médico.");
    }
  }

  async function carregarConsultas() {
    const idMedico = await buscarDadosMedico();
    if (!idMedico) return;

    try {
      const response = await fetch(`http://localhost:8080/atendimentos/medico/${idMedico}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) throw new Error("Erro ao buscar atendimentos");

      const atendimentos = await response.json();

      const container = document.querySelector(".consultas-container");
      container.innerHTML = "";

      if (atendimentos.length === 0) {
        container.innerHTML = "<p>Nenhuma consulta marcada.</p>";
        return;
      }

      atendimentos.forEach((at) => {
        const card = document.createElement("div");
        card.className = "consulta-card";
        card.innerHTML = `
          <h3>Paciente: ${at.nomePaciente || "Nome não disponível"}</h3>
          <p>Data: ${at.data}</p>
          <p>Horário: ${at.horario}</p>
          <p>Especialidade: ${at.especialidade || "N/A"}</p>
        `;
        container.appendChild(card);
      });
    } catch (error) {
      console.error("Erro ao carregar consultas:", error);
      alert("Erro ao carregar as consultas.");
    }
  }

  carregarConsultas();
});
