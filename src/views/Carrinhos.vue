<template>
  <Menu />

  <div class="container">
    <div id="filtro_carrinho">
        <ul>
          <li><input v-model="carrinhoBusca" type="text"></li>
          <li @click="filtrarCarrinho()">Buscar Carrinho</li>
        </ul>
      </div>
    <button class="btnVerDesativados" @click="mostrarCarrinhosD()">
      <i class="fa fa-ban fa-lg"></i>
    </button>
    <div class="carrinhos-tabela">
      <div class="cabecalho" id="cabecalho">
        <p @click="mostrarFiltroCar()">Nome</p>
        <p>Tipo</p>
        <p>Cor</p>
        <p>Ações</p>
      </div>
      <div class="carrinhos">
        <table class="carrinhos-table">
          <tbody>
            <tr v-for="carrinho in carrinhos" :key="carrinho.id">
              <td>{{ carrinho.modeloCar }}</td>
              <td>{{ carrinho.tipoCar }}</td>
              <td>{{ carrinho.corCar }}</td>
              <td>
                <button @click="excluirCarrinhoConfirmation(carrinho)">Desativar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modal de confirmação -->
  <div class="modal1" v-if="showConfirmationModal">
    <div class="modal1-content">
      <h3>Confirmar desativamento</h3>
      <p>Tem certeza de que deseja desativar o brinquedo "{{ carrinhoToDelete?.modeloCar }}"?</p>
      <div class="modal1-buttons">
        <button @click="excluirCarrinho()">Sim</button>
        <button @click="cancelarExclusaoCarrinho()">Não</button>
      </div>
    </div>
  </div>

  <!-- Modal de exclusão bem-sucedida -->
  <div class="modal1" v-if="showSuccessModal">
    <div class="modal1-content">
      <span class="close" @click="fecharModalSucesso()">&times;</span>
        <slot></slot>
      <h3>Desativamento bem-sucedido</h3>
      <p>O brinquedo foi desativado com sucesso.</p>
    </div>
  </div>

  <!-- Modal de desativados -->
  <div class="modal3" v-if="showDesativModal">
    <div class="modal3-content">
      <span class="close3" @click="fecharModalDesativados()">&times;</span>
      <h3>Brinquedos deativados</h3>
      
      <div class="carrinhosD-tabela">
        <div class="cabecalhoD" id="cabecalhoD">
          <p>Nome</p>
          <p>Tipo</p>
          <p>Cor</p>
          <p>Ação</p>
        </div>
        <div class="carrinhosD">
          <table class="carrinhosD-table">
            <tbody>
              <tr v-for="carrinhoD in carrinhosD" :key="carrinhoD.id">
                <td>{{ carrinhoD.modeloCar }}</td>
                <td>{{ carrinhoD.tipoCar }}</td>
                <td>{{ carrinhoD.corCar }}</td>
                <td>
                  <button @click="ativarCarrinhoD(carrinhoD)">Ativar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '../components/Menu.vue';
import '../css/Carrinhos.css';

export default {
  components: {
    Menu,
  },
  data() {
    return {
      carrinhos: [], // Array para armazenar os brinquedos cadastrados
      carrinhosD: [],
      showConfirmationModal: false, // Controla a exibição do modal de confirmação
      showSuccessModal: false, // Controla a exibição do modal de exclusão bem-sucedida
      showDesativModal: false,
      carrinhoToDelete: null, // Armazena o brinquedo a ser excluído
      carrinhoBusca: ''
    };
  },
  mounted() {
    // Chamada para carregar os brinquedos cadastrados ao carregar a página
    this.carregarCarrinhos();
    console.log(localStorage.getItem('usuarioLogado'))
  },
  methods: {
    carregarCarrinhos() {
      // Fazer uma requisição GET para obter os carrinhos cadastrados
      fetch('http://localhost:3000/brinquedos')
        .then(response => response.json())
        .then(data => {
          this.carrinhos = data
          .filter(carrinho => carrinho.car_status === 'Livre')
          .map(carrinho => ({
            id: carrinho.car_codigo,
            modeloCar: carrinho.car_modelo,
            tipoCar: carrinho.car_tipo,
            corCar: carrinho.car_cor,
            statusCar: carrinho.car_status
          }));
          this.carrinhos = this.carrinhos.reverse();

        })
        .catch(error => {
          console.error('Erro ao carregar os brinquedos:', error);
        });
    },
    carregarCarrinhosD() {
      // Fazer uma requisição GET para obter os carrinhos cadastrados
      fetch('http://localhost:3000/brinquedos')
      .then(response => response.json())
      .then(data => {
        this.carrinhosD = data
        .filter(carrinhoD => carrinhoD.car_status === 'Inativo')
        .map(carrinhoD => ({
          id: carrinhoD.car_codigo,
          modeloCar: carrinhoD.car_modelo,
          tipoCar: carrinho.car_tipo,
          corCar: carrinhoD.car_cor,
          statusCar: carrinhoD.car_status
        }));
      })
      .catch(error => {
        console.error('Erro ao carregar os brinquedos:', error);
      });
    },
    excluirCarrinhoConfirmation(carrinho) {
      this.carrinhoToDelete = carrinho;
      this.showConfirmationModal = true;
    },
    excluirCarrinho() {
      const id = this.carrinhoToDelete.id;

      const car = {
        modeloCar: this.carrinhoToDelete.modeloCar,
        tipoCar: this.carrinhoToDelete.tipoCar,
        corCar: this.carrinhoToDelete.corCar,
        statusCar: 'Inativo'
      }

      let usuarioLogado = localStorage.getItem('usuarioLogado');
  

      const reg = {
        usuario: usuarioLogado,
        descricao: 'Desativou o brinquedo: ' + car.modeloCar + ' - ' + car.tipoCar,
        status: 'Desativado'
      }

      // PUT para editar um brinquedo
      fetch(`http://localhost:3000/editarBrinquedo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(car)
      })
      .then(response => response.json())
      .then(data => {
      console.log(data.message);
      this.carregarCarrinhos();

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
      // Realize qualquer outra ação necessária após a atualização do status
      })
      .catch(error => {
      console.error(error);
      // Lide com erros, se houver algum
      });

      this.showConfirmationModal = false;
      this.carrinhoToDelete = null;
    },
    cancelarExclusaoCarrinho() {
      this.showConfirmationModal = false;
      this.carrinhoToDelete = null;
    },
    fecharModalSucesso() {
      this.showSuccessModal = false;
    },
    mostrarCarrinhosD() {
      this.showDesativModal = true;
      this.carregarCarrinhosD();
    },
    ativarCarrinhoD(carrinhoD) {
      const id = carrinhoD.id;

      const car = {
        modeloCar: carrinhoD.modeloCar,
        tipoCar: carrinhoD.tipoCar,
        corCar: carrinhoD.corCar,
        statusCar: 'Livre'
      }

      let usuarioLogado = localStorage.getItem('usuarioLogado');
  

      const reg = {
        usuario: usuarioLogado,
        descricao: 'Ativou o brinquedo: ' + car.modeloCar + ' - ' + car.tipoCar,
        status: 'Ativado'
      }

      // PUT para editar um brinquedo
      fetch(`http://localhost:3000/editarBrinquedo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(car)
      })
      .then(response => response.json())
      .then(data => {
      console.log(data.message);
      this.carregarCarrinhosD();
      this.carregarCarrinhos();

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
      // Realize qualquer outra ação necessária após a atualização do status
      })
      .catch(error => {
      console.error(error);
      // Lide com erros, se houver algum
      });

      this.showConfirmationModal = false;
      this.carrinhoToDelete = null;
    },
    fecharModalDesativados() {
      this.showDesativModal = false;
    },
    mostrarFiltroCar() {
      document.getElementById('filtro_carrinho').style.display='block';
      },
    filtrarCarrinho() {
      this.carrinhoBusca = this.carrinhoBusca.toLowerCase();
      const nomeCapitalizado = this.carrinhoBusca.replace(/\b\w/g, match => match.toUpperCase());
      
      // Fazer uma requisição GET para obter os carrinhos cadastrados
      fetch('http://localhost:3000/brinquedos')
      .then(response => response.json())
      .then(data => {
        this.carrinhos = data
        .filter(carrinho => carrinho.car_modelo.includes(nomeCapitalizado))
        .map(carrinho => ({
          id: carrinho.car_codigo,
          modeloCar: carrinho.car_modelo,
          tipoCar: carrinho.car_tipo,
          corCar: carrinho.car_cor,
          statusCar: carrinho.car_status
        }));
      })
      .catch(error => {
        console.error('Erro ao carregar os brinquedos:', error);
      });
        
    },
  },
};
</script>
