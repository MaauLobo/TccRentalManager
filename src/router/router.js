import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/Login.vue'),
    },

    {
      path: '/cadastrocliente',
      component: () => import('../views/CadastroCliente.vue'),
      meta: { requiresFunci: true }
    },


    {
      path: '/aluguel',
      component: () => import('../views/Aluguel.vue'),
      meta: { requiresFunci: true }
    },


    {
      path: '/cadastrocarrinho',
      component: () => import('../views/CadastroCarrinho.vue'),
      meta: { requiresAdmin: true }
    },

    {
      path: '/carrinhos',
      component: () => import('../views/Carrinhos.vue'),
      meta: { requiresFunci: true }
    },

    {
      path: '/cadastroplanos',
      component: () => import('../views/CadastroPlano.vue'),
      meta: { requiresAdmin: true }
    },

    {
      path: '/planos',
      component: () => import('../views/Planos.vue'),
      meta: { requiresFunci: true }
    },

    {
      path: '/cadastrofuncionario',
      component: () => import('../views/CadastroFuncionario.vue'),
      meta: { requiresAdmin: true }
    },

    {
      path: '/clientes',
      component: () => import('../views/Clientes.vue'),
      meta: { requiresFunci: true }
    },

    {
      path: '/funcionarios',
      component: () => import('../views/Funcionarios.vue'),
      meta: { requiresAdmin: true }
    },
    
    {
      path: '/historico',
      component: () => import('../views/Historico.vue'),
      meta: { requiresAdmin: true }
    },
    {
      path: '/cadastroformapagamento',
      component: () => import('../views/CadastroPagamento.vue'),
      meta: { requiresAdmin: true }
    },

    {
      path: '/registros',
      component: () => import('../views/Registros.vue'),
      meta: { requiresFunci: true }
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (localStorage.getItem('usuarioLogado') === null) {
    localStorage.setItem('usuarioLogado', 'null')
  };
  if (localStorage.getItem('idLogado') === null) {
    localStorage.setItem('idLogado', 'null')
  };

  let usuarioLogado = localStorage.getItem('usuarioLogado');
 
  if (to.meta.requiresFunci && usuarioLogado === 'null') {
    localStorage.setItem('usuarioLogado', 'null');
    next('/'); // Redireciona para a página de login caso o usuário não seja Funcionario
  } else { 
    if (to.meta.requiresAdmin && usuarioLogado !== 'ADM') {
      localStorage.setItem('usuarioLogado', 'null');
      next('/'); // Redireciona para a página de login caso o usuário não seja 'ADM'
    } else {
      next(); // Permite o acesso à rota
    }
  }
});

export default router;