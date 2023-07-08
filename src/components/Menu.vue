<script>
import '../css/Menu.css';

export default {
  mounted() {
    this.tamanhoCheck();

    window.addEventListener('resize', this.tamanhoCheck);

    
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.tamanhoCheck);
  },
  methods: {
    carregarUserLogado() {
      return localStorage.getItem("usuarioLogado");
    },
    deslogar() {

      const logado = {
        idLogado: 'null',
        userLogado: 'null'
      }

      localStorage.setItem("usuarioLogado", logado);
    },
    toggleHamburger() {
      document.getElementById('hamburger').classList.toggle('is-active');

      const elemento = document.getElementById('menu');

      if (elemento.classList.contains('menu-active-mobile')) {
        elemento.classList.remove('menu-active-mobile');
        elemento.classList.add('menu-leave-mobile');
      } else {
        elemento.classList.remove('menu-leave-mobile');
        elemento.classList.add('menu-active-mobile');
      }
    },
    tamanhoCheck() {
      if (window.innerWidth > 911) {
        document.getElementById('menu').classList.remove('menu-leave-mobile');
      }
    },
    tamanhoCheckMobile() {
      if (window.innerWidth < 912) {
        document.getElementById('menu').classList.remove('menu-leave');
        document.getElementById('menu').classList.remove('menu-active');
        document.getElementById('menu').classList.remove('menu-leave-mobile');
      }
    },

    menuMouseEntre() {
      const element = document.getElementById('menu');
      element.classList.add('menu-active');
      
      // Remover a classe de animação após a conclusão da animação
      element.addEventListener('animationend', function() {
        element.classList.remove('menu-leave');
      });
    },

    menuMouseLeave() {
      const element = document.getElementById('menu');
      element.classList.add('menu-leave');
      
      // Remover a classe de animação após a conclusão da animação
      element.addEventListener('animationend', function() {
        element.classList.remove('menu-active');
      });
    },

    menuMouseEntreCheck() {
      if (window.innerWidth > 911) {
        this.menuMouseEntre();
      }
    },

    menuMouseLeaveCheck() {
      if (window.innerWidth > 911) {
        this.menuMouseLeave();
      }
    }

  },
};
</script>

<template>
    <div class="hamburger" id="hamburger" @click="toggleHamburger">
        <span class="linha"></span>
        <span class="linha"></span>
        <span class="linha"></span>
    </div>

    <nav class="main-menu" id="menu" @mouseenter="menuMouseEntreCheck" @mouseleave="menuMouseLeaveCheck">
        <div>
            <a class="logo" href="">
            </a>
        </div>
        <div class="settings"></div>
        <div class="scrollbar" id="style-1">

            <router-link class="router" :to="{ path: '/' }">
                <li>
                    <a @click="deslogar()">
                        <i class="fa fa-power-off fa-lg iconcolor"></i>
                        <span class="nav-text iconcolor">Logout</span>
                    </a>
                </li>
            </router-link>

            <router-link class="router" :to="{ path: '/aluguel' }">
                <li>
                    <a>
                        <i class="fa fa-clock-o fa-lg"></i>
                        <span class="nav-text">Aluguel</span>
                    </a>
                </li>
            </router-link>

            <router-link class="router" :to="{ path: '/cadastrofuncionario' }">
              <li v-if="carregarUserLogado() === 'ADM'">
                  <a>
                      <i class="fa fa-briefcase fa-lg"></i>
                      <span class="nav-text">Cadastro Funcionario</span>
                  </a>
              </li>
            </router-link>

            <router-link class="router" :to="{ path: '/funcionarios' }">
              <li v-if="carregarUserLogado() === 'ADM'">
                <a>
                    <i class="fa fa-briefcase fa-lg"></i>
                    <span class="nav-text">Funcionarios</span>
                </a>
              </li>
            </router-link>

            <router-link class="router" :to="{ path: '/cadastrocliente' }">
                <li>
                    <a>
                        <i class="fa fa-user fa-lg"></i>
                        <span class="nav-text">Cadastro Cliente</span>
                    </a>
                </li>
            </router-link>

            <router-link class="router" :to="{ path: '/clientes' }">
            <li>
                <a>
                    <i class="fa fa-users fa-lg"></i>
                    <span class="nav-text">Clientes</span>
                </a>
            </li>
          </router-link>

          <router-link class="router" :to="{ path: '/cadastrocarrinho' }">
              <li v-if="carregarUserLogado() === 'ADM'">
                  <a>
                      <i class="fa fa-truck fa-lg"></i>
                      <span class="nav-text cartext">Cadastro Brinquedos</span>
                  </a>
              </li>
          </router-link>

          <router-link class="router" :to="{ path: '/carrinhos' }">
            <li>
                <a>
                    <i class="fa fa-truck fa-lg"></i>
                    <span class="nav-text">Brinquedos</span>
                </a>
            </li>
          </router-link>

          <router-link class="router" :to="{ path: '/cadastroplanos' }">
              <li v-if="carregarUserLogado() === 'ADM'">
                  <a>
                      <i class="fa fa-dollar fa-lg"></i>
                      <span class="nav-text cartext">Cadastro Plano</span>
                  </a>
              </li>
          </router-link>

          <router-link class="router" :to="{ path: '/planos' }">
            <li>
                <a>
                    <i class="fa fa-money fa-lg"></i>
                    <span class="nav-text">Planos</span>
                </a>
            </li>
          </router-link>

          <router-link class="router" :to="{ path: '/historico' }">
            <li v-if="carregarUserLogado() === 'ADM'">
                <a>
                    <i class="fa fa-book fa-lg"></i>
                    <span class="nav-text cartext">Histórico</span>
                </a>
            </li>
        </router-link>

        <router-link class="router" :to="{ path: '/cadastroformapagamento' }">
          <li v-if="carregarUserLogado() === 'ADM'">
              <a>
                  <i class="fa fa-money fa-lg"></i>
                  <span class="nav-text">Formas</span>
              </a>
          </li>
        </router-link>

        <router-link class="router" :to="{ path: '/registros' }">
          <li>
              <a>
                  <i class="fa fa-money fa-lg"></i>
                  <span class="nav-text">Registros</span>
              </a>
          </li>
        </router-link>
        
      </div>
    </nav>
</template>
