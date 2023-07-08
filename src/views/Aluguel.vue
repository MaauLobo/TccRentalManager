<template>
  <Menu />

  <div class="container">

    <div class="modal" v-if="showModal">
    <div class="modal-content">
      <div class="multaETempo">
        <p>Multa:</p>
        <div class="editarMulta">
          <div class="editarMinutosMulta">
            <input v-model="multaTMin" type="text" placeholder="Minutos">
          </div>
          <div class="editarValorMulta">
            <input v-model="multaVMin" type="text" placeholder="Valor">
          </div>
        </div>
        <p>Tempo Livre:</p>
        <div class="editarTempo">
          <div class="editarMinutosTempo">
            <input v-model="tempoTMin" type="text" placeholder="Minutos">
          </div>
          <div class="editarValorTempo">
            <input v-model="tempoVMin" type="text" placeholder="Valor">
          </div>
        </div>
        <button @click="salvarMultaETempo">Salvar</button>
        <button class="fechar" @click="fecharModal">Fechar</button>
      </div>
    </div>
  </div>


  <button id="abrirmodal" @click="exibirModal">Tempo Livre/Multa</button>

    <button id="despausarTodos" @click="despausarTodos">
      <i class="fa fa-clock-o fa-lg"></i>
    </button>
    <div class="aluguel-box">
      <h2>Aluguel</h2>
      <!-- @submit.prevent="iniciarAluguel" -->
      <form class="form aluguel">
        <!--<div class="user-box">
          <input type="text" name="" v-model="nome" required class="input">
          <label>Nome do Cliente</label>
        </div>

        <div class="user-box">
          <input type="text" name="" v-model="modelo" required class="input">
          <label>Modelo</label>
        </div>-->

        <div class="user-box">
          <select class="select" v-model="nome" required>
            <option selected disabled value="">Cliente</option>
            <option v-for="cliente in clientes" :key="cliente.id" :value="cliente">
              {{ cliente.nomeCli }}
            </option>
          </select>
        </div>
        <div class="user-box">
          <select class="select" v-model="modelo" required >
            <option selected disabled value="">Brinquedo</option>
            <option v-for="carrinho in carrinhos" :key="carrinho.id" :value="carrinho">
              {{ carrinho.modeloCar }} - {{ carrinho.tipoCar }}
            </option>
          </select>
        </div>
        <div class="user-box">
          <select class="select" v-model="tempo">
            <option selected disabled value="">Plano</option>
            <option v-for="plano in planos" :key="plano.id" :value="plano">
              {{ plano.nomePlano }}
            </option>
          </select>
        </div>

        <button type="button" @click="iniciarAluguel(nome.id ,modelo.id, tempo.id, tempo.tempoPlano, tempo.valorPlano, tempo.statusPlano)" class="iniciarAluguel">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Iniciar Aluguel
        </button>
      </form>
    </div>
    <div class="tabela">
      <div class="cabecalho" id="cabecalho">
        <p>Nome do Cliente</p>
        <p>Brinquedo</p>
        <p>Tempo</p>
        <p>Valor</p>
        <p>Finalizar</p>
      </div>
      <div class="alugueis">
        <table v-if="alugueis.length > 0" class="table">
          <tbody>
            <tr v-for="(aluguel, index) in alugueis" :key="index">
              <td>{{ aluguel.nome.nomeCli }}</td>
              <td>{{ aluguel.modelo }}</td>
              <td>
                <template v-if="aluguel.timer > 0 || aluguel.tempoLivre == true">
                  <span>{{ aluguel.timerDisplay }}</span>
                  <span>{{ aluguel.timerMinutos }}</span>
                </template>
                <span v-else>Atrasados</span>
              </td>
              <td>
                R$ {{ aluguel.valor }}
              </td>
              <td>
                <button class="finalizar" @click="openModal(aluguel)">Finalizar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
  <modal ref="modal">
    <h3 slot="header">Tempo de Aluguel Expirado</h3>
    <p slot="content">O tempo de aluguel para o cliente {{ aluguelFinalizado.nome.nomeCli }} e carrinho {{ aluguelFinalizado.modelo }}
      chegou ao fim.</p>
  </modal>

  <modal ref="modal" class="column-modal">
    <h3 slot="header">{{ modalData.title }}</h3>
      <div slot="content" class="modal-content">

        <label for="paymentMethod">Método de Pagamento:</label>
       
        <select class="select" v-model="nomeFPag" required>
          <option selected disabled value="">Formas</option>
          <option v-for="forma in formas" :key="forma.id" :value="forma">
            {{ forma.nomeForm }}
          </option>
        </select>

        <button @click="adicionarNovaForma">Adicionar Nova Forma</button>

        <label for="value">Valor:</label>
        <input type="number" id="value" v-model="modalData.valor" placeholder="Valor">

        <label for="discount">Desconto:</label>
        <input type="number" id="discount" v-model="modalData.discount" placeholder="Desconto">

        <label for="penalty">Multa:</label>
        <input type="number" id="penalty" v-model="modalData.penalty" placeholder="Multa">
        <input v-model="adicionarMulta" type="checkbox" name="" id="">

        <label for="total">Valor Total:</label>
        <input type="number" id="total" v-model="modalData.total" placeholder="Valor Total" disabled>

        <div class="button-container">
          <button @click="receivePayment(this.alugReceb)">Finalizar</button>
          <!--<button @click="cancelPayment">Cancelar</button>-->
        </div>
      </div>
    </modal>

</template>
  
  
<script>
import Menu from '../components/Menu.vue';
import Modal from '../components/Modal.vue';
import '../css/Aluguel.css';

export default {
  components: {
    Menu,
    Modal,
  },

  data() {
    return {
      multaTMin: '',
      multaVMin: '',
      tempoTMin: '',
      tempoVMin: '',
      carrinhos: [],
      alugReceb: '',
      multaFormaValor: '',
      clientes: [],
      formas: [],
      planos: [],
      planosEM: [],
      planosM: [],
      recebimentos: [],
      nome: '',
      clienteRec: '',
      cliId: '',
      nomeFPag: '',
      modelo: '',
      tempo: '',
      adicionarMulta: true,
      tempoLivre: false,
      valor: '',
      novoStatus: '',
      stop: false,
      alugueis: [],
      idForma: [],
      recebimentos: [],
      timerIds: [], // IDs dos intervalos dos timers
      aluguelFinalizado: null, // Aluguel que chegou ao fim do tempo
      atualizarTimer: true, // Propriedade para controlar a atualização do timer na tabela
      modalData: {
      title: 'Recebimento',
      values: []},
      showModal: false, // Controla a exibição do modal
     
    };
  },

  methods: {
    
    exibirModal() {
      this.showModal = true;
    },

    fecharModal() {
      this.showModal = false;
    },
    
    
    
    adicionarNovaForma() {
      if (this.modalData.valor > 0 && this.nomeFPag != '') {
        if (this.modalData.valor == null) {
          this.modalData.valor = 0;
        }

        let total = 0;
        let totalS = this.modalData.total;
        totalS = totalS.toString()
        let totalVelho = parseFloat(totalS.replace(',', '.'))

        if (this.modalData.discount == null || this.modalData.discount < 0) {
          this.modalData.discount = 0;
        }

        totalVelho -= this.modalData.discount;

        if(this.adicionarMulta == true && this.adicionarMulta > 0) {
          let multaS = this.modalData.penalty.toString()
          total = this.modalData.total + parseFloat(multaS.replace(',', '.'));
          this.modalData.total = total
          this.modalData.penalty = 0;
        }

        this.modalData.total = total

        total = this.modalData.total - this.modalData.valor

        
        if (total >= 0) {
          this.modalData.total = total.toFixed(2)

          const receb = {
            forma: this.nomeFPag,
            valor: this.modalData.valor,
            desconto: this.modalData.discount,
            multa: this.modalData.penalty,
            total: this.modalData.total
          }

          let usuarioLogado = localStorage.getItem('usuarioLogado');

          const rec = {
            recebFunci: usuarioLogado,
            recebCli: this.cliId,
            recebPagamento: this.nomeFPag.nomeForm,
            recebValor: receb.valor,
            recebStatus: 'Recebido'
          }

          console.log(rec);
  
          const reg = {
            usuario: usuarioLogado,
            descricao: 'Recebeu do aluguel do cliente:' + this.clienteRec,
            status: 'Recebimento'
          }

          fetch('http://localhost:3000/recebimentos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(rec),
          })
          .then(response => {
            if (response.ok) {
              console.log('Recebimento cadastrada com sucesso');
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

              this.rec = {}

            } else {
              console.error('Erro ao cadastrar o Recebimento');
              // Lógica adicional aqui, se necessário
            }
          })
          .catch(error => {
            console.error('Erro ao realizar a requisição:', error);
            // Lógica adicional aqui, se necessário
          });

        } else {
          console.log('Pagamento inválido');
        }
      }

    },
    openModal(aluguel) {
      this.modalData.paymentMethods = []; // Limpa as formas de pagamento selecionadas
      this.modalData.values = []; // Limpa os valores digitados
      this.$refs.modal.isOpen = true; // Abre o modal

      console.log(aluguel.nome);
      console.log(aluguel);

      aluguel.stop = true;

      // Fazer uma requisição GET para obter os planos cadastrados
      fetch('http://localhost:3000/planos')
      .then(response => response.json())
      .then(data => {
        this.planosM = data
        .filter(plano => plano.plano_status === 'Multa')
        .map(plano => ({
          id: plano.plano_codigo,
          nomePlano: plano.plano_nome,
          tempoPlano: plano.plano_tempo,
          valorPlano: plano.plano_valor,
          statusPlano: plano.plano_status
        }));

        for (let i = 0; i < this.planosM.length; i++) {
          if (this.planosM[i].statusPlano === 'Multa') {
            this.multaFormaValor = this.planosM[i].valorPlano;
          }
        }

        let multaReceb = aluguel.multa / 60;

        multaReceb = this.multaFormaValor * multaReceb

        this.modalData.penalty = multaReceb.toFixed(2);
        this.modalData.total = aluguel.valor;

        this.clienteRec = aluguel.nome.nomeCli
        this.cliId = aluguel.nome.id
        this.idPlano = aluguel.idPlano;
        this.alugReceb = aluguel;
      
      })
      .catch(error => {
        console.error('Erro ao carregar os planos:', error);
      });

    },

    addPaymentMethod() {
      this.modalData.paymentMethods.push('');
      this.modalData.values.push('');
    },
    receivePayment(aluguel) {
      const index = this.alugueis.indexOf(aluguel);
      if (index !== -1) {
        this.alugueis.splice(index, 1);
      }
    },

    cancelPayment() {
      // Lógica para cancelar o pagamento
    },

    iniciarAluguel(idCliente, idModelo, idPlano, planoTempo, planoValor, statusPlano) {

      if (this.tempoValido) {
        if (this.brinquedoValido) {
          if (this.nomeValido) {

            this.tempo = planoTempo;
            this.valor = planoValor;
            this.idForma = idPlano;

            if (statusPlano == 'Livre') {
              this.tempoLivre = true;
              this.tempo = 0;
              this.valor = 0;
            }
            
            const dataAtual = new Date();

            const dataEstimada = new Date(dataAtual.getTime() + this.tempo * 60000);

            const hora = dataEstimada.getHours();
            const minutos = dataEstimada.getMinutes();
            const segundos = dataEstimada.getSeconds();

            let horaEstimada = {};
            
            const multa = 0;
            
            if (Number.isFinite(this.tempo) && !Number.isInteger(this.tempo)) {
              this.tempo = (this.tempo * 60) + 12;
            
              horaEstimada = {
                hora: hora,
                minutos: minutos,
                segundos: segundos + 12
              }
              
            } else {
              this.tempo = this.tempo * 60

              horaEstimada = {
                hora: hora,
                minutos: minutos,
                segundos: segundos
              }
            }

            const aluguel = {
              stop: this.stop,
              nome: this.nome,
              idForma: this.idForma,
              modelo: this.modelo.modeloCar + ' - ' + this.modelo.corCar,
              tempo: this.tempo,
              tempoPausado: 0,
              tempoEstimado: horaEstimada,
              tempoLivre: this.tempoLivre,
              multa: multa,
              minTempo: planoTempo,
              minValor: planoValor,
              timerMinutos: this.timerMinutos,
              contador: 0,
              valor: this.valor,
              timer: this.tempo, // Converter minutos para segundos
              timerDisplay: null, // Tempo formatado para exibição na tabela
              aluguelFinalizado: false, // Flag para controlar se o aviso já foi exibido
            };

            const idLogado = localStorage.getItem('idLogado');

            const alug = {
              funciFkAlug: idLogado,
              cliFkAlug: idCliente, 
              carFkAlug: idModelo, 
              tempoAlug: planoTempo,
              planoFkAlug: idPlano, 
              valorAlug: planoValor,
              statusAlug: 'Em Andamento'
            }

            let usuarioLogado = localStorage.getItem('usuarioLogado');

            let reg = {
                  usuario: usuarioLogado,
                  descricao: 'Novo aluguel iniciado '
                }

            for (let i = 0; i < this.clientes.length; i++) {
              if (this.clientes[i].id == idCliente) {
                reg = {
                  usuario: usuarioLogado,
                  descricao: 'Novo aluguel iniciado: Cliente: ' + this.clientes[i].nomeCli + ', Plano: ' + alug.tempoAlug,
                  status: 'Aluguel'
                }
                break;
              }
              
            }

            // Adiciona o aluguel à tabela
            this.alugueis.push(aluguel);

            // Salva os dados no Local Storage
            this.salvarDados();

            // Inicia o timer regressivo para o aluguel atual
            this.startTimer(aluguel);

            fetch('http://localhost:3000/alugueis', {

            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(alug),
            })
            .then(response => {
            if (response.ok) {
              console.log('Aluguel iniciado com sucesso');
              //location.reload();
              this.alug = {};

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

            } else {
              console.error('Erro ao cadastrar o cliente');
              // Lógica adicional aqui, se necessário
            }
            })
            .catch(error => {
            console.error('Erro ao realizar a requisição:', error);
            // Lógica adicional aqui, se necessário
            });


            // Limpar os campos do formulário após iniciar o aluguel
            this.nome = '';
            this.modelo = '';
            this.tempo = '';
            this.tempoLivre = false;

            this.carregarCarrinhos();
            this.carregarClientes();
            this.carregarPlanos();
          } else {
            console.log('Cliente Inválido');
          }
        } else {
          console.log('Brinquedo Inválido');
        }
      } else {
        console.log('Sem tempo definido');
      }
    },

    startTimer(aluguel) {
      aluguel.timerDisplay = this.formatTime(aluguel.timer); // Atualiza o tempo formatado para exibição
        const timerId = setInterval(() => {

          if (aluguel.stop == false) {
            if (aluguel.tempoLivre == true) {
              aluguel.timerMinutos = ' Minutos';
              aluguel.timer++;

              const valorMinutos = aluguel.timer / 60;

              const valor = valorMinutos * aluguel.minValor;

              aluguel.valor = valor.toFixed(2)

              aluguel.timerDisplay = this.formatTime(aluguel.timer);

              if (this.atualizarTimer) {
                this.$forceUpdate(); // Força a atualização da renderização do componente
              }    
          
            } else {  
              if (aluguel.timer > 0 && aluguel.multa == 0) {
                aluguel.timerMinutos = ' Minutos';
                aluguel.timer--;
                aluguel.timerDisplay = this.formatTime(aluguel.timer);

                if (this.atualizarTimer) {
                  this.$forceUpdate(); // Força a atualização da renderização do componente
                }
              } else {
                aluguel.timerMinutos = ' Minutos Atradados';
                aluguel.multa++;
                aluguel.timer = aluguel.multa;
                aluguel.timerDisplay = this.formatTime(aluguel.timer);

                if (this.atualizarTimer) {
                  this.$forceUpdate(); // Força a atualização da renderização do componente
                }

                /*clearInterval(timerId);
                this.timerIds = this.timerIds.filter(id => id !== timerId);

                if (!aluguel.aluguelFinalizado) {
                  this.aluguelFinalizado = aluguel;
                  this.$refs.modal.isOpen = true; // Abre o modal
                  this.removerAluguel(aluguel); // Remove o aluguel da tabela
                  aluguel.aluguelFinalizado = true; // Define a flag como true para indicar que o aviso foi exibido
                } */
              }
            }
          }
          else {
            aluguel.tempoPausado++;
          }
          // Salva os dados no Local Storage a cada atualização do timer
          this.salvarDados();
        }, 1000);
      
        // Armazena o ID do intervalo do timer
        this.timerIds.push(timerId);

        // Adiciona um listener para o evento visibilitychange apenas se for o primeiro aluguel
        if (this.timerIds.length === 1) {
          document.addEventListener('visibilitychange', this.handleVisibilityChange);
        }
    },

    handleVisibilityChange() {
      if (!this.atualizarTimer) {
        return;
      }

      if (document.visibilityState === 'hidden') {
        // Se a aba não está em foco, pausa todos os timers
        for (const timerId of this.timerIds) {
          clearInterval(timerId);
        }
        this.timerIds = [];
      } else {
        // Se a aba voltou para foco, reinicia os timers
        for (const aluguel of this.alugueis) {
          this.startTimer(aluguel);
        }
      }
    },

    formatTime(timeInSeconds) {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;

      const adjustedMinutes = parseInt(minutes, 10);

      return `${adjustedMinutes}:${seconds.toString().padStart(2, '0')}`;
    },

    salvarDados() {
      // Salva os dados da tabela no Local Storage
      localStorage.setItem('alugueis', JSON.stringify(this.alugueis));
    },

    carregarDados() {
      // Carrega os dados da tabela do Local Storage
      const dados = localStorage.getItem('alugueis');
      if (dados) {
        this.alugueis = JSON.parse(dados);
      }
    },

    removerAluguel(aluguel) {
      const index = this.alugueis.indexOf(aluguel);
      if (index !== -1) {
        this.alugueis.splice(index, 1);
      }
    },

    resetLocalStorage() {
      localStorage.removeItem('alugueis');
      this.alugueis = [];
    },

    carregarCarrinhos() {
      // Fazer uma requisição GET para obter os brinquedos cadastrados
      fetch('http://localhost:3000/brinquedos')
        .then(response => response.json())
          .then(data => {
            this.carrinhos = data
            //.filter(carrinho => carrinho.car_status === 'Livre')
            .map(carrinho => ({
              id: carrinho.car_codigo,
              modeloCar: carrinho.car_modelo,
              tipoCar: carrinho.car_tipo,
              corCar: carrinho.car_cor,
              statusCar: carrinho.car_status
            }));
        })
        .catch(error => {
          console.error('Erro ao carregar os carrinhos:', error);
        });
    },
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
        })
        .catch(error => {
          console.error('Erro ao carregar os clintes:', error);
        });
    },
    carregarPlanos() {
      // Fazer uma requisição GET para obter os planos cadastrados
      fetch('http://localhost:3000/planos')
      .then(response => response.json())
      .then(data => {
        this.planos = data
        .filter(plano => plano.plano_status === 'Ativo' || plano.plano_status === 'Livre')
        .map(plano => ({
          id: plano.plano_codigo,
          nomePlano: plano.plano_nome,
          tempoPlano: plano.plano_tempo,
          valorPlano: plano.plano_valor,
          statusPlano: plano.plano_status
        }));
      
      })
      .catch(error => {
        console.error('Erro ao carregar os planos:', error);
      });
    },
    carregarFormasDePagamento() {
      // Fazer uma requisição GET para obter os formas cadastrados
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
          
        })
        .catch(error => {
          console.error('Erro ao carregar as Formas de Pagamento:', error);
        });
    },

    despausarTodos() {

      var dataAtual = new Date(); // Obtém a data e hora atual do computador
      var horas = dataAtual.getHours(); // Obtém a hora atual
      var minutos = dataAtual.getMinutes(); // Obtém os minutos atuais
      var segundos = dataAtual.getSeconds(); // Obtém os segundos atuais

      var totalSegundos = (horas * 3600) + (minutos * 60) + segundos; // Calcula o total de segundos

      for (let i = 0; i < this.alugueis.length; i++) {
        const horasDadas = this.alugueis[i].tempoEstimado;
        this.alugueis[i].stop = false;

        var totalSegundosEstimado = (horasDadas.hora * 3600) + (horasDadas.minutos * 60) + horasDadas.segundos; // Calcula o total de segundos

        const tempoADescontar = totalSegundos - totalSegundosEstimado;

        console.log(this.alugueis[i].multa);
        console.log(this.alugueis[i].timer);
        console.log(tempoADescontar);
        console.log(horasDadas);
        console.log('--');
        

        if (this.alugueis[i].tempoLivre == false) {
          if (tempoADescontar >= 0) {
            this.alugueis[i].multa = tempoADescontar;
          } else {
            const minutosAMenos = (this.alugueis[i].timer + tempoADescontar) * - 1;
            this.alugueis[i].timer += minutosAMenos;
          } 
        } else {
          this.alugueis[i].timer = tempoADescontar;
        }
        console.log(this.alugueis[i].multa);
        console.log(this.alugueis[i].timer);
        console.log(tempoADescontar);
        console.log(horasDadas);
        console.log('-----------------------');

      }
        
      /*const dataAtual = new Date();

      const horas = dataAtual.getHours();
      const minutos = dataAtual.getMinutes();
      const segundos = dataAtual.getSeconds();

      
      for (let i = 0; i < this.alugueis.length; i++) {
        const horasDadas = this.alugueis[i].tempoEstimado;

        const horasDiminuicao = horasDadas.hora - horas;
        const minutosDiminuicao = horasDadas.minutos - minutos;
        const segundosDiminuicao = horasDadas.segundos - segundos;

        const converterHoras = horasDiminuicao * 60;
        const minutosPassados = (converterHoras + minutosDiminuicao);
        const converterMinutos = minutosPassados * 60 ;
        console.log(converterMinutos);
        console.log(this.alugueis[i].timer);

        if (minutosPassados < -0.55) {
          console.log('Atraso');
        }
      }*/
    },
    adicionarTempoLivre() {
      this.tempoLivre = true;
    },
    carregarEditEMulta() {
      // Fazer uma requisição GET para obter os planos cadastrados
      fetch('http://localhost:3000/planos')
      .then(response => response.json())
      .then(data => {
        this.planosEM = data
        .filter(plano => plano.plano_status === 'Livre' || plano.plano_status === 'Multa')
        .map(plano => ({
          id: plano.plano_codigo,
          nomePlano: plano.plano_nome,
          tempoPlano: plano.plano_tempo,
          valorPlano: plano.plano_valor,
          statusPlano: plano.plano_status
        }));

        for (let i = 0; i < this.planosEM.length; i++) {
          if (this.planosEM[i].plano_status === 'Livre') {
            this.tempoTMin = this.planosEM[i].plano_tempoPlano;
            this.tempoVMin = this.planosEM[i].plano_valorPlano;
          }
          
          if (this.planosEM[i].plano_status === 'Multa') {
            this.multaTMin = this.planosEM[i].plano_tempoPlano;
            this.multaVMin = this.planosEM[i].plano_valorPlano;
          }
        }

      })
      .catch(error => {
        console.error('Erro ao carregar os planos:', error);
      });
    },
    salvarMultaETempo() {

      // Fazer uma requisição GET para obter os planos cadastrados
      fetch('http://localhost:3000/planos')
      .then(response => response.json())
      .then(data => {
        this.planosEM = data
        .filter(plano => plano.plano_status === 'Livre' || plano.plano_status === 'Multa')
        .map(plano => ({
          id: plano.plano_codigo,
          nomePlano: plano.plano_nome,
          tempoPlano: plano.plano_tempo,
          valorPlano: plano.plano_valor,
          statusPlano: plano.plano_status
        }));

        let planoLivre = false;
        let planoMulta = false;

        for (let i = 0; i < this.planosEM.length; i++) {
          if (this.planosEM[i].plano_status === 'Livre') {
            this.tempoTMin = this.planosEM[i].plano_tempoPlano;
            this.tempoVMin = this.planosEM[i].plano_valorPlano;

            planoLivre = true;
          }
          
          if (this.planosEM[i].plano_status === 'Multa') {
            this.multaTMin = this.planosEM[i].plano_tempoPlano;
            this.multaVMin = this.planosEM[i].plano_valorPlano;

            planoMulta = true;
          }
        }
        console.log(this.tempoTMin);
        if (planoLivre == false) {
          if (this.tempoValidoL) {
            if (this.valorValidoL) {

              const plan = {
                nomePlano: 'Tempo Livre',
                tempoPlano: this.multaTMin,
                valorPlano: this.multaTMin,
                statusPlano: 'Livre',
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
              console.log('Valor inválido');
            }
          } else {
            console.log('Tempo inválido');
          }
        }

        if (planoMulta == false) {
          if (this.tempoValidoM) {
            if (this.valorValidoM) {

              const plan = {
                nomePlano: 'Multa',
                tempoPlano: this.multaTMin,
                valorPlano: this.multaVMin,
                statusPlano: 'Multa',
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
              console.log('Valor inválido');
            }
          } else {
            console.log('Tempo inválido');
          }
        }

      })
      .catch(error => {
        console.error('Erro ao carregar os planos:', error);
      });
    },
    
  },

  mounted() {
    
    // Carrega os dados da tabela ao montar o componente
    this.carregarDados();
    this.carregarCarrinhos();
    this.carregarClientes();
    this.carregarPlanos();
    this.carregarFormasDePagamento();
    this.carregarEditEMulta();

    // Inicia os timers
    for (const aluguel of this.alugueis) {
      this.startTimer(aluguel);
    }

  },

  computed: {
    tempoValido() {
      const planoVazio = this.tempo != "";
      
      return planoVazio;
    },
    nomeValido() {
      const nomeVerific = this.nome != '';
      
      return nomeVerific;
    },
    brinquedoValido() {
      const nomeVerific = this.modelo != '';
      
      return nomeVerific;
    },
    tempoValidoL() {
      const tempo = this.tempoTMin;

      if (tempo != null) {
        const tempoFloat = parseFloat(tempo);

        return !isNaN(tempoFloat) && tempoFloat > 0;

      } else {
        return false;
      }
      
    },
    tempoValidoM() {
      const tempo = this.multaTMin;

      if (tempo != null) {
        const tempoFloat = parseFloat(tempo);

        return !isNaN(tempoFloat) && tempoFloat > 0;

      } else {
        return false;
      }
      
    },
    valorValidoL() {
      const valor = this.tempoVMin;

      if (valor != null) {
        const valorFloat = parseFloat(valor);

        return !isNaN(valorFloat) && valorFloat > 0;

      } else {

      }
    },
    valorValidoM() {
      const valor = this.multaVMin;

      if (valor != null) {
        const valorFloat = parseFloat(valor);

        return !isNaN(valorFloat) && valorFloat > 0;

      } else {

      }
    },
  },

  beforeDestroy() {
    // Limpa os intervalos dos timers e remove o listener do evento visibilitychange quando o componente for destruído
    for (const timerId of this.timerIds) {
      clearInterval(timerId);
    }
    this.timerIds = [];
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);

    // Salva os dados no Local Storage ao sair do componente
    this.salvarDados();
  },

  watch: {
    '$refs.modal.isOpen': function (isOpen) {
      this.atualizarTimer = !isOpen;
    }
  },

};

</script>