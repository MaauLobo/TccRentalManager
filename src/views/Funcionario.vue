<script>
import '../css/Funcionario.css';

import Menu from '../components/Menu.vue';

export default {
    components: {
        Menu,
    },
    data() {
    return {
      nomeFunci: '',
      cpfFunci: '',
      senhaFunci: '',
      confSenhaFunci: ''
    };
  },
  methods: {
    cadastrarFuncionario() {

      const funci = {
        nomeFunci: this.nomeFunci,
        cpfFunci: this.cpfFunci,
        senhaFunci: this.senhaFunci
      };

      const reg = {
        usuario: 'clis',
        descricao: 'Novo funcionario cadastrado: ' + funci.nomeFunci
      }

      fetch('http://localhost:3000/funcionarios', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(funci),
      })
      .then(response => {
        if (response.ok) {
          console.log('Funcionario cadastrado com sucesso');
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
          console.error('Erro ao cadastrar o funcionario');
          // Lógica adicional aqui, se necessário
        }
      })
      .catch(error => {
        console.error('Erro ao realizar a requisição:', error);
        // Lógica adicional aqui, se necessário
      });

    },
  },


}


</script>

<template>
    <Menu />


    <div class="grid">

        <form action="https://httpbin.org/post" method="POST" class="form login">

            <div class="funcionario-box">
                <h2>Cadastro Funcionario</h2>
                <form>
                    <div class="user-box">
                        <input type="text" v-model="nomeFunci" required>
                        <label>Nome Completo</label>
                    </div>
                    <div class="user-box">
                        <input type="text" v-model="cpfFunci" required>
                        <label>CPF</label>
                    </div>
                    <div class="user-box">
                        <input type="password" v-model="senhaFunci" required>
                        <label>Senha</label>
                    </div>
                    <div class="user-box">
                        <input type="password" v-model="confSenhaFunci" required>
                        <label>Confirmar Senha</label>
                    </div>
                    <button @click="cadastrarFuncionario">
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

