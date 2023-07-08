<template>
  <div class="login-box">
    <h2>Login</h2>
    <form>
      <div class="user-box">
        <input type="text" v-model="nome" required>
        <label>Nome Completo</label>
      </div>
      <div class="user-box">
        <input type="password" v-model="senha" required>
        <label>Senha</label>
      </div>
      <button type="button" @click="login">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Entrar
      </button>
    </form>
    <p>{{ message }}</p>
  </div>
</template>

<script> 
import '../css/Login.css';
export default {
  data() {
    return {
      idLogado: '',
      userLogado: '',
      logado: {},
      funcionarios: [],
      nome: '',
      senha: '',
      contaExistente: false,
      senhaConta: '',
      message: '' // New data property for displaying messages
    };
  },

  methods: {
    login() {
      if (this.nomeValido) {
        fetch('http://localhost:3000/funcionarios')
          .then(response => response.json())
          .then(data => {
            this.funcionarios = data
            .map(funcionario => ({
              id: funcionario.funci_codigo,
              nomeFunci: funcionario.funci_nome,
              senhaFunci: funcionario.funci_senha,
              statusFunci: funcionario.funci_status
            }));

            this.nome = this.nome.toLowerCase()
            const nomeCapitalizado = this.nome.replace(/\b\w/g, match => match.toUpperCase());
            
            for (let i = 0; i < this.funcionarios.length; i++) {
                if (this.funcionarios[i].nomeFunci === nomeCapitalizado) {
                  this.idLogado = this.funcionarios[i].id;
                  this.userLogado = this.funcionarios[i].nomeFunci;
                  this.contaExistente = true;
                  this.senhaConta = this.funcionarios[i].senhaFunci;
                  break;
                }
              }

            if (this.nome === '00000000000' && this.senha === '00000000000') {
              this.message = 'Bem-Vindo ADM';

              if (!this.contaExistente) {
                const adm = {
                  nomeFunci: '00000000000',
                  senhaFunci: '00000000000',
                  statusFunci: 'ADM'
                };

                const reg = {
                  usuario: 'ADM',
                  descricao: 'Se Cadastrou',
                  status: 'Cadastro'
                }

                fetch('http://localhost:3000/funcionarios', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(adm),
                })
                .then(response => {
                  if (response.ok) {
                    console.log('Funcionário cadastrado com sucesso');

                    fetch('http://localhost:3000/registros', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(reg),
                    })
                    .then(response => {
                      if (response.ok) {
                        console.log('Registro enviado com sucesso');
                        this.reg = {};
                      } else {
                        console.error('Erro ao enviar registro');
                        // Lógica adicional aqui, se necessário
                      }
                    })
                    .catch(error => {
                      console.error('Erro ao realizar a requisição do registro:', error);
                      // Lógica adicional aqui, se necessário
                    });

                    location.reload()
                    this.funci = {}

                  } else {
                    console.error('Erro ao cadastrar o funcionário');
                    // Lógica adicional aqui, se necessário
                  }
                })
                .catch(error => {
                  console.error('Erro ao realizar a requisição de cadastro:', error);
                  // Lógica adicional aqui, se necessário
                });

                // Fazer uma requisição GET para obter os funcionários cadastrados
                fetch('http://localhost:3000/funcionarios')
                .then(response => response.json())
                .then(data => {
                  this.funcionarios = data
                  .filter(funcionario => funcionario.funci_status === 'Ativo')
                  .map(funcionario => ({
                    id: funcionario.funci_codigo,
                    nomeFunci: funcionario.funci_nome,
                    senhaFunci: funcionario.funci_senha,
                    statusFunci: funcionario.funci_status
                  }));

                  for (let i = 0; i < this.funcionarios.length; i++) {
                    if (this.funcionarios[i].nomeFunci == '00000000000') {
                      this.logado = {
                        idLogado: this.funcionarios[i].id,
                        userLogado: 'ADM'
                      }
                      break;
                    }
                  }

                  localStorage.setItem("idLogado", this.logado.idLogado);
                  localStorage.setItem("usuarioLogado", this.logado.userLogado);

                  location.assign('/aluguel');

                })
                .catch(error => {
                  console.error('Erro ao carregar os funcionários:', error);
                });
              } else {
                // Fazer uma requisição GET para obter os funcionários cadastrados
                fetch('http://localhost:3000/funcionarios')
                .then(response => response.json())
                .then(data => {
                  this.funcionarios = data
                  .filter(funcionario => funcionario.funci_status === 'ADM')
                  .map(funcionario => ({
                    id: funcionario.funci_codigo,
                    nomeFunci: funcionario.funci_nome,
                    senhaFunci: funcionario.funci_senha,
                    statusFunci: funcionario.funci_status
                  }));

                  for (let i = 0; i < this.funcionarios.length; i++) {
                    if (this.funcionarios[i].nomeFunci === '00000000000') {
                      this.logado = {
                        idLogado: this.funcionarios[i].id,
                        userLogado: 'ADM'
                      }
                      break;
                    }
                  }

                  localStorage.setItem("idLogado", this.logado.idLogado);
                  localStorage.setItem("usuarioLogado", this.logado.userLogado);
                  location.assign('/aluguel');

                })
                .catch(error => {
                  console.error('Erro ao carregar os funcionários:', error);
                });
              }
            } else {
              if (this.contaExistente) {
                if (this.senha === this.senhaConta) {
                  this.message = 'Logado com sucesso';

                  for (let i = 0; i < this.funcionarios.length; i++) {
                    if (this.funcionarios[i].nomeFunci === nomeCapitalizado) {
                      this.logado = {
                        idLogado: this.funcionarios[i].id,
                        userLogado: nomeCapitalizado
                      }
                      break;
                    }
                  }
                  localStorage.setItem("idLogado", this.logado.idLogado);
                  localStorage.setItem("usuarioLogado", this.logado.userLogado);
                  location.assign('/aluguel');
                } else {
                  this.message = 'Senha Incorreta';
                }
              } else {
                this.message = 'Conta não cadastrada';
              }
            }
          })
          .catch(error => {
            console.error('Error loading employees:', error);
          });
      } else {
        this.message = 'Funcionário inválido';
      }
    }
  },
  
  computed: {
    nomeValido() {
      this.nome = this.nome.trim()

      // Verifica se o nome tem menos de 100 caracteres
      const isTamanhoValido = this.nome.length < 100  && this.nome.length > 2;
      
      return isTamanhoValido;
    },
  }
}
</script>
