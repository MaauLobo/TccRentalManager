<template>
  <Menu />

  <div class="container">
    <div id="filtro_data">
      <ul>
        <li><input v-model="dataBusca" type="date"></li>
        <li @click="filtrarData()">Buscar Data</li>
      </ul>
    </div>

    <div class="carrinhos-tabela">
      <div class="cabecalho" id="cabecalho">
        <p>Funcionario</p>
        <p>Cliente</p>
        <p>Forma de Pagamento</p>
        <p>Data</p>
        <p>(R$) Valor</p>
        <p>Ação</p>
      </div>
      <div class="carrinhos">
        <table class="carrinhos-table">
          <tbody>
            <tr v-for="recebimento in recebimentos" :key="recebimento.id">
              <td>{{ recebimento.recebFunci }}</td>
              <td>{{ recebimento.recebCli }}</td>
              <td>{{ recebimento.recebPagamento }}</td>
              <td>{{ formatarData(recebimento.recebData) }}</td>
              <td>{{ recebimento.recebValor }}</td>
              <td>
                <button>Desativar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class='mostrarSoma'>
      <button @click="exibirModal = true">Conferir Valor do Caixa</button>
    </div>
   

    <div v-if="exibirModal" class="modal5">
      <div class="modal5-content">
        <span class="fechar" @click="exibirModal = false">&times;</span>
        <p>Valor total de recebimentos : R$  {{ somaValores }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '../components/Menu.vue';
import '../css/Registro.css';

export default {
  components: {
    Menu,
  },
  data() {
    return {
      recebimentos: [], // Array para armazenar os registros cadastrados
      exibirModal: false, // Controla a exibição do modal com o resultado da soma
      registroBusca: '',
      dataBusca: '',
    };
  },
  computed: {
    somaValores() {
      return this.recebimentos.reduce((total, recebimento) => total + parseFloat(recebimento.recebValor), 0);
    },
  },
  mounted() {
    // Chamada para carregar os registros cadastrados ao carregar a página
    this.carregarRecebimentos();
  },
  methods: {
    carregarRecebimentos() {
      const usuarioLogado = localStorage.getItem('usuarioLogado');

      // Fazer uma requisição GET para obter os carrinhos cadastrados
      fetch('http://localhost:3000/recebimentos')
        .then(response => response.json())
        .then(data => {
          this.recebimentos = data
            .filter(recebimento => recebimento.funci_fk_receb === usuarioLogado)
            .map(recebimento => ({
              id: recebimento.receb_codigo,
              recebFunci: recebimento.funci_fk_receb,
              recebCli: recebimento.cli_fk_receb,
              recebPagamento: recebimento.receb_pagamento_tipo,
              recebValor: recebimento.receb_valor,
              recebStatus: recebimento.receb_status,
              recebData: recebimento.receb_data,
            }));
          this.recebimentos = this.recebimentos.reverse();
        })
        .catch(error => {
          console.error('Erro ao carregar os recebimentos:', error);
        });
    },
    formatarData(data) {
      const dataObj = new Date(data);
      const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      return dataObj.toLocaleString('pt-BR', options);
    },
    filtrarData() {
      fetch('http://localhost:3000/recebimentos')
        .then(response => response.json())
        .then(data => {
          this.recebimentos = data
            .filter(recebimento => recebimento.receb_data.includes(this.dataBusca))
            .map(recebimento => ({
              id: recebimento.receb_codigo,
              recebFunci: recebimento.funci_fk_receb,
              recebCli: recebimento.cli_fk_receb,
              recebPagamento: recebimento.receb_pagamento_tipo,
              recebValor: recebimento.receb_valor,
              recebStatus: recebimento.receb_status,
              recebData: recebimento.receb_data,
            }));
          this.recebimentos = this.recebimentos.reverse();
        })
        .catch(error => {
          console.error('Erro ao carregar os recebimentos:', error);
        });
    },
  },
};
</script>
