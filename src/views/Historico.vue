<template>
    <Menu />
    
    <div class="container">
      <div id="filtro_list">
        <ul>
          <li @click="filtrarAluguel">Aluguel</li>
          <li @click="filtrarAtivados">Ativados</li>
          <li @click="filtrarCadastros">Cadastros</li>
          <li @click="filtrarDesativados">Desativados</li>
          <li @click="filtrarEditados">Editados</li>
        </ul>
      </div>
      <div id="filtro_funcionario">
        <ul>
          <li><input v-model="funcionarioBusca" type="text"></li>
          <li @click="filtrarFuncionario()">Buscar Funcionario</li>
        </ul>
      </div>
      <div id="filtro_data">
        <ul>
          <li><input v-model="dataBusca" type="date"></li>
          <li @click="filtrarData()">Buscar Data</li>
        </ul>
      </div>
      <div class="historico-tabela">
          <div class="cabecalho" id="cabecalho">
              <p @click="mostrarFiltroFunci()">Usuário</p>
              <p @click="mostrarFiltroData()">Data</p>
              <p @click="mostrarFiltroAcao()">Descrição</p>
          </div>
          <div class="historico">
              <table class="historico-table">
                  <tbody>
                      <tr v-for="registro in historico.reverse()" :key="registro.id">
                          <td>{{ registro.usuarioHist }}</td>
                          <td>{{ formatarData(registro.dataHist) }}</td>
                          <td>{{ registro.descricaoHist }}</td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  </template>
  
  <script>
  import Menu from '../components/Menu.vue';
  import '../css/Historico.css';
  
  export default {
    components: {
      Menu,
    },
    data() {
      return {
        historico: [], // Array para armazenar os clientes cadastrados
        funcionarioBusca: '',
        dataBusca: ''
      };
    },
    mounted() {
      // Chamada para carregar o historico ao carregar a página
      this.carregarHistorico();
    },
    methods: {
      carregarHistorico() {
        // Fazer uma requisição GET para obter o historico
        fetch('http://localhost:3000/registros')
        .then(response => response.json())
        .then(data => {
          this.historico = data.map(registro => ({
            id: registro.hist_codigo,
            usuarioHist: registro.hist_usuario,
            dataHist: registro.hist_data,
            descricaoHist: registro.hist_descricao
          }));
        })
        .catch(error => {
          console.error('Erro ao carregar o historico:', error);
        });
      },
      formatarData(data) {
      const dataObj = new Date(data);
      const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      return dataObj.toLocaleString('pt-BR', options);
      },
      filtrarAluguel() {
        // Fazer uma requisição GET para obter o historico
        fetch('http://localhost:3000/registros')
        .then(response => response.json())
        .then(data => {
          this.historico = data
          .filter(registro => registro.hist_status === 'Aluguel')
          .map(registro => ({
            id: registro.hist_codigo,
            usuarioHist: registro.hist_usuario,
            dataHist: registro.hist_data,
            descricaoHist: registro.hist_descricao
          }));
        })
        .catch(error => {
          console.error('Erro ao carregar o historico:', error);
        });
      },
      filtrarAtivados() {
        // Fazer uma requisição GET para obter o historico
        fetch('http://localhost:3000/registros')
        .then(response => response.json())
        .then(data => {
          this.historico = data
          .filter(registro => registro.hist_status === 'Ativado')
          .map(registro => ({
            id: registro.hist_codigo,
            usuarioHist: registro.hist_usuario,
            dataHist: registro.hist_data,
            descricaoHist: registro.hist_descricao
          }));
        })
        .catch(error => {
          console.error('Erro ao carregar o historico:', error);
        });
      },
      filtrarCadastros() {
        // Fazer uma requisição GET para obter o historico
        fetch('http://localhost:3000/registros')
        .then(response => response.json())
        .then(data => {
          this.historico = data
          .filter(registro => registro.hist_status === 'Cadastro')
          .map(registro => ({
            id: registro.hist_codigo,
            usuarioHist: registro.hist_usuario,
            dataHist: registro.hist_data,
            descricaoHist: registro.hist_descricao
          }));
        })
        .catch(error => {
          console.error('Erro ao carregar o historico:', error);
        });
      },
      filtrarDesativados() {
        // Fazer uma requisição GET para obter o historico
        fetch('http://localhost:3000/registros')
        .then(response => response.json())
        .then(data => {
          this.historico = data
          .filter(registro => registro.hist_status === 'Desativado')
          .map(registro => ({
            id: registro.hist_codigo,
            usuarioHist: registro.hist_usuario,
            dataHist: registro.hist_data,
            descricaoHist: registro.hist_descricao
          }));
        })
        .catch(error => {
          console.error('Erro ao carregar o historico:', error);
        });
      },
      filtrarEditados() {
        // Fazer uma requisição GET para obter o historico
        fetch('http://localhost:3000/registros')
        .then(response => response.json())
        .then(data => {
          this.historico = data
          .filter(registro => registro.hist_status === 'Editado')
          .map(registro => ({
            id: registro.hist_codigo,
            usuarioHist: registro.hist_usuario,
            dataHist: registro.hist_data,
            descricaoHist: registro.hist_descricao
          }));
        })
        .catch(error => {
          console.error('Erro ao carregar o historico:', error);
        });
      },
      mostrarFiltroFunci() {
        document.getElementById('filtro_funcionario').style.display='block';
        document.getElementById('filtro_data').style.display='none';
        document.getElementById('filtro_list').style.display='none';
      },
      mostrarFiltroData() {
        document.getElementById('filtro_funcionario').style.display='none';
        document.getElementById('filtro_data').style.display='block';
        document.getElementById('filtro_list').style.display='none';
      },
      mostrarFiltroAcao() {
        document.getElementById('filtro_funcionario').style.display='none';
        document.getElementById('filtro_data').style.display='none';
        document.getElementById('filtro_list').style.display='block';
      },
      filtrarFuncionario() {
        this.funcionarioBusca = this.funcionarioBusca.toLowerCase();
        const nomeCapitalizado = this.funcionarioBusca.replace(/\b\w/g, match => match.toUpperCase());
        
        // Fazer uma requisição GET para obter o historico
        fetch('http://localhost:3000/registros')
        .then(response => response.json())
        .then(data => {
          this.historico = data
          .filter(registro => registro.hist_usuario.includes(nomeCapitalizado))
          .map(registro => ({
            id: registro.hist_codigo,
            usuarioHist: registro.hist_usuario,
            dataHist: registro.hist_data,
            descricaoHist: registro.hist_descricao
          }));
          
        })
      },
      filtrarData() {
        // Fazer uma requisição GET para obter o historico
        fetch('http://localhost:3000/registros')
        .then(response => response.json())
        .then(data => {
          this.historico = data
          .filter(registro => registro.hist_data.includes(this.dataBusca))
          .map(registro => ({
            id: registro.hist_codigo,
            usuarioHist: registro.hist_usuario,
            dataHist: registro.hist_data,
            descricaoHist: registro.hist_descricao
          }));
        })
        .catch(error => {
          console.error('Erro ao carregar o historico:', error);
        });
      }
    },
  };
  </script>
  
 
  