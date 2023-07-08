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
          <button @click="cadastrarCliente">
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
      telCli: ''
    };
  },
  methods: {
    cadastrarCliente() {
      console.log('Valores das variáveis:', this.nomeCli, this.telCli);

      const cli = {
        nomeCli: this.nomeCli,
        telCli: this.telCli,
      };

      const reg = {
        usuario: 'clis',
        descricao: 'Novo cliente cadastrado: ' + cli.nomeCli
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
          this.cli = {}

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

        } else {
          console.error('Erro ao cadastrar o cliente');
          // Lógica adicional aqui, se necessário
        }
      })
      .catch(error => {
        console.error('Erro ao realizar a requisição:', error);
        // Lógica adicional aqui, se necessário
      });

    },
  },
};
</script>
