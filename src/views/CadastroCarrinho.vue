<template>
  <Menu />
  <div class="grid">
    <form action="https://httpbin.org/post" method="POST" class="form login">
      <div class="cadastro-box">
        <h2>Cadastrar Brinquedo</h2>
        <form>
          <div class="user-box">
            <input type="text" v-model="modeloCar" required>
            <label>Nome</label>
          </div>
          <div class="user-box">
            <input type="text" v-model="tipoCar" required>
            <label>Tipo</label>
          </div>
          <div class="user-box">
            <input type="text" v-model="corCar" required>
            <label>Cor</label>
          </div>
          <button @click="cadastrarCarrinho" href="#">
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
import '../css/Cadastro.css';
import Menu from '../components/Menu.vue';

export default {
  components: {
    Menu,
  },
  data() {
    return {
      modeloCar: '',
      tipoCar: '',
      corCar: '',
      statusCar: '',
      message: '', // New data property for displaying messages
    };
  },
  methods: {
    cadastrarCarrinho() {
      if (this.modeloValido) {
        if (this.tipoValido) {
          if (this.corValido) {
            this.modeloCar = this.modeloCar.toLowerCase();
            this.corCar = this.corCar.toLowerCase();
            this.tipoCar = this.tipoCar.toLocaleLowerCase();
            const nomeCapitalizado = this.modeloCar.replace(/\b\w/g, match => match.toUpperCase());
            const corCapitalizada = this.corCar.replace(/\b\w/g, match => match.toUpperCase());
            const tipoCapitalizado = this.tipoCar.replace(/\b\w/g, match => match.toUpperCase());
            this.message = 'Valores das variáveis: ' + nomeCapitalizado + ', ' + corCapitalizada;

            const car = {
              modeloCar: nomeCapitalizado,
              tipoCar: tipoCapitalizado,
              corCar: corCapitalizada,
              statusCar: 'Livre',
            };

            let usuarioLogado = localStorage.getItem('usuarioLogado');
            

            const reg = {
              usuario: usuarioLogado,
              descricao: 'Cadastrou o brinquedo: ' + this.modeloCar + ' cor ' + this.tipoCar,
              status: 'Cadastro',
            };

            fetch('http://localhost:3000/brinquedos', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(car),
            })
              .then(response => {
                if (response.ok) {
                  this.message = 'Brinquedo cadastrado com sucesso';

                  fetch('http://localhost:3000/registros', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reg),
                  })
                    .then(response => {
                      if (response.ok) {
                        this.message = 'Registro enviado com sucesso';
                        this.reg = {};
                      } else {
                        console.error('Erro ao enviar registro');
                        // Additional logic here, if necessary
                      }
                    })
                    .catch(error => {
                      console.error('Erro ao realizar a requisição:', error);
                      // Additional logic here, if necessary
                    });

                  location.reload();
                  this.car = {};

                } else {
                  console.error('Erro ao cadastrar o brinquedo');
                  // Additional logic here, if necessary
                }
              })
              .catch(error => {
                console.error('Erro ao realizar a requisição:', error);
                // Additional logic here, if necessary
              });

          } else {
            this.message = 'Cor inválida';
          }
        } else {
          this.message = 'Tipo inválido';
        }
      } else {
        this.message = 'Nome inválido';
      }
    },
  },
  computed: {
    modeloValido() {
      this.modeloCar = this.modeloCar.trim();

      // Verifica se o nome tem menos de 100 caracteres
      const isTamanhoValido = this.modeloCar.length < 50 && this.modeloCar.length > 2;

      // Verifica se o nome contém apenas letras
      const isFormatoValido = /^[a-zA-Z0-9 ]+$/.test(this.modeloCar);

      return isTamanhoValido && isFormatoValido;
    },
    tipoValido() {
      this.tipoCar = this.tipoCar.trim();

      // Verifica se o nome tem menos de 100 caracteres
      const isTamanhoValido = this.tipoCar.length < 50 && this.tipoCar.length > 2;

      // Verifica se o nome contém apenas letras
      const isFormatoValido = /^[a-zA-Z0-9 ]+$/.test(this.tipoCar);

      return isTamanhoValido && isFormatoValido;
    },
    corValido() {
      this.corCar = this.corCar.trim();

      // Verifica se o nome tem menos de 100 caracteres
      const isTamanhoValido = this.corCar.length < 15 && this.corCar.length > 2;

      // Verifica se o nome contém apenas letras
      const isFormatoValido = /^[a-zA-Z ]+$/.test(this.corCar);

      return isTamanhoValido && isFormatoValido;
    },
  },
}
</script>