<template>
  <Menu />
  <div class="grid">
    <form action="https://httpbin.org/post" method="POST" class="form login">
      <div class="plano-box">
        <h2>Cadastro de Planos</h2>
        <form>
          <div class="user-box">
            <input type="text" v-model="nomePlano" required>
            <label>Nome</label>
          </div>
          <div class="tempo_plano">
            <div class="user-box">
              <input type="text" v-model="tempoPlano" required>
              <label>Tempo</label>
            </div>
            <div class="formato">
              <select v-model="formatoTempo" required>
                <option selected disabled value="">Formato</option>
                <option value="Hora">Hora</option>
                <option value="Minutos">Minutos</option>
              </select>
            </div>
          </div>
          <div class="user-box">
            <input type="text" v-model="valorPlano" required>
            <label>Valor</label>
          </div>
          <button type="button" @click="cadastrarPlano">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Cadastrar
          </button>
        </form>
        <p>{{ message }}</p>
      </div>
    </form>
  </div>
</template>

<script>
import '../css/Plano.css';
import Menu from '../components/Menu.vue';

export default {
  components: {
    Menu,
  },
  data() {
    return {
      nomePlano: '',
      tempoPlano: '',
      formatoTempo: '',
      valorPlano: '',
      statusPlano: '',
      message: '', // New data property for displaying messages
    };
  },
  methods: {
    cadastrarPlano() {
      console.log('Valores das variáveis:', this.nomePlano, this.tempoPlano, this.formatoTempo, this.valorPlano);

      if (this.nomeValido) {
        if (this.tempoValido) {
          if (this.formatoTempoValido) {
            if (this.valorValido) {
              this.nomePlano = this.nomePlano.toLowerCase();
              const nomeCapitalizado = this.nomePlano.replace(/\b\w/g, match => match.toUpperCase());

              if (this.formatoTempo === 'Hora') {
                this.tempoPlano = this.tempoPlano * 60;
              }

              const plan = {
                nomePlano: nomeCapitalizado,
                tempoPlano: this.tempoPlano,
                valorPlano: this.valorPlano,
                statusPlano: 'Ativo',
              };

              let usuarioLogado = localStorage.getItem('usuarioLogado');
              
              const reg = {
                usuario: usuarioLogado,
                descricao: 'Cadastrou o plano: ' + plan.nomePlano,
                status: 'Cadastro',
              };

              fetch('http://localhost:3000/planos', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(plan),
              })
                .then(response => {
                  if (response.ok) {
                    this.message = 'Plano cadastrado com sucesso';

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
                    this.plano = {};

                  } else {
                    this.message = 'Erro ao cadastrar o plano';
                    // Lógica adicional aqui, se necessário
                  }
                })
                .catch(error => {
                  console.error('Erro ao realizar a requisição:', error);
                  // Lógica adicional aqui, se necessário
                });
            } else {
              this.message = 'Valor Inválido';
            }
          } else {
            this.message = 'Selecione o formato do tempo';
          }
        } else {
          this.message = 'Tempo Inválido';
        }
      } else {
        this.message = 'Nome Inválido';
      }
    },
  },
  computed: {
    nomeValido() {
      this.nomePlano = this.nomePlano.trim();

      // Verifica se o nome tem menos de 50 caracteres
      const isTamanhoValido = this.nomePlano.length < 50 && this.nomePlano.length > 1;

      // Verifica se o nome contém apenas letras
      const isFormatoValido = /^[a-zA-Z ]+$/.test(this.nomePlano);

      return isTamanhoValido && isFormatoValido;
    },
    tempoValido() {
      const tempoFloat = parseFloat(this.tempoPlano);

      return !isNaN(tempoFloat) && tempoFloat > 0;
    },
    valorValido() {
      const valorFloat = parseFloat(this.valorPlano);

      return !isNaN(valorFloat) && valorFloat > 0;
    },
    formatoTempoValido() {
      const formatoValido = this.formatoTempo.trim() != '';

      return formatoValido;
    },
  },
};
</script>
