document.querySelector("form").addEventListener("submit", async function (event) {
  event.preventDefault(); // impede recarregamento

  const email = document.querySelector('input[type="email"]').value;
  const senha = document.querySelector('input[type="password"]').value;

  try {
    const resposta = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, senha })
    });

    if (!resposta.ok) {
      throw new Error("Email ou senha incorretos.");
    }

    const dados = await resposta.json();
    localStorage.setItem("token", dados.token); 
    window.location.href = "paciente.html"; 
  } catch (erro) {
    alert(erro.message);
  }
});
