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
      senhaFunci: '',
      confSenhaFunci: '',
      statusFunci: '',
      funcionarios: [],
      funciCadastrado: false
    };
  },
  methods: {
    cadastrarFuncionario() {
      if (this.nomeValido) {
        if(this.senhaTamanho) {
          if (this.senhaValida) {
            this.funciCadastrado = false;
            this.nomeFunci = this.nomeFunci.toLowerCase()
            const nomeCapitalizado = this.nomeFunci.replace(/\b\w/g, match => match.toUpperCase());

            const funci = {
              nomeFunci: nomeCapitalizado,
              senhaFunci: this.senhaFunci,
              statusFunci: 'Ativo'
            };

            let usuarioLogado = localStorage.getItem('usuarioLogado');

            const reg = {
              usuario: usuarioLogado,
              descricao: 'Cadastrou o funcionario: ' + funci.nomeFunci,
              status: 'Cadastro'
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

          } else {
            console.log('Senhas não correspondentes')
          }
        
        } else {
          console.log('Senha tem que ter de 8 a 20 caracteres')
        }

      } else {
        console.log('Nome Inválido')
      }
    },
  },
  computed: {
    nomeValido() {
      this.nomeFunci = this.nomeFunci.trim()

      // Verifica se o nome tem menos de 100 caracteres
      const isTamanhoValido = this.nomeFunci.length < 100 && this.nomeFunci.length > 2;

      // Verifica se o nome contém apenas letras
      const isFormatoValido = /^[a-zA-Z. ]+$/.test(this.nomeFunci);

      return isTamanhoValido && isFormatoValido;
    },
    senhaValida() {
      const senhasIguais = this.senhaFunci === this.confSenhaFunci;

      return senhasIguais;
    },
    senhaTamanho() {
      const senhaTamanho = this.senhaFunci.length < 21 && this.senhaFunci.length > 7;
      const senhaVazia = this.senhaFunci.trim() != '' &&  this.confSenhaFunci.trim() != '';

      return senhaTamanho && senhaVazia;
    }
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
                        <input type="password" v-model="senhaFunci" required>
                        <label>Senha</label>
                    </div>
                    <div class="user-box">
                        <input type="password" v-model="confSenhaFunci" required>
                        <label>Confirmar Senha</label>
                    </div>
                    <button type="button" @click="cadastrarFuncionario">
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

