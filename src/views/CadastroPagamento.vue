<template>
  <Menu />

  <div class="grid">
    <form class="form login">
      <div class="cadastrofpagamentos-box">
        <h2>Cadastro Forma de Pagamento</h2>
        <form>
          <div class="user-box">
            <input type="text" v-model="nomeForm" required>
            <label>Forma de Pagamento</label>
          </div>
          <button type="button" @click="cadastrarForm">
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
import '../css/CadastroFPagamento.css';

export default {
  components: {
    Menu,
  },
  data() {
    return {
      nomeForm: '',
      formas: [],
      formCadastrado: false
    };
  },
  methods: {
    cadastrarForm() {
      if (this.nomeValido) {
        this.nomeForm = this.nomeForm.toLowerCase()
        const nomeCapitalizado = this.nomeForm.replace(/\b\w/g, match => match.toUpperCase());

          fetch('http://localhost:3000/formadepagamento')
          .then(response => response.json())
          .then(data => {
            this.formas = data
            .filter(forma => forma.formpag_status === 'Ativo')
            .map(forma => ({
              id: forma.formpag_status_codigo,
              nomeForm: forma.formpag_nome,
              statusForma: forma.formpag_status
            }));
            

            for (let i = 0; i < this.formas.length; i++) {
              if (this.formas[i].nomeForm === nomeCapitalizado) {
                this.formCadastrado = true;
                break;
              }
            }

            if (!this.formCadastrado) {
              const form = {
                nomeForm: nomeCapitalizado,
                statusForm:'Ativo'
              };

              let usuarioLogado = localStorage.getItem('usuarioLogado');
      

              const reg = {
                usuario: usuarioLogado,
                descricao: 'Cadastrou a forma de pagamento: ' + form.nomeForm,
                status: 'Cadastro'
              }

              fetch('http://localhost:3000/formadepagamento', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
              })
              .then(response => {
                if (response.ok) {
                  console.log('Forma de Pagamento cadastrada com sucesso');
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
                  this.form = {}

                } else {
                  console.error('Erro ao cadastrar o Forma de Pagamento');
                  // Lógica adicional aqui, se necessário
                }
              })
              .catch(error => {
                console.error('Erro ao realizar a requisição:', error);
                // Lógica adicional aqui, se necessário
              });
                
            } else {
              console.log('Forma de Pagamento já cadastrada')
            }

          })
          .catch(error => {
            console.error('Erro ao carregar as Formas de Pagamento:', error);
          });
      } else {
        console.log('Nome Inválido')
      }
    },
  },
  computed: {
    nomeValido() {
      this.nomeForm = this.nomeForm.trim()

      // Verifica se o nome tem menos de 100 caracteres
      const isTamanhoValido = this.nomeForm.length < 20  && this.nomeForm.length > 2;

      // Verifica se o nome contém apenas letras
      const isFormatoValido = /^[a-zA-Z. ]+$/.test(this.nomeForm);
      
      return isTamanhoValido && isFormatoValido;
    }
  },
};
</script>
