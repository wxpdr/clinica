document.querySelector(".login-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.querySelector("input[type='email']").value;
  const senha = document.querySelector("input[type='password']").value;

  try {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("tipo", "medico");
      window.location.href = "medico.html";
    } else {
      alert("Login inválido");
    }
  } catch (err) {
    console.error("Erro:", err);
    alert("Erro ao tentar logar");
  }
});