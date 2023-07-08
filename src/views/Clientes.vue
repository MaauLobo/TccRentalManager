<template>
  <Menu />

  <div class="container">
    <div id="filtro_clientes">
        <ul>
          <li><input v-model="clienteBusca" type="text"></li>
          <li @click="filtrarClientes()">Buscar Cliente</li>
        </ul>
      </div>
    <button class="btnVerDesativados" @click="mostrarClientesD()">
      <i class="fa fa-ban fa-lg"></i>
    </button>
    <div class="clientes-tabela">
      <div class="cabecalho" id="cabecalho">
        <p @click="mostrarFiltroClientes()">Nome</p>
        <p>CPF</p>
        <p>Telefone</p>
        <p>Ações</p>
      </div>
      <div class="clientes">
        <table class="clientes-table">
          <tbody>
            <tr v-for="cliente in clientes" :key="cliente.id">
              <td>{{ cliente.nomeCli }}</td>
              <td>{{ cliente.cpfCli }}</td>
              <td>{{ cliente.telCli }}</td>
              <td>
                <button @click="editarCliente(cliente)">Alterar telefone</button>
                <button @click="excluirClienteConfirmation(cliente)">Desativar</button>
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
      <p>Tem certeza de que deseja desativar o cliente "{{ clienteToDelete?.nomeCli }}"?</p>
      <div class="modal1-buttons">
        <button @click="excluirCliente()">Sim</button>
        <button @click="cancelarExclusaoCliente()">Não</button>
      </div>
    </div>
  </div>

  <!-- Modal de exclusão bem-sucedida -->
  <div class="modal1" v-if="showSuccessModal">
    <div class="modal1-content">
      <span class="close" @click="fecharModalSucesso()">&times;</span>
      <h3>Desativamento bem-sucedido</h3>
      <p>O cliente foi desativado com sucesso.</p>
    </div>
  </div>

  <!-- Modal de edição do número de telefone -->
  <div class="modal1" v-if="showEditModal">
    <div class="modal1-content">
      <span class="close" @click="fecharModalEdicao()">&times;</span> <!-- Botão de fechar (x) -->
      <h3>Alterar número de telefone</h3>
      <label for="telefone">Telefone:</label>
      <input type="text" id="telefone" v-model="telefoneEditado" />
      <div class="modal1-buttons">
        <button @click="salvarEdicao()">Salvar</button>
      </div>
    </div>
  </div>

  <!-- Modal de desativados -->
  <div class="modal3" v-if="showDesativModal">
    <div class="modal3-content">
      <span class="close3" @click="fecharModalDesativados()">&times;</span>
      <h3>Clientes deativados</h3>
      
      <div class="clientesD-tabela">
        <div class="cabecalhoD" id="cabecalhoD">
          <p>Nome</p>
          <p>CPF</p>
          <p>Telefone</p>
          <p>Ação</p>
        </div>
        <div class="clientesD">
          <table class="clientesD-table">
            <tbody>
              <tr v-for="clienteD in clientesD" :key="clienteD.id">
                <td>{{ clienteD.nomeCli }}</td>
                <td>{{ clienteD.cpfCli }}</td>
                <td>{{ clienteD.telCli }}</td>
                <td>
                  <button @click="ativarClienteD(clienteD)">Ativar</button>
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
import '../css/Clientes.css';

export default {
  components: {
    Menu,
  },
  data() {
    return {
      clientes: [], // Array para armazenar os clientes cadastrados
      clientesD: [],
      showConfirmationModal: false, // Controla a exibição do modal de confirmação
      showSuccessModal: false, // Controla a exibição do modal de exclusão bem-sucedida
      showEditModal: false, // Controla a exibição do modal de edição do número de telefone
      showDesativModal: false,
      clienteToDelete: null, // Armazena o cliente a ser excluído
      clienteToEdit: null, // Armazena o cliente a ser editado
      telefoneEditado: '', // Armazena o número de telefone editado
      clienteBusca:''
    };
  },
  mounted() {
    // Chamada para carregar os clientes cadastrados ao carregar a página
    this.carregarClientes();
  },
  methods: {
    carregarClientes() {
      // Fazer uma requisição GET para obter os clientes cadastrados
      fetch('http://localhost:3000/clientes')
      .then(response => response.json())
      .then(data => {
        this.clientes = data
        .filter(cliente => cliente.cli_status === 'Ativo')
        .map(cliente => ({
          id: cliente.cli_codigo,
          nomeCli: cliente.cli_nome,
          cpfCli: cliente.cli_cpf,
          telCli: cliente.cli_tel
        }));
        this.clientes = this.clientes.reverse();

      })
      .catch(error => {
        console.error('Erro ao carregar os clientes:', error);
      });
    },
    carregarClientesD() {
      // Fazer uma requisição GET para obter os clientes cadastrados
      fetch('http://localhost:3000/clientes')
        .then(response => response.json())
        .then(data => {
          this.clientesD = data
          .filter(clienteD => clienteD.cli_status === 'Inativo')
          .map(clienteD => ({
            id: clienteD.cli_codigo,
            nomeCli: clienteD.cli_nome,
            cpfCli: clienteD.cli_cpf,
            telCli: clienteD.cli_tel
          }));
        })
        .catch(error => {
          console.error('Erro ao carregar os clientes:', error);
        });
    },
    excluirClienteConfirmation(cliente) {
      this.clienteToDelete = cliente;
      this.showConfirmationModal = true;
    },
    excluirCliente() {
      const id = this.clienteToDelete.id;

      const cli = {
        nomeCli: this.clienteToDelete.nomeCli,
        cpfCli: this.clienteToDelete.cpfCli,
        telCli: this.clienteToDelete.telCli,
        statusCli: 'Inativo'
      }

      let usuarioLogado = localStorage.getItem('usuarioLogado');
      usuarioLogado = usuarioLogado.userLogado;

      const reg = {
        usuario: usuarioLogado,
        descricao: 'Desativou o cliente: ' + cli.nomeCli,
        status: 'Desativado'
      }

      // PUT para editar um cliente
      fetch(`http://localhost:3000/editarCliente/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cli)
      })
      .then(response => response.json())
      .then(data => {
      console.log(data.message);
      this.carregarClientes();

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
      this.clienteToDelete = null;
    },
    cancelarExclusaoCliente() {
      this.showConfirmationModal = false;
      this.clienteToDelete = null;
    },
    editarCliente(cliente) {
      // Lógica para editar um cliente
      this.clienteToEdit = cliente;
      this.telefoneEditado = cliente.telCli;
      this.showEditModal = true;
    },
    salvarEdicao() {
      // Lógica para salvar a edição do número de telefone
      const id = this.clienteToEdit.id;
      const cliente = this.clientes.find(c => c.id === id);
      const novoTelefone = this.telefoneEditado;

      const cli = {
        nomeCli: cliente.nomeCli,
        cpfCli: cliente.cpfCli,
        telCli: novoTelefone,
        statusCli: 'Ativo'
      }

      let usuarioLogado = localStorage.getItem('usuarioLogado');
      usuarioLogado = usuarioLogado.userLogado;

      const reg = {
        usuario: usuarioLogado,
        descricao: 'Editou o telefone do cliente: ' + cli.nomeCli,
        status: 'Editado'
      }

      // PUT para editar um cliente
      fetch(`http://localhost:3000/editarCliente/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cli)
      })
      .then(response => response.json())
      .then(data => {
      console.log(data.message);
      console.log('Número editado com sucesso');
      this.carregarClientes();

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

      this.showEditModal = false;
      // Realize qualquer outra ação necessária após a atualização do status
      })
      .catch(error => {
      console.error(error);
      // Lide com erros, se houver algum
      });

    },
    fecharModalEdicao() {
      this.showEditModal = false;
      this.telefoneEditado = '';
    },
    fecharModalSucesso() {
      this.showSuccessModal = false;
    },
    mostrarClientesD() {
      this.showDesativModal = true;
      this.carregarClientesD();
    },
    ativarClienteD(clienteD) {
      const id = clienteD.id;

      const cli = {
        nomeCli: clienteD.nomeCli,
        cpfCli: clienteD.cpfCli,
        telCli: clienteD.telCli,
        statusCli: 'Ativo'
      }

      let usuarioLogado = localStorage.getItem('usuarioLogado');
      usuarioLogado = usuarioLogado.userLogado;

      const reg = {
        usuario: usuarioLogado,
        descricao: 'Ativou o cliente: ' + cli.nomeCli,
        status: 'Ativado'
      }

      // PUT para editar um cliente
      fetch(`http://localhost:3000/editarCliente/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cli)
      })
      .then(response => response.json())
      .then(data => {
      console.log(data.message);
      this.carregarClientesD();
      this.carregarClientes();

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
      this.clienteToDelete = null;
    },
    fecharModalDesativados() {
      this.showDesativModal = false;
    },
    mostrarFiltroClientes() {
      document.getElementById('filtro_clientes').style.display='block';
      },
    filtrarClientes() {
      this.clienteBusca = this.clienteBusca.toLowerCase();
      const nomeCapitalizado = this.clienteBusca.replace(/\b\w/g, match => match.toUpperCase());
      
      // Fazer uma requisição GET para obter os carrinhos cadastrados
     fetch('http://localhost:3000/clientes')
      .then(response => response.json())
      .then(data => {
        this.clientes = data
        .filter(cliente => cliente.cli_nome.includes(nomeCapitalizado))
        .map(cliente => ({
          id: cliente.cli_codigo,
          nomeCli: cliente.cli_nome,
          cpfCli: cliente.cli_cpf,
          telCli: cliente.cli_tel
        }));

      })
      .catch(error => {
        console.error('Erro ao carregar os clientes:', error);
      });
        
    },
  
  },
  
};
</script>
