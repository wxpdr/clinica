document.querySelector(".login-form").addEventListener("submit", async function (e) {
  e.preventDefault(); // Impede que a página recarregue

  const email = document.querySelector('input[type="email"]').value;
  const senha = document.querySelector('input[type="password"]').value;

  try {
    const resposta = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, senha })
    });

    if (!resposta.ok) {
      throw new Error("Falha no login");
    }

    const dados = await resposta.json();
    console.log("TOKEN:", dados.token);

    // Salva no localStorage
    localStorage.setItem("token", dados.token);
    alert("Login bem-sucedido!");

    // Redireciona para a página do médico
    window.location.href = "medico.html";
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    alert("Email ou senha inválidos.");
  }
});