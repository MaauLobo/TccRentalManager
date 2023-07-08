<template>
  <Menu />

  <div class="container">
    <button class="btnVerDesativados" @click="mostrarFuncionariosD()">
      <i class="fa fa-ban fa-lg"></i>
    </button>
    <div class="funcionarios-tabela">
      <div class="cabecalho" id="cabecalho">
        <p>Nome</p>
        <p>Ações</p>
      </div>
      <div class="funcionarios">
        <table class="funcionarios-table">
          <tbody>
            <tr v-for="funcionario in funcionarios" :key="funcionario.id">
              <td>{{ funcionario.nomeFunci }}</td>
              <td>
                <button @click="editarFuncionario(funcionario)">Redefinir senha</button>
                <button @click="excluirFuncionarioConfirmation(funcionario)">Desativar</button>
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
      <p>Tem certeza de que deseja desativar o funcionário "{{ funcionarioToDelete?.nomeFunci }}"?</p>
      <div class="modal1-buttons">
        <button @click="excluirFuncionario()">Sim</button>
        <button @click="cancelarExclusaoFuncionario()">Não</button>
      </div>
    </div>
  </div>

  <!-- Modal de exclusão bem-sucedida -->
  <div class="modal1" v-if="showSuccessModal">
    <div class="modal1-content">
      <span class="close1" @click="fecharModalSucesso()">&times;</span>
      <h3>Desativamento bem-sucedido</h3>
      <p>O funcionário foi desativado com sucesso.</p>
    </div>
  </div>

  <!-- Modal de edição de senha -->
  <div class="modal2" v-if="showEditModal">
    <div class="modal2-content">
      <span class="close1" @click="fecharModalEdicao()">&times;</span> <!-- Botão de fechar (x) -->

      <h3>Redefinir Senha</h3>

      <div class="modal2-form">
        <label for="senha-atual">Senha Atual:</label>
        <input type="password" id="senha-atual" v-model="senhaAtual">

        <label for="nova-senha">Nova Senha:</label>
        <input type="password" id="nova-senha" v-model="novaSenha">

        <label for="confirmar-senha">Confirmar Nova Senha:</label>
        <input type="password" id="confirmar-senha" v-model="confirmarNovaSenha">
      </div>

      <div class="modal2-buttons">
        <button @click="atualizarSenha()">Redefinir</button>
      </div>
    </div>
  </div>

  <!-- Modal de desativados -->
  <div class="modal3" v-if="showDesativModal">
    <div class="modal3-content">
      <span class="close3" @click="fecharModalDesativados()">&times;</span>
      <h3>Funcionarios deativados</h3>
      
      <div class="funcionariosD-tabela">
        <div class="cabecalhoD" id="cabecalhoD">
          <p>Nome</p>
          <p>Ação</p>
        </div>
        <div class="funcionariosD">
          <table class="funcionariosD-table">
            <tbody>
              <tr v-for="funcionarioD in funcionariosD" :key="funcionarioD.id">
                <td>{{ funcionarioD.nomeFunci }}</td>
                <td>
                  <button @click="ativarFuncionarioD(funcionarioD)">Ativar</button>
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
import '../css/Funcionarios.css';

export default {
  components: {
    Menu,
  },
  data() {
    return {
      funcionarios: [], // Array para armazenar os funcionários cadastrados
      funcionariosD: [],
      showConfirmationModal: false, // Controla a exibição do modal de confirmação
      showSuccessModal: false, // Controla a exibição do modal de exclusão bem-sucedida
      showEditModal: false, // Controla a exibição do modal de edição de senha
      showDesativModal: false, 
      funcionarioToDelete: null, // Armazena o funcionário a ser excluído
      funcionarioToEdit: null, // Armazena o funcionário a ser editado
      senhaAtual: '', // Senha atual do funcionário
      novaSenha: '', // Nova senha do funcionário
      confirmarNovaSenha: '', // Confirmação da nova senha do funcionário
    };
  },
  mounted() {
    // Chamada para carregar os funcionários cadastrados ao carregar a página
    this.carregarFuncionarios();
  },
  methods: {
    carregarFuncionarios() {
      // Fazer uma requisição GET para obter os funcionários cadastrados
      fetch('http://localhost:3000/funcionarios')
        .then(response => response.json())
        .then(data => {
          this.funcionarios = data
          .filter(funcionario => funcionario.funci_status === 'Ativo')
          .map(funcionario => ({
            id: funcionario.funci_codigo,
            nomeFunci: funcionario.funci_nome,
            senhaFunci: funcionario.funci_senha,
            statusFunci: funcionario.funci_status
          }));
          this.funcionarios = this.funcionarios.reverse();

        })
        .catch(error => {
          console.error('Erro ao carregar os funcionários:', error);
        });
        
    },
    carregarFuncionariosD() {
      // Fazer uma requisição GET para obter os funcionários cadastrados
      fetch('http://localhost:3000/funcionarios')
        .then(response => response.json())
        .then(data => {
          this.funcionariosD = data
          .filter(funcionarioD => funcionarioD.funci_status === 'Inativo')
          .map(funcionarioD => ({
            id: funcionarioD.funci_codigo,
            nomeFunci: funcionarioD.funci_nome,
            senhaFunci: funcionarioD.funci_senha,
            statusFunci: funcionarioD.funci_status
          }));
        })
        .catch(error => {
          console.error('Erro ao carregar os funcionários:', error);
        });
    },
    excluirFuncionarioConfirmation(funcionario) {
      this.funcionarioToDelete = funcionario;
      this.showConfirmationModal = true;
    },
    excluirFuncionario() {
      const id = this.funcionarioToDelete.id;

      const funci = {
        nomeFunci: this.funcionarioToDelete.nomeFunci,
        senhaFunci: this.funcionarioToDelete.senhaFunci,
        statusFunci: 'Inativo'
      }

      let usuarioLogado = localStorage.getItem('usuarioLogado');
      usuarioLogado = usuarioLogado.userLogado;

      const reg = {
        usuario: usuarioLogado,
        descricao: 'Desativou o funcionario: ' + funci.nomeFunci,
        status: 'Desativado'
      }

      // PUT para editar um funcionario
      fetch(`http://localhost:3000/editarFuncionario/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(funci)
      })
      .then(response => response.json())
      .then(data => {
      console.log(data.message);
      this.carregarFuncionarios();

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
      this.funcionarioToDelete = null;
    },
    cancelarExclusaoFuncionario() {
      this.showConfirmationModal = false;
      this.funcionarioToDelete = null;
    },
    editarFuncionario(funcionario) {
      // Lógica para editar um funcionario
      this.funcionarioToEdit = funcionario;
      this.showEditModal = true;
    },
    atualizarSenha() {
      const id = this.funcionarioToEdit.id;
      const funcionario = this.funcionarios.find(f => f.id === id);

      // Verificar se a senha atual é correta
      if (this.senhaAtual === this.funcionarioToEdit.senhaFunci) {
        if(this.senhaTamanho) {
          if (this.senhasIguais) {
            const funci = {
              nomeFunci: funcionario.nomeFunci,
              senhaFunci: this.novaSenha,
              statusFunci: 'Ativo'
            }

            let usuarioLogado = localStorage.getItem('usuarioLogado');
            usuarioLogado = usuarioLogado.userLogado;

            const reg = {
              usuario: usuarioLogado,
              descricao: 'Redefiniu a senha do funcionario: ' + funci.nomeFunci,
              status: 'Editado'
            }

            // PUT para editar um funcionario
            fetch(`http://localhost:3000/editarFuncionario/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(funci)
            })
            .then(response => response.json())
            .then(data => {
              console.log(data.message);
              console.log('Senha redefinida com sucesso');
              this.carregarFuncionarios();
              this.senhaAtual = '';
              this.novaSenha = '';
              this.confirmarNovaSenha = '';

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
          } else {
            console.error('A nova senha e a confirmação da nova senha não coincidem');
          }
        } else {
          console.error('Nova senha tem que ter de 8 a 20 caracteres');
        }
      } else {
        console.error('A senha atual está incorreta');
      }
    },
    fecharModalEdicao() {
      this.showEditModal = false;
      this.funcionarioToEdit = null;
      this.senhaAtual = '';
      this.novaSenha = '';
      this.confirmarNovaSenha = '';
    },
    fecharModalSucesso() {
      this.showSuccessModal = false;
    },
    mostrarFuncionariosD() {
      this.showDesativModal = true;
      this.carregarFuncionariosD();
    },
    ativarFuncionarioD(funcionarioD) {
      const id = funcionarioD.id;

      const funci = {
        nomeFunci: funcionarioD.nomeFunci,
        senhaFunci: funcionarioD.senhaFunci,
        statusFunci: 'Ativo'
      }

      let usuarioLogado = localStorage.getItem('usuarioLogado');
      usuarioLogado = usuarioLogado.userLogado;

      const reg = {
        usuario: usuarioLogado,
        descricao: 'Ativou o funcionario: ' + funci.nomeFunci,
        status: 'Ativado'
      }

      // PUT para editar um funcionario
      fetch(`http://localhost:3000/editarFuncionario/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(funci)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);

        this.carregarFuncionariosD();
        this.carregarFuncionarios();

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

    },
    fecharModalDesativados() {
      this.showDesativModal = false;
    },

  },
  computed: {
    senhasIguais() {
      const senhasIguais = this.novaSenha === this.confirmarNovaSenha;

      return senhasIguais;
    },
    senhaTamanho() {
      const senhaTamanho = this.novaSenha.length < 21 && this.confirmarNovaSenha.length > 7;
      const senhaVazia = this.novaSenha.trim() != '' &&  this.confirmarNovaSenha.trim() != '';

      return senhaTamanho && senhaVazia;

    }
  }
};
</script>
