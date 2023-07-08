<template>
  <Menu />

  <div class="grid">
    <form class="form login">
      <div class="cadastro-box">
        <h2>Cadastro Cliente</h2>
        <form>
          <div class="user-box">
            <input type="text" v-model="nomeCli" required>
            <label>Nome Completo</label>
          </div>
          <div class="user-box">
            <input type="text" v-model="cpfCli" required>
            <label>CPF</label>
          </div>
          <div class="user-box">
            <input type="text" v-model="telCli" required>
            <label>Telefone</label>
          </div>
          <button type="button" @click="cadastrarCliente">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Cadastrar
          </button>
        </form>
      </div>
    </form>
  </div>
</template>

<script>
import Menu from '../components/Menu.vue';
import '../css/Cadastro.css';

export default {
  components: {
    Menu,
  },
  data() {
    return {
      nomeCli: '',
      cpfCli: '',
      telCli: '',
      statusCli: '',
      cliCadastrado: false
    };
  },
  methods: {
    cadastrarCliente() {
      console.log('Valores das variáveis:', this.nomeCli, this.telCli);

      if (this.nomeValido) {
        if (this.telValido) {
          this.nomeCli = this.nomeCli.toLowerCase()
          const nomeCapitalizado = this.nomeCli.replace(/\b\w/g, match => match.toUpperCase());
          
          const ddi = '+55 '
          const numerosApenas = this.telCli.replace(/\D/g, '');
          const numeroFormatado = ddi + numerosApenas.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');

          // Fazer uma requisição GET para obter os clientes cadastrados
          fetch('http://localhost:3000/clientes')
          .then(response => response.json())
          .then(data => {
            this.clientes = data
            .filter(cliente => cliente.cli_status === 'Ativo')
            .map(cliente => ({
              id: cliente.cli_codigo,
              nomeCli: cliente.cli_nome,
              cpfCli: cliente.cli_cpf,
              telCli: cliente.cli_tel
            }));
            let cpfFormatado = this.cpfCli;

              if (cpfFormatado.length == 11) {
                const numerosCPF = cpfFormatado.replace(/\D/g, '');
                cpfFormatado = numerosCPF.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
              }

              for (let i = 0; i < this.clientes.length; i++) {
                if (this.clientes[i].cpfCli === cpfFormatado) {
                  this.cliCadastrado = true;
                  break;
                }
              }

              if (!this.cliCadastrado) {
                const cli = {
                  nomeCli: nomeCapitalizado,
                  cpfCli: cpfFormatado,
                  telCli: numeroFormatado,
                  statusCli:'Ativo'
                };

                let usuarioLogado = localStorage.getItem('usuarioLogado');
      

                const reg = {
                  usuario: usuarioLogado,
                  descricao: 'Cadastrou o cliente: ' + cli.nomeCli,
                  status: 'Cadastro'
                }

                fetch('http://localhost:3000/clientes', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(cli),
                })
                .then(response => {
                  if (response.ok) {
                    console.log('Cliente cadastrado com sucesso');
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
                      console.error('Erro ao realizar a requisição:', error);
                      // Lógica adicional aqui, se necessário
                    });

                    location.reload();
                    this.cli = {}

                  } else {
                    console.error('Erro ao cadastrar o cliente');
                    // Lógica adicional aqui, se necessário
                  }
                })
                .catch(error => {
                  console.error('Erro ao realizar a requisição:', error);
                  // Lógica adicional aqui, se necessário
                });
                
              } else {
                console.log('Funcionário já cadastrado')
              }

          })
          .catch(error => {
            console.error('Erro ao carregar os clientes:', error);
          });
        } else {
        console.log('Telefone Inválido')
      }
      } else {
        console.log('Nome Inválido')
      }
    },
  },
  computed: {
    nomeValido() {
      this.nomeCli = this.nomeCli.trim()

      // Verifica se o nome tem menos de 100 caracteres
      const isTamanhoValido = this.nomeCli.length < 100  && this.nomeCli.length > 2;

      // Verifica se o nome contém apenas letras
      const isFormatoValido = /^[a-zA-Z. ]+$/.test(this.nomeCli);
      
      return isTamanhoValido && isFormatoValido;
    },
    cpfValido() {
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      const isFormatoValido = cpfRegex.test(this.cpfCli);

      const isNumeroInteiro = /^\d+$/.test(this.cpfCli);
      const isTamanhoValido = this.cpfCli.length === 11;
      
      return isFormatoValido || (isNumeroInteiro && isTamanhoValido);
    },
    telValido() {
      this.telCli = this.telCli.trim()

      const isTamanhoValido = this.telCli.length < 100  && this.telCli.length > 2;

      return isTamanhoValido

    }
  },
};
</script>
