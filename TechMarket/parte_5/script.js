document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastro-form');
  const cpfInput = document.getElementById('cpf');
  const dataNascimentoInput = document.getElementById('data-nascimento');
  const telefoneInput = document.getElementById('telefone');

  const cpfError = document.getElementById('cpf-error');
  const dataError = document.getElementById('data-error');
  const telefoneError = document.getElementById('telefone-error');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let isValid = true;

    // --- CPF ---
    const cpf = cpfInput.value.replace(/\D/g, '');
    if (!validarCPF(cpf)) {
      cpfError.textContent = "CPF inválido!";
      isValid = false;
    } else {
      cpfError.textContent = "";
    }

    // --- Data de Nascimento ---
    const dataNascimento = new Date(dataNascimentoInput.value);
    const hoje = new Date();
    const dataMinima = new Date('1935-01-01'); // previne datas como 1500

    if (isNaN(dataNascimento.getTime())) {
      dataError.textContent = "Data inválida!";
      isValid = false;
    } else if (dataNascimento < dataMinima) {
      dataError.textContent = "Data de nascimento inválida!";
      isValid = false;
    } else if (dataNascimento > hoje) {
      dataError.textContent = "Data de nascimento inválida!";
      isValid = false;
    } else {
      // Verificação de maioridade (18 anos)
      const idade = hoje.getFullYear() - dataNascimento.getFullYear();
      const mes = hoje.getMonth() - dataNascimento.getMonth();
      const menorDeIdade =
        mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())
          ? idade - 1 < 18
          : idade < 18;

      if (menorDeIdade) {
        dataError.textContent = "É necessário ter pelo menos 18 anos.";
        isValid = false;
      } else {
        dataError.textContent = "";
      }
    }

    // --- Telefone ---
    const telefone = telefoneInput.value.replace(/\D/g, '');
    if (telefone.length < 10 || telefone.length > 11 || !/^[0-9]+$/.test(telefone)) {
      telefoneError.textContent = "Telefone inválido!";
      isValid = false;
    } else {
      telefoneError.textContent = '';
    }

    // --- Envio ---
    if (isValid) {
      alert("Formulário enviado com sucesso!");
      form.reset();
    }
  });

  // --- Função de validação lógica de CPF ---
  function validarCPF(cpf) {
    if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.charAt(10));
  }
});
