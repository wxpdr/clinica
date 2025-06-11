let medicoSelecionado = "";
let idMedicoSelecionado = 0;

const mapaIdsMedicos = {
  "Dr. Vinicius": 1,
  "Dr. Pelat": 2,
  "Dra. Wendy": 3
};

function selecionarMedico(nome) {
  medicoSelecionado = nome;
  idMedicoSelecionado = mapaIdsMedicos[nome];
  document.getElementById("medico-selecionado").textContent = `Agendar com: ${nome}`;
  document.getElementById("form-agendamento").style.display = "block";
}

function confirmarAgendamento() {
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;
  const token = localStorage.getItem("token");

  if (!data || !hora) {
    alert("Preencha data e hora corretamente.");
    return;
  }

  const dataHora = `${data}T${hora}`;
  const idPaciente = 1; // Substitua se quiser puxar dinamicamente

  fetch("http://localhost:8080/atendimentos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      dataAtendimento: dataHora,
      idMedico: idMedicoSelecionado,
      idPaciente: idPaciente,
      sala: "Sala 1"
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Falha ao agendar.");
    }
    return response.json();
  })
  .then(() => {
    alert("Consulta agendada com sucesso!");
    document.getElementById("form-agendamento").reset();
    document.getElementById("form-agendamento").style.display = "none";
  })
  .catch(err => {
    console.error("Erro:", err);
    alert("Erro ao agendar. Verifique os dados e tente novamente.");
  });
}
