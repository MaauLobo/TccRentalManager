<template>
  <Menu />

  <div class="container">
    <button class="btnVerDesativados" @click="mostrarPlanosD()">
      <i class="fa fa-ban fa-lg"></i>
    </button>
    <div class="planos-tabela">
      <div class="cabecalho" id="cabecalho">
        <p>Nome</p>
        <p>Tempo</p>
        <p>Valor</p>
        <p>Ações</p>
      </div>
      <div class="planos">
        <table class="planos-table">
          <tbody>
            <tr v-for="plano in planos" :key="plano.id">
              <td>{{ plano.nomePlano }}</td>
              <td>{{ plano.tempoPlano }}</td>
              <td>{{ plano.valorPlano }}</td>
              <td>
                <button @click="editarPlano(plano)">Editar</button>
                <button @click="excluirPlanoConfirmation(plano)">Desativar</button>
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
      <p>Tem certeza de que deseja desativar o plano "{{ planoToDelete?.nomePlano }}"?</p>
      <div class="modal1-buttons">
        <button @click="excluirPlano()">Sim</button>
        <button @click="cancelarExclusaoPlano()">Não</button>
      </div>
    </div>
  </div>

  <!-- Modal de exclusão bem-sucedida -->
  <div class="modal1" v-if="showSuccessModal">
    <div class="modal1-content">
      <span class="close" @click="fecharModalSucesso()">&times;</span>
      <h3>Desativamento bem-sucedido</h3>
      <p>O plano foi desativado com sucesso.</p>
    </div>
  </div>

  <!-- Modal de edição do plano -->
  <div class="modal2" v-if="showEditModal">
    <div class="modal2-content">
      <h3>Editar plano</h3>
      <label for="nome">Nome:</label>
      <input type="text" id="nome" v-model="nomeEditado" />
      <label for="tempo">Tempo:</label>
      <input type="text" id="tempo" v-model="tempoEditado" />
      <label for="valor">Valor:</label>
      <input type="text" id="valor" v-model="valorEditado" />
      <div class="modal1-buttons">
        <button @click="salvarEdicao()">Salvar</button>
        <button @click="fecharModalEdicao()">Fechar</button>
      </div>
    </div>
  </div>

  <!-- Modal de desativados -->
  <div class="modal3" v-if="showDesativModal">
    <div class="modal3-content">
      <span class="close3" @click="fecharModalDesativados()">&times;</span>
      <h3>Planos deativados</h3>
      
      <div class="planosD-tabela">
        <div class="cabecalhoD" id="cabecalhoD">
          <p>Nome</p>
          <p>Tempo</p>
          <p>Valor</p>
          <p>Ação</p>
        </div>
        <div class="planosD">
          <table class="planosD-table">
            <tbody>
              <tr v-for="planoD in planosD" :key="planoD.id">
                <td>{{ planoD.nomePlano }}</td>
                <td>{{ planoD.tempoPlano }}</td>
                <td>{{ planoD.valorPlano }}</td>
                <td>
                  <button @click="ativarPlanoD(planoD)">Ativar</button>
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
import '../css/Planos.css';

export default {
  components: {
    Menu,
  },
  data() {
    return {
      planos: [], // Array para armazenar os planos cadastrados
      planosD: [],
      showConfirmationModal: false, // Controla a exibição do modal de confirmação
      showSuccessModal: false, // Controla a exibição do modal de exclusão bem-sucedida
      showEditModal: false, // Controla a exibição do modal de edição do plano
      showDesativModal: false,
      planoToDelete: null, // Armazena o plano a ser excluído
      planoToEdit: null, // Armazena o plano a ser editado
      nomeEditado: '', // Armazena o nome editado do plano
      tempoEditado: '', // Armazena o tempo editado do plano
      valorEditado: '', // Armazena o valor editado do plano
    };
  },
  mounted() {
    // Chamada para carregar os planos cadastrados ao carregar a página
    this.carregarPlanos();
  },
  methods: {
    carregarPlanos() {
      // Fazer uma requisição GET para obter os planos cadastrados
      fetch('http://localhost:3000/planos')
        .then(response => response.json())
        .then(data => {
          this.planos = data
          .filter(plano => plano.plano_status === 'Ativo')
          .map(plano => ({
            id: plano.plano_codigo,
            nomePlano: plano.plano_nome,
            tempoPlano: plano.plano_tempo,
            valorPlano: plano.plano_valor,
            statusPlano: plano.plano_status
          }));
          this.planos = this.planos.reverse();

        })
        .catch(error => {
          console.error('Erro ao carregar os planos:', error);
        });
    },
    carregarPlanosD() {
      // Fazer uma requisição GET para obter os planos cadastrados
      fetch('http://localhost:3000/planos')
        .then(response => response.json())
        .then(data => {
          this.planosD = data
          .filter(planoD => planoD.plano_status === 'Inativo')
          .map(planoD => ({
            id: planoD.plano_codigo,
            nomePlano: planoD.plano_nome,
            tempoPlano: planoD.plano_tempo,
            valorPlano: planoD.plano_valor,
            statusPlano: planoD.plano_status
          }));
        })
        .catch(error => {
          console.error('Erro ao carregar os planos:', error);
        });
    },
    excluirPlanoConfirmation(plano) {
      this.planoToDelete = plano;
      this.showConfirmationModal = true;
    },
    excluirPlano() {
      const id = this.planoToDelete.id;

      const plan = {
        nomePlano: this.planoToDelete.nomePlano,
        tempoPlano: this.planoToDelete.tempoPlano,
        valorPlano: this.planoToDelete.valorPlano,
        statusPlano: 'Inativo'
      }

      let usuarioLogado = localStorage.getItem('usuarioLogado');
      

      const reg = {
        usuario: usuarioLogado,
        descricao: 'Desativou o plano: ' + plan.nomePlano,
        status: 'Desativado'
      }

      // PUT para editar um plano
      fetch(`http://localhost:3000/editarPlano/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(plan)
      })
      .then(response => response.json())
      .then(data => {
      console.log(data.message);
      this.carregarPlanos();

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
      this.planoToDelete = null;
    },
    cancelarExclusaoPlano() {
      this.showConfirmationModal = false;
      this.planoToDelete = null;
    },
    editarPlano(plano) {
      // Lógica para editar um plano
      this.planoToEdit = plano;
      this.nomeEditado = plano.nomePlano;
      this.tempoEditado = plano.tempoPlano;
      this.valorEditado = plano.valorPlano;
      this.showEditModal = true;
    },
    salvarEdicao() {
      // Lógica para salvar a edição do plano
      const id = this.planoToEdit.id;
      const plano = this.planos.find(p => p.id === id);
      
      const novoTempo = this.tempoEditado;
      const novoValor = this.valorEditado;

      this.nomeEditado = this.nomeEditado.toLowerCase()
      const novoNome = this.nomeEditado.replace(/\b\w/g, match => match.toUpperCase());

      let plan = {
        nomePlano: plano.nomePlano,
        tempoPlano: plano.tempoPlano,
        valorPlano: plano.valorPlano,
        statusPlano: 'Ativo'
      }

      let usuarioLogado = localStorage.getItem('usuarioLogado');
      

      if(novoNome != plan.nomePlano) {
        if(this.novoNomeValido) {

          plan.nomePlano = novoNome;

          const reg = {
            usuario: usuarioLogado,
            descricao: 'Editou o nome do plano: ' + plano.nomePlano,
            status: 'Editado'
          }

          // PUT para editar um plano
          fetch(`http://localhost:3000/editarPlano/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(plan)
          })
          .then(response => response.json())
          .then(data => {
          console.log(data.message);
          this.carregarPlanos();

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

          this.showEditModal = false;

        } else {
          console.log('Novo nome Inválido');
        }   
      } 

      if(novoTempo != plan.tempoPlano) {
        if(this.novoTempoValido) {
          plan.tempoPlano = this.tempoEditado;

          const reg = {
            usuario: usuarioLogado,
            descricao: 'Editou o tempo do plano: ' + plano.nomePlano,
            status: 'Editado'
          }

          // PUT para editar um plano
          fetch(`http://localhost:3000/editarPlano/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(plan)
          })
          .then(response => response.json())
          .then(data => {
          console.log(data.message);
          this.carregarPlanos();

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

          this.showEditModal = false;
            
        } else {
          console.log('Novo tempo Inválido');
        }
      }

      if(novoValor != plan.valorPlano) {
        if(this.novoValorValido) {
          plan.valorPlano = this.valorEditado;

          const reg = {
            usuario: usuarioLogado,
            descricao: 'Editou o valor do plano: ' + plano.nomePlano,
            status: 'Editado'
          }

          // PUT para editar um plano
          fetch(`http://localhost:3000/editarPlano/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(plan)
          })
          .then(response => response.json())
          .then(data => {
          console.log(data.message);
          this.carregarPlanos();

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

          this.showEditModal = false;
            
        } else {
          console.log('Novo valor Inválido');
        }
      }

    },
    fecharModalSucesso() {
      this.showSuccessModal = false;
    },
    fecharModalEdicao() {
      this.showEditModal = false;
    },
    mostrarPlanosD() {
      this.showDesativModal = true;
      this.carregarPlanosD();
    },
    ativarPlanoD(planoD) {
      const id = planoD.id;

      const plan = {
        nomePlano: planoD.nomePlano,
        tempoPlano: planoD.tempoPlano,
        valorPlano: planoD.valorPlano,
        statusPlano: 'Ativo'
      }

      let usuarioLogado = localStorage.getItem('usuarioLogado');
      

      const reg = {
        usuario: usuarioLogado,
        descricao: 'Ativou o plano: ' + plan.nomePlano,
        status: 'Ativado'
      }

      // PUT para editar um plano
      fetch(`http://localhost:3000/editarPlano/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(plan)
      })
      .then(response => response.json())
      .then(data => {
      console.log(data.message);
      this.carregarPlanosD();
      this.carregarPlanos();

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
      this.planoToDelete = null;
    },
    fecharModalDesativados() {
      this.showDesativModal = false;
    },
  },
  computed: {
    novoNomeValido() {
      this.nomeEditado = this.nomeEditado.trim()

      // Verifica se o nome tem menos de 50 caracteres
      const isTamanhoValido = this.nomeEditado.length < 50  && this.nomeEditado.length > 1;

      // Verifica se o nome contém apenas letras
      const isFormatoValido = /^[a-zA-Z0-9 ]+$/.test(this.nomeEditado);
      
      return isTamanhoValido && isFormatoValido;
    },
    novoTempoValido() {
      const tempoFloat = parseFloat(this.tempoEditado);

      return !isNaN(tempoFloat) && tempoFloat > 0;
    },
    novoValorValido() {
      const valorFloat = parseFloat(this.valorEditado);

      return !isNaN(valorFloat) && valorFloat > 0;
    },
  }
};
</script>
